import { InformasiKependudukan } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/kelengkapan-dokumen/informasi-kependudukan')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const id = c.req.query('id')
    const pendaftaranId = c.req.query('pendaftaranId')

    let data = null;
    if(pendaftaranId) {
        data = await prisma.informasiKependudukan.findFirst({
            where: {
                PendaftaranId: pendaftaranId
            }
        });
    } else {
        data = (id) ? await prisma.informasiKependudukan.findFirst({where: {InformasiKependudukanId: id}}) : await prisma.informasiKependudukan.findMany()
    }

    return c.json(data)
})

app.post('/', async (c) => {
    const body: InformasiKependudukan = await c.req.json()

    const data = await prisma.informasiKependudukan.create({
        data: {
            PendaftaranId: body.PendaftaranId,
            NoKk: body.NoKk,
            NoNik: body.NoNik,
            Suku: body.Suku,
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
        }
    })

    return c.json(data)
})

app.put('/', async (c) => {
    const body: InformasiKependudukan = await c.req.json()

    const data = await prisma.informasiKependudukan.update({
        data: {
            PendaftaranId: body.PendaftaranId,
            NoKk: body.NoKk,
            NoNik: body.NoNik,
            Suku: body.Suku,
            UpdatedAt: new Date(),
        },
        where: {
            InformasiKependudukanId: body.InformasiKependudukanId
        }
    })

    return c.json(data)
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    await prisma.informasiKependudukan.delete({
        where: {
            InformasiKependudukanId: id
        }
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
