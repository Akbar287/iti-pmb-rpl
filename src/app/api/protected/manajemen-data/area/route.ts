import { prisma } from '@/lib/prisma'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/manajemen-data/area')

app.get('/', async (c) => {
    

    return c.json([], 200)
})

export const GET = handle(app)