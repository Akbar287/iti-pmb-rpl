import { Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { bacaBerkas, berkasAda } from '@/lib/storage'
import { withApiAuth } from '@/middlewares/api-auth'
import { getSession } from '@/provider/api'
import { ResponseSkHasilForWarek } from '@/types/FinalAsessmen'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/approval/sk-hasil')

app.use('*', withApiAuth)

const STATUS_MENUNGGU = 'Persetujuan SK Asessmen'

app.get('/', async (c) => {
    const file = c.req.query('file') || ''

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

    // Tiap SK dinilai sendiri; berkas mahasiswa baru lanjut ke Rektor setelah
    // seluruh SK miliknya disetujui.
    const where: Prisma.SkRektorMahasiswaWhereInput = {
        SkRektor: {
            JenisSkAsessmen: { not: null },
            Disetujui: false,
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
                        Catatan: true,
                    },
                },
                Pendaftaran: {
                    select: {
                        KodePendaftar: true,
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

    const responses: ResponseSkHasilForWarek[] = data.map((item) => ({
        SkRektorId: item.SkRektor.SkRektorId,
        PendaftaranId: item.PendaftaranId,
        JenisSkAsessmen: item.SkRektor.JenisSkAsessmen ?? 'PEROLEHAN_SKS',
        NamaSk: item.SkRektor.NamaSk,
        NomorSk: item.SkRektor.NomorSk,
        TahunSk: item.SkRektor.TahunSk,
        NamaFile: item.SkRektor.NamaFile,
        NamaDokumen: item.SkRektor.NamaDokumen,
        Catatan: item.SkRektor.Catatan ?? '',
        KodePendaftar: item.Pendaftaran.KodePendaftar,
        NamaMahasiswa: item.Pendaftaran.Mahasiswa.User.Nama,
        NamaProgramStudi:
            item.Pendaftaran.DaftarUlang[0]?.ProgramStudi.Nama ?? '',
    }))

    return c.json<{
        data: ResponseSkHasilForWarek[]
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

    const body: {
        SkRektorId: string
        PendaftaranId: string
        approval: boolean
        catatan: string
    } = await c.req.json()

    if (!body.SkRektorId || !body.PendaftaranId) {
        return c.json(
            {
                data: [],
                status: 'error',
                message: 'SkRektorId dan PendaftaranId perlu diisi',
            },
            { status: 400 }
        )
    }

    const sk = await prisma.skRektor.findFirst({
        where: { SkRektorId: body.SkRektorId },
        select: { SkRektorId: true, Ditandatangani: true },
    })

    if (!sk) {
        return c.json(
            { data: [], status: 'error', message: 'SK tidak ditemukan' },
            { status: 404 }
        )
    }

    if (sk.Ditandatangani) {
        return c.json(
            {
                data: [],
                status: 'error',
                message: 'SK ini sudah ditandatangani Rektor',
            },
            { status: 409 }
        )
    }

    await prisma.skRektor.update({
        where: { SkRektorId: sk.SkRektorId },
        data: {
            Disetujui: body.approval,
            DisetujuiPada: body.approval ? new Date() : null,
            DisetujuiOleh: body.approval ? session.user.id : null,
            Catatan: body.catatan,
            UpdatedAt: new Date(),
        },
    })

    // Berkas hanya lanjut ke Rektor bila seluruh SK milik mahasiswa itu sudah
    // disetujui. SK yang ditolak mengembalikan berkas ke Akademik.
    const belumDisetujui = await prisma.skRektorMahasiswa.count({
        where: {
            PendaftaranId: body.PendaftaranId,
            SkRektor: {
                JenisSkAsessmen: { not: null },
                Disetujui: false,
            },
        },
    })

    return c.json({
        status: 'success',
        message: body.approval
            ? 'SK hasil asesmen disetujui'
            : 'Catatan penolakan tersimpan',
        data: {
            SemuaDisetujui: body.approval && belumDisetujui === 0,
            SisaBelumDisetujui: belumDisetujui,
        },
    })
})

export const GET = handle(app)
export const POST = handle(app)
