import { PrismaClient, Provinsi } from '@/generated/prisma';
import { withApiAuth } from '@/middlewares/api-auth';
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/area/provinsi')
const prisma = new PrismaClient();

app.use('*', withApiAuth); 

app.get('/', async (c) => {
    const id = c.req.query('id')
    const countryId = c.req.query('countryId')

    let data = null;
    if(countryId) {
        data = await prisma.provinsi.findMany({
            where: {
                CountryId: countryId
            }
        });
    } else {
        data = (id) ? await prisma.provinsi.findFirst({where: {ProvinsiId: id}}) : await prisma.provinsi.findMany();
    }

    return c.json(data);
})


app.post('/', async (c) => {
    const body: Provinsi = await c.req.json()
    
    const data = await prisma.provinsi.create({
        data: {
            Nama: body.Nama,
            CountryId: body.CountryId
        }
    })

    return c.json(data)
})

app.put('/', async (c) => {
    const body: Provinsi = await c.req.json()

    const data = await prisma.provinsi.update({
        data: {
            Nama: body.Nama,
            CountryId: body.CountryId
        },
        where: {
            ProvinsiId: body.ProvinsiId
        }
    })

    return c.json(data)
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    await prisma.provinsi.delete({
        where: {
            ProvinsiId: id
        }
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
