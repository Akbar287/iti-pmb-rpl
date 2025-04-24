import { PekerjaanMahasiswa, PrismaClient } from '@/generated/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/kelengkapan-dokumen/pekerjaan')
const prisma = new PrismaClient()

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const id = c.req.query('id')
    const pendaftaranId = c.req.query('pendaftaranId')

    let data = null;
    if(pendaftaranId) {
        data = await prisma.pekerjaanMahasiswa.findMany({
            where: {
                PendaftaranId: pendaftaranId
            }
        });
    } else {
        data = (id) ? await prisma.pekerjaanMahasiswa.findFirst({where: {PekerjaanMahasiswaId: id}}) : await prisma.pekerjaanMahasiswa.findMany()
    }

    return c.json(data)
})

app.post('/', async (c) => {
    const body: PekerjaanMahasiswa = await c.req.json()

    const data = await prisma.pekerjaanMahasiswa.create({
        data: {
            PendaftaranId: body.PendaftaranId,
            AlamatId: body.AlamatId,
            InstitusiTempatBekerja: body.InstitusiTempatBekerja,
            Jabatan: body.Jabatan,
            StatusPekerjaan: body.StatusPekerjaan,
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
        }
    })

    return c.json(data)
})

app.put('/', async (c) => {
    const body: PekerjaanMahasiswa = await c.req.json()

    const data = await prisma.pekerjaanMahasiswa.update({
        data: {
            PendaftaranId: body.PendaftaranId,
            AlamatId: body.AlamatId,
            InstitusiTempatBekerja: body.InstitusiTempatBekerja,
            Jabatan: body.Jabatan,
            StatusPekerjaan: body.StatusPekerjaan,
            UpdatedAt: new Date(),
        },
        where: {
            PekerjaanMahasiswaId: body.PekerjaanMahasiswaId
        }
    })

    return c.json(data)
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    await prisma.pekerjaanMahasiswa.delete({
        where: {
            PekerjaanMahasiswaId: id
        }
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
