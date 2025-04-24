import { Jenjang } from '@/generated/prisma'

export interface InstitusiLamaType {
    InstitusiLamaId: string
    AlamatId: string
    PendaftaranId: string
    CountryId: string
    ProvinsiId: string
    KabupatenId: string
    KecamatanId: string
    DesaId: string
    KodePos: string
    Alamat: string
    Jenjang: Jenjang
    JenisInstitusi: string
    NamaInstitusi: string
    Jurusan: string
    Nisn: string
    Npsn: string
    TahunLulus: number
    NilaiLulusan: number
    CreatedAt: Date | null
    UpdatedAt: Date | null
}

export const InstitusiLamaValue = {
    InstitusiLamaId: '',
    AlamatId: '',
    PendaftaranId: '',
    CountryId: '',
    ProvinsiId: '',
    KabupatenId: '',
    KecamatanId: '',
    DesaId: '',
    KodePos: '',
    Alamat: '',
    Jenjang: Jenjang.TIDAK_TAMAT_SD,
    JenisInstitusi: '',
    NamaInstitusi: '',
    Jurusan: '',
    Nisn: '',
    Npsn: '',
    TahunLulus: 0,
    NilaiLulusan: 0,
    CreatedAt: null,
    UpdatedAt: null,
}
