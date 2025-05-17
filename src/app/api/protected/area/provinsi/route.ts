import { Prisma, Provinsi } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/area/provinsi')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const id = c.req.query('id')
    const countryId = c.req.query('countryId')
    const pageTemp = c.req.query('page')
    const limitTemp = c.req.query('limit')
    const search = c.req.query('search') ?? ''

    let data = null
    if (pageTemp != null && limitTemp != null) {
        const page = Number(pageTemp ?? '1')
        const limit = Number(limitTemp ?? '10')
        let where: Prisma.ProvinsiWhereInput = {}

        if (countryId) {
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
                              CountryId: countryId,
                          },
                      ],
                  }
                : {
                      CountryId: countryId,
                  }
        } else {
            where = search
                ? {
                      OR: [{ Nama: { contains: search, mode: 'insensitive' } }],
                  }
                : {}
        }

        const [data, total] = await Promise.all([
            prisma.provinsi.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { Nama: 'asc' },
            }),

            prisma.provinsi.count({ where }),
        ])

        return c.json<{
            data: Provinsi[]
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
    } else if (countryId) {
        data = await prisma.provinsi.findMany({
            where: {
                CountryId: countryId,
            },
        })
    } else {
        data = id
            ? await prisma.provinsi.findFirst({ where: { ProvinsiId: id } })
            : await prisma.provinsi.findMany()
    }

    return c.json(data)
})

app.post('/', async (c) => {
    const body: Provinsi = await c.req.json()

    const data = await prisma.provinsi.create({
        data: {
            Nama: body.Nama,
            CountryId: body.CountryId,
        },
    })

    return c.json(data)
})

app.put('/', async (c) => {
    const body: Provinsi = await c.req.json()

    const data = await prisma.provinsi.update({
        data: {
            Nama: body.Nama,
            CountryId: body.CountryId,
        },
        where: {
            ProvinsiId: body.ProvinsiId,
        },
    })

    return c.json(data)
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    await prisma.provinsi.delete({
        where: {
            ProvinsiId: id,
        },
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
