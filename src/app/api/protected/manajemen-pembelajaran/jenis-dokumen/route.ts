import { JenisDokumen, Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath(
    '/api/protected/manajemen-pembelajaran/jenis-dokumen'
)

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const id = c.req.query('id')
    const page = Number(c.req.query('page') ?? '1')
    const limit = Number(c.req.query('limit') ?? '10')
    const search = c.req.query('search') ?? ''

    if (id) {
        const data = await prisma.jenisDokumen.findFirst({
            where: { JenisDokumenId: id },
        })
        return c.json(data, 200)
    } else if (page && limit) {
        const where: Prisma.JenisDokumenWhereInput = search
            ? {
                  OR: [
                      { Jenis: { contains: search, mode: 'insensitive' } },
                      { Keterangan: { contains: search, mode: 'insensitive' } },
                  ],
              }
            : {}

        const [data, total] = await Promise.all([
            prisma.jenisDokumen.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { NomorDokumen: 'asc' },
            }),

            prisma.jenisDokumen.count({ where }),
        ])

        return c.json<{
            data: JenisDokumen[]
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
        const data = await prisma.jenisDokumen.findMany()
        return c.json(data, 200)
    }
})

app.post('/', async (c) => {
    const body: JenisDokumen = await c.req.json()

    const data = await prisma.jenisDokumen.create({
        data: {
            Jenis: body.Jenis,
            NomorDokumen: body.NomorDokumen,
            Keterangan: body.Keterangan,
        },
    })

    return c.json(data)
})

app.put('/', async (c) => {
    const body: JenisDokumen = await c.req.json()

    const data = await prisma.jenisDokumen.update({
        data: {
            Jenis: body.Jenis,
            NomorDokumen: body.NomorDokumen,
            Keterangan: body.Keterangan,
        },
        where: {
            JenisDokumenId: body.JenisDokumenId,
        },
    })

    return c.json(data)
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    await prisma.jenisDokumen.delete({
        where: {
            JenisDokumenId: id,
        },
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
