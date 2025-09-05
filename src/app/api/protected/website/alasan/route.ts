import { SettingWhy, Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/website/alasan')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const id = c.req.query('id')
    const page = Number(c.req.query('page') ?? '1')
    const limit = Number(c.req.query('limit') ?? '10')
    const search = c.req.query('search') ?? ''

    let data = null
    if (page && limit && id) {
        let where: Prisma.SettingWhyWhereInput = search
            ? {
                  OR: [{ Title: { contains: search, mode: 'insensitive' } }, {Subtitle: { contains: search, mode: 'insensitive'}}, {SettingMainPageId: id}],
              }
            : {SettingMainPageId: id}
    
        const [data, total] = await Promise.all([
            prisma.settingWhy.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { Title: 'asc' },
            }),
    
            prisma.settingWhy.count({ where }),
        ])
    
        return c.json<{
            data: SettingWhy[]
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
    } else if (id) {
        data = await prisma.settingWhy.findFirst({ where: { SettingWhyId: id } })
    } else {
        data = await prisma.settingWhy.findMany()
    }

    return c.json(data)
})

app.post('/', async (c) => {
    const body: SettingWhy = await c.req.json()

    const data = await prisma.settingWhy.create({
        data: {
            SettingMainPageId: body.SettingMainPageId,
            Title: body.Title,
            Subtitle: body.Subtitle, 
            Icon: body.Icon
        },
    })

    return c.json(data)
})

app.put('/', async (c) => {
    const body: SettingWhy = await c.req.json()

    const data = await prisma.settingWhy.update({
        data: {
            SettingMainPageId: body.SettingMainPageId,
            Title: body.Title,
            Subtitle: body.Subtitle,
            Icon: body.Icon
        },
        where: {
            SettingWhyId: body.SettingWhyId,
        },
    })

    return c.json(data)
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    await prisma.settingWhy.delete({
        where: {
            SettingWhyId: id,
        },
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
