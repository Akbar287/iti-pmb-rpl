import { Prisma, UniversityJabatanOrang } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { Pagination } from '@/types/Pagination'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/manajemen-institusi/jabatan-orang')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const id = c.req.query('id')
    const page = Number(c.req.query('page') ?? '1')
    const limit = Number(c.req.query('limit') ?? '10')
    const search = c.req.query('search') ?? ''

    if (id) {
        const data = await prisma.universityJabatanOrang.findFirst({
            where: {
                UniversityJabatanOrangId: id,
            }
        })
        if (!data) {
            return c.json({ error: 'Not Found' }, 404)
        }
        return c.json<UniversityJabatanOrang>(data, 200)
    } else if (page && limit) {
        let where: Prisma.UniversityJabatanOrangWhereInput = search
            ? {
                  OR: [{ Nama: { contains: search, mode: 'insensitive' } }],
              }
            : {}

        const [data, total] = await Promise.all([
            prisma.universityJabatanOrang.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { Nama: 'asc' },
            }),

            prisma.universityJabatanOrang.count({ where }),
        ])

        return c.json<Pagination<UniversityJabatanOrang[]>>({
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
        const data = await prisma.universityJabatanOrang.findMany()

        return c.json<UniversityJabatanOrang[]>(data, 200)
    }
})

app.post('/', async (c) => {
    const body: UniversityJabatanOrang = await c.req.json()

    const data = await prisma.universityJabatanOrang.create({
        data: {
            Nama: body.Nama,
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
            UniversityJabatanId: body.UniversityJabatanId,
            DeletedAt: null,
            Keterangan: body.Keterangan !== null ? body.Keterangan : null,
        },
    })

    return c.json<UniversityJabatanOrang>(data, 201)
})

app.put('/', async (c) => {
    const body: UniversityJabatanOrang = await c.req.json()
    
    const data = await prisma.universityJabatanOrang.update({
        data: {
            Nama: body.Nama,
            UniversityJabatanId: body.UniversityJabatanId,
            Keterangan: body.Keterangan !== null ? body.Keterangan : null,
            UpdatedAt: new Date(),
        },
        where: {
            UniversityJabatanOrangId: body.UniversityJabatanId,
        },
    })
    if (!data) {
        return c.json({ error: 'Not Found' }, 404)
    }
    return c.json<UniversityJabatanOrang>(data, 200)
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    await prisma.universityJabatanOrang.delete({
        where: {
            UniversityJabatanOrangId: id,
        },
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
