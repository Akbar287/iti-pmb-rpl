import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { getSession } from '@/provider/api'
import { prisma } from '@/lib/prisma'

const app = new Hono().basePath('/api/protected/avatar')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const userId = c.req.query('userId')
    if (!userId) {
        return c.json(
            { data: [], status: 'error', message: 'filename is required' },
            { status: 400 }
        )
    }

    const avatar = await prisma.user.findFirst({
        where: {UserId: userId as string},
        select: { Avatar: true }
    })

    if( !avatar || !avatar.Avatar) {
        return c.json(
            { data: [], status: 'error', message: 'Avatar not found' },
            { status: 404 }
        )
    }

    try {
            return c.body(avatar.Avatar, 200, {
                'Content-Type': 'image/png',
                'Content-Disposition': `inline; filename="${'avatar.png'}"`,
            })
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'error'
        return c.json(
            { data: [], status: 'error', message: errorMessage },
            { status: 500 }
        )
    }
})
app.post('/', async (c) => {
    const session = await getSession()
    const body = await c.req.parseBody()

    const file = body.avatar
    if (!file || !(file instanceof File)) {
        return c.json(
            { status: 'error', message: 'Avatar file is required', data: [] },
            { status: 400 }
        )
    }

    const buffer = Buffer.from(await file.arrayBuffer())


    await prisma.user.update({
        data: {
            Avatar: buffer,
        },
        where: {
            UserId: session?.user.id,
        },
    })

    return c.body(buffer, 200, {
                'Content-Type': 'image/png',
                'Content-Disposition': `inline; filename="${'avatar.png'}"`,
            })
})

export const GET = handle(app)
export const POST = handle(app)
