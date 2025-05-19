import { Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import {
    InstitusiRequestType,
    InstitusiResponseType,
} from '@/types/ManajemenInstitusiType'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/manajemen-institusi/sosial-media')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const id = c.req.query('id')
    const page = Number(c.req.query('page') ?? '1')
    const limit = Number(c.req.query('limit') ?? '10')
    const search = c.req.query('search') ?? ''

    if (id) {
        const data = await prisma.university.findFirst({
            where: { UniversityId: id },
            select: {
                UniversityId: true,
                Nama: true,
                Akreditasi: true,
                CreatedAt: true,
                UpdatedAt: true,
                DeletedAt: true,
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

        return c.json({
            UniversityId: data?.UniversityId,
            Nama: data?.Nama,
            Akreditasi: data?.Akreditasi,
            CreatedAt: data?.CreatedAt,
            UpdatedAt: data?.UpdatedAt,
            DeletedAt: data?.DeletedAt,
            AlamatId: data?.Alamat.AlamatId,
            Alamat: data?.Alamat.Alamat,
            KodePos: data?.Alamat.KodePos,
            DesaId: data?.Alamat.Desa.DesaId,
            NamaDesa: data?.Alamat.Desa.Nama,
            KecamatanId: data?.Alamat.Desa.Kecamatan.KecamatanId,
            NamaKecamatan: data?.Alamat.Desa.Kecamatan.Nama,
            KabupatenId: data?.Alamat.Desa.Kecamatan.Kabupaten.KabupatenId,
            NamaKabupaten: data?.Alamat.Desa.Kecamatan.Kabupaten.Nama,
            ProvinsiId:
                data?.Alamat.Desa.Kecamatan.Kabupaten.Provinsi.ProvinsiId,
            NamaProvinsi: data?.Alamat.Desa.Kecamatan.Kabupaten.Provinsi.Nama,
            CountryId:
                data?.Alamat.Desa.Kecamatan.Kabupaten.Provinsi.Country
                    .CountryId,
            NamaCountry:
                data?.Alamat.Desa.Kecamatan.Kabupaten.Provinsi.Country.Nama,
        })
    } else if (page && limit) {
        let where: Prisma.UniversityWhereInput = search
            ? {
                  OR: [{ Nama: { contains: search, mode: 'insensitive' } }],
              }
            : {}

        const [data, total] = await Promise.all([
            prisma.university.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { Nama: 'asc' },
                select: {
                    UniversityId: true,
                    Nama: true,
                    Akreditasi: true,
                    CreatedAt: true,
                    UpdatedAt: true,
                    DeletedAt: true,
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
                                                    KabupatenId: true,
                                                    Nama: true,
                                                    Provinsi: {
                                                        select: {
                                                            ProvinsiId: true,
                                                            Nama: true,
                                                            Country: {
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
                    },
                },
            }),

            prisma.university.count({ where }),
        ])

        return c.json<{
            data: InstitusiResponseType[]
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
            data: data.map((item) => ({
                UniversityId: item.UniversityId,
                Nama: item.Nama,
                Akreditasi: item.Akreditasi,
                CreatedAt: item.CreatedAt,
                UpdatedAt: item.UpdatedAt,
                DeletedAt: item.DeletedAt,
                AlamatId: item.Alamat.AlamatId,
                Alamat: item.Alamat.Alamat,
                KodePos: item.Alamat.KodePos,
                DesaId: item.Alamat.Desa.DesaId,
                NamaDesa: item.Alamat.Desa.Nama,
                KecamatanId: item.Alamat.Desa.Kecamatan.KecamatanId,
                NamaKecamatan: item.Alamat.Desa.Kecamatan.Nama,
                KabupatenId: item.Alamat.Desa.Kecamatan.Kabupaten.KabupatenId,
                NamaKabupaten: item.Alamat.Desa.Kecamatan.Kabupaten.Nama,
                ProvinsiId:
                    item.Alamat.Desa.Kecamatan.Kabupaten.Provinsi.ProvinsiId,
                NamaProvinsi:
                    item.Alamat.Desa.Kecamatan.Kabupaten.Provinsi.Nama,
                CountryId:
                    item.Alamat.Desa.Kecamatan.Kabupaten.Provinsi.Country
                        .CountryId,
                NamaCountry:
                    item.Alamat.Desa.Kecamatan.Kabupaten.Provinsi.Country.Nama,
            })) as InstitusiResponseType[],
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
        const data = await prisma.university.findMany({
            select: {
                UniversityId: true,
                Nama: true,
                Akreditasi: true,
                CreatedAt: true,
                UpdatedAt: true,
                DeletedAt: true,
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

        return c.json(data.map((item) => ({
            UniversityId: item.UniversityId,
            Nama: item.Nama,
            Akreditasi: item.Akreditasi,
            CreatedAt: item.CreatedAt,
            UpdatedAt: item.UpdatedAt,
            DeletedAt: item.DeletedAt,
            AlamatId: item.Alamat.AlamatId,
            Alamat: item.Alamat.Alamat,
            KodePos: item.Alamat.KodePos,
            DesaId: item.Alamat.Desa.DesaId,
            NamaDesa: item.Alamat.Desa.Nama,
            KecamatanId: item.Alamat.Desa.Kecamatan.KecamatanId,
            NamaKecamatan: item.Alamat.Desa.Kecamatan.Nama,
            KabupatenId: item.Alamat.Desa.Kecamatan.Kabupaten.KabupatenId,
            NamaKabupaten: item.Alamat.Desa.Kecamatan.Kabupaten.Nama,
            ProvinsiId:
                item.Alamat.Desa.Kecamatan.Kabupaten.Provinsi.ProvinsiId,
            NamaProvinsi: item.Alamat.Desa.Kecamatan.Kabupaten.Provinsi.Nama,
            CountryId:
                item.Alamat.Desa.Kecamatan.Kabupaten.Provinsi.Country
                    .CountryId,
            NamaCountry:
                item.Alamat.Desa.Kecamatan.Kabupaten.Provinsi.Country.Nama,
        })))
    }
})

app.post('/', async (c) => {
    const body: InstitusiRequestType = await c.req.json()

    const alamat = await prisma.alamat.create({
        data: {
            DesaId: body.Alamat.DesaId,
            Alamat: body.Alamat.Alamat,
            KodePos: body.Alamat.KodePos,
        },
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
    })

    const data = await prisma.university.create({
        data: {
            AlamatId: alamat.AlamatId,
            Nama: body.University.Nama,
            Akreditasi: body.University.Akreditasi,
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
            DeletedAt: null,
        },
    })

    return c.json({
        UniversityId: data.UniversityId,
        Nama: data.Nama,
        Akreditasi: data.Akreditasi,
        CreatedAt: data.CreatedAt,
        UpdatedAt: data.UpdatedAt,
        DeletedAt: data.DeletedAt,
        AlamatId: alamat.AlamatId,
        Alamat: alamat.Alamat,
        KodePos: alamat.KodePos,
        DesaId: alamat.Desa.DesaId,
        NamaDesa: alamat.Desa.Nama,
        KecamatanId: alamat.Desa.Kecamatan.KecamatanId,
        NamaKecamatan: alamat.Desa.Kecamatan.Nama,
        KabupatenId: alamat.Desa.Kecamatan.Kabupaten.KabupatenId,
        NamaKabupaten: alamat.Desa.Kecamatan.Kabupaten.Nama,
        ProvinsiId: alamat.Desa.Kecamatan.Kabupaten.Provinsi.ProvinsiId,
        NamaProvinsi: alamat.Desa.Kecamatan.Kabupaten.Provinsi.Nama,
        CountryId: alamat.Desa.Kecamatan.Kabupaten.Provinsi.Country.CountryId,
        NamaCountry: alamat.Desa.Kecamatan.Kabupaten.Provinsi.Country.Nama,
    })
})

app.put('/', async (c) => {
    const body: InstitusiRequestType = await c.req.json()

    const alamat = await prisma.alamat.update({
        data: {
            DesaId: body.Alamat.DesaId,
            Alamat: body.Alamat.Alamat,
            KodePos: body.Alamat.KodePos,
        },
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
        where: {
            AlamatId: body.Alamat.AlamatId,
        },
    })

    const data = await prisma.university.update({
        data: {
            Nama: body.University.Nama,
            Akreditasi: body.University.Akreditasi,
            UpdatedAt: new Date(),
        },
        where: {
            UniversityId: body.University.UniversityId,
        },
    })

    return c.json({
        UniversityId: data.UniversityId,
        Nama: data.Nama,
        Akreditasi: data.Akreditasi,
        CreatedAt: data.CreatedAt,
        UpdatedAt: data.UpdatedAt,
        DeletedAt: data.DeletedAt,
        AlamatId: alamat.AlamatId,
        Alamat: alamat.Alamat,
        KodePos: alamat.KodePos,
        DesaId: alamat.Desa.DesaId,
        NamaDesa: alamat.Desa.Nama,
        KecamatanId: alamat.Desa.Kecamatan.KecamatanId,
        NamaKecamatan: alamat.Desa.Kecamatan.Nama,
        KabupatenId: alamat.Desa.Kecamatan.Kabupaten.KabupatenId,
        NamaKabupaten: alamat.Desa.Kecamatan.Kabupaten.Nama,
        ProvinsiId: alamat.Desa.Kecamatan.Kabupaten.Provinsi.ProvinsiId,
        NamaProvinsi: alamat.Desa.Kecamatan.Kabupaten.Provinsi.Nama,
        CountryId: alamat.Desa.Kecamatan.Kabupaten.Provinsi.Country.CountryId,
        NamaCountry: alamat.Desa.Kecamatan.Kabupaten.Provinsi.Country.Nama,
    })
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    await prisma.university.delete({
        where: {
            UniversityId: id,
        },
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
