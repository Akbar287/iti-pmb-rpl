import { PrismaClient, Kabupaten } from '@/generated/prisma';
import { withApiAuth } from '@/middlewares/api-auth';
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/area/kabupaten')
const prisma = new PrismaClient();

app.use('*', withApiAuth); 

app.get('/', async (c) => {
    const id = c.req.query('id')
    const provinsiId = c.req.query('provinsiId')

    let data = null;
    if(provinsiId) {
        data = await prisma.kabupaten.findMany({
            where: {
                ProvinsiId: provinsiId
            }
        })
    } else {
        data = (id) ? await prisma.kabupaten.findFirst({where: {KabupatenId: id}}) : await prisma.kabupaten.findMany();
    }

    return c.json(data);
})


app.post('/', async (c) => {
    const body: Kabupaten = await c.req.json()
    
    const data = await prisma.kabupaten.create({
        data: {
            Nama: body.Nama,
            ProvinsiId: body.ProvinsiId
        }
    })

    return c.json(data)
})

app.put('/', async (c) => {
    const body: Kabupaten = await c.req.json()

    const data = await prisma.kabupaten.update({
        data: {
            Nama: body.Nama,
            ProvinsiId: body.ProvinsiId
        },
        where: {
            KabupatenId: body.KabupatenId
        }
    })

    return c.json(data)
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    await prisma.kabupaten.delete({
        where: {
            KabupatenId: id
        }
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
