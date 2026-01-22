import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { UpdateEkuivalenCheckType } from '@/types/EkuivalenCheck'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/asessment/ekuivalen-check')

app.use('*', withApiAuth)

app.post('/', async (c) => {
    const body: UpdateEkuivalenCheckType = await c.req.json()
    const { TranskripNilaiIdSebelum, MataKuliahMahasiswaIdSebelum, TranskripNilaiIdSetelah, MataKuliahMahasiswaIdSetelah, NilaiAsessment, Diakui } = body

    // Check if relation already exists
    const existing = await prisma.transkripNilaiRelation.findFirst({
        where: {
            TranskripNilaiId: TranskripNilaiIdSebelum,
            MataKuliahMahasiswaId: MataKuliahMahasiswaIdSebelum,
        },
    })

    if (existing) {
        await prisma.transkripNilaiRelation.deleteMany({
            where: {
                TranskripNilaiId: TranskripNilaiIdSebelum,
                MataKuliahMahasiswaId: MataKuliahMahasiswaIdSebelum,
            },
        })
    }
    const response = await prisma.transkripNilaiRelation.create({
        data: {
            TranskripNilaiId: TranskripNilaiIdSetelah,
            MataKuliahMahasiswaId: MataKuliahMahasiswaIdSetelah,
            Nilai: NilaiAsessment,
            Diakui: Diakui,
        }
    })

    return c.json(response)
})

app.delete('/', async (c) => {
    const TranskripNilaiId = c.req.query('TranskripNilaiId') ?? ''
    const MataKuliahMahasiswaId = c.req.query('MataKuliahMahasiswaId') ?? ''

    const response = await prisma.transkripNilaiRelation.deleteMany({
        where: {
            TranskripNilaiId: TranskripNilaiId,
            MataKuliahMahasiswaId: MataKuliahMahasiswaId,
        },
    })

    return c.json(response, 200)
})

export const POST = handle(app)
export const DELETE = handle(app)
