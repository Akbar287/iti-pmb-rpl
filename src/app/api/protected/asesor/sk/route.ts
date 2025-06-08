import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import fs from 'fs'
import path from 'path'
import mime from 'mime'
import { v4 as uuidv4 } from 'uuid'

const app = new Hono().basePath('/api/protected/asesor/sk')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const jenis = c.req.query('jenis')
    if (jenis === 'get-page-sk') {
        const page = parseInt(c.req.query('page') || '1', 10)
        const limit = parseInt(c.req.query('limit') || '10', 10)
        const search = c.req.query('search') || ''

        const tipeAsesor = await prisma.tipeSkRektor.findFirst({
            where: {Nama: "Asesor"}, select: { TipeSkRektorId: true }
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
            AsesorRelation: item._count.SkRektorAssesor
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
        const filePath = path.join(process.cwd(), 'uploads', 'files', filename)
    
        try {
            const stat = fs.statSync(filePath)
            if (!stat.isFile()) {
                return c.json(
                    { data: [], status: 'error', message: 'not a file' },
                    { status: 400 }
                )
            }
    
            const fileStream = fs.createReadStream(filePath)
            const contentType = mime.getType(filePath) || 'application/octet-stream'
    
            return c.body(fileStream as any, 200, {
                'Content-Type': contentType,
            })
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'error'
            return c.json(
                { data: [], status: 'error', message: errorMessage },
                { status: 500 }
            )
        }
    }
    if (jenis === 'get-page-mhs-from-sk-asesor-id') {
        const page = parseInt(c.req.query('page') || '1', 10)
        const limit = parseInt(c.req.query('limit') || '10', 10)
        const SkAsesorId = c.req.query('sk-asesor-id') || ''

        const [data, total] = await Promise.all([
            prisma.skRektorAssesor.findMany({
                select: {
                    SkRektorId: true,
                    AssesorMahasiswa: {
                        select: {
                            AssesorMahasiswaId: true,
                            Pendaftaran: {
                                select: {
                                    KodePendaftar: true,
                                    PendaftaranId: true,
                                    Mahasiswa: {
                                        select: {
                                            User: {
                                                select: {
                                                    UserId: true,
                                                    Nama: true,
                                                },
                                            },
                                            MahasiswaId: true,
                                        },
                                    },
                                    AssesorMahasiswa: {
                                        select: {
                                            AssesorMahasiswaId: true,
                                            Urutan: true,
                                            Confirmation: true,
                                            Asesor: {
                                                select: {
                                                    AsesorId: true,
                                                    TipeAsesor: {
                                                        select: {
                                                            TipeAsesorId: true,
                                                            Nama: true,
                                                        },
                                                    },
                                                    User: {
                                                        select: {
                                                            UserId: true,
                                                            Nama: true,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                    DaftarUlang: {
                                        select: {
                                            ProgramStudi: {
                                                select: {
                                                    ProgramStudiId: true,
                                                    Nama: true,
                                                },
                                            },
                                        }
                                    }
                                },
                            },
                        }
                    }
                },
                where: {
                    SkRektorId: SkAsesorId,
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { AssesorMahasiswa: {Pendaftaran: { KodePendaftar: 'asc' } } },
            }),

            prisma.skRektorAssesor.count({
                where: {
                    SkRektorId: SkAsesorId,
                },
            }),
        ])
        const responses: ResponseSkRektorAsesorDetail[] = data.map((item) => ({
            Asesor: item.AssesorMahasiswa.Pendaftaran.AssesorMahasiswa.map((asesor) => ({
                AssesorMahasiswaId: asesor.AssesorMahasiswaId,
                AsesorId: asesor.Asesor.AsesorId,
                NamaTipeAsesor: asesor.Asesor.TipeAsesor.Nama,
                NamaAsesor: asesor.Asesor.User.Nama,
                Urutan: asesor.Urutan,
                Confirmation: asesor.Confirmation,
            })),
            SkRektorId: item.SkRektorId,
            AsesorMahasiswaId: item.AssesorMahasiswa.AssesorMahasiswaId,
            PendaftaranId: item.AssesorMahasiswa.Pendaftaran.PendaftaranId,
            KodePendaftar: item.AssesorMahasiswa.Pendaftaran.KodePendaftar,
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
    return c.json({ error: 'Invalid query parameter' }, 400)
})

app.post('/', async (c) => {
    const body = await c.req.parseBody()
    
    const file = body.files
    const NamaSk = body.NamaSk
    const TahunSk = body.TahunSk
    const NomorSk = body.NomorSk
    const ArrayRelation: string[] = JSON.parse(body.ArrayRelation as string)

    const tipeAsesor = await prisma.tipeSkRektor.findFirst({
        where: {Nama: "Asesor"}, select: { TipeSkRektorId: true }
    })

    if (!tipeAsesor) {
        return c.json({ error: 'Tipe Asesor not found' }, 404)
    }

    if (!file || !(file instanceof File)) {
        return c.json(
            { status: 'error', message: 'File is required', data: [] },
            { status: 400 }
        )
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

    const buffer = Buffer.from(await file.arrayBuffer())

    const originalFileName = file.name
    const filename = `${uuidv4()}.${fileExt}`

    const dir = path.join(process.cwd(), 'uploads', 'files')

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }

    const filePath = path.join(dir, filename)

    fs.writeFileSync(filePath, buffer)

    const data = await prisma.skRektor.create({
        data: {
            TipeSkRektorId: tipeAsesor.TipeSkRektorId,
            NamaSk: NamaSk as string,
            TahunSk: parseInt(TahunSk as string),
            NomorSk: NomorSk as string,
            NamaFile: filePath,
            NamaDokumen: originalFileName,
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
        },
        select: {
            SkRektorId: true,
            NamaSk: true,
            TahunSk: true,
            NomorSk: true,
            NamaFile: true,
            NamaDokumen: true,
            CreatedAt: true,
            UpdatedAt: true,
            _count: {
                select: {
                    SkRektorAssesor: true
                }
            }
        }
    });

    await prisma.skRektorAssesor.createMany({
        data: ArrayRelation.map(a => ({
            SkRektorId: data.SkRektorId,
            AssesorMahasiswaId: a
        }))
    })

    return c.json<ResponseSkRektorAsesor>({
        SkRektorId: data.SkRektorId,
        NamaSk: data.NamaSk,
        TahunSk: data.TahunSk,
        NomorSk: data.NomorSk,
        NamaFile: data.NamaFile,
        NamaDokumen: data.NamaDokumen,
        AsesorRelation: data._count.SkRektorAssesor,
    })
})

app.delete('/', async (c) => {
    const id = c.req.query('id')
    
        const file = await prisma.skRektor.findFirst({
            where: {
                SkRektorId: id,
            },
            select: {
                NamaDokumen: true,
                NamaFile: true,
            },
        })
    
        const avatarDir = path.join(process.cwd(), 'uploads', 'files')
    
        if (file !== null) {
            const oldPath = path.join(avatarDir, file.NamaFile || '')
            if (fs.existsSync(oldPath)) {
                try {
                    fs.unlinkSync(oldPath)
                } catch (err) {
                    console.error('Failed to delete file :', err)
                }
            }
        }
        
        await prisma.skRektor.delete({
            where: {
                SkRektorId: id,
            },
        })
    
    
        return c.json({
            status: 'ok',
            message: 'success delete a file',
            data: []
        })
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
