import { Pesantren } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/kelengkapan-dokumen/pesantren')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const id = c.req.query('id')
    const pendaftaranId = c.req.query('pendaftaranId')
    let data = null
    if (pendaftaranId) {
        data = await prisma.pesantren.findMany({
            where: {
                PendaftaranId: pendaftaranId,
            },
        })
    } else {
        data = id
            ? await prisma.pesantren.findFirst({where: { PesantrenId: id },}) : await prisma.pesantren.findMany()
    }

    return c.json(data)
})

app.post('/', async (c) => {
    const body: Pesantren = await c.req.json()

    const data = await prisma.pesantren.create({
        data: {
            PendaftaranId: body.PendaftaranId,
            NamaPesantren: body.NamaPesantren,
            LamaPesantren: body.LamaPesantren,
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
        },
    })

    return c.json(data)
})

app.put('/', async (c) => {
    const body: Pesantren = await c.req.json()

    const data = await prisma.pesantren.update({
        data: {
            PendaftaranId: body.PendaftaranId,
            NamaPesantren: body.NamaPesantren,
            LamaPesantren: body.LamaPesantren,
            UpdatedAt: new Date(),
        },
        where: {
            PesantrenId: body.PesantrenId,
        },
    })

    return c.json(data)
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    await prisma.pesantren.delete({
        where: {
            PesantrenId: id,
        },
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
