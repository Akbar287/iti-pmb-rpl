import { prisma } from '@/lib/prisma'
import { bacaBerkas, berkasAda, hapusBerkas, simpanBerkas } from '@/lib/storage'
import { withApiAuth } from '@/middlewares/api-auth'
import { getSession } from '@/provider/api'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { v4 as uuidv4 } from 'uuid'

/**
 * Tanda tangan Penilai 1 dan Penilai 2 atas hasil rekapitulasi asesmen.
 *
 * Ditandatangani setelah rekapitulasi selesai dan sebelum berkas dilanjutkan ke
 * tahap sanggahan. Gambarnya disimpan sebagai PNG di folder /storage milik
 * masing-masing asesor, lalu disematkan ke Form 03 (blok "Validasi oleh") dan
 * Form 05 (blok "Pengesahan Hasil Penilaian RPL").
 */

const app = new Hono().basePath('/api/protected/tanda-tangan-asesor')

app.use('*', withApiAuth)

/** Tanda tangan hanya boleh dibubuhkan/diubah selama berkas masih di asesor. */
const STATUS_BOLEH_TTD = ['Asessmen Oleh Asesor', 'Rekapitulasi Asessmen']

const MAKS_BYTE = 1_500_000

async function daftarAsesor(pendaftaranId: string) {
    return prisma.assesorMahasiswa.findMany({
        where: { PendaftaranId: pendaftaranId },
        orderBy: { Urutan: 'asc' },
        select: {
            AssesorMahasiswaId: true,
            Urutan: true,
            TandaTanganPath: true,
            TandaTanganPada: true,
            Asesor: {
                select: {
                    AsesorId: true,
                    UserId: true,
                    User: { select: { Nama: true } },
                },
            },
        },
    })
}

async function statusAktif(pendaftaranId: string) {
    const riwayat = await prisma.statusMahasiswaAssesmentHistory.findFirst({
        where: { PendaftaranId: pendaftaranId, Aktif: true },
        select: { StatusMahasiswaAssesment: { select: { NamaStatus: true } } },
    })
    return riwayat?.StatusMahasiswaAssesment.NamaStatus ?? ''
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

    const asesor = await daftarAsesor(pendaftaranId)

    // ?file=1&urutan=n mengembalikan gambarnya untuk pratinjau.
    const urutanFile = c.req.query('urutan')
    if (c.req.query('file')) {
        const target = asesor.find((a) => String(a.Urutan) === urutanFile)
        if (!target?.TandaTanganPath || !(await berkasAda(target.TandaTanganPath))) {
            return c.json(
                { data: [], status: 'error', message: 'Tanda tangan belum ada' },
                { status: 404 }
            )
        }
        const isi = await bacaBerkas(target.TandaTanganPath)
        return c.body(isi, 200, {
            'Content-Type': 'image/png',
            'Cache-Control': 'no-store',
        })
    }

    const status = await statusAktif(pendaftaranId)
    const saya = asesor.find((a) => a.Asesor.UserId === session.user.id)

    return c.json({
        status: 'success',
        message: 'success',
        data: {
            Daftar: asesor.map((a) => ({
                Urutan: a.Urutan,
                Nama: a.Asesor.User.Nama,
                SudahTandaTangan: !!a.TandaTanganPath,
                TandaTanganPada: a.TandaTanganPada,
                MilikSaya: a.Asesor.UserId === session.user.id,
            })),
            // Urutan slot milik pengguna yang sedang masuk; null bila ia bukan
            // asesor pada berkas ini (mis. Akademik yang hanya memantau).
            UrutanSaya: saya?.Urutan ?? null,
            SemuaSudahTandaTangan:
                asesor.length > 0 && asesor.every((a) => !!a.TandaTanganPath),
            DapatDiubah: STATUS_BOLEH_TTD.includes(status),
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

    const asesor = await daftarAsesor(body.PendaftaranId)
    // Seorang asesor hanya boleh menandatangani slotnya sendiri.
    const saya = asesor.find((a) => a.Asesor.UserId === session.user.id)

    if (!saya) {
        return c.json(
            {
                data: [],
                status: 'error',
                message: 'Anda bukan asesor pada berkas ini',
            },
            { status: 403 }
        )
    }

    const status = await statusAktif(body.PendaftaranId)
    if (!STATUS_BOLEH_TTD.includes(status)) {
        return c.json(
            {
                data: [],
                status: 'error',
                message:
                    'Berkas sudah dilanjutkan ke tahap berikutnya — tanda tangan tidak dapat diubah lagi',
            },
            { status: 409 }
        )
    }

    const pathFile = await simpanBerkas(
        saya.Asesor.UserId,
        'ttd',
        `${uuidv4()}.png`,
        isi
    )

    if (saya.TandaTanganPath && saya.TandaTanganPath !== pathFile) {
        await hapusBerkas(saya.TandaTanganPath).catch(() => { })
    }

    await prisma.assesorMahasiswa.update({
        where: { AssesorMahasiswaId: saya.AssesorMahasiswaId },
        data: {
            TandaTanganPath: pathFile,
            TandaTanganPada: new Date(),
            UpdatedAt: new Date(),
        },
    })

    const sesudah = await daftarAsesor(body.PendaftaranId)

    return c.json({
        status: 'success',
        message: `Tanda tangan Penilai ${saya.Urutan} tersimpan`,
        data: {
            Daftar: sesudah.map((a) => ({
                Urutan: a.Urutan,
                Nama: a.Asesor.User.Nama,
                SudahTandaTangan: !!a.TandaTanganPath,
                TandaTanganPada: a.TandaTanganPada,
                MilikSaya: a.Asesor.UserId === session.user.id,
            })),
            UrutanSaya: saya.Urutan,
            SemuaSudahTandaTangan: sesudah.every((a) => !!a.TandaTanganPath),
            DapatDiubah: true,
        },
    })
})

export const GET = handle(app)
export const POST = handle(app)
