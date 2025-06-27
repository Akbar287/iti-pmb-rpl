import { Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { getSession } from '@/provider/api'
import { ResponseSkRektorAsessmenType } from '@/types/FinalAsessmen'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/asessment/sk-rektor')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const session = await getSession()
    const jenis = c.req.query('jenis')

    if (session) {
        if (jenis === 'get-sk-rektor') {
            const page = parseInt(c.req.query('page') || '1', 10)
            const limit = parseInt(c.req.query('limit') || '10', 10)
            const search = c.req.query('search') || ''
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
                                              StatusMahasiswaAssesment: {
                                                  NamaStatus:
                                                      'Hasil Final Asessmen',
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
                                              StatusMahasiswaAssesment: {
                                                  NamaStatus:
                                                      'Hasil Final Asessmen',
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

export const GET = handle(app)
