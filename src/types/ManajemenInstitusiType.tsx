import {
    Alamat,
    University,
    UniversityJabatan,
    UniversityJabatanOrang,
} from '@/generated/prisma'

export interface InstitusiRequestType {
    University: University
    Alamat: Alamat
}

export interface InstitusiResponseType {
    UniversityId: string
    Nama: string
    Akreditasi: string
    CreatedAt: Date | null
    UpdatedAt: Date | null
    DeletedAt: Date | null
    AlamatId: string
    Alamat: string
    KodePos: string
    DesaId: string
    NamaDesa: string
    KecamatanId: string
    NamaKecamatan: string
    KabupatenId: string
    NamaKabupaten: string
    ProvinsiId: string
    NamaProvinsi: string
    CountryId: string
    NamaCountry: string
}

export interface JabatanInstitusiRequestType {
    Jabatan: UniversityJabatan
    Orang: UniversityJabatanOrang
}

export type JabatanInstitusiResponseType = {
    Jabatan: UniversityJabatan
    Orang: UniversityJabatanOrang[]
}[]
