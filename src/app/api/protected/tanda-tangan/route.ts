import { Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { qrApi } from '@/lib/qrcode-api'
import {
    bacaBerkas,
    berkasAda,
    simpanBerkasDiPath,
} from '@/lib/storage'
import { sisuratApi } from '@/lib/sisurat-api'
import { stampQrToSkPdf } from '@/lib/sk-signature'
import { withApiAuth } from '@/middlewares/api-auth'
import { getSession } from '@/provider/api'
import { ResponseTandaTanganSkType } from '@/types/TandaTanganTypes'
import { Hono } from 'hono'
import { cookies } from 'next/headers'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/tanda-tangan')
const BASE_URL = process.env.BACKEND_API_BASE_URL

app.use('*', withApiAuth)

/**
 * MODUL DINONAKTIFKAN.
 *
 * Penandatanganan SK hasil asesmen adalah kewenangan Sisurat: nomor surat dan
 * QR terbit dari sana (doc/integrasi-rpl-sisurat.md §1). Kode di bawah
 * dipertahankan sebagai rujukan, tetapi seluruh permintaan ditolak 410 supaya
 * alur lama tidak dapat dipanggil lewat URL sekalipun menunya sudah dicabut.
 */
app.use('*', async (c) =>
    c.json(
        {
            data: [],
            status: 'error',
            message:
                'Penandatanganan SK dipindahkan ke Sisurat ITI. Pantau statusnya dari menu Sk. Rektor.',
        },
        { status: 410 }
    )
)

const STATUS_MENUNGGU = 'Penandatanganan SK'

// Penandatanganan SK hanya boleh dilakukan oleh Rektor.
const isRektor = (roles?: { Name: string }[]) =>
    (roles ?? []).some((r) => r.Name.toLowerCase() === 'rektor')

app.get('/', async (c) => {
    const session = await getSession()

    if (!session) {
        return c.json(
            { data: [], status: 'error', message: 'Unauthorized' },
            { status: 401 }
        )
    }

    if (!isRektor(session.user.roles)) {
        return c.json(
            {
                data: [],
                status: 'error',
                message: 'Hanya Rektor yang dapat mengakses penandatanganan SK',
            },
            { status: 403 }
        )
    }

    const file = c.req.query('file') || ''
    const jenis = c.req.query('jenis') || ''

    // Daftar pejabat dari QR Code Generator (endpoint publik, tanpa token).
    if (jenis === 'officials') {
        try {
            const officials = await qrApi.officials(
                c.req.query('search')
                    ? { search: c.req.query('search') as string }
                    : undefined
            )
            return c.json({ status: 'success', message: 'success', data: officials })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'error'
            return c.json(
                { status: 'error', message, data: [] },
                { status: 502 }
            )
        }
    }

    // Preview berkas SK.
    if (file !== '') {
        const sk = await prisma.skRektor.findFirst({
            where: { NamaFile: file },
            select: { PathFile: true, NamaDokumen: true },
        })

        if (!sk || !(await berkasAda(sk.PathFile))) {
            return c.json(
                {
                    data: [],
                    status: 'error',
                    message: 'file not found in storage',
                },
                { status: 404 }
            )
        }

        return c.body(await bacaBerkas(sk.PathFile), 200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${sk.NamaDokumen}"`,
        })
    }

    const page = parseInt(c.req.query('page') || '1', 10)
    const limit = parseInt(c.req.query('limit') || '10', 10)
    const search = c.req.query('search') || ''

    // Satu mahasiswa bisa memiliki dua SK (Perolehan & Transfer SKS); tiap SK
    // ditandatangani sendiri karena QR dibuat per dokumen.
    const where: Prisma.SkRektorMahasiswaWhereInput = {
        SkRektor: {
            JenisSkAsessmen: { not: null },
            Disetujui: true,
            Ditandatangani: false,
        },
        Pendaftaran: {
            StatusMahasiswaAssesmentHistory: {
                some: {
                    Aktif: true,
                    StatusMahasiswaAssesment: { NamaStatus: STATUS_MENUNGGU },
                },
            },
            ...(search
                ? {
                    OR: [
                        {
                            KodePendaftar: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                        {
                            Mahasiswa: {
                                User: {
                                    Nama: {
                                        contains: search,
                                        mode: 'insensitive',
                                    },
                                },
                            },
                        },
                    ],
                }
                : {}),
        },
    }

    const [data, total] = await Promise.all([
        prisma.skRektorMahasiswa.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            select: {
                PendaftaranId: true,
                SkRektor: {
                    select: {
                        SkRektorId: true,
                        JenisSkAsessmen: true,
                        NamaSk: true,
                        NomorSk: true,
                        TahunSk: true,
                        NamaFile: true,
                        NamaDokumen: true,
                        Ditandatangani: true,
                        TandaTanganPada: true,
                        QrVerifyUrl: true,
                        QrOfficialNama: true,
                    },
                },
                Pendaftaran: {
                    select: {
                        KodePendaftar: true,
                        MataKuliahMahasiswa: {
                            select: { MataKuliahMahasiswaId: true },
                        },
                        Mahasiswa: {
                            select: { User: { select: { Nama: true } } },
                        },
                        DaftarUlang: {
                            select: {
                                ProgramStudi: { select: { Nama: true } },
                            },
                        },
                    },
                },
            },
        }),
        prisma.skRektorMahasiswa.count({ where }),
    ])

    const responses: ResponseTandaTanganSkType[] = data.map((item) => ({
        PendaftaranId: item.PendaftaranId,
        KodePendaftar: item.Pendaftaran.KodePendaftar,
        NamaMahasiswa: item.Pendaftaran.Mahasiswa.User.Nama,
        NamaProgramStudi:
            item.Pendaftaran.DaftarUlang[0]?.ProgramStudi.Nama ?? '',
        TotalMk: item.Pendaftaran.MataKuliahMahasiswa.length,
        Sk: {
            SkRektorId: item.SkRektor.SkRektorId,
            JenisSkAsessmen: item.SkRektor.JenisSkAsessmen ?? 'PEROLEHAN_SKS',
            NamaSk: item.SkRektor.NamaSk,
            NomorSk: item.SkRektor.NomorSk,
            TahunSk: item.SkRektor.TahunSk,
            NamaFile: item.SkRektor.NamaFile,
            NamaDokumen: item.SkRektor.NamaDokumen,
            Ditandatangani: item.SkRektor.Ditandatangani,
            TandaTanganPada: item.SkRektor.TandaTanganPada,
            QrVerifyUrl: item.SkRektor.QrVerifyUrl ?? '',
            QrOfficialNama: item.SkRektor.QrOfficialNama ?? '',
        },
    }))

    return c.json<{
        data: ResponseTandaTanganSkType[]
        page: number
        limit: number
        totalElement: number
        totalPage: number
        isFirst: boolean
        isLast: boolean
        hasNext: boolean
        hasPrevious: boolean
    }>({
        page: page,
        limit: limit,
        data: responses,
        totalElement: total,
        totalPage: Math.ceil(total / limit),
        isFirst: page === 1,
        isLast:
            page === Math.ceil(total / limit) || Math.ceil(total / limit) === 0,
        hasNext: page < Math.ceil(total / limit),
        hasPrevious: page > 1,
    })
})

app.post('/', async (c) => {
    const session = await getSession()

    if (!session) {
        return c.json(
            { data: [], status: 'error', message: 'Unauthorized' },
            { status: 401 }
        )
    }

    if (!isRektor(session.user.roles)) {
        return c.json(
            {
                data: [],
                status: 'error',
                message: 'Hanya Rektor yang dapat menandatangani SK',
            },
            { status: 403 }
        )
    }

    const body: {
        PendaftaranId: string
        SkRektorId: string
        OfficialId: number
        TanggalSk?: string
    } = await c.req.json()

    if (!body.PendaftaranId || !body.SkRektorId) {
        return c.json(
            {
                data: [],
                status: 'error',
                message: 'PendaftaranId dan SkRektorId perlu diisi',
            },
            { status: 400 }
        )
    }

    if (!body.OfficialId) {
        return c.json(
            {
                data: [],
                status: 'error',
                message: 'Pejabat penandatangan perlu dipilih',
            },
            { status: 400 }
        )
    }

    const skMahasiswa = await prisma.skRektorMahasiswa.findFirst({
        where: {
            PendaftaranId: body.PendaftaranId,
            SkRektorId: body.SkRektorId,
        },
        select: {
            SkRektor: {
                select: {
                    SkRektorId: true,
                    NamaSk: true,
                    NomorSk: true,
                    NamaFile: true,
                    NamaDokumen: true,
                    PathFile: true,
                    Disetujui: true,
                    Ditandatangani: true,
                    NomorSuratSisurat: true,
                    JenisSkAsessmen: true,
                },
            },
        },
    })

    if (!skMahasiswa) {
        return c.json(
            {
                data: [],
                status: 'error',
                message: 'SK untuk pendaftaran ini tidak ditemukan',
            },
            { status: 404 }
        )
    }

    const sk = skMahasiswa.SkRektor

    if (!sk.Disetujui) {
        return c.json(
            {
                data: [],
                status: 'error',
                message: 'SK ini belum disetujui Wakil Rektor',
            },
            { status: 409 }
        )
    }

    if (sk.Ditandatangani) {
        return c.json(
            {
                data: [],
                status: 'error',
                message: 'SK ini sudah ditandatangani dan tidak dapat diubah',
            },
            { status: 409 }
        )
    }

    if (!sk.NamaFile.toLowerCase().endsWith('.pdf')) {
        return c.json(
            {
                data: [],
                status: 'error',
                message:
                    'Hanya SK berformat PDF yang dapat ditandatangani. Minta Akademik mengunggah ulang dalam bentuk PDF.',
            },
            { status: 400 }
        )
    }

    const tanggalSk = body.TanggalSk || new Date().toISOString().slice(0, 10)

    // 1) Nomor surat resmi diambil dari Sisurat lebih dulu — QR dibuat memakai
    //    nomor ini. Deret Sisurat tidak dapat dibatalkan, jadi nomor yang sudah
    //    pernah terbit untuk SK ini dipakai ulang bila penandatanganan diulang.
    let nomorSurat = sk.NomorSuratSisurat ?? ''

    if (!nomorSurat) {
        try {
            const hasil = await sisuratApi.mintNomorSurat({
                date: tanggalSk,
                externalReference: sk.SkRektorId,
                note: `SK Hasil Asessmen RPL — ${sk.NamaSk}`,
            })
            nomorSurat = hasil.nomorSurat

            // Segera disimpan agar nomor tidak hangus bila langkah berikutnya gagal.
            await prisma.skRektor.update({
                where: { SkRektorId: sk.SkRektorId },
                data: {
                    NomorSuratSisurat: nomorSurat,
                    NomorSuratPada: new Date(),
                    NomorSk: nomorSurat,
                    UpdatedAt: new Date(),
                },
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'error'
            return c.json(
                {
                    data: [],
                    status: 'error',
                    message:
                        'Gagal mendapatkan nomor surat dari Sisurat: ' + message,
                },
                { status: 502 }
            )
        }
    }

    // 2) QR tanda tangan dibuat dengan nomor surat resmi tersebut.
    let qrDocument
    try {
        qrDocument = await qrApi.createDocument({
            official_id: Number(body.OfficialId),
            doc_number: nomorSurat,
            doc_title: sk.NamaSk,
            doc_date: tanggalSk,
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'error'
        return c.json(
            {
                data: [],
                status: 'error',
                message: 'Gagal membuat QR tanda tangan: ' + message,
            },
            { status: 502 }
        )
    }

    // 3) SK dirender ulang dari template memakai nomor surat resmi, supaya nomor
    //    tercetak pada badan dokumen — bukan sekadar tempelan — lalu QR
    //    ditempelkan ke hasil render tersebut.
    let pdfBernomor: Buffer
    try {
        const cookieHeader = (await cookies()).toString()
        const params = new URLSearchParams({
            _id: body.PendaftaranId,
            _t: 'sk',
            _n: nomorSurat,
            _j:
                sk.JenisSkAsessmen === 'TRANSFER_SKS'
                    ? 'TRANSFER KREDIT'
                    : 'PEROLEHAN KREDIT',
        })

        const pdfRes = await fetch(
            `${BASE_URL}/api/protected/generate-pdf?${params.toString()}`,
            { headers: { cookie: cookieHeader } }
        )

        if (!pdfRes.ok) throw new Error(`generate-pdf HTTP ${pdfRes.status}`)

        pdfBernomor = Buffer.from(new Uint8Array(await pdfRes.arrayBuffer()))
    } catch (error) {
        const message = error instanceof Error ? error.message : 'error'
        return c.json(
            {
                data: [],
                status: 'error',
                message:
                    'Gagal merender SK dengan nomor surat resmi: ' + message,
            },
            { status: 502 }
        )
    }

    // 4) QR tanda tangan ditempel ke dokumen bernomor resmi.
    let signedPdf: Uint8Array
    try {
        signedPdf = await stampQrToSkPdf(pdfBernomor, {
            qrcodeBase64: qrDocument.qrcode_base64,
            nomorSk: nomorSurat,
            officialName: qrDocument.official_name,
            verifyUrl: qrDocument.verify_url,
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'error'
        return c.json(
            {
                data: [],
                status: 'error',
                message: 'Gagal menempelkan QR ke dokumen SK: ' + message,
            },
            { status: 500 }
        )
    }

    // Berkas bertanda tangan menimpa berkas SK di penyimpanan.
    await simpanBerkasDiPath(sk.PathFile, Buffer.from(signedPdf))

    await prisma.skRektor.update({
        where: { SkRektorId: sk.SkRektorId },
        data: {
            NomorSk: nomorSurat,
            Ditandatangani: true,
            TandaTanganPada: new Date(),
            TandaTanganOleh: session.user.id,
            QrToken: qrDocument.token,
            QrVerifyUrl: qrDocument.verify_url,
            QrDocumentId: qrDocument.id,
            QrOfficialId: qrDocument.official_id,
            QrOfficialNama: qrDocument.official_name,
            QrOfficialJabatan: qrDocument.official_position,
            UpdatedAt: new Date(),
        },
    })

    // Berkas baru lanjut ke sinkronisasi setelah seluruh SK mahasiswa itu
    // ditandatangani.
    const belumDitandatangani = await prisma.skRektorMahasiswa.count({
        where: {
            PendaftaranId: body.PendaftaranId,
            SkRektor: {
                JenisSkAsessmen: { not: null },
                Ditandatangani: false,
            },
        },
    })

    return c.json({
        status: 'success',
        message: 'SK berhasil ditandatangani',
        data: {
            VerifyUrl: qrDocument.verify_url,
            QrcodeBase64: qrDocument.qrcode_base64,
            OfficialNama: qrDocument.official_name,
            OfficialJabatan: qrDocument.official_position,
            NomorSurat: nomorSurat,
            SemuaDitandatangani: belumDitandatangani === 0,
            SisaBelumDitandatangani: belumDitandatangani,
        },
    })
})

export const GET = handle(app)
export const POST = handle(app)
