import { Country } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { withApiAuth } from '@/middlewares/api-auth';
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/area/country')

app.use('*', withApiAuth); 

app.get('/', async (c) => {
    const id = c.req.query('id')

    const data = (id) ? await prisma.country.findFirst({where: {CountryId: id}}) : await prisma.country.findMany();

    return c.json(data);
})


app.post('/', async (c) => {
    const body: Country = await c.req.json()
    
    const data = await prisma.country.create({
        data: {
            Nama: body.Nama,
            CountryId: body.CountryId
        }
    })

    return c.json(data)
})

app.put('/', async (c) => {
    const body: Country = await c.req.json()

    const data = await prisma.country.update({
        data: {
            Nama: body.Nama
        },
        where: {
            CountryId: body.CountryId
        }
    })

    return c.json(data)
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    await prisma.country.delete({
        where: {
            CountryId: id
        }
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
