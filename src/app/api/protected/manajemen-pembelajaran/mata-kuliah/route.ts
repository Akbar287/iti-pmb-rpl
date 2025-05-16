import { MataKuliah, Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath(
    '/api/protected/manajemen-pembelajaran/mata-kuliah'
)

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const id = c.req.query('id')
    const programStudiId = c.req.query('programStudiId')
    const page = Number(c.req.query('page') ?? '1')
    const limit = Number(c.req.query('limit') ?? '10')
    const search = c.req.query('search') ?? ''

    let data = null
    if (page && limit) {
        let where: Prisma.MataKuliahWhereInput = {}
        if (programStudiId) {
            where = search
                ? {
                      AND: [
                          {
                              OR: [
                                  {
                                      Kode: {
                                          contains: search,
                                          mode: 'insensitive',
                                      },
                                  },
                                  {
                                      Nama: {
                                          contains: search,
                                          mode: 'insensitive',
                                      },
                                  },
                              ],
                          },
                          {
                              ProgramStudiId: programStudiId,
                          },
                      ],
                  }
                : {
                      ProgramStudiId: programStudiId,
                  }
        } else {
            where = search
                ? {
                      OR: [
                          { Kode: { contains: search, mode: 'insensitive' } },
                          { Nama: { contains: search, mode: 'insensitive' } },
                      ],
                  }
                : {}
        }

        const [data, total] = await Promise.all([
            prisma.mataKuliah.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { Kode: 'asc' },
            }),

            prisma.mataKuliah.count({ where }),
        ])

        return c.json<{
            data: MataKuliah[]
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
    } else if (programStudiId) {
        data = await prisma.mataKuliah.findMany({
            where: { ProgramStudiId: programStudiId },
        })
    } else if (id) {
        data = await prisma.mataKuliah.findFirst({
            where: { MataKuliahId: id },
        })
    } else {
        data = await prisma.mataKuliah.findMany()
    }

    return c.json(data)
})

app.post('/', async (c) => {
    const body: MataKuliah = await c.req.json()

    const data = await prisma.mataKuliah.create({
        data: {
            ProgramStudiId: body.ProgramStudiId,
            Kode: body.Kode,
            Nama: body.Nama,
            Sks: body.Sks,
            Semester: body.Semester,
            Silabus: body.Silabus,
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
        },
    })

    return c.json(data)
})

app.put('/', async (c) => {
    const body: MataKuliah = await c.req.json()

    const data = await prisma.mataKuliah.update({
        data: {
            ProgramStudiId: body.ProgramStudiId,
            Kode: body.Kode,
            Nama: body.Nama,
            Sks: body.Sks,
            Semester: body.Semester,
            Silabus: body.Silabus,
            UpdatedAt: new Date(),
        },
        where: {
            MataKuliahId: body.MataKuliahId,
        },
    })

    return c.json(data)
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    await prisma.mataKuliah.delete({
        where: {
            MataKuliahId: id,
        },
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
