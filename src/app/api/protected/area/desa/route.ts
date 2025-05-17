import { Desa, Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/area/desa')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const id = c.req.query('id')
    const kecamatanId = c.req.query('kecamatanId')
    const pageTemp = c.req.query('page')
    const limitTemp = c.req.query('limit')
    const search = c.req.query('search') ?? ''
    
    let data = null
    if (pageTemp != null && limitTemp != null) {
        const page = Number(c.req.query('page') ?? '1')
        const limit = Number(c.req.query('limit') ?? '10')
        let where: Prisma.DesaWhereInput = {}

        if (kecamatanId) {
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
                              KecamatanId: kecamatanId,
                          },
                      ],
                  }
                : {
                      KecamatanId: kecamatanId,
                  }
        } else {
            where = search
                ? {
                      OR: [{ Nama: { contains: search, mode: 'insensitive' } }],
                  }
                : {}
        }

        const [data, total] = await Promise.all([
            prisma.desa.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { Nama: 'asc' },
            }),

            prisma.desa.count({ where }),
        ])

        return c.json<{
            data: Desa[]
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
    } else if (kecamatanId) {
        data = await prisma.desa.findMany({
            where: {
                KecamatanId: kecamatanId,
            },
        })
    } else {
        data = id
            ? await prisma.desa.findFirst({ where: { DesaId: id } })
            : await prisma.desa.findMany()
    }

    return c.json(data)
})

app.post('/', async (c) => {
    const body: Desa = await c.req.json()

    const data = await prisma.desa.create({
        data: {
            Nama: body.Nama,
            KecamatanId: body.KecamatanId,
        },
    })

    return c.json(data)
})

app.put('/', async (c) => {
    const body: Desa = await c.req.json()

    const data = await prisma.desa.update({
        data: {
            Nama: body.Nama,
            KecamatanId: body.KecamatanId,
        },
        where: {
            DesaId: body.DesaId,
        },
    })

    return c.json(data)
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    await prisma.desa.delete({
        where: {
            DesaId: id,
        },
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
