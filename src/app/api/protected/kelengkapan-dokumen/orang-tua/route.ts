import { OrangTua } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/kelengkapan-dokumen/orang-tua')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const id = c.req.query('id')
    const pendaftaranId = c.req.query('pendaftaranId')

    let data = null;
    if(pendaftaranId) {
        data = await prisma.orangTua.findMany({
            where: {
                PendaftaranId: pendaftaranId
            }
        });
    } else {
        data = (id) ? await prisma.orangTua.findFirst({where: {OrangTuaId: id}}) : await prisma.orangTua.findMany()
    }

    return c.json(data)
})

app.post('/', async (c) => {
    const body: OrangTua = await c.req.json()

    const data = await prisma.orangTua.create({
        data: {
            PendaftaranId: body.PendaftaranId ,
            Nama: body.Nama ,
            Pekerjaan: body.Pekerjaan ,
            JenisOrtu: body.JenisOrtu ,
            Penghasilan: body.Penghasilan ,
            Email: body.Email ,
            NomorHp: body.NomorHp ,
            CreatedAt: new Date() ,
            UpdatedAt: new Date() ,
        }
    })

    return c.json(data)
})

app.put('/', async (c) => {
    const body: OrangTua = await c.req.json()

    const data = await prisma.orangTua.update({
        data: {
            PendaftaranId: body.PendaftaranId ,
            Nama: body.Nama ,
            Pekerjaan: body.Pekerjaan ,
            JenisOrtu: body.JenisOrtu ,
            Penghasilan: body.Penghasilan ,
            Email: body.Email ,
            NomorHp: body.NomorHp ,
            UpdatedAt: new Date() ,
        },
        where: {
            OrangTuaId: body.OrangTuaId
        }
    })

    return c.json(data)
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    await prisma.orangTua.delete({
        where: {
            OrangTuaId: id
        }
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
