import { Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { ResponseSkRektorAsessmenType } from '@/types/FinalAsessmen'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { cookies } from 'next/headers'

const app = new Hono().basePath('/api/protected/asessment/sinkronisasi')
const BASE_URL = process.env.BACKEND_API_BASE_URL

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const page = parseInt(c.req.query('page') || '1', 10)
    const limit = parseInt(c.req.query('limit') || '10', 10)
    const search = c.req.query('search') || ''

    let where: Prisma.AssesorMahasiswaWhereInput = search
        ? {
            AND: [
                {
                    Pendaftaran: {
                        OR: [
                            {
                                StatusMahasiswaAssesmentHistory: {
                                    some: {
                                        Aktif: true,
                                        StatusMahasiswaAssesment: {
                                            NamaStatus: "Sinkronisasi Hasil Asessmen",
                                        },
                                    },
                                },
                            },
                        ]
                    }
                },
                {
                    Pendaftaran: {
                        OR: [
                            {
                                Mahasiswa: {
                                    User: {
                                        Nama: {
                                            contains: search,
                                            mode: 'insensitive',
                                        }
                                    }
                                }
                            },
                            {
                                KodePendaftar: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                DaftarUlang: {
                                    some: {
                                        Nim: {
                                            contains: search,
                                            mode: 'insensitive',
                                        },
                                        ProgramStudi: {
                                            Nama: {
                                                contains: search,
                                                mode: 'insensitive',
                                            }
                                        },
                                    },
                                }
                            }
                        ]
                    }
                }
            ]
        } : {
            AND: [
                {
                    Pendaftaran: {
                        OR: [
                            {
                                StatusMahasiswaAssesmentHistory: {
                                    some: {
                                        Aktif: true,
                                        StatusMahasiswaAssesment: {
                                            NamaStatus: "Sinkronisasi Hasil Asessmen",
                                        },
                                    },
                                },
                            },
                        ]
                    }
                },
            ],
        }
    const [data, total] = await Promise.all([
        prisma.assesorMahasiswa.findMany({
            distinct: ['PendaftaranId'],
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { Pendaftaran: { KodePendaftar: 'asc' } },
            select: {
                PendaftaranId: true,
                Pendaftaran: {
                    select: {
                        KodePendaftar: true,
                        SkRektorMahasiswa: {
                            select: {
                                SkRektor: {
                                    select: {
                                        NamaFile: true,
                                        NomorSk: true,
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
                                ProgramStudi: {
                                    select: {
                                        Nama: true,
                                    },
                                }
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
                    }
                },
            },
        }),
        prisma.assesorMahasiswa.count({
            where,
        }),
    ])

    const response: ResponseSkRektorAsessmenType[] =
        data?.map((am) => ({
            Nama: am.Pendaftaran.Mahasiswa.User.Nama,
            Email: am.Pendaftaran.Mahasiswa.User.Email,
            Status: am.Pendaftaran.StatusMahasiswaAssesmentHistory.find(x => x.Aktif) ? am.Pendaftaran.StatusMahasiswaAssesmentHistory.find(x => x.Aktif)?.StatusMahasiswaAssesment.NamaStatus ?? '' : '',
            ProgramStudi: am.Pendaftaran.DaftarUlang.length === 0 ? '' : am.Pendaftaran.DaftarUlang[0].ProgramStudi.Nama ?? '',
            NomorSk: am.Pendaftaran.SkRektorMahasiswa.length > 0 ? am.Pendaftaran.SkRektorMahasiswa[0].SkRektor.NomorSk ?? '' : '',
            NamaFile: am.Pendaftaran.SkRektorMahasiswa.length > 0 ? am.Pendaftaran.SkRektorMahasiswa[0].SkRektor.NamaFile ?? '' : '',
            NomorHp: am.Pendaftaran.Mahasiswa.User.NomorHp ?? '',
            PendaftaranId: am.PendaftaranId,
            KodePendaftar: am.Pendaftaran.KodePendaftar,
            Nim: am.Pendaftaran.DaftarUlang.length === 0 ? '' : am.Pendaftaran.DaftarUlang[0].Nim ?? '',
            SkRektor: am.Pendaftaran.SkRektorMahasiswa.length > 0 ? true : false,
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
})

export const GET = handle(app)
export const POST = handle(app)