import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import mime from 'mime'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '@/lib/prisma'
import { bacaBerkas, berkasAda, simpanBerkas } from '@/lib/storage'
import { TicketFile } from '@/types/TicketsTypes'

const app = new Hono().basePath('/api/protected/tickets/file')

app.use('*', withApiAuth)

const MAX_SIZE_MB = 10
const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
const allowedExtensions = ['pdf', 'doc', 'docx']

// GET - Get file by Id (one) or by TicketsId (many)
app.get('/', async (c) => {
    const id = c.req.query('id')
    const ticketsId = c.req.query('ticketsId')
    const download = c.req.query('download')

    // Get single file by Id
    if (id && !ticketsId) {
        const data = await prisma.ticketsFile.findFirst({
            where: {
                TicketsFileId: id,
            },
        })

        if (!data) {
            return c.json({ error: 'File not found' }, 404)
        }

        if (download === 'true') {
            const contentType =
                mime.getType(data.NamaDokumen || data.NamaFile) ||
                'application/octet-stream'

            if (!(await berkasAda(data.PathFile))) {
                return c.json({ error: 'File not found in storage' }, 404)
            }

            return c.body(await bacaBerkas(data.PathFile), 200, {
                'Content-Type': contentType,
                'Content-Disposition': `inline; filename="${data.NamaDokumen}"`,
            })
        }

        return c.json<TicketFile>({
            TicketsFileId: data.TicketsFileId,
            TicketsId: data.TicketsId,
            NamaFile: data.NamaFile,
            NamaDokumen: data.NamaDokumen,
            CreatedAt: data.CreatedAt,
            UpdatedAt: data.UpdatedAt,
        }, 200)
    }

    // Get all files by TicketsId (many - no pagination)
    if (ticketsId && !id) {
        const data = await prisma.ticketsFile.findMany({
            where: {
                TicketsId: ticketsId,
            },
            orderBy: {
                CreatedAt: 'desc',
            },
        })

        const result: TicketFile[] = data.map((file) => ({
            TicketsFileId: file.TicketsFileId,
            TicketsId: file.TicketsId,
            NamaFile: file.NamaFile,
            NamaDokumen: file.NamaDokumen,
            CreatedAt: file.CreatedAt,
            UpdatedAt: file.UpdatedAt,
        }))

        return c.json<TicketFile[]>(result, 200)
    }

    return c.json({ error: 'id or ticketsId is required' }, 400)
})

// POST - Create file
app.post('/', async (c) => {
    const body = await c.req.parseBody()

    const file = body.file
    const ticketsId = body.ticketsId

    // Validate file
    if (!file || !(file instanceof File)) {
        return c.json(
            { status: 'error', message: 'File is required' },
            { status: 400 }
        )
    }

    // Validate ticketsId
    if (!ticketsId || typeof ticketsId !== 'string') {
        return c.json(
            { status: 'error', message: 'ticketsId is required' },
            { status: 400 }
        )
    }

    // Check if ticket exists
    const ticket = await prisma.tickets.findFirst({
        where: { TicketsId: ticketsId },
    })
    if (!ticket) {
        return c.json(
            { status: 'error', message: 'Ticket not found' },
            { status: 404 }
        )
    }

    // Validate file size
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        return c.json(
            {
                status: 'error',
                message: `Ukuran file melebihi ${MAX_SIZE_MB}MB`,
            },
            { status: 400 }
        )
    }

    // Validate file type
    const fileExt = mime.getExtension(file.type) || ''
    if (
        !allowedMimeTypes.includes(file.type) ||
        !allowedExtensions.includes(fileExt)
    ) {
        return c.json(
            {
                status: 'error',
                message:
                    'Format file tidak valid. Hanya PDF dan Word (doc/docx) yang diperbolehkan.',
            },
            { status: 400 }
        )
    }

    // Process file
    const buffer = Buffer.from(new Uint8Array(await file.arrayBuffer()))
    const originalFileName = file.name
    const filename = `${uuidv4()}.${fileExt}`

    // Lampiran disimpan di folder pembuat tiket, basis data memegang path-nya.
    const tiket = await prisma.tickets.findFirst({
        where: { TicketsId: ticketsId },
        select: { UserId: true },
    })

    if (!tiket) {
        return c.json({ error: 'Tiket tidak ditemukan' }, 400)
    }

    const pathFile = await simpanBerkas(
        tiket.UserId,
        'tiket',
        filename,
        buffer
    )

    // Save to database
    const data = await prisma.ticketsFile.create({
        data: {
            TicketsId: ticketsId,
            NamaFile: filename,
            PathFile: pathFile,
            NamaDokumen: originalFileName,
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
        },
    })

    return c.json<TicketFile>({
        TicketsFileId: data.TicketsFileId,
        TicketsId: data.TicketsId,
        NamaFile: data.NamaFile,
        NamaDokumen: data.NamaDokumen,
        CreatedAt: data.CreatedAt,
        UpdatedAt: data.UpdatedAt,
    }, 201)
})

// DELETE - Delete file by Id
app.delete('/', async (c) => {
    const id = c.req.query('id')

    if (!id) {
        return c.json(
            { status: 'error', message: 'id is required' },
            { status: 400 }
        )
    }

    const existing = await prisma.ticketsFile.findFirst({
        where: { TicketsFileId: id },
    })

    if (!existing) {
        return c.json(
            { status: 'error', message: 'File not found' },
            { status: 404 }
        )
    }

    await prisma.ticketsFile.delete({
        where: {
            TicketsFileId: id,
        },
    })

    return c.json({
        status: 'ok',
        message: 'File deleted successfully',
    }, 200)
})

export const GET = handle(app)
export const POST = handle(app)
export const DELETE = handle(app)