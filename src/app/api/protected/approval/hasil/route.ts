import { Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { ResponseHasilAsessmenForWarek } from '@/types/PenunjukanAsesor'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { cookies } from 'next/headers'
import mime from 'mime'

const app = new Hono().basePath('/api/protected/approval/hasil')
const BASE_URL = process.env.BACKEND_API_BASE_URL
app.use('*', withApiAuth)

app.get('/', async (c) => {
    const file = c.req.query('file') || ''
    
    if(file !== '') { 
        const sk = await prisma.skRektor.findFirst({
            where: {NamaFile: file},
            select: {
                FileData: true,
                NamaDokumen: true
            }
        })

        if (!sk) {
            return c.json(
                { data: [], status: 'error', message: 'file is required' },
                { status: 400 }
            )
        }
        try {
            if (!sk || !sk.FileData) {
                return c.json(
                    { data: [], status: 'error', message: 'file not found in DB' },
                    { status: 404 }
                )
            }

            return c.body(sk.FileData, 200, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename="${sk.NamaDokumen}"`,
            })
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'error'
            return c.json(
                { data: [], status: 'error', message: errorMessage },
                { status: 500 }
            )
        }
    } else {
        const page = parseInt(c.req.query('page') || '1', 10)
        const limit = parseInt(c.req.query('limit') || '10', 10)
        const search = c.req.query('search') || ''

        let where: Prisma.AssesorMahasiswaWhereInput = search
            ? {
                Pendaftaran: {
                    AND: [
                        {
                            StatusMahasiswaAssesmentHistory: {
                                some: {
                                    Aktif: true,
                                    StatusMahasiswaAssesment: {
                                        NamaStatus: "Persetujuan Hasil Final",
                                    },
                                },
                            }
                        },
                        {
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
                                    DaftarUlang: {
                                        some: {
                                            ProgramStudi: {
                                                Nama: {
                                                    contains: search,
                                                    mode: "insensitive",
                                                },
                                            }
                                        }
                                    }
                                }
                            ],
                        }
                    ]
                }
            } : {
                Pendaftaran: {
                    StatusMahasiswaAssesmentHistory: {
                        some: {
                            Aktif: true,
                            StatusMahasiswaAssesment: {
                                NamaStatus: "Persetujuan Hasil Final",
                            },
                        },
                    }
                }
            }
    
        const [data, total] = await Promise.all([
            prisma.assesorMahasiswa.findMany({
                distinct: ['PendaftaranId'],
                select: {
                    Pendaftaran: {
                        select: {
                            SkRektorMahasiswa: {
                                select: {
                                    SkRektor: {
                                        select: {
                                            NamaSk: true,
                                            NomorSk: true,
                                            TahunSk: true,
                                            NamaDokumen: true,
                                            NamaFile: true,
                                        }
                                    }
                                }
                            },
                            KodePendaftar: true,
                            PendaftaranId: true,
                            MataKuliahMahasiswa: {
                                select: {
                                    MataKuliahMahasiswaId: true
                                }
                            },
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
                            DaftarUlang: {
                                select: {
                                    ProgramStudi: {
                                        select: {
                                            Nama: true,
                                        }
                                    }
                                }
                            }
                        },
                    },
                },
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { Pendaftaran: { KodePendaftar: 'asc' } },
            }),
    
            prisma.assesorMahasiswa.count({
                where,
            }),
        ])
        const responses: ResponseHasilAsessmenForWarek[] = data.map(item => ({
            PendaftaranId: item.Pendaftaran.PendaftaranId,
            KodePendaftar: item.Pendaftaran.KodePendaftar,
            NamaProgramStudi: item.Pendaftaran.DaftarUlang[0].ProgramStudi.Nama,
            NamaMahasiswa: item.Pendaftaran.Mahasiswa.User.Nama,
            TotalMk: item.Pendaftaran.MataKuliahMahasiswa.length,
            Sk: {
                NamaSk: item.Pendaftaran.SkRektorMahasiswa.length > 0 ? item.Pendaftaran.SkRektorMahasiswa[0].SkRektor.NamaSk : '',
                NomorSk: item.Pendaftaran.SkRektorMahasiswa.length > 0 ? item.Pendaftaran.SkRektorMahasiswa[0].SkRektor.NomorSk : '',
                TahunSk: item.Pendaftaran.SkRektorMahasiswa.length > 0 ? item.Pendaftaran.SkRektorMahasiswa[0].SkRektor.TahunSk : 0,
                NamaDokumen: item.Pendaftaran.SkRektorMahasiswa.length > 0 ? item.Pendaftaran.SkRektorMahasiswa[0].SkRektor.NamaDokumen : '',
                NamaFile: item.Pendaftaran.SkRektorMahasiswa.length > 0 ? item.Pendaftaran.SkRektorMahasiswa[0].SkRektor.NamaFile : '',
            }
        }))
    
        return c.json<{
            data: ResponseHasilAsessmenForWarek[]
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

})

app.post('/', async (c) => {
    const body: {
        pendaftaranId: string
        approval: string
        catatan: string
    } = await c.req.json()

    const asesorMahasiswa = await prisma.pendaftaran.findFirst({
        where: { PendaftaranId: body.pendaftaranId }, select: {
            Mahasiswa: {
                select: {
                    User: {
                        select: {
                            NomorWa: true,
                            Nama: true
                        }
                    }
                }
            },
            SkRektorMahasiswa: {
                select: {
                    SkRektor: {
                        select: {
                            SkRektorId: true
                        }
                    }
                }
            }
        }
    })

    if (!asesorMahasiswa) return c.json(null);

    await prisma.skRektor.update({
        where: { SkRektorId: asesorMahasiswa.SkRektorMahasiswa[0].SkRektor.SkRektorId },
        data: {
            Catatan: body.catatan
        }
    })
        // Kirim Wa Ke Mahasiswa
        // const cookieHeader = cookies().toString();
        // const target = asesorMahasiswa.Mahasiswa.User.NomorWa ?? asesorMahasiswa.Mahasiswa.User.NomorWa ?? "";
        // if (!target) return;

        // const params = new URLSearchParams({
        //     target: String(target),
        //     message: `Halo, ${asesorMahasiswa.Mahasiswa.User.Nama}. Selamat, SK Penetapan Hasil Asessmen anda sudah diterbitkan melalui Sistem Informasi RPL Terpadu. Terima Kasih.`,
        //     jenis: "sendWaText",
        // });

        // await fetch(`${BASE_URL}/api/protected/whatsapp?${params.toString()}`, {
        //     method: "POST",
        //     headers: {
        //         cookie: cookieHeader,
        //         "Content-Type": "application/json",
        //     },
        // });

    return c.json({
        status: 'success',
        message: 'approval success',
        data: []
    })
})

export const GET = handle(app)
export const POST = handle(app)