import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import fs from 'fs'
import path from 'path'
import mime from 'mime'
import { v4 as uuidv4 } from 'uuid'
import { getSession } from '@/provider/api'
import { useSession } from 'next-auth/react'
import { prisma } from '@/lib/prisma'

const app = new Hono().basePath('/api/protected/avatar')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const filename = c.req.query('avatar')
    if (!filename) {
        return c.json(
            { data: [], status: 'error', message: 'filename is required' },
            { status: 400 }
        )
    }
    const filePath = path.join(process.cwd(), 'uploads', 'avatar', filename)

    try {
        const stat = fs.statSync(filePath)
        if (!stat.isFile()) {
            return c.json(
                { data: [], status: 'error', message: 'not a file' },
                { status: 400 }
            )
        }

        const fileStream = fs.createReadStream(filePath)
        const contentType = mime.getType(filePath) || 'application/octet-stream'

        return c.body(fileStream as any, 200, {
            'Content-Type': contentType,
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
    const { update } = await useSession();
    const body = await c.req.parseBody()

    const avatar = await prisma.user.findFirst({
        select: {
            Avatar: true
        },
        where: {
            UserId: session?.user.id
        }
    })

    const file = body.avatar
    if (!file || !(file instanceof File)) {
        return c.json(
            { status: 'error', message: 'Avatar file is required', data: [] },
            { status: 400 }
        )
    }

    const avatarDir = path.join(process.cwd(), 'uploads', 'avatar')

    if(avatar !== null) {
        if (avatar?.Avatar !== 'default.png') {
            const oldPath = path.join(avatarDir, avatar.Avatar || '')
            if (fs.existsSync(oldPath)) {
                try {
                    fs.unlinkSync(oldPath)
                } catch (err) {
                    console.error('Failed to delete old avatar:', err)
                }
            }
        }
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileExt = mime.getExtension(file.type) || 'jpg'
    const filename = `${uuidv4()}.${fileExt}`
    const dir = path.join(process.cwd(), 'uploads', 'avatar')

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }

    const filePath = path.join(dir, filename)

    fs.writeFileSync(filePath, buffer)

    await prisma.user.update({
        data: {
            Avatar: filename,
        },
        where: {
            UserId: session?.user.id,
        },
    })

    await update({
        avatar: filename
    })

    return c.json({
        status: 'success',
        message: 'File uploaded successfully',
        data: {
            filename,
            url: `/api/avatar?avatar=${filename}`,
        },
    })
})

export const GET = handle(app)
export const POST = handle(app)
