import { Kecamatan } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { withApiAuth } from '@/middlewares/api-auth';
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/area/kecamatan')

app.use('*', withApiAuth); 

app.get('/', async (c) => {
    const id = c.req.query('id')
    const kabupatenId = c.req.query('kabupatenId')

    let data =  null;
    if(kabupatenId) {
        data = await prisma.kecamatan.findMany({
            where: {
                KabupatenId: kabupatenId
            }
        })
    } else {
        data = (id) ? await prisma.kecamatan.findFirst({where: {KecamatanId: id}}) : await prisma.kecamatan.findMany();
    }

    return c.json(data);
})


app.post('/', async (c) => {
    const body: Kecamatan = await c.req.json()
    
    const data = await prisma.kecamatan.create({
        data: {
            Nama: body.Nama,
            KabupatenId: body.KabupatenId
        }
    })

    return c.json(data)
})

app.put('/', async (c) => {
    const body: Kecamatan = await c.req.json()

    const data = await prisma.kecamatan.update({
        data: {
            Nama: body.Nama,
            KabupatenId: body.KabupatenId
        },
        where: {
            KecamatanId: body.KecamatanId
        }
    })

    return c.json(data)
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    await prisma.kecamatan.delete({
        where: {
            KecamatanId: id
        }
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
