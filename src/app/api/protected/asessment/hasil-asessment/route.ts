import { Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { getSession } from '@/provider/api'
import { ResponseFinalAsessmenAsesorPaginationType, ResponseFinalAsessmenPaginationType } from '@/types/FinalAsessmen'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/asessment/hasil-asessment')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const session = await getSession()
    const jenis = c.req.query('jenis')
    const r = c.req.query('r')
    const role = await prisma.role.findFirst({select: {Name: true}, where: {RoleId: r}})

    if (session && role) {
        if(role.Name === 'Mahasiswa') {
            if(jenis === 'get-sanggahan') {
                const page = parseInt(c.req.query('page') || '1', 10)
                const limit = parseInt(c.req.query('limit') || '10', 10)
                const search = c.req.query('search') || ''
        
                let where: Prisma.PendaftaranWhereInput = search
                        ? {
                            AND: [
                                {
                                    Mahasiswa: {
                                        UserId: session.user.id
                                    }
                                },
                                {
                                    StatusMahasiswaAssesmentHistory:{
                                        some: {
                                            AND: [
                                                {
                                                    StatusMahasiswaAssesment : {
                                                        NamaStatus: "Hasil Final Asessmen"
                                                    },
                                                },
                                                {
                                                    Aktif: true
                                                }
                                            ]
                                        }
                                    }
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
                                    ]
                                }
                            ]
                        }
                    : {
                        AND: [
                            {
                                Mahasiswa: {
                                        UserId: session.user.id
                                    }
                            },
                            {
                                StatusMahasiswaAssesmentHistory:{
                                    some: {
                                        AND: [
                                            {
                                                StatusMahasiswaAssesment : {
                                                    NamaStatus: "Hasil Final Asessmen"
                                                },
                                            },
                                            {
                                                Aktif: true
                                            }
                                        ]
                                    }
                                }
                            }
                        ]
                    }
        
                const [data, total] = await Promise.all([
                    prisma.pendaftaran.findMany({
                        where,
                        skip: (page - 1) * limit,
                        take: limit,
                        orderBy: {KodePendaftar: 'asc'},
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
                                    }
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
                        },
                    }), 
                    prisma.pendaftaran.count({
                        where,
                    }),
                ])
    
                const response: ResponseFinalAsessmenPaginationType[] = data.map(item => ({
                    PendaftaranId: item.PendaftaranId,
                    NamaProgramStudi: item.DaftarUlang.length > 0 ? item.DaftarUlang[0].ProgramStudi.Nama : '',
                    KodePendaftar: item.KodePendaftar,
                    NoUjian: item.NoUjian,
                    Periode: item.Periode,
                    Status: item.StatusMahasiswaAssesmentHistory.find(x => x.Aktif) ? item.StatusMahasiswaAssesmentHistory.find(x => x.Aktif)?.StatusMahasiswaAssesment.NamaStatus ?? '' : '',
                    Asesor: item.AssesorMahasiswa.map(x => ({
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
        if(role.Name === 'Asesor') {
            if(jenis === 'get-sanggahan') {
                const page = parseInt(c.req.query('page') || '1', 10)
                const limit = parseInt(c.req.query('limit') || '10', 10)
                const search = c.req.query('search') || ''
        
                let where: Prisma.AsesorWhereInput = search
                        ? {
                            AND: [
                                {
                                    UserId: session.user.id
                                },
                                {
                                    AssesorMahasiswa:{
                                        some: {
                                            Pendaftaran: {
                                                OR: [
                                                    {
                                                        StatusMahasiswaAssesmentHistory:{
                                                            some: {
                                                                AND: [
                                                                    {
                                                                        StatusMahasiswaAssesment : {
                                                                            NamaStatus: "Hasil Final Asessmen"
                                                                        },
                                                                    },
                                                                    {
                                                                        Aktif: true
                                                                    }
                                                                ]
                                                            }
                                                        }, 
                                                    },
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
                                                        }
                                                    
                                                ]
                                            }
                                        }
                                    }
                                },
                                {
                                    OR: [
                                        {
                                            User: {
                                                Nama: {
                                                    contains: search,
                                                    mode: 'insensitive',
                                                },
                                            },
                                        },
                                        {
                                            AssesorMahasiswa: {
                                                some: {
                                                    Pendaftaran: {
                                                        Mahasiswa: {
                                                            User: {
                                                                Nama: {
                                                                    contains: search,
                                                                    mode: 'insensitive',
                                                                },
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    : {
                        AND: [
                            {
                                UserId: session.user.id
                            },
                            {
                                    AssesorMahasiswa:{
                                        some: {
                                            Pendaftaran: {
                                                StatusMahasiswaAssesmentHistory:{
                                                    some: {
                                                        AND: [
                                                            {
                                                                StatusMahasiswaAssesment : {
                                                                    NamaStatus: "Hasil Final Asessmen"
                                                                },
                                                            },
                                                            {
                                                                Aktif: true
                                                            }
                                                        ]
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                        ]
                    }
        
                const [data, total] = await Promise.all([
                    prisma.asesor.findFirst({
                        where,
                        skip: (page - 1) * limit,
                        take: limit,
                        orderBy: {CreatedAt: 'desc'},
                        select: {
                            AssesorMahasiswa: {
                                select: {
                                    Urutan: true,
                                    Confirmation: true,
                                    Pendaftaran: {
                                        select: {
                                            AssesorMahasiswa: {select: {Urutan: true, Asesor: {select: {User: {select: {Nama: true}}}}}},
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
                            },
                        },
                    }), 
                    prisma.asesor.count({
                        where,
                    }),
                ])

                const response: ResponseFinalAsessmenAsesorPaginationType[] = data?.AssesorMahasiswa.map(am => ({
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
        if(role.Name === 'Akademik') {
            if(jenis === 'get-sanggahan') {
                const page = parseInt(c.req.query('page') || '1', 10)
                const limit = parseInt(c.req.query('limit') || '10', 10)
                const search = c.req.query('search') || ''
        
                let where: Prisma.AsesorWhereInput = search
                        ? {
                            AND: [
                                {
                                    AssesorMahasiswa:{
                                        some: {
                                            Pendaftaran: {
                                                OR: [
                                                    {
                                                        StatusMahasiswaAssesmentHistory:{
                                                            some: {
                                                                AND: [
                                                                    {
                                                                        StatusMahasiswaAssesment : {
                                                                            NamaStatus: "Hasil Final Asessmen"
                                                                        },
                                                                    },
                                                                    {
                                                                        Aktif: true
                                                                    }
                                                                ]
                                                            }
                                                        }, 
                                                    },
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
                                                        }
                                                    
                                                ]
                                            }
                                        }
                                    }
                                },
                                {
                                    OR: [
                                        {
                                            User: {
                                                Nama: {
                                                    contains: search,
                                                    mode: 'insensitive',
                                                },
                                            },
                                        },
                                        {
                                            AssesorMahasiswa: {
                                                some: {
                                                    Pendaftaran: {
                                                        Mahasiswa: {
                                                            User: {
                                                                Nama: {
                                                                    contains: search,
                                                                    mode: 'insensitive',
                                                                },
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    : {
                        AND: [
                            {
                                    AssesorMahasiswa:{
                                        some: {
                                            Pendaftaran: {
                                                StatusMahasiswaAssesmentHistory:{
                                                    some: {
                                                        AND: [
                                                            {
                                                                StatusMahasiswaAssesment : {
                                                                    NamaStatus: "Hasil Final Asessmen"
                                                                },
                                                            },
                                                            {
                                                                Aktif: true
                                                            }
                                                        ]
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                        ]
                    }
        
                const [data, total] = await Promise.all([
                    prisma.asesor.findFirst({
                        where,
                        skip: (page - 1) * limit,
                        take: limit,
                        orderBy: {CreatedAt: 'desc'},
                        select: {
                            AssesorMahasiswa: {
                                select: {
                                    Urutan: true,
                                    Confirmation: true,
                                    Pendaftaran: {
                                        select: {
                                            AssesorMahasiswa: {select: {Urutan: true, Asesor: {select: {User: {select: {Nama: true}}}}}},
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
                            },
                        },
                    }), 
                    prisma.asesor.count({
                        where,
                    }),
                ])

                const response: ResponseFinalAsessmenAsesorPaginationType[] = data?.AssesorMahasiswa.map(am => ({
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
