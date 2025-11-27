import { Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { RequestPenunjukanAsesor, ResponseAsesorFromProdi, ResponseMhsFromAsesor, ResponsePenunjukanAsesor } from '@/types/PenunjukanAsesor'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/asesor/penunjukan-asesor')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const jenis = c.req.query('jenis')
    if (jenis === 'get-asesor-from-prodiId') {
        const prodiId = c.req.query('prodiId')

        const data = await prisma.programStudi.findFirst({
            where: { ProgramStudiId: prodiId },
            select: {
                AsesorProgramStudi: {
                    select: {
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
                                AssesorMahasiswa: {
                                    select: {
                                        Confirmation: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        })

        const response: ResponseAsesorFromProdi[] =
            data?.AsesorProgramStudi.map((item) => ({
                AsesorId: item?.Asesor.AsesorId,
                UserId: item?.Asesor.User.UserId,
                Nama: item?.Asesor.User.Nama,
                AssesorMahasiswa: item?.Asesor.AssesorMahasiswa.map((mhs) => ({
                    Confirmation: mhs.Confirmation,
                })),
                TipeAsesor: {
                    Nama: item.Asesor.TipeAsesor.Nama,
                    TipeAsesorId: item.Asesor.TipeAsesor.TipeAsesorId,
                },
                BebanKerja: item.Asesor.AssesorMahasiswa.length
            })) ?? []
        return c.json<ResponseAsesorFromProdi[]>(response, 200)
    }
    if (jenis === 'get-page-mhs-from-asesor') {
        const userId = c.req.query('userId')
        const page = parseInt(c.req.query('page') || '1', 10)
        const limit = parseInt(c.req.query('limit') || '10', 10)
        const search = c.req.query('search') || ''

        let where: Prisma.AsesorWhereInput = search ? {
            UserId: userId,
            AssesorMahasiswa: {
                some: {
                    SkRektorAssesor: { none: {} },
                    OR: [
                        {
                            Asesor: {
                                User: {
                                    Nama: {
                                        contains: search,
                                        mode: 'insensitive',
                                    }
                                }
                            }
                        },
                        {
                            Pendaftaran: {
                                KodePendaftar: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            }
                        },
                        {
                            Pendaftaran: {
                                Mahasiswa: {
                                    User: {
                                        Nama: {
                                            contains: search,
                                            mode: 'insensitive',
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        }
            : {
                UserId: userId,
                AssesorMahasiswa: {
                    some: {
                        SkRektorAssesor: { none: {} },
                    }
                }
            }

        const data = await prisma.asesor.findFirst({
            select: {
                AssesorMahasiswa: {
                    select: {
                        AssesorMahasiswaId: true,
                        Urutan: true,
                        Confirmation: true,
                        Pendaftaran: {
                            select: {
                                AssesorMahasiswa: {
                                    select: {
                                        Urutan: true,
                                        AssesorMahasiswaId: true,
                                        Confirmation: true,
                                        Asesor: {
                                            select: {
                                                AsesorId: true,
                                                TipeAsesor: {
                                                    select: {
                                                        TipeAsesorId: true,
                                                        Nama: true,
                                                    }
                                                },
                                                User: {
                                                    select: {
                                                        UserId: true,
                                                        Nama: true,
                                                    },
                                                },
                                            },
                                        },
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
                                        MahasiswaId: true
                                    }
                                }
                            }
                        }
                    }
                },
            },
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {},
        })

        const total = data?.AssesorMahasiswa?.length ?? 0

        const responses: ResponsePenunjukanAsesor[] = data?.AssesorMahasiswa?.map(item => ({
            AsesorPertamaId: item.Pendaftaran.AssesorMahasiswa.find(c => c.Urutan == 1)?.Asesor.AsesorId ?? '',
            AsesorKeduaId: item.Pendaftaran.AssesorMahasiswa.find(c => c.Urutan == 2)?.Asesor.AsesorId ?? '',
            Status: item.Pendaftaran.StatusMahasiswaAssesmentHistory.find(x => x.Aktif) ? item.Pendaftaran.StatusMahasiswaAssesmentHistory.find(x => x.Aktif)?.StatusMahasiswaAssesment.NamaStatus ?? '' : '',
            KodePendaftar: item.Pendaftaran.KodePendaftar,
            ProgramStudiId: item.Pendaftaran.DaftarUlang.length > 0 ? item.Pendaftaran.DaftarUlang[0].ProgramStudi.ProgramStudiId : '',
            PendaftaranId: item.Pendaftaran.PendaftaranId,
            NamaProgramStudi: item.Pendaftaran.DaftarUlang.length > 0 ? item.Pendaftaran.DaftarUlang[0].ProgramStudi.Nama : '',
            NamaMahasiswa: item.Pendaftaran.Mahasiswa.User.Nama,
        })) ?? []

        return c.json<{
            data: ResponsePenunjukanAsesor[]
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
    if (jenis === 'get-page-mhs-from-akademik') {
        const page = parseInt(c.req.query('page') || '1', 10)
        const limit = parseInt(c.req.query('limit') || '10', 10)
        const search = c.req.query('search') || ''

        let where: Prisma.PendaftaranWhereInput = search ? {
            AssesorMahasiswa: {
                some: {
                    SkRektorAssesor: { none: {} },
                    OR: [
                        {
                            Asesor: {
                                User: {
                                    Nama: {
                                        contains: search,
                                        mode: 'insensitive',
                                    }
                                }
                            }
                        },
                        {
                            Pendaftaran: {
                                KodePendaftar: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            }
                        },
                        {
                            Pendaftaran: {
                                Mahasiswa: {
                                    User: {
                                        Nama: {
                                            contains: search,
                                            mode: 'insensitive',
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        }
            : {
                AssesorMahasiswa: {
                    some: {
                        SkRektorAssesor: { none: {} },
                    }
                }
            }
        const [data, total] = await Promise.all([
            prisma.pendaftaran.findMany({
                select: {
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
                            MahasiswaId: true
                        }
                    },
                    AssesorMahasiswa: {
                        select: {
                            Asesor: {
                                select: {
                                    AsesorId: true,
                                    TipeAsesor: {
                                        select: {
                                            TipeAsesorId: true,
                                            Nama: true,
                                        }
                                    },
                                    User: {
                                        select: {
                                            UserId: true,
                                            Nama: true,
                                        },
                                    },
                                },
                            },
                            AssesorMahasiswaId: true,
                            Urutan: true,
                            Confirmation: true,
                        }
                    }
                },
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { KodePendaftar: 'asc' },
            }),
            prisma.pendaftaran.count({
                where,
            }),
        ])

        const responses: ResponsePenunjukanAsesor[] = data.map(item => ({
            AsesorPertamaId: item.AssesorMahasiswa.find(c => c.Urutan == 1)?.Asesor.AsesorId ?? '',
            AsesorKeduaId: item.AssesorMahasiswa.find(c => c.Urutan == 2)?.Asesor.AsesorId ?? '',
            Status: item.StatusMahasiswaAssesmentHistory.find(x => x.Aktif) ? item.StatusMahasiswaAssesmentHistory.find(x => x.Aktif)?.StatusMahasiswaAssesment.NamaStatus ?? '' : '',
            KodePendaftar: item.KodePendaftar,
            ProgramStudiId: item.DaftarUlang.length > 0 ? item.DaftarUlang[0].ProgramStudi.ProgramStudiId : '',
            PendaftaranId: item.PendaftaranId,
            NamaProgramStudi: item.DaftarUlang.length > 0 ? item.DaftarUlang[0].ProgramStudi.Nama : '',
            NamaMahasiswa: item.Mahasiswa.User.Nama,
        })) ?? []

        return c.json<{
            data: ResponsePenunjukanAsesor[]
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
    if (jenis === 'get-mhs-from-asesorId') {
        const asesorId = c.req.query('asesorId')

        const data = await prisma.asesor.findFirst({
            where: { AsesorId: asesorId },
            select: {
                AssesorMahasiswa: {
                    select: {
                        Confirmation: true,
                        Pendaftaran: {
                            select: {
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
                                        MahasiswaId: true,
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
        })

        const response: ResponseMhsFromAsesor[] =
            data?.AssesorMahasiswa.map((item) => ({
                UserId: item.Pendaftaran.Mahasiswa.User.UserId,
                MahasiswaId: item.Pendaftaran.Mahasiswa.MahasiswaId,
                Nama: item.Pendaftaran.Mahasiswa.User.Nama,
                ProgramStudi: item.Pendaftaran.DaftarUlang.map((item) => ({
                    ProgramStudiId: item.ProgramStudi.ProgramStudiId,
                    Nama: item.ProgramStudi.Nama,
                })),
                Confirmation: item.Confirmation,
            })) ?? []

        return c.json<ResponseMhsFromAsesor[]>(response, 200)
    }
    if (jenis === 'get-asesor-from-mhsId') {
        const mhsId = c.req.query('mhsId')

        const data = await prisma.assesorMahasiswa.findMany({
            where: { Pendaftaran: { MahasiswaId: mhsId } },
            select: {
                Asesor: {
                    select: {
                        AsesorId: true,
                        User: {
                            select: {
                                UserId: true,
                                Nama: true,
                            },
                        },
                        TipeAsesor: {
                            select: {
                                TipeAsesorId: true,
                                Nama: true,
                            },
                        },
                        AssesorMahasiswa: {
                            select: {
                                AssesorMahasiswaId: true
                            }
                        }
                    },
                },
                Confirmation: true,
            },
        })

        const response: ResponseAsesorFromProdi[] = data.map((item) => ({
            AsesorId: item.Asesor.AsesorId,
            UserId: item.Asesor.User.UserId,
            Nama: item.Asesor.User.Nama,
            AssesorMahasiswa: [{ Confirmation: item.Confirmation }],
            TipeAsesor: {
                TipeAsesorId: item.Asesor.TipeAsesor.TipeAsesorId,
                Nama: item.Asesor.TipeAsesor.Nama,
            },
            BebanKerja: item.Asesor.AssesorMahasiswa.length
        }))

        return c.json<ResponseAsesorFromProdi[]>(response, 200)
    }
    if (jenis === 'get-mhs-from-prodiId') {
        const prodiId = c.req.query('prodiId')!

        const data = await prisma.programStudi.findFirst({
            where: { ProgramStudiId: prodiId },
            select: {
                ProgramStudiId: true,
                Nama: true,
                DaftarUlang: {
                    select: {
                        Pendaftaran: {
                            select: {
                                Mahasiswa: {
                                    select: {
                                        MahasiswaId: true,
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
        })

        const response: ResponseMhsFromAsesor[] =
            data?.DaftarUlang.map((item) => ({
                UserId: item.Pendaftaran.Mahasiswa.User.UserId,
                MahasiswaId: item.Pendaftaran.Mahasiswa.MahasiswaId,
                Nama: item.Pendaftaran.Mahasiswa.User.Nama,
                ProgramStudi: [
                    {
                        ProgramStudiId: prodiId,
                        Nama: data?.Nama ?? '',
                    },
                ],
                Confirmation: false,
            })) ?? []

        return c.json<ResponseMhsFromAsesor[]>(response, 200)
    }
    if (jenis === 'get-page-mhs') {
        const prodiId = c.req.query('prodiId')!
        const page = parseInt(c.req.query('page') || '1', 10)
        const limit = parseInt(c.req.query('limit') || '10', 10)
        const search = c.req.query('search') || ''

        let where: Prisma.DaftarUlangWhereInput = search
            ? {
                ProgramStudiId: prodiId,
                Pendaftaran: {
                    StatusMahasiswaAssesmentHistory: {
                        some: {
                            Aktif: true,
                            StatusMahasiswaAssesment: {
                                NamaStatus: "Penunjukan Asesor",
                            },
                        },
                    },
                    OR: [
                        {
                            Mahasiswa: {
                                User: {
                                    Nama: {
                                        contains: search,
                                        mode: "insensitive",
                                    },
                                },
                            },
                        },
                        {
                            KodePendaftar: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            AssesorMahasiswa: {
                                some: {
                                    Asesor: {
                                        User: {
                                            Nama: {
                                                contains: search,
                                                mode: "insensitive",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    ],
                },
            }
            : {
                ProgramStudiId: prodiId,
                Pendaftaran: {
                    StatusMahasiswaAssesmentHistory: {
                        some: {
                            Aktif: true,
                            StatusMahasiswaAssesment: {
                                NamaStatus: "Penunjukan Asesor",
                            },
                        },
                    },
                },
            };

        const [data, total] = await Promise.all([
            prisma.daftarUlang.findMany({
                select: {
                    Pendaftaran: {
                        select: {
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
                                }
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
                                                }
                                            },
                                            User: {
                                                select: {
                                                    UserId: true,
                                                    Nama: true,
                                                },
                                            },
                                        },
                                    }
                                },
                            },
                        }
                    },
                    ProgramStudi: {
                        select: {
                            ProgramStudiId: true,
                            Nama: true,
                        },
                    }
                },
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { Pendaftaran: { KodePendaftar: 'asc' } },
            }),

            prisma.daftarUlang.count({
                where,
            }),
        ])
        const responses: ResponsePenunjukanAsesor[] = data.map(item => ({
            AsesorPertamaId: item.Pendaftaran.AssesorMahasiswa.find(c => c.Urutan == 1)?.Asesor.AsesorId ?? '',
            AsesorKeduaId: item.Pendaftaran.AssesorMahasiswa.find(c => c.Urutan == 1)?.Asesor.AsesorId ?? '',
            Status: item.Pendaftaran.StatusMahasiswaAssesmentHistory.find(x => x.Aktif) ? item.Pendaftaran.StatusMahasiswaAssesmentHistory.find(x => x.Aktif)?.StatusMahasiswaAssesment.NamaStatus ?? '' : '',
            KodePendaftar: item.Pendaftaran.KodePendaftar,
            ProgramStudiId: item.ProgramStudi.ProgramStudiId,
            PendaftaranId: item.Pendaftaran.PendaftaranId,
            NamaProgramStudi: item.ProgramStudi.Nama,
            NamaMahasiswa: item.Pendaftaran.Mahasiswa.User.Nama,
        }))

        return c.json<{
            data: ResponsePenunjukanAsesor[]
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
    const body: RequestPenunjukanAsesor = await c.req.json()

    const dataMhs = await prisma.daftarUlang.findFirst({
        select: {
            ProgramStudi: {
                select: { ProgramStudiId: true, Nama: true },
            },
            Pendaftaran: {
                select: {
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

    const temp = [{
        AsesorId: body.AsesorPertamaId,
        PendaftaranId: dataMhs.Pendaftaran.PendaftaranId,
        Confirmation: false,
        Urutan: 1,
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
    }, {
        AsesorId: body.AsesorKeduaId,
        PendaftaranId: dataMhs.Pendaftaran.PendaftaranId,
        Confirmation: false,
        Urutan: 2,
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
    }, ]

    await prisma.assesorMahasiswa.createMany({ data: temp })

    const responseData: ResponsePenunjukanAsesor = {
        AsesorPertamaId: body.AsesorPertamaId,
        AsesorKeduaId: body.AsesorKeduaId,
        KodePendaftar: dataMhs.Pendaftaran.KodePendaftar,
        ProgramStudiId: dataMhs.ProgramStudi.ProgramStudiId,
        PendaftaranId: dataMhs.Pendaftaran.PendaftaranId,
        NamaProgramStudi: dataMhs.ProgramStudi.Nama,
        Status: dataMhs.Pendaftaran.StatusMahasiswaAssesmentHistory.find(x => x.Aktif) ? dataMhs.Pendaftaran.StatusMahasiswaAssesmentHistory.find(x => x.Aktif)?.StatusMahasiswaAssesment.NamaStatus ?? '' : '',
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
                in: [body.AsesorPertamaId, body.AsesorKeduaId],
            },
        },
    })

    const temp = [{
        AsesorId: body.AsesorPertamaId,
        PendaftaranId: dataMhs.Pendaftaran.PendaftaranId,
        Confirmation: false,
        Urutan: 1,
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
    }, {
        AsesorId: body.AsesorKeduaId,
        PendaftaranId: dataMhs.Pendaftaran.PendaftaranId,
        Confirmation: false,
        Urutan: 2,
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
    }]

    await prisma.assesorMahasiswa.createMany({ data: temp })

    const asesorData = await prisma.asesor.findMany({
        select: {
            AsesorId: true,
            TipeAsesor: { select: { TipeAsesorId: true, Nama: true } },
            User: { select: { UserId: true, Nama: true } },
        },
        where: {
            AsesorId: {
                in: [body.AsesorPertamaId, body.AsesorKeduaId]
            },
        },
    })

    const responseData: ResponsePenunjukanAsesor = {
        AsesorPertamaId: body.AsesorPertamaId,
        AsesorKeduaId: body.AsesorKeduaId,
        KodePendaftar: dataMhs.Pendaftaran.KodePendaftar,
        ProgramStudiId: dataMhs.ProgramStudi.ProgramStudiId,
        PendaftaranId: dataMhs.Pendaftaran.PendaftaranId,
        NamaProgramStudi: dataMhs.ProgramStudi.Nama,
        NamaMahasiswa: dataMhs.Pendaftaran.Mahasiswa.User.Nama,
        Status: dataMhs.Pendaftaran.StatusMahasiswaAssesmentHistory.find(x => x.Aktif) ? dataMhs.Pendaftaran.StatusMahasiswaAssesmentHistory.find(x => x.Aktif)?.StatusMahasiswaAssesment.NamaStatus ?? '' : ''
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
