import { Prisma, SettingKegiatan } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { SettingKegiatanTypes } from '@/types/WebsiteTypes'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/website/kegiatan')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const id = c.req.query('id')
    const page = Number(c.req.query('page') ?? '1')
    const limit = Number(c.req.query('limit') ?? '10')
    const search = c.req.query('search') ?? ''

    if (page && limit && id) {
        let where: Prisma.SettingKegiatanWhereInput = search
            ? {
                  OR: [
                      { Nama: { contains: search, mode: 'insensitive' } },
                      { Lokasi: { contains: search, mode: 'insensitive' } },
                      { SettingMainPageId: id },
                  ],
              }
            : { SettingMainPageId: id }

        const [data, total] = await Promise.all([
            prisma.settingKegiatan.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { Nama: 'asc' },
                select: {
                    Nama: true,
                    SettingMainPageId: true,
                    JenisKegiatanId: true,
                    SettingKegiatanId: true,
                    Lokasi: true,
                    Deskripsi: true,
                    WaktuMulai: true,
                    WaktuSelesai: true,
                    JenisKegiatan: {
                        select: {
                            Nama: true,
                            Color: true,
                        },
                    },
                },
            }),

            prisma.settingKegiatan.count({ where }),
        ])

        return c.json<{
            data: SettingKegiatanTypes[]
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
            data: data.map((x) => ({
                Nama: x.Nama,
                SettingMainPageId: x.SettingMainPageId,
                JenisKegiatanId: x.JenisKegiatanId,
                SettingKegiatanId: x.SettingKegiatanId,
                Lokasi: x.Lokasi,
                Deskripsi: x.Deskripsi,
                WaktuMulai: x.WaktuMulai,
                WaktuSelesai: x.WaktuSelesai,
                NamaJenis: x.JenisKegiatan.Nama,
                Color: x.JenisKegiatan.Color,
            })),
            totalElement: total,
            totalPage: Math.ceil(total / limit),
            isFirst: page === 1,
            isLast:
                page === Math.ceil(total / limit) ||
                Math.ceil(total / limit) === 0,
            hasNext: page < Math.ceil(total / limit),
            hasPrevious: page > 1,
        })
    } else if (id) {
        const x = await prisma.settingKegiatan.findFirst({
            where: { SettingKegiatanId: id },
            select: {
                Nama: true,
                SettingMainPageId: true,
                JenisKegiatanId: true,
                SettingKegiatanId: true,
                Lokasi: true,
                Deskripsi: true,
                WaktuMulai: true,
                WaktuSelesai: true,
                JenisKegiatan: {
                    select: {
                        Nama: true,
                        Color: true,
                    },
                },
            },
        })

        if (x) {
            const res: SettingKegiatanTypes = {
                Nama: x.Nama,
                SettingMainPageId: x.SettingMainPageId,
                JenisKegiatanId: x.JenisKegiatanId,
                SettingKegiatanId: x.SettingKegiatanId,
                Lokasi: x.Lokasi,
                Deskripsi: x.Deskripsi,
                WaktuMulai: x.WaktuMulai,
                WaktuSelesai: x.WaktuSelesai,
                NamaJenis: x.JenisKegiatan.Nama,
                Color: x.JenisKegiatan.Color,
            }
            return c.json(res)
        } else {
            return c.json(null)
        }
    } else {
        const data = await prisma.settingKegiatan.findMany({
            select: {
                Nama: true,
                SettingMainPageId: true,
                JenisKegiatanId: true,
                SettingKegiatanId: true,
                Lokasi: true,
                Deskripsi: true,
                WaktuMulai: true,
                WaktuSelesai: true,
                JenisKegiatan: {
                    select: {
                        Nama: true,
                        Color: true,
                    },
                },
            },
        })
        const res: SettingKegiatanTypes[] = data.map((x) => ({
            Nama: x.Nama,
            SettingMainPageId: x.SettingMainPageId,
            JenisKegiatanId: x.JenisKegiatanId,
            SettingKegiatanId: x.SettingKegiatanId,
            Lokasi: x.Lokasi,
            Deskripsi: x.Deskripsi,
            WaktuMulai: x.WaktuMulai,
            WaktuSelesai: x.WaktuSelesai,
            NamaJenis: x.JenisKegiatan.Nama,
            Color: x.JenisKegiatan.Color,
        }))
        return c.json(res)
    }
})

app.post('/', async (c) => {
    const body: SettingKegiatan = await c.req.json()

    const jenis = await prisma.jenisKegiatan.findFirst({
        where: { JenisKegiatanId: body.JenisKegiatanId },
    })

    if (!jenis) {
        return c.json({
            status: 'error',
            message: 'no jenis found',
            data: [],
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
            WaktuSelesai: body.WaktuSelesai,
        },
        select: {
            Nama: true,
            SettingMainPageId: true,
            JenisKegiatanId: true,
            SettingKegiatanId: true,
            Lokasi: true,
            Deskripsi: true,
            WaktuMulai: true,
            WaktuSelesai: true,
            JenisKegiatan: {
                select: {
                    Nama: true,
                    Color: true,
                },
            },
        },
    })

    const res: SettingKegiatanTypes = {
        Nama: data.Nama,
        SettingMainPageId: data.SettingMainPageId,
        JenisKegiatanId: data.JenisKegiatanId,
        SettingKegiatanId: data.SettingKegiatanId,
        Lokasi: data.Lokasi,
        Deskripsi: data.Deskripsi,
        WaktuMulai: data.WaktuMulai,
        WaktuSelesai: data.WaktuSelesai,
        NamaJenis: data.JenisKegiatan.Nama,
        Color: data.JenisKegiatan.Color,
    }
    return c.json(res)
})

app.put('/', async (c) => {
    const body: SettingKegiatan = await c.req.json()
    const jenis = await prisma.jenisKegiatan.findFirst({
        where: { JenisKegiatanId: body.JenisKegiatanId },
    })

    if (!jenis) {
        return c.json({
            status: 'error',
            message: 'no jenis found',
            data: [],
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
            WaktuSelesai: body.WaktuSelesai,
        },
        where: {
            SettingKegiatanId: body.SettingKegiatanId,
        },
        select: {
            Nama: true,
            SettingMainPageId: true,
            JenisKegiatanId: true,
            SettingKegiatanId: true,
            Lokasi: true,
            Deskripsi: true,
            WaktuMulai: true,
            WaktuSelesai: true,
            JenisKegiatan: {
                select: {
                    Nama: true,
                    Color: true,
                },
            },
        },
    })

    const res: SettingKegiatanTypes = {
        Nama: data.Nama,
        SettingMainPageId: data.SettingMainPageId,
        JenisKegiatanId: data.JenisKegiatanId,
        SettingKegiatanId: data.SettingKegiatanId,
        Lokasi: data.Lokasi,
        Deskripsi: data.Deskripsi,
        WaktuMulai: data.WaktuMulai,
        WaktuSelesai: data.WaktuSelesai,
        NamaJenis: data.JenisKegiatan.Nama,
        Color: data.JenisKegiatan.Color,
    }
    return c.json(res)
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
