import { JenisKegiatan, Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/website/jenis-kegiatan')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const id = c.req.query('id')
    const page = Number(c.req.query('page') ?? '1')
    const limit = Number(c.req.query('limit') ?? '10')
    const search = c.req.query('search') ?? ''

    let data = null
    if (id) {
        data = await prisma.jenisKegiatan.findFirst({ where: { JenisKegiatanId: id } })
    } else if (page && limit) {
        let where: Prisma.JenisKegiatanWhereInput = search
            ? {
                  OR: [{ Nama: { contains: search, mode: 'insensitive' } }],
              }
            : {}

        const [data, total] = await Promise.all([
            prisma.jenisKegiatan.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { Nama: 'asc' },
            }),

            prisma.jenisKegiatan.count({ where }),
        ])

        return c.json<{
            data: JenisKegiatan[]
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
            data: data,
            totalElement: total,
            totalPage: Math.ceil(total / limit),
            isFirst: page === 1,
            isLast:
                page === Math.ceil(total / limit) ||
                Math.ceil(total / limit) === 0,
            hasNext: page < Math.ceil(total / limit),
            hasPrevious: page > 1,
        })
    } else {
        data = await prisma.jenisKegiatan.findMany()
    }

    return c.json(data)
})

app.post('/', async (c) => {
    const body: JenisKegiatan = await c.req.json()

    const data = await prisma.jenisKegiatan.create({
        data: {
            Nama: body.Nama,
            Color: body.Color
        },
    })

    return c.json(data)
})

app.put('/', async (c) => {
    const body: JenisKegiatan = await c.req.json()

    const data = await prisma.jenisKegiatan.update({
        data: {
            Nama: body.Nama,
            Color: body.Color
        },
        where: {
            JenisKegiatanId: body.JenisKegiatanId,
        },
    })

    return c.json(data)
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    await prisma.jenisKegiatan.delete({
        where: {
            JenisKegiatanId: id,
        },
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
