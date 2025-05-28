import {
    JenisKelamin,
    JenisOrtu,
    Jenjang,
    Prisma,
    SistemKuliah,
    StatusPekerjaan,
    StatusPerkawinan,
} from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import {
    CalonMahasiswaRplPage,
    CalonMahasiswaRplRequestResponseDTO,
} from '@/types/MahasiswaTypes'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import crypto from 'crypto'

const app = new Hono().basePath('/api/protected/manajemen-data/mahasiswa')

app.get('/', async (c) => {
    const kodePendaftarId = c.req.query('id')
    const page = Number(c.req.query('page') ?? '1')
    const limit = Number(c.req.query('limit') ?? '10')
    const search = c.req.query('search') ?? ''

    if (kodePendaftarId) {
        const data = await prisma.pendaftaran.findFirst({
            select: {
                PendaftaranId: true,
                KodePendaftar: true,
                NoUjian: true,
                Periode: true,
                Gelombang: true,
                SistemKuliah: true,
                JalurPendaftaran: true,
                DaftarUlang: {
                    select: {
                        DaftarUlangId: true,
                        Nim: true,
                        JenjangKkniDituju: true,
                        KipK: true,
                        Aktif: true,
                        MengisiBiodata: true,
                        Finalisasi: true,
                        TanggalDaftar: true,
                        TanggalDaftarUlang: true,
                        ProgramStudi: {
                            select: {
                                ProgramStudiId: true,
                                UniversityId: true,
                                Nama: true,
                                Jenjang: true,
                                Akreditasi: true,
                            },
                        },
                    },
                },
                PekerjaanMahasiswa: {
                    select: {
                        InstitusiTempatBekerja: true,
                        Jabatan: true,
                        StatusPekerjaan: true,
                        PekerjaanMahasiswaId: true,
                    },
                },
                InstitusiLama: {
                    select: {
                        Jenjang: true,
                        InstitusiLamaId: true,
                        JenisInstitusi: true,
                        NamaInstitusi: true,
                        Jurusan: true,
                        Nisn: true,
                        Npsn: true,
                        TahunLulus: true,
                        NilaiLulusan: true,
                    },
                },
                OrangTua: {
                    select: {
                        OrangTuaId: true,
                        Nama: true,
                        Pekerjaan: true,
                        JenisOrtu: true,
                        Penghasilan: true,
                        Email: true,
                        NomorHp: true,
                    },
                },
                Pesantren: {
                    select: {
                        PesantrenId: true,
                        NamaPesantren: true,
                        LamaPesantren: true,
                    },
                },
                InformasiKependudukan: {
                    select: {
                        InformasiKependudukanId: true,
                        NoKk: true,
                        NoNik: true,
                        Suku: true,
                    },
                },
                Mahasiswa: {
                    select: {
                        StatusPerkawinan: true,
                        MahasiswaId: true,
                        User: {
                            select: {
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
                                },
                            },
                        },
                    },
                },
            },
            where: {
                KodePendaftar: kodePendaftarId,
            },
        })

        const response: CalonMahasiswaRplRequestResponseDTO = {
            ProgramStudi: {
                ProgramStudiId:
                    data?.DaftarUlang?.[0]?.ProgramStudi?.ProgramStudiId ?? '',
                UniversityId:
                    data?.DaftarUlang?.[0]?.ProgramStudi.UniversityId ?? '',
                NamaProgramStudi:
                    data?.DaftarUlang?.[0]?.ProgramStudi.Nama ?? '',
                JenjangProgramStudi:
                    data?.DaftarUlang?.[0]?.ProgramStudi.Jenjang ?? '',
                AkreditasiProgramStudi:
                    data?.DaftarUlang?.[0]?.ProgramStudi.Akreditasi ?? '',
            },
            Alamat: {
                AlamatId: data?.Mahasiswa.User.Alamat.AlamatId ?? '',
                Alamat: data?.Mahasiswa.User.Alamat.Alamat ?? '',
                KodePos: data?.Mahasiswa.User.Alamat.KodePos ?? '',
                DesaId: data?.Mahasiswa.User.Alamat.Desa.DesaId ?? '',
                NamaDesa: data?.Mahasiswa.User.Alamat.Desa.Nama ?? '',
                KecamatanId:
                    data?.Mahasiswa.User.Alamat.Desa.Kecamatan.KecamatanId ??
                    '',
                NamaKecamatan:
                    data?.Mahasiswa.User.Alamat.Desa.Kecamatan.Nama ?? '',
                KabupatenId:
                    data?.Mahasiswa.User.Alamat.Desa.Kecamatan.Kabupaten
                        .KabupatenId ?? '',
                NamaKabupaten:
                    data?.Mahasiswa.User.Alamat.Desa.Kecamatan.Kabupaten.Nama ??
                    '',
                ProvinsiId:
                    data?.Mahasiswa.User.Alamat.Desa.Kecamatan.Kabupaten
                        .Provinsi.ProvinsiId ?? '',
                NamaProvinsi:
                    data?.Mahasiswa.User.Alamat.Desa.Kecamatan.Kabupaten
                        .Provinsi.Nama ?? '',
                CountryId:
                    data?.Mahasiswa.User.Alamat.Desa.Kecamatan.Kabupaten
                        .Provinsi.Country.CountryId ?? '',
                NamaCountry:
                    data?.Mahasiswa.User.Alamat.Desa.Kecamatan.Kabupaten
                        .Provinsi.Country.Nama ?? '',
            },
            User: {
                UserId: data?.Mahasiswa.User.UserId ?? '',
                Nama: data?.Mahasiswa.User.Nama ?? '',
                Email: data?.Mahasiswa.User.Email ?? '',
                TempatLahir: data?.Mahasiswa.User.TempatLahir ?? '',
                TanggalLahir: data?.Mahasiswa.User.TanggalLahir ?? null,
                JenisKelamin:
                    data?.Mahasiswa.User.JenisKelamin || JenisKelamin.PRIA,
                PendidikanTerakhir:
                    data?.Mahasiswa.User.PendidikanTerakhir ||
                    Jenjang.TIDAK_TAMAT_SD,
                Avatar: data?.Mahasiswa.User.Avatar ?? 'default.png',
                Agama: data?.Mahasiswa.User.Agama ?? '',
                Telepon: data?.Mahasiswa.User.Telepon ?? '',
                NomorWa: data?.Mahasiswa.User.NomorWa ?? '',
                NomorHp: data?.Mahasiswa.User.NomorHp ?? '',
            },
            Pendaftaran: {
                PendaftaranId: data?.PendaftaranId ?? '',
                MahasiswaId: data?.Mahasiswa.MahasiswaId ?? '',
                KodePendaftar: data?.KodePendaftar ?? '',
                NoUjian: data?.NoUjian ?? '',
                Periode: data?.Periode ?? '',
                Gelombang: data?.Gelombang ?? '',
                SistemKuliah: data?.SistemKuliah || SistemKuliah.RPL,
                JalurPendaftaran: data?.JalurPendaftaran ?? '',
            },
            DaftarUlang: {
                DaftarUlangId: data?.DaftarUlang?.[0].DaftarUlangId ?? '',
                Nim: data?.DaftarUlang?.[0].Nim ?? '',
                JenjangKkniDituju:
                    data?.DaftarUlang?.[0].JenjangKkniDituju ?? '',
                KipK: data?.DaftarUlang?.[0].KipK ?? false,
                Aktif: data?.DaftarUlang?.[0].Aktif ?? false,
                MengisiBiodata: data?.DaftarUlang?.[0].MengisiBiodata ?? false,
                Finalisasi: data?.DaftarUlang?.[0].Finalisasi ?? false,
                TanggalDaftar: data?.DaftarUlang?.[0].TanggalDaftar || null,
                TanggalDaftarUlang:
                    data?.DaftarUlang?.[0].TanggalDaftarUlang || null,
            },
            StatusPerkawinan:
                data?.Mahasiswa.StatusPerkawinan || StatusPerkawinan.Lajang,
            OrangTua: (data?.OrangTua ?? []).map((o) => ({
                OrangTuaId: o.OrangTuaId,
                NamaOrangTua: o.Nama,
                PekerjaanOrangTua: o.Pekerjaan ?? '',
                JenisOrtu: JenisOrtu.AYAH,
                PenghasilanOrangTua: Number(o.Penghasilan),
                EmailOrangTua: o.Email,
                NomorHpOrangTua: o.NomorHp,
            })),
            InformasiKependudukan: {
                NoKk: data?.InformasiKependudukan?.[0].NoKk ?? '',
                NoNik: data?.InformasiKependudukan?.[0].NoNik ?? '',
                Suku: data?.InformasiKependudukan?.[0].Suku ?? '',
                InformasiKependudukanId:
                    data?.InformasiKependudukan?.[0].InformasiKependudukanId ??
                    '',
            },
            PekerjaanMahasiswa:
                data?.PekerjaanMahasiswa?.map((p) => ({
                    InstitusiTempatBekerja: p.InstitusiTempatBekerja ?? '',
                    Jabatan: p.Jabatan ?? '',
                    StatusPekerjaan:
                        p.StatusPekerjaan ?? StatusPekerjaan.Lainnya,
                })) ?? [],
            Pesantren: {
                PesantrenId: data?.Pesantren?.[0].PesantrenId ?? '',
                NamaPesantren: data?.Pesantren?.[0].NamaPesantren ?? '',
                LamaPesantren: data?.Pesantren?.[0].LamaPesantren ?? '',
            },
            InstitusiLama: {
                InstitusiLamaId: data?.InstitusiLama?.[0].InstitusiLamaId ?? '',
                Jenjang:
                    data?.InstitusiLama?.[0].Jenjang ?? Jenjang.TIDAK_TAMAT_SD,
                JenisInstitusi: data?.InstitusiLama?.[0].JenisInstitusi ?? '',
                NamaInstitusi: data?.InstitusiLama?.[0].NamaInstitusi ?? '',
                Jurusan: data?.InstitusiLama?.[0].Jurusan ?? '',
                Nisn: data?.InstitusiLama?.[0].Nisn ?? '',
                Npsn: data?.InstitusiLama?.[0].Npsn ?? '',
                TahunLulus: data?.InstitusiLama?.[0].TahunLulus ?? 0,
                NilaiLulusan: data?.InstitusiLama?.[0].NilaiLulusan ?? 0,
            },
        }
        return c.json<CalonMahasiswaRplRequestResponseDTO>(response, 200)
    } else if (page && limit) {
        let where: Prisma.PendaftaranWhereInput = search
            ? {
                  OR: [
                      {
                          KodePendaftar: {
                              contains: search,
                              mode: 'insensitive',
                          },
                      },
                      { NoUjian: { contains: search, mode: 'insensitive' } },
                      {
                          Mahasiswa: {
                              User: {
                                  Nama: {
                                      contains: search,
                                      mode: 'insensitive',
                                  },
                              },
                          },
                      },
                      {
                          InformasiKependudukan: {
                              some: {
                                  OR: [
                                      {
                                          NoNik: {
                                              contains: search,
                                              mode: 'insensitive',
                                          },
                                      },
                                      {
                                          NoKk: {
                                              contains: search,
                                              mode: 'insensitive',
                                          },
                                      },
                                  ],
                              },
                          },
                      },
                  ],
              }
            : {}

        const [data, total] = await Promise.all([
            prisma.pendaftaran.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { KodePendaftar: 'asc' },
                select: {
                    PendaftaranId: true,
                    KodePendaftar: true,
                    NoUjian: true,
                    Periode: true,
                    Gelombang: true,
                    DaftarUlang: {
                        select: {
                            Nim: true,
                            ProgramStudi: {
                                select: {
                                    Nama: true,
                                },
                            },
                        },
                    },
                    InformasiKependudukan: {
                        select: {
                            NoNik: true,
                        },
                    },
                    Mahasiswa: {
                        select: {
                            User: {
                                select: {
                                    Nama: true,
                                },
                            },
                        },
                    },
                },
            }),

            prisma.pendaftaran.count({ where }),
        ])

        const responses: CalonMahasiswaRplPage[] = data.map((d) => ({
            KodePendaftar: d?.KodePendaftar ?? '',
            NoNik: d?.InformasiKependudukan?.[0].NoNik ?? '',
            Nim: d?.DaftarUlang?.[0].Nim ?? '',
            Nama: d?.Mahasiswa.User.Nama ?? '',
            NoUjian: d?.NoUjian ?? '',
            Periode: d?.Periode ?? '',
            Gelombang: d?.Gelombang ?? '',
            NamaProdi: d?.DaftarUlang?.[0].ProgramStudi.Nama ?? '',
        }))

        return c.json<{
            data: CalonMahasiswaRplPage[]
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
    const body: CalonMahasiswaRplRequestResponseDTO = await c.req.json()

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

        // User
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

        // Userlogin
        const dataUsername = generateShortStrongPassword({
            KodePendaftar: body.Pendaftaran.KodePendaftar,
            NoUjian: body.Pendaftaran.NoUjian,
            JalurPendaftaran: body.Pendaftaran.JalurPendaftaran,
            Nim: body.DaftarUlang.Nim,
            TanggalLahir: body.User.TanggalLahir,
        })

        await prisma.userlogin.create({
            data: {
                UserId: user.UserId,
                Username: dataUsername,
                Password: dataUsername,
                Credential: 'credential',
            },
        })

        // Role
        const mhsRole = await prisma.role.findFirst({
            where: { Name: { equals: 'Mahasiswa', mode: 'insensitive' } },
            select: { RoleId: true },
        })
        if (mhsRole) {
            await prisma.userHasRoles.create({
                data: {
                    RoleId: mhsRole?.RoleId,
                    UserId: user.UserId,
                },
            })
        }

        // Mahasiswa
        const mahasiswa = await prisma.mahasiswa.create({
            data: {
                UserId: user.UserId,
                StatusPerkawinan: body.StatusPerkawinan,
                CreatedAt: new Date(),
                UpdatedAt: new Date(),
            },
        })

        // Pendaftaran
        const pendaftaran = await prisma.pendaftaran.create({
            data: {
                MahasiswaId: mahasiswa.MahasiswaId,
                KodePendaftar: body.Pendaftaran.KodePendaftar,
                NoUjian: body.Pendaftaran.NoUjian,
                Periode: body.Pendaftaran.Periode,
                Gelombang: body.Pendaftaran.Gelombang,
                SistemKuliah: body.Pendaftaran.SistemKuliah,
                JalurPendaftaran: body.Pendaftaran.JalurPendaftaran,
                CreatedAt: new Date(),
                UpdatedAt: new Date(),
            },
        })

        // Informasi Kependudukan
        await prisma.informasiKependudukan.create({
            data: {
                PendaftaranId: pendaftaran.PendaftaranId,
                NoKk: body.InformasiKependudukan.NoKk,
                NoNik: body.InformasiKependudukan.NoNik,
                Suku: body.InformasiKependudukan.Suku,
                CreatedAt: new Date(),
                UpdatedAt: new Date(),
            },
        })

        // Pesantren
        await prisma.pesantren.create({
            data: {
                PendaftaranId: pendaftaran.PendaftaranId,
                NamaPesantren: body.Pesantren.NamaPesantren,
                LamaPesantren: body.Pesantren.LamaPesantren,
                CreatedAt: new Date(),
                UpdatedAt: new Date(),
            },
        })

        // Orang Tua
        await prisma.orangTua.createMany({
            data: body.OrangTua.map((ot) => ({
                PendaftaranId: pendaftaran.PendaftaranId,
                Nama: ot.NamaOrangTua,
                Pekerjaan: ot.PekerjaanOrangTua,
                JenisOrtu: ot.JenisOrtu,
                Penghasilan: ot.PenghasilanOrangTua,
                Email: ot.EmailOrangTua,
                NomorHp: ot.NomorHpOrangTua,
                CreatedAt: new Date(),
                UpdatedAt: new Date(),
            })),
        })

        // InstitusiLama
        const alamatInstitusiLama = null
        await prisma.institusiLama.create({
            data: {
                PendaftaranId: pendaftaran.PendaftaranId,
                AlamatId: null,
                Jenjang: body.InstitusiLama.Jenjang,
                JenisInstitusi: body.InstitusiLama.JenisInstitusi,
                NamaInstitusi: body.InstitusiLama.NamaInstitusi,
                Jurusan: body.InstitusiLama.Jurusan,
                Nisn: body.InstitusiLama.Nisn,
                Npsn: body.InstitusiLama.Npsn,
                TahunLulus: body.InstitusiLama.TahunLulus,
                NilaiLulusan: body.InstitusiLama.NilaiLulusan,
            },
        })

        // Daftar Ulang
        const prodi = await prisma.programStudi.findFirst({
            where: {
                Nama: {
                    equals: body.ProgramStudi.NamaProgramStudi,
                    mode: 'insensitive',
                },
            },
            select: {
                ProgramStudiId: true,
            },
        })
        if (!prodi) {
            throw new Error('Program Studi not found')
        }
        await prisma.daftarUlang.create({
            data: {
                PendaftaranId: pendaftaran.PendaftaranId,
                ProgramStudiId: prodi.ProgramStudiId,
                Nim: body.DaftarUlang.Nim,
                JenjangKkniDituju: body.DaftarUlang.JenjangKkniDituju,
                KipK: body.DaftarUlang.KipK,
                Aktif: body.DaftarUlang.Aktif,
                MengisiBiodata: body.DaftarUlang.MengisiBiodata,
                Finalisasi: body.DaftarUlang.Finalisasi,
                TanggalDaftar: body.DaftarUlang.TanggalDaftar,
                TanggalDaftarUlang: body.DaftarUlang.TanggalDaftarUlang,
            },
        })

        const response: CalonMahasiswaRplPage = {
            KodePendaftar: pendaftaran.KodePendaftar,
            NoNik: body.InformasiKependudukan.NoNik,
            Nim: body.DaftarUlang.Nim,
            Nama: user.Nama,
            NoUjian: pendaftaran.NoUjian,
            Periode: pendaftaran.Periode,
            Gelombang: pendaftaran.Gelombang,
            NamaProdi: body.ProgramStudi.NamaProgramStudi,
        }

        return c.json<CalonMahasiswaRplPage>(response)
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
    const body: CalonMahasiswaRplRequestResponseDTO = await c.req.json()

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
        where: {
            UserId: body.User.UserId,
        },
    })

    const mahasiswa = await prisma.mahasiswa.update({
        data: {
            UserId: user.UserId,
            StatusPerkawinan: body.StatusPerkawinan,
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
        },
        where: {
            MahasiswaId: body.Pendaftaran.MahasiswaId,
        },
    })

    const pendaftaran = await prisma.pendaftaran.update({
        data: {
            MahasiswaId: mahasiswa.MahasiswaId,
            KodePendaftar: body.Pendaftaran.KodePendaftar,
            NoUjian: body.Pendaftaran.NoUjian,
            Periode: body.Pendaftaran.Periode,
            Gelombang: body.Pendaftaran.Gelombang,
            SistemKuliah: body.Pendaftaran.SistemKuliah,
            JalurPendaftaran: body.Pendaftaran.JalurPendaftaran,
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
        },
        where: { PendaftaranId: body.Pendaftaran.PendaftaranId },
    })

    // Informasi Kependudukan
    await prisma.informasiKependudukan.update({
        data: {
            PendaftaranId: pendaftaran.PendaftaranId,
            NoKk: body.InformasiKependudukan.NoKk,
            NoNik: body.InformasiKependudukan.NoNik,
            Suku: body.InformasiKependudukan.Suku,
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
        },
        where: {
            InformasiKependudukanId:
                body.InformasiKependudukan.InformasiKependudukanId,
        },
    })

    // Pesantren
    await prisma.pesantren.update({
        data: {
            PendaftaranId: pendaftaran.PendaftaranId,
            NamaPesantren: body.Pesantren.NamaPesantren,
            LamaPesantren: body.Pesantren.LamaPesantren,
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
        },
        where: {
            PesantrenId: body.Pesantren.PesantrenId,
        },
    })

    body.OrangTua.forEach(async (ot) => {
        await prisma.orangTua.update({
            where: {
                OrangTuaId: ot.OrangTuaId,
            },
            data: {
                Nama: ot.NamaOrangTua,
                Pekerjaan: ot.PekerjaanOrangTua,
                JenisOrtu: ot.JenisOrtu,
                Penghasilan: ot.PenghasilanOrangTua,
                Email: ot.EmailOrangTua,
                NomorHp: ot.NomorHpOrangTua,
                UpdatedAt: new Date(),
            },
        })
    })

    await prisma.institusiLama.update({
        data: {
            AlamatId: null,
            Jenjang: body.InstitusiLama.Jenjang,
            JenisInstitusi: body.InstitusiLama.JenisInstitusi,
            NamaInstitusi: body.InstitusiLama.NamaInstitusi,
            Jurusan: body.InstitusiLama.Jurusan,
            Nisn: body.InstitusiLama.Nisn,
            Npsn: body.InstitusiLama.Npsn,
            TahunLulus: body.InstitusiLama.TahunLulus,
            NilaiLulusan: body.InstitusiLama.NilaiLulusan,
        },
        where: {
            InstitusiLamaId: body.InstitusiLama.InstitusiLamaId,
        },
    })

    const prodi = await prisma.programStudi.findFirst({
        where: {
            Nama: {
                equals: body.ProgramStudi.NamaProgramStudi,
                mode: 'insensitive',
            },
        },
        select: {
            ProgramStudiId: true,
        },
    })
    if (!prodi) {
        throw new Error('Program Studi not found')
    }
    await prisma.daftarUlang.update({
        data: {
            ProgramStudiId: prodi.ProgramStudiId,
            Nim: body.DaftarUlang.Nim,
            JenjangKkniDituju: body.DaftarUlang.JenjangKkniDituju,
            KipK: body.DaftarUlang.KipK,
            Aktif: body.DaftarUlang.Aktif,
            MengisiBiodata: body.DaftarUlang.MengisiBiodata,
            Finalisasi: body.DaftarUlang.Finalisasi,
            TanggalDaftar: body.DaftarUlang.TanggalDaftar,
            TanggalDaftarUlang: body.DaftarUlang.TanggalDaftarUlang,
        },
        where: {
            DaftarUlangId: body.DaftarUlang.DaftarUlangId,
        },
    })

    const response: CalonMahasiswaRplPage = {
        KodePendaftar: pendaftaran.KodePendaftar,
        NoNik: body.InformasiKependudukan.NoNik,
        Nim: body.DaftarUlang.Nim,
        Nama: user.Nama,
        NoUjian: pendaftaran.NoUjian,
        Periode: pendaftaran.Periode,
        Gelombang: pendaftaran.Gelombang,
        NamaProdi: body.ProgramStudi.NamaProgramStudi,
    }
    return c.json(response, 200)
})

app.delete('/', async (c) => {
    const PendaftaranId = c.req.query('id')
    const idForAll = await prisma.pendaftaran.findFirst({select: {
        DaftarUlang: {select: {DaftarUlangId: true}},
        OrangTua: {select: {OrangTuaId: true}},
        InstitusiLama: {select: {InstitusiLamaId: true}},
        Pesantren: {select: {PesantrenId: true}},
        InformasiKependudukan: {select: {InformasiKependudukanId: true}},
        Mahasiswa: {select: {MahasiswaId: true, User: {select: {UserId: true}}}}
    }, where: {PendaftaranId: PendaftaranId}})

    const mhsRole = await prisma.role.findFirst({where: {
        Name: {
            equals: 'Mahasiswa', mode: 'insensitive'
        }
    }})

    if (mhsRole && idForAll && idForAll.DaftarUlang && idForAll.DaftarUlang.length > 0) {
        await prisma.daftarUlang.deleteMany({
            where: {
                DaftarUlangId: { in: idForAll.DaftarUlang.map(item => item.DaftarUlangId) },
            },
        })

        await prisma.orangTua.deleteMany({
            where: {
                OrangTuaId: { in: idForAll.OrangTua.map(item => item.OrangTuaId) },
            },
        })

        await prisma.pesantren.deleteMany({
            where: {
                PesantrenId: { in: idForAll.Pesantren.map(item => item.PesantrenId) },
            },
        })

        await prisma.institusiLama.deleteMany({
            where: {
                InstitusiLamaId: { in: idForAll.InstitusiLama.map(item => item.InstitusiLamaId) },
            },
        })
        
        await prisma.informasiKependudukan.deleteMany({
            where: {
                InformasiKependudukanId: { in: idForAll.InformasiKependudukan.map(item => item.InformasiKependudukanId) },
            },
        })

        await prisma.pendaftaran.delete({where: {PendaftaranId: PendaftaranId}})

        await prisma.mahasiswa.delete({where: {MahasiswaId: idForAll.Mahasiswa.MahasiswaId}})

        await prisma.userHasRoles.delete({
            where: {
                RoleId_UserId: {
                    RoleId: mhsRole.RoleId,
                    UserId: idForAll.Mahasiswa.User.UserId,
                },
            },
        })
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
    TanggalLahir: Date | null
}) {
    const { KodePendaftar, NoUjian, JalurPendaftaran, Nim, TanggalLahir } = data

    // Ambil 2 karakter dari beberapa field
    const part1 = KodePendaftar.slice(-2) // e.g. "01"
    const part2 = NoUjian.slice(-2) // e.g. "56"
    const part3 = JalurPendaftaran.charAt(0).toUpperCase() // e.g. "R"
    const part4 = Nim.slice(-2) // e.g. "34"
    const part5 = TanggalLahir
        ? TanggalLahir.getDate().toString().padStart(2, '0').slice(0, 1)
        : '0' // e.g. "1"

    const base = `${part1}${part2}${part3}${part4}${part5}` // contoh: "0156R341"

    // Acak susunannya biar lebih aman
    const shuffled = base
        .split('')
        .sort(() => 0.5 - Math.random())
        .join('')

    return shuffled
}
