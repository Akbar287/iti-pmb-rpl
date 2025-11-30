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
import bcrypt from 'bcrypt'
import {
    CalonMahasiswaRplPage,
    CalonMahasiswaRplRequestResponseDTO,
} from '@/types/MahasiswaTypes'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import crypto from 'crypto'
import { SevimaImportCaseType } from '@/services/SevimaImportCase'
import { cookies } from 'next/headers'
import { nomorWaHasPermission } from '@/config/constraint'

const app = new Hono().basePath('/api/protected/manajemen-data/mahasiswa')
const BASE_URL = process.env.BACKEND_API_BASE_URL

app.get('/', async (c) => {
    const kodePendaftarId = c.req.query('id')
    const Get = c.req.query('get')
    const page = Number(c.req.query('page') ?? '1')
    const limit = Number(c.req.query('limit') ?? '10')
    const search = c.req.query('search') ?? ''

    if (kodePendaftarId && !Get) {
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
                        Alamat: {
                            select: {
                                AlamatId: true,
                                Alamat: true,
                                KodePos: true,
                                Desa: {
                                    select: {
                                        DesaId: true,
                                        Kecamatan: {
                                            select: {
                                                KecamatanId: true,
                                                Kabupaten: {
                                                    select: {
                                                        KabupatenId: true,
                                                        Provinsi: {
                                                            select: {
                                                                ProvinsiId:
                                                                    true,
                                                                Country: {
                                                                    select: {
                                                                        CountryId:
                                                                            true,
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
                Avatar:
                    process.env.NEXT_PUBLIC_API_BASE_URL +
                    '/api/protected/avatar?userId=' +
                    data?.Mahasiswa.User.UserId,
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
                DaftarUlangId:
                    data?.DaftarUlang.length === 0
                        ? ''
                        : data?.DaftarUlang?.[0].DaftarUlangId ?? '',
                Nim:
                    data?.DaftarUlang.length === 0
                        ? ''
                        : data?.DaftarUlang?.[0].Nim ?? '',
                JenjangKkniDituju:
                    data?.DaftarUlang.length === 0
                        ? ''
                        : data?.DaftarUlang?.[0].JenjangKkniDituju ?? '',
                KipK:
                    data?.DaftarUlang.length === 0
                        ? false
                        : data?.DaftarUlang?.[0].KipK ?? false,
                Aktif:
                    data?.DaftarUlang.length === 0
                        ? false
                        : data?.DaftarUlang?.[0].Aktif ?? false,
                MengisiBiodata:
                    data?.DaftarUlang.length === 0
                        ? false
                        : data?.DaftarUlang?.[0].MengisiBiodata ?? false,
                Finalisasi:
                    data?.DaftarUlang.length === 0
                        ? false
                        : data?.DaftarUlang?.[0].Finalisasi ?? false,
                TanggalDaftar:
                    data?.DaftarUlang.length === 0
                        ? null
                        : data?.DaftarUlang?.[0].TanggalDaftar || null,
                TanggalDaftarUlang:
                    data?.DaftarUlang.length === 0
                        ? null
                        : data?.DaftarUlang?.[0].TanggalDaftarUlang || null,
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
                NoKk:
                    data?.InformasiKependudukan.length === 0
                        ? ''
                        : data?.InformasiKependudukan?.[0].NoKk ?? '',
                NoNik:
                    data?.InformasiKependudukan.length === 0
                        ? ''
                        : data?.InformasiKependudukan?.[0].NoNik ?? '',
                Suku:
                    data?.InformasiKependudukan.length === 0
                        ? ''
                        : data?.InformasiKependudukan?.[0].Suku ?? '',
                InformasiKependudukanId:
                    data?.InformasiKependudukan.length === 0
                        ? ''
                        : data?.InformasiKependudukan?.[0]
                            .InformasiKependudukanId ?? '',
            },
            PekerjaanMahasiswa:
                data?.PekerjaanMahasiswa?.map((p) => ({
                    InstitusiTempatBekerja: p.InstitusiTempatBekerja ?? '',
                    Jabatan: p.Jabatan ?? '',
                    StatusPekerjaan:
                        p.StatusPekerjaan ?? StatusPekerjaan.Lainnya,
                })) ?? [],
            Pesantren: {
                PesantrenId:
                    data?.Pesantren.length === 0
                        ? ''
                        : data?.Pesantren?.[0].PesantrenId ?? '',
                NamaPesantren:
                    data?.Pesantren.length === 0
                        ? ''
                        : data?.Pesantren?.[0].NamaPesantren ?? '',
                LamaPesantren:
                    data?.Pesantren.length === 0
                        ? ''
                        : data?.Pesantren?.[0].LamaPesantren ?? '',
            },
            InstitusiLama: {
                InstitusiLamaId:
                    data?.InstitusiLama.length === 0
                        ? ''
                        : data?.InstitusiLama?.[0].InstitusiLamaId ?? '',
                Jenjang:
                    data?.InstitusiLama.length === 0
                        ? Jenjang.TIDAK_TAMAT_SD
                        : data?.InstitusiLama?.[0].Jenjang ??
                        Jenjang.TIDAK_TAMAT_SD,
                JenisInstitusi:
                    data?.InstitusiLama.length === 0
                        ? ''
                        : data?.InstitusiLama?.[0].JenisInstitusi ?? '',
                NamaInstitusi:
                    data?.InstitusiLama.length === 0
                        ? ''
                        : data?.InstitusiLama?.[0].NamaInstitusi ?? '',
                Jurusan:
                    data?.InstitusiLama.length === 0
                        ? ''
                        : data?.InstitusiLama?.[0].Jurusan ?? '',
                Nisn:
                    data?.InstitusiLama.length === 0
                        ? ''
                        : data?.InstitusiLama?.[0].Nisn ?? '',
                Npsn:
                    data?.InstitusiLama.length === 0
                        ? ''
                        : data?.InstitusiLama?.[0].Npsn ?? '',
                TahunLulus:
                    data?.InstitusiLama.length === 0
                        ? 0
                        : data?.InstitusiLama?.[0].TahunLulus ?? 0,
                NilaiLulusan:
                    data?.InstitusiLama.length === 0
                        ? 0
                        : data?.InstitusiLama?.[0].NilaiLulusan ?? 0,
                AlamatInstitusi: {
                    AlamatId:
                        data?.InstitusiLama.length === 0
                            ? ''
                            : data?.InstitusiLama?.[0].Alamat?.AlamatId ?? '',
                    Alamat:
                        data?.InstitusiLama.length === 0
                            ? ''
                            : data?.InstitusiLama?.[0].Alamat?.Alamat ?? '',
                    KodePos:
                        data?.InstitusiLama.length === 0
                            ? ''
                            : data?.InstitusiLama?.[0].Alamat?.KodePos ?? '',
                    DesaId:
                        data?.InstitusiLama.length === 0
                            ? ''
                            : data?.InstitusiLama?.[0].Alamat?.Desa.DesaId ??
                            '',
                    KecamatanId:
                        data?.InstitusiLama.length === 0
                            ? ''
                            : data?.InstitusiLama?.[0].Alamat?.Desa.Kecamatan
                                .KecamatanId ?? '',
                    KabupatenId:
                        data?.InstitusiLama.length === 0
                            ? ''
                            : data?.InstitusiLama?.[0].Alamat?.Desa.Kecamatan
                                .Kabupaten.KabupatenId ?? '',
                    ProvinsiId:
                        data?.InstitusiLama.length === 0
                            ? ''
                            : data?.InstitusiLama?.[0].Alamat?.Desa.Kecamatan
                                .Kabupaten.Provinsi.ProvinsiId ?? '',
                    CountryId:
                        data?.InstitusiLama.length === 0
                            ? ''
                            : data?.InstitusiLama?.[0].Alamat?.Desa.Kecamatan
                                .Kabupaten.Provinsi.Country.CountryId ?? '',
                },
            },
        }
        return c.json<CalonMahasiswaRplRequestResponseDTO>(response, 200)
    } else if (page && limit && !Get && !kodePendaftarId) {
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
                                    Userlogin: {
                                        select: {
                                            Username: true,
                                            Credential: true,
                                        }
                                    }
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
            Username: d?.Mahasiswa.User.Userlogin.find(x => x.Credential === 'credential')?.Username ?? '',
            NoNik:
                d?.InformasiKependudukan.length > 0
                    ? d?.InformasiKependudukan?.[0].NoNik ?? ''
                    : '',
            Nim: d?.DaftarUlang.length > 0 ? d?.DaftarUlang?.[0].Nim ?? '' : '',
            Nama: d?.Mahasiswa.User.Nama ?? '',
            NoUjian: d?.NoUjian ?? '',
            Periode: d?.Periode ?? '',
            Gelombang: d?.Gelombang ?? '',
            NamaProdi:
                d?.DaftarUlang.length > 0
                    ? d?.DaftarUlang?.[0].ProgramStudi.Nama ?? ''
                    : '',
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
    } else if (Get && !kodePendaftarId) {
        const mahasiswaNik = await prisma.informasiKependudukan.findMany({
            select: {
                NoNik: true
            }
        })

        return c.json<string[]>(mahasiswaNik.map(x => x.NoNik))
    } else {
        return c.json({
            message: 'no query included',
            data: [],
        })
    }
})

app.post('/', async (c) => {
    const Get = c.req.query('jenis')

    if (Get === 'set-user') {
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
                    Avatar: null,
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
            })

            await prisma.userlogin.create({
                data: {
                    UserId: user.UserId,
                    Username: dataUsername,
                    Password: await bcrypt.hash(
                        dataUsername,
                        await bcrypt.genSalt(10)
                    ),
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

            const statusPertama = await prisma.statusMahasiswaAssesment.findFirst({
                select: { StatusMahasiswaAssesmentId: true },
                where: {
                    NamaStatus: 'Pengisian Data Diri',
                },
            })
            if (!statusPertama) {
                return c.json({}, 400)
            }
            await prisma.statusMahasiswaAssesmentHistory.create({
                data: {
                    StatusMahasiswaAssesmentId:
                        statusPertama.StatusMahasiswaAssesmentId,
                    Tanggal: new Date(),
                    PendaftaranId: pendaftaran.PendaftaranId,
                    Keterangan: '',
                    Aktif: true,
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

            const alamatInstitusi = await prisma.alamat.create({
                data: {
                    Alamat: body.InstitusiLama.AlamatInstitusi.Alamat,
                    KodePos: body.InstitusiLama.AlamatInstitusi.KodePos,
                    DesaId: body.InstitusiLama.AlamatInstitusi.DesaId,
                },
            })
            await prisma.institusiLama.create({
                data: {
                    PendaftaranId: pendaftaran.PendaftaranId,
                    AlamatId:
                        alamatInstitusi !== null
                            ? alamatInstitusi.AlamatId
                            : alamat.AlamatId,
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
                Username: dataUsername,
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
    } else if (Get === 'set-user-sinkronisasi') {
        const body: SevimaImportCaseType[] = await c.req.json()

        const results = await Promise.all(
            body.map(u => createMahasiswaUser(u, {username: 'name'}))
        )

        const filtered = results.filter(r => r !== null)

        return c.json<CalonMahasiswaRplPage[]>(filtered)
    } else {
        return c.json({
            data: null, status: 404, message: 'no content'
        })
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

    const userlogin = await prisma.userlogin.findFirst({
        where: {
            Credential: 'credential',
            UserId: user.UserId,
        },
        select: {
            Username: true,
        }
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
        select: {
            InformasiKependudukan: true,
            InstitusiLama: true,
            Pesantren: true,
            OrangTua: true,
            DaftarUlang: true,
            PendaftaranId: true,
            KodePendaftar: true,
            NoUjian: true,
            Periode: true,
            Gelombang: true,
            SistemKuliah: true,
            JalurPendaftaran: true,
        },
        where: { PendaftaranId: body.Pendaftaran.PendaftaranId },
    })

    // Informasi Kependudukan
    if (pendaftaran.InformasiKependudukan.length === 0) {
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
    } else {
        await prisma.informasiKependudukan.update({
            data: {
                PendaftaranId: pendaftaran.PendaftaranId,
                NoKk: body.InformasiKependudukan.NoKk,
                NoNik: body.InformasiKependudukan.NoNik,
                Suku: body.InformasiKependudukan.Suku,
                UpdatedAt: new Date(),
            },
            where: {
                InformasiKependudukanId:
                    body.InformasiKependudukan.InformasiKependudukanId,
            },
        })
    }

    // Pesantren
    if (pendaftaran.Pesantren.length === 0) {
        await prisma.pesantren.create({
            data: {
                PendaftaranId: pendaftaran.PendaftaranId,
                NamaPesantren: body.Pesantren.NamaPesantren,
                LamaPesantren: body.Pesantren.LamaPesantren,
                CreatedAt: new Date(),
                UpdatedAt: new Date(),
            },
        })
    } else {
        await prisma.pesantren.update({
            data: {
                PendaftaranId: pendaftaran.PendaftaranId,
                NamaPesantren: body.Pesantren.NamaPesantren,
                LamaPesantren: body.Pesantren.LamaPesantren,
                UpdatedAt: new Date(),
            },
            where: {
                PesantrenId: body.Pesantren.PesantrenId,
            },
        })
    }

    if (pendaftaran.OrangTua.length !== 0) {
        await prisma.orangTua.deleteMany({
            where: {
                PendaftaranId: pendaftaran.PendaftaranId,
            },
        })
    }
    body.OrangTua.forEach(async (ot) => {
        await prisma.orangTua.create({
            data: {
                PendaftaranId: pendaftaran.PendaftaranId,
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

    let alamatInstitusi = null
    if (body.Alamat.AlamatId === body.InstitusiLama.AlamatInstitusi.AlamatId) {
        alamatInstitusi = await prisma.alamat.create({
            data: {
                Alamat: body.InstitusiLama.AlamatInstitusi.Alamat,
                KodePos: body.InstitusiLama.AlamatInstitusi.KodePos,
                DesaId: body.InstitusiLama.AlamatInstitusi.DesaId,
            },
        })
    } else {
        alamatInstitusi = await prisma.alamat.update({
            data: {
                Alamat: body.InstitusiLama.AlamatInstitusi.Alamat,
                KodePos: body.InstitusiLama.AlamatInstitusi.KodePos,
                DesaId: body.InstitusiLama.AlamatInstitusi.DesaId,
            },
            where: {
                AlamatId: body.InstitusiLama.AlamatInstitusi.AlamatId,
            },
        })
    }

    if (pendaftaran.InstitusiLama.length === 0) {
        await prisma.institusiLama.create({
            data: {
                AlamatId: alamatInstitusi.AlamatId,
                Jenjang: body.InstitusiLama.Jenjang,
                JenisInstitusi: body.InstitusiLama.JenisInstitusi,
                NamaInstitusi: body.InstitusiLama.NamaInstitusi,
                Jurusan: body.InstitusiLama.Jurusan,
                Nisn: body.InstitusiLama.Nisn,
                Npsn: body.InstitusiLama.Npsn,
                TahunLulus: body.InstitusiLama.TahunLulus,
                NilaiLulusan: body.InstitusiLama.NilaiLulusan,
                PendaftaranId: pendaftaran.PendaftaranId,
            },
        })
    } else {
        await prisma.institusiLama.update({
            data: {
                AlamatId: alamatInstitusi.AlamatId,
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
    }

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

    if (pendaftaran.DaftarUlang.length === 0) {
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
    } else {
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
    }

    const response: CalonMahasiswaRplPage = {
        KodePendaftar: pendaftaran.KodePendaftar,
        NoNik: body.InformasiKependudukan.NoNik,
        Nim: body.DaftarUlang.Nim,
        Nama: user.Nama,
        NoUjian: pendaftaran.NoUjian,
        Periode: pendaftaran.Periode,
        Gelombang: pendaftaran.Gelombang,
        NamaProdi: body.ProgramStudi.NamaProgramStudi,
        Username: userlogin?.Username || ''
    }
    return c.json(response, 200)
})

app.delete('/', async (c) => {
    const jenis = c.req.query('jenis');

    if (jenis === 'manual') {
        const id = c.req.query('id')
        if (!id) {
            return c.json({ error: "ID tidak boleh kosong" }, 400)
        }
        deleteOnce(id)
    } else if (jenis === 'sinkronisasi') {
        // Delete by NIK
        const ids = c.req.queries('id')

        if (!ids || ids.length === 0) {
            return c.json({ error: "ID tidak boleh kosong" }, 400)
        }

        for (const id of ids) {
            await deleteWithNik(id)
        }
    }

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)

async function createMahasiswaUser(body: SevimaImportCaseType, options?: {username: string}) {
    const provinsi = body.alamat.ProvinsiId
    const kabupaten = body.alamat.KabupatenId
    const kecamatan = body.alamat.KecamatanId
    const desa = body.alamat.DesaId
    let checkAlamatRequestToDb = await prisma.desa.findFirst({
        where: {
            DesaId: desa,
            Kecamatan: {
                KecamatanId: kecamatan,
                Kabupaten: {
                    KabupatenId: kabupaten,
                    Provinsi: {
                        ProvinsiId: provinsi,
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
                Alamat: body.alamat.Alamat,
                DesaId: checkAlamatRequestToDb?.DesaId,
                KodePos: body.alamat.KodePos,
            },
        })

        // User
        const user = await prisma.user.create({
            data: {
                AlamatId: alamat.AlamatId,
                Nama: body.user.Nama,
                Email: body.user.Email,
                EmailVerifiedAt: new Date(),
                TempatLahir: body.user.TempatLahir,
                TanggalLahir: body.user.TanggalLahir,
                JenisKelamin: body.user.JenisKelamin,
                PendidikanTerakhir: body.user.PendidikanTerakhir,
                Avatar: null,
                Agama: body.user.Agama,
                Telepon: body.user.Telepon,
                NomorWa: body.user.NomorWa,
                NomorHp: body.user.NomorHp,
                RememberToken: crypto.randomBytes(32).toString('hex'),
                CreatedAt: new Date(),
                UpdatedAt: new Date(),
                DeletedAt: null,
            },
        })

        // Userlogin
        const dataUsername = (options) ? body.user.Nama.toLowerCase() :
            generateShortStrongPassword({
                KodePendaftar: body.pendaftaran.KodePendaftar,
                NoUjian: body.pendaftaran.NoUjian,
                JalurPendaftaran: body.pendaftaran.JalurPendaftaran,
                Nim: body.daftarUlang.Nim,
            })

        await prisma.userlogin.create({
            data: {
                UserId: user.UserId,
                Username: dataUsername,
                Password: await bcrypt.hash(
                    dataUsername,
                    await bcrypt.genSalt(10)
                ),
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
                StatusPerkawinan: body.statusPerkawinan,
                CreatedAt: new Date(),
                UpdatedAt: new Date(),
            },
        })

        // Pendaftaran
        const pendaftaran = await prisma.pendaftaran.create({
            data: {
                MahasiswaId: mahasiswa.MahasiswaId,
                KodePendaftar: body.pendaftaran.KodePendaftar,
                NoUjian: body.pendaftaran.NoUjian,
                Periode: body.pendaftaran.Periode,
                Gelombang: body.pendaftaran.Gelombang,
                SistemKuliah: body.pendaftaran.SistemKuliah,
                JalurPendaftaran: body.pendaftaran.JalurPendaftaran,
                CreatedAt: new Date(),
                UpdatedAt: new Date(),
            },
        })

        const statusPertama = await prisma.statusMahasiswaAssesment.findFirst({
            select: { StatusMahasiswaAssesmentId: true },
            where: {
                NamaStatus: 'Pengisian Data Diri',
            },
        })
        if (!statusPertama) {
            return null;
        }
        await prisma.statusMahasiswaAssesmentHistory.create({
            data: {
                StatusMahasiswaAssesmentId:
                    statusPertama.StatusMahasiswaAssesmentId,
                Tanggal: new Date(),
                PendaftaranId: pendaftaran.PendaftaranId,
                Keterangan: '',
                Aktif: true,
            },
        })

        // Informasi Kependudukan
        await prisma.informasiKependudukan.create({
            data: {
                PendaftaranId: pendaftaran.PendaftaranId,
                NoKk: body.informasiKependudukan.NoKk,
                NoNik: body.informasiKependudukan.NoNik,
                Suku: body.informasiKependudukan.Suku,
                CreatedAt: new Date(),
                UpdatedAt: new Date(),
            },
        })

        // Pesantren
        await prisma.pesantren.create({
            data: {
                PendaftaranId: pendaftaran.PendaftaranId,
                NamaPesantren: body.pesantren.NamaPesantren,
                LamaPesantren: body.pesantren.LamaPesantren,
                CreatedAt: new Date(),
                UpdatedAt: new Date(),
            },
        })

        // Orang Tua
        await prisma.orangTua.createMany({
            data: body.orangTua.map((ot) => ({
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

        const alamatInstitusi = await prisma.alamat.create({
            data: {
                Alamat: 'Jalan XYZ No. 123',
                KodePos: '12345',
                DesaId: '15142712-a893-456e-9480-67b894d6192c',
            },
        })
        await prisma.institusiLama.create({
            data: {
                PendaftaranId: pendaftaran.PendaftaranId,
                AlamatId:
                    alamatInstitusi !== null
                        ? alamatInstitusi.AlamatId
                        : alamat.AlamatId,
                Jenjang: body.institusiLama.Jenjang,
                JenisInstitusi: body.institusiLama.JenisInstitusi,
                NamaInstitusi: body.institusiLama.NamaInstitusi,
                Jurusan: body.institusiLama.Jurusan,
                Nisn: body.institusiLama.Nisn,
                Npsn: body.institusiLama.Npsn,
                TahunLulus: body.institusiLama.TahunLulus,
                NilaiLulusan: 9,
            },
        })

        // Daftar Ulang
        const prodi = await prisma.programStudi.findFirst({
            where: {
                Nama: {
                    equals: body.programStudi.NamaProgramStudi,
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
                Nim: body.daftarUlang.Nim,
                JenjangKkniDituju: body.daftarUlang.JenjangKkniDituju,
                KipK: body.daftarUlang.KipK,
                Aktif: body.daftarUlang.Aktif,
                MengisiBiodata: body.daftarUlang.MengisiBiodata,
                Finalisasi: body.daftarUlang.Finalisasi,
                TanggalDaftar: body.daftarUlang.TanggalDaftar,
                TanggalDaftarUlang: body.daftarUlang.TanggalDaftarUlang,
            },
        })

        // Kirim Ke Notifikasi Wa Mahasiswa ;
        if (nomorWaHasPermission.includes(body.user.NomorWa)) {
            const params = new URLSearchParams({
                target: String(body.user.NomorWa),
                message: String("Selamat datang di Sistem Informasi RPL Terpadu Institut Teknologi Indonesia. " +
                    "Silahkan login menggunakan username: " + dataUsername +
                    " dan Password: " + dataUsername +
                    " untuk masuk ke Sistem RPL: https://pmb-rpl.vercel.app/; " +
                    "Proses pertama, anda perlu mengisi kelengkapan informasi dan dokumen bukti dukung."),
                jenis: String('sendWaText'),
            })
            const cookieHeader = cookies().toString()
            await fetch(
                `${BASE_URL}/api/protected/whatsapp?${params.toString()}`, {
                method: 'POST',
                headers: {
                    cookie: cookieHeader,
                    'Content-Type': 'application/json',
                }
            }
            )
        }

        const res: CalonMahasiswaRplPage = {
            KodePendaftar: pendaftaran.KodePendaftar,
            NoNik: body.informasiKependudukan.NoNik,
            Nim: body.daftarUlang.Nim,
            Username: dataUsername,
            Nama: user.Nama,
            NoUjian: pendaftaran.NoUjian,
            Periode: pendaftaran.Periode,
            Gelombang: pendaftaran.Gelombang,
            NamaProdi: body.programStudi.NamaProgramStudi,
        }

        return res;

    } else {
        return null;
    }
}

async function deleteWithNik(Nik: string) {
    const idForAll = await prisma.informasiKependudukan.findFirst({
        select: {
            InformasiKependudukanId: true,
            Pendaftaran: {
                select: {
                    PendaftaranId: true,
                    DaftarUlang: { select: { DaftarUlangId: true } },
                    OrangTua: { select: { OrangTuaId: true } },
                    InstitusiLama: {
                        select: {
                            InstitusiLamaId: true,
                            Alamat: { select: { AlamatId: true } },
                        },
                    },
                    Pesantren: { select: { PesantrenId: true } },
                    Mahasiswa: {
                        select: {
                            MahasiswaId: true,
                            User: { select: { UserId: true } },
                        },
                    },
                    InformasiKependudukan: {
                        select: { InformasiKependudukanId: true }
                    }
                }
            },
        },
        where: { NoNik: Nik },
    })

    const mhsRole = await prisma.role.findFirst({
        where: {
            Name: {
                equals: 'Mahasiswa',
                mode: 'insensitive',
            },
        },
    })

    if (
        mhsRole &&
        idForAll &&
        idForAll.Pendaftaran.DaftarUlang &&
        idForAll.Pendaftaran.DaftarUlang.length > 0
    ) {
        await prisma.daftarUlang.deleteMany({
            where: {
                DaftarUlangId: {
                    in: idForAll.Pendaftaran.DaftarUlang.map((item) => item.DaftarUlangId),
                },
            },
        })

        await prisma.orangTua.deleteMany({
            where: {
                OrangTuaId: {
                    in: idForAll.Pendaftaran.OrangTua.map((item) => item.OrangTuaId),
                },
            },
        })

        await prisma.pesantren.deleteMany({
            where: {
                PesantrenId: {
                    in: idForAll.Pendaftaran.Pesantren.map((item) => item.PesantrenId),
                },
            },
        })

        await prisma.institusiLama.deleteMany({
            where: {
                InstitusiLamaId: {
                    in: idForAll.Pendaftaran.InstitusiLama.map(
                        (item) => item.InstitusiLamaId
                    ),
                },
            },
        })

        await prisma.alamat.deleteMany({
            where: {
                AlamatId: {
                    in: idForAll.Pendaftaran.InstitusiLama.map(
                        (il) => il.Alamat?.AlamatId
                    ).filter((id): id is string => Boolean(id)),
                },
            },
        })

        await prisma.informasiKependudukan.deleteMany({
            where: {
                InformasiKependudukanId: {
                    in: idForAll.Pendaftaran.InformasiKependudukan.map(
                        (item) => item.InformasiKependudukanId
                    ),
                },
            },
        })

        await prisma.pendaftaran.delete({
            where: { PendaftaranId: idForAll.Pendaftaran.PendaftaranId },
        })

        await prisma.mahasiswa.delete({
            where: { MahasiswaId: idForAll.Pendaftaran.Mahasiswa.MahasiswaId },
        })

        await prisma.userHasRoles.delete({
            where: {
                RoleId_UserId: {
                    RoleId: mhsRole.RoleId,
                    UserId: idForAll.Pendaftaran.Mahasiswa.User.UserId,
                },
            },
        })
        await prisma.user.delete({
            where: {
                UserId: idForAll.Pendaftaran.Mahasiswa.User.UserId
            }
        })
    }
}
async function deleteOnce(PendaftaranId: string) {
    const idForAll = await prisma.pendaftaran.findFirst({
        select: {
            DaftarUlang: { select: { DaftarUlangId: true } },
            OrangTua: { select: { OrangTuaId: true } },
            InstitusiLama: {
                select: {
                    InstitusiLamaId: true,
                    Alamat: { select: { AlamatId: true } },
                },
            },
            Pesantren: { select: { PesantrenId: true } },
            InformasiKependudukan: {
                select: { InformasiKependudukanId: true },
            },
            Mahasiswa: {
                select: {
                    MahasiswaId: true,
                    User: { select: { UserId: true } },
                },
            },
        },
        where: { PendaftaranId: PendaftaranId },
    })

    const mhsRole = await prisma.role.findFirst({
        where: {
            Name: {
                equals: 'Mahasiswa',
                mode: 'insensitive',
            },
        },
    })

    if (
        mhsRole &&
        idForAll &&
        idForAll.DaftarUlang &&
        idForAll.DaftarUlang.length > 0
    ) {
        await prisma.daftarUlang.deleteMany({
            where: {
                DaftarUlangId: {
                    in: idForAll.DaftarUlang.map((item) => item.DaftarUlangId),
                },
            },
        })

        await prisma.orangTua.deleteMany({
            where: {
                OrangTuaId: {
                    in: idForAll.OrangTua.map((item) => item.OrangTuaId),
                },
            },
        })

        await prisma.pesantren.deleteMany({
            where: {
                PesantrenId: {
                    in: idForAll.Pesantren.map((item) => item.PesantrenId),
                },
            },
        })

        await prisma.institusiLama.deleteMany({
            where: {
                InstitusiLamaId: {
                    in: idForAll.InstitusiLama.map(
                        (item) => item.InstitusiLamaId
                    ),
                },
            },
        })

        await prisma.alamat.deleteMany({
            where: {
                AlamatId: {
                    in: idForAll.InstitusiLama.map(
                        (il) => il.Alamat?.AlamatId
                    ).filter((id): id is string => Boolean(id)),
                },
            },
        })

        await prisma.informasiKependudukan.deleteMany({
            where: {
                InformasiKependudukanId: {
                    in: idForAll.InformasiKependudukan.map(
                        (item) => item.InformasiKependudukanId
                    ),
                },
            },
        })

        await prisma.pendaftaran.delete({
            where: { PendaftaranId: PendaftaranId },
        })

        await prisma.mahasiswa.delete({
            where: { MahasiswaId: idForAll.Mahasiswa.MahasiswaId },
        })

        await prisma.userHasRoles.delete({
            where: {
                RoleId_UserId: {
                    RoleId: mhsRole.RoleId,
                    UserId: idForAll.Mahasiswa.User.UserId,
                },
            },
        })
    }
}

function generateShortStrongPassword(
    data: {
        KodePendaftar: string
        NoUjian: string
        JalurPendaftaran: string
        Nim: string
    },
    opts: { minLength?: number; exactLength?: boolean } = {}
): string {
    const { minLength = 8, exactLength = false } = opts
    const {
        KodePendaftar = '',
        NoUjian = '',
        JalurPendaftaran = '',
        Nim = '',
    } = data

    const part1 = KodePendaftar.slice(-2)
    const part2 = NoUjian.slice(-2)
    const part3 = (JalurPendaftaran.trim().charAt(0) || 'X').toUpperCase()
    const part4 = Nim.slice(-2)

    const base = `${part1}${part2}${part3}${part4}`.replace(/[^A-Za-z0-9]/g, '')
    let username = shuffle(base)

    if (username.length < minLength) {
        username += randomAlnum(minLength - username.length)
    }

    if (exactLength && username.length > minLength) {
        username = username.slice(0, minLength)
    }

    return username
}

function shuffle(s: string): string {
    const arr = s.split('')
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr.join('')
}

function randomAlnum(n: number): string {
    const chars =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const out: string[] = []
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        const buf = new Uint32Array(n)
        crypto.getRandomValues(buf)
        for (let i = 0; i < n; i++) out.push(chars[buf[i] % chars.length])
    } else {
        for (let i = 0; i < n; i++)
            out.push(chars[Math.floor(Math.random() * chars.length)])
    }
    return out.join('')
}
