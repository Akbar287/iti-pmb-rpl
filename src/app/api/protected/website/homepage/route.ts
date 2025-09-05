import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { SettingMainPageTypes } from '@/types/WebsiteTypes'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import mime from 'mime'
const app = new Hono().basePath('/api/protected/website/homepage')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const id = c.req.param('_id') as string
    const data = await prisma.settingMainPage.findFirst({
        where: { SettingMainPageId: id },
    })

    if (data) {
        const res: SettingMainPageTypes = {
            UniversityId: data.UniversityId,
            SettingMainPageId: data.SettingMainPageId,
            TextMainPage1: data.TextMainPage1,
            TextMainPage2: data.TextMainPage2,
            TextMainPage3: data.TextMainPage3,
            SelayangPandangText: data.SelayangPandangText,
            SelayangPandangDeskripsi: data.SelayangPandangDeskripsi,
            WhyText: data.WhyText,
            WhyDeskripsi: data.WhyDeskripsi,
            CommunityText: data.CommunityText,
            CommunityDeskripsi: data.CommunityDeskripsi,
            KegiatanText: data.KegiatanText,
            KegiatanDeskripsi: data.KegiatanDeskripsi,
            BeritaText: data.BeritaText,
            BeritaDeskripsi: data.BeritaDeskripsi,
            TestomoniText: data.TestomoniText,
            TestomoniDeskripsi: data.TestomoniDeskripsi,
        }
        return c.json(res)
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

    const request: SettingMainPageTypes =
        typeof body.request === 'string'
            ? JSON.parse(body.request)
            : body.request
    const fileBg = body.fileBg
    const selayangBg = body.selayangBg

    if (!fileBg || !(fileBg instanceof File)) {
        return c.json(
            { status: 'error', message: 'File Bg is required', data: [] },
            { status: 400 }
        )
    }
    if (!selayangBg || !(selayangBg instanceof File)) {
        return c.json(
            { status: 'error', message: 'selayang Bg is required', data: [] },
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

    if (selayangBg.size > MAX_SIZE_MB * 1024 * 1024) {
        return c.json(
            {
                status: 'error',
                message: 'Ukuran selayang Bg melebihi 10MB',
                data: [],
            },
            { status: 400 }
        )
    }

    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/webp']
    const allowedExtensions = ['png', 'jpg', 'jpeg', 'webp']

    const fileExt = mime.getExtension(fileBg.type) || ''
    const fileSExt = mime.getExtension(selayangBg.type) || ''

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

    if (
        !allowedMimeTypes.includes(selayangBg.type) ||
        !allowedExtensions.includes(fileSExt)
    ) {
        return c.json(
            {
                status: 'error',
                message:
                    'Format selayang tidak valid. Hanya format Gambar (PNG, JPG, WebP) yang diperbolehkan.',
                data: [],
            },
            { status: 400 }
        )
    }

    const bufferBg = Buffer.from(await fileBg.arrayBuffer())
    const bufferSg = Buffer.from(await selayangBg.arrayBuffer())

    const data = await prisma.settingMainPage.create({
        data: {
            UniversityId: request.UniversityId,
            BackgroundFileUtama: bufferBg,
            SelayangPandangBackgroundFile: bufferSg,
            TextMainPage1: request.TextMainPage1,
            TextMainPage2: request.TextMainPage2,
            TextMainPage3: request.TextMainPage3,
            SelayangPandangText: request.SelayangPandangText,
            SelayangPandangDeskripsi: request.SelayangPandangDeskripsi,
            WhyText: request.WhyText,
            WhyDeskripsi: request.WhyDeskripsi,
            CommunityText: request.CommunityText,
            CommunityDeskripsi: request.CommunityDeskripsi,
            KegiatanText: request.KegiatanText,
            KegiatanDeskripsi: request.KegiatanDeskripsi,
            BeritaText: request.BeritaText,
            BeritaDeskripsi: request.BeritaDeskripsi,
            TestomoniText: request.TestomoniText,
            TestomoniDeskripsi: request.TestomoniDeskripsi,
        },
    })

    const res: SettingMainPageTypes = {
            UniversityId: data.UniversityId,
            SettingMainPageId: data.SettingMainPageId,
            TextMainPage1: data.TextMainPage1,
            TextMainPage2: data.TextMainPage2,
            TextMainPage3: data.TextMainPage3,
            SelayangPandangText: data.SelayangPandangText,
            SelayangPandangDeskripsi: data.SelayangPandangDeskripsi,
            WhyText: data.WhyText,
            WhyDeskripsi: data.WhyDeskripsi,
            CommunityText: data.CommunityText,
            CommunityDeskripsi: data.CommunityDeskripsi,
            KegiatanText: data.KegiatanText,
            KegiatanDeskripsi: data.KegiatanDeskripsi,
            BeritaText: data.BeritaText,
            BeritaDeskripsi: data.BeritaDeskripsi,
            TestomoniText: data.TestomoniText,
            TestomoniDeskripsi: data.TestomoniDeskripsi,
        }

    return c.json(res)
})

app.put('/', async (c) => {
    const body = await c.req.parseBody()

    const request: SettingMainPageTypes =
        typeof body.request === 'string'
            ? JSON.parse(body.request)
            : body.request
    const fileBg = body.fileBg
    const selayangBg = body.selayangBg

    if (!fileBg || !(fileBg instanceof File)) {
        return c.json(
            { status: 'error', message: 'File Bg is required', data: [] },
            { status: 400 }
        )
    }
    if (!selayangBg || !(selayangBg instanceof File)) {
        return c.json(
            { status: 'error', message: 'selayang Bg is required', data: [] },
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

    if (selayangBg.size > MAX_SIZE_MB * 1024 * 1024) {
        return c.json(
            {
                status: 'error',
                message: 'Ukuran selayang Bg melebihi 10MB',
                data: [],
            },
            { status: 400 }
        )
    }

    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/webp']
    const allowedExtensions = ['png', 'jpg', 'jpeg', 'webp']

    const fileExt = mime.getExtension(fileBg.type) || ''
    const fileSExt = mime.getExtension(selayangBg.type) || ''

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

    if (
        !allowedMimeTypes.includes(selayangBg.type) ||
        !allowedExtensions.includes(fileSExt)
    ) {
        return c.json(
            {
                status: 'error',
                message:
                    'Format selayang tidak valid. Hanya format Gambar (PNG, JPG, WebP) yang diperbolehkan.',
                data: [],
            },
            { status: 400 }
        )
    }

    const bufferBg = Buffer.from(await fileBg.arrayBuffer())
    const bufferSg = Buffer.from(await selayangBg.arrayBuffer())

    const data = await prisma.settingMainPage.update({
        where: {
            SettingMainPageId: request.SettingMainPageId
        },
        data: {
            UniversityId: request.UniversityId,
            BackgroundFileUtama: bufferBg,
            SelayangPandangBackgroundFile: bufferSg,
            TextMainPage1: request.TextMainPage1,
            TextMainPage2: request.TextMainPage2,
            TextMainPage3: request.TextMainPage3,
            SelayangPandangText: request.SelayangPandangText,
            SelayangPandangDeskripsi: request.SelayangPandangDeskripsi,
            WhyText: request.WhyText,
            WhyDeskripsi: request.WhyDeskripsi,
            CommunityText: request.CommunityText,
            CommunityDeskripsi: request.CommunityDeskripsi,
            KegiatanText: request.KegiatanText,
            KegiatanDeskripsi: request.KegiatanDeskripsi,
            BeritaText: request.BeritaText,
            BeritaDeskripsi: request.BeritaDeskripsi,
            TestomoniText: request.TestomoniText,
            TestomoniDeskripsi: request.TestomoniDeskripsi,
        },
    })
    const res: SettingMainPageTypes = {
            UniversityId: data.UniversityId,
            SettingMainPageId: data.SettingMainPageId,
            TextMainPage1: data.TextMainPage1,
            TextMainPage2: data.TextMainPage2,
            TextMainPage3: data.TextMainPage3,
            SelayangPandangText: data.SelayangPandangText,
            SelayangPandangDeskripsi: data.SelayangPandangDeskripsi,
            WhyText: data.WhyText,
            WhyDeskripsi: data.WhyDeskripsi,
            CommunityText: data.CommunityText,
            CommunityDeskripsi: data.CommunityDeskripsi,
            KegiatanText: data.KegiatanText,
            KegiatanDeskripsi: data.KegiatanDeskripsi,
            BeritaText: data.BeritaText,
            BeritaDeskripsi: data.BeritaDeskripsi,
            TestomoniText: data.TestomoniText,
            TestomoniDeskripsi: data.TestomoniDeskripsi,
        }

    return c.json(res)
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    await prisma.settingMainPage.delete({
        where: {
            SettingMainPageId: id,
        },
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
