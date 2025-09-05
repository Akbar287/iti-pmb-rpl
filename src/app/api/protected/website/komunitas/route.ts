import { Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { SettingCommunityTypes } from '@/types/WebsiteTypes'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import mime from 'mime'
const app = new Hono().basePath('/api/protected/website/komunitas')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const id = c.req.query('_id')
    const page = Number(c.req.query('page') ?? '1')
    const limit = Number(c.req.query('limit') ?? '10')
    const search = c.req.query('search') ?? ''

    if (page && limit && id) {
        const where: Prisma.SettingCommunityWhereInput = search
            ? {
                  AND: [
                      { Title: { contains: search, mode: 'insensitive' } },
                      {
                          SettingMainPageId: id,
                      },
                  ],
              }
            : { SettingMainPageId: id }

        const [data, total] = await Promise.all([
            prisma.settingCommunity.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { Title: 'asc' },
            }),

            prisma.settingCommunity.count({ where }),
        ])

        return c.json<{
            data: SettingCommunityTypes[]
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
            data: data.map((x) => ({
                SettingCommunityId: x.SettingCommunityId,
                SettingMainPageId: x.SettingMainPageId,
                Title: x.Title,
            })),
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
        const data = await prisma.settingCommunity.findFirst({
            where: { SettingCommunityId: id },
        })

        if (data) {
            const res: SettingCommunityTypes = {
                SettingCommunityId: data.SettingCommunityId,
                SettingMainPageId: data.SettingMainPageId,
                Title: data.Title,
            }
            return c.json(res)
        } else {
            return c.json({
                status: 'not found',
                message: 'Not Found',
                data: [],
            })
        }
    } else {
        return c.json({
            status: 'not found',
            message: 'Not Found',
            data: [],
        })
    }
})

app.post('/', async (c) => {
    const body = await c.req.parseBody()

    const request: SettingCommunityTypes =
        typeof body.request === 'string'
            ? JSON.parse(body.request)
            : body.request
    const fileBg = body.fileBg

    if (!fileBg || !(fileBg instanceof File)) {
        return c.json(
            { status: 'error', message: 'File Bg is required', data: [] },
            { status: 400 }
        )
    }

    const MAX_SIZE_MB = 10
    if (fileBg.size > MAX_SIZE_MB * 1024 * 1024) {
        return c.json(
            {
                status: 'error',
                message: 'Ukuran file Bg melebihi 10MB',
                data: [],
            },
            { status: 400 }
        )
    }

    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/webp']
    const allowedExtensions = ['png', 'jpg', 'jpeg', 'webp']

    const fileExt = mime.getExtension(fileBg.type) || ''

    if (
        !allowedMimeTypes.includes(fileBg.type) ||
        !allowedExtensions.includes(fileExt)
    ) {
        return c.json(
            {
                status: 'error',
                message:
                    'Format file tidak valid. Hanya format Gambar (PNG, JPG, WebP) yang diperbolehkan.',
                data: [],
            },
            { status: 400 }
        )
    }

    const bufferBg = Buffer.from(await fileBg.arrayBuffer())

    const data = await prisma.settingCommunity.create({
        data: {
            SettingMainPageId: request.SettingMainPageId,
            Title: request.Title,
            Gambar: bufferBg,
        },
    })

    const res: SettingCommunityTypes = {
        SettingCommunityId: data.SettingCommunityId,
        SettingMainPageId: data.SettingMainPageId,
        Title: data.Title,
    }

    return c.json(res)
})

app.put('/', async (c) => {
    const body = await c.req.parseBody()

    const request: SettingCommunityTypes =
        typeof body.request === 'string'
            ? JSON.parse(body.request)
            : body.request
    const fileBg = body.fileBg

    if (!fileBg || !(fileBg instanceof File)) {
        return c.json(
            { status: 'error', message: 'File Bg is required', data: [] },
            { status: 400 }
        )
    }

    const MAX_SIZE_MB = 10
    if (fileBg.size > MAX_SIZE_MB * 1024 * 1024) {
        return c.json(
            {
                status: 'error',
                message: 'Ukuran file Bg melebihi 10MB',
                data: [],
            },
            { status: 400 }
        )
    }

    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/webp']
    const allowedExtensions = ['png', 'jpg', 'jpeg', 'webp']

    const fileExt = mime.getExtension(fileBg.type) || ''

    if (
        !allowedMimeTypes.includes(fileBg.type) ||
        !allowedExtensions.includes(fileExt)
    ) {
        return c.json(
            {
                status: 'error',
                message:
                    'Format file tidak valid. Hanya format Gambar (PNG, JPG, WebP) yang diperbolehkan.',
                data: [],
            },
            { status: 400 }
        )
    }

    const bufferBg = Buffer.from(await fileBg.arrayBuffer())

    const data = await prisma.settingCommunity.update({
        where: {
            SettingCommunityId: request.SettingCommunityId,
        },
        data: {
            SettingMainPageId: request.SettingMainPageId,
            Title: request.Title,
            Gambar: bufferBg,
        },
    })

    const res: SettingCommunityTypes = {
        SettingCommunityId: data.SettingCommunityId,
        SettingMainPageId: data.SettingMainPageId,
        Title: data.Title,
    }

    return c.json(res)
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    await prisma.settingCommunity.delete({
        where: {
            SettingCommunityId: id,
        },
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
