import { Prisma } from '@/generated/prisma'
import {
    cloneDefaultRekapitulasiTemplate,
    normalizeRekapitulasiTemplate,
    REKAPITULASI_TEMPLATE_TYPE,
} from '@/lib/rekapitulasi-template'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath(
    '/api/protected/template-builder/form-rekapitulasi'
)

app.use('*', withApiAuth)

app.get('/', async (c) => {
    let saved = await prisma.documentTemplate.findUnique({
        where: { Type: REKAPITULASI_TEMPLATE_TYPE },
        select: { Content: true, UpdatedAt: true },
    })
    if (!saved) {
        const defaultTemplate = cloneDefaultRekapitulasiTemplate()
        saved = await prisma.documentTemplate.create({
            data: {
                Type: REKAPITULASI_TEMPLATE_TYPE,
                Name: 'Rekapitulasi Hasil Penilaian RPL (Form 05)',
                Content: defaultTemplate as unknown as Prisma.InputJsonValue,
            },
            select: { Content: true, UpdatedAt: true },
        })
    }

    return c.json({
        template:
            normalizeRekapitulasiTemplate(saved.Content) ??
            cloneDefaultRekapitulasiTemplate(),
        updatedAt: saved.UpdatedAt.toISOString(),
    })
})

app.put('/', async (c) => {
    const body: unknown = await c.req.json()
    const rawTemplate =
        body && typeof body === 'object' && 'template' in body
            ? (body as { template: unknown }).template
            : null
    const template = normalizeRekapitulasiTemplate(rawTemplate)

    if (!template) {
        return c.json(
            { message: 'Format template rekapitulasi tidak valid.' },
            400
        )
    }

    const saved = await prisma.documentTemplate.upsert({
        where: { Type: REKAPITULASI_TEMPLATE_TYPE },
        create: {
            Type: REKAPITULASI_TEMPLATE_TYPE,
            Name: 'Rekapitulasi Hasil Penilaian RPL (Form 05)',
            Content: template as unknown as Prisma.InputJsonValue,
        },
        update: {
            Name: 'Rekapitulasi Hasil Penilaian RPL (Form 05)',
            Content: template as unknown as Prisma.InputJsonValue,
        },
        select: { Content: true, UpdatedAt: true },
    })

    return c.json({
        template:
            normalizeRekapitulasiTemplate(saved.Content) ??
            cloneDefaultRekapitulasiTemplate(),
        updatedAt: saved.UpdatedAt.toISOString(),
    })
})

export const GET = handle(app)
export const PUT = handle(app)
