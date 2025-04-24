import { MahasiswaOrganisasiProfesi, PrismaClient } from '@/generated/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/kelengkapan-dokumen/organisasi-profesi')
const prisma = new PrismaClient()

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const id = c.req.query('id')
    const pendaftaranId = c.req.query('pendaftaranId')

    let data = null;
    if(pendaftaranId) {
        data = await prisma.mahasiswaOrganisasiProfesi.findMany({
            where: {
                PendaftaranId: pendaftaranId
            }
        });
    } else {
        data = (id) ? await prisma.mahasiswaOrganisasiProfesi.findFirst({where: {MahasiswaOrganisasiProfesiId: id}}) : await prisma.mahasiswaOrganisasiProfesi.findMany()
    }

    return c.json(data)
})

app.post('/', async (c) => {
    const body: MahasiswaOrganisasiProfesi = await c.req.json()

    const data = await prisma.mahasiswaOrganisasiProfesi.create({
        data: {
            PendaftaranId: body.PendaftaranId,
            Tahun: body.Tahun,
            NamaOrganisasi: body.NamaOrganisasi,
            JenjangAnggotaJabatan: body.JenjangAnggotaJabatan,
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
        }
    })

    return c.json(data)
})

app.put('/', async (c) => {
    const body: MahasiswaOrganisasiProfesi = await c.req.json()

    const data = await prisma.mahasiswaOrganisasiProfesi.update({
        data: {
            PendaftaranId: body.PendaftaranId,
            Tahun: body.Tahun,
            NamaOrganisasi: body.NamaOrganisasi,
            JenjangAnggotaJabatan: body.JenjangAnggotaJabatan,
            UpdatedAt: new Date(),
        },
        where: {
            MahasiswaOrganisasiProfesiId: body.MahasiswaOrganisasiProfesiId
        }
    })

    return c.json(data)
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    await prisma.mahasiswaOrganisasiProfesi.delete({
        where: {
            MahasiswaOrganisasiProfesiId: id
        }
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
