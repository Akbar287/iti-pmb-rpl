import { KategoriBerita, Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/website/kategori-berita')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const id = c.req.query('id')
    const page = Number(c.req.query('page') ?? '1')
    const limit = Number(c.req.query('limit') ?? '10')
    const search = c.req.query('search') ?? ''

    let data = null
    if (id) {
        data = await prisma.kategoriBerita.findFirst({ where: { KategoriBeritaId: id } })
    } else if (page && limit) {
        let where: Prisma.KategoriBeritaWhereInput = search
            ? {
                  OR: [{ Nama: { contains: search, mode: 'insensitive' } }],
              }
            : {}

        const [data, total] = await Promise.all([
            prisma.kategoriBerita.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { Nama: 'asc' },
            }),

            prisma.kategoriBerita.count({ where }),
        ])

        return c.json<{
            data: KategoriBerita[]
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
        data = await prisma.kategoriBerita.findMany()
    }

    return c.json(data)
})

app.post('/', async (c) => {
    const body: KategoriBerita = await c.req.json()

    const data = await prisma.kategoriBerita.create({
        data: {
            Nama: body.Nama,
            Color: body.Color
        },
    })

    return c.json(data)
})

app.put('/', async (c) => {
    const body: KategoriBerita = await c.req.json()

    const data = await prisma.kategoriBerita.update({
        data: {
            Nama: body.Nama,
            Color: body.Color
        },
        where: {
            KategoriBeritaId: body.KategoriBeritaId,
        },
    })

    return c.json(data)
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    await prisma.kategoriBerita.delete({
        where: {
            KategoriBeritaId: id,
        },
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
