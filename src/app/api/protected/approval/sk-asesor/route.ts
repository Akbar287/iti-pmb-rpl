import { Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { bacaBerkas, berkasAda } from '@/lib/storage'
import { withApiAuth } from '@/middlewares/api-auth'
import { getSession } from '@/provider/api'
import { ResponseSkAsesorForWarek } from '@/types/PenunjukanAsesor'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/approval/sk-asesor')

app.use('*', withApiAuth)

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

    const tipeAsesor = await prisma.tipeSkRektor.findFirst({
        where: { Nama: 'Asesor' },
        select: { TipeSkRektorId: true },
    })

    if (!tipeAsesor) {
        return c.json(
            {
                data: [],
                status: 'error',
                message: "Tipe SK Rektor 'Asesor' belum tersedia",
            },
            { status: 404 }
        )
    }

    // SK penugasan asesor yang belum disetujui Wakil Rektor.
    const where: Prisma.SkRektorWhereInput = {
        TipeSkRektorId: tipeAsesor.TipeSkRektorId,
        Disetujui: false,
        ...(search
            ? {
                OR: [
                    { NomorSk: { contains: search, mode: 'insensitive' } },
                    { NamaSk: { contains: search, mode: 'insensitive' } },
                    {
                        SkRektorAssesor: {
                            some: {
                                Asesor: {
                                    User: {
                                        Nama: {
                                            contains: search,
                                            mode: 'insensitive',
                                        },
                                    },
                                },
                            },
                        },
                    },
                ],
            }
            : {}),
    }

    const [data, total] = await Promise.all([
        prisma.skRektor.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { CreatedAt: 'desc' },
            select: {
                SkRektorId: true,
                NamaSk: true,
                NomorSk: true,
                TahunSk: true,
                NamaFile: true,
                NamaDokumen: true,
                SkRektorAssesor: {
                    select: {
                        Asesor: {
                            select: {
                                TipeAsesor: { select: { Nama: true } },
                                User: { select: { Nama: true } },
                            },
                        },
                    },
                },
            },
        }),
        prisma.skRektor.count({ where }),
    ])

    const responses: ResponseSkAsesorForWarek[] = data.map((item) => ({
        SkRektorId: item.SkRektorId,
        NamaSk: item.NamaSk,
        NomorSk: item.NomorSk,
        TahunSk: item.TahunSk,
        NamaFile: item.NamaFile,
        NamaDokumen: item.NamaDokumen,
        JumlahAsesor: item.SkRektorAssesor.length,
        Asesor: item.SkRektorAssesor.map(
            (x) => `${x.Asesor.User.Nama} (${x.Asesor.TipeAsesor.Nama})`
        ),
    }))

    return c.json<{
        data: ResponseSkAsesorForWarek[]
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
        approval: boolean
        catatan: string
    } = await c.req.json()

    if (!body.SkRektorId) {
        return c.json(
            { data: [], status: 'error', message: 'SkRektorId perlu diisi' },
            { status: 400 }
        )
    }

    const sk = await prisma.skRektor.findFirst({
        where: { SkRektorId: body.SkRektorId },
        select: { SkRektorId: true, Disetujui: true },
    })

    if (!sk) {
        return c.json(
            { data: [], status: 'error', message: 'SK tidak ditemukan' },
            { status: 404 }
        )
    }

    if (sk.Disetujui) {
        return c.json(
            {
                data: [],
                status: 'error',
                message: 'SK ini sudah disetujui sebelumnya',
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

    return c.json({
        status: 'success',
        message: body.approval
            ? 'SK Penugasan Asesor disetujui'
            : 'Catatan penolakan tersimpan',
        data: [],
    })
})

export const GET = handle(app)
export const POST = handle(app)
