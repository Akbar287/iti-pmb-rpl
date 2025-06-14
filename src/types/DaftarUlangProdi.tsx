import {
    KeteranganMataKuliah,
    ProfiensiPengetahuan,
    StatusMataKuliahMahasiswa,
} from '@/generated/prisma'

export type MataKuliahMahasiswaCapaianPembelajaranTypes = {
    MataKuliahMahasiswaId: string
    PendaftaranId: string
    MataKuliahId: string
    Rpl: boolean
    StatusMataKuliahMahasiswa: StatusMataKuliahMahasiswa | null
    Keterangan: KeteranganMataKuliah | null
    ProgramStudiId: string
    Kode: string
    Nama: string
    Sks: number
    Semester: string | null
    Silabus: string | null
    CapaianPembelajaran: {
        CapaianPembelajaranId: string
        MataKuliahId: string
        Nama: string
        Urutan: number
        Active: boolean
        EvaluasiDiri: {
            EvaluasiDiriId: string
            MataKuliahMahasiswaId: string
            ProfiensiPengetahuan: ProfiensiPengetahuan
            TanggalPengesahan: Date | null
            CreatedAt: Date | null
            UpdatedAt: Date | null
            BuktiForm: {
                Jenis: string
                NomorDokumen: number
                BuktiFormId: string
                PendaftaranId: string
                JenisDokumenId: string
                NamaFile: string
                NamaDokumen: string
            }[]
        } | null
    }[]
}[]

export const MataKuliahMahasiswaCapaianPembelajaranValues: MataKuliahMahasiswaCapaianPembelajaranTypes =
    []

export interface RequestSetEvaluasiDiri {
    PendaftaranId: string
    MataKuliahMahasiswaId: string
    CapaianPembelajaranId: string
    ProfiensiPengetahuan: ProfiensiPengetahuan
    TanggalPengesahan: Date | null
    BuktiForm: string[]
}
export interface ResponseSetEvaluasiDiri {
    EvaluasiDiriId: string
    MataKuliahMahasiswaId: string
    ProfiensiPengetahuan: ProfiensiPengetahuan
    TanggalPengesahan: Date | null
    CreatedAt: Date | null
    UpdatedAt: Date | null
    BuktiForm: {
        Jenis: string
        NomorDokumen: number
        BuktiFormId: string
        PendaftaranId: string
        JenisDokumenId: string
        NamaFile: string
        NamaDokumen: string
    }[]
}

export interface DaftarUlangProdiType {
    DaftarUlangId: string
    PendaftaranId: string
    Nim: string | null
    Status: string
    PilihMataKuliah: number
    EvaluasiDiriMataKuliah: number
    JenjangKkniDituju: string | null
    KipK: boolean
    Aktif: boolean
    MengisiBiodata: boolean
    Finalisasi: boolean
    TanggalDaftar: Date | null
    TanggalDaftarUlang: Date | null
    CreatedAt: Date | null
    UpdatedAt: Date | null
    ProgramStudiId: string
    UniversityId: string
    Nama: string
    Jenjang: string | null
    Akreditasi: string
    MataKuliahMahasiswa: {
        MataKuliahMahasiswaId: string
        PendaftaranId: string
        MataKuliahId: string
        Rpl: boolean
        StatusMataKuliahMahasiswa: StatusMataKuliahMahasiswa | null
        Keterangan: KeteranganMataKuliah | null
    }[]
    MataKuliah: {
        MataKuliahId: string
        ProgramStudiId: string
        Kode: string
        Nama: string
        Sks: number
        Semester: string | null
        Silabus: string | null
    }[]
}
export const DaftarUlangProdiValue: DaftarUlangProdiType = {
    DaftarUlangId: '',
    Status: '',
    PendaftaranId: '',
    Nim: null,
    JenjangKkniDituju: null,
    KipK: false,
    Aktif: false,
    PilihMataKuliah: 0,
    EvaluasiDiriMataKuliah: 0,
    MengisiBiodata: false,
    Finalisasi: false,
    TanggalDaftar: null,
    TanggalDaftarUlang: null,
    CreatedAt: null,
    UpdatedAt: null,
    ProgramStudiId: '',
    UniversityId: '',
    Nama: '',
    Jenjang: null,
    MataKuliahMahasiswa: [],
    Akreditasi: '',
    MataKuliah: [],
}

export type CreateMataKuliahMahasiswaTypes = {
    MataKuliahId: string
    Keterangan: KeteranganMataKuliah
}[]

export const CreateMataKuliahMahasiswaValues: CreateMataKuliahMahasiswaTypes =
    []
