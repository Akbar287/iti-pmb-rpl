import { Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { getSession } from '@/provider/api'
import { RequestPenunjukanAsesor, ResponseMhsFromAsesorSession, ResponsePenunjukanAsesor } from '@/types/PenunjukanAsesor'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/asessment/asessmen-mahasiswa')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const session = await getSession()
    const jenis = c.req.query('jenis')

    if (session) {
        if(jenis === 'get-mhs-from-asesor') {
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
                                            StatusMahasiswaAssesmentHistory:{
                                                some: {
                                                    AND: [
                                                        {
                                                            StatusMahasiswaAssesment : {
                                                                NamaStatus: "Asessmen Oleh Asesor"
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
                                                                NamaStatus: "Asessmen Oleh Asesor"
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
                                        PendaftaranId: true,
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
            const response: ResponseMhsFromAsesorSession[] =
                data?.AssesorMahasiswa.map((item) => ({
                    UserId: item.Pendaftaran.Mahasiswa.User.UserId,
                    PendaftaranId: item.Pendaftaran.PendaftaranId,
                    Nama: item.Pendaftaran.Mahasiswa.User.Nama,
                    ProgramStudiId: item.Pendaftaran.DaftarUlang.length > 0 ? item.Pendaftaran.DaftarUlang[0].ProgramStudi.ProgramStudiId : '',
                    NamaProgramStudi: item.Pendaftaran.DaftarUlang.length > 0 ? item.Pendaftaran.DaftarUlang[0].ProgramStudi.Nama : '',
                    Confirmation: item.Confirmation,
                    Urutan: item.Urutan
                })) ?? []
    
            return c.json<{
                data: ResponseMhsFromAsesorSession[]
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

app.post('/', async (c) => {
    const body: RequestPenunjukanAsesor = await c.req.json()

    const dataMhs = await prisma.daftarUlang.findFirst({
        select: {
            ProgramStudi: {
                select: { ProgramStudiId: true, Nama: true },
            },
            Pendaftaran: {
                select: {
                    PendaftaranId: true,
                    KodePendaftar: true,
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
                },
            },
        },
        where: {
            ProgramStudiId: body.ProgramStudiId,
            Pendaftaran: {
                KodePendaftar: body.KodePendaftar,
            },
        },
    })

    if (!dataMhs) {
        return c.json({ error: 'Data not found' }, 404)
    }

    const temp = body.Asesor.map((a) => ({
        AsesorId: a.AsesorId,
        PendaftaranId: dataMhs.Pendaftaran.PendaftaranId,
        Confirmation: a.Confirmation,
        Urutan: a.Urutan,
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
    }))

    await prisma.assesorMahasiswa.createMany({ data: temp })

    const asesorData = await prisma.asesor.findMany({
        select: {
            AsesorId: true,
            TipeAsesor: { select: { TipeAsesorId: true, Nama: true } },
            User: { select: { UserId: true, Nama: true } },
        },
        where: {
            AsesorId: {
                in: body.Asesor.map((a) => a.AsesorId),
            },
        },
    })

    const responseData: ResponsePenunjukanAsesor = {
        Asesor: body.Asesor.map((a) => ({
            AssesorMahasiswaId: a.AssesorMahasiswaId,
            AsesorId: a.AsesorId,
            NamaTipeAsesor:
                asesorData.find((ad) => ad.AsesorId === a.AsesorId)?.TipeAsesor
                    .Nama ?? '',
            NamaAsesor:
                asesorData.find((ad) => ad.AsesorId === a.AsesorId)?.User
                    .Nama ?? '',
            Urutan: a.Urutan,
            Confirmation: a.Confirmation,
        })),
        KodePendaftar: dataMhs.Pendaftaran.KodePendaftar,
        ProgramStudiId: dataMhs.ProgramStudi.ProgramStudiId,
        PendaftaranId: dataMhs.Pendaftaran.PendaftaranId,
        NamaProgramStudi: dataMhs.ProgramStudi.Nama,
        NamaMahasiswa: dataMhs.Pendaftaran.Mahasiswa.User.Nama,
    }

    return c.json<ResponsePenunjukanAsesor>(responseData, 200)
})

app.put('/', async (c) => {
    const body: RequestPenunjukanAsesor = await c.req.json()

    const dataMhs = await prisma.daftarUlang.findFirst({
        select: {
            ProgramStudi: {
                select: { ProgramStudiId: true, Nama: true },
            },
            Pendaftaran: {
                select: {
                    PendaftaranId: true,
                    KodePendaftar: true,
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
                },
            },
        },
        where: {
            ProgramStudiId: body.ProgramStudiId,
            Pendaftaran: {
                KodePendaftar: body.KodePendaftar,
                PendaftaranId: body.PendaftaranId,
            },
        },
    })

    if (!dataMhs) {
        return c.json({ error: 'Data mahasiswa not found' }, 404)
    }

    await prisma.assesorMahasiswa.deleteMany({
        where: {
            PendaftaranId: dataMhs.Pendaftaran.PendaftaranId,
            AsesorId: {
                in: body.Asesor.map((a) => a.AsesorId),
            },
        },
    })

    const temp = body.Asesor.map((a) => ({
        AsesorId: a.AsesorId,
        PendaftaranId: dataMhs.Pendaftaran.PendaftaranId,
        Confirmation: a.Confirmation,
        Urutan: a.Urutan,
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
    }))

    await prisma.assesorMahasiswa.createMany({ data: temp })

    const asesorData = await prisma.asesor.findMany({
        select: {
            AsesorId: true,
            TipeAsesor: { select: { TipeAsesorId: true, Nama: true } },
            User: { select: { UserId: true, Nama: true } },
        },
        where: {
            AsesorId: {
                in: body.Asesor.map((a) => a.AsesorId),
            },
        },
    })

    const responseData: ResponsePenunjukanAsesor = {
        Asesor: body.Asesor.map((a) => ({
            AssesorMahasiswaId: a.AssesorMahasiswaId,
            AsesorId: a.AsesorId,
            NamaTipeAsesor:
                asesorData.find((ad) => ad.AsesorId === a.AsesorId)?.TipeAsesor
                    .Nama ?? '',
            NamaAsesor:
                asesorData.find((ad) => ad.AsesorId === a.AsesorId)?.User
                    .Nama ?? '',
            Urutan: a.Urutan,
            Confirmation: a.Confirmation,
        })),
        KodePendaftar: dataMhs.Pendaftaran.KodePendaftar,
        ProgramStudiId: dataMhs.ProgramStudi.ProgramStudiId,
        PendaftaranId: dataMhs.Pendaftaran.PendaftaranId,
        NamaProgramStudi: dataMhs.ProgramStudi.Nama,
        NamaMahasiswa: dataMhs.Pendaftaran.Mahasiswa.User.Nama,
    }

    return c.json<ResponsePenunjukanAsesor>(responseData, 200)
})

app.delete('/', async (c) => {
    const PendaftarId = c.req.query('id')

    const Pendaftaran = await prisma.pendaftaran.findFirst({
        select: { AssesorMahasiswa: { select: { AssesorMahasiswaId: true } } },
        where: { PendaftaranId: PendaftarId },
    })
    if (!Pendaftaran) {
        return c.json({ error: 'Data not found' }, 404)
    }
    await prisma.assesorMahasiswa.deleteMany({
        where: {
            AssesorMahasiswaId: {
                in: Pendaftaran.AssesorMahasiswa.map(
                    (a) => a.AssesorMahasiswaId
                ),
            },
        },
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
