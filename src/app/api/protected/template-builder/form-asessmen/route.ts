import { Prisma } from '@/generated/prisma'
import {
    cloneDefaultFormAssessmentTemplate,
    FORM_ASSESSMENT_TEMPLATE_TYPE,
    normalizeFormAssessmentTemplate,
} from '@/lib/form-assessment-template'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath(
    '/api/protected/template-builder/form-asessmen'
)

app.use('*', withApiAuth)

app.get('/', async (c) => {
    let saved = await prisma.documentTemplate.findUnique({
        where: { Type: FORM_ASSESSMENT_TEMPLATE_TYPE },
        select: { Content: true, UpdatedAt: true },
    })
    if (!saved) {
        const defaultTemplate = cloneDefaultFormAssessmentTemplate()
        saved = await prisma.documentTemplate.create({
            data: {
                Type: FORM_ASSESSMENT_TEMPLATE_TYPE,
                Name: 'Formulir Evaluasi Diri (Form 03)',
                Content: defaultTemplate as unknown as Prisma.InputJsonValue,
            },
            select: { Content: true, UpdatedAt: true },
        })
    }
    const template =
        normalizeFormAssessmentTemplate(saved.Content) ??
        cloneDefaultFormAssessmentTemplate()

    return c.json({
        template,
        updatedAt: saved.UpdatedAt.toISOString(),
    })
})

app.put('/', async (c) => {
    const body: unknown = await c.req.json()
    const rawTemplate =
        body && typeof body === 'object' && 'template' in body
            ? (body as { template: unknown }).template
            : null
    const template = normalizeFormAssessmentTemplate(rawTemplate)

    if (!template) {
        return c.json(
            { message: 'Format template formulir asesmen tidak valid.' },
            400
        )
    }

    const saved = await prisma.documentTemplate.upsert({
        where: { Type: FORM_ASSESSMENT_TEMPLATE_TYPE },
        create: {
            Type: FORM_ASSESSMENT_TEMPLATE_TYPE,
            Name: 'Formulir Evaluasi Diri (Form 03)',
            Content: template as unknown as Prisma.InputJsonValue,
        },
        update: {
            Name: 'Formulir Evaluasi Diri (Form 03)',
            Content: template as unknown as Prisma.InputJsonValue,
        },
        select: { Content: true, UpdatedAt: true },
    })

    return c.json({
        template:
            normalizeFormAssessmentTemplate(saved.Content) ??
            cloneDefaultFormAssessmentTemplate(),
        updatedAt: saved.UpdatedAt.toISOString(),
    })
})

export const GET = handle(app)
export const PUT = handle(app)
