import { MahasiswaPelatihanProfessional, PrismaClient } from '@/generated/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/kelengkapan-dokumen/pelatihan-profesional')
const prisma = new PrismaClient()

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const id = c.req.query('id')
    const pendaftaranId = c.req.query('pendaftaranId')

    let data = null;
    if(pendaftaranId) {
        data = await prisma.mahasiswaPelatihanProfessional.findMany({
            where: {
                PendaftaranId: pendaftaranId
            }
        });
    } else {
        data = (id) ? await prisma.mahasiswaPelatihanProfessional.findFirst({where: {MahasiswaPelatihanProfessionalId: id}}) : await prisma.mahasiswaPelatihanProfessional.findMany()
    }

    return c.json(data)
})

app.post('/', async (c) => {
    const body: MahasiswaPelatihanProfessional = await c.req.json()

    const data = await prisma.mahasiswaPelatihanProfessional.create({
        data: {
            PendaftaranId: body.PendaftaranId,
            NamaPelatihan: body.NamaPelatihan,
            Penyelenggara: body.Penyelenggara,
            Mulai: body.Mulai,
            Selesai: body.Selesai,
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
        }
    })

    return c.json(data)
})

app.put('/', async (c) => {
    const body: MahasiswaPelatihanProfessional = await c.req.json()

    const data = await prisma.mahasiswaPelatihanProfessional.update({
        data: {
            PendaftaranId: body.PendaftaranId,
            NamaPelatihan: body.NamaPelatihan,
            Penyelenggara: body.Penyelenggara,
            Mulai: body.Mulai,
            Selesai: body.Selesai,
            UpdatedAt: new Date(),
        },
        where: {
            MahasiswaPelatihanProfessionalId: body.MahasiswaPelatihanProfessionalId
        }
    })

    return c.json(data)
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    await prisma.mahasiswaPelatihanProfessional.delete({
        where: {
            MahasiswaPelatihanProfessionalId: id
        }
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
