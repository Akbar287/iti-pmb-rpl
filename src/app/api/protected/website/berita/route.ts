import { Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { SettingBeritaTypes } from '@/types/WebsiteTypes'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import mime from 'mime'
const app = new Hono().basePath('/api/protected/website/berita')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const id = c.req.query('_id')
    const page = Number(c.req.query('page') ?? '1')
    const limit = Number(c.req.query('limit') ?? '10')
    const search = c.req.query('search') ?? ''

    if (page && limit && id) {
        const where: Prisma.SettingBeritaWhereInput = search
            ? {
                  AND: [
                      { Title: { contains: search, mode: 'insensitive' } },
                      { Deskripsi: { contains: search, mode: 'insensitive' } },
                      {
                          SettingMainPageId: id,
                      },
                  ],
              }
            : { SettingMainPageId: id }

        const [data, total] = await Promise.all([
            prisma.settingBerita.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { Title: 'asc' },
                select: {
                    KategoriBerita: {
                        select: {
                            KategoriBeritaId: true,
                            Nama: true,
                            Color: true,
                        },
                    },
                    SettingBeritaId: true,
                    SettingMainPageId: true,
                    Title: true,
                    Deskripsi: true,
                    Gambar: true,
                    Populer: true,
                    Waktu: true,
                },
            }),

            prisma.settingBerita.count({ where }),
        ])

        return c.json<{
            data: SettingBeritaTypes[]
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
                SettingBeritaId: x.SettingBeritaId,
                SettingMainPageId: x.SettingMainPageId,
                Title: x.Title,
                Deskripsi: x.Deskripsi,
                Populer: x.Populer,
                Waktu: x.Waktu,
                NamaKategori: x.KategoriBerita.Nama,
                Color: x.KategoriBerita.Color,
                KategoriBeritaId: x.KategoriBerita.KategoriBeritaId,
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
        const x = await prisma.settingBerita.findFirst({
            where: { SettingBeritaId: id },
            select: {
                KategoriBerita: {
                    select: {
                        KategoriBeritaId: true,
                        Nama: true,
                        Color: true,
                    },
                },
                SettingBeritaId: true,
                SettingMainPageId: true,
                Title: true,
                Deskripsi: true,
                Gambar: true,
                Populer: true,
                Waktu: true,
            },
        })

        if (x) {
            const res: SettingBeritaTypes = {
                SettingBeritaId: x.SettingBeritaId,
                SettingMainPageId: x.SettingMainPageId,
                Title: x.Title,
                Deskripsi: x.Deskripsi,
                Populer: x.Populer,
                Waktu: x.Waktu,
                NamaKategori: x.KategoriBerita.Nama,
                Color: x.KategoriBerita.Color,
                KategoriBeritaId: x.KategoriBerita.KategoriBeritaId,
            }
            return c.json(res)
        } else {
            return c.json({
                status: 'not found',
                message: 'Not Found',
                data: [],
            })
        }
    } else {
        return c.json({
            status: 'not found',
            message: 'Not Found',
            data: [],
        })
    }
})

app.post('/', async (c) => {
    const body = await c.req.parseBody()

    const request: SettingBeritaTypes =
        typeof body.request === 'string'
            ? JSON.parse(body.request)
            : body.request
    const fileBg = body.fileBg

    if (!fileBg || !(fileBg instanceof File)) {
        return c.json(
            { status: 'error', message: 'File Bg is required', data: [] },
            { status: 400 }
        )
    }

    const MAX_SIZE_MB = 10
    if (fileBg.size > MAX_SIZE_MB * 1024 * 1024) {
        return c.json(
            {
                status: 'error',
                message: 'Ukuran file Bg melebihi 10MB',
                data: [],
            },
            { status: 400 }
        )
    }

    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/webp']
    const allowedExtensions = ['png', 'jpg', 'jpeg', 'webp']

    const fileExt = mime.getExtension(fileBg.type) || ''

    if (
        !allowedMimeTypes.includes(fileBg.type) ||
        !allowedExtensions.includes(fileExt)
    ) {
        return c.json(
            {
                status: 'error',
                message:
                    'Format file tidak valid. Hanya format Gambar (PNG, JPG, WebP) yang diperbolehkan.',
                data: [],
            },
            { status: 400 }
        )
    }

    const bufferBg = Buffer.from(await fileBg.arrayBuffer())

    const x = await prisma.settingBerita.create({
        data: {
            SettingBeritaId: request.SettingBeritaId,
            SettingMainPageId: request.SettingMainPageId,
            Title: request.Title,
            Deskripsi: request.Deskripsi,
            Populer: request.Populer,
            Waktu: request.Waktu,
            KategoriBeritaId: request.KategoriBeritaId,
            Gambar: bufferBg,
        },
        select: {
            KategoriBerita: {
                select: {
                    KategoriBeritaId: true,
                    Nama: true,
                    Color: true,
                },
            },
            SettingBeritaId: true,
            SettingMainPageId: true,
            Title: true,
            Deskripsi: true,
            Populer: true,
            Waktu: true,
            KategoriBeritaId: true,
        },
    })

    const res: SettingBeritaTypes = {
        SettingBeritaId: x.SettingBeritaId,
        SettingMainPageId: x.SettingMainPageId,
        Title: x.Title,
        Deskripsi: x.Deskripsi,
        Populer: x.Populer,
        Waktu: x.Waktu,
        NamaKategori: x.KategoriBerita.Nama,
        Color: x.KategoriBerita.Color,
        KategoriBeritaId: x.KategoriBerita.KategoriBeritaId,
    }

    return c.json(res)
})

app.put('/', async (c) => {
    let type = c.req.query('_m')
    let id = c.req.query('_i')
    const body = await c.req.parseBody()

    if(type === '_p' && id) {
        const data = await prisma.settingBerita.findFirst({
            where: {SettingBeritaId: id},
        })

        const oldPopuler = await prisma.settingBerita.findFirst({
            where: {Populer: true},
        })

        if(data && oldPopuler) {
            await prisma.settingBerita.update({
                where: {SettingBeritaId: oldPopuler.SettingBeritaId}, data: {Populer: false}
            })
            await prisma.settingBerita.update({
                where: {SettingBeritaId: id}, data: {Populer: true}
            })

            return c.json({
                status: 'success',
                message: 'Populer has been executed', 
                data: null
            })
        } else {
            return c.json(
                { status: 'error', message: 'File Bg is required', data: [] },
                { status: 400 }
            )
        }
    } else if(type === '_i' && body) {
        const request: SettingBeritaTypes =
            typeof body.request === 'string'
                ? JSON.parse(body.request)
                : body.request
        const fileBg = body.fileBg
    
        if (!fileBg || !(fileBg instanceof File)) {
            return c.json(
                { status: 'error', message: 'File Bg is required', data: [] },
                { status: 400 }
            )
        }
    
        const MAX_SIZE_MB = 10
        if (fileBg.size > MAX_SIZE_MB * 1024 * 1024) {
            return c.json(
                {
                    status: 'error',
                    message: 'Ukuran file Bg melebihi 10MB',
                    data: [],
                },
                { status: 400 }
            )
        }
    
        const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/webp']
        const allowedExtensions = ['png', 'jpg', 'jpeg', 'webp']
    
        const fileExt = mime.getExtension(fileBg.type) || ''
    
        if (
            !allowedMimeTypes.includes(fileBg.type) ||
            !allowedExtensions.includes(fileExt)
        ) {
            return c.json(
                {
                    status: 'error',
                    message:
                        'Format file tidak valid. Hanya format Gambar (PNG, JPG, WebP) yang diperbolehkan.',
                    data: [],
                },
                { status: 400 }
            )
        }
    
        const bufferBg = Buffer.from(await fileBg.arrayBuffer())
    
        const x = await prisma.settingBerita.update({
            where: {
                SettingBeritaId: request.SettingBeritaId,
            },
            data: {
                SettingBeritaId: request.SettingBeritaId,
                SettingMainPageId: request.SettingMainPageId,
                Title: request.Title,
                Deskripsi: request.Deskripsi,
                Populer: request.Populer,
                Waktu: request.Waktu,
                KategoriBeritaId: request.KategoriBeritaId,
                Gambar: bufferBg,
            },
            select: {
                KategoriBerita: {
                    select: {
                        KategoriBeritaId: true,
                        Nama: true,
                        Color: true,
                    },
                },
                SettingBeritaId: true,
                SettingMainPageId: true,
                Title: true,
                Deskripsi: true,
                Populer: true,
                Waktu: true,
                KategoriBeritaId: true,
            },
        })
    
        const res: SettingBeritaTypes = {
            SettingBeritaId: x.SettingBeritaId,
            SettingMainPageId: x.SettingMainPageId,
            Title: x.Title,
            Deskripsi: x.Deskripsi,
            Populer: x.Populer,
            Waktu: x.Waktu,
            NamaKategori: x.KategoriBerita.Nama,
            Color: x.KategoriBerita.Color,
            KategoriBeritaId: x.KategoriBerita.KategoriBeritaId,
        }
    
        return c.json(res)
    } else {
        return c.json(
                { status: 'error', message: 'cannot execute', data: [] },
                { status: 400 }
            )
    }

})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    await prisma.settingBerita.delete({
        where: {
            SettingBeritaId: id,
        },
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
