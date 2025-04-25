import { Desa } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { withApiAuth } from '@/middlewares/api-auth';
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/area/desa')

app.use('*', withApiAuth); 

app.get('/', async (c) => {
    const id = c.req.query('id')
    const kecamatanId = c.req.query('kecamatanId')

    let data = null;
    if(kecamatanId) {
        data = await prisma.desa.findMany({
            where: {
                KecamatanId: kecamatanId
            }
        })
    } else {
        data = (id) ? await prisma.desa.findFirst({where: {DesaId: id}}) : await prisma.desa.findMany();
    }

    return c.json(data);
})


app.post('/', async (c) => {
    const body: Desa = await c.req.json()
    
    const data = await prisma.desa.create({
        data: {
            Nama: body.Nama,
            KecamatanId: body.KecamatanId
        }
    })

    return c.json(data)
})

app.put('/', async (c) => {
    const body: Desa = await c.req.json()

    const data = await prisma.desa.update({
        data: {
            Nama: body.Nama,
            KecamatanId: body.KecamatanId
        },
        where: {
            DesaId: body.DesaId
        }
    })

    return c.json(data)
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    await prisma.desa.delete({
        where: {
            DesaId: id
        }
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
