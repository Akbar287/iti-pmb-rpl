import { JenisKelamin, Jenjang } from '@/generated/prisma'

export type UserResponseByIdType = {
    UserId: string
    Username: string
    Nama: string
    Email: string
    Avatar: string | null
    NomorWa: string | null
    NomorHp: string | null
    Role:
        | {
              RoleId: string
              NamaRole: string
          }[]
        | []
}
export type UserResponsesType = {
    UserId: string
    Username: string
    Nama: string
    Email: string
    EmailVerifiedAt: Date | null
    TempatLahir: string | null
    TanggalLahir: Date | null
    JenisKelamin: JenisKelamin
    PendidikanTerakhir: Jenjang
    Avatar: string | null
    Agama: string | null
    Telepon: string | null
    NomorWa: string | null
    NomorHp: string | null
    Alamat: {
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
    } | null
    Role:
        | {
              RoleId: string
              NamaRole: string
          }[]
        | []
} | null

export interface RequestCreateUserType {
    Username: string
    Password: string | null
    Nama: string
    Email: string
    TempatLahir: string | null
    TanggalLahir: Date | null
    JenisKelamin: JenisKelamin
    PendidikanTerakhir: Jenjang
    Avatar: string | null
    Agama: string | null
    Telepon: string | null
    NomorWa: string | null
    NomorHp: string | null
    Alamat: string
    KodePos: string
    DesaId: string
    Role: {
        RoleId: string
        Name: string
    }[]
}
