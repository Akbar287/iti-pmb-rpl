import { JenisKelamin, Jenjang } from '@/generated/prisma'

export interface ProfilInterface {
    UserId: string
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
    Userlogin:
        | {
              Username: string
          }[]
        | undefined
    Alamat:
        | {
              AlamatId: string
              Alamat: string
              KodePos: string
              Desa: {
                  DesaId: string
                  Nama: string
                  Kecamatan: {
                      KecamatanId: string
                      Nama: string
                      Kabupaten: {
                          KabupatenId: string
                          Nama: string
                          Provinsi: {
                              ProvinsiId: string
                              Nama: string
                              Country: {
                                  CountryId: string
                                  Nama: string
                              }
                          }
                      }
                  }
              }
          }
        | undefined
}
