import { z } from 'zod'
import {
    JenisKelamin,
    JenisOrtu,
    Jenjang,
    SistemKuliah,
    StatusPekerjaan,
    StatusPerkawinan,
} from '@/generated/prisma'

const getEnumValues = <T extends Record<string, string>>(
    enumObject: T
): [string, ...string[]] => {
    const values = Object.values(enumObject)
    if (values.length === 0) {
        throw new Error(
            `Enum object ${Object.keys(enumObject)} cannot be empty.`
        )
    }
    return values as [string, ...string[]]
}

const ProgramStudiSchema = z.object({
    ProgramStudiId: z.string(),
    UniversityId: z.string(),
    NamaProgramStudi: z.string().min(1, 'Nama Program Studi is required'),
    JenjangProgramStudi: z
        .enum(getEnumValues(Jenjang))
        .refine((val) => val !== null, {
            message: 'Jenjang Program Studi is required',
        }),
    AkreditasiProgramStudi: z
        .string()
        .min(1, 'Akreditasi Program Studi is required'),
})

const AlamatSchema = z.object({
    AlamatId: z.string(),
    Alamat: z.string().min(1, 'Alamat is required'),
    KodePos: z
        .string()
        .min(1, 'Kode Pos is required')
        .regex(/^\d{5}$/, 'Kode Pos tidak valid'),
    DesaId: z.string().min(1, 'DesaId is required'),
    KecamatanId: z.string().min(1, 'KecamatanId is required'),
    KabupatenId: z.string().min(1, 'KabupatenId is required'),
    ProvinsiId: z.string().min(1, 'ProvinsiId is required'),
    CountryId: z.string().min(1, 'CountryId is required'),
})

const UserSchema = z.object({
    UserId: z.string(),
    Nama: z.string().min(1, 'Nama is required'),
    Email: z.string().email('Email tidak valid'),
    TempatLahir: z.string().min(1, 'Tempat Lahir is required'),
    TanggalLahir: z
        .date()
        .nullable()
        .refine((val) => val !== null, {
            message: 'Tanggal Lahir is required',
        }),
    JenisKelamin: z
        .enum(getEnumValues(JenisKelamin))
        .nullable()
        .refine((val) => val !== null, {
            message: 'Jenis Kelamin is required',
        }),
    PendidikanTerakhir: z
        .enum(getEnumValues(Jenjang))
        .nullable()
        .refine((val) => val !== null, {
            message: 'Pendidikan Terakhir is required',
        }),
    Agama: z.string().min(1, 'Agama is required'),
    Telepon: z
        .string()
        .min(1, 'Telepon is required')
        .regex(/^\+?[0-9\s-()]+$/, 'Nomor Telepon tidak valid'),
    NomorWa: z
        .string()
        .min(1, 'Nomor WA is required')
        .regex(/^\+?[0-9\s-()]+$/, 'Nomor WA tidak valid'),
    NomorHp: z
        .string()
        .min(1, 'Nomor HP is required')
        .regex(/^\+?[0-9\s-()]+$/, 'Nomor HP tidak valid'),
})

const PendaftaranSchema = z.object({
    PendaftaranId: z.string(),
    MahasiswaId: z.string(),
    KodePendaftar: z.string().min(1, 'Kode Pendaftar is required'),
    NoUjian: z.string().min(1, 'No Ujian is required'),
    Periode: z.string().min(1, 'Periode is required'),
    Gelombang: z.string().min(1, 'Gelombang is required'),
    SistemKuliah: z
        .enum(getEnumValues(SistemKuliah))
        .nullable()
        .refine((val) => val !== null, {
            message: 'Sistem Kuliah is required',
        }),
    JalurPendaftaran: z.string().min(1, 'Jalur Pendaftaran is required'),
})

const DaftarUlangSchema = z.object({
    DaftarUlangId: z.string(),
    Nim: z.string().min(1, 'NIM is required'),
    JenjangKkniDituju: z.string().min(1, 'Jenjang KKNI Dituju is required'),
    KipK: z.boolean(),
    Aktif: z.boolean(),
    MengisiBiodata: z.boolean(),
    Finalisasi: z.boolean(),
    TanggalDaftar: z.date().nullable(),
    TanggalDaftarUlang: z.date().nullable(),
})

const OrangTuaSchema = z.object({
    OrangTuaId: z.string(),
    NamaOrangTua: z.string().min(1, 'Nama Orang Tua is required'),
    PekerjaanOrangTua: z.string().min(1, 'Pekerjaan Orang Tua is required'),
    JenisOrtu: z
        .enum(getEnumValues(JenisOrtu))
        .nullable()
        .refine((val) => val !== null, {
            message: 'Jenis Orang Tua is required',
        }),
    PenghasilanOrangTua: z.number().min(0, 'Penghasilan tidak boleh negatif'),
    EmailOrangTua: z
        .string()
        .email('Email Orang Tua tidak valid')
        .or(z.literal('')), // Allow empty if optional
    NomorHpOrangTua: z
        .string()
        .min(1, 'Nomor HP Orang Tua is required')
        .regex(/^\+?[0-9\s-()]+$/, 'Nomor HP Orang Tua tidak valid'),
})

const InformasiKependudukanSchema = z.object({
    InformasiKependudukanId: z.string(),
    NoKk: z
        .string()
        .min(1, 'No KK is required')
        .regex(/^\d{16}$/, 'No KK tidak valid, harus 16 digit'),
    NoNik: z
        .string()
        .min(1, 'No NIK is required')
        .regex(/^\d{16}$/, 'No NIK tidak valid, harus 16 digit'),
    Suku: z.string(),
})

const PekerjaanMahasiswaSchema = z.object({
    InstitusiTempatBekerja: z
        .string()
        .min(1, 'Institusi Tempat Bekerja is required'),
    Jabatan: z.string().min(1, 'Jabatan is required'),
    StatusPekerjaan: z
        .enum(getEnumValues(StatusPekerjaan))
        .nullable()
        .refine((val) => val !== null, {
            message: 'Status Pekerjaan is required',
        }),
})

const PesantrenSchema = z.object({
    PesantrenId: z.string(),
    NamaPesantren: z.string(),
    LamaPesantren: z.string(),
})

const InstitusiLamaSchema = z.object({
    InstitusiLamaId: z.string(),
    Jenjang: z
        .enum(getEnumValues(Jenjang))
        .nullable()
        .refine((val) => val !== null, { message: 'Jenjang is required' }),
    JenisInstitusi: z.string().min(1, 'Jenis Institusi is required'),
    NamaInstitusi: z.string().min(1, 'Nama Institusi is required'),
    Jurusan: z.string().min(1, 'Jurusan is required'),
    Nisn: z
        .string()
        .min(1, 'NISN is required')
        .regex(/^\d{10}$/, 'NISN tidak valid, harus 10 digit'),
    Npsn: z
        .string()
        .min(1, 'NPSN is required')
        .regex(/^\d{8}$/, 'NPSN tidak valid, harus 8 digit'),
    TahunLulus: z
        .number()
        .int()
        .min(1900, 'Tahun lulus tidak valid')
        .max(new Date().getFullYear(), 'Tahun lulus tidak boleh di masa depan'),
    NilaiLulusan: z
        .string()
        .min(0, 'Nilai tidak boleh negatif')
        .max(100, 'Nilai maksimal 100'),
    AlamatInstitusiLama: z
        .object({
            AlamatId: z.string(),
            Alamat: z.string().min(1, 'Alamat is required'),
            KodePos: z
                .string()
                .min(1, 'Kode Pos is required')
                .regex(/^\d{5}$/, 'Kode Pos tidak valid'),
            DesaId: z.string().min(1, 'DesaId is required'),
            KecamatanId: z.string().min(1, 'KecamatanId is required'),
            KabupatenId: z.string().min(1, 'KabupatenId is required'),
            ProvinsiId: z.string().min(1, 'ProvinsiId is required'),
            CountryId: z.string().min(1, 'CountryId is required'),
        })
        .optional(),
})

export const CalonMahasiswaSchemaValidation = z.object({
    programStudi: ProgramStudiSchema,
    alamat: AlamatSchema,
    user: UserSchema,
    pendaftaran: PendaftaranSchema,
    daftarUlang: DaftarUlangSchema,
    statusPerkawinan: z
        .enum(getEnumValues(StatusPerkawinan))
        .nullable()
        .refine((val) => val !== null, {
            message: 'Status Perkawinan is required',
        }),
    orangTua: z.array(OrangTuaSchema).optional(),
    informasiKependudukan: InformasiKependudukanSchema,
    pekerjaanMahasiswa: z.array(PekerjaanMahasiswaSchema).optional(),
    pesantren: PesantrenSchema.optional(),
    institusiLama: InstitusiLamaSchema,
})

export type CalonMahasiswaFormValidation = z.infer<
    typeof CalonMahasiswaSchemaValidation
>
