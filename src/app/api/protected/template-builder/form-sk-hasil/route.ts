import { Prisma } from '@/generated/prisma'
import {
    LEGACY_SK_HASIL_TEMPLATE_TYPE,
    SK_HASIL_TEMPLATE_TYPES,
    SkHasilTemplateVariant,
    cloneDefaultSkHasilTemplate,
    normalizeSkHasilTemplate,
} from '@/lib/sk-hasil-template'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath(
    '/api/protected/template-builder/form-sk-hasil'
)

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const variant = parseVariant(c.req.query('variant'))
    if (!variant) {
        return c.json({ message: 'Varian SK tidak valid.' }, 400)
    }
    let saved = await prisma.documentTemplate.findUnique({
        where: { Type: SK_HASIL_TEMPLATE_TYPES[variant] },
        select: { Content: true, UpdatedAt: true },
    })
    const legacy =
        !saved && variant === 'perolehan'
            ? await prisma.documentTemplate.findUnique({
                  where: { Type: LEGACY_SK_HASIL_TEMPLATE_TYPE },
                  select: { Content: true, UpdatedAt: true },
              })
            : null
    if (!saved) {
        const initialTemplate =
            normalizeSkHasilTemplate(legacy?.Content) ??
            cloneDefaultSkHasilTemplate(variant)
        saved = await prisma.documentTemplate.create({
            data: {
                Type: SK_HASIL_TEMPLATE_TYPES[variant],
                Name:
                    variant === 'transfer'
                        ? 'SK Hasil Transfer SKS'
                        : 'SK Hasil Perolehan SKS',
                Content: initialTemplate as unknown as Prisma.InputJsonValue,
            },
            select: { Content: true, UpdatedAt: true },
        })
    }

    return c.json({
        template:
            normalizeSkHasilTemplate(saved.Content) ??
            cloneDefaultSkHasilTemplate(variant),
        updatedAt: saved.UpdatedAt.toISOString(),
    })
})

app.put('/', async (c) => {
    const variant = parseVariant(c.req.query('variant'))
    if (!variant) {
        return c.json({ message: 'Varian SK tidak valid.' }, 400)
    }
    const body: unknown = await c.req.json()
    const rawTemplate =
        body && typeof body === 'object' && 'template' in body
            ? (body as { template: unknown }).template
            : null
    const template = normalizeSkHasilTemplate(rawTemplate)

    if (!template) {
        return c.json(
            { message: 'Format template SK hasil tidak valid.' },
            400
        )
    }

    const saved = await prisma.documentTemplate.upsert({
        where: { Type: SK_HASIL_TEMPLATE_TYPES[variant] },
        create: {
            Type: SK_HASIL_TEMPLATE_TYPES[variant],
            Name:
                variant === 'transfer'
                    ? 'SK Hasil Transfer SKS'
                    : 'SK Hasil Perolehan SKS',
            Content: template as unknown as Prisma.InputJsonValue,
        },
        update: {
            Name:
                variant === 'transfer'
                    ? 'SK Hasil Transfer SKS'
                    : 'SK Hasil Perolehan SKS',
            Content: template as unknown as Prisma.InputJsonValue,
        },
        select: { Content: true, UpdatedAt: true },
    })

    return c.json({
        template:
            normalizeSkHasilTemplate(saved.Content) ??
            cloneDefaultSkHasilTemplate(variant),
        updatedAt: saved.UpdatedAt.toISOString(),
    })
})

function parseVariant(value: string | undefined): SkHasilTemplateVariant | null {
    return value === 'transfer' || value === 'perolehan' ? value : null
}

export const GET = handle(app)
export const PUT = handle(app)
