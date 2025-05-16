import { Prisma, ProgramStudi } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath(
    '/api/protected/manajemen-pembelajaran/program-studi'
)

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const id = c.req.query('id')
    const universityId = c.req.query('universityId')
    const page = Number(c.req.query('page') ?? '1')
    const limit = Number(c.req.query('limit') ?? '10')
    const search = c.req.query('search') ?? ''

    let data = null
    if (page && limit) {
        let where: Prisma.ProgramStudiWhereInput = {}
        if (universityId) {
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
                                  {
                                      Jenjang: {
                                          contains: search,
                                          mode: 'insensitive',
                                      },
                                  },
                                  {
                                      Akreditasi: {
                                          contains: search,
                                          mode: 'insensitive',
                                      },
                                  },
                              ],
                          },
                          {
                              UniversityId: universityId,
                          },
                      ],
                  }
                : {
                      UniversityId: universityId,
                  }
        } else {
            where = search
                ? {
                      OR: [
                          { Nama: { contains: search, mode: 'insensitive' } },
                          {
                              Jenjang: {
                                  contains: search,
                                  mode: 'insensitive',
                              },
                          },
                          {
                              Akreditasi: {
                                  contains: search,
                                  mode: 'insensitive',
                              },
                          },
                      ],
                  }
                : {}
        }

        const [data, total] = await Promise.all([
            prisma.programStudi.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { Nama: 'asc' },
            }),

            prisma.programStudi.count({ where }),
        ])

        return c.json<{
            data: ProgramStudi[]
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
    } else if (universityId) {
        data = await prisma.programStudi.findMany({
            where: { UniversityId: universityId },
        })
    } else if (id) {
        data = await prisma.programStudi.findFirst({
            where: { ProgramStudiId: id },
        })
    } else {
        data = await prisma.programStudi.findMany()
    }

    return c.json(data)
})

app.post('/', async (c) => {
    const body: ProgramStudi = await c.req.json()

    const data = await prisma.programStudi.create({
        data: {
            UniversityId: body.UniversityId,
            Nama: body.Nama,
            Jenjang: body.Jenjang,
            Akreditasi: body.Akreditasi,
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
        },
    })

    return c.json(data)
})

app.put('/', async (c) => {
    const body: ProgramStudi = await c.req.json()

    const data = await prisma.programStudi.update({
        data: {
            UniversityId: body.UniversityId,
            Nama: body.Nama,
            Jenjang: body.Jenjang,
            Akreditasi: body.Akreditasi,
            UpdatedAt: new Date(),
        },
        where: {
            ProgramStudiId: body.ProgramStudiId,
        },
    })

    return c.json(data)
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    await prisma.programStudi.delete({
        where: {
            ProgramStudiId: id,
        },
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
