import { prisma } from '@/lib/prisma'
import { bacaBerkas, berkasAda, simpanBerkas } from '@/lib/storage'
import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import mime from 'mime'
import { v4 as uuidv4 } from 'uuid'
import { ResponseAsesorTanpaSk, ResponseSkRektorAsesor, ResponseSkRektorAsesorDetail } from '@/types/PenunjukanAsesor'
import { cookies } from 'next/headers'

const app = new Hono().basePath('/api/protected/asesor/sk')
const BASE_URL = process.env.BACKEND_API_BASE_URL
app.use('*', withApiAuth)

app.get('/', async (c) => {
    const jenis = c.req.query('jenis')
    if (jenis === 'get-page-sk') {
        const page = parseInt(c.req.query('page') || '1', 10)
        const limit = parseInt(c.req.query('limit') || '10', 10)
        const search = c.req.query('search') || ''

        const tipeAsesor = await prisma.tipeSkRektor.findFirst({
            where: { Nama: 'Asesor' },
            select: { TipeSkRektorId: true },
        })

        if (!tipeAsesor) {
            return c.json({ error: 'Tipe Asesor not found' }, 404)
        }

        const [data, total] = await Promise.all([
            prisma.skRektor.findMany({
                select: {
                    SkRektorId: true,
                    NamaSk: true,
                    TahunSk: true,
                    NomorSk: true,
                    NamaDokumen: true,
                    NamaFile: true,
                    Disetujui: true,
                    DisetujuiPada: true,
                    Catatan: true,
                    _count: {
                        select: {
                            SkRektorAssesor: true,
                        },
                    },
                },
                where: {
                    NomorSk: {
                        contains: search,
                        mode: 'insensitive',
                    },
                    TipeSkRektorId: tipeAsesor?.TipeSkRektorId,
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { CreatedAt: 'desc' },
            }),
            prisma.skRektor.count({
                where: {
                    NomorSk: {
                        contains: search,
                        mode: 'insensitive',
                    },
                    TipeSkRektorId: tipeAsesor?.TipeSkRektorId,
                },
            }),
        ])

        const responses: ResponseSkRektorAsesor[] = data.map((item) => ({
            SkRektorId: item.SkRektorId,
            NamaSk: item.NamaSk,
            TahunSk: item.TahunSk,
            NomorSk: item.NomorSk,
            NamaFile: item.NamaFile,
            NamaDokumen: item.NamaDokumen,
            AsesorRelation: item._count.SkRektorAssesor,
            Disetujui: item.Disetujui,
            DisetujuiPada: item.DisetujuiPada,
            Catatan: item.Catatan ?? '',
        }))

        return c.json<{
            data: ResponseSkRektorAsesor[]
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
            data: responses,
            totalElement: total,
            totalPage: Math.ceil(total / limit),
            isFirst: page === 1,
            isLast:
                page === Math.ceil(total / limit) ||
                Math.ceil(total / limit) === 0,
            hasNext: page < Math.ceil(total / limit),
            hasPrevious: page > 1,
        })
    }
    if (jenis === 'get-page-sk-from-asesor-role') {
        const userId = c.req.query('userId')
        const page = parseInt(c.req.query('page') || '1', 10)
        const limit = parseInt(c.req.query('limit') || '10', 10)
        const search = c.req.query('search') || ''

        const tipeAsesor = await prisma.tipeSkRektor.findFirst({
            where: { Nama: 'Asesor' },
            select: { TipeSkRektorId: true },
        })

        if (!tipeAsesor) {
            return c.json({ error: 'Tipe Asesor not found' }, 404)
        }

        const [data, total] = await Promise.all([
            prisma.skRektor.findMany({
                select: {
                    SkRektorId: true,
                    NamaSk: true,
                    TahunSk: true,
                    NomorSk: true,
                    NamaDokumen: true,
                    NamaFile: true,
                    _count: {
                        select: {
                            SkRektorAssesor: true,
                        },
                    },
                    Disetujui: true,
                    DisetujuiPada: true,
                    Catatan: true,
                    SkRektorAssesor: {
                        select: {
                            Asesor: {
                                select: {
                                    AsesorId: true,
                                    User: { select: { Nama: true } },
                                },
                            },
                        },
                    },
                },
                where: {
                    NomorSk: {
                        contains: search,
                        mode: 'insensitive',
                    },
                    NamaSk: {
                        contains: search,
                        mode: 'insensitive',
                    },
                    TahunSk: search
                        ? { equals: isNaN(Number(search)) ? undefined : Number(search) }
                        : undefined,
                    SkRektorAssesor: {
                        some: {
                            Asesor: {
                                UserId: userId,
                            },
                        },
                    },
                    TipeSkRektorId: tipeAsesor?.TipeSkRektorId,
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { CreatedAt: 'desc' },
            }),
            prisma.skRektor.count({
                where: {
                    NomorSk: {
                        contains: search,
                        mode: 'insensitive',
                    },
                    TipeSkRektorId: tipeAsesor?.TipeSkRektorId,
                },
            }),
        ])

        const responses: ResponseSkRektorAsesor[] = data.map((item) => ({
            SkRektorId: item.SkRektorId,
            NamaSk: item.NamaSk,
            TahunSk: item.TahunSk,
            NomorSk: item.NomorSk,
            NamaFile: item.NamaFile,
            NamaDokumen: item.NamaDokumen,
            AsesorRelation: item._count.SkRektorAssesor,
            Disetujui: item.Disetujui,
            DisetujuiPada: item.DisetujuiPada,
            Catatan: item.Catatan ?? '',
        }))

        return c.json<{
            data: ResponseSkRektorAsesor[]
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
            data: responses,
            totalElement: total,
            totalPage: Math.ceil(total / limit),
            isFirst: page === 1,
            isLast:
                page === Math.ceil(total / limit) ||
                Math.ceil(total / limit) === 0,
            hasNext: page < Math.ceil(total / limit),
            hasPrevious: page > 1,
        })
    }
    if (jenis === 'get-sk-file') {
        const filename = c.req.query('filename')
        if (!filename) {
            return c.json(
                { data: [], status: 'error', message: 'file is required' },
                { status: 400 }
            )
        }

        try {
            const fileRecord = await prisma.skRektor.findFirst({
                where: { NamaFile: filename },
                select: {
                    PathFile: true,
                    NamaDokumen: true,
                },
            })

            if (!fileRecord || !(await berkasAda(fileRecord.PathFile))) {
                return c.json(
                    {
                        data: [],
                        status: 'error',
                        message: 'file not found in storage',
                    },
                    { status: 404 }
                )
            }

            const contentType =
                mime.getType(fileRecord.NamaDokumen || filename) ||
                'application/octet-stream'

            return c.body(await bacaBerkas(fileRecord.PathFile), 200, {
                'Content-Type': contentType,
                'Content-Disposition': `inline; filename="${filename}"`,
            })

        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : 'error'
            return c.json(
                { data: [], status: 'error', message: errorMessage },
                { status: 500 }
            )
        }
    }
    // Daftar asesor yang tercakup dalam satu SK penugasan.
    if (jenis === 'get-asesor-from-sk-id') {
        const page = parseInt(c.req.query('page') || '1', 10)
        const limit = parseInt(c.req.query('limit') || '10', 10)
        const SkAsesorId = c.req.query('sk-asesor-id') || ''

        const [data, total] = await Promise.all([
            prisma.skRektorAssesor.findMany({
                select: {
                    SkRektorId: true,
                    Asesor: {
                        select: {
                            AsesorId: true,
                            TipeAsesor: { select: { Nama: true } },
                            User: { select: { Nama: true, Email: true } },
                        },
                    },
                },
                where: { SkRektorId: SkAsesorId },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { Asesor: { User: { Nama: 'asc' } } },
            }),
            prisma.skRektorAssesor.count({
                where: { SkRektorId: SkAsesorId },
            }),
        ])

        const responses: ResponseSkRektorAsesorDetail[] = data.map((item) => ({
            SkRektorId: item.SkRektorId,
            AsesorId: item.Asesor.AsesorId,
            NamaAsesor: item.Asesor.User.Nama,
            NamaTipeAsesor: item.Asesor.TipeAsesor.Nama,
            Email: item.Asesor.User.Email,
        }))

        return c.json<{
            data: ResponseSkRektorAsesorDetail[]
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
            data: responses,
            totalElement: total,
            totalPage: Math.ceil(total / limit),
            isFirst: page === 1,
            isLast:
                page === Math.ceil(total / limit) ||
                Math.ceil(total / limit) === 0,
            hasNext: page < Math.ceil(total / limit),
            hasPrevious: page > 1,
        })
    }
    // Asesor yang belum tercakup SK penugasan mana pun — kandidat penerbitan SK.
    if (jenis === 'get-asesor-tanpa-sk') {
        const search = c.req.query('search') || ''

        const data = await prisma.asesor.findMany({
            select: {
                AsesorId: true,
                TipeAsesor: { select: { Nama: true } },
                User: { select: { Nama: true, Email: true } },
            },
            where: {
                DeletedAt: null,
                SkRektorAssesor: { none: {} },
                ...(search
                    ? {
                        User: {
                            Nama: { contains: search, mode: 'insensitive' },
                        },
                    }
                    : {}),
            },
            orderBy: { User: { Nama: 'asc' } },
        })

        const response: ResponseAsesorTanpaSk[] = data.map((x) => ({
            AsesorId: x.AsesorId,
            NamaAsesor: x.User.Nama,
            NamaTipeAsesor: x.TipeAsesor.Nama,
            Email: x.User.Email,
        }))

        return c.json<ResponseAsesorTanpaSk[]>(response, 200)
    }
    return c.json({ error: 'Invalid query parameter' }, 400)
})

app.post('/', async (c) => {
    const body = await c.req.parseBody()

    const file = body.files
    const NamaSk: string = body.NamaSk as string
    const TahunSk: string = body.TahunSk as string
    const NomorSk: string = body.NomorSk as string
    const SkRektorId: string = (body.SkRektorId as string) ?? ''
    // Daftar asesor yang dicakup SK, dikirim sebagai JSON array of AsesorId.
    const AsesorIdsRaw: string = (body.AsesorIds as string) ?? '[]'

    let AsesorIds: string[] = []
    try {
        AsesorIds = JSON.parse(AsesorIdsRaw)
    } catch {
        return c.json(
            { status: 'error', message: 'Daftar asesor tidak valid', data: [] },
            { status: 400 }
        )
    }

    const tipeAsesor = await prisma.tipeSkRektor.findFirst({
        where: { Nama: 'Asesor' },
        select: { TipeSkRektorId: true },
    })

    if (!tipeAsesor) {
        return c.json({ error: 'Tipe Asesor not found' }, 404)
    }

    if (!NomorSk) {
        return c.json(
            { status: 'error', message: 'Nomor SK Perlu diisi', data: [] },
            { status: 400 }
        )
    }

    if (!NamaSk) {
        return c.json(
            { status: 'error', message: 'Nama SK Perlu diisi', data: [] },
            { status: 400 }
        )
    }

    if (!TahunSk) {
        return c.json(
            { status: 'error', message: 'Tahun SK Perlu diisi', data: [] },
            { status: 400 }
        )
    }

    if (AsesorIds.length === 0) {
        return c.json(
            {
                status: 'error',
                message: 'Pilih minimal satu asesor yang dicakup SK ini',
                data: [],
            },
            { status: 400 }
        )
    }

    const skLama = SkRektorId
        ? await prisma.skRektor.findFirst({
            where: { SkRektorId: SkRektorId },
            select: { SkRektorId: true, Disetujui: true, NamaFile: true },
        })
        : null

    if (SkRektorId && !skLama) {
        return c.json(
            { status: 'error', message: 'SK tidak ditemukan', data: [] },
            { status: 404 }
        )
    }

    // SK yang sudah disetujui Wakil Rektor dikunci.
    if (skLama?.Disetujui) {
        return c.json(
            {
                status: 'error',
                message:
                    'SK ini sudah disetujui Wakil Rektor dan tidak dapat diubah lagi',
                data: [],
            },
            { status: 409 }
        )
    }

    // Berkas wajib pada penerbitan SK baru; pada perubahan boleh dikosongkan
    // bila hanya mengganti data atau daftar asesor.
    if (!skLama && (!file || !(file instanceof File))) {
        return c.json(
            { status: 'error', message: 'File is required', data: [] },
            { status: 400 }
        )
    }

    let filename = skLama?.NamaFile ?? ''
    let originalFileName = ''
    let buffer: Buffer<ArrayBuffer> | null = null

    if (file && file instanceof File) {
        const MAX_SIZE_MB = 10
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            return c.json(
                {
                    status: 'error',
                    message: 'Ukuran file melebihi 10MB',
                    data: [],
                },
                { status: 400 }
            )
        }

        const allowedMimeTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ]
        const allowedExtensions = ['pdf', 'doc', 'docx']

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
                    data: [],
                },
                { status: 400 }
            )
        }

        buffer = Buffer.from(new Uint8Array(await file.arrayBuffer()))
        originalFileName = file.name
        filename = `${uuidv4()}.${fileExt}`
    }

    // SK penugasan asesor berlaku untuk banyak asesor sehingga tidak dimiliki
    // satu pengguna — disimpan pada folder bersama <storage>/sk/.
    const pathFile = buffer
        ? await simpanBerkas(null, 'sk', filename, buffer)
        : null

    const asesor = await prisma.asesor.findMany({
        where: { AsesorId: { in: AsesorIds } },
        select: {
            AsesorId: true,
            User: { select: { Nama: true, NomorWa: true } },
        },
    })

    if (asesor.length !== AsesorIds.length) {
        return c.json(
            {
                status: 'error',
                message: 'Ada asesor yang tidak ditemukan',
                data: [],
            },
            { status: 400 }
        )
    }

    const sk = await prisma.$transaction(async (tx) => {
        const saved = skLama
            ? await tx.skRektor.update({
                where: { SkRektorId: skLama.SkRektorId },
                data: {
                    TipeSkRektorId: tipeAsesor.TipeSkRektorId,
                    NamaSk: NamaSk,
                    TahunSk: parseInt(TahunSk, 10),
                    NomorSk: NomorSk,
                    ...(pathFile
                        ? {
                            NamaFile: filename,
                            PathFile: pathFile,
                            NamaDokumen: originalFileName,
                        }
                        : {}),
                    UpdatedAt: new Date(),
                },
            })
            : await tx.skRektor.create({
                data: {
                    TipeSkRektorId: tipeAsesor.TipeSkRektorId,
                    NamaSk: NamaSk,
                    TahunSk: parseInt(TahunSk, 10),
                    NomorSk: NomorSk,
                    NamaFile: filename,
                    PathFile: pathFile as string,
                    NamaDokumen: originalFileName,
                    Disetujui: false,
                    CreatedAt: new Date(),
                    UpdatedAt: new Date(),
                },
            })

        await tx.skRektorAssesor.deleteMany({
            where: { SkRektorId: saved.SkRektorId },
        })
        await tx.skRektorAssesor.createMany({
            data: AsesorIds.map((AsesorId) => ({
                SkRektorId: saved.SkRektorId,
                AsesorId: AsesorId,
            })),
        })

        return saved
    })

    // Kabari asesor bahwa SK penugasan mereka sudah diterbitkan dan sedang
    // menunggu persetujuan Wakil Rektor.
    const cookieHeader = (await cookies()).toString()

    await Promise.all(
        asesor.map(async (x) => {
            const target = x.User.NomorWa ?? ''
            if (!target) return

            const params = new URLSearchParams({
                target: String(target),
                message: `Halo, ${x.User.Nama}. SK Penugasan Asesor atas nama Anda sudah diterbitkan dengan Nomor SK ${sk.NomorSk} (${sk.NamaSk}) dan sedang menunggu persetujuan Wakil Rektor. Anda dapat memantau melalui Sistem Informasi RPL Terpadu ITI. Terima Kasih.`,
                jenis: 'sendWaText',
            })

            await fetch(
                `${BASE_URL}/api/protected/whatsapp?${params.toString()}`,
                {
                    method: 'POST',
                    headers: {
                        cookie: cookieHeader,
                        'Content-Type': 'application/json',
                    },
                }
            )
        })
    )

    return c.json<ResponseSkRektorAsesor>({
        SkRektorId: sk.SkRektorId,
        NamaSk: sk.NamaSk,
        TahunSk: sk.TahunSk,
        NomorSk: sk.NomorSk,
        NamaFile: sk.NamaFile,
        NamaDokumen: sk.NamaDokumen,
        AsesorRelation: AsesorIds.length,
        Disetujui: sk.Disetujui,
        DisetujuiPada: sk.DisetujuiPada,
        Catatan: sk.Catatan ?? '',
    })
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    await prisma.skRektorAssesor.deleteMany({
        where: {
            SkRektorId: id,
        },
    })
    await prisma.skRektor.delete({
        where: {
            SkRektorId: id,
        },
    })

    return c.json({
        status: 'ok',
        message: 'success delete a file',
        data: [],
    })
})

export const GET = handle(app)
export const POST = handle(app)
export const DELETE = handle(app)
