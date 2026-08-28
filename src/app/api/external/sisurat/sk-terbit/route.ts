import { prisma } from '@/lib/prisma'
import { hapusBerkas, simpanBerkas } from '@/lib/storage'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { timingSafeEqual } from 'node:crypto'
import { v4 as uuidv4 } from 'uuid'

/**
 * Titik masuk dari Sisurat: mengirimkan SK yang sudah selesai sebagai satu
 * berkas PDF, beserta nomor surat dan data tanda tangannya.
 *
 * Endpoint ini melengkapi pemantauan yang sudah ada. RPL menarik status secara
 * berkala, tetapi berkas final hanya ada di Sisurat; dengan panggilan ini
 * Sisurat mendorongnya sekali saat surat terbit, lalu SK langsung berstatus
 * terbit pada menu Sk. Rektor dan siap dipublikasikan ke mahasiswa.
 *
 * Spesifikasi lengkap: doc/panduan-sisurat-kirim-sk-terbit.md
 */

const app = new Hono().basePath('/api/external/sisurat/sk-terbit')

/** Batas ukuran berkas SK yang diterima. */
const MAKS_BYTE = 20 * 1024 * 1024

type PayloadSkTerbit = {
    letterId?: string
    externalReference?: string
    nomorSurat?: string
    nomorSuratTerbitPada?: string
    status?: string
    currentStepKey?: string
    signature?: {
        officialName?: string | null
        officialPosition?: string | null
        officialUnit?: string | null
        verifyUrl?: string | null
        signedAt?: string | null
    } | null
}

/** Pembandingan token yang tidak membocorkan panjang kecocokan. */
function tokenCocok(diberikan: string, seharusnya: string): boolean {
    const a = Buffer.from(diberikan)
    const b = Buffer.from(seharusnya)
    return a.length === b.length && timingSafeEqual(a, b)
}

app.post('/', async (c) => {
    const rahasia = process.env.SISURAT_CALLBACK_TOKEN ?? ''

    // Tanpa token yang dikonfigurasi, endpoint sengaja tidak dilayani supaya
    // tidak pernah terbuka tanpa pengamanan.
    if (!rahasia) {
        return c.json(
            {
                status: 'error',
                message:
                    'Endpoint belum diaktifkan: SISURAT_CALLBACK_TOKEN belum diatur pada server RPL',
                data: [],
            },
            { status: 503 }
        )
    }

    const dikirim =
        c.req.header('X-Sisurat-Token') ??
        (c.req.header('Authorization') ?? '').replace(/^Bearer\s+/i, '')

    if (!dikirim || !tokenCocok(dikirim, rahasia)) {
        return c.json(
            { status: 'error', message: 'Token tidak valid', data: [] },
            { status: 401 }
        )
    }

    let form: FormData
    try {
        form = await c.req.formData()
    } catch {
        return c.json(
            {
                status: 'error',
                message: 'Permintaan harus multipart/form-data',
                data: [],
            },
            { status: 400 }
        )
    }

    const mentah = form.get('payload')
    if (typeof mentah !== 'string' || mentah.trim() === '') {
        return c.json(
            {
                status: 'error',
                message: "Field 'payload' (JSON) wajib diisi",
                data: [],
            },
            { status: 400 }
        )
    }

    let payload: PayloadSkTerbit
    try {
        payload = JSON.parse(mentah)
    } catch {
        return c.json(
            { status: 'error', message: "Field 'payload' bukan JSON yang sah", data: [] },
            { status: 400 }
        )
    }

    if (!payload.letterId && !payload.externalReference) {
        return c.json(
            {
                status: 'error',
                message: 'letterId atau externalReference wajib diisi',
                data: [],
            },
            { status: 400 }
        )
    }

    const berkas = form.get('file')
    if (!(berkas instanceof File)) {
        return c.json(
            { status: 'error', message: "Field 'file' (PDF) wajib diisi", data: [] },
            { status: 400 }
        )
    }

    const isi = Buffer.from(new Uint8Array(await berkas.arrayBuffer()))

    if (isi.byteLength === 0 || isi.byteLength > MAKS_BYTE) {
        return c.json(
            {
                status: 'error',
                message: `Ukuran berkas tidak wajar (maksimal ${MAKS_BYTE / 1024 / 1024} MB)`,
                data: [],
            },
            { status: 400 }
        )
    }

    if (isi.subarray(0, 5).toString('latin1') !== '%PDF-') {
        return c.json(
            { status: 'error', message: 'Berkas harus PDF', data: [] },
            { status: 400 }
        )
    }

    // Surat dicari lewat letterId yang dicatat saat inisialisasi; bila Sisurat
    // hanya mengirim externalReference, dipakai pola RPL-<PendaftaranId>-<Jenis>.
    const dariRef = (payload.externalReference ?? '').match(
        /^RPL-(.+)-(PEROLEHAN_SKS|TRANSFER_SKS)$/
    )

    if (!payload.letterId && !dariRef) {
        return c.json(
            {
                status: 'error',
                message:
                    'externalReference tidak dikenali. Pakai pola RPL-<PendaftaranId>-<PEROLEHAN_SKS|TRANSFER_SKS>, atau sertakan letterId.',
                data: [],
            },
            { status: 400 }
        )
    }

    const kriteria = payload.letterId
        ? { SkRektor: { SisuratLetterId: payload.letterId } }
        : {
            PendaftaranId: dariRef![1],
            SkRektor: {
                JenisSkAsessmen: dariRef![2] as
                    | 'PEROLEHAN_SKS'
                    | 'TRANSFER_SKS',
            },
        }

    // Satu pendaftaran dapat memiliki lebih dari satu SK berjenis sama bila
    // pernah dikirim ulang. Tanpa letterId, kecocokannya harus tunggal supaya
    // berkas final tidak menimpa SK yang keliru.
    if (!payload.letterId) {
        const jumlah = await prisma.skRektorMahasiswa.count({ where: kriteria })
        if (jumlah > 1) {
            return c.json(
                {
                    status: 'error',
                    message: `Ada ${jumlah} SK dengan referensi itu di RPL. Sertakan letterId agar berkas final tidak menimpa SK yang keliru.`,
                    data: [],
                },
                { status: 409 }
            )
        }
    }

    const tautan = await prisma.skRektorMahasiswa.findFirst({
        where: kriteria,
        select: {
            PendaftaranId: true,
            SkRektor: {
                select: {
                    SkRektorId: true,
                    NamaSk: true,
                    NamaFile: true,
                    PathFile: true,
                    PathFileFinal: true,
                    JenisSkAsessmen: true,
                },
            },
            Pendaftaran: {
                select: { Mahasiswa: { select: { UserId: true } } },
            },
        },
    })

    if (!tautan) {
        return c.json(
            {
                status: 'error',
                message:
                    'SK tidak ditemukan di RPL. Pastikan surat ini memang diinisialisasi dari Sistem RPL.',
                data: [],
            },
            { status: 404 }
        )
    }

    // SK final disimpan sebagai berkas tersendiri di /storage — lampiran hasil
    // asesmen yang dirender RPL sengaja tidak ditimpa, karena keduanya dokumen
    // yang berbeda dan sama-sama perlu dapat dibuka.
    const namaFileFinal = `${uuidv4()}.pdf`
    const pathFileFinal = await simpanBerkas(
        tautan.Pendaftaran.Mahasiswa.UserId,
        'sk-final',
        namaFileFinal,
        isi
    )

    // Berkas final sebelumnya (bila surat pernah dikirim ulang) dibuang supaya
    // tidak menumpuk tanpa rujukan.
    if (tautan.SkRektor.PathFileFinal) {
        await hapusBerkas(tautan.SkRektor.PathFileFinal).catch(() => { })
    }

    const ttd = payload.signature ?? null
    const nomor = (payload.nomorSurat ?? '').trim()

    const sk = await prisma.skRektor.update({
        where: { SkRektorId: tautan.SkRektor.SkRektorId },
        data: {
            PathFileFinal: pathFileFinal,
            NamaFileFinal: namaFileFinal,
            SkFinalDiterimaPada: new Date(),
            ...(nomor
                ? {
                    NomorSk: nomor,
                    NomorSuratSisurat: nomor,
                    NomorSuratPada: payload.nomorSuratTerbitPada
                        ? new Date(payload.nomorSuratTerbitPada)
                        : new Date(),
                }
                : {}),
            SisuratStatus: payload.status ?? 'COMPLETED',
            SisuratStepKey: payload.currentStepKey ?? 'ARCHIVE',
            // Berkas yang dikirim Sisurat adalah SK final yang sudah bertanda
            // tangan, jadi tidak ada QR yang perlu ditempel lagi di sini.
            Ditandatangani: true,
            TandaTanganPada: ttd?.signedAt ? new Date(ttd.signedAt) : new Date(),
            TandaTanganOleh: ttd?.officialName ?? null,
            QrVerifyUrl: ttd?.verifyUrl ?? null,
            QrOfficialNama: ttd?.officialName ?? null,
            QrOfficialJabatan: ttd?.officialPosition ?? null,
            Catatan: '',
            UpdatedAt: new Date(),
        },
        select: {
            SkRektorId: true,
            NamaSk: true,
            NomorSk: true,
            NamaFile: true,
            NamaFileFinal: true,
            Ditandatangani: true,
            Dipublikasikan: true,
        },
    })

    return c.json({
        status: 'success',
        message: 'SK final diterima dan ditandai terbit',
        data: {
            SkRektorId: sk.SkRektorId,
            PendaftaranId: tautan.PendaftaranId,
            JenisSkAsessmen: tautan.SkRektor.JenisSkAsessmen,
            NamaSk: sk.NamaSk,
            NomorSk: sk.NomorSk,
            NamaFile: sk.NamaFile,
            NamaFileFinal: sk.NamaFileFinal,
            Ditandatangani: sk.Ditandatangani,
            Dipublikasikan: sk.Dipublikasikan,
            UkuranBerkas: isi.byteLength,
        },
    })
})

export const POST = handle(app)
