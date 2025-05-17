import { Kabupaten, Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/area/kabupaten')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const id = c.req.query('id')
    const provinsiId = c.req.query('provinsiId')
    const pageTemp = c.req.query('page')
    const limitTemp = c.req.query('limit')
    const search = c.req.query('search') ?? ''
    
    let data = null
    if (pageTemp != null && limitTemp != null) {
        const page = Number(c.req.query('page') ?? '1')
        const limit = Number(c.req.query('limit') ?? '10')
        let where: Prisma.KabupatenWhereInput = {}

        if (provinsiId) {
            where = search
                ? {
                      AND: [
                          {
                              OR: [
                                  {
                                      Nama: {
                                          contains: search,
                                          mode: 'insensitive',
                                      },
                                  },
                              ],
                          },
                          {
                              ProvinsiId: provinsiId,
                          },
                      ],
                  }
                : {
                      ProvinsiId: provinsiId,
                  }
        } else {
            where = search
                ? {
                      OR: [{ Nama: { contains: search, mode: 'insensitive' } }],
                  }
                : {}
        }

        const [data, total] = await Promise.all([
            prisma.kabupaten.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { Nama: 'asc' },
            }),

            prisma.kabupaten.count({ where }),
        ])

        return c.json<{
            data: Kabupaten[]
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
    } else if (provinsiId) {
        data = await prisma.kabupaten.findMany({
            where: {
                ProvinsiId: provinsiId,
            },
        })
    } else {
        data = id
            ? await prisma.kabupaten.findFirst({ where: { KabupatenId: id } })
            : await prisma.kabupaten.findMany()
    }

    return c.json(data)
})

app.post('/', async (c) => {
    const body: Kabupaten = await c.req.json()

    const data = await prisma.kabupaten.create({
        data: {
            Nama: body.Nama,
            ProvinsiId: body.ProvinsiId,
        },
    })

    return c.json(data)
})

app.put('/', async (c) => {
    const body: Kabupaten = await c.req.json()

    const data = await prisma.kabupaten.update({
        data: {
            Nama: body.Nama,
            ProvinsiId: body.ProvinsiId,
        },
        where: {
            KabupatenId: body.KabupatenId,
        },
    })

    return c.json(data)
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    await prisma.kabupaten.delete({
        where: {
            KabupatenId: id,
        },
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
