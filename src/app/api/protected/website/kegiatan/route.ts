import { Prisma, SettingKegiatan } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/website/kegiatan')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const id = c.req.query('id')
    const page = Number(c.req.query('page') ?? '1')
    const limit = Number(c.req.query('limit') ?? '10')
    const search = c.req.query('search') ?? ''

    let data = null
    if (id) {
        data = await prisma.settingKegiatan.findFirst({ where: { SettingKegiatanId: id } })
    } else if (page && limit) {
        let where: Prisma.SettingKegiatanWhereInput = search
            ? {
                  OR: [{ Nama: { contains: search, mode: 'insensitive' } }, {Lokasi: { contains: search, mode: 'insensitive'}}],
              }
            : {}

        const [data, total] = await Promise.all([
            prisma.settingKegiatan.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { Nama: 'asc' },
            }),

            prisma.settingKegiatan.count({ where }),
        ])

        return c.json<{
            data: SettingKegiatan[]
            page: number
            limit: number
            totalElement: number
            totalPage: number
            isFirst: boolean
            isLast: boolean
            hasNext: boolean
            hasPrevious: boolean
        }>({
            page: page,
            limit: limit,
            data: data,
            totalElement: total,
            totalPage: Math.ceil(total / limit),
            isFirst: page === 1,
            isLast:
                page === Math.ceil(total / limit) ||
                Math.ceil(total / limit) === 0,
            hasNext: page < Math.ceil(total / limit),
            hasPrevious: page > 1,
        })
    } else {
        data = await prisma.settingKegiatan.findMany()
    }

    return c.json(data)
})

app.post('/', async (c) => {
    const body: SettingKegiatan = await c.req.json()

    const jenis = await prisma.jenisKegiatan.findFirst({
        where: {JenisKegiatanId: body.JenisKegiatanId},
    })

    if(!jenis) {
        return c.json({
            status: 'error',
            message: 'no jenis found',
            data :[]
        })
    }

    const data = await prisma.settingKegiatan.create({
        data: {
            SettingMainPageId: body.SettingMainPageId,
            JenisKegiatanId: body.JenisKegiatanId,
            Nama: body.Nama,
            Lokasi: body.Lokasi, 
            Deskripsi: body.Deskripsi,
            WaktuMulai: body.WaktuMulai,
            WaktuSelesai: body.WaktuSelesai
        },
    })

    return c.json(data)
})

app.put('/', async (c) => {
    const body: SettingKegiatan = await c.req.json()
    const jenis = await prisma.jenisKegiatan.findFirst({
        where: {JenisKegiatanId: body.JenisKegiatanId},
    })

    if(!jenis) {
        return c.json({
            status: 'error',
            message: 'no jenis found',
            data :[]
        })
    }
    const data = await prisma.settingKegiatan.update({
        data: {
            SettingMainPageId: body.SettingMainPageId,
            JenisKegiatanId: body.JenisKegiatanId,
            Nama: body.Nama,
            Lokasi: body.Lokasi, 
            Deskripsi: body.Deskripsi,
            WaktuMulai: body.WaktuMulai,
            WaktuSelesai: body.WaktuSelesai
        },
        where: {
            SettingKegiatanId: body.SettingKegiatanId,
        },
    })

    return c.json(data)
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    await prisma.settingKegiatan.delete({
        where: {
            SettingKegiatanId: id,
        },
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
