import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { prisma } from "@/lib/prisma"
import { Pagination } from '@/types/Pagination'

const app = new Hono().basePath('/api/news')

// GET - Get single by ID or paginated list
app.get('/', async (c) => {
    const id = c.req.query('id')

    // If ID provided, return single record with details
    if (id) {
        const news = await prisma.settingBerita.findUnique({
            where: { SettingBeritaId: id },
            include: {
                KategoriBerita: true,
                SettingMainPage: true
            }
        })

        if (!news) {
            return c.json({ error: 'Berita tidak ditemukan' }, 404)
        }

        // Convert Gambar (Bytes) to base64 for response
        const newsWithImage = {
            ...news,
            Gambar: news.Gambar ? Buffer.from(news.Gambar).toString('base64') : null
        }

        return c.json(newsWithImage)
    }

    // Pagination parameters
    const page = parseInt(c.req.query('page') || '1')
    const limit = parseInt(c.req.query('limit') || '10')
    const search = c.req.query('search') || ''
    const sort = c.req.query('sort') || 'desc' // 'asc' or 'desc'
    const sortBy = c.req.query('sortBy') || 'Waktu'
    const kategoriId = c.req.query('kategoriId') || ''

    const skip = (page - 1) * limit

    // Build where clause
    const whereClause: any = {}

    if (search) {
        whereClause.OR = [
            { Title: { contains: search, mode: 'insensitive' } },
            { Deskripsi: { contains: search, mode: 'insensitive' } }
        ]
    }

    if (kategoriId) {
        whereClause.KategoriBeritaId = kategoriId
    }

    // Get total count
    const totalElement = await prisma.settingBerita.count({
        where: whereClause
    })

    // Get paginated data
    const data = await prisma.settingBerita.findMany({
        where: whereClause,
        include: {
            KategoriBerita: true
        },
        orderBy: {
            [sortBy]: sort
        },
        skip,
        take: limit
    })

    // Remove Gambar from list response (too large)
    const dataWithoutImage = data.map(item => ({
        ...item,
        Gambar: undefined,
        HasImage: item.Gambar !== null
    }))

    const totalPage = Math.ceil(totalElement / limit)

    const response: Pagination<typeof dataWithoutImage> = {
        data: dataWithoutImage,
        page,
        limit,
        totalElement,
        totalPage,
        isFirst: page === 1,
        isLast: page === totalPage || totalPage === 0,
        hasNext: page < totalPage,
        hasPrevious: page > 1
    }

    return c.json(response)
})

// POST - Create new news (FormData with file upload)
app.post('/', async (c) => {
    try {
        const formData = await c.req.formData()

        const KategoriBeritaId = formData.get('KategoriBeritaId') as string
        const SettingMainPageId = formData.get('SettingMainPageId') as string
        const Title = formData.get('Title') as string
        const Deskripsi = formData.get('Deskripsi') as string
        const Populer = formData.get('Populer') === 'true'
        const Waktu = formData.get('Waktu') as string | null
        const file = formData.get('Gambar') as File | null

        // Validate required fields
        if (!KategoriBeritaId || !SettingMainPageId || !Title || !Deskripsi) {
            return c.json({ error: 'Field wajib tidak lengkap' }, 400)
        }

        // Convert file to Buffer if provided
        let gambarBuffer: Buffer | undefined = undefined
        if (file && file.size > 0) {
            gambarBuffer = Buffer.from(await file.arrayBuffer())
        }

        const news = await prisma.settingBerita.create({
            data: {
                KategoriBeritaId,
                SettingMainPageId,
                Title,
                Deskripsi,
                Gambar: gambarBuffer as Uint8Array<ArrayBuffer> | undefined,
                Populer: Populer ?? false,
                Waktu: Waktu ? new Date(Waktu) : new Date()
            },
            include: {
                KategoriBerita: true
            }
        })

        return c.json({
            message: 'Berita berhasil dibuat',
            data: {
                ...news,
                Gambar: undefined
            }
        }, 201)
    } catch (error) {
        console.error('Error creating news:', error)
        return c.json({ error: 'Gagal membuat berita' }, 500)
    }
})

// PUT - Update existing news
app.put('/', async (c) => {
    try {
        const body = await c.req.json()

        const {
            SettingBeritaId,
            KategoriBeritaId,
            Title,
            Deskripsi,
            Gambar, // base64 string or null
            Populer,
            Waktu
        } = body

        if (!SettingBeritaId) {
            return c.json({ error: 'SettingBeritaId diperlukan' }, 400)
        }

        // Check if news exists
        const existingNews = await prisma.settingBerita.findUnique({
            where: { SettingBeritaId }
        })

        if (!existingNews) {
            return c.json({ error: 'Berita tidak ditemukan' }, 404)
        }

        // Build update data
        const updateData: any = {}

        if (KategoriBeritaId !== undefined) updateData.KategoriBeritaId = KategoriBeritaId
        if (Title !== undefined) updateData.Title = Title
        if (Deskripsi !== undefined) updateData.Deskripsi = Deskripsi
        if (Populer !== undefined) updateData.Populer = Populer
        if (Waktu !== undefined) updateData.Waktu = new Date(Waktu)

        // Only update Gambar if explicitly provided
        if (Gambar !== undefined) {
            updateData.Gambar = Gambar ? Buffer.from(Gambar, 'base64') : null
        }

        const updatedNews = await prisma.settingBerita.update({
            where: { SettingBeritaId },
            data: updateData,
            include: {
                KategoriBerita: true
            }
        })

        return c.json({
            message: 'Berita berhasil diperbarui',
            data: {
                ...updatedNews,
                Gambar: undefined
            }
        })
    } catch (error) {
        console.error('Error updating news:', error)
        return c.json({ error: 'Gagal memperbarui berita' }, 500)
    }
})

// DELETE - Delete news
app.delete('/', async (c) => {
    try {
        const id = c.req.query('id')

        if (!id) {
            return c.json({ error: 'ID diperlukan' }, 400)
        }

        // Check if news exists
        const existingNews = await prisma.settingBerita.findUnique({
            where: { SettingBeritaId: id }
        })

        if (!existingNews) {
            return c.json({ error: 'Berita tidak ditemukan' }, 404)
        }

        await prisma.settingBerita.delete({
            where: { SettingBeritaId: id }
        })

        return c.json({
            message: 'Berita berhasil dihapus',
            deletedId: id
        })
    } catch (error) {
        console.error('Error deleting news:', error)
        return c.json({ error: 'Gagal menghapus berita' }, 500)
    }
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
