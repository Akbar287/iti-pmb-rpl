import { Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { ResponsePenunjukanAsesorForWarek } from '@/types/PenunjukanAsesor'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/approval/asesor')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const page = parseInt(c.req.query('page') || '1', 10)
    const limit = parseInt(c.req.query('limit') || '10', 10)
    const search = c.req.query('search') || ''

    let where: Prisma.DaftarUlangWhereInput = search
        ? {
            Pendaftaran: {
                StatusMahasiswaAssesmentHistory: {
                    some: {
                        Aktif: true,
                        StatusMahasiswaAssesment: {
                            NamaStatus: "Persetujuan Penunjukan Asesor",
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
            Pendaftaran: {
                StatusMahasiswaAssesmentHistory: {
                    some: {
                        Aktif: true,
                        StatusMahasiswaAssesment: {
                            NamaStatus: "Persetujuan Penunjukan Asesor",
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
                                        AssesorMahasiswa: {
                                            select: { AssesorMahasiswaId: true }
                                        },
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
    const responses: ResponsePenunjukanAsesorForWarek[] = data.map(item => ({
        AsesorPertamaId: item.Pendaftaran.AssesorMahasiswa.find(c => c.Urutan == 1)?.Asesor.AsesorId ?? '',
        NamaAsesorPertama: item.Pendaftaran.AssesorMahasiswa.find(c => c.Urutan == 1)?.Asesor.User.Nama ?? '',
        BebanAsesorPertama: item.Pendaftaran.AssesorMahasiswa.find(c => c.Urutan == 1)?.Asesor.AssesorMahasiswa.length ?? 0,
        AsesorKeduaId: item.Pendaftaran.AssesorMahasiswa.find(c => c.Urutan == 2)?.Asesor.AsesorId ?? '',
        NamaAsesorKedua: item.Pendaftaran.AssesorMahasiswa.find(c => c.Urutan == 2)?.Asesor.User.Nama ?? '',
        BebanAsesorKedua: item.Pendaftaran.AssesorMahasiswa.find(c => c.Urutan == 2)?.Asesor.AssesorMahasiswa.length ?? 0,
        Status: item.Pendaftaran.StatusMahasiswaAssesmentHistory.find(x => x.Aktif) ? item.Pendaftaran.StatusMahasiswaAssesmentHistory.find(x => x.Aktif)?.StatusMahasiswaAssesment.NamaStatus ?? '' : '',
        KodePendaftar: item.Pendaftaran.KodePendaftar,
        ProgramStudiId: item.ProgramStudi.ProgramStudiId,
        PendaftaranId: item.Pendaftaran.PendaftaranId,
        NamaProgramStudi: item.ProgramStudi.Nama,
        NamaMahasiswa: item.Pendaftaran.Mahasiswa.User.Nama,
    }))

    return c.json<{
        data: ResponsePenunjukanAsesorForWarek[]
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
})

app.post('/', async (c) => {
    const body: {
        pendaftaranId: string
        approval: string
        catatan: string
    } = await c.req.json()

    const asesorMahasiswa = await prisma.pendaftaran.findFirst({
        where: { PendaftaranId: body.pendaftaranId }, select: {
            AssesorMahasiswa: {
                select: {
                    AssesorMahasiswaId: true,
                    AsesorId: true,
                    Urutan: true,
                    Confirmation: true,
                    SkRektorAssesor: {
                        select: {
                            SkRektor: {
                                select: {
                                    SkRektorId: true
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    if (!asesorMahasiswa) return c.json(null);

    if (body.approval) {
        const AssesorMahasiswaIdBatch = asesorMahasiswa.AssesorMahasiswa.map(x => x.AssesorMahasiswaId)

        await prisma.assesorMahasiswa.updateMany({
            where: {
                AssesorMahasiswaId: {
                    in: AssesorMahasiswaIdBatch,
                },
            },
            data: {
                Confirmation: true,
            },
        });

    }

    const TipeSkRektor = await prisma.tipeSkRektor.findFirst({
        where: {
            Nama: 'Asesor'
        }, select: { TipeSkRektorId: true }
    })
    if (!TipeSkRektor) {
        return c.json(
            { status: "error", message: "Tipe SK Rektor 'Asesor' tidak ditemukan", data: [] },
            { status: 400 }
        );
    }

    if (!asesorMahasiswa || asesorMahasiswa.AssesorMahasiswa.length === 0) {
        return c.json(
            { status: "error", message: "Asesor Mahasiswa belum ada relasi", data: [] },
            { status: 400 }
        );
    }

    const skIds = asesorMahasiswa.AssesorMahasiswa.flatMap((am) =>
        am.SkRektorAssesor.map((sra) => sra.SkRektor.SkRektorId)
    );

    const uniqueSkIds = [...new Set(skIds)];

    const baseSkData = {
        TipeSkRektorId: TipeSkRektor.TipeSkRektorId,
        NamaSk: "",
        TahunSk: 2020,
        NomorSk: "",
        NamaFile: "",
        NamaDokumen: "",
        FileData: Buffer.alloc(0),
        Catatan: body.catatan,
        UpdatedAt: new Date(),
    } as const;

    await prisma.$transaction(async (tx) => {
        if (uniqueSkIds.length === 0) {
            const sk = await tx.skRektor.create({
                data: {
                    ...baseSkData,
                    CreatedAt: new Date(),
                },
            });

            const relasi = asesorMahasiswa.AssesorMahasiswa.map((am) => ({
                AssesorMahasiswaId: am.AssesorMahasiswaId,
                SkRektorId: sk.SkRektorId,
            }));

            await tx.skRektorAssesor.createMany({ data: relasi });
        } else {
            await tx.skRektor.update({
                where: { SkRektorId: uniqueSkIds[0] },
                data: baseSkData,
            });
        }
    });

    return c.json({
        status: 'success',
        message: 'approval success',
        data: []
    })
})

export const GET = handle(app)
export const POST = handle(app)