import { prisma } from '@/lib/prisma'
import bcrypt from "bcrypt"
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import crypto from 'crypto'
import { AsesorPage, AsesorRequestResponseDTO } from '@/types/AsesorTypes'
import { JenisKelamin, Jenjang, Prisma } from '@/generated/prisma'

const app = new Hono().basePath('/api/protected/manajemen-data/asesor')

app.get('/', async (c) => {
    const asesorId = c.req.query('id')
    const page = Number(c.req.query('page') ?? '1')
    const limit = Number(c.req.query('limit') ?? '10')
    const search = c.req.query('search') ?? ''

    if (asesorId) {
        const data = await prisma.asesor.findFirst({
            select: {
                AsesorProgramStudi: {
                    select: {
                        ProgramStudi: {
                            select: {
                                ProgramStudiId: true,
                                UniversityId: true, 
                                Nama: true
                            }
                        }
                    }
                },
                AsesorAkademik: {
                    select: {
                        AsesorAkademikId: true,
                        Pangkat: true,
                        JabatanFungsionalAkademik: true,
                        NipNidn: true,
                        NamaPerguruanTinggi: true,
                        AlamatPerguruanTinggi: true,
                        PendidikanTerakhirBidangKeilmuan: true,
                        AsesorAkademikKeanggotaanAsosiasi: {
                            select: {
                                AsesorAkademikKeanggotaanAsosiasiId: true,
                                AsesorAkademikId: true,
                                NamaAsosiasi: true,
                                NomorKeanggotaan: true,
                            }
                        }
                    }
                },
                AsesorPraktisi: {
                    select: {
                        AsesorPraktisiId: true,
                        AsesorId: true,
                        NamaAsosiasi: true,
                        NomorKeanggotaan: true,
                        Jabatan: true,
                        AlamatKantor: true,
                        NamaInstansi: true,
                        JabatanInstansi: true,
                        BidangKeahlian: true,
                    }
                },
                TipeAsesor: {
                    select: {
                        TipeAsesorId: true,
                        Nama: true,
                        Icon: true,
                        Deskripsi: true
                    }
                },
                User: {
                    select: {
                        Userlogin: {
                            select: {
                                Username: true,
                                Credential: true
                            }
                        },
                        UserId: true,
                        Nama: true,
                        Email: true,
                        TempatLahir: true,
                        TanggalLahir: true,
                        JenisKelamin: true,
                        PendidikanTerakhir: true,
                        Avatar: true,
                        Agama: true,
                        Telepon: true,
                        NomorWa: true,
                        NomorHp: true,
                        Alamat: {
                            select: {
                                        AlamatId: true,
                                        Alamat: true,
                                        KodePos: true,
                                        Desa: {
                                            select: {
                                                DesaId: true,
                                                Nama: true,
                                                Kecamatan: {
                                                    select: {
                                                        KecamatanId: true,
                                                        Nama: true,
                                                        Kabupaten: {
                                                            select: {
                                                                KabupatenId:
                                                                    true,
                                                                Nama: true,
                                                                Provinsi: {
                                                                    select: {
                                                                        ProvinsiId:
                                                                            true,
                                                                        Nama: true,
                                                                        Country:
                                                                            {
                                                                                select: {
                                                                                    CountryId:
                                                                                        true,
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
                                        },
                                    },
                        }
                    }
                }
            },
            where: {
                AsesorId: asesorId,
            },
        })

        const response: AsesorRequestResponseDTO = {
            ProgramStudi: data?.AsesorProgramStudi ? data.AsesorProgramStudi.map(prodi => ({
                ProgramStudiId: prodi.ProgramStudi.ProgramStudiId,
                UniversityId: prodi.ProgramStudi.UniversityId,
                Nama: prodi.ProgramStudi.Nama
            })) : [],
            Username: data?.User.Userlogin.find(u => u.Credential === 'credential')?.Username ?? '',
            AsesorId: asesorId,
            Alamat: {
                AlamatId: data?.User.Alamat.AlamatId ?? '',
                Alamat: data?.User.Alamat.Alamat ?? '',
                KodePos: data?.User.Alamat.KodePos ?? '',
                DesaId: data?.User.Alamat.Desa.DesaId ?? '',
                NamaDesa: data?.User.Alamat.Desa.Nama ?? '',
                KecamatanId: data?.User.Alamat.Desa.Kecamatan.KecamatanId ??'',
                NamaKecamatan: data?.User.Alamat.Desa.Kecamatan.Nama ?? '',
                KabupatenId: data?.User.Alamat.Desa.Kecamatan.Kabupaten.KabupatenId ?? '',
                NamaKabupaten: data?.User.Alamat.Desa.Kecamatan.Kabupaten.Nama ?? '',
                ProvinsiId: data?.User.Alamat.Desa.Kecamatan.Kabupaten.Provinsi.ProvinsiId ?? '',
                NamaProvinsi: data?.User.Alamat.Desa.Kecamatan.Kabupaten.Provinsi.Nama ?? '',
                CountryId: data?.User.Alamat.Desa.Kecamatan.Kabupaten.Provinsi.Country.CountryId ?? '',
                NamaCountry: data?.User.Alamat.Desa.Kecamatan.Kabupaten.Provinsi.Country.Nama ?? '',
            },
            User: {
                UserId: data?.User.UserId ?? '',
                Nama: data?.User.Nama ?? '',
                Email: data?.User.Email ?? '',
                TempatLahir: data?.User.TempatLahir ?? '',
                TanggalLahir: data?.User.TanggalLahir ?? null,
                JenisKelamin: data?.User.JenisKelamin || JenisKelamin.PRIA,
                PendidikanTerakhir: data?.User.PendidikanTerakhir || Jenjang.TIDAK_TAMAT_SD,
                Avatar: data?.User.Avatar ?? 'default.png',
                Agama: data?.User.Agama ?? '',
                Telepon: data?.User.Telepon ?? '',
                NomorWa: data?.User.NomorWa ?? '',
                NomorHp: data?.User.NomorHp ?? '',
            },
            TipeAsesor: {
                TipeAsesorId: data?.TipeAsesor.TipeAsesorId || '',
                Nama: data?.TipeAsesor.Nama || '',
                Icon: data?.TipeAsesor.Icon || '',
                Deskripsi: data?.TipeAsesor.Deskripsi || '',
            },
            AsesorAkademik: data?.AsesorAkademik && data.AsesorAkademik.length > 0 ? {
                AsesorAkademikId: data?.AsesorAkademik[0].AsesorAkademikId || '',
                Pangkat: data?.AsesorAkademik[0].Pangkat || '',
                JabatanFungsionalAkademik: data?.AsesorAkademik[0].JabatanFungsionalAkademik || '',
                NipNidn: data?.AsesorAkademik[0].NipNidn || '',
                NamaPerguruanTinggi: data?.AsesorAkademik[0].NamaPerguruanTinggi || '',
                AlamatPerguruanTinggi: data?.AsesorAkademik[0].AlamatPerguruanTinggi || null,
                PendidikanTerakhirBidangKeilmuan: data?.AsesorAkademik[0].PendidikanTerakhirBidangKeilmuan || null,
                AsesorAkademikKeanggotaanAsosiasi: data?.AsesorAkademik[0].AsesorAkademikKeanggotaanAsosiasi.map(aa => ({
                    AsesorAkademikKeanggotaanAsosiasiId: aa.AsesorAkademikKeanggotaanAsosiasiId,
                    AsesorAkademikId: aa.AsesorAkademikId,
                    NamaAsosiasi: aa.NamaAsosiasi,
                    NomorKeanggotaan: aa.NomorKeanggotaan,
                }))
            } : null,
            AsesorPraktisi: data?.AsesorPraktisi && data.AsesorPraktisi.length > 0 ? {
                AsesorPraktisiId: data?.AsesorPraktisi[0].AsesorPraktisiId || '',
                AsesorId: data?.AsesorPraktisi[0].AsesorId || '',
                NamaAsosiasi: data?.AsesorPraktisi[0].NamaAsosiasi || '',
                NomorKeanggotaan: data?.AsesorPraktisi[0].NomorKeanggotaan || '',
                Jabatan: data?.AsesorPraktisi[0].Jabatan || '',
                AlamatKantor: null,
                NamaInstansi: data?.AsesorPraktisi[0].NamaInstansi || '',
                JabatanInstansi: data?.AsesorPraktisi[0].JabatanInstansi || '',
                BidangKeahlian: data?.AsesorPraktisi[0].BidangKeahlian || '',
            } : null
        }
        return c.json<AsesorRequestResponseDTO>(response, 200)
    } else if (page && limit) {
        let where: Prisma.AsesorWhereInput = search
            ? {
                  OR: [
                      {
                          TipeAsesor: {
                              Nama: {
                                  contains: search,
                                  mode: 'insensitive',
                              },
                          },
                      },
                      {
                          User: {
                              is: {
                                  OR: [
                                      {
                                          Nama: {
                                              contains: search,
                                              mode: 'insensitive',
                                          },
                                      },
                                      {
                                          PendidikanTerakhir: { equals: search as Jenjang },
                                      },
                                  ],
                              },
                          },
                      },
                  ],
              }
            : {}

        const [data, total] = await Promise.all([
            prisma.asesor.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { User: {Nama: 'asc'} },
                select: {
                    AsesorId: true,
                    TipeAsesor: {select: {Nama: true}},
                    AsesorProgramStudi: {
                        select: {ProgramStudi: {select: {Nama: true}}}
                    },
                    User: {
                        select: {
                            UserId: true,
                            Nama: true,
                            PendidikanTerakhir: true
                        },
                    },
                },
            }),

            prisma.asesor.count({ where }),
        ])

        const responses: AsesorPage[] = data.map((d) => ({
            UserId: d.User.UserId,
            AsesorId: d.AsesorId,
            Nama: d.User.Nama,
            TipeAsesor: d.TipeAsesor.Nama,
            Prodi: d.AsesorProgramStudi.map(prodi => (prodi.ProgramStudi.Nama)).join(', '),
            PendidikanTerakhir: d.User.PendidikanTerakhir,
        }))

        return c.json<{
            data: AsesorPage[]
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
    } else {
        return c.json({
            message: 'no query included',
            data: [],
        })
    }
})

app.post('/', async (c) => {
    const body: AsesorRequestResponseDTO = await c.req.json()

    const provinsi = body.Alamat.NamaProvinsi.trim()
    const kabupaten = body.Alamat.NamaKabupaten.trim()
    const kecamatan = body.Alamat.NamaKecamatan.trim()
    const desa = body.Alamat.NamaDesa.trim()

    let checkAlamatRequestToDb = await prisma.desa.findFirst({
        where: {
            Nama: {
                equals: desa,
                mode: 'insensitive',
            },
            Kecamatan: {
                Nama: {
                    equals: kecamatan,
                    mode: 'insensitive',
                },
                Kabupaten: {
                    Nama: {
                        equals: kabupaten,
                        mode: 'insensitive',
                    },
                    Provinsi: {
                        Nama: {
                            equals: provinsi,
                            mode: 'insensitive',
                        },
                    },
                },
            },
        },
        select: {
            DesaId: true,
        },
    })

    if (checkAlamatRequestToDb) {
        const alamat = await prisma.alamat.create({
            data: {
                Alamat: body.Alamat.Alamat,
                DesaId: checkAlamatRequestToDb?.DesaId,
                KodePos: body.Alamat.KodePos,
            },
        })

        const user = await prisma.user.create({
            data: {
                AlamatId: alamat.AlamatId,
                Nama: body.User.Nama,
                Email: body.User.Email,
                EmailVerifiedAt: new Date(),
                TempatLahir: body.User.TempatLahir,
                TanggalLahir: body.User.TanggalLahir,
                JenisKelamin: body.User.JenisKelamin,
                PendidikanTerakhir: body.User.PendidikanTerakhir,
                Avatar: body.User.Avatar,
                Agama: body.User.Agama,
                Telepon: body.User.Telepon,
                NomorWa: body.User.NomorWa,
                NomorHp: body.User.NomorHp,
                RememberToken: crypto.randomBytes(32).toString('hex'),
                CreatedAt: new Date(),
                UpdatedAt: new Date(),
                DeletedAt: null,
            },
        })

        await prisma.userlogin.create({
            data: {
                UserId: user.UserId,
                Username: body.Username,
                Password: await bcrypt.hash(body.Username, await bcrypt.genSalt(10)),
                Credential: 'credential',
            },
        })

        const asesorRole = await prisma.role.findFirst({
            where: { Name: { equals: 'Asesor', mode: 'insensitive' } },
            select: { RoleId: true },
        })
        if (asesorRole) {
            await prisma.userHasRoles.create({
                data: {
                    RoleId: asesorRole?.RoleId,
                    UserId: user.UserId,
                },
            })
        }

        const tipeAsesor = await prisma.tipeAsesor.findFirst({select: {TipeAsesorId: true, Nama: true}, where: {TipeAsesorId: body.TipeAsesor.TipeAsesorId}})
        if (!tipeAsesor) {
            throw new Error('TipeAsesor not found')
        }
        const asesor = await prisma.asesor.create({
            data: {
                TipeAsesorId: tipeAsesor.TipeAsesorId,
                UserId: user.UserId
            }
        })

        const temp = body.ProgramStudi.map(prodi => ({
            AsesorId: asesor.AsesorId,
            ProgramStudiId: prodi.ProgramStudiId
        }))

        await prisma.asesorProgramStudi.createMany({
            data: temp,
            skipDuplicates: true
        })

        const response: AsesorPage = {
            UserId: user.UserId,
            AsesorId: asesor.AsesorId,
            Nama: user.Nama,
            TipeAsesor: tipeAsesor?.Nama ?? '',
            Prodi: body.ProgramStudi.map(prodi => (prodi.Nama)).join(', '),
            PendidikanTerakhir: user.PendidikanTerakhir,
        }

        // Kirim Ke Notifikasi Wa Mahasiswa ; 
        // Username dan Password adalah sama;
        // data Asesor

        return c.json<AsesorPage>(response)
    } else {
        return c.json(
            {
                status: 'error',
                message: 'Alamat Not Found',
                data: [],
            },
            400
        )
    }
})

app.put('/', async (c) => {
    const body: AsesorRequestResponseDTO = await c.req.json()

    const alamat = await prisma.alamat.update({
        data: {
            Alamat: body.Alamat.Alamat,
            DesaId: body.Alamat.DesaId,
            KodePos: body.Alamat.KodePos,
        },
        where: {
            AlamatId: body.Alamat.AlamatId,
        },
    })

    const user = await prisma.user.update({
        data: {
            AlamatId: alamat.AlamatId,
            Nama: body.User.Nama,
            Email: body.User.Email,
            TempatLahir: body.User.TempatLahir,
            TanggalLahir: body.User.TanggalLahir,
            JenisKelamin: body.User.JenisKelamin,
            PendidikanTerakhir: body.User.PendidikanTerakhir,
            Avatar: body.User.Avatar,
            Agama: body.User.Agama,
            Telepon: body.User.Telepon,
            NomorWa: body.User.NomorWa,
            NomorHp: body.User.NomorHp,
            UpdatedAt: new Date(),
            DeletedAt: null,
        },
        where: {
            UserId: body.User.UserId,
        },
    })

        const asesor = await prisma.asesor.create({
            data: {
                TipeAsesorId: body.TipeAsesor.TipeAsesorId,
                UserId: user.UserId
            }
        })

        await prisma.asesorProgramStudi.deleteMany({
            where: {
                AsesorId : asesor.AsesorId
            }
        })

        const temp = body.ProgramStudi.map(prodi => ({
            AsesorId: asesor.AsesorId,
            ProgramStudiId: prodi.ProgramStudiId
        }))

        await prisma.asesorProgramStudi.createMany({
            data: temp,
            skipDuplicates: true
        })

        const response: AsesorPage = {
            UserId: user.UserId,
            AsesorId: asesor.AsesorId,
            Nama: user.Nama,
            TipeAsesor: body.TipeAsesor.Nama,
            Prodi: body.ProgramStudi.map(prodi => (prodi.Nama)).join(', '),
            PendidikanTerakhir: user.PendidikanTerakhir,
        }

    return c.json(response, 200)
})

app.delete('/', async (c) => {
    const AsesorId = c.req.query('id')
    const idForAll = await prisma.asesor.findFirst({select: {
        AsesorId: true,
        User: {select: {UserId: true, UserHasRoles: {select: {RoleId: true}}, Userlogin: {select: {UserloginId: true}}, Alamat: {select: {AlamatId: true}}}},
        AsesorAkademik: {select: {AsesorAkademikId: true, AsesorAkademikKeanggotaanAsosiasi: {select: {AsesorAkademikKeanggotaanAsosiasiId: true}}}},
        AsesorPraktisi: {select: {AsesorPraktisiId: true}},
    }, where: {AsesorId: AsesorId}})

    const asesorRole = await prisma.role.findFirst({where: {
        Name: {
            equals: 'Asesor', mode: 'insensitive'
        }
    }})

    if (asesorRole && idForAll) {
        await prisma.asesorAkademikKeanggotaanAsosiasi.deleteMany({
            where: {
                AsesorAkademikKeanggotaanAsosiasiId: { in: idForAll.AsesorAkademik.flatMap(item => item.AsesorAkademikKeanggotaanAsosiasi.map(a => a.AsesorAkademikKeanggotaanAsosiasiId)) },
            },
        })

        await prisma.asesorAkademik.deleteMany({
            where: {
                AsesorAkademikId: { in: idForAll.AsesorAkademik.map(item => item.AsesorAkademikId) },
            },
        })

        await prisma.asesorPraktisi.deleteMany({
            where: {
                AsesorPraktisiId: { in: idForAll.AsesorPraktisi.map(item => item.AsesorPraktisiId) },
            },
        })

        await prisma.asesor.delete({
            where: {
                AsesorId: idForAll.AsesorId,
            },
        })

        await prisma.alamat.delete({
            where: {
                AlamatId: idForAll.User.Alamat.AlamatId
            }
        })

        await prisma.userHasRoles.delete({
            where: {
                RoleId_UserId: {
                    RoleId: asesorRole.RoleId,
                    UserId: idForAll.User.UserId,
                },
            },
        })

        if(idForAll.User.UserHasRoles.length === 1) {
            await prisma.user.delete({ 
                where: {
                    UserId: idForAll.User.UserId
                }
            })
        } 
    }

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)

function generateShortStrongPassword(data: {
    KodePendaftar: string
    NoUjian: string
    JalurPendaftaran: string
    Nim: string
}) {
    const { KodePendaftar, NoUjian, JalurPendaftaran, Nim } = data

    // Ambil 2 karakter dari beberapa field
    const part1 = KodePendaftar.slice(-2) // e.g. "01"
    const part2 = NoUjian.slice(-2) // e.g. "56"
    const part3 = JalurPendaftaran.charAt(0).toUpperCase() // e.g. "R"
    const part4 = Nim.slice(-2) // e.g. "34"

    const base = `${part1}${part2}${part3}${part4}`

    // Acak susunannya biar lebih aman
    const shuffled = base
        .split('')
        .sort(() => 0.5 - Math.random())
        .join('')

    return shuffled
}
