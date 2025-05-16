import { CapaianPembelajaran, Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath(
    '/api/protected/manajemen-pembelajaran/capaian-pembelajaran'
)

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const id = c.req.query('id')
    const mataKuliahId = c.req.query('mataKuliahId')
    const page = Number(c.req.query('page') ?? '1')
    const limit = Number(c.req.query('limit') ?? '10')
    const search = c.req.query('search') ?? ''

    let data = null
    if (page && limit) {
        let where: Prisma.CapaianPembelajaranWhereInput = {}
        if (mataKuliahId) {
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
                              MataKuliahId: mataKuliahId,
                          },
                      ],
                  }
                : {
                      MataKuliahId: mataKuliahId,
                  }
        } else {
            where = search
                ? {
                      OR: [{ Nama: { contains: search, mode: 'insensitive' } }],
                  }
                : {}
        }

        const [data, total] = await Promise.all([
            prisma.capaianPembelajaran.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { Urutan: 'asc' },
            }),

            prisma.capaianPembelajaran.count({ where }),
        ])

        return c.json<{
            data: CapaianPembelajaran[]
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
    } else if (mataKuliahId) {
        data = await prisma.capaianPembelajaran.findMany({
            where: { MataKuliahId: mataKuliahId },
        })
    } else if (id) {
        data = await prisma.capaianPembelajaran.findFirst({
            where: { CapaianPembelajaranId: id },
        })
    } else {
        data = await prisma.capaianPembelajaran.findMany()
    }
    return c.json(data)
})

app.post('/', async (c) => {
    const body: CapaianPembelajaran = await c.req.json()

    const data = await prisma.capaianPembelajaran.create({
        data: {
            MataKuliahId: body.MataKuliahId,
            Nama: body.Nama,
            Urutan: body.Urutan,
            Active: body.Active,
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
        },
    })

    return c.json(data)
})

app.put('/', async (c) => {
    const body: CapaianPembelajaran = await c.req.json()

    const data = await prisma.capaianPembelajaran.update({
        data: {
            MataKuliahId: body.MataKuliahId,
            Nama: body.Nama,
            Urutan: body.Urutan,
            Active: body.Active,
            UpdatedAt: new Date(),
        },
        where: {
            CapaianPembelajaranId: body.CapaianPembelajaranId,
        },
    })

    return c.json(data)
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    await prisma.capaianPembelajaran.delete({
        where: {
            CapaianPembelajaranId: id,
        },
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
