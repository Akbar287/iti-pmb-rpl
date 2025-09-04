import { Prisma, SettingNumber } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/website/angka')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const id = c.req.query('id')
    const page = Number(c.req.query('page') ?? '1')
    const limit = Number(c.req.query('limit') ?? '10')
    const search = c.req.query('search') ?? ''

    let data = null
    if (id) {
        data = await prisma.settingNumber.findFirst({ where: { SettingNumberId: id } })
    } else if (page && limit) {
        let where: Prisma.SettingNumberWhereInput = search
            ? {
                  OR: [{ Title: { contains: search, mode: 'insensitive' } }, {Subtitle: { contains: search, mode: 'insensitive'}}],
              }
            : {}

        const [data, total] = await Promise.all([
            prisma.settingNumber.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { Title: 'asc' },
            }),

            prisma.settingNumber.count({ where }),
        ])

        return c.json<{
            data: SettingNumber[]
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
    } else {
        data = await prisma.settingNumber.findMany()
    }

    return c.json(data)
})

app.post('/', async (c) => {
    const body: SettingNumber = await c.req.json()

    const data = await prisma.settingNumber.create({
        data: {
            SettingMainPageId: body.SettingMainPageId,
            Title: body.Title,
            Subtitle: body.Subtitle, 
            Angka: body.Angka
        },
    })

    return c.json(data)
})

app.put('/', async (c) => {
    const body: SettingNumber = await c.req.json()

    const data = await prisma.settingNumber.update({
        data: {
            SettingMainPageId: body.SettingMainPageId,
            Title: body.Title,
            Subtitle: body.Subtitle,
            Angka: body.Angka
        },
        where: {
            SettingNumberId: body.SettingNumberId,
        },
    })

    return c.json(data)
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    await prisma.settingNumber.delete({
        where: {
            SettingNumberId: id,
        },
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
