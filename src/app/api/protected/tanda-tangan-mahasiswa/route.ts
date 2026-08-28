import { prisma } from '@/lib/prisma'
import { bacaBerkas, berkasAda, hapusBerkas, simpanBerkas } from '@/lib/storage'
import { withApiAuth } from '@/middlewares/api-auth'
import { getSession } from '@/provider/api'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { v4 as uuidv4 } from 'uuid'

/**
 * Tanda tangan mahasiswa untuk Formulir Evaluasi Diri (Form 03).
 *
 * Mahasiswa menandatanganinya di halaman finalisasi mata kuliah sebelum
 * berkasnya dilanjutkan ke penunjukan asesor. Gambarnya disimpan sebagai PNG di
 * folder /storage milik pengguna, lalu disematkan ke Form 03 saat PDF dirender.
 */

const app = new Hono().basePath('/api/protected/tanda-tangan-mahasiswa')

app.use('*', withApiAuth)

/**
 * Mengganti tanda tangan hanya boleh selama berkas masih di tangan mahasiswa —
 * setelah dikirim ke asesor, Form 03 yang sudah ditandatangani tidak boleh
 * berubah lagi.
 */
const STATUS_BOLEH_GANTI = ['Pengisian Data Diri', 'Asessmen Mandiri']

/**
 * Membubuhkan tanda tangan **pertama kali** masih dibuka sampai sebelum SK
 * diterbitkan. Tanpa kelonggaran ini, berkas yang terlanjur maju tanpa tanda
 * tangan akan selamanya memiliki Form 03 yang belum ditandatangani.
 */
const STATUS_BOLEH_TTD_PERTAMA = [
    ...STATUS_BOLEH_GANTI,
    'Penunjukan Asesor',
    'Persetujuan Penunjukan Asesor',
    'Asessmen Oleh Asesor',
    'Rekapitulasi Asessmen',
    'Sanggahan',
    'Hasil Final Asessmen',
]

/** Apakah tanda tangan boleh dibubuhkan/diganti pada status saat ini. */
const bolehTandaTangan = (status: string, sudahAda: boolean) =>
    sudahAda
        ? STATUS_BOLEH_GANTI.includes(status)
        : STATUS_BOLEH_TTD_PERTAMA.includes(status)

const MAKS_BYTE = 1_500_000

/** Memastikan pendaftaran memang milik pengguna yang sedang masuk. */
async function pendaftaranMilikSaya(pendaftaranId: string, userId: string) {
    return prisma.pendaftaran.findFirst({
        where: { PendaftaranId: pendaftaranId, Mahasiswa: { UserId: userId } },
        select: {
            PendaftaranId: true,
            TandaTanganPath: true,
            TandaTanganPada: true,
            Mahasiswa: { select: { UserId: true } },
            StatusMahasiswaAssesmentHistory: {
                where: { Aktif: true },
                select: {
                    StatusMahasiswaAssesment: { select: { NamaStatus: true } },
                },
            },
        },
    })
}

app.get('/', async (c) => {
    const session = await getSession()
    if (!session) {
        return c.json(
            { data: [], status: 'error', message: 'Unauthorized' },
            { status: 401 }
        )
    }

    const pendaftaranId = c.req.query('p') ?? ''
    if (!pendaftaranId) {
        return c.json(
            { data: [], status: 'error', message: 'param p perlu diisi' },
            { status: 400 }
        )
    }

    const pendaftaran = await pendaftaranMilikSaya(
        pendaftaranId,
        session.user.id
    )

    if (!pendaftaran) {
        return c.json(
            { data: [], status: 'error', message: 'Pendaftaran tidak ditemukan' },
            { status: 404 }
        )
    }

    // ?file=1 mengembalikan gambarnya untuk pratinjau.
    if (c.req.query('file')) {
        if (
            !pendaftaran.TandaTanganPath ||
            !(await berkasAda(pendaftaran.TandaTanganPath))
        ) {
            return c.json(
                { data: [], status: 'error', message: 'Tanda tangan belum ada' },
                { status: 404 }
            )
        }

        const isi = await bacaBerkas(pendaftaran.TandaTanganPath)
        return c.body(isi, 200, {
            'Content-Type': 'image/png',
            'Cache-Control': 'no-store',
        })
    }

    const status =
        pendaftaran.StatusMahasiswaAssesmentHistory[0]?.StatusMahasiswaAssesment
            .NamaStatus ?? ''

    return c.json({
        status: 'success',
        message: 'success',
        data: {
            SudahTandaTangan: !!pendaftaran.TandaTanganPath,
            TandaTanganPada: pendaftaran.TandaTanganPada,
            DapatDiubah: bolehTandaTangan(status, !!pendaftaran.TandaTanganPath),
        },
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

    const body: { PendaftaranId: string; TandaTangan: string } =
        await c.req.json()

    if (!body.PendaftaranId || !body.TandaTangan) {
        return c.json(
            {
                data: [],
                status: 'error',
                message: 'PendaftaranId dan TandaTangan perlu diisi',
            },
            { status: 400 }
        )
    }

    // Hanya PNG dari kanvas tanda tangan yang diterima.
    const cocok = /^data:image\/png;base64,([A-Za-z0-9+/=]+)$/.exec(
        body.TandaTangan.trim()
    )
    if (!cocok) {
        return c.json(
            {
                data: [],
                status: 'error',
                message: 'Format tanda tangan harus PNG (data URI)',
            },
            { status: 400 }
        )
    }

    const isi = Buffer.from(cocok[1], 'base64')
    if (isi.byteLength === 0 || isi.byteLength > MAKS_BYTE) {
        return c.json(
            {
                data: [],
                status: 'error',
                message: 'Ukuran tanda tangan tidak wajar (maksimal 1,5 MB)',
            },
            { status: 400 }
        )
    }

    const pendaftaran = await pendaftaranMilikSaya(
        body.PendaftaranId,
        session.user.id
    )

    if (!pendaftaran) {
        return c.json(
            { data: [], status: 'error', message: 'Pendaftaran tidak ditemukan' },
            { status: 404 }
        )
    }

    const status =
        pendaftaran.StatusMahasiswaAssesmentHistory[0]?.StatusMahasiswaAssesment
            .NamaStatus ?? ''

    if (!bolehTandaTangan(status, !!pendaftaran.TandaTanganPath)) {
        return c.json(
            {
                data: [],
                status: 'error',
                message: pendaftaran.TandaTanganPath
                    ? 'Berkas sudah dilanjutkan ke asesor — tanda tangan tidak dapat diubah lagi'
                    : 'SK sudah diproses — tanda tangan tidak dapat dibubuhkan lagi',
            },
            { status: 409 }
        )
    }

    const pathFile = await simpanBerkas(
        pendaftaran.Mahasiswa.UserId,
        'ttd',
        `${uuidv4()}.png`,
        isi
    )

    // Tanda tangan lama dihapus supaya tidak menumpuk di penyimpanan.
    if (pendaftaran.TandaTanganPath && pendaftaran.TandaTanganPath !== pathFile) {
        await hapusBerkas(pendaftaran.TandaTanganPath).catch(() => { })
    }

    const disimpan = await prisma.pendaftaran.update({
        where: { PendaftaranId: pendaftaran.PendaftaranId },
        data: {
            TandaTanganPath: pathFile,
            TandaTanganPada: new Date(),
            UpdatedAt: new Date(),
        },
        select: { TandaTanganPada: true },
    })

    return c.json({
        status: 'success',
        message: 'Tanda tangan tersimpan dan akan disematkan pada Form 03',
        data: {
            SudahTandaTangan: true,
            TandaTanganPada: disimpan.TandaTanganPada,
            DapatDiubah: true,
        },
    })
})

export const GET = handle(app)
export const POST = handle(app)
