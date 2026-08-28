import { Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { getSession } from '@/provider/api'
import { ResponseFinalAsessmenAsesorPaginationType, ResponseFinalAsessmenPaginationType } from '@/types/FinalAsessmen'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/asessment/hasil-asessment')

app.use('*', withApiAuth)

// Tahap-tahap saat berkas hasil asesmen masih relevan bagi Akademik:
// sedang disiapkan, sedang diajukan, atau dikembalikan untuk direvisi.
// Tahap yang masih ditampilkan pada menu Hasil Asessmen selama SK belum
// dipublikasikan Akademik.
const STATUS_HASIL_BELUM_TERBIT = [
    'Hasil Final Asessmen',
    'Penerbitan SK Asessmen',
    'Proses SK di Sisurat',
    'Sinkronisasi Hasil Asessmen',
    'Selesai',
]

const STATUS_AKADEMIK = [
    'Hasil Final Asessmen',
    'Penerbitan SK Asessmen',
    'Proses SK di Sisurat',
]

/**
 * Berkas yang seluruh SK-nya sudah bertanda tangan berpindah dari menu Hasil
 * Asessmen ke menu Sk. Rektor: pekerjaan Akademik di sini sudah selesai, yang
 * tersisa adalah mempublikasikan SK final dari Sisurat.
 */
const BELUM_TERBIT_SEMUA: Prisma.PendaftaranWhereInput = {
    NOT: {
        AND: [
            { SkRektorMahasiswa: { some: {} } },
            {
                SkRektorMahasiswa: {
                    every: { SkRektor: { Ditandatangani: true } },
                },
            },
        ],
    },
}

app.get('/', async (c) => {
    const session = await getSession()
    const jenis = c.req.query('jenis')
    const r = c.req.query('r')
    const role = await prisma.role.findFirst({ select: { Name: true }, where: { RoleId: r } })

    if (session && role) {
        if (role.Name === 'Mahasiswa') {
            if (jenis === 'get-sanggahan') {
                const page = parseInt(c.req.query('page') || '1', 10)
                const limit = parseInt(c.req.query('limit') || '10', 10)
                const search = c.req.query('search') || ''

                let where: Prisma.AssesorMahasiswaWhereInput = search
                    ? {
                        AND: [
                            {
                                Pendaftaran: {
                                    Mahasiswa: {
                                        User: {
                                            UserId: session.user.id,
                                        }
                                    }
                                }
                            },
                            {
                                Pendaftaran: {
                                    StatusMahasiswaAssesmentHistory: {
                                        some: {
                                            Aktif: true,
                                            StatusMahasiswaAssesment: {
                                                NamaStatus: {
                                                    in: STATUS_HASIL_BELUM_TERBIT,
                                                },
                                            },
                                        },
                                    },
                                    // Begitu SK dipublikasikan Akademik, berkas
                                    // berpindah ke menu Sk. Rektor.
                                    SkRektorMahasiswa: {
                                        none: { SkRektor: { Dipublikasikan: true } },
                                    },
                                },
                            },
                            {
                                Pendaftaran: {
                                    OR: [
                                        {
                                            KodePendaftar: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                        {
                                            NoUjian: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                        {
                                            Periode: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                    ]
                                }
                            }
                        ]
                    }
                    : {
                        AND: [
                            {
                                Pendaftaran: {
                                    Mahasiswa: {
                                        User: {
                                            UserId: session.user.id,
                                        }
                                    }
                                }
                            },
                            {
                                Pendaftaran: {
                                    StatusMahasiswaAssesmentHistory: {
                                        some: {
                                            Aktif: true,
                                            StatusMahasiswaAssesment: {
                                                NamaStatus: {
                                                    in: STATUS_HASIL_BELUM_TERBIT,
                                                },
                                            },
                                        },
                                    },
                                    // Begitu SK dipublikasikan Akademik, berkas
                                    // berpindah ke menu Sk. Rektor.
                                    SkRektorMahasiswa: {
                                        none: { SkRektor: { Dipublikasikan: true } },
                                    },
                                },
                            },
                        ]
                    }

                const [data, total] = await Promise.all([
                    prisma.assesorMahasiswa.findMany({
                        distinct: ['PendaftaranId'],
                        where,
                        skip: (page - 1) * limit,
                        take: limit,
                        orderBy: { Pendaftaran: { KodePendaftar: 'asc' } },
                        select: {
                            Urutan: true,
                            Asesor: {
                                select: {
                                    User: {
                                        select: {
                                            Nama: true
                                        }
                                    }
                                }
                            },
                            Pendaftaran: {
                                select: {
                                    AssesorMahasiswa: {
                                        select: {
                                            Urutan: true,
                                            Asesor: {
                                                select: {
                                                    User: {
                                                        select: {
                                                            Nama: true
                                                        }
                                                    }
                                                }
                                            },
                                        }
                                    },
                                    PendaftaranId: true,
                                    KodePendaftar: true,
                                    NoUjian: true,
                                    Periode: true,
                                    StatusMahasiswaAssesmentHistory: {
                                        select: {
                                            Aktif: true,
                                            StatusMahasiswaAssesment: {
                                                select: {
                                                    NamaStatus: true
                                                }
                                            }
                                        }
                                    },
                                    DaftarUlang: {
                                        select: {
                                            ProgramStudi: {
                                                select: {
                                                    ProgramStudiId: true,
                                                    Nama: true,
                                                },
                                            },
                                        },
                                    },
                                }
                            }
                        },
                    }),
                    prisma.assesorMahasiswa.count({
                        where,
                    }),
                ])

                const response: ResponseFinalAsessmenPaginationType[] = data.map(item => ({
                    PendaftaranId: item.Pendaftaran.PendaftaranId,
                    NamaProgramStudi: item.Pendaftaran.DaftarUlang.length > 0 ? item.Pendaftaran.DaftarUlang[0].ProgramStudi.Nama : '',
                    KodePendaftar: item.Pendaftaran.KodePendaftar,
                    NoUjian: item.Pendaftaran.NoUjian,
                    Periode: item.Pendaftaran.Periode,
                    Status: item.Pendaftaran.StatusMahasiswaAssesmentHistory.find(x => x.Aktif) ? item.Pendaftaran.StatusMahasiswaAssesmentHistory.find(x => x.Aktif)?.StatusMahasiswaAssesment.NamaStatus ?? '' : '',
                    Asesor: item.Pendaftaran.AssesorMahasiswa.map(x => ({
                        Nama: x.Asesor.User.Nama,
                        Urutan: x.Urutan
                    }))
                }))

                return c.json<{
                    data: ResponseFinalAsessmenPaginationType[]
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
        if (role.Name === 'Asesor') {
            if (jenis === 'get-sanggahan') {
                const page = parseInt(c.req.query('page') || '1', 10)
                const limit = parseInt(c.req.query('limit') || '10', 10)
                const search = c.req.query('search') || ''

                let where: Prisma.AssesorMahasiswaWhereInput = search
                    ? {
                        AND: [
                            {
                                Asesor: {
                                    User: {
                                        UserId: session.user.id
                                    }
                                }
                            },
                            {
                                Pendaftaran: {
                                    OR: [
                                        {
                                            StatusMahasiswaAssesmentHistory: {
                                                some: {
                                                    Aktif: true,
                                                    StatusMahasiswaAssesment: {
                                                        NamaStatus: "Hasil Final Asessmen",
                                                    },
                                                },
                                            },
                                        },
                                        {
                                            StatusMahasiswaAssesmentHistory: {
                                                some: {
                                                    Aktif: true,
                                                    StatusMahasiswaAssesment: {
                                                        NamaStatus: "Proses SK di Sisurat",
                                                    },
                                                },
                                            },
                                        },
                                        {
                                            StatusMahasiswaAssesmentHistory: {
                                                some: {
                                                    Aktif: true,
                                                    StatusMahasiswaAssesment: {
                                                        NamaStatus: "Penerbitan SK Asessmen",
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
                                            KodePendaftar: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                        {
                                            NoUjian: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                        {
                                            Periode: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                        {
                                            Mahasiswa: {
                                                User: {
                                                    Nama: {
                                                        contains: search,
                                                        mode: 'insensitive',
                                                    },
                                                },
                                            }
                                        },

                                    ]
                                },
                            },
                        ]
                    }
                    : {
                        AND: [
                            {
                                Asesor: {
                                    User: {
                                        UserId: session.user.id
                                    }
                                }
                            },
                            {
                                Pendaftaran: {
                                    OR: [
                                        {
                                            StatusMahasiswaAssesmentHistory: {
                                                some: {
                                                    Aktif: true,
                                                    StatusMahasiswaAssesment: {
                                                        NamaStatus: "Hasil Final Asessmen",
                                                    },
                                                },
                                            },
                                        },
                                        {
                                            StatusMahasiswaAssesmentHistory: {
                                                some: {
                                                    Aktif: true,
                                                    StatusMahasiswaAssesment: {
                                                        NamaStatus: "Proses SK di Sisurat",
                                                    },
                                                },
                                            },
                                        },
                                        {
                                            StatusMahasiswaAssesmentHistory: {
                                                some: {
                                                    Aktif: true,
                                                    StatusMahasiswaAssesment: {
                                                        NamaStatus: "Penerbitan SK Asessmen",
                                                    },
                                                },
                                            },
                                        },
                                    ]
                                }
                            }
                        ]
                    }

                const [data, total] = await Promise.all([
                    prisma.assesorMahasiswa.findMany({
                        distinct: ['PendaftaranId'],
                        where,
                        skip: (page - 1) * limit,
                        take: limit,
                        orderBy: { CreatedAt: 'desc' },
                        select: {
                            Urutan: true,
                            Confirmation: true,
                            Pendaftaran: {
                                select: {
                                    AssesorMahasiswa: { select: { Urutan: true, Asesor: { select: { User: { select: { Nama: true } } } } } },
                                    KodePendaftar: true,
                                    NoUjian: true,
                                    Periode: true,
                                    PendaftaranId: true,
                                    StatusMahasiswaAssesmentHistory: {
                                        select: {
                                            Aktif: true,
                                            StatusMahasiswaAssesment: {
                                                select: {
                                                    NamaStatus: true
                                                }
                                            }
                                        }
                                    },
                                    DaftarUlang: {
                                        select: {
                                            ProgramStudi: {
                                                select: {
                                                    ProgramStudiId: true,
                                                    Nama: true,
                                                },
                                            },
                                        },
                                    },
                                    Mahasiswa: {
                                        select: {
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
                        },
                    }),
                    prisma.assesorMahasiswa.count({
                        where,
                    }),
                ])

                const response: ResponseFinalAsessmenAsesorPaginationType[] = data?.map(am => ({
                    PendaftaranId: am.Pendaftaran.PendaftaranId ?? '',
                    Nama: am.Pendaftaran.Mahasiswa.User.Nama ?? '',
                    NamaProgramStudi: am.Pendaftaran.DaftarUlang.length === 0 ? '' : am.Pendaftaran.DaftarUlang[0].ProgramStudi.Nama ?? '',
                    KodePendaftar: am.Pendaftaran.KodePendaftar ?? '',
                    NoUjian: am.Pendaftaran.NoUjian ?? '',
                    Periode: am.Pendaftaran.Periode ?? '',
                    Status: am.Pendaftaran.StatusMahasiswaAssesmentHistory.find(x => x.Aktif) ? am.Pendaftaran.StatusMahasiswaAssesmentHistory.find(x => x.Aktif)?.StatusMahasiswaAssesment.NamaStatus ?? '' : '',
                    Asesor: am.Pendaftaran.AssesorMahasiswa.map(x => ({
                        Nama: x.Asesor.User.Nama,
                        Urutan: x.Urutan
                    }))
                })) ?? []

                return c.json<{
                    data: ResponseFinalAsessmenAsesorPaginationType[]
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
        if (role.Name === 'Akademik') {
            if (jenis === 'get-sanggahan') {
                const page = parseInt(c.req.query('page') || '1', 10)
                const limit = parseInt(c.req.query('limit') || '10', 10)
                const search = c.req.query('search') || ''

                let where: Prisma.AssesorMahasiswaWhereInput = search
                    ? {
                        Pendaftaran: {
                            AND: [
                                BELUM_TERBIT_SEMUA,
                                {
                                    StatusMahasiswaAssesmentHistory: {
                                        some: {
                                            Aktif: true,
                                            StatusMahasiswaAssesment: {
                                                // Berkas tetap tampil bagi Akademik selama
                                                // masih disiapkan maupun sedang diajukan.
                                                NamaStatus: {
                                                    in: STATUS_AKADEMIK,
                                                },
                                            },
                                        },
                                    },
                                },
                                {
                                    OR: [
                                        {
                                            KodePendaftar: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                        {
                                            NoUjian: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                        {
                                            Periode: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                        {
                                            Mahasiswa: {
                                                User: {
                                                    Nama: {
                                                        contains: search,
                                                        mode: 'insensitive',
                                                    },
                                                },
                                            },
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                    : {
                        Pendaftaran: {
                            AND: [
                                BELUM_TERBIT_SEMUA,
                                {
                                    StatusMahasiswaAssesmentHistory: {
                                        some: {
                                            Aktif: true,
                                            StatusMahasiswaAssesment: {
                                                NamaStatus: {
                                                    in: STATUS_AKADEMIK,
                                                },
                                            },
                                        },
                                    },
                                },
                            ],
                        }
                    }

                const [data, total] = await Promise.all([
                    prisma.assesorMahasiswa.findMany({
                        distinct: ['PendaftaranId'],
                        where,
                        skip: (page - 1) * limit,
                        take: limit,
                        orderBy: { CreatedAt: 'desc' },
                        select: {

                            Urutan: true,
                            Confirmation: true,
                            Pendaftaran: {
                                select: {
                                    AssesorMahasiswa: { select: { Urutan: true, Asesor: { select: { User: { select: { Nama: true } } } } } },
                                    KodePendaftar: true,
                                    NoUjian: true,
                                    Periode: true,
                                    PendaftaranId: true,
                                    StatusMahasiswaAssesmentHistory: {
                                        select: {
                                            Aktif: true,
                                            StatusMahasiswaAssesment: {
                                                select: {
                                                    NamaStatus: true
                                                }
                                            }
                                        }
                                    },
                                    DaftarUlang: {
                                        select: {
                                            ProgramStudi: {
                                                select: {
                                                    ProgramStudiId: true,
                                                    Nama: true,
                                                },
                                            },
                                        },
                                    },
                                    Mahasiswa: {
                                        select: {
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
                        },
                    }),
                    prisma.assesorMahasiswa.count({
                        where,
                    }),
                ])

                const response: ResponseFinalAsessmenAsesorPaginationType[] = data?.map(am => ({
                    PendaftaranId: am.Pendaftaran.PendaftaranId ?? '',
                    Nama: am.Pendaftaran.Mahasiswa.User.Nama ?? '',
                    NamaProgramStudi: am.Pendaftaran.DaftarUlang.length === 0 ? '' : am.Pendaftaran.DaftarUlang[0].ProgramStudi.Nama ?? '',
                    KodePendaftar: am.Pendaftaran.KodePendaftar ?? '',
                    NoUjian: am.Pendaftaran.NoUjian ?? '',
                    Periode: am.Pendaftaran.Periode ?? '',
                    Status: am.Pendaftaran.StatusMahasiswaAssesmentHistory.find(x => x.Aktif) ? am.Pendaftaran.StatusMahasiswaAssesmentHistory.find(x => x.Aktif)?.StatusMahasiswaAssesment.NamaStatus ?? '' : '',
                    Asesor: am.Pendaftaran.AssesorMahasiswa.map(x => ({
                        Nama: x.Asesor.User.Nama,
                        Urutan: x.Urutan
                    }))
                })) ?? []

                return c.json<{
                    data: ResponseFinalAsessmenAsesorPaginationType[]
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

        return c.json({
            status: 'error',
            message: 'Query Salah',
            data: []
        }, 404)
    }

    return c.json({
        status: 'error',
        message: 'Data tidak ditemukan',
        data: []
    }, 404)
})

export const GET = handle(app)
