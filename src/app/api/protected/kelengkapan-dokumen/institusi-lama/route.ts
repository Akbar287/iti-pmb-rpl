import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { InstitusiLamaType } from '@/types/InstitusiLama'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/kelengkapan-dokumen/institusi-lama')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const id = c.req.query('id')
    const pendaftaranId = c.req.query('pendaftaranId')

    let data = null;
    if(pendaftaranId) {
        data = await prisma.institusiLama.findMany({
            select: {
                InstitusiLamaId: true,
                AlamatId: true,
                PendaftaranId: true,
                Jenjang: true,
                JenisInstitusi: true,
                NamaInstitusi: true,
                Jurusan: true,
                Nisn: true,
                Npsn: true,
                TahunLulus: true,
                NilaiLulusan: true,
                CreatedAt: true,
                UpdatedAt: true,
                Alamat: {
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
                }
            },
            where: {
                PendaftaranId: pendaftaranId
            }
        });

        return c.json(data.map(d => ({
            InstitusiLamaId:d.InstitusiLamaId,
            PendaftaranId:d.PendaftaranId, 
            AlamatId: d.Alamat?.AlamatId,
            CountryId:d.Alamat?.Desa.Kecamatan.Kabupaten.Provinsi.Country.CountryId, 
            ProvinsiId:d.Alamat?.Desa.Kecamatan.Kabupaten.Provinsi.ProvinsiId ,
            KabupatenId:d.Alamat?.Desa.Kecamatan.Kabupaten.KabupatenId ,
            KecamatanId:d.Alamat?.Desa.Kecamatan.KecamatanId ,
            DesaId:d.Alamat?.Desa.DesaId ,
            KodePos:d.Alamat?.KodePos ,
            Alamat:d.Alamat?.Alamat ,
            Jenjang:d.Jenjang ,
            JenisInstitusi:d.JenisInstitusi ,
            NamaInstitusi:d.NamaInstitusi ,
            Jurusan:d.Jurusan ,
            Nisn:d.Nisn ,
            Npsn:d.Npsn ,
            TahunLulus:d.TahunLulus ,
            NilaiLulusan:d.NilaiLulusan ,
            CreatedAt:d.CreatedAt,
            UpdatedAt:d.UpdatedAt
        })))
    } else {
        if (id) {
            data = await prisma.institusiLama.findFirst({
                select: {
                    InstitusiLamaId: true,
                    AlamatId: true,
                    PendaftaranId: true,
                    Jenjang: true,
                    JenisInstitusi: true,
                    NamaInstitusi: true,
                    Jurusan: true,
                    Nisn: true,
                    Npsn: true,
                    TahunLulus: true,
                    NilaiLulusan: true,
                    CreatedAt: true,
                    UpdatedAt: true,
                    Alamat: {
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
                    }
                },
                where: {InstitusiLamaId: id}
            })

            return c.json({
                InstitusiLamaId:data?.InstitusiLamaId,
                PendaftaranId:data?.PendaftaranId, 
                AlamatId: data?.Alamat?.AlamatId,
                CountryId:data?.Alamat?.Desa.Kecamatan.Kabupaten.Provinsi.Country.CountryId, 
                ProvinsiId:data?.Alamat?.Desa.Kecamatan.Kabupaten.Provinsi.ProvinsiId ,
                KabupatenId:data?.Alamat?.Desa.Kecamatan.Kabupaten.KabupatenId ,
                KecamatanId:data?.Alamat?.Desa.Kecamatan.KecamatanId ,
                DesaId:data?.Alamat?.Desa.DesaId ,
                KodePos:data?.Alamat?.KodePos ,
                Alamat:data?.Alamat?.Alamat ,
                Jenjang:data?.Jenjang ,
                JenisInstitusi:data?.JenisInstitusi ,
                NamaInstitusi:data?.NamaInstitusi ,
                Jurusan:data?.Jurusan ,
                Nisn:data?.Nisn ,
                Npsn:data?.Npsn ,
                TahunLulus:data?.TahunLulus ,
                NilaiLulusan:data?.NilaiLulusan ,
                CreatedAt:data?.CreatedAt,
                UpdatedAt:data?.UpdatedAt
            })
        } else {
            data = await prisma.institusiLama.findMany({
                select: {
                    InstitusiLamaId: true,
                    AlamatId: true,
                    PendaftaranId: true,
                    Jenjang: true,
                    JenisInstitusi: true,
                    NamaInstitusi: true,
                    Jurusan: true,
                    Nisn: true,
                    Npsn: true,
                    TahunLulus: true,
                    NilaiLulusan: true,
                    CreatedAt: true,
                    UpdatedAt: true,
                    Alamat: {
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
                    }
                },
            });

            return c.json(data.map(d => ({
                InstitusiLamaId:d.InstitusiLamaId,
                PendaftaranId:d.PendaftaranId, 
                AlamatId: d.Alamat?.AlamatId,
                CountryId:d.Alamat?.Desa.Kecamatan.Kabupaten.Provinsi.Country.CountryId, 
                ProvinsiId:d.Alamat?.Desa.Kecamatan.Kabupaten.Provinsi.ProvinsiId ,
                KabupatenId:d.Alamat?.Desa.Kecamatan.Kabupaten.KabupatenId ,
                KecamatanId:d.Alamat?.Desa.Kecamatan.KecamatanId ,
                DesaId:d.Alamat?.Desa.DesaId ,
                KodePos:d.Alamat?.KodePos ,
                Alamat:d.Alamat?.Alamat ,
                Jenjang:d.Jenjang ,
                JenisInstitusi:d.JenisInstitusi ,
                NamaInstitusi:d.NamaInstitusi ,
                Jurusan:d.Jurusan ,
                Nisn:d.Nisn ,
                Npsn:d.Npsn ,
                TahunLulus:d.TahunLulus ,
                NilaiLulusan:d.NilaiLulusan ,
                CreatedAt:d.CreatedAt,
                UpdatedAt:d.UpdatedAt
            })))
        }
    }
})

app.post('/', async (c) => {
    const body: InstitusiLamaType = await c.req.json()

    const alamat = await prisma.alamat.create({
        data: {
            Alamat: body.Alamat,
            DesaId: body.DesaId, 
            KodePos: body.KodePos
        }
    })
    
    const data = await prisma.institusiLama.create({
        data: {
            PendaftaranId: body.PendaftaranId,
            AlamatId: alamat.AlamatId,
            Jenjang: body.Jenjang,
            JenisInstitusi: body.JenisInstitusi,
            NamaInstitusi: body.NamaInstitusi, 
            Jurusan: body.Jurusan, 
            Nisn: body.Nisn, 
            Npsn: body.Npsn, 
            TahunLulus: body.TahunLulus,
            NilaiLulusan: body.NilaiLulusan,
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
        }
    })

    return c.json({
        InstitusiLamaId:data.InstitusiLamaId,
        AlamatId: alamat.AlamatId,
        PendaftaranId:data.PendaftaranId, 
        CountryId:body.CountryId, 
        ProvinsiId:body.ProvinsiId ,
        KabupatenId:body.KabupatenId ,
        KecamatanId:body.KecamatanId ,
        DesaId:body.DesaId ,
        KodePos:body.KodePos ,
        Alamat:body.Alamat ,
        Jenjang:body.Jenjang ,
        JenisInstitusi:body.JenisInstitusi ,
        NamaInstitusi:body.NamaInstitusi ,
        Jurusan:body.Jurusan ,
        Nisn:body.Nisn ,
        Npsn:body.Npsn ,
        TahunLulus:body.TahunLulus ,
        NilaiLulusan:body.NilaiLulusan ,
        CreatedAt:data.CreatedAt,
        UpdatedAt:data.UpdatedAt
    })
})

app.put('/', async (c) => {
    const body: InstitusiLamaType = await c.req.json()

    const alamat = await prisma.alamat.update({
        where: {
            AlamatId: body.AlamatId
        },
        data: {
            Alamat: body.Alamat,
            DesaId: body.DesaId, 
            KodePos: body.KodePos
        }
    })
    
    const data = await prisma.institusiLama.update({
        data: {
            PendaftaranId: body.PendaftaranId,
            AlamatId: alamat.AlamatId,
            Jenjang: body.Jenjang,
            JenisInstitusi: body.JenisInstitusi,
            NamaInstitusi: body.NamaInstitusi, 
            Jurusan: body.Jurusan, 
            Nisn: body.Nisn, 
            Npsn: body.Npsn, 
            TahunLulus: body.TahunLulus,
            NilaiLulusan: body.NilaiLulusan,
            UpdatedAt: new Date(),
        },
        where: {
            InstitusiLamaId: body.InstitusiLamaId
        }
    })

    return c.json({
        InstitusiLamaId:data.InstitusiLamaId,
        AlamatId: alamat.AlamatId,
        PendaftaranId:data.PendaftaranId, 
        CountryId:body.CountryId, 
        ProvinsiId:body.ProvinsiId ,
        KabupatenId:body.KabupatenId ,
        KecamatanId:body.KecamatanId ,
        DesaId:body.DesaId ,
        KodePos:body.KodePos ,
        Alamat:body.Alamat ,
        Jenjang:body.Jenjang ,
        JenisInstitusi:body.JenisInstitusi ,
        NamaInstitusi:body.NamaInstitusi ,
        Jurusan:body.Jurusan ,
        Nisn:body.Nisn ,
        Npsn:body.Npsn ,
        TahunLulus:body.TahunLulus ,
        NilaiLulusan:body.NilaiLulusan ,
        CreatedAt:data.CreatedAt,
        UpdatedAt:data.UpdatedAt
    })
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    let alamatId = await prisma.institusiLama.findFirst({select: {AlamatId: true}, where: {InstitusiLamaId: id}})
    await prisma.institusiLama.delete({
        where: {
            InstitusiLamaId: id
        }
    })

    await prisma.alamat.delete({
        where: {AlamatId: alamatId?.AlamatId ?? undefined}
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
