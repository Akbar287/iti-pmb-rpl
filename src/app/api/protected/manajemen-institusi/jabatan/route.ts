import { Prisma, UniversityJabatan } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { Pagination } from '@/types/Pagination'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/manajemen-institusi/jabatan')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const id = c.req.query('id')
    const page = Number(c.req.query('page') ?? '1')
    const limit = Number(c.req.query('limit') ?? '10')
    const search = c.req.query('search') ?? ''

    if (id) {
        const data = await prisma.universityJabatan.findFirst({
            where: {
                UniversityJabatanId: id,
            }
        })
        if (!data) {
            return c.json({ error: 'Not Found' }, 404)
        }
        return c.json<UniversityJabatan>(data, 200)
    } else if (page && limit) {
        let where: Prisma.UniversityJabatanWhereInput = search
            ? {
                  OR: [{ Nama: { contains: search, mode: 'insensitive' } }],
              }
            : {}

        const [data, total] = await Promise.all([
            prisma.universityJabatan.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { Nama: 'asc' },
            }),

            prisma.universityJabatan.count({ where }),
        ])

        return c.json<Pagination<UniversityJabatan[]>>({
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
        const data = await prisma.universityJabatan.findMany()

        return c.json<UniversityJabatan[]>(data, 200)
    }
})

app.post('/', async (c) => {
    const body: UniversityJabatan = await c.req.json()

    const data = await prisma.universityJabatan.create({
        data: {
            Nama: body.Nama,
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
            UniversityId: body.UniversityId,
            DeletedAt: null,
            Keterangan: body.Keterangan !== null ? body.Keterangan : null,
        },
    })

    return c.json<UniversityJabatan>(data, 201)
})

app.put('/', async (c) => {
    const body: UniversityJabatan = await c.req.json()
    
    const data = await prisma.universityJabatan.update({
        data: {
            Nama: body.Nama,
            UniversityId: body.UniversityId,
            Keterangan: body.Keterangan !== null ? body.Keterangan : null,
            UpdatedAt: new Date(),
        },
        where: {
            UniversityJabatanId: body.UniversityJabatanId,
        },
    })
    if (!data) {
        return c.json({ error: 'Not Found' }, 404)
    }
    return c.json<UniversityJabatan>(data, 200)
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    await prisma.universityJabatan.delete({
        where: {
            UniversityJabatanId: id,
        },
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
