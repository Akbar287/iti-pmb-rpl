import { MataKuliah, Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { z } from 'zod'

const app = new Hono().basePath(
    '/api/protected/manajemen-pembelajaran/mata-kuliah'
)

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const id = c.req.query('id')
    const programStudiId = c.req.query('programStudiId')
    const page = Number(c.req.query('page') ?? '1')
    const limit = Number(c.req.query('limit') ?? '10')
    const search = c.req.query('search') ?? ''

    let data = null
    if (page && limit) {
        let where: Prisma.MataKuliahWhereInput = {}
        if (programStudiId) {
            where = search
                ? {
                      AND: [
                          {
                              OR: [
                                  {
                                      Kode: {
                                          contains: search,
                                          mode: 'insensitive',
                                      },
                                  },
                                  {
                                      Nama: {
                                          contains: search,
                                          mode: 'insensitive',
                                      },
                                  },
                              ],
                          },
                          {
                              ProgramStudiId: programStudiId,
                          },
                      ],
                  }
                : {
                      ProgramStudiId: programStudiId,
                  }
        } else {
            where = search
                ? {
                      OR: [
                          { Kode: { contains: search, mode: 'insensitive' } },
                          { Nama: { contains: search, mode: 'insensitive' } },
                      ],
                  }
                : {}
        }

        const [data, total] = await Promise.all([
            prisma.mataKuliah.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { Kode: 'asc' },
            }),

            prisma.mataKuliah.count({ where }),
        ])

        return c.json<{
            data: MataKuliah[]
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
    } else if (programStudiId) {
        data = await prisma.mataKuliah.findMany({
            where: { ProgramStudiId: programStudiId },
        })
    } else if (id) {
        data = await prisma.mataKuliah.findFirst({
            where: { MataKuliahId: id },
        })
    } else {
        data = await prisma.mataKuliah.findMany()
    }

    return c.json(data)
})

app.post('/', async (c) => {
    const body: unknown = await c.req.json()

    if (
        body &&
        typeof body === 'object' &&
        'Items' in body &&
        'ProgramStudiId' in body
    ) {
        const bulkSchema = z.object({
            ProgramStudiId: z.string().min(1),
            Items: z
                .array(
                    z.object({
                        Kode: z.string().trim().min(1).max(100),
                        Nama: z.string().trim().min(1).max(500),
                        Sks: z.number().int().min(1).max(30),
                        Semester: z.string().trim().max(100).optional(),
                        Silabus: z.string().trim().max(10000).optional(),
                    })
                )
                .min(1)
                .max(1000),
        })
        const parsed = bulkSchema.safeParse(body)
        if (!parsed.success) {
            return c.json(
                {
                    message: 'Data impor mata kuliah tidak valid.',
                    issues: parsed.error.issues,
                },
                400
            )
        }

        const programStudi = await prisma.programStudi.findUnique({
            where: { ProgramStudiId: parsed.data.ProgramStudiId },
            select: { ProgramStudiId: true },
        })
        if (!programStudi) {
            return c.json({ message: 'Program studi tidak ditemukan.' }, 404)
        }

        const normalizedCodes = parsed.data.Items.map((item) =>
            item.Kode.toLocaleLowerCase('id-ID')
        )
        const duplicateInFile = normalizedCodes.filter(
            (code, index) => normalizedCodes.indexOf(code) !== index
        )
        if (duplicateInFile.length > 0) {
            return c.json(
                {
                    message: `Kode mata kuliah duplikat di file: ${[
                        ...new Set(duplicateInFile),
                    ].join(', ')}`,
                },
                409
            )
        }

        const existing = await prisma.mataKuliah.findMany({
            where: { ProgramStudiId: parsed.data.ProgramStudiId },
            select: { Kode: true },
        })
        const existingCodes = new Set(
            existing.map((item) => item.Kode.toLocaleLowerCase('id-ID'))
        )
        const duplicateInDatabase = parsed.data.Items.filter((item) =>
            existingCodes.has(item.Kode.toLocaleLowerCase('id-ID'))
        ).map((item) => item.Kode)
        if (duplicateInDatabase.length > 0) {
            return c.json(
                {
                    message: `Kode sudah terdaftar di program studi ini: ${duplicateInDatabase.join(', ')}`,
                },
                409
            )
        }

        const now = new Date()
        const data = await prisma.$transaction(
            parsed.data.Items.map((item) =>
                prisma.mataKuliah.create({
                    data: {
                        ProgramStudiId: parsed.data.ProgramStudiId,
                        Kode: item.Kode.trim(),
                        Nama: item.Nama.trim(),
                        Sks: item.Sks,
                        Semester: item.Semester?.trim() || null,
                        Silabus: item.Silabus?.trim() || null,
                        CreatedAt: now,
                        UpdatedAt: now,
                    },
                })
            )
        )

        return c.json({ data, count: data.length }, 201)
    }

    const singleBody = body as MataKuliah

    const data = await prisma.mataKuliah.create({
        data: {
            ProgramStudiId: singleBody.ProgramStudiId,
            Kode: singleBody.Kode,
            Nama: singleBody.Nama,
            Sks: singleBody.Sks,
            Semester: singleBody.Semester,
            Silabus: singleBody.Silabus,
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
        },
    })

    return c.json(data)
})

app.put('/', async (c) => {
    const body: MataKuliah = await c.req.json()

    const data = await prisma.mataKuliah.update({
        data: {
            ProgramStudiId: body.ProgramStudiId,
            Kode: body.Kode,
            Nama: body.Nama,
            Sks: body.Sks,
            Semester: body.Semester,
            Silabus: body.Silabus,
            UpdatedAt: new Date(),
        },
        where: {
            MataKuliahId: body.MataKuliahId,
        },
    })

    return c.json(data)
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    await prisma.mataKuliah.delete({
        where: {
            MataKuliahId: id,
        },
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
