import { Prisma } from '@/generated/prisma'
import {
    BERITA_ACARA_TEMPLATE_TYPE,
    cloneDefaultBeritaAcaraTemplate,
    normalizeBeritaAcaraTemplate,
} from '@/lib/berita-acara-template'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath(
    '/api/protected/template-builder/form-berita-acara'
)

app.use('*', withApiAuth)

app.get('/', async (c) => {
    let saved = await prisma.documentTemplate.findUnique({
        where: { Type: BERITA_ACARA_TEMPLATE_TYPE },
        select: { Content: true, UpdatedAt: true },
    })
    if (!saved) {
        const defaultTemplate = cloneDefaultBeritaAcaraTemplate()
        saved = await prisma.documentTemplate.create({
            data: {
                Type: BERITA_ACARA_TEMPLATE_TYPE,
                Name: 'Berita Acara Rapat Pleno',
                Content: defaultTemplate as unknown as Prisma.InputJsonValue,
            },
            select: { Content: true, UpdatedAt: true },
        })
    }

    return c.json({
        template:
            normalizeBeritaAcaraTemplate(saved.Content) ??
            cloneDefaultBeritaAcaraTemplate(),
        updatedAt: saved.UpdatedAt.toISOString(),
    })
})

app.put('/', async (c) => {
    const body: unknown = await c.req.json()
    const rawTemplate =
        body && typeof body === 'object' && 'template' in body
            ? (body as { template: unknown }).template
            : null
    const template = normalizeBeritaAcaraTemplate(rawTemplate)

    if (!template) {
        return c.json(
            { message: 'Format template berita acara tidak valid.' },
            400
        )
    }

    const saved = await prisma.documentTemplate.upsert({
        where: { Type: BERITA_ACARA_TEMPLATE_TYPE },
        create: {
            Type: BERITA_ACARA_TEMPLATE_TYPE,
            Name: 'Berita Acara Rapat Pleno',
            Content: template as unknown as Prisma.InputJsonValue,
        },
        update: {
            Name: 'Berita Acara Rapat Pleno',
            Content: template as unknown as Prisma.InputJsonValue,
        },
        select: { Content: true, UpdatedAt: true },
    })

    return c.json({
        template:
            normalizeBeritaAcaraTemplate(saved.Content) ??
            cloneDefaultBeritaAcaraTemplate(),
        updatedAt: saved.UpdatedAt.toISOString(),
    })
})

export const GET = handle(app)
export const PUT = handle(app)
