import { MahasiswaPendidikan } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/kelengkapan-dokumen/pendidikan')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const id = c.req.query('id')
    const pendaftaranId = c.req.query('pendaftaranId')
    let data = null
    if (pendaftaranId) {
        data = await prisma.mahasiswaPendidikan.findMany({
            where: {
                PendaftaranId: pendaftaranId,
            },
        })
    } else {
        data = id
            ? await prisma.mahasiswaPendidikan.findFirst({where: { MahasiswaPendidikanId: id },}) : await prisma.mahasiswaPendidikan.findMany()
    }

    return c.json(data)
})

app.post('/', async (c) => {
    const body: MahasiswaPendidikan = await c.req.json()

    const data = await prisma.mahasiswaPendidikan.create({
        data: {
            PendaftaranId: body.PendaftaranId,
            NamaSekolah: body.NamaSekolah,
            TahunLulus: body.TahunLulus,
            Jurusan: body.Jurusan,
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
        },
    })

    return c.json(data)
})

app.put('/', async (c) => {
    const body: MahasiswaPendidikan = await c.req.json()

    const data = await prisma.mahasiswaPendidikan.update({
        data: {
            PendaftaranId: body.PendaftaranId,
            NamaSekolah: body.NamaSekolah,
            TahunLulus: body.TahunLulus,
            Jurusan: body.Jurusan,
            UpdatedAt: new Date(),
        },
        where: {
            MahasiswaPendidikanId: body.MahasiswaPendidikanId,
        },
    })

    return c.json(data)
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    await prisma.mahasiswaPendidikan.delete({
        where: {
            MahasiswaPendidikanId: id,
        },
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
