import { MahasiswaKonferensi, PrismaClient } from '@/generated/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/kelengkapan-dokumen/konferensi-seminar')
const prisma = new PrismaClient()

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const id = c.req.query('id')
    const pendaftaranId = c.req.query('pendaftaranId')

    let data = null;
    if(pendaftaranId) {
        data = await prisma.mahasiswaKonferensi.findMany({
            where: {
                PendaftaranId: pendaftaranId
            }
        });
    } else {
        data = (id) ? await prisma.mahasiswaKonferensi.findFirst({where: {MahasiswaKonferensiId: id}}) : await prisma.mahasiswaKonferensi.findMany()
    }

    return c.json(data)
})

app.post('/', async (c) => {
    const body: MahasiswaKonferensi = await c.req.json()

    const data = await prisma.mahasiswaKonferensi.create({
        data: {
            PendaftaranId: body.PendaftaranId,
            Tahun: body.Tahun,
            JudulSeminar: body.JudulSeminar,
            Penyelenggara: body.Penyelenggara,
            StatusKeikutsertaan: body.StatusKeikutsertaan,
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
        }
    })

    return c.json(data)
})

app.put('/', async (c) => {
    const body: MahasiswaKonferensi = await c.req.json()

    const data = await prisma.mahasiswaKonferensi.update({
        data: {
            PendaftaranId: body.PendaftaranId,
            Tahun: body.Tahun,
            JudulSeminar: body.JudulSeminar,
            Penyelenggara: body.Penyelenggara,
            StatusKeikutsertaan: body.StatusKeikutsertaan,
            UpdatedAt: new Date(),
        },
        where: {
            MahasiswaKonferensiId: body.MahasiswaKonferensiId
        }
    })

    return c.json(data)
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    await prisma.mahasiswaKonferensi.delete({
        where: {
            MahasiswaKonferensiId: id
        }
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
