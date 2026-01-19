import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { prisma } from '@/lib/prisma'
import { QuestionAndAsk } from '@/types/QuestionAndAskTypes'
import { Prisma } from '@/generated/prisma'
import { Pagination } from '@/types/Pagination'

const app = new Hono().basePath('/api/protected/qna')

app.use('*', withApiAuth);

app.get('/', async (c) => {
    const id = c.req.query('id')
    const page = Number(c.req.query('page') ?? '1')
    const limit = Number(c.req.query('limit') ?? '10')
    const search = c.req.query('search') ?? ''

    if (id) {
        const data = await prisma.questionAndAsk.findFirst({
            where: {
                QuestionAndAskId: id,
            }
        })
        if (!data) {
            return c.json({ error: 'Not Found' }, 404)
        }
        return c.json<QuestionAndAsk>(data, 200)
    } else if (page && limit) {
        let where: Prisma.QuestionAndAskWhereInput = search
            ? {
                OR: [{ Question: { contains: search, mode: 'insensitive' } }],
            }
            : {}

        const [data, total] = await Promise.all([
            prisma.questionAndAsk.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { Question: 'asc' },
            }),

            prisma.questionAndAsk.count({ where }),
        ])

        return c.json<Pagination<QuestionAndAsk[]>>({
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
        const data = await prisma.questionAndAsk.findMany()

        return c.json<QuestionAndAsk[]>(data, 200)
    }
});

app.post('/', async (c) => {
    const body = await c.req.json()
    const data = await prisma.questionAndAsk.create({
        data: {
            Question: body.Question,
            Answer: body.Answer,
        },
    })
    return c.json<QuestionAndAsk>(data, 201)
})

app.put('/', async (c) => {
    const body = await c.req.json()
    const data = await prisma.questionAndAsk.update({
        where: {
            QuestionAndAskId: body.QuestionAndAskId,
        },
        data: {
            Question: body.Question,
            Answer: body.Answer,
            UpdatedAt: new Date(),
        },
    })
    return c.json<QuestionAndAsk>(data, 200)
})

app.delete('/', async (c) => {
    const id = c.req.query('id')
    const data = await prisma.questionAndAsk.delete({
        where: {
            QuestionAndAskId: id,
        },
    })
    return c.json<QuestionAndAsk>(data, 200)
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)