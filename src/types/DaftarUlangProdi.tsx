import {
    KeteranganMataKuliah,
    StatusMataKuliahMahasiswa,
} from '@/generated/prisma'

export interface DaftarUlangProdiType {
    DaftarUlangId: string
    PendaftaranId: string
    Nim: string | null
    PilihMataKuliah: number
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
    PendaftaranId: '',
    Nim: null,
    JenjangKkniDituju: null,
    KipK: false,
    Aktif: false,
    PilihMataKuliah: 0,
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
