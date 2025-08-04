import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import fs from 'fs'
import path from 'path'
import mime from 'mime'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '@/lib/prisma'
import { BuktiFormTypes } from '@/types/BuktiFormUploadDokumenTypes'

const app = new Hono().basePath('/api/protected/upload-dokumen')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const BuktiFormId = c.req.query('BuktiFormId')
    
    const PendaftaranId = c.req.query('PendaftaranId')
    
    const filename = c.req.query('file')

    if (BuktiFormId === undefined && PendaftaranId !== undefined && filename === undefined)  {
        const data = await prisma.buktiForm.findMany({
            select: {
                BuktiFormId: true,
                PendaftaranId: true,
                NamaFile: true,
                NamaDokumen: true,
                CreatedAt: true,
                UpdatedAt: true,
                JenisDokumen :{
                    select: {
                        JenisDokumenId: true,
                        Jenis: true,
                        NomorDokumen: true,
                        Keterangan: true,
                    }
                }
            },
            where: {
                PendaftaranId: PendaftaranId
            },
            orderBy: {
                JenisDokumen: {
                    NomorDokumen: 'asc'
                }
            }
        });

        const res = data.map(d => ({
            JenisDokumenId: d?.JenisDokumen.JenisDokumenId ?? '' ,
            Jenis: d?.JenisDokumen.Jenis ?? ''  ,
            NomorDokumen: d?.JenisDokumen.NomorDokumen  ?? 0 ,
            Keterangan: d?.JenisDokumen.Keterangan  ?? '' ,
            BuktiFormId: d?.BuktiFormId  ?? '' ,
            PendaftaranId: d?.PendaftaranId  ?? '' ,
            NamaFile: d?.NamaFile  ?? '' ,
            NamaDokumen: d?.NamaDokumen ?? ''  ,
            CreatedAt: d?.CreatedAt  ?? null ,
            UpdatedAt: d?.UpdatedAt  ?? null ,
        }))

        return c.json(
            { data: res, status: 'success', message: 'data has been get' },
            { status: 200 }
        )
    }
    if (BuktiFormId !== undefined && PendaftaranId === undefined && filename === undefined)  {
        const data = await prisma.buktiForm.findFirst({
            select: {
                BuktiFormId: true,
                PendaftaranId: true,
                NamaFile: true,
                NamaDokumen: true,
                CreatedAt: true,
                UpdatedAt: true,
                JenisDokumen :{
                    select: {
                        JenisDokumenId: true,
                        Jenis: true,
                        NomorDokumen: true,
                        Keterangan: true,
                    }
                }
            },
            where: {
                BuktiFormId: BuktiFormId
            }
        });

        const res: BuktiFormTypes = {
            JenisDokumenId: data?.JenisDokumen.JenisDokumenId ?? '' ,
            Jenis: data?.JenisDokumen.Jenis ?? ''  ,
            NomorDokumen: data?.JenisDokumen.NomorDokumen  ?? 0 ,
            Keterangan: data?.JenisDokumen.Keterangan  ?? '' ,
            BuktiFormId: data?.BuktiFormId  ?? '' ,
            PendaftaranId: data?.PendaftaranId  ?? '' ,
            NamaFile: data?.NamaFile  ?? '' ,
            NamaDokumen: data?.NamaDokumen ?? ''  ,
            CreatedAt: data?.CreatedAt  ?? null ,
            UpdatedAt: data?.UpdatedAt  ?? null ,
        }

        return c.json(
            { data: res, status: 'success', message: 'data has been get' },
            { status: 200 }
        )
    }
    if (BuktiFormId === undefined && PendaftaranId === undefined) {
        if (!filename) {
            return c.json(
                { data: [], status: 'error', message: 'file is required' },
                { status: 400 }
            )
        }
        const fileRecord = await prisma.buktiForm.findFirst({
            where: {
                NamaFile: filename,
            },
            select: {
                FileData: true,
                NamaFile: true,
                NamaDokumen: true,
            }
        })

        if (!fileRecord) {
            return c.json(
                { data: [], status: 'error', message: 'file is required' },
                { status: 400 }
            )
        }
        try {
            if (!fileRecord || !fileRecord.FileData) {
                return c.json(
                    { data: [], status: 'error', message: 'file not found in DB' },
                    { status: 404 }
                )
            }

            const contentType =
                mime.getType(fileRecord.NamaDokumen || filename) ||
                'application/octet-stream'

            return c.body(fileRecord.FileData, 200, {
                'Content-Type': contentType,
                'Content-Disposition': `inline; filename="${filename}"`,
            })
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'error'
            return c.json(
                { data: [], status: 'error', message: errorMessage },
                { status: 500 }
            )
        }
    }
})
app.post('/', async (c) => {
    const body = await c.req.parseBody()
    
    const file = body.files
    const JenisDokumenId = body.JenisDokumenId
    const PendaftaranId = body.PendaftaranId

    if (!file || !(file instanceof File)) {
        return c.json(
            { status: 'error', message: 'File is required', data: [] },
            { status: 400 }
        )
    }

    if (!JenisDokumenId) {
        return c.json(
            { status: 'error', message: 'Jenis Dokumen Perlu diisi', data: [] },
            { status: 400 }
        )
    }
    
    if (!PendaftaranId) {
        return c.json(
            { status: 'error', message: 'Id Pendaftaran Perlu diisi', data: [] },
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

    const data = await prisma.buktiForm.create({
        data: {
            JenisDokumenId: JenisDokumenId as string,
            PendaftaranId: PendaftaranId as string,
            NamaFile: filename,
            FileData: buffer,
            NamaDokumen: originalFileName,
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
        },
        select: {
            JenisDokumenId: true,
            BuktiFormId: true,
            PendaftaranId: true,
            NamaFile: true,
            NamaDokumen: true,
            CreatedAt: true,
            UpdatedAt: true,
            JenisDokumen: {
                select: {
                    Jenis: true,
                    NomorDokumen: true,
                    Keterangan: true,
                }
            }
        }
    });

    return c.json({
        status: 'success',
        message: 'File uploaded successfully',
        data: {
            JenisDokumenId: data.JenisDokumenId,
            Jenis: data.JenisDokumen.Jenis,
            NomorDokumen: data.JenisDokumen.NomorDokumen,
            BuktiFormId: data.BuktiFormId,
            Keterangan: data.JenisDokumen.Keterangan,
            PendaftaranId: data.PendaftaranId,
            NamaFile: data.NamaFile,
            NamaDokumen: data.NamaDokumen,
            CreatedAt: data.CreatedAt,
            UpdatedAt: data.UpdatedAt,
        },
    })
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    await prisma.buktiForm.delete({
        where: {
            BuktiFormId: id,
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
export const DELETE = handle(app)
