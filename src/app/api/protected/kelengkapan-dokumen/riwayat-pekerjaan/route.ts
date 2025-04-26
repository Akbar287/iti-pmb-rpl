import { MahasiswaRiwayatPekerjaan } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/kelengkapan-dokumen/riwayat-pekerjaan')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const id = c.req.query('id')
    const pendaftaranId = c.req.query('pendaftaranId')
    let data = null
    if (pendaftaranId) {
        data = await prisma.mahasiswaRiwayatPekerjaan.findMany({
            where: {
                PendaftaranId: pendaftaranId,
            },
        })
    } else {
        data = id
            ? await prisma.mahasiswaRiwayatPekerjaan.findFirst({where: { MahasiswaRiwayatPekerjaanId: id },}) : await prisma.mahasiswaRiwayatPekerjaan.findMany()
    }

    return c.json(data)
})

app.post('/', async (c) => {
    const body: MahasiswaRiwayatPekerjaan = await c.req.json()

    const data = await prisma.mahasiswaRiwayatPekerjaan.create({
        data: {
            PendaftaranId: body.PendaftaranId,
            Nama: body.Nama,
            PosisiJabatan: body.PosisiJabatan,
            Alamat: body.Alamat,
            UraianTugas: body.UraianTugas,
            MulaiBekerja: body.MulaiBekerja,
            SelesaiBekerja: body.SelesaiBekerja,
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
        },
    })

    return c.json(data)
})

app.put('/', async (c) => {
    const body: MahasiswaRiwayatPekerjaan = await c.req.json()

    const data = await prisma.mahasiswaRiwayatPekerjaan.update({
        data: {
            PendaftaranId: body.PendaftaranId,
            Nama: body.Nama,
            PosisiJabatan: body.PosisiJabatan,
            Alamat: body.Alamat,
            UraianTugas: body.UraianTugas,
            MulaiBekerja: body.MulaiBekerja,
            SelesaiBekerja: body.SelesaiBekerja,
            UpdatedAt: new Date(),
        },
        where: {
            MahasiswaRiwayatPekerjaanId: body.MahasiswaRiwayatPekerjaanId,
        },
    })

    return c.json(data)
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    await prisma.mahasiswaRiwayatPekerjaan.delete({
        where: {
            MahasiswaRiwayatPekerjaanId: id,
        },
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
