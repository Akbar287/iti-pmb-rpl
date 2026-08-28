import { Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { ResponseSkRektorAsessmenType } from '@/types/FinalAsessmen'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/asessment/selesai')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const page = parseInt(c.req.query('page') || '1', 10)
    const limit = parseInt(c.req.query('limit') || '10', 10)
    const search = c.req.query('search') || ''

    let where: Prisma.PendaftaranWhereInput = search
        ? {
            AND: [
                {
                    StatusMahasiswaAssesmentHistory: {
                        some: {
                            Aktif: true,
                            StatusMahasiswaAssesment: {
                                NamaStatus: "Selesai",
                            },
                        },
                    },
                },
                {

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
            ]
        } : {
            AND: [
                {

                    StatusMahasiswaAssesmentHistory: {
                        some: {
                            Aktif: true,
                            StatusMahasiswaAssesment: {
                                NamaStatus: "Selesai",
                            },
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
                                NamaFileFinal: true,
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
            Status: am.StatusMahasiswaAssesmentHistory.find(x => x.Aktif) ? am.StatusMahasiswaAssesmentHistory.find(x => x.Aktif)?.StatusMahasiswaAssesment.NamaStatus ?? '' : '',
            ProgramStudi: am.DaftarUlang.length === 0 ? '' : am.DaftarUlang[0].ProgramStudi.Nama ?? '',
            NomorSk: am.SkRektorMahasiswa.length > 0 ? am.SkRektorMahasiswa[0].SkRektor.NomorSk ?? '' : '',
            // Yang diunduh adalah SK final dari Sisurat bila sudah diterima;
            // lampiran hasil asesmen hanya dipakai bila berkas final belum ada.
            NamaFile: am.SkRektorMahasiswa.length > 0 ? (am.SkRektorMahasiswa[0].SkRektor.NamaFileFinal || am.SkRektorMahasiswa[0].SkRektor.NamaFile) ?? '' : '',
            NomorHp: am.Mahasiswa.User.NomorHp ?? '',
            PendaftaranId: am.PendaftaranId,
            KodePendaftar: am.KodePendaftar,
            Nim: am.DaftarUlang.length === 0 ? '' : am.DaftarUlang[0].Nim ?? '',
            SkRektor: am.SkRektorMahasiswa.length > 0 ? true : false,
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