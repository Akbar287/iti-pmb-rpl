import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { withApiAuth } from '@/middlewares/api-auth'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma'
import { UserResponseByIdType, UserResponsesType } from '@/types/ManajemenUser'
import { UserTable } from '@/types/types'
import bcrypt from 'bcrypt'
import { UserCreateFormValidation } from '@/validation/ProfilValidation'

const app = new Hono().basePath('/api/protected/manajemen-data/pengguna')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const page = Number(c.req.query('page') ?? '1')
    const limit = Number(c.req.query('limit') ?? '10')
    const search = c.req.query('search') ?? ''

    const UserId = c.req.query('UserId')

    if (UserId !== undefined && UserId !== null) {
        const d = await prisma.user.findFirst({
            where: {
                UserId: UserId,
            },
            select: {
                UserId: true,
                Nama: true,
                Email: true,
                EmailVerifiedAt: true,
                TempatLahir: true,
                TanggalLahir: true,
                JenisKelamin: true,
                PendidikanTerakhir: true,
                Avatar: true,
                Agama: true,
                Telepon: true,
                NomorWa: true,
                NomorHp: true,
                RememberToken: true,
                Userlogin: {
                    select: {
                        Username: true,
                        Credential: true,
                    },
                },
                UserHasRoles: {
                    select: {
                        Role: {
                            select: {
                                RoleId: true,
                                Name: true,
                            },
                        },
                    },
                },
                Alamat: {
                    select: {
                        AlamatId: true,
                        Alamat: true,
                        KodePos: true,
                        Desa: {
                            select: {
                                Nama: true,
                                DesaId: true,
                                Kecamatan: {
                                    select: {
                                        Nama: true,
                                        KecamatanId: true,
                                        Kabupaten: {
                                            select: {
                                                KabupatenId: true,
                                                Nama: true,
                                                Provinsi: {
                                                    select: {
                                                        ProvinsiId: true,
                                                        Nama: true,
                                                        Country: {
                                                            select: {
                                                                CountryId: true,
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
                },
            },
        })

        const res: UserResponsesType =
            d === null
                ? null
                : {
                      UserId: d.UserId,
                      Username:
                          d.Userlogin?.find(
                              (c) => c.Credential === 'credential'
                          )?.Username ?? '',
                      Nama: d.Nama ?? '',
                      Email: d.Email ?? '',
                      EmailVerifiedAt: d.EmailVerifiedAt ?? null,
                      TempatLahir: d.TempatLahir ?? null,
                      TanggalLahir: d.TanggalLahir ?? null,
                      JenisKelamin: d.JenisKelamin ?? '',
                      PendidikanTerakhir: d.PendidikanTerakhir ?? '',
                      Avatar: d.Avatar ?? '',
                      Agama: d.Agama ?? '',
                      Telepon: d.Telepon ?? '',
                      NomorWa: d.NomorWa ?? '',
                      NomorHp: d.NomorHp ?? '',
                      Alamat: d.Alamat
                          ? {
                                AlamatId: d.Alamat.AlamatId,
                                Alamat: d.Alamat.Alamat,
                                KodePos: d.Alamat.KodePos ?? '',
                                DesaId: d.Alamat.Desa?.DesaId ?? '',
                                NamaDesa: d.Alamat.Desa?.Nama ?? '',
                                KecamatanId:
                                    d.Alamat.Desa?.Kecamatan?.KecamatanId ?? '',
                                NamaKecamatan:
                                    d.Alamat.Desa?.Kecamatan?.Nama ?? '',
                                KabupatenId:
                                    d.Alamat.Desa?.Kecamatan?.Kabupaten
                                        ?.KabupatenId ?? '',
                                NamaKabupaten:
                                    d.Alamat.Desa?.Kecamatan?.Kabupaten?.Nama ??
                                    '',
                                ProvinsiId:
                                    d.Alamat.Desa?.Kecamatan?.Kabupaten
                                        ?.Provinsi?.ProvinsiId ?? '',
                                NamaProvinsi:
                                    d.Alamat.Desa?.Kecamatan?.Kabupaten
                                        ?.Provinsi?.Nama ?? '',
                                CountryId:
                                    d.Alamat.Desa?.Kecamatan?.Kabupaten
                                        ?.Provinsi?.Country?.CountryId ?? '',
                                NamaCountry:
                                    d.Alamat.Desa?.Kecamatan?.Kabupaten
                                        ?.Provinsi?.Country?.Nama ?? '',
                            }
                          : null,
                      Role: d.UserHasRoles?.map((r) => ({
                          RoleId: r.Role?.RoleId ?? '',
                          NamaRole: r.Role?.Name ?? '',
                      })),
                  }

        return c.json(
            res ? res : { status: 'error', message: 'no query id', data: [] },
            200
        )
    } else {
        const where: Prisma.UserWhereInput = search
            ? {
                  OR: [
                      { Nama: { contains: search, mode: 'insensitive' } },
                      { Email: { contains: search, mode: 'insensitive' } },
                  ],
              }
            : {}

        const [data, total] = await Promise.all([
            prisma.user.findMany({
                select: {
                    UserId: true,
                    Nama: true,
                    Email: true,
                    Avatar: true,
                    NomorWa: true,
                    NomorHp: true,
                    Userlogin: {
                        select: {
                            Username: true,
                            Credential: true,
                        },
                    },
                    UserHasRoles: {
                        select: {
                            Role: {
                                select: {
                                    RoleId: true,
                                    Name: true,
                                },
                            },
                        },
                    },
                },
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { CreatedAt: 'desc' },
            }),

            prisma.user.count({ where }),
        ])

        const res: UserResponseByIdType[] = data.map((d) => ({
            UserId: d.UserId ?? '',
            Username:
                d?.Userlogin.find((c) => c.Credential === 'credential')
                    ?.Username ?? '',
            Nama: d?.Nama ?? '',
            Email: d?.Email ?? '',
            Avatar: d?.Avatar ?? '',
            NomorWa: d?.NomorWa ?? '',
            NomorHp: d?.NomorHp ?? '',
            Role:
                (d?.UserHasRoles ?? []).length === 0
                    ? []
                    : (d?.UserHasRoles ?? []).map((r) => ({
                          RoleId: r.Role.Name ?? '',
                          NamaRole: r.Role.Name ?? '',
                      })),
        }))

        return c.json<{
            data: UserResponseByIdType[]
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
            data: res,
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
    const jenis = c.req.query('jenis')

    if (jenis === 'set-user') {
        const body: UserCreateFormValidation = await c.req.json()
        const alamat = await prisma.alamat.create({
            data: {
                DesaId: body.DesaId,
                Alamat: body.Alamat,
                KodePos: body.KodePos,
            },
            select: {
                Alamat: true,
                AlamatId: true,
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
                                        KabupatenId: true,
                                        Nama: true,
                                        Provinsi: {
                                            select: {
                                                ProvinsiId: true,
                                                Nama: true, 
                                                Country: {
                                                    select: {
                                                        CountryId: true,
                                                        Nama: true
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        const user = await prisma.user.create({
            data: {
                Nama: body.Nama,
                Email: body.Email,
                TempatLahir: body.TempatLahir,
                TanggalLahir: body.TanggalLahir,
                JenisKelamin: body.JenisKelamin,
                PendidikanTerakhir: body.PendidikanTerakhir,
                Avatar: body.Avatar,
                Agama: body.Agama,
                Telepon: body.Telepon,
                NomorWa: body.NomorWa,
                NomorHp: body.NomorHp,
                AlamatId: alamat.AlamatId,
                CreatedAt: new Date(),
                UpdatedAt: new Date(),
            },
        })

        const userlogin = await prisma.userlogin.create({
            data: {
                Username: body.Username,
                UserId: user.UserId,
                Credential: 'credential',
                Password: await bcrypt.hash(
                    body.Username,
                    await bcrypt.genSalt(12)
                ),
            },
        })

        const res: UserResponsesType = {
            UserId: user.UserId,
            Username: userlogin.Username,
            Nama: user.Nama ?? '',
            Email: user.Email ?? '',
            EmailVerifiedAt: user.EmailVerifiedAt ?? null,
            TempatLahir: user.TempatLahir ?? null,
            TanggalLahir: user.TanggalLahir ?? null,
            JenisKelamin: user.JenisKelamin ?? '',
            PendidikanTerakhir: user.PendidikanTerakhir ?? '',
            Avatar: user.Avatar ?? '',
            Agama: user.Agama ?? '',
            Telepon: user.Telepon ?? '',
            NomorWa: user.NomorWa ?? '',
            NomorHp: user.NomorHp ?? '',
            Alamat: alamat.Alamat
                ? {
                      AlamatId: alamat.AlamatId,
                      Alamat: alamat.Alamat,
                      KodePos: alamat.KodePos ?? '',
                      DesaId: alamat.Desa?.DesaId ?? '',
                      NamaDesa: alamat.Desa?.Nama ?? '',
                      KecamatanId: alamat.Desa?.Kecamatan?.KecamatanId ?? '',
                      NamaKecamatan: alamat.Desa?.Kecamatan?.Nama ?? '',
                      KabupatenId:
                          alamat.Desa?.Kecamatan?.Kabupaten?.KabupatenId ??
                          '',
                      NamaKabupaten:
                          alamat.Desa?.Kecamatan?.Kabupaten?.Nama ?? '',
                      ProvinsiId:
                          alamat.Desa?.Kecamatan?.Kabupaten?.Provinsi
                              ?.ProvinsiId ?? '',
                      NamaProvinsi:
                          alamat.Desa?.Kecamatan?.Kabupaten?.Provinsi?.Nama ??
                          '',
                      CountryId:
                          alamat.Desa?.Kecamatan?.Kabupaten?.Provinsi?.Country
                              ?.CountryId ?? '',
                      NamaCountry:
                          alamat.Desa?.Kecamatan?.Kabupaten?.Provinsi?.Country
                              ?.Nama ?? '',
                  }
                : null,
            Role: []
        }

        return c.json(res, 200)
    }
    if (jenis === 'assign-role') {
        const data: UserTable = await c.req.json()

        const user = await prisma.user.findFirst({
            where: {
                UserId: data.UserId,
            },
            select: {
                UserId: true,
                UserHasRoles: {
                    select: {
                        Role: {
                            select: {
                                RoleId: true,
                                Name: true,
                            },
                        },
                    },
                },
            },
        })

        const dbRoles =
            user?.UserHasRoles.map((u) => ({
                RoleId: u.Role.RoleId,
                Name: u.Role.Name,
            })) ?? []

        const requestedRoles = data.Role
            ? data.Role.split(',').map((r) => r.trim())
            : []

        for (const roleName of requestedRoles) {
            const exists = dbRoles.some((db) => db.Name === roleName)
            if (!exists) {
                const roleInDb = await prisma.role.findFirst({
                    where: { Name: roleName },
                    select: { RoleId: true },
                })

                if (roleInDb) {
                    await prisma.userHasRoles.create({
                        data: {
                            RoleId: roleInDb.RoleId,
                            UserId: data.UserId,
                        },
                    })
                }
            }
        }
        for (const dbRole of dbRoles) {
            if (!requestedRoles.includes(dbRole.Name)) {
                await prisma.userHasRoles.deleteMany({
                    where: {
                        RoleId: dbRole.RoleId,
                        UserId: data.UserId,
                    },
                })
            }
        }

        return c.json(data, 200)
    }
    if (jenis === 'set-user') {
    }
})

app.put('/', async (c) => {
    const id = c.req.query('UserId')
    const jenis = c.req.query('jenis')

    if (id !== undefined && id !== null) {
        if (jenis === 'ubah-password') {
            const user = await prisma.user.findFirst({
                where: { UserId: id },
                select: {
                    UserId: true,
                    Userlogin: {
                        select: {
                            UserloginId: true,
                            Credential: true,
                            Password: true,
                            Username: true,
                        },
                    },
                },
            })
            await prisma.userlogin.update({
                data: {
                    Password: await bcrypt.hash(
                        user?.Userlogin.find(
                            (c) => c.Credential === 'credential'
                        )?.Username ?? '',
                        await bcrypt.genSalt(10)
                    ),
                },
                where: {
                    UserloginId: user?.Userlogin.find(
                        (c) => c.Credential === 'credential'
                    )?.UserloginId as string,
                },
            })

            return c.json([], 200)
        }
        if (jenis === 'update-user') {
            const temp = await prisma.user.findFirst({
                select: {
                    UserId: true,
                    Userlogin: {
                        select: {
                            UserloginId: true,
                            Credential: true,
                        },
                    },
                    AlamatId: true,
                },
                where: {
                    UserId: id,
                },
            })
            const body: UserCreateFormValidation = await c.req.json()

            const user = await prisma.user.update({
                data: {
                    Nama: body.Nama,
                    Email: body.Email,
                    TempatLahir: body.TempatLahir,
                    TanggalLahir: body.TanggalLahir,
                    JenisKelamin: body.JenisKelamin,
                    PendidikanTerakhir: body.PendidikanTerakhir,
                    Avatar: body.Avatar,
                    Agama: body.Agama,
                    Telepon: body.Telepon,
                    NomorWa: body.NomorWa,
                    NomorHp: body.NomorHp,
                },
                where: {
                    UserId: id,
                },
                select: {
                    UserId: true,
                    Nama:true,
                    Email:true,
                    TempatLahir:true,
                    TanggalLahir:true,
                    EmailVerifiedAt: true,
                    JenisKelamin:true,
                    PendidikanTerakhir:true,
                    Avatar:true,
                    Agama:true,
                    Telepon:true,
                    NomorWa:true,
                    NomorHp:true,
                    UserHasRoles: {
                        select: {
                            Role: {
                                select: {
                                    RoleId: true,
                                    Name: true
                                }
                            }
                        }
                    }
                }
            })

            const userlogin = await prisma.userlogin.update({
                data: {
                    Username: body.Username,
                },
                where: {
                    UserloginId: temp?.Userlogin.find(
                        (c) => c.Credential === 'credential'
                    )?.UserloginId as string,
                },
            })

            const alamat = await prisma.alamat.update({
                data: {
                    DesaId: body.DesaId,
                    Alamat: body.Alamat,
                    KodePos: body.KodePos,
                },
                where: {
                    AlamatId: temp?.AlamatId,
                },
                select: {
                    Alamat: true,
                    AlamatId: true,
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
                                            KabupatenId: true,
                                            Nama: true,
                                            Provinsi: {
                                                select: {
                                                    ProvinsiId: true,
                                                    Nama: true, 
                                                    Country: {
                                                        select: {
                                                            CountryId: true,
                                                            Nama: true
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })

            const res: UserResponsesType = {
                UserId: user.UserId,
                Username: userlogin.Username,
                Nama: user.Nama ?? '',
                Email: user.Email ?? '',
                EmailVerifiedAt: user.EmailVerifiedAt ?? null,
                TempatLahir: user.TempatLahir ?? null,
                TanggalLahir: user.TanggalLahir ?? null,
                JenisKelamin: user.JenisKelamin ?? '',
                PendidikanTerakhir: user.PendidikanTerakhir ?? '',
                Avatar: user.Avatar ?? '',
                Agama: user.Agama ?? '',
                Telepon: user.Telepon ?? '',
                NomorWa: user.NomorWa ?? '',
                NomorHp: user.NomorHp ?? '',
                Alamat: alamat.Alamat
                    ? {
                          AlamatId: alamat.AlamatId,
                          Alamat: alamat.Alamat,
                          KodePos: alamat.KodePos ?? '',
                          DesaId: alamat.Desa?.DesaId ?? '',
                          NamaDesa: alamat.Desa?.Nama ?? '',
                          KecamatanId: alamat.Desa?.Kecamatan?.KecamatanId ?? '',
                          NamaKecamatan: alamat.Desa?.Kecamatan?.Nama ?? '',
                          KabupatenId:
                              alamat.Desa?.Kecamatan?.Kabupaten?.KabupatenId ??
                              '',
                          NamaKabupaten:
                              alamat.Desa?.Kecamatan?.Kabupaten?.Nama ?? '',
                          ProvinsiId:
                              alamat.Desa?.Kecamatan?.Kabupaten?.Provinsi
                                  ?.ProvinsiId ?? '',
                          NamaProvinsi:
                              alamat.Desa?.Kecamatan?.Kabupaten?.Provinsi?.Nama ??
                              '',
                          CountryId:
                              alamat.Desa?.Kecamatan?.Kabupaten?.Provinsi?.Country
                                  ?.CountryId ?? '',
                          NamaCountry:
                              alamat.Desa?.Kecamatan?.Kabupaten?.Provinsi?.Country
                                  ?.Nama ?? '',
                      }
                    : null,
                Role: user.UserHasRoles.map(r => ({
                    RoleId: r.Role.RoleId,
                    NamaRole: r.Role.Name
                }))
            }
            return c.json(res, 200)
        }
        return c.json({
            status: 'error', 
            message: 'no valid input',
            data: []
        }, 400)
    } else {
        return c.json(
            {
                status: 'error',
                message: 'No Id User include',
                data: [],
            },
            400
        )
    }
    return c.json([], 200)
})
export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
