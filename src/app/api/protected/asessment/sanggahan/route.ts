import { Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { getSession } from '@/provider/api'
import { ResponseSanggahanAsesorPaginationType, ResponseSanggahanMhsPaginationType } from '@/types/SanggahanTypes'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { cookies } from 'next/headers'
const BASE_URL = process.env.BACKEND_API_BASE_URL
const app = new Hono().basePath('/api/protected/asessment/sanggahan')

app.use('*', withApiAuth)

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

                let where: Prisma.PendaftaranWhereInput = search
                    ? {
                        AND: [
                            {
                                Mahasiswa: {
                                    User: {
                                        UserId: session.user.id,
                                    }
                                }
                            },
                            {
                                StatusMahasiswaAssesmentHistory: {
                                    some: {
                                        Aktif: true,
                                        StatusMahasiswaAssesment: {
                                            NamaStatus: "Sanggahan",
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
                                ]
                            }
                        ]
                    }
                    : {
                        AND: [
                            {
                                Mahasiswa: {
                                    User: {
                                        UserId: session.user.id,
                                    }
                                }
                            },
                            {
                                StatusMahasiswaAssesmentHistory: {
                                    some: {
                                        Aktif: true,
                                        StatusMahasiswaAssesment: {
                                            NamaStatus: "Sanggahan",
                                        },
                                    },
                                },
                            },
                        ]
                    }

                const [data, total] = await Promise.all([
                    prisma.pendaftaran.findMany({
                        where,
                        skip: (page - 1) * limit,
                        take: limit,
                        orderBy: { KodePendaftar: 'asc' },
                        select: {
                            SanggahanAssesmen: {
                                select: {
                                    SanggahanAssesmenId: true,
                                    ProsesBanding: true,
                                    DiskusiBanding: true
                                }
                            },
                            _count: {
                                select: {
                                    MataKuliahMahasiswa: true
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

                const response: ResponseSanggahanMhsPaginationType[] = data.map(item => ({
                    PendaftaranId: item.PendaftaranId,
                    NamaProgramStudi: item.DaftarUlang.length > 0 ? item.DaftarUlang[0].ProgramStudi.Nama : '',
                    KodePendaftar: item.KodePendaftar,
                    NoUjian: item.NoUjian,
                    Periode: item.Periode,
                    MataKuliah: item._count.MataKuliahMahasiswa,
                    Status: item.StatusMahasiswaAssesmentHistory.find(x => x.Aktif) ? item.StatusMahasiswaAssesmentHistory.find(x => x.Aktif)?.StatusMahasiswaAssesment.NamaStatus ?? '' : '',
                    SanggahanAssesmenId: item.SanggahanAssesmen.length === 0 ? '' : item.SanggahanAssesmen[0].SanggahanAssesmenId ?? '',
                    SanggahanProsesBanding: item.SanggahanAssesmen.length === 0 ? false : item.SanggahanAssesmen[0].ProsesBanding ?? false,
                    SanggahanDiskusiBanding: item.SanggahanAssesmen.length === 0 ? false : item.SanggahanAssesmen[0].DiskusiBanding ?? false,
                }))

                return c.json<{
                    data: ResponseSanggahanMhsPaginationType[]
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
                                    AND: [
                                        {
                                            StatusMahasiswaAssesmentHistory: {
                                                some: {
                                                    Aktif: true,
                                                    StatusMahasiswaAssesment: {
                                                        NamaStatus: "Sanggahan",
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
                                                }
                                            ]
                                        }
                                    ]

                                }
                            },
                            {
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
                                    AND: [
                                        {
                                            StatusMahasiswaAssesmentHistory: {
                                                some: {
                                                    Aktif: true,
                                                    StatusMahasiswaAssesment: {
                                                        NamaStatus: "Sanggahan",
                                                    },
                                                },
                                            },
                                        },
                                    ]

                                }
                            },
                        ]
                    }

                const [data, total] = await Promise.all([
                    prisma.assesorMahasiswa.findMany({
                        where,
                        skip: (page - 1) * limit,
                        take: limit,
                        orderBy: { CreatedAt: 'desc' },
                        select: {
                            Urutan: true,
                            Confirmation: true,
                            Pendaftaran: {
                                select: {
                                    KodePendaftar: true,
                                    NoUjian: true,
                                    Periode: true,
                                    _count: {
                                        select: { MataKuliahMahasiswa: true }
                                    },
                                    PendaftaranId: true,
                                    SanggahanAssesmen: {
                                        select: {
                                            SanggahanAssesmenId: true,
                                            ProsesBanding: true,
                                            DiskusiBanding: true
                                        }
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

                const response: ResponseSanggahanAsesorPaginationType[] = data.map(am => ({
                    PendaftaranId: am.Pendaftaran.PendaftaranId ?? '',
                    Nama: am.Pendaftaran.Mahasiswa.User.Nama ?? '',
                    NamaProgramStudi: am.Pendaftaran.DaftarUlang.length === 0 ? '' : am.Pendaftaran.DaftarUlang[0].ProgramStudi.Nama ?? '',
                    KodePendaftar: am.Pendaftaran.KodePendaftar ?? '',
                    NoUjian: am.Pendaftaran.NoUjian ?? '',
                    Periode: am.Pendaftaran.Periode ?? '',
                    MataKuliah: am.Pendaftaran._count.MataKuliahMahasiswa ?? '',
                    Status: am.Pendaftaran.StatusMahasiswaAssesmentHistory.find(x => x.Aktif) ? am.Pendaftaran.StatusMahasiswaAssesmentHistory.find(x => x.Aktif)?.StatusMahasiswaAssesment.NamaStatus ?? '' : '',
                    SanggahanAssesmenId: am.Pendaftaran.SanggahanAssesmen.length === 0 ? '' : am.Pendaftaran.SanggahanAssesmen[0].SanggahanAssesmenId ?? '',
                    SanggahanProsesBanding: am.Pendaftaran.SanggahanAssesmen.length === 0 ? false : am.Pendaftaran.SanggahanAssesmen[0].ProsesBanding ?? false,
                    SanggahanDiskusiBanding: am.Pendaftaran.SanggahanAssesmen.length === 0 ? false : am.Pendaftaran.SanggahanAssesmen[0].DiskusiBanding ?? false,
                }))

                return c.json<{
                    data: ResponseSanggahanAsesorPaginationType[]
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

app.post('/', async (c) => {
    const body: {
        SanggahanAssesmenId: string
        PendaftaranId: string
        ProsesBanding: boolean
        DiskusiBanding: boolean
        CreatedAt: Date | null
        UpdatedAt: Date | null
        SanggahanAssesmenMk: {
            SanggahanAssesmenMkId: string
            SanggahanAssesmenId: string
            MataKuliahMahasiswaId: string
            Keterangan: string | null
            CreatedAt: Date | null
            UpdatedAt: Date | null
        }[]
        SanggahanAssesmenPihak: {
            SanggahanAssesmenPihakId: string
            SanggahanAssesmenId: string
            NamaPihak: string
            JabatanPihak: string | null
            InstansiPihak: string | null
            CreatedAt: Date | null
            UpdatedAt: Date | null
        }[]
    } = await c.req.json()

    const sanggahan = await prisma.sanggahanAssesmen.upsert({
        select: {
            SanggahanAssesmenId: true,
            PendaftaranId: true,
            ProsesBanding: true,
            DiskusiBanding: true,
            CreatedAt: true,
            UpdatedAt: true,
            Pendaftaran: {
                select: {
                    NoUjian: true,
                    Mahasiswa: {
                        select: {
                            User: {
                                select: {
                                    Nama: true
                                }
                            }
                        }
                    },
                    AssesorMahasiswa: {
                        select: {
                            Asesor: {
                                select: {
                                    User: {
                                        select: {
                                            NomorWa: true,
                                            Nama: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            SanggahanAssesmenMk: {
                select: {
                    SanggahanAssesmenId: true
                }
            },
            SanggahanAssesmenPihak: { select: { SanggahanAssesmenPihakId: true } }
        },
        where: {
            PendaftaranId: body.PendaftaranId,
        },
        update: {
            ProsesBanding: body.ProsesBanding,
            DiskusiBanding: body.DiskusiBanding,
            UpdatedAt: new Date(),
        },
        create: {
            PendaftaranId: body.PendaftaranId,
            ProsesBanding: body.ProsesBanding,
            DiskusiBanding: body.DiskusiBanding,
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
        },
    });

    if (sanggahan.SanggahanAssesmenPihak.length > 0) {
        await prisma.sanggahanAssesmenPihak.deleteMany({ where: { SanggahanAssesmenId: sanggahan.SanggahanAssesmenId } })
    }
    const sap = await prisma.sanggahanAssesmenPihak.createManyAndReturn({
        data: body.SanggahanAssesmenPihak.map(sap => ({
            SanggahanAssesmenId: sanggahan.SanggahanAssesmenId,
            NamaPihak: sap.NamaPihak,
            JabatanPihak: sap.JabatanPihak,
            InstansiPihak: sap.InstansiPihak,
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
        }))
    })

    if (sanggahan.SanggahanAssesmenMk.length > 0) {
        await prisma.sanggahanAssesmenMk.deleteMany({ where: { SanggahanAssesmenId: sanggahan.SanggahanAssesmenId } })
    }
    const sam = await prisma.sanggahanAssesmenMk.createManyAndReturn({
        data: body.SanggahanAssesmenMk.map(sam => ({
            SanggahanAssesmenId: sanggahan.SanggahanAssesmenId,
            MataKuliahMahasiswaId: sam.MataKuliahMahasiswaId,
            Keterangan: sam.Keterangan,
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
        }))
    })

    // Kirim Pemberitahuan Sanggahan by WA ke Asesor
    const cookieHeader = (await cookies()).toString();
    
        await Promise.all(
            sanggahan.Pendaftaran.AssesorMahasiswa.map(async (x) => {
                const target = x.Asesor.User.NomorWa ?? x.Asesor.User.NomorWa ?? "";
                if (!target) return;
    
                const params = new URLSearchParams({
                    target: String(target),
                    message: `Halo, ${x.Asesor.User.Nama}. Mahasiswa ${sanggahan.Pendaftaran.Mahasiswa.User.Nama} dengan Nomor Ujian ${sanggahan.Pendaftaran.NoUjian} telah mengajukan sanggahan pada ${sanggahan.CreatedAt}. Mohon untuk menindaklanjuti sanggahan tersebut melalui Sistem Informasi RPL Terpadu. Terima Kasih.`,
                    jenis: "sendWaText",
                });
    
                await fetch(`${BASE_URL}/api/protected/whatsapp?${params.toString()}`, {
                    method: "POST",
                    headers: {
                        cookie: cookieHeader,
                        "Content-Type": "application/json",
                    },
                });
            }),
        );

    return c.json<{
        SanggahanAssesmenId: string
        PendaftaranId: string
        ProsesBanding: boolean
        DiskusiBanding: boolean
        CreatedAt: Date | null
        UpdatedAt: Date | null
        SanggahanAssesmenMk: {
            SanggahanAssesmenMkId: string
            SanggahanAssesmenId: string
            MataKuliahMahasiswaId: string
            Keterangan: string | null
            CreatedAt: Date | null
            UpdatedAt: Date | null
        }[]
        SanggahanAssesmenPihak: {
            SanggahanAssesmenPihakId: string
            SanggahanAssesmenId: string
            NamaPihak: string
            JabatanPihak: string | null
            InstansiPihak: string | null
            CreatedAt: Date | null
            UpdatedAt: Date | null
        }[]
    }>({
        SanggahanAssesmenId: sanggahan.SanggahanAssesmenId,
        PendaftaranId: sanggahan.PendaftaranId,
        ProsesBanding: sanggahan.ProsesBanding,
        DiskusiBanding: sanggahan.DiskusiBanding,
        CreatedAt: sanggahan.CreatedAt,
        UpdatedAt: sanggahan.UpdatedAt,
        SanggahanAssesmenMk: sam.map(s => ({
            SanggahanAssesmenMkId: s.SanggahanAssesmenMkId,
            SanggahanAssesmenId: s.SanggahanAssesmenId,
            MataKuliahMahasiswaId: s.MataKuliahMahasiswaId,
            Keterangan: s.Keterangan,
            CreatedAt: s.CreatedAt,
            UpdatedAt: s.UpdatedAt,
        })),
        SanggahanAssesmenPihak: sap.map(s => ({
            SanggahanAssesmenPihakId: s.SanggahanAssesmenPihakId,
            SanggahanAssesmenId: s.SanggahanAssesmenId,
            NamaPihak: s.NamaPihak,
            JabatanPihak: s.JabatanPihak,
            InstansiPihak: s.InstansiPihak,
            CreatedAt: s.CreatedAt,
            UpdatedAt: s.UpdatedAt,
        }))
    }, 200)
})
app.put('/', async (c) => {
    const body: {
        HasilAssesmenId: string
        EvaluasiDiriId: string
        Valid: boolean
        Autentik: boolean
        Terkini: boolean
        Memadai: boolean
        Assesmen: string
        Nilai: number
        TanggalAssesmen: Date
        Ai: boolean
    } = await c.req.json()

    const ha = await prisma.hasilAssesmen.upsert({
        where: {
            EvaluasiDiriId: body.EvaluasiDiriId,
        },
        update: {
            Valid: body.Valid,
            Autentik: body.Autentik,
            Terkini: body.Terkini,
            Memadai: body.Memadai,
            Assesmen: body.Assesmen,
            Nilai: body.Nilai,
            TanggalAssesmen: body.TanggalAssesmen,
            Ai: body.Ai,
            UpdatedAt: new Date()
        },
        create: {
            EvaluasiDiriId: body.EvaluasiDiriId,
            Valid: body.Valid,
            Autentik: body.Autentik,
            Terkini: body.Terkini,
            Memadai: body.Memadai,
            Assesmen: body.Assesmen,
            Nilai: body.Nilai,
            TanggalAssesmen: body.TanggalAssesmen,
            Ai: body.Ai,
            CreatedAt: new Date(),
            UpdatedAt: new Date()
        },
    });

    return c.json<{
        HasilAssesmenId: string
        EvaluasiDiriId: string
        Valid: boolean
        Autentik: boolean
        Terkini: boolean
        Memadai: boolean
        Assesmen: string
        Nilai: number
        TanggalAssesmen: Date
    }>({
        HasilAssesmenId: ha.HasilAssesmenId,
        EvaluasiDiriId: ha.EvaluasiDiriId,
        Valid: ha.Valid,
        Autentik: ha.Autentik,
        Terkini: ha.Terkini,
        Memadai: ha.Memadai,
        Assesmen: ha.Assesmen ?? '',
        Nilai: ha.Nilai,
        TanggalAssesmen: ha.TanggalAssesmen ?? new Date(),
    }, 200)
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
