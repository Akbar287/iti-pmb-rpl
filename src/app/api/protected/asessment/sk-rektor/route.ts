import { Prisma, SkRektor } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { getSession } from '@/provider/api'
import { ResponseSkRektorAsessmenType } from '@/types/FinalAsessmen'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import fs from 'fs'
import path from 'path'
import mime from 'mime'
import { v4 as uuidv4 } from 'uuid'

const app = new Hono().basePath('/api/protected/asessment/sk-rektor')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const session = await getSession()
    const jenis = c.req.query('jenis')
    const isMahasiswa = c.req.query('_m')
    const isAsesor = c.req.query('_a')

    if (session) {
        if(jenis === '_f') {
            const filename = c.req.query('_f')
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
                        FileData: true,
                        NamaDokumen: true,
                    },
                })

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
        if (jenis === 'get-sk-rektor') {
            const page = parseInt(c.req.query('page') || '1', 10)
            const limit = parseInt(c.req.query('limit') || '10', 10)
            const search = c.req.query('search') || ''
            if(isMahasiswa) {
                let where: Prisma.PendaftaranWhereInput = search
                    ? {
                          AND: [
                            {
                                Mahasiswa: {UserId: session.user.id}
                            },
                              {
                                  StatusMahasiswaAssesmentHistory: {
                                      some: {
                                          AND: [
                                              {
                                                  StatusMahasiswaAssesment: {
                                                      NamaStatus:
                                                          'Penerbitan SK Asessmen',
                                                  },
                                              },
                                              {
                                                  Aktif: true,
                                              },
                                          ],
                                      },
                                  },
                              },
                              {
                                  OR: [
                                      {
                                          DaftarUlang: {
                                              some: {
                                                  Nim: {
                                                      contains: search,
                                                      mode: 'insensitive',
                                                  },
                                              },
                                          },
                                      },
                                      {
                                          KodePendaftar: {
                                              contains: search,
                                              mode: 'insensitive',
                                          },
                                      },
                                      {
                                          Mahasiswa: {
                                              User: {
                                                  OR: [
                                                      {
                                                          NomorHp: {
                                                              contains: search,
                                                              mode: 'insensitive',
                                                          },
                                                          Nama: {
                                                              contains: search,
                                                              mode: 'insensitive',
                                                          },
                                                          Email: {
                                                              contains: search,
                                                              mode: 'insensitive',
                                                          },
                                                      },
                                                  ],
                                              },
                                          },
                                      },
                                  ],
                              },
                          ],
                      }
                    : {
                          AND: [
                            {
                                Mahasiswa: {UserId: session.user.id}
                            },
                              {
                                  StatusMahasiswaAssesmentHistory: {
                                      some: {
                                          AND: [
                                              {
                                                  StatusMahasiswaAssesment: {
                                                      NamaStatus:
                                                          'Penerbitan SK Asessmen',
                                                  },
                                              },
                                              {
                                                  Aktif: true,
                                              },
                                          ],
                                      },
                                  },
                              },
                          ],
                      }
                const [data, total] = await Promise.all([
                    prisma.pendaftaran.findMany({
                        where,
                        skip: (page - 1) * limit,
                        take: limit,
                        orderBy: { KodePendaftar: 'asc' },
                        select: {
                            PendaftaranId: true,
                            KodePendaftar: true,
                            SkRektorMahasiswa: {
                                select: {
                                    SkRektor: {
                                        select: {
                                            NamaFile: true,
                                        },
                                    },
                                },
                            },
                            StatusMahasiswaAssesmentHistory: {
                                select: {
                                    Aktif: true,
                                    StatusMahasiswaAssesment: {
                                        select: {
                                            NamaStatus: true,
                                        },
                                    },
                                },
                            },
                            DaftarUlang: {
                                select: {
                                    Nim: true,
                                },
                            },
                            Mahasiswa: {
                                select: {
                                    User: {
                                        select: {
                                            Nama: true,
                                            Email: true,
                                            NomorHp: true,
                                        },
                                    },
                                },
                            },
                        },
                    }),
                    prisma.pendaftaran.count({
                        where,
                    }),
                ])
    
                const response: ResponseSkRektorAsessmenType[] =
                    data?.map((am) => ({
                        Nama: am.Mahasiswa.User.Nama,
                        Email: am.Mahasiswa.User.Email,
                        NomorHp: am.Mahasiswa.User.NomorHp ?? '',
                        PendaftaranId: am.PendaftaranId,
                        KodePendaftar: am.KodePendaftar,
                        Nim:
                            am.DaftarUlang.length === 0
                                ? ''
                                : am.DaftarUlang[0].Nim ?? '',
                        SkRektor: am.SkRektorMahasiswa.length > 0 ? true : false,
                        NamaFile:
                            am.SkRektorMahasiswa.length > 0
                                ? am.SkRektorMahasiswa[0].SkRektor.NamaFile ?? ''
                                : '',
                    })) ?? []
    
                return c.json<{
                    data: ResponseSkRektorAsessmenType[]
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
                    data: response,
                    totalElement: total,
                    totalPage: Math.ceil(total / limit),
                    isFirst: page === 1,
                    isLast:
                        page === Math.ceil(total / limit) ||
                        Math.ceil(total / limit) === 0,
                    hasNext: page < Math.ceil(total / limit),
                    hasPrevious: page > 1,
                })
            } else if(isAsesor) {
                const ProgramStudiId = c.req.query('program-studi') || ''
                let where: Prisma.PendaftaranWhereInput = search
                    ? {
                          AND: [
                            {
                                DaftarUlang: {
                                      some: {
                                          ProgramStudi: {
                                              ProgramStudiId: ProgramStudiId,
                                          },
                                      },
                                  },
                            },
                            {
                                AssesorMahasiswa: {
                                    some: {
                                        Asesor: {
                                            UserId: session.user.id
                                        }
                                    }
                                }
                            },
                              {
                                  StatusMahasiswaAssesmentHistory: {
                                      some: {
                                          AND: [
                                              {
                                                  StatusMahasiswaAssesment: {
                                                      NamaStatus:
                                                          'Penerbitan SK Asessmen',
                                                  },
                                              },
                                              {
                                                  Aktif: true,
                                              },
                                          ],
                                      },
                                  },
                              },
                              {
                                  OR: [
                                    {
                                        AssesorMahasiswa: {
                                            some: {
                                                Asesor: {
                                                    User: {
                                                        Nama: {
                                                            contains: search,
                                                            mode: 'insensitive',
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                      {
                                          DaftarUlang: {
                                              some: {
                                                  Nim: {
                                                      contains: search,
                                                      mode: 'insensitive',
                                                  },
                                              },
                                          },
                                      },
                                      {
                                          KodePendaftar: {
                                              contains: search,
                                              mode: 'insensitive',
                                          },
                                      },
                                      {
                                          Mahasiswa: {
                                              User: {
                                                  OR: [
                                                      {
                                                          NomorHp: {
                                                              contains: search,
                                                              mode: 'insensitive',
                                                          },
                                                          Nama: {
                                                              contains: search,
                                                              mode: 'insensitive',
                                                          },
                                                          Email: {
                                                              contains: search,
                                                              mode: 'insensitive',
                                                          },
                                                      },
                                                  ],
                                              },
                                          },
                                      },
                                  ],
                              },
                          ],
                      }
                    : {
                          AND: [
                            {
                                DaftarUlang: {
                                      some: {
                                          ProgramStudi: {
                                              ProgramStudiId: ProgramStudiId,
                                          },
                                      },
                                  },
                            },
                            {
                                AssesorMahasiswa: {some: {Asesor: {
                                    UserId: session.user.id
                                }}} 
                            },
                              {
                                  StatusMahasiswaAssesmentHistory: {
                                      some: {
                                          AND: [
                                              {
                                                  StatusMahasiswaAssesment: {
                                                      NamaStatus:
                                                          'Penerbitan SK Asessmen',
                                                  },
                                              },
                                              {
                                                  Aktif: true,
                                              },
                                          ],
                                      },
                                  },
                              },
                          ],
                      }
                const [data, total] = await Promise.all([
                    prisma.pendaftaran.findMany({
                        where,
                        skip: (page - 1) * limit,
                        take: limit,
                        orderBy: { KodePendaftar: 'asc' },
                        select: {
                            PendaftaranId: true,
                            KodePendaftar: true,
                            SkRektorMahasiswa: {
                                select: {
                                    SkRektor: {
                                        select: {
                                            NamaFile: true,
                                        },
                                    },
                                },
                            },
                            StatusMahasiswaAssesmentHistory: {
                                select: {
                                    Aktif: true,
                                    StatusMahasiswaAssesment: {
                                        select: {
                                            NamaStatus: true,
                                        },
                                    },
                                },
                            },
                            DaftarUlang: {
                                select: {
                                    Nim: true,
                                },
                            },
                            Mahasiswa: {
                                select: {
                                    User: {
                                        select: {
                                            Nama: true,
                                            Email: true,
                                            NomorHp: true,
                                        },
                                    },
                                },
                            },
                        },
                    }),
                    prisma.pendaftaran.count({
                        where,
                    }),
                ])
    
                const response: ResponseSkRektorAsessmenType[] =
                    data?.map((am) => ({
                        Nama: am.Mahasiswa.User.Nama,
                        Email: am.Mahasiswa.User.Email,
                        NomorHp: am.Mahasiswa.User.NomorHp ?? '',
                        PendaftaranId: am.PendaftaranId,
                        KodePendaftar: am.KodePendaftar,
                        Nim:
                            am.DaftarUlang.length === 0
                                ? ''
                                : am.DaftarUlang[0].Nim ?? '',
                        SkRektor: am.SkRektorMahasiswa.length > 0 ? true : false,
                        NamaFile:
                            am.SkRektorMahasiswa.length > 0
                                ? am.SkRektorMahasiswa[0].SkRektor.NamaFile ?? ''
                                : '',
                    })) ?? []
    
                return c.json<{
                    data: ResponseSkRektorAsessmenType[]
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
                    data: response,
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
                const ProgramStudiId = c.req.query('program-studi') || ''
                let where: Prisma.PendaftaranWhereInput = search
                    ? {
                          AND: [
                              {
                                  DaftarUlang: {
                                      some: {
                                          ProgramStudi: {
                                              ProgramStudiId: ProgramStudiId,
                                          },
                                      },
                                  },
                              },
                              {
                                  StatusMahasiswaAssesmentHistory: {
                                      some: {
                                          AND: [
                                              {
                                                OR: [
                                                    {
                                                        StatusMahasiswaAssesment: {
                                                            NamaStatus:
                                                                'Hasil Final Asessmen',
                                                        },
                                                    },
                                                    {
                                                        StatusMahasiswaAssesment: {
                                                            NamaStatus:
                                                                'Penerbitan SK Asessmen',
                                                        },
                                                    }
                                                ]
                                              },
                                              {
                                                  Aktif: true,
                                              },
                                          ],
                                      },
                                  },
                              },
                              {
                                  OR: [
                                      {
                                          DaftarUlang: {
                                              some: {
                                                  Nim: {
                                                      contains: search,
                                                      mode: 'insensitive',
                                                  },
                                              },
                                          },
                                      },
                                      {
                                          KodePendaftar: {
                                              contains: search,
                                              mode: 'insensitive',
                                          },
                                      },
                                      {
                                          Mahasiswa: {
                                              User: {
                                                  OR: [
                                                      {
                                                          NomorHp: {
                                                              contains: search,
                                                              mode: 'insensitive',
                                                          },
                                                          Nama: {
                                                              contains: search,
                                                              mode: 'insensitive',
                                                          },
                                                          Email: {
                                                              contains: search,
                                                              mode: 'insensitive',
                                                          },
                                                      },
                                                  ],
                                              },
                                          },
                                      },
                                  ],
                              },
                          ],
                      }
                    : {
                          AND: [
                              {
                                  DaftarUlang: {
                                      some: {
                                          ProgramStudi: {
                                              ProgramStudiId: ProgramStudiId,
                                          },
                                      },
                                  },
                              },
                              {
                                  StatusMahasiswaAssesmentHistory: {
                                      some: {
                                          AND: [
                                              {
                                                OR: [
                                                    {
                                                        StatusMahasiswaAssesment: {
                                                            NamaStatus:
                                                                'Hasil Final Asessmen',
                                                        },
                                                    },
                                                    {
                                                        StatusMahasiswaAssesment: {
                                                            NamaStatus:
                                                                'Penerbitan SK Asessmen',
                                                        },
                                                    }
                                                ]
                                              },
                                              {
                                                  Aktif: true,
                                              },
                                          ],
                                      },
                                  },
                              },
                          ],
                      }
    
                const [data, total] = await Promise.all([
                    prisma.pendaftaran.findMany({
                        where,
                        skip: (page - 1) * limit,
                        take: limit,
                        orderBy: { KodePendaftar: 'asc' },
                        select: {
                            PendaftaranId: true,
                            KodePendaftar: true,
                            SkRektorMahasiswa: {
                                select: {
                                    SkRektor: {
                                        select: {
                                            NamaFile: true,
                                        },
                                    },
                                },
                            },
                            StatusMahasiswaAssesmentHistory: {
                                select: {
                                    Aktif: true,
                                    StatusMahasiswaAssesment: {
                                        select: {
                                            NamaStatus: true,
                                        },
                                    },
                                },
                            },
                            DaftarUlang: {
                                select: {
                                    Nim: true,
                                },
                            },
                            Mahasiswa: {
                                select: {
                                    User: {
                                        select: {
                                            Nama: true,
                                            Email: true,
                                            NomorHp: true,
                                        },
                                    },
                                },
                            },
                        },
                    }),
                    prisma.pendaftaran.count({
                        where,
                    }),
                ])
    
                const response: ResponseSkRektorAsessmenType[] =
                    data?.map((am) => ({
                        Nama: am.Mahasiswa.User.Nama,
                        Email: am.Mahasiswa.User.Email,
                        NomorHp: am.Mahasiswa.User.NomorHp ?? '',
                        PendaftaranId: am.PendaftaranId,
                        KodePendaftar: am.KodePendaftar,
                        Nim:
                            am.DaftarUlang.length === 0
                                ? ''
                                : am.DaftarUlang[0].Nim ?? '',
                        SkRektor: am.SkRektorMahasiswa.length > 0 ? true : false,
                        NamaFile:
                            am.SkRektorMahasiswa.length > 0
                                ? am.SkRektorMahasiswa[0].SkRektor.NamaFile ?? ''
                                : '',
                    })) ?? []
    
                return c.json<{
                    data: ResponseSkRektorAsessmenType[]
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
                    data: response,
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
        }

        return c.json(
            {
                status: 'error',
                message: 'Query Salah',
                data: [],
            },
            404
        )
    }

    return c.json(
        {
            status: 'error',
            message: 'Data tidak ditemukan',
            data: [],
        },
        404
    )
})

app.post('/', async (c) => {
    const body = await c.req.parseBody()
    
    const file = body.files
    const PendaftaranId = body.PendaftaranId as unknown as string
    const NamaSk = body.NamaSk as unknown as string
    const TahunSk = body.TahunSk as unknown as string
    const NomorSk = body.NomorSk as unknown as string
    const TipeSk = await prisma.tipeSkRektor.findFirst({
        where: {
            Nama: "RPL"
        }
    })

    if (!file || !(file instanceof File)) {
        return c.json(
            { status: 'error', message: 'File is required', data: [] },
            { status: 400 }
        )
    }
    if (!NamaSk) {
        return c.json(
            { status: 'error', message: 'NamaSk Perlu diisi', data: [] },
            { status: 400 }
        )
    }
    if (!TahunSk) {
        return c.json(
            { status: 'error', message: 'TahunSk Perlu diisi', data: [] },
            { status: 400 }
        )
    }
    if (!NomorSk) {
        return c.json(
            { status: 'error', message: 'NomorSk Perlu diisi', data: [] },
            { status: 400 }
        )
    }
    if (!PendaftaranId) {
        return c.json(
            { status: 'error', message: 'Id Pendaftaran Perlu diisi', data: [] },
            { status: 400 }
        )
    }
    if (!TipeSk) {
        return c.json(
            { status: 'error', message: 'Tipe SK Perlu diisi', data: [] },
            { status: 400 }
        )
    }

    const avatarDir = path.join(process.cwd(), 'uploads', 'files')
    
    const skAvail = await prisma.skRektorMahasiswa.findFirst({select: {SkRektorId: true, SkRektor: {select: {NamaFile: true}}}, where: {PendaftaranId: PendaftaranId}});

    if(skAvail) {
        if (file !== null) {
            const oldPath = path.join(avatarDir, skAvail.SkRektor.NamaFile)
            if (fs.existsSync(oldPath)) {
                try {
                    fs.unlinkSync(oldPath)
                } catch (err) {
                    console.error('Failed to delete file :', err)
                }
            }
        }
        await prisma.skRektorMahasiswa.delete({
            where: {
                SkRektorId_PendaftaranId: {
                    SkRektorId: skAvail.SkRektorId,
                    PendaftaranId: PendaftaranId
                }
            }
        })
        await prisma.skRektor.delete({where: {SkRektorId: skAvail.SkRektorId}})
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

    const check = await prisma.skRektorMahasiswa.findFirst({
        where: {
            PendaftaranId: PendaftaranId
        }, select: {
            SkRektor: {
                select: {
                    SkRektorId: true
                }
            }
        }
    })

    let data: SkRektor;
    if(check === null ) {
        data = await prisma.skRektor.create({
            data: {
                NamaDokumen: originalFileName,
                NamaFile: filename, 
                NamaSk: NamaSk,
                FileData: buffer, 
                TahunSk: parseInt(TahunSk),
                NomorSk: NomorSk,
                TipeSkRektorId: TipeSk.TipeSkRektorId,
                CreatedAt: new Date(),
                UpdatedAt: new Date(),
            },
        });
    
        await prisma.skRektorMahasiswa.create({
            data: {
                SkRektorId: data.SkRektorId,
                PendaftaranId: PendaftaranId
            }
        })
    } else {
        data = await prisma.skRektor.update({
            data: {
                NamaDokumen: originalFileName,
                NamaFile: filename, 
                NamaSk: NamaSk,
                FileData: buffer, 
                TahunSk: parseInt(TahunSk),
                NomorSk: NomorSk,
                TipeSkRektorId: TipeSk.TipeSkRektorId,
                UpdatedAt: new Date(),
            },
            where: {
                SkRektorId: check.SkRektor.SkRektorId
            }
        });
    }

    return c.json({
        status: 'success',
        message: 'File uploaded successfully',
        data: data
    })
})

export const GET = handle(app)
export const POST = handle(app)
