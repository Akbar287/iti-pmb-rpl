import { Prisma, UniversitySosialMedia } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { Pagination } from '@/types/Pagination'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/manajemen-institusi/sosial-media')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const id = c.req.query('id')
    const page = Number(c.req.query('page') ?? '1')
    const limit = Number(c.req.query('limit') ?? '10')
    const search = c.req.query('search') ?? ''

    if (id) {
        const data = await prisma.universitySosialMedia.findFirst({
            where: { UniversitySosialMediaId: id },
        })

        if (!data) {
            return c.json({ error: 'Not Found' }, 404)
        }

        return c.json<UniversitySosialMedia>(data, 200)
    } else if (page && limit) {
        let where: Prisma.UniversitySosialMediaWhereInput = search
            ? {
                  OR: [{ Nama: { contains: search, mode: 'insensitive' } }],
              }
            : {}

        const [data, total] = await Promise.all([
            prisma.universitySosialMedia.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { Nama: 'asc' },
            }),

            prisma.universitySosialMedia.count({ where }),
        ])

        return c.json<Pagination<UniversitySosialMedia[]>>({
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
        const data = await prisma.universitySosialMedia.findMany()

        return c.json<UniversitySosialMedia[]>(data, 200)
    }
})

app.post('/', async (c) => {
    const body: UniversitySosialMedia = await c.req.json()

    const data = await prisma.universitySosialMedia.create({
        data: {
            UniversityId: body.UniversityId,
            Nama: body.Nama,
            Username: body.Username,
            Icon: body.Icon,
        },
    })

    return c.json<UniversitySosialMedia>(data, 200)
})

app.put('/', async (c) => {
    const body: UniversitySosialMedia = await c.req.json()

    const data = await prisma.universitySosialMedia.update({
        data: {
            UniversityId: body.UniversityId,
            Nama: body.Nama,
            Username: body.Username,
            Icon: body.Icon,
        },
        where: {
            UniversitySosialMediaId: body.UniversitySosialMediaId,
        },
    })

    return c.json<UniversitySosialMedia>(data, 200)
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    await prisma.universitySosialMedia.delete({
        where: {
            UniversitySosialMediaId: id,
        },
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
