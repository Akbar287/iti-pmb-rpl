import { MahasiswaPiagam, PrismaClient } from '@/generated/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/kelengkapan-dokumen/kejuaraan-piagam')
const prisma = new PrismaClient()

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const id = c.req.query('id')
    const pendaftaranId = c.req.query('pendaftaranId')

    let data = null;
    if(pendaftaranId) {
        data = await prisma.mahasiswaPiagam.findMany({
            where: {
                PendaftaranId: pendaftaranId
            }
        });
    } else {
        data = (id) ? await prisma.mahasiswaPiagam.findFirst({where: {MahasiswaPiagamId: id}}) : await prisma.mahasiswaPiagam.findMany()
    }

    return c.json(data)
})

app.post('/', async (c) => {
    const body: MahasiswaPiagam = await c.req.json()

    const data = await prisma.mahasiswaPiagam.create({
        data: {
            PendaftaranId: body.PendaftaranId,
            BentukPenghargaan: body.BentukPenghargaan,
            PemberiPenghargaan: body.PemberiPenghargaan,
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
        }
    })

    return c.json(data)
})

app.put('/', async (c) => {
    const body: MahasiswaPiagam = await c.req.json()

    const data = await prisma.mahasiswaPiagam.update({
        data: {
            PendaftaranId: body.PendaftaranId,
            BentukPenghargaan: body.BentukPenghargaan,
            PemberiPenghargaan: body.PemberiPenghargaan,
            UpdatedAt: new Date(),
        },
        where: {
            MahasiswaPiagamId: body.MahasiswaPiagamId
        }
    })

    return c.json(data)
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    await prisma.mahasiswaPiagam.delete({
        where: {
            MahasiswaPiagamId: id
        }
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
