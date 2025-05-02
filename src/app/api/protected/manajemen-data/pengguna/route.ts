import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { withApiAuth } from '@/middlewares/api-auth'
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma';
import { UserResponseByIdType, UserResponsesType } from '@/types/ManajemenUser';

const app = new Hono().basePath('/api/protected/manajemen-data/pengguna')

app.use('*', withApiAuth); 

app.get('/', async (c) => {
    const page = Number(c.req.query('page') ?? '1')
    const limit = Number(c.req.query('limit') ?? '10')
    const search = c.req.query('search') ?? ''

    const UserId = c.req.query('UserId')

    
    if(UserId !== undefined && UserId !== null) {
        const d = await prisma.user.findFirst({
            where: {
                UserId: UserId
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
                        Credential: true
                    }
                },
                UserHasRoles: {
                    select: {
                        Role: {
                            select: {
                                RoleId: true,
                                Name: true
                            }
                        }
                    }
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
                }
            },
          })

          const res: UserResponsesType = d === null  ? null : {
            UserId: d.UserId,
            Username: d.Userlogin?.find(c => c.Credential === 'credential')?.Username ?? '',
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
                    KecamatanId: d.Alamat.Desa?.Kecamatan?.KecamatanId ?? '',
                    NamaKecamatan: d.Alamat.Desa?.Kecamatan?.Nama ?? '',
                    KabupatenId: d.Alamat.Desa?.Kecamatan?.Kabupaten?.KabupatenId ?? '',
                    NamaKabupaten: d.Alamat.Desa?.Kecamatan?.Kabupaten?.Nama ?? '',
                    ProvinsiId: d.Alamat.Desa?.Kecamatan?.Kabupaten?.Provinsi?.ProvinsiId ?? '',
                    NamaProvinsi: d.Alamat.Desa?.Kecamatan?.Kabupaten?.Provinsi?.Nama ?? '',
                    CountryId: d.Alamat.Desa?.Kecamatan?.Kabupaten?.Provinsi?.Country?.CountryId ?? '',
                    NamaCountry: d.Alamat.Desa?.Kecamatan?.Kabupaten?.Provinsi?.Country?.Nama ?? '',
                }
                : null,
            Role: d.UserHasRoles?.map(r => ({
                RoleId: r.Role?.RoleId ?? '',
                NamaRole: r.Role?.Name ?? ''
            }))
        }

        return c.json(res ? res : {status: 'error', message: 'no query id', data: []}, 200)
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
                Credential: true
              }
            },
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
          },
          where, 
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { CreatedAt: 'desc' },
        }),
      
        prisma.user.count({ where }),
      ])
      
    
        const res: UserResponseByIdType[] = data.map(d => ({
            UserId: d.UserId ?? '',
            Username: d?.Userlogin.find(c => c.Credential === 'credential')?.Username ?? '' ,
            Nama: d?.Nama ?? '' ,
            Email: d?.Email ?? '' ,
            Avatar: d?.Avatar ?? '' ,
            NomorWa: d?.NomorWa ?? '' ,
            NomorHp: d?.NomorHp ?? '' ,
            Role: (d?.UserHasRoles ?? []).length === 0 ? [] : (d?.UserHasRoles ?? []).map(r => ({
                RoleId: r.Role.Name ?? '',
                NamaRole: r.Role.Name ?? ''
            }))
          }))

        return c.json<{data: UserResponseByIdType[], page: number, limit: number, totalElement: number, totalPage: number, isFirst: boolean, isLast: boolean, hasNext: boolean, hasPrevious: boolean  }>({page: page, limit: limit, data: res, totalElement: total, totalPage: Math.ceil(total / limit), isFirst: page === 1, isLast: page === Math.ceil(total / limit) || Math.ceil(total / limit) === 0, hasNext: page < Math.ceil(total / limit), hasPrevious: page > 1 })
    }
})

app.post('/', async (c) => {
  const jenis = c.req.query('jenis')

  if (jenis === 'assign-role') {}
  if (jenis === 'set-user') {}
})

export const GET = handle(app)
  