import { Kecamatan, Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/area/kecamatan')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const id = c.req.query('id')
    const kabupatenId = c.req.query('kabupatenId')
    const pageTemp = c.req.query('page')
    const limitTemp = c.req.query('limit')
    const search = c.req.query('search') ?? ''
    
    let data = null
    if (pageTemp != null && limitTemp != null) {
        const page = Number(c.req.query('page') ?? '1')
        const limit = Number(c.req.query('limit') ?? '10')
        let where: Prisma.KecamatanWhereInput = {}

        if (kabupatenId) {
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
                              KabupatenId: kabupatenId,
                          },
                      ],
                  }
                : {
                      KabupatenId: kabupatenId,
                  }
        } else {
            where = search
                ? {
                      OR: [{ Nama: { contains: search, mode: 'insensitive' } }],
                  }
                : {}
        }

        const [data, total] = await Promise.all([
            prisma.kecamatan.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { Nama: 'asc' },
            }),

            prisma.kecamatan.count({ where }),
        ])

        return c.json<{
            data: Kecamatan[]
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
    } else if (kabupatenId) {
        data = await prisma.kecamatan.findMany({
            where: {
                KabupatenId: kabupatenId,
            },
        })
    } else {
        data = id
            ? await prisma.kecamatan.findFirst({ where: { KecamatanId: id } })
            : await prisma.kecamatan.findMany()
    }

    return c.json(data)
})

app.post('/', async (c) => {
    const body: Kecamatan = await c.req.json()

    const data = await prisma.kecamatan.create({
        data: {
            Nama: body.Nama,
            KabupatenId: body.KabupatenId,
        },
    })

    return c.json(data)
})

app.put('/', async (c) => {
    const body: Kecamatan = await c.req.json()

    const data = await prisma.kecamatan.update({
        data: {
            Nama: body.Nama,
            KabupatenId: body.KabupatenId,
        },
        where: {
            KecamatanId: body.KecamatanId,
        },
    })

    return c.json(data)
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    await prisma.kecamatan.delete({
        where: {
            KecamatanId: id,
        },
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
