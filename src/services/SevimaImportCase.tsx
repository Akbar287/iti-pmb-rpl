import {
    JenisKelamin,
    Jenjang,
    SistemKuliah,
    StatusPerkawinan,
} from '@/generated/prisma'

export interface ProgramStudi {
  ProgramStudiId: string
  UniversityId: string
  NamaProgramStudi: string
  JenjangProgramStudi: Jenjang
  AkreditasiProgramStudi: string
}

export interface Alamat {
  AlamatId: string
  Alamat: string
  KodePos: string
  DesaId: string
  KecamatanId: string
  KabupatenId: string
  ProvinsiId: string
  CountryId: string
}

export interface UserData {
  UserId: string
  Nama: string
  Email: string
  TempatLahir: string
  TanggalLahir: Date
  JenisKelamin: JenisKelamin
  PendidikanTerakhir: Jenjang
  Agama: string
  Telepon: string
  NomorWa: string
  NomorHp: string
}

export interface Pendaftaran {
  PendaftaranId: string
  MahasiswaId: string
  KodePendaftar: string
  NoUjian: string
  Periode: string
  Gelombang: string
  SistemKuliah: SistemKuliah
  JalurPendaftaran: string
}

export interface DaftarUlang {
  DaftarUlangId: string
  Nim: string
  JenjangKkniDituju: string
  KipK: boolean
  Aktif: boolean
  MengisiBiodata: boolean
  Finalisasi: boolean
  TanggalDaftar: Date
  TanggalDaftarUlang: Date | null
}

export interface InformasiKependudukan {
  InformasiKependudukanId: string
  NoKk: string
  NoNik: string
  Suku: string
}

export interface Pesantren {
  PesantrenId: string
  NamaPesantren: string
  LamaPesantren: string
}

export interface AlamatInstitusiLama extends Alamat {}

export interface InstitusiLama {
  InstitusiLamaId: string
  Jenjang: Jenjang
  JenisInstitusi: string
  NamaInstitusi: string
  Jurusan: string
  Nisn: string
  Npsn: string
  TahunLulus: number
  NilaiLulusan: string
  AlamatInstitusiLama: AlamatInstitusiLama
}

export interface SevimaImportCaseType {
    programStudi: ProgramStudi
    alamat: Alamat
    user: UserData
    pendaftaran: Pendaftaran
    daftarUlang: DaftarUlang
    statusPerkawinan: StatusPerkawinan
    orangTua: any[]
    informasiKependudukan: InformasiKependudukan
    pekerjaanMahasiswa: any[]
    pesantren: Pesantren
    institusiLama: InstitusiLama
}
export function SevimaImportCase() {
    return [
      {
        "programStudi": {
          "ProgramStudiId": "85b80451-9b83-4ce9-823c-8f2cfc34b4b5",
          "UniversityId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "NamaProgramStudi": "Teknik Informatika",
          "JenjangProgramStudi": Jenjang.S1,
          "AkreditasiProgramStudi": "A"
        },
        "alamat": {
          "AlamatId": "",
          "Alamat": "Jl. Contoh No. 133 RT 5/RW 1",
          "KodePos": "35212",
          "DesaId": "d8f0852f-a2ee-4c4c-bcf4-7692d34036f3",
          "KecamatanId": "651b776b-743b-4222-9312-f3cd505f6858",
          "KabupatenId": "fd4a92fd-1a5f-4d56-a086-44061ba399a1",
          "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
          "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
        },
        "user": {
          "UserId": "",
          "Nama": "MTIUI002",
          "Email": "mtiui001@email.com",
          "TempatLahir": "Medan",
          "TanggalLahir": new Date("2000-08-26T00:00:00Z"),
          "JenisKelamin": JenisKelamin.PRIA,
          "PendidikanTerakhir": Jenjang.S1,
          "Agama": "Kristen",
          "Telepon": "08696829903",
          "NomorWa": "081288748757",
          "NomorHp": "08206906350"
        },
        "pendaftaran": {
          "PendaftaranId": "",
          "MahasiswaId": "",
          "KodePendaftar": "RPL-2025E-0001",
          "NoUjian": "UJ-2025-00001",
          "Periode": "2025 Genap",
          "Gelombang": "Gelombang 1",
          "SistemKuliah": SistemKuliah.RPL,
          "JalurPendaftaran": "RPL Rekognisi"
        },
        "daftarUlang": {
          "DaftarUlangId": "",
          "Nim": "25000001",
          "JenjangKkniDituju": "8",
          "KipK": false,
          "Aktif": true,
          "MengisiBiodata": true,
          "Finalisasi": true,
          "TanggalDaftar": new Date("2025-11-27T00:00:00Z"),
          "TanggalDaftarUlang": new Date("2025-12-07T00:00:00Z")
        },
        "statusPerkawinan": StatusPerkawinan.Lajang,
        "orangTua": [],
        "informasiKependudukan": {
          "InformasiKependudukanId": "",
          "NoKk": "3174123591779640",
          "NoNik": "3174123889915714",
          "Suku": "Jawa"
        },
        "pekerjaanMahasiswa": [],
        "pesantren": {
          "PesantrenId": "",
          "NamaPesantren": "Pesantren Nurul Ilmi",
          "LamaPesantren": "6 tahun"
        },
        "institusiLama": {
          "InstitusiLamaId": "",
          "Jenjang": Jenjang.SMA,
          "JenisInstitusi": "SMA",
          "NamaInstitusi": "SMA Negeri 1 Contoh",
          "Jurusan": "IPS",
          "Nisn": "8356013204",
          "Npsn": "71391501",
          "TahunLulus": 2019,
          "NilaiLulusan": "91.00",
          "AlamatInstitusiLama": {
            "AlamatId": "",
            "Alamat": "Jl. Pendidikan No. 117",
            "KodePos": "35212",
            "DesaId": "d8f0852f-a2ee-4c4c-bcf4-7692d34036f3",
            "KecamatanId": "651b776b-743b-4222-9312-f3cd505f6858",
            "KabupatenId": "fd4a92fd-1a5f-4d56-a086-44061ba399a1",
            "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
            "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
          }
        }
      },
      {
        "programStudi": {
          "ProgramStudiId": "85b80451-9b83-4ce9-823c-8f2cfc34b4b5",
          "UniversityId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "NamaProgramStudi": "Teknik Informatika",
          "JenjangProgramStudi": Jenjang.S1,
          "AkreditasiProgramStudi": "A"
        },
        "alamat": {
          "AlamatId": "",
          "Alamat": "Jl. Contoh No. 175 RT 7/RW 10",
          "KodePos": "40222",
          "DesaId": "4bac6f1b-3192-4921-baf6-b866813b1c53",
          "KecamatanId": "cd19bff1-38f9-45f2-b7f9-e8aa5a49b191",
          "KabupatenId": "9f47fe17-f67b-4c26-90e8-fe03d10ced20",
          "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
          "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
        },
        "user": {
          "UserId": "",
          "Nama": "MTIUI002",
          "Email": "mtiui002@email.com",
          "TempatLahir": "Bandung",
          "TanggalLahir": new Date("2005-01-03T00:00:00Z"),
          "JenisKelamin": JenisKelamin.PRIA,
          "PendidikanTerakhir": Jenjang.S1,
          "Agama": "Konghucu",
          "Telepon": "08553531377",
          "NomorWa": "08326424332",
          "NomorHp": "08245610739"
        },
        "pendaftaran": {
          "PendaftaranId": "",
          "MahasiswaId": "",
          "KodePendaftar": "RPL-2025E-0002",
          "NoUjian": "UJ-2025-00002",
          "Periode": "2025 Genap",
          "Gelombang": "Gelombang 2",
          "SistemKuliah": SistemKuliah.RPL,
          "JalurPendaftaran": "RPL Reguler"
        },
        "daftarUlang": {
          "DaftarUlangId": "",
          "Nim": "25000002",
          "JenjangKkniDituju": "8",
          "KipK": false,
          "Aktif": true,
          "MengisiBiodata": true,
          "Finalisasi": true,
          "TanggalDaftar": new Date("2025-11-27T00:00:00Z"),
          "TanggalDaftarUlang": new Date("2025-12-11T00:00:00Z")
        },
        "statusPerkawinan": StatusPerkawinan.Lajang,
        "orangTua": [],
        "informasiKependudukan": {
          "InformasiKependudukanId": "",
          "NoKk": "3174123968137020",
          "NoNik": "3174123549204381",
          "Suku": "Lampung"
        },
        "pekerjaanMahasiswa": [],
        "pesantren": {
          "PesantrenId": "",
          "NamaPesantren": "",
          "LamaPesantren": "6 tahun"
        },
        "institusiLama": {
          "InstitusiLamaId": "",
          "Jenjang": Jenjang.SMA,
          "JenisInstitusi": "SMK",
          "NamaInstitusi": "SMK Negeri 2 Contoh",
          "Jurusan": "RPL",
          "Nisn": "2857415110",
          "Npsn": "91730540",
          "TahunLulus": 2020,
          "NilaiLulusan": "91.00",
          "AlamatInstitusiLama": {
            "AlamatId": "",
            "Alamat": "Jl. Pendidikan No. 149",
            "KodePos": "40222",
            "DesaId": "4bac6f1b-3192-4921-baf6-b866813b1c53",
            "KecamatanId": "cd19bff1-38f9-45f2-b7f9-e8aa5a49b191",
            "KabupatenId": "9f47fe17-f67b-4c26-90e8-fe03d10ced20",
            "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
            "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
          }
        }
      },
      {
        "programStudi": {
          "ProgramStudiId": "85b80451-9b83-4ce9-823c-8f2cfc34b4b5",
          "UniversityId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "NamaProgramStudi": "Teknik Informatika",
          "JenjangProgramStudi": Jenjang.S1,
          "AkreditasiProgramStudi": "A"
        },
        "alamat": {
          "AlamatId": "",
          "Alamat": "Jl. Contoh No. 131 RT 6/RW 2",
          "KodePos": "40111",
          "DesaId": "fd5560e5-89b1-4a22-a0ed-9602f2fe8da2",
          "KecamatanId": "e7401f54-b125-4795-9f4a-ded186365b49",
          "KabupatenId": "fd4a92fd-1a5f-4d56-a086-44061ba399a1",
          "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
          "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
        },
        "user": {
          "UserId": "",
          "Nama": "MTIUI003",
          "Email": "mtiui003@email.com",
          "TempatLahir": "Lampung",
          "TanggalLahir": new Date("2006-12-15T00:00:00Z"),
          "JenisKelamin": JenisKelamin.PRIA,
          "PendidikanTerakhir": Jenjang.S1,
          "Agama": "Kristen",
          "Telepon": "08974358849",
          "NomorWa": "08882087390",
          "NomorHp": "08464098245"
        },
        "pendaftaran": {
          "PendaftaranId": "",
          "MahasiswaId": "",
          "KodePendaftar": "RPL-2025E-0003",
          "NoUjian": "UJ-2025-00003",
          "Periode": "2025 Genap",
          "Gelombang": "Gelombang 1",
          "SistemKuliah": SistemKuliah.RPL,
          "JalurPendaftaran": "RPL Rekognisi"
        },
        "daftarUlang": {
          "DaftarUlangId": "",
          "Nim": "25000003",
          "JenjangKkniDituju": "8",
          "KipK": false,
          "Aktif": false,
          "MengisiBiodata": true,
          "Finalisasi": false,
          "TanggalDaftar": new Date("2025-11-06T00:00:00Z"),
          "TanggalDaftarUlang": null
        },
        "statusPerkawinan": StatusPerkawinan.Lajang,
        "orangTua": [],
        "informasiKependudukan": {
          "InformasiKependudukanId": "",
          "NoKk": "3174123264397612",
          "NoNik": "3174123661483956",
          "Suku": "Sunda"
        },
        "pekerjaanMahasiswa": [],
        "pesantren": {
          "PesantrenId": "",
          "NamaPesantren": "",
          "LamaPesantren": ""
        },
        "institusiLama": {
          "InstitusiLamaId": "",
          "Jenjang": Jenjang.SMA,
          "JenisInstitusi": "SMA",
          "NamaInstitusi": "SMA Negeri 1 Contoh",
          "Jurusan": "RPL",
          "Nisn": "8167003777",
          "Npsn": "91395432",
          "TahunLulus": 2023,
          "NilaiLulusan": "60.00",
          "AlamatInstitusiLama": {
            "AlamatId": "",
            "Alamat": "Jl. Pendidikan No. 72",
            "KodePos": "40111",
            "DesaId": "fd5560e5-89b1-4a22-a0ed-9602f2fe8da2",
            "KecamatanId": "e7401f54-b125-4795-9f4a-ded186365b49",
            "KabupatenId": "fd4a92fd-1a5f-4d56-a086-44061ba399a1",
            "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
            "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
          }
        }
      },
      {
        "programStudi": {
          "ProgramStudiId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "UniversityId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "NamaProgramStudi": "Teknik Mesin",
          "JenjangProgramStudi": Jenjang.S1,
          "AkreditasiProgramStudi": "A Sekali"
        },
        "alamat": {
          "AlamatId": "",
          "Alamat": "Jl. Contoh No. 59 RT 4/RW 7",
          "KodePos": "40222",
          "DesaId": "4bac6f1b-3192-4921-baf6-b866813b1c53",
          "KecamatanId": "cd19bff1-38f9-45f2-b7f9-e8aa5a49b191",
          "KabupatenId": "9f47fe17-f67b-4c26-90e8-fe03d10ced20",
          "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
          "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
        },
        "user": {
          "UserId": "",
          "Nama": "MTIUI004",
          "Email": "mtiui004@email.com",
          "TempatLahir": "Jakarta",
          "TanggalLahir": new Date("1996-02-10T00:00:00Z"),
          "JenisKelamin": JenisKelamin.PRIA,
          "PendidikanTerakhir": Jenjang.S1,
          "Agama": "Islam",
          "Telepon": "08159786792",
          "NomorWa": "08345794015",
          "NomorHp": "08514432614"
        },
        "pendaftaran": {
          "PendaftaranId": "",
          "MahasiswaId": "",
          "KodePendaftar": "RPL-2025E-0004",
          "NoUjian": "UJ-2025-00004",
          "Periode": "2025 Genap",
          "Gelombang": "Gelombang 2",
          "SistemKuliah": SistemKuliah.RPL,
          "JalurPendaftaran": "RPL Reguler"
        },
        "daftarUlang": {
          "DaftarUlangId": "",
          "Nim": "25000004",
          "JenjangKkniDituju": "8",
          "KipK": true,
          "Aktif": true,
          "MengisiBiodata": false,
          "Finalisasi": true,
          "TanggalDaftar": new Date("2025-11-08T00:00:00Z"),
          "TanggalDaftarUlang": new Date("2025-11-15T00:00:00Z")
        },
        "statusPerkawinan": StatusPerkawinan.Lajang,
        "orangTua": [],
        "informasiKependudukan": {
          "InformasiKependudukanId": "",
          "NoKk": "3174123132050960",
          "NoNik": "3174123814333752",
          "Suku": "Minang"
        },
        "pekerjaanMahasiswa": [],
        "pesantren": {
          "PesantrenId": "",
          "NamaPesantren": "",
          "LamaPesantren": "6 tahun"
        },
        "institusiLama": {
          "InstitusiLamaId": "",
          "Jenjang": Jenjang.SMA,
          "JenisInstitusi": "SMA",
          "NamaInstitusi": "MA Al Falah",
          "Jurusan": "TKJ",
          "Nisn": "4801638012",
          "Npsn": "83480687",
          "TahunLulus": 2013,
          "NilaiLulusan": "65.00",
          "AlamatInstitusiLama": {
            "AlamatId": "",
            "Alamat": "Jl. Pendidikan No. 79",
            "KodePos": "40222",
            "DesaId": "4bac6f1b-3192-4921-baf6-b866813b1c53",
            "KecamatanId": "cd19bff1-38f9-45f2-b7f9-e8aa5a49b191",
            "KabupatenId": "9f47fe17-f67b-4c26-90e8-fe03d10ced20",
            "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
            "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
          }
        }
      },
      {
        "programStudi": {
          "ProgramStudiId": "85b80451-9b83-4ce9-823c-8f2cfc34b4b5",
          "UniversityId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "NamaProgramStudi": "Teknik Informatika",
          "JenjangProgramStudi": Jenjang.S1,
          "AkreditasiProgramStudi": "A"
        },
        "alamat": {
          "AlamatId": "",
          "Alamat": "Jl. Contoh No. 141 RT 5/RW 3",
          "KodePos": "50123",
          "DesaId": "1ee02706-008a-4423-bc16-6c58da8afb96",
          "KecamatanId": "cf2ca8f1-ae10-4bf8-aa08-615ca012f9ce",
          "KabupatenId": "6cc90f81-b49c-42fa-96ec-d9d5180961a2",
          "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
          "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
        },
        "user": {
          "UserId": "",
          "Nama": "MTIUI005",
          "Email": "mtiui005@email.com",
          "TempatLahir": "Surabaya",
          "TanggalLahir": new Date("1988-08-05T00:00:00Z"),
          "JenisKelamin": JenisKelamin.PRIA,
          "PendidikanTerakhir": Jenjang.S1,
          "Agama": "Katolik",
          "Telepon": "08829028430",
          "NomorWa": "08794465396",
          "NomorHp": "08423103365"
        },
        "pendaftaran": {
          "PendaftaranId": "",
          "MahasiswaId": "",
          "KodePendaftar": "RPL-2025E-0005",
          "NoUjian": "UJ-2025-00005",
          "Periode": "2025 Genap",
          "Gelombang": "Gelombang 2",
          "SistemKuliah": SistemKuliah.RPL,
          "JalurPendaftaran": "RPL Pekerja"
        },
        "daftarUlang": {
          "DaftarUlangId": "",
          "Nim": "25000005",
          "JenjangKkniDituju": "8",
          "KipK": false,
          "Aktif": true,
          "MengisiBiodata": true,
          "Finalisasi": true,
          "TanggalDaftar": new Date("2025-11-09T00:00:00Z"),
          "TanggalDaftarUlang": new Date("2025-11-21T00:00:00Z")
        },
        "statusPerkawinan": StatusPerkawinan.Lajang,
        "orangTua": [],
        "informasiKependudukan": {
          "InformasiKependudukanId": "",
          "NoKk": "3174123710835438",
          "NoNik": "3174123225215598",
          "Suku": "Jawa"
        },
        "pekerjaanMahasiswa": [],
        "pesantren": {
          "PesantrenId": "",
          "NamaPesantren": "",
          "LamaPesantren": "4 tahun"
        },
        "institusiLama": {
          "InstitusiLamaId": "",
          "Jenjang": Jenjang.SMA,
          "JenisInstitusi": "SMA",
          "NamaInstitusi": "SMK Negeri 2 Contoh",
          "Jurusan": "IPA",
          "Nisn": "8251728770",
          "Npsn": "57362174",
          "TahunLulus": 2007,
          "NilaiLulusan": "96.00",
          "AlamatInstitusiLama": {
            "AlamatId": "",
            "Alamat": "Jl. Pendidikan No. 78",
            "KodePos": "50123",
            "DesaId": "1ee02706-008a-4423-bc16-6c58da8afb96",
            "KecamatanId": "cf2ca8f1-ae10-4bf8-aa08-615ca012f9ce",
            "KabupatenId": "6cc90f81-b49c-42fa-96ec-d9d5180961a2",
            "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
            "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
          }
        }
      },
      {
        "programStudi": {
          "ProgramStudiId": "85b80451-9b83-4ce9-823c-8f2cfc34b4b5",
          "UniversityId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "NamaProgramStudi": "Teknik Informatika",
          "JenjangProgramStudi": Jenjang.S1,
          "AkreditasiProgramStudi": "A"
        },
        "alamat": {
          "AlamatId": "",
          "Alamat": "Jl. Contoh No. 85 RT 8/RW 6",
          "KodePos": "35212",
          "DesaId": "d8f0852f-a2ee-4c4c-bcf4-7692d34036f3",
          "KecamatanId": "651b776b-743b-4222-9312-f3cd505f6858",
          "KabupatenId": "fd4a92fd-1a5f-4d56-a086-44061ba399a1",
          "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
          "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
        },
        "user": {
          "UserId": "",
          "Nama": "MTIUI006",
          "Email": "mtiui006@email.com",
          "TempatLahir": "Bandung",
          "TanggalLahir": new Date("2004-10-22T00:00:00Z"),
          "JenisKelamin": JenisKelamin.PRIA,
          "PendidikanTerakhir": Jenjang.S1,
          "Agama": "Kristen",
          "Telepon": "08520733113",
          "NomorWa": "08583830033",
          "NomorHp": "08286210567"
        },
        "pendaftaran": {
          "PendaftaranId": "",
          "MahasiswaId": "",
          "KodePendaftar": "RPL-2025E-0006",
          "NoUjian": "UJ-2025-00006",
          "Periode": "2025 Genap",
          "Gelombang": "Gelombang 3",
          "SistemKuliah": SistemKuliah.RPL,
          "JalurPendaftaran": "RPL Reguler"
        },
        "daftarUlang": {
          "DaftarUlangId": "",
          "Nim": "25000006",
          "JenjangKkniDituju": "8",
          "KipK": false,
          "Aktif": true,
          "MengisiBiodata": true,
          "Finalisasi": true,
          "TanggalDaftar": new Date("2025-11-28T00:00:00Z"),
          "TanggalDaftarUlang": new Date("2025-12-06T00:00:00Z")
        },
        "statusPerkawinan": StatusPerkawinan.Lajang,
        "orangTua": [],
        "informasiKependudukan": {
          "InformasiKependudukanId": "",
          "NoKk": "3174123917518296",
          "NoNik": "3174123624800480",
          "Suku": "Minang"
        },
        "pekerjaanMahasiswa": [],
        "pesantren": {
          "PesantrenId": "",
          "NamaPesantren": "",
          "LamaPesantren": ""
        },
        "institusiLama": {
          "InstitusiLamaId": "",
          "Jenjang": Jenjang.SMA,
          "JenisInstitusi": "SMK",
          "NamaInstitusi": "MA Al Falah",
          "Jurusan": "IPA",
          "Nisn": "1351837496",
          "Npsn": "52848296",
          "TahunLulus": 2020,
          "NilaiLulusan": "62.00",
          "AlamatInstitusiLama": {
            "AlamatId": "",
            "Alamat": "Jl. Pendidikan No. 191",
            "KodePos": "35212",
            "DesaId": "d8f0852f-a2ee-4c4c-bcf4-7692d34036f3",
            "KecamatanId": "651b776b-743b-4222-9312-f3cd505f6858",
            "KabupatenId": "fd4a92fd-1a5f-4d56-a086-44061ba399a1",
            "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
            "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
          }
        }
      },
      {
        "programStudi": {
          "ProgramStudiId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "UniversityId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "NamaProgramStudi": "Teknik Kimia",
          "JenjangProgramStudi": Jenjang.S1,
          "AkreditasiProgramStudi": "A Sekali"
        },
        "alamat": {
          "AlamatId": "",
          "Alamat": "Jl. Contoh No. 53 RT 10/RW 2",
          "KodePos": "50123",
          "DesaId": "1ee02706-008a-4423-bc16-6c58da8afb96",
          "KecamatanId": "cf2ca8f1-ae10-4bf8-aa08-615ca012f9ce",
          "KabupatenId": "6cc90f81-b49c-42fa-96ec-d9d5180961a2",
          "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
          "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
        },
        "user": {
          "UserId": "",
          "Nama": "MTIUI007",
          "Email": "mtiui007@email.com",
          "TempatLahir": "Jakarta",
          "TanggalLahir": new Date("1987-02-03T00:00:00Z"),
          "JenisKelamin": JenisKelamin.PRIA,
          "PendidikanTerakhir": Jenjang.S1,
          "Agama": "Konghucu",
          "Telepon": "08827945951",
          "NomorWa": "08704972488",
          "NomorHp": "08582165147"
        },
        "pendaftaran": {
          "PendaftaranId": "",
          "MahasiswaId": "",
          "KodePendaftar": "RPL-2025E-0007",
          "NoUjian": "UJ-2025-00007",
          "Periode": "2025 Genap",
          "Gelombang": "Gelombang 2",
          "SistemKuliah": SistemKuliah.RPL,
          "JalurPendaftaran": "RPL Rekognisi"
        },
        "daftarUlang": {
          "DaftarUlangId": "",
          "Nim": "25000007",
          "JenjangKkniDituju": "8",
          "KipK": false,
          "Aktif": true,
          "MengisiBiodata": true,
          "Finalisasi": true,
          "TanggalDaftar": new Date("2025-11-21T00:00:00Z"),
          "TanggalDaftarUlang": new Date("2025-11-24T00:00:00Z")
        },
        "statusPerkawinan": StatusPerkawinan.Lajang,
        "orangTua": [],
        "informasiKependudukan": {
          "InformasiKependudukanId": "",
          "NoKk": "3174123514299214",
          "NoNik": "3174123406793058",
          "Suku": "Minang"
        },
        "pekerjaanMahasiswa": [],
        "pesantren": {
          "PesantrenId": "",
          "NamaPesantren": "",
          "LamaPesantren": ""
        },
        "institusiLama": {
          "InstitusiLamaId": "",
          "Jenjang": Jenjang.SMA,
          "JenisInstitusi": "MA",
          "NamaInstitusi": "SMA Negeri 1 Contoh",
          "Jurusan": "RPL",
          "Nisn": "8955852221",
          "Npsn": "24816832",
          "TahunLulus": 2007,
          "NilaiLulusan": "62.00",
          "AlamatInstitusiLama": {
            "AlamatId": "",
            "Alamat": "Jl. Pendidikan No. 55",
            "KodePos": "50123",
            "DesaId": "1ee02706-008a-4423-bc16-6c58da8afb96",
            "KecamatanId": "cf2ca8f1-ae10-4bf8-aa08-615ca012f9ce",
            "KabupatenId": "6cc90f81-b49c-42fa-96ec-d9d5180961a2",
            "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
            "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
          }
        }
      },
      {
        "programStudi": {
          "ProgramStudiId": "85b80451-9b83-4ce9-823c-8f2cfc34b4b5",
          "UniversityId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "NamaProgramStudi": "Teknik Informatika",
          "JenjangProgramStudi": Jenjang.S1,
          "AkreditasiProgramStudi": "A"
        },
        "alamat": {
          "AlamatId": "",
          "Alamat": "Jl. Contoh No. 59 RT 7/RW 8",
          "KodePos": "40111",
          "DesaId": "fd5560e5-89b1-4a22-a0ed-9602f2fe8da2",
          "KecamatanId": "e7401f54-b125-4795-9f4a-ded186365b49",
          "KabupatenId": "fd4a92fd-1a5f-4d56-a086-44061ba399a1",
          "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
          "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
        },
        "user": {
          "UserId": "",
          "Nama": "MTIUI008",
          "Email": "mtiui008@email.com",
          "TempatLahir": "Surabaya",
          "TanggalLahir": new Date("1998-10-01T00:00:00Z"),
          "JenisKelamin": JenisKelamin.PRIA,
          "PendidikanTerakhir": Jenjang.S1,
          "Agama": "Hindu",
          "Telepon": "08191709504",
          "NomorWa": "08608497651",
          "NomorHp": "08102245010"
        },
        "pendaftaran": {
          "PendaftaranId": "",
          "MahasiswaId": "",
          "KodePendaftar": "RPL-2025E-0008",
          "NoUjian": "UJ-2025-00008",
          "Periode": "2025 Genap",
          "Gelombang": "Gelombang 2",
          "SistemKuliah": SistemKuliah.RPL,
          "JalurPendaftaran": "RPL Pekerja"
        },
        "daftarUlang": {
          "DaftarUlangId": "",
          "Nim": "25000008",
          "JenjangKkniDituju": "8",
          "KipK": false,
          "Aktif": true,
          "MengisiBiodata": true,
          "Finalisasi": true,
          "TanggalDaftar": new Date("2025-11-05T00:00:00Z"),
          "TanggalDaftarUlang": new Date("2025-11-19T00:00:00Z")
        },
        "statusPerkawinan": StatusPerkawinan.Lajang,
        "orangTua": [],
        "informasiKependudukan": {
          "InformasiKependudukanId": "",
          "NoKk": "3174123877920928",
          "NoNik": "3174123945298662",
          "Suku": "Batak"
        },
        "pekerjaanMahasiswa": [],
        "pesantren": {
          "PesantrenId": "",
          "NamaPesantren": "",
          "LamaPesantren": ""
        },
        "institusiLama": {
          "InstitusiLamaId": "",
          "Jenjang": Jenjang.SMA,
          "JenisInstitusi": "SMA",
          "NamaInstitusi": "MA Al Falah",
          "Jurusan": "IPS",
          "Nisn": "5869200916",
          "Npsn": "18311409",
          "TahunLulus": 2015,
          "NilaiLulusan": "97.00",
          "AlamatInstitusiLama": {
            "AlamatId": "",
            "Alamat": "Jl. Pendidikan No. 41",
            "KodePos": "40111",
            "DesaId": "fd5560e5-89b1-4a22-a0ed-9602f2fe8da2",
            "KecamatanId": "e7401f54-b125-4795-9f4a-ded186365b49",
            "KabupatenId": "fd4a92fd-1a5f-4d56-a086-44061ba399a1",
            "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
            "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
          }
        }
      },
      {
        "programStudi": {
          "ProgramStudiId": "85b80451-9b83-4ce9-823c-8f2cfc34b4b5",
          "UniversityId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "NamaProgramStudi": "Teknik Informatika",
          "JenjangProgramStudi": Jenjang.S1,
          "AkreditasiProgramStudi": "A"
        },
        "alamat": {
          "AlamatId": "",
          "Alamat": "Jl. Contoh No. 115 RT 4/RW 2",
          "KodePos": "50123",
          "DesaId": "1ee02706-008a-4423-bc16-6c58da8afb96",
          "KecamatanId": "cf2ca8f1-ae10-4bf8-aa08-615ca012f9ce",
          "KabupatenId": "6cc90f81-b49c-42fa-96ec-d9d5180961a2",
          "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
          "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
        },
        "user": {
          "UserId": "",
          "Nama": "MTIUI009",
          "Email": "mtiui009@email.com",
          "TempatLahir": "Bandung",
          "TanggalLahir": new Date("1995-11-06T00:00:00Z"),
          "JenisKelamin": JenisKelamin.PRIA,
          "PendidikanTerakhir": Jenjang.S1,
          "Agama": "Konghucu",
          "Telepon": "08933014885",
          "NomorWa": "08387661982",
          "NomorHp": "08354523896"
        },
        "pendaftaran": {
          "PendaftaranId": "",
          "MahasiswaId": "",
          "KodePendaftar": "RPL-2025E-0009",
          "NoUjian": "UJ-2025-00009",
          "Periode": "2025 Genap",
          "Gelombang": "Gelombang 1",
          "SistemKuliah": SistemKuliah.RPL,
          "JalurPendaftaran": "RPL Rekognisi"
        },
        "daftarUlang": {
          "DaftarUlangId": "",
          "Nim": "25000009",
          "JenjangKkniDituju": "8",
          "KipK": false,
          "Aktif": false,
          "MengisiBiodata": true,
          "Finalisasi": false,
          "TanggalDaftar": new Date("2025-11-10T00:00:00Z"),
          "TanggalDaftarUlang": null
        },
        "statusPerkawinan": StatusPerkawinan.Lajang,
        "orangTua": [],
        "informasiKependudukan": {
          "InformasiKependudukanId": "",
          "NoKk": "3174123456534842",
          "NoNik": "3174123765125195",
          "Suku": "Lampung"
        },
        "pekerjaanMahasiswa": [],
        "pesantren": {
          "PesantrenId": "",
          "NamaPesantren": "",
          "LamaPesantren": ""
        },
        "institusiLama": {
          "InstitusiLamaId": "",
          "Jenjang": Jenjang.SMA,
          "JenisInstitusi": "SMK",
          "NamaInstitusi": "SMA Negeri 1 Contoh",
          "Jurusan": "RPL",
          "Nisn": "7108856496",
          "Npsn": "51601259",
          "TahunLulus": 2011,
          "NilaiLulusan": "84.00",
          "AlamatInstitusiLama": {
            "AlamatId": "",
            "Alamat": "Jl. Pendidikan No. 141",
            "KodePos": "50123",
            "DesaId": "1ee02706-008a-4423-bc16-6c58da8afb96",
            "KecamatanId": "cf2ca8f1-ae10-4bf8-aa08-615ca012f9ce",
            "KabupatenId": "6cc90f81-b49c-42fa-96ec-d9d5180961a2",
            "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
            "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
          }
        }
      },
      {
        "programStudi": {
          "ProgramStudiId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "UniversityId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "NamaProgramStudi": "Teknik Mesin",
          "JenjangProgramStudi": Jenjang.S1,
          "AkreditasiProgramStudi": "A"
        },
        "alamat": {
          "AlamatId": "",
          "Alamat": "Jl. Contoh No. 140 RT 9/RW 3",
          "KodePos": "50123",
          "DesaId": "1ee02706-008a-4423-bc16-6c58da8afb96",
          "KecamatanId": "cf2ca8f1-ae10-4bf8-aa08-615ca012f9ce",
          "KabupatenId": "6cc90f81-b49c-42fa-96ec-d9d5180961a2",
          "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
          "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
        },
        "user": {
          "UserId": "",
          "Nama": "MTIUI010",
          "Email": "mtiui010@email.com",
          "TempatLahir": "Medan",
          "TanggalLahir": new Date("1990-09-02T00:00:00Z"),
          "JenisKelamin": JenisKelamin.PRIA,
          "PendidikanTerakhir": Jenjang.S1,
          "Agama": "Islam",
          "Telepon": "08697461258",
          "NomorWa": "08308520611",
          "NomorHp": "08155683615"
        },
        "pendaftaran": {
          "PendaftaranId": "",
          "MahasiswaId": "",
          "KodePendaftar": "RPL-2025E-0010",
          "NoUjian": "UJ-2025-00010",
          "Periode": "2025 Genap",
          "Gelombang": "Gelombang 1",
          "SistemKuliah": SistemKuliah.RPL,
          "JalurPendaftaran": "RPL KIP-K"
        },
        "daftarUlang": {
          "DaftarUlangId": "",
          "Nim": "25000010",
          "JenjangKkniDituju": "8",
          "KipK": false,
          "Aktif": true,
          "MengisiBiodata": true,
          "Finalisasi": true,
          "TanggalDaftar": new Date("2025-11-18T00:00:00Z"),
          "TanggalDaftarUlang": new Date("2025-11-21T00:00:00Z")
        },
        "statusPerkawinan": StatusPerkawinan.Lajang,
        "orangTua": [],
        "informasiKependudukan": {
          "InformasiKependudukanId": "",
          "NoKk": "3174123807200191",
          "NoNik": "3174123480417463",
          "Suku": "Lampung"
        },
        "pekerjaanMahasiswa": [],
        "pesantren": {
          "PesantrenId": "",
          "NamaPesantren": "",
          "LamaPesantren": "1 tahun"
        },
        "institusiLama": {
          "InstitusiLamaId": "",
          "Jenjang": Jenjang.SMA,
          "JenisInstitusi": "SMA",
          "NamaInstitusi": "SMA Negeri 1 Contoh",
          "Jurusan": "Akuntansi",
          "Nisn": "6835213434",
          "Npsn": "12741988",
          "TahunLulus": 2006,
          "NilaiLulusan": "70.00",
          "AlamatInstitusiLama": {
            "AlamatId": "",
            "Alamat": "Jl. Pendidikan No. 112",
            "KodePos": "50123",
            "DesaId": "1ee02706-008a-4423-bc16-6c58da8afb96",
            "KecamatanId": "cf2ca8f1-ae10-4bf8-aa08-615ca012f9ce",
            "KabupatenId": "6cc90f81-b49c-42fa-96ec-d9d5180961a2",
            "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
            "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
          }
        }
      },
      {
        "programStudi": {
          "ProgramStudiId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "UniversityId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "NamaProgramStudi": "Teknik Elektro",
          "JenjangProgramStudi": Jenjang.S1,
          "AkreditasiProgramStudi": "A"
        },
        "alamat": {
          "AlamatId": "",
          "Alamat": "Jl. Contoh No. 109 RT 4/RW 5",
          "KodePos": "50123",
          "DesaId": "1ee02706-008a-4423-bc16-6c58da8afb96",
          "KecamatanId": "cf2ca8f1-ae10-4bf8-aa08-615ca012f9ce",
          "KabupatenId": "6cc90f81-b49c-42fa-96ec-d9d5180961a2",
          "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
          "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
        },
        "user": {
          "UserId": "",
          "Nama": "MTIUI011",
          "Email": "mtiui011@email.com",
          "TempatLahir": "Medan",
          "TanggalLahir": new Date("2000-04-24T00:00:00Z"),
          "JenisKelamin": JenisKelamin.PRIA,
          "PendidikanTerakhir": Jenjang.S1,
          "Agama": "Hindu",
          "Telepon": "08897080208",
          "NomorWa": "08485075814",
          "NomorHp": "08390321127"
        },
        "pendaftaran": {
          "PendaftaranId": "",
          "MahasiswaId": "",
          "KodePendaftar": "RPL-2025E-0011",
          "NoUjian": "UJ-2025-00011",
          "Periode": "2025 Genap",
          "Gelombang": "Gelombang 1",
          "SistemKuliah": SistemKuliah.RPL,
          "JalurPendaftaran": "RPL Rekognisi"
        },
        "daftarUlang": {
          "DaftarUlangId": "",
          "Nim": "25000011",
          "JenjangKkniDituju": "8",
          "KipK": false,
          "Aktif": true,
          "MengisiBiodata": true,
          "Finalisasi": true,
          "TanggalDaftar": new Date("2025-11-26T00:00:00Z"),
          "TanggalDaftarUlang": new Date("2025-12-03T00:00:00Z")
        },
        "statusPerkawinan": StatusPerkawinan.Lajang,
        "orangTua": [],
        "informasiKependudukan": {
          "InformasiKependudukanId": "",
          "NoKk": "3174123569756728",
          "NoNik": "3174123892970288",
          "Suku": "Batak"
        },
        "pekerjaanMahasiswa": [],
        "pesantren": {
          "PesantrenId": "",
          "NamaPesantren": "",
          "LamaPesantren": "1 tahun"
        },
        "institusiLama": {
          "InstitusiLamaId": "",
          "Jenjang": Jenjang.SMA,
          "JenisInstitusi": "SMA",
          "NamaInstitusi": "MA Al Falah",
          "Jurusan": "TKJ",
          "Nisn": "9645844475",
          "Npsn": "31801261",
          "TahunLulus": 2020,
          "NilaiLulusan": "73.00",
          "AlamatInstitusiLama": {
            "AlamatId": "",
            "Alamat": "Jl. Pendidikan No. 8",
            "KodePos": "50123",
            "DesaId": "1ee02706-008a-4423-bc16-6c58da8afb96",
            "KecamatanId": "cf2ca8f1-ae10-4bf8-aa08-615ca012f9ce",
            "KabupatenId": "6cc90f81-b49c-42fa-96ec-d9d5180961a2",
            "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
            "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
          }
        }
      },
      {
        "programStudi": {
          "ProgramStudiId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "UniversityId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "NamaProgramStudi": "Teknik Mesin",
          "JenjangProgramStudi": Jenjang.S1,
          "AkreditasiProgramStudi": "A"
        },
        "alamat": {
          "AlamatId": "",
          "Alamat": "Jl. Contoh No. 52 RT 6/RW 8",
          "KodePos": "40111",
          "DesaId": "fd5560e5-89b1-4a22-a0ed-9602f2fe8da2",
          "KecamatanId": "e7401f54-b125-4795-9f4a-ded186365b49",
          "KabupatenId": "fd4a92fd-1a5f-4d56-a086-44061ba399a1",
          "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
          "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
        },
        "user": {
          "UserId": "",
          "Nama": "MTIUI012",
          "Email": "mtiui012@email.com",
          "TempatLahir": "Bandung",
          "TanggalLahir": new Date("1993-02-16T00:00:00Z"),
          "JenisKelamin": JenisKelamin.PRIA,
          "PendidikanTerakhir": Jenjang.S1,
          "Agama": "Hindu",
          "Telepon": "08324347694",
          "NomorWa": "08262519094",
          "NomorHp": "08853636189"
        },
        "pendaftaran": {
          "PendaftaranId": "",
          "MahasiswaId": "",
          "KodePendaftar": "RPL-2025E-0012",
          "NoUjian": "UJ-2025-00012",
          "Periode": "2025 Genap",
          "Gelombang": "Gelombang 2",
          "SistemKuliah": SistemKuliah.RPL,
          "JalurPendaftaran": "RPL KIP-K"
        },
        "daftarUlang": {
          "DaftarUlangId": "",
          "Nim": "25000012",
          "JenjangKkniDituju": "8",
          "KipK": false,
          "Aktif": true,
          "MengisiBiodata": true,
          "Finalisasi": true,
          "TanggalDaftar": new Date("2025-11-09T00:00:00Z"),
          "TanggalDaftarUlang": new Date("2025-11-15T00:00:00Z")
        },
        "statusPerkawinan": StatusPerkawinan.Lajang,
        "orangTua": [],
        "informasiKependudukan": {
          "InformasiKependudukanId": "",
          "NoKk": "3174123486851667",
          "NoNik": "3174123809452870",
          "Suku": "Minang"
        },
        "pekerjaanMahasiswa": [],
        "pesantren": {
          "PesantrenId": "",
          "NamaPesantren": "",
          "LamaPesantren": ""
        },
        "institusiLama": {
          "InstitusiLamaId": "",
          "Jenjang": Jenjang.SMA,
          "JenisInstitusi": "SMK",
          "NamaInstitusi": "SMA Negeri 1 Contoh",
          "Jurusan": "TKJ",
          "Nisn": "4648751372",
          "Npsn": "69768078",
          "TahunLulus": 2011,
          "NilaiLulusan": "76.00",
          "AlamatInstitusiLama": {
            "AlamatId": "",
            "Alamat": "Jl. Pendidikan No. 78",
            "KodePos": "40111",
            "DesaId": "fd5560e5-89b1-4a22-a0ed-9602f2fe8da2",
            "KecamatanId": "e7401f54-b125-4795-9f4a-ded186365b49",
            "KabupatenId": "fd4a92fd-1a5f-4d56-a086-44061ba399a1",
            "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
            "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
          }
        }
      },
      {
        "programStudi": {
          "ProgramStudiId": "85b80451-9b83-4ce9-823c-8f2cfc34b4b5",
          "UniversityId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "NamaProgramStudi": "Teknik Informatika",
          "JenjangProgramStudi": Jenjang.S1,
          "AkreditasiProgramStudi": "A"
        },
        "alamat": {
          "AlamatId": "",
          "Alamat": "Jl. Contoh No. 109 RT 5/RW 8",
          "KodePos": "35212",
          "DesaId": "d8f0852f-a2ee-4c4c-bcf4-7692d34036f3",
          "KecamatanId": "651b776b-743b-4222-9312-f3cd505f6858",
          "KabupatenId": "fd4a92fd-1a5f-4d56-a086-44061ba399a1",
          "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
          "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
        },
        "user": {
          "UserId": "",
          "Nama": "MTIUI013",
          "Email": "mtiui013@email.com",
          "TempatLahir": "Medan",
          "TanggalLahir": new Date("1993-01-07T00:00:00Z"),
          "JenisKelamin": JenisKelamin.PRIA,
          "PendidikanTerakhir": Jenjang.S1,
          "Agama": "Kristen",
          "Telepon": "08775925359",
          "NomorWa": "08353573394",
          "NomorHp": "08977776324"
        },
        "pendaftaran": {
          "PendaftaranId": "",
          "MahasiswaId": "",
          "KodePendaftar": "RPL-2025E-0013",
          "NoUjian": "UJ-2025-00013",
          "Periode": "2025 Genap",
          "Gelombang": "Gelombang 1",
          "SistemKuliah": SistemKuliah.RPL,
          "JalurPendaftaran": "RPL Rekognisi"
        },
        "daftarUlang": {
          "DaftarUlangId": "",
          "Nim": "25000013",
          "JenjangKkniDituju": "8",
          "KipK": false,
          "Aktif": true,
          "MengisiBiodata": true,
          "Finalisasi": true,
          "TanggalDaftar": new Date("2025-11-09T00:00:00Z"),
          "TanggalDaftarUlang": new Date("2025-11-21T00:00:00Z")
        },
        "statusPerkawinan": StatusPerkawinan.Lajang,
        "orangTua": [],
        "informasiKependudukan": {
          "InformasiKependudukanId": "",
          "NoKk": "3174123993255981",
          "NoNik": "3174123679567229",
          "Suku": "Lampung"
        },
        "pekerjaanMahasiswa": [],
        "pesantren": {
          "PesantrenId": "",
          "NamaPesantren": "",
          "LamaPesantren": ""
        },
        "institusiLama": {
          "InstitusiLamaId": "",
          "Jenjang": Jenjang.SMA,
          "JenisInstitusi": "SMK",
          "NamaInstitusi": "SMA Negeri 1 Contoh",
          "Jurusan": "Akuntansi",
          "Nisn": "4886325733",
          "Npsn": "46602305",
          "TahunLulus": 2013,
          "NilaiLulusan": "90.00",
          "AlamatInstitusiLama": {
            "AlamatId": "",
            "Alamat": "Jl. Pendidikan No. 105",
            "KodePos": "35212",
            "DesaId": "d8f0852f-a2ee-4c4c-bcf4-7692d34036f3",
            "KecamatanId": "651b776b-743b-4222-9312-f3cd505f6858",
            "KabupatenId": "fd4a92fd-1a5f-4d56-a086-44061ba399a1",
            "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
            "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
          }
        }
      },
      {
        "programStudi": {
          "ProgramStudiId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "UniversityId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "NamaProgramStudi": "Teknik Elektro",
          "JenjangProgramStudi": Jenjang.S1,
          "AkreditasiProgramStudi": "A Sekali"
        },
        "alamat": {
          "AlamatId": "",
          "Alamat": "Jl. Contoh No. 183 RT 10/RW 5",
          "KodePos": "35212",
          "DesaId": "d8f0852f-a2ee-4c4c-bcf4-7692d34036f3",
          "KecamatanId": "651b776b-743b-4222-9312-f3cd505f6858",
          "KabupatenId": "fd4a92fd-1a5f-4d56-a086-44061ba399a1",
          "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
          "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
        },
        "user": {
          "UserId": "",
          "Nama": "MTIUI014",
          "Email": "mtiui014@email.com",
          "TempatLahir": "Medan",
          "TanggalLahir": new Date("2005-11-15T00:00:00Z"),
          "JenisKelamin": JenisKelamin.PRIA,
          "PendidikanTerakhir": Jenjang.S1,
          "Agama": "Konghucu",
          "Telepon": "08757402430",
          "NomorWa": "08365704571",
          "NomorHp": "08770100429"
        },
        "pendaftaran": {
          "PendaftaranId": "",
          "MahasiswaId": "",
          "KodePendaftar": "RPL-2025E-0014",
          "NoUjian": "UJ-2025-00014",
          "Periode": "2025 Genap",
          "Gelombang": "Gelombang 3",
          "SistemKuliah": SistemKuliah.RPL,
          "JalurPendaftaran": "RPL Pekerja"
        },
        "daftarUlang": {
          "DaftarUlangId": "",
          "Nim": "25000014",
          "JenjangKkniDituju": "8",
          "KipK": false,
          "Aktif": true,
          "MengisiBiodata": true,
          "Finalisasi": true,
          "TanggalDaftar": new Date("2025-11-03T00:00:00Z"),
          "TanggalDaftarUlang": new Date("2025-11-14T00:00:00Z")
        },
        "statusPerkawinan": StatusPerkawinan.Lajang,
        "orangTua": [],
        "informasiKependudukan": {
          "InformasiKependudukanId": "",
          "NoKk": "3174123269648508",
          "NoNik": "3174123309225968",
          "Suku": "Lampung"
        },
        "pekerjaanMahasiswa": [],
        "pesantren": {
          "PesantrenId": "",
          "NamaPesantren": "",
          "LamaPesantren": ""
        },
        "institusiLama": {
          "InstitusiLamaId": "",
          "Jenjang": Jenjang.SMA,
          "JenisInstitusi": "SMA",
          "NamaInstitusi": "SMK Negeri 2 Contoh",
          "Jurusan": "Akuntansi",
          "Nisn": "8655658224",
          "Npsn": "21507804",
          "TahunLulus": 2023,
          "NilaiLulusan": "85.00",
          "AlamatInstitusiLama": {
            "AlamatId": "",
            "Alamat": "Jl. Pendidikan No. 19",
            "KodePos": "35212",
            "DesaId": "d8f0852f-a2ee-4c4c-bcf4-7692d34036f3",
            "KecamatanId": "651b776b-743b-4222-9312-f3cd505f6858",
            "KabupatenId": "fd4a92fd-1a5f-4d56-a086-44061ba399a1",
            "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
            "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
          }
        }
      },
      {
        "programStudi": {
          "ProgramStudiId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "UniversityId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "NamaProgramStudi": "Teknik Elektro",
          "JenjangProgramStudi": Jenjang.S1,
          "AkreditasiProgramStudi": "A"
        },
        "alamat": {
          "AlamatId": "",
          "Alamat": "Jl. Contoh No. 87 RT 2/RW 1",
          "KodePos": "35212",
          "DesaId": "d8f0852f-a2ee-4c4c-bcf4-7692d34036f3",
          "KecamatanId": "651b776b-743b-4222-9312-f3cd505f6858",
          "KabupatenId": "fd4a92fd-1a5f-4d56-a086-44061ba399a1",
          "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
          "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
        },
        "user": {
          "UserId": "",
          "Nama": "MTIUI015",
          "Email": "mtiui015@email.com",
          "TempatLahir": "Lampung",
          "TanggalLahir": new Date("1993-03-13T00:00:00Z"),
          "JenisKelamin": JenisKelamin.PRIA,
          "PendidikanTerakhir": Jenjang.S1,
          "Agama": "Islam",
          "Telepon": "08849010863",
          "NomorWa": "08961052785",
          "NomorHp": "08896730623"
        },
        "pendaftaran": {
          "PendaftaranId": "",
          "MahasiswaId": "",
          "KodePendaftar": "RPL-2025E-0015",
          "NoUjian": "UJ-2025-00015",
          "Periode": "2025 Genap",
          "Gelombang": "Gelombang 1",
          "SistemKuliah": SistemKuliah.RPL,
          "JalurPendaftaran": "RPL Rekognisi"
        },
        "daftarUlang": {
          "DaftarUlangId": "",
          "Nim": "25000015",
          "JenjangKkniDituju": "8",
          "KipK": false,
          "Aktif": true,
          "MengisiBiodata": true,
          "Finalisasi": true,
          "TanggalDaftar": new Date("2025-11-23T00:00:00Z"),
          "TanggalDaftarUlang": new Date("2025-11-26T00:00:00Z")
        },
        "statusPerkawinan": StatusPerkawinan.Lajang,
        "orangTua": [],
        "informasiKependudukan": {
          "InformasiKependudukanId": "",
          "NoKk": "3174123334686883",
          "NoNik": "3174123121785521",
          "Suku": "Batak"
        },
        "pekerjaanMahasiswa": [],
        "pesantren": {
          "PesantrenId": "",
          "NamaPesantren": "",
          "LamaPesantren": "3 tahun"
        },
        "institusiLama": {
          "InstitusiLamaId": "",
          "Jenjang": Jenjang.SMA,
          "JenisInstitusi": "SMA",
          "NamaInstitusi": "MA Al Falah",
          "Jurusan": "TKJ",
          "Nisn": "6059599176",
          "Npsn": "90610969",
          "TahunLulus": 2013,
          "NilaiLulusan": "80.00",
          "AlamatInstitusiLama": {
            "AlamatId": "",
            "Alamat": "Jl. Pendidikan No. 132",
            "KodePos": "35212",
            "DesaId": "d8f0852f-a2ee-4c4c-bcf4-7692d34036f3",
            "KecamatanId": "651b776b-743b-4222-9312-f3cd505f6858",
            "KabupatenId": "fd4a92fd-1a5f-4d56-a086-44061ba399a1",
            "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
            "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
          }
        }
      },
      {
        "programStudi": {
          "ProgramStudiId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "UniversityId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "NamaProgramStudi": "Teknik Elektro",
          "JenjangProgramStudi": Jenjang.S1,
          "AkreditasiProgramStudi": "A"
        },
        "alamat": {
          "AlamatId": "",
          "Alamat": "Jl. Contoh No. 178 RT 3/RW 1",
          "KodePos": "40111",
          "DesaId": "fd5560e5-89b1-4a22-a0ed-9602f2fe8da2",
          "KecamatanId": "e7401f54-b125-4795-9f4a-ded186365b49",
          "KabupatenId": "fd4a92fd-1a5f-4d56-a086-44061ba399a1",
          "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
          "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
        },
        "user": {
          "UserId": "",
          "Nama": "MTIUI016",
          "Email": "mtiui016@email.com",
          "TempatLahir": "Medan",
          "TanggalLahir": new Date("1994-03-09T00:00:00Z"),
          "JenisKelamin": JenisKelamin.PRIA,
          "PendidikanTerakhir": Jenjang.S1,
          "Agama": "Konghucu",
          "Telepon": "08712027496",
          "NomorWa": "08355013807",
          "NomorHp": "08144427387"
        },
        "pendaftaran": {
          "PendaftaranId": "",
          "MahasiswaId": "",
          "KodePendaftar": "RPL-2025E-0016",
          "NoUjian": "UJ-2025-00016",
          "Periode": "2025 Genap",
          "Gelombang": "Gelombang 1",
          "SistemKuliah": SistemKuliah.RPL,
          "JalurPendaftaran": "RPL Pekerja"
        },
        "daftarUlang": {
          "DaftarUlangId": "",
          "Nim": "25000016",
          "JenjangKkniDituju": "8",
          "KipK": false,
          "Aktif": true,
          "MengisiBiodata": true,
          "Finalisasi": true,
          "TanggalDaftar": new Date("2025-11-05T00:00:00Z"),
          "TanggalDaftarUlang": new Date("2025-11-09T00:00:00Z")
        },
        "statusPerkawinan": StatusPerkawinan.Lajang,
        "orangTua": [],
        "informasiKependudukan": {
          "InformasiKependudukanId": "",
          "NoKk": "3174123433596498",
          "NoNik": "3174123357441551",
          "Suku": "Sunda"
        },
        "pekerjaanMahasiswa": [],
        "pesantren": {
          "PesantrenId": "",
          "NamaPesantren": "",
          "LamaPesantren": ""
        },
        "institusiLama": {
          "InstitusiLamaId": "",
          "Jenjang": Jenjang.SMA,
          "JenisInstitusi": "SMK",
          "NamaInstitusi": "MA Al Falah",
          "Jurusan": "IPA",
          "Nisn": "9325659210",
          "Npsn": "64374421",
          "TahunLulus": 2010,
          "NilaiLulusan": "86.00",
          "AlamatInstitusiLama": {
            "AlamatId": "",
            "Alamat": "Jl. Pendidikan No. 77",
            "KodePos": "40111",
            "DesaId": "fd5560e5-89b1-4a22-a0ed-9602f2fe8da2",
            "KecamatanId": "e7401f54-b125-4795-9f4a-ded186365b49",
            "KabupatenId": "fd4a92fd-1a5f-4d56-a086-44061ba399a1",
            "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
            "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
          }
        }
      },
      {
        "programStudi": {
          "ProgramStudiId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "UniversityId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "NamaProgramStudi": "Teknik Elektro",
          "JenjangProgramStudi": Jenjang.S1,
          "AkreditasiProgramStudi": "A Sekali"
        },
        "alamat": {
          "AlamatId": "",
          "Alamat": "Jl. Contoh No. 199 RT 7/RW 4",
          "KodePos": "40222",
          "DesaId": "4bac6f1b-3192-4921-baf6-b866813b1c53",
          "KecamatanId": "cd19bff1-38f9-45f2-b7f9-e8aa5a49b191",
          "KabupatenId": "9f47fe17-f67b-4c26-90e8-fe03d10ced20",
          "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
          "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
        },
        "user": {
          "UserId": "",
          "Nama": "MTIUI017",
          "Email": "mtiui017@email.com",
          "TempatLahir": "Jakarta",
          "TanggalLahir": new Date("2003-03-05T00:00:00Z"),
          "JenisKelamin": JenisKelamin.PRIA,
          "PendidikanTerakhir": Jenjang.S1,
          "Agama": "Islam",
          "Telepon": "08154232635",
          "NomorWa": "08952489677",
          "NomorHp": "08974086812"
        },
        "pendaftaran": {
          "PendaftaranId": "",
          "MahasiswaId": "",
          "KodePendaftar": "RPL-2025E-0017",
          "NoUjian": "UJ-2025-00017",
          "Periode": "2025 Genap",
          "Gelombang": "Gelombang 2",
          "SistemKuliah": SistemKuliah.RPL,
          "JalurPendaftaran": "RPL Rekognisi"
        },
        "daftarUlang": {
          "DaftarUlangId": "",
          "Nim": "25000017",
          "JenjangKkniDituju": "8",
          "KipK": false,
          "Aktif": true,
          "MengisiBiodata": true,
          "Finalisasi": true,
          "TanggalDaftar": new Date("2025-11-13T00:00:00Z"),
          "TanggalDaftarUlang": new Date("2025-11-27T00:00:00Z")
        },
        "statusPerkawinan": StatusPerkawinan.Lajang,
        "orangTua": [],
        "informasiKependudukan": {
          "InformasiKependudukanId": "",
          "NoKk": "3174123908302516",
          "NoNik": "3174123730870920",
          "Suku": "Sunda"
        },
        "pekerjaanMahasiswa": [],
        "pesantren": {
          "PesantrenId": "",
          "NamaPesantren": "",
          "LamaPesantren": ""
        },
        "institusiLama": {
          "InstitusiLamaId": "",
          "Jenjang": Jenjang.SMA,
          "JenisInstitusi": "MA",
          "NamaInstitusi": "SMA Negeri 1 Contoh",
          "Jurusan": "IPS",
          "Nisn": "1043955127",
          "Npsn": "47595941",
          "TahunLulus": 2022,
          "NilaiLulusan": "88.00",
          "AlamatInstitusiLama": {
            "AlamatId": "",
            "Alamat": "Jl. Pendidikan No. 75",
            "KodePos": "40222",
            "DesaId": "4bac6f1b-3192-4921-baf6-b866813b1c53",
            "KecamatanId": "cd19bff1-38f9-45f2-b7f9-e8aa5a49b191",
            "KabupatenId": "9f47fe17-f67b-4c26-90e8-fe03d10ced20",
            "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
            "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
          }
        }
      },
      {
        "programStudi": {
          "ProgramStudiId": "85b80451-9b83-4ce9-823c-8f2cfc34b4b5",
          "UniversityId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "NamaProgramStudi": "Teknik Informatika",
          "JenjangProgramStudi": Jenjang.S1,
          "AkreditasiProgramStudi": "A"
        },
        "alamat": {
          "AlamatId": "",
          "Alamat": "Jl. Contoh No. 54 RT 6/RW 9",
          "KodePos": "40222",
          "DesaId": "4bac6f1b-3192-4921-baf6-b866813b1c53",
          "KecamatanId": "cd19bff1-38f9-45f2-b7f9-e8aa5a49b191",
          "KabupatenId": "9f47fe17-f67b-4c26-90e8-fe03d10ced20",
          "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
          "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
        },
        "user": {
          "UserId": "",
          "Nama": "MTIUI018",
          "Email": "mtiui018@email.com",
          "TempatLahir": "Medan",
          "TanggalLahir": new Date("2000-09-22T00:00:00Z"),
          "JenisKelamin": JenisKelamin.PRIA,
          "PendidikanTerakhir": Jenjang.S1,
          "Agama": "Katolik",
          "Telepon": "08263595255",
          "NomorWa": "08347878107",
          "NomorHp": "08213253585"
        },
        "pendaftaran": {
          "PendaftaranId": "",
          "MahasiswaId": "",
          "KodePendaftar": "RPL-2025E-0018",
          "NoUjian": "UJ-2025-00018",
          "Periode": "2025 Genap",
          "Gelombang": "Gelombang 2",
          "SistemKuliah": SistemKuliah.RPL,
          "JalurPendaftaran": "RPL Rekognisi"
        },
        "daftarUlang": {
          "DaftarUlangId": "",
          "Nim": "25000018",
          "JenjangKkniDituju": "8",
          "KipK": false,
          "Aktif": true,
          "MengisiBiodata": true,
          "Finalisasi": true,
          "TanggalDaftar": new Date("2025-11-05T00:00:00Z"),
          "TanggalDaftarUlang": new Date("2025-11-08T00:00:00Z")
        },
        "statusPerkawinan": StatusPerkawinan.Lajang,
        "orangTua": [],
        "informasiKependudukan": {
          "InformasiKependudukanId": "",
          "NoKk": "3174123774388894",
          "NoNik": "3174123234979069",
          "Suku": "Batak"
        },
        "pekerjaanMahasiswa": [],
        "pesantren": {
          "PesantrenId": "",
          "NamaPesantren": "",
          "LamaPesantren": ""
        },
        "institusiLama": {
          "InstitusiLamaId": "",
          "Jenjang": Jenjang.SMA,
          "JenisInstitusi": "MA",
          "NamaInstitusi": "SMK Negeri 2 Contoh",
          "Jurusan": "IPS",
          "Nisn": "4034898027",
          "Npsn": "87865666",
          "TahunLulus": 2020,
          "NilaiLulusan": "60.00",
          "AlamatInstitusiLama": {
            "AlamatId": "",
            "Alamat": "Jl. Pendidikan No. 177",
            "KodePos": "40222",
            "DesaId": "4bac6f1b-3192-4921-baf6-b866813b1c53",
            "KecamatanId": "cd19bff1-38f9-45f2-b7f9-e8aa5a49b191",
            "KabupatenId": "9f47fe17-f67b-4c26-90e8-fe03d10ced20",
            "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
            "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
          }
        }
      },
      {
        "programStudi": {
          "ProgramStudiId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "UniversityId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "NamaProgramStudi": "Teknik Kimia",
          "JenjangProgramStudi": Jenjang.S1,
          "AkreditasiProgramStudi": "A Sekali"
        },
        "alamat": {
          "AlamatId": "",
          "Alamat": "Jl. Contoh No. 128 RT 9/RW 3",
          "KodePos": "40222",
          "DesaId": "4bac6f1b-3192-4921-baf6-b866813b1c53",
          "KecamatanId": "cd19bff1-38f9-45f2-b7f9-e8aa5a49b191",
          "KabupatenId": "9f47fe17-f67b-4c26-90e8-fe03d10ced20",
          "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
          "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
        },
        "user": {
          "UserId": "",
          "Nama": "MTIUI0019",
          "Email": "mtiui019@email.com",
          "TempatLahir": "Jakarta",
          "TanggalLahir": new Date("1987-02-15T00:00:00Z"),
          "JenisKelamin": JenisKelamin.PRIA,
          "PendidikanTerakhir": Jenjang.S1,
          "Agama": "Konghucu",
          "Telepon": "08803567172",
          "NomorWa": "08345832035",
          "NomorHp": "08314986742"
        },
        "pendaftaran": {
          "PendaftaranId": "",
          "MahasiswaId": "",
          "KodePendaftar": "RPL-2025E-0019",
          "NoUjian": "UJ-2025-00019",
          "Periode": "2025 Genap",
          "Gelombang": "Gelombang 3",
          "SistemKuliah": SistemKuliah.RPL,
          "JalurPendaftaran": "RPL KIP-K"
        },
        "daftarUlang": {
          "DaftarUlangId": "",
          "Nim": "25000019",
          "JenjangKkniDituju": "8",
          "KipK": true,
          "Aktif": true,
          "MengisiBiodata": true,
          "Finalisasi": false,
          "TanggalDaftar": new Date("2025-11-19T00:00:00Z"),
          "TanggalDaftarUlang": new Date("2025-11-25T00:00:00Z")
        },
        "statusPerkawinan": StatusPerkawinan.Lajang,
        "orangTua": [],
        "informasiKependudukan": {
          "InformasiKependudukanId": "",
          "NoKk": "3174123221475259",
          "NoNik": "3174123500087452",
          "Suku": "Batak"
        },
        "pekerjaanMahasiswa": [],
        "pesantren": {
          "PesantrenId": "",
          "NamaPesantren": "",
          "LamaPesantren": "4 tahun"
        },
        "institusiLama": {
          "InstitusiLamaId": "",
          "Jenjang": Jenjang.SMA,
          "JenisInstitusi": "SMK",
          "NamaInstitusi": "SMA Negeri 1 Contoh",
          "Jurusan": "TKJ",
          "Nisn": "9595447326",
          "Npsn": "36033349",
          "TahunLulus": 2006,
          "NilaiLulusan": "89.00",
          "AlamatInstitusiLama": {
            "AlamatId": "",
            "Alamat": "Jl. Pendidikan No. 18",
            "KodePos": "40222",
            "DesaId": "4bac6f1b-3192-4921-baf6-b866813b1c53",
            "KecamatanId": "cd19bff1-38f9-45f2-b7f9-e8aa5a49b191",
            "KabupatenId": "9f47fe17-f67b-4c26-90e8-fe03d10ced20",
            "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
            "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
          }
        }
      },
      {
        "programStudi": {
          "ProgramStudiId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "UniversityId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "NamaProgramStudi": "Teknik Kimia",
          "JenjangProgramStudi": Jenjang.S1,
          "AkreditasiProgramStudi": "A"
        },
        "alamat": {
          "AlamatId": "",
          "Alamat": "Jl. Contoh No. 176 RT 4/RW 2",
          "KodePos": "40222",
          "DesaId": "4bac6f1b-3192-4921-baf6-b866813b1c53",
          "KecamatanId": "cd19bff1-38f9-45f2-b7f9-e8aa5a49b191",
          "KabupatenId": "9f47fe17-f67b-4c26-90e8-fe03d10ced20",
          "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
          "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
        },
        "user": {
          "UserId": "",
          "Nama": "MTIUI020",
          "Email": "mtiui020@email.com",
          "TempatLahir": "Surabaya",
          "TanggalLahir": new Date("1998-10-15T00:00:00Z"),
          "JenisKelamin": JenisKelamin.PRIA,
          "PendidikanTerakhir": Jenjang.S1,
          "Agama": "Katolik",
          "Telepon": "08217912015",
          "NomorWa": "08924739532",
          "NomorHp": "08337931017"
        },
        "pendaftaran": {
          "PendaftaranId": "",
          "MahasiswaId": "",
          "KodePendaftar": "RPL-2025E-0020",
          "NoUjian": "UJ-2025-00020",
          "Periode": "2025 Genap",
          "Gelombang": "Gelombang 3",
          "SistemKuliah": SistemKuliah.RPL,
          "JalurPendaftaran": "RPL KIP-K"
        },
        "daftarUlang": {
          "DaftarUlangId": "",
          "Nim": "25000020",
          "JenjangKkniDituju": "8",
          "KipK": false,
          "Aktif": true,
          "MengisiBiodata": false,
          "Finalisasi": true,
          "TanggalDaftar": new Date("2025-11-06T00:00:00Z"),
          "TanggalDaftarUlang": new Date("2025-11-17T00:00:00Z")
        },
        "statusPerkawinan": StatusPerkawinan.Lajang,
        "orangTua": [],
        "informasiKependudukan": {
          "InformasiKependudukanId": "",
          "NoKk": "3174123344183791",
          "NoNik": "3174123629101124",
          "Suku": "Batak"
        },
        "pekerjaanMahasiswa": [],
        "pesantren": {
          "PesantrenId": "",
          "NamaPesantren": "",
          "LamaPesantren": "5 tahun"
        },
        "institusiLama": {
          "InstitusiLamaId": "",
          "Jenjang": Jenjang.SMA,
          "JenisInstitusi": "SMA",
          "NamaInstitusi": "MA Al Falah",
          "Jurusan": "IPA",
          "Nisn": "1057315990",
          "Npsn": "30673403",
          "TahunLulus": 2015,
          "NilaiLulusan": "87.00",
          "AlamatInstitusiLama": {
            "AlamatId": "",
            "Alamat": "Jl. Pendidikan No. 53",
            "KodePos": "40222",
            "DesaId": "4bac6f1b-3192-4921-baf6-b866813b1c53",
            "KecamatanId": "cd19bff1-38f9-45f2-b7f9-e8aa5a49b191",
            "KabupatenId": "9f47fe17-f67b-4c26-90e8-fe03d10ced20",
            "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
            "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
          }
        }
      },
      {
        "programStudi": {
          "ProgramStudiId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "UniversityId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "NamaProgramStudi": "Teknik Mesin",
          "JenjangProgramStudi": Jenjang.S1,
          "AkreditasiProgramStudi": "A"
        },
        "alamat": {
          "AlamatId": "",
          "Alamat": "Jl. Contoh No. 30 RT 6/RW 2",
          "KodePos": "40111",
          "DesaId": "fd5560e5-89b1-4a22-a0ed-9602f2fe8da2",
          "KecamatanId": "e7401f54-b125-4795-9f4a-ded186365b49",
          "KabupatenId": "fd4a92fd-1a5f-4d56-a086-44061ba399a1",
          "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
          "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
        },
        "user": {
          "UserId": "",
          "Nama": "MTIUI021",
          "Email": "mtiui021@email.com",
          "TempatLahir": "Bandung",
          "TanggalLahir": new Date("1994-10-28T00:00:00Z"),
          "JenisKelamin": JenisKelamin.PRIA,
          "PendidikanTerakhir": Jenjang.S1,
          "Agama": "Kristen",
          "Telepon": "08895390084",
          "NomorWa": "08524141989",
          "NomorHp": "08305967942"
        },
        "pendaftaran": {
          "PendaftaranId": "",
          "MahasiswaId": "",
          "KodePendaftar": "RPL-2025E-0021",
          "NoUjian": "UJ-2025-00021",
          "Periode": "2025 Genap",
          "Gelombang": "Gelombang 3",
          "SistemKuliah": SistemKuliah.RPL,
          "JalurPendaftaran": "RPL Rekognisi"
        },
        "daftarUlang": {
          "DaftarUlangId": "",
          "Nim": "25000021",
          "JenjangKkniDituju": "8",
          "KipK": false,
          "Aktif": true,
          "MengisiBiodata": true,
          "Finalisasi": true,
          "TanggalDaftar": new Date("2025-11-16T00:00:00Z"),
          "TanggalDaftarUlang": new Date("2025-11-24T00:00:00Z")
        },
        "statusPerkawinan": StatusPerkawinan.Lajang,
        "orangTua": [],
        "informasiKependudukan": {
          "InformasiKependudukanId": "",
          "NoKk": "3174123648563085",
          "NoNik": "3174123794421955",
          "Suku": "Lampung"
        },
        "pekerjaanMahasiswa": [],
        "pesantren": {
          "PesantrenId": "",
          "NamaPesantren": "",
          "LamaPesantren": ""
        },
        "institusiLama": {
          "InstitusiLamaId": "",
          "Jenjang": Jenjang.SMA,
          "JenisInstitusi": "SMA",
          "NamaInstitusi": "MA Al Falah",
          "Jurusan": "IPA",
          "Nisn": "5581052487",
          "Npsn": "24097888",
          "TahunLulus": 2012,
          "NilaiLulusan": "92.00",
          "AlamatInstitusiLama": {
            "AlamatId": "",
            "Alamat": "Jl. Pendidikan No. 86",
            "KodePos": "40111",
            "DesaId": "fd5560e5-89b1-4a22-a0ed-9602f2fe8da2",
            "KecamatanId": "e7401f54-b125-4795-9f4a-ded186365b49",
            "KabupatenId": "fd4a92fd-1a5f-4d56-a086-44061ba399a1",
            "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
            "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
          }
        }
      },
      {
        "programStudi": {
          "ProgramStudiId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "UniversityId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "NamaProgramStudi": "Teknik Kimia",
          "JenjangProgramStudi": Jenjang.S1,
          "AkreditasiProgramStudi": "A"
        },
        "alamat": {
          "AlamatId": "",
          "Alamat": "Jl. Contoh No. 171 RT 8/RW 8",
          "KodePos": "50123",
          "DesaId": "1ee02706-008a-4423-bc16-6c58da8afb96",
          "KecamatanId": "cf2ca8f1-ae10-4bf8-aa08-615ca012f9ce",
          "KabupatenId": "6cc90f81-b49c-42fa-96ec-d9d5180961a2",
          "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
          "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
        },
        "user": {
          "UserId": "",
          "Nama": "MTIUI023",
          "Email": "mtiui023@email.com",
          "TempatLahir": "Medan",
          "TanggalLahir": new Date("1997-04-08T00:00:00Z"),
          "JenisKelamin": JenisKelamin.PRIA,
          "PendidikanTerakhir": Jenjang.S1,
          "Agama": "Buddha",
          "Telepon": "08238335274",
          "NomorWa": "08530723559",
          "NomorHp": "08898925067"
        },
        "pendaftaran": {
          "PendaftaranId": "",
          "MahasiswaId": "",
          "KodePendaftar": "RPL-2025E-0022",
          "NoUjian": "UJ-2025-00022",
          "Periode": "2025 Genap",
          "Gelombang": "Gelombang 1",
          "SistemKuliah": SistemKuliah.RPL,
          "JalurPendaftaran": "RPL KIP-K"
        },
        "daftarUlang": {
          "DaftarUlangId": "",
          "Nim": "25000022",
          "JenjangKkniDituju": "8",
          "KipK": false,
          "Aktif": true,
          "MengisiBiodata": true,
          "Finalisasi": true,
          "TanggalDaftar": new Date("2025-11-02T00:00:00Z"),
          "TanggalDaftarUlang": new Date("2025-11-03T00:00:00Z")
        },
        "statusPerkawinan": StatusPerkawinan.Lajang,
        "orangTua": [],
        "informasiKependudukan": {
          "InformasiKependudukanId": "",
          "NoKk": "3174123775267145",
          "NoNik": "3174123313699296",
          "Suku": "Minang"
        },
        "pekerjaanMahasiswa": [],
        "pesantren": {
          "PesantrenId": "",
          "NamaPesantren": "",
          "LamaPesantren": ""
        },
        "institusiLama": {
          "InstitusiLamaId": "",
          "Jenjang": Jenjang.SMA,
          "JenisInstitusi": "MA",
          "NamaInstitusi": "MA Al Falah",
          "Jurusan": "IPA",
          "Nisn": "2483479669",
          "Npsn": "62175317",
          "TahunLulus": 2013,
          "NilaiLulusan": "83.00",
          "AlamatInstitusiLama": {
            "AlamatId": "",
            "Alamat": "Jl. Pendidikan No. 150",
            "KodePos": "50123",
            "DesaId": "1ee02706-008a-4423-bc16-6c58da8afb96",
            "KecamatanId": "cf2ca8f1-ae10-4bf8-aa08-615ca012f9ce",
            "KabupatenId": "6cc90f81-b49c-42fa-96ec-d9d5180961a2",
            "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
            "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
          }
        }
      },
      {
        "programStudi": {
          "ProgramStudiId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "UniversityId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "NamaProgramStudi": "Teknik Elektro",
          "JenjangProgramStudi": Jenjang.S1,
          "AkreditasiProgramStudi": "A"
        },
        "alamat": {
          "AlamatId": "",
          "Alamat": "Jl. Contoh No. 126 RT 3/RW 10",
          "KodePos": "40111",
          "DesaId": "fd5560e5-89b1-4a22-a0ed-9602f2fe8da2",
          "KecamatanId": "e7401f54-b125-4795-9f4a-ded186365b49",
          "KabupatenId": "fd4a92fd-1a5f-4d56-a086-44061ba399a1",
          "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
          "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
        },
        "user": {
          "UserId": "",
          "Nama": "MTIUI024",
          "Email": "mtiui024@email.com",
          "TempatLahir": "Lampung",
          "TanggalLahir": new Date("2000-04-06T00:00:00Z"),
          "JenisKelamin": JenisKelamin.PRIA,
          "PendidikanTerakhir": Jenjang.S1,
          "Agama": "Katolik",
          "Telepon": "08744869991",
          "NomorWa": "08399076608",
          "NomorHp": "08478624785"
        },
        "pendaftaran": {
          "PendaftaranId": "",
          "MahasiswaId": "",
          "KodePendaftar": "RPL-2025E-0023",
          "NoUjian": "UJ-2025-00023",
          "Periode": "2025 Genap",
          "Gelombang": "Gelombang 2",
          "SistemKuliah": SistemKuliah.RPL,
          "JalurPendaftaran": "RPL Reguler"
        },
        "daftarUlang": {
          "DaftarUlangId": "",
          "Nim": "25000023",
          "JenjangKkniDituju": "8",
          "KipK": true,
          "Aktif": true,
          "MengisiBiodata": true,
          "Finalisasi": true,
          "TanggalDaftar": new Date("2025-11-18T00:00:00Z"),
          "TanggalDaftarUlang": new Date("2025-11-21T00:00:00Z")
        },
        "statusPerkawinan": StatusPerkawinan.Lajang,
        "orangTua": [],
        "informasiKependudukan": {
          "InformasiKependudukanId": "",
          "NoKk": "3174123997981996",
          "NoNik": "3174123734066956",
          "Suku": "Batak"
        },
        "pekerjaanMahasiswa": [],
        "pesantren": {
          "PesantrenId": "",
          "NamaPesantren": "",
          "LamaPesantren": ""
        },
        "institusiLama": {
          "InstitusiLamaId": "",
          "Jenjang": Jenjang.SMA,
          "JenisInstitusi": "SMA",
          "NamaInstitusi": "SMK Negeri 2 Contoh",
          "Jurusan": "RPL",
          "Nisn": "2041252000",
          "Npsn": "43917510",
          "TahunLulus": 2015,
          "NilaiLulusan": "71.00",
          "AlamatInstitusiLama": {
            "AlamatId": "",
            "Alamat": "Jl. Pendidikan No. 3",
            "KodePos": "40111",
            "DesaId": "fd5560e5-89b1-4a22-a0ed-9602f2fe8da2",
            "KecamatanId": "e7401f54-b125-4795-9f4a-ded186365b49",
            "KabupatenId": "fd4a92fd-1a5f-4d56-a086-44061ba399a1",
            "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
            "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
          }
        }
      },
      {
        "programStudi": {
          "ProgramStudiId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "UniversityId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "NamaProgramStudi": "Teknik Mesin",
          "JenjangProgramStudi": Jenjang.S1,
          "AkreditasiProgramStudi": "A Sekali"
        },
        "alamat": {
          "AlamatId": "",
          "Alamat": "Jl. Contoh No. 3 RT 2/RW 10",
          "KodePos": "40222",
          "DesaId": "4bac6f1b-3192-4921-baf6-b866813b1c53",
          "KecamatanId": "cd19bff1-38f9-45f2-b7f9-e8aa5a49b191",
          "KabupatenId": "9f47fe17-f67b-4c26-90e8-fe03d10ced20",
          "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
          "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
        },
        "user": {
          "UserId": "",
          "Nama": "MTIUI025",
          "Email": "mtiui025@email.com",
          "TempatLahir": "Lampung",
          "TanggalLahir": new Date("2004-11-25T00:00:00Z"),
          "JenisKelamin": JenisKelamin.PRIA,
          "PendidikanTerakhir": Jenjang.S1,
          "Agama": "Hindu",
          "Telepon": "08279819486",
          "NomorWa": "08776573859",
          "NomorHp": "08160412252"
        },
        "pendaftaran": {
          "PendaftaranId": "",
          "MahasiswaId": "",
          "KodePendaftar": "RPL-2025E-0024",
          "NoUjian": "UJ-2025-00024",
          "Periode": "2025 Genap",
          "Gelombang": "Gelombang 1",
          "SistemKuliah": SistemKuliah.RPL,
          "JalurPendaftaran": "RPL Pekerja"
        },
        "daftarUlang": {
          "DaftarUlangId": "",
          "Nim": "25000024",
          "JenjangKkniDituju": "8",
          "KipK": false,
          "Aktif": false,
          "MengisiBiodata": true,
          "Finalisasi": false,
          "TanggalDaftar": new Date("2025-11-07T00:00:00Z"),
          "TanggalDaftarUlang": null
        },
        "statusPerkawinan": StatusPerkawinan.Lajang,
        "orangTua": [],
        "informasiKependudukan": {
          "InformasiKependudukanId": "",
          "NoKk": "3174123369635150",
          "NoNik": "3174123380773295",
          "Suku": "Jawa"
        },
        "pekerjaanMahasiswa": [],
        "pesantren": {
          "PesantrenId": "",
          "NamaPesantren": "",
          "LamaPesantren": ""
        },
        "institusiLama": {
          "InstitusiLamaId": "",
          "Jenjang": Jenjang.SMA,
          "JenisInstitusi": "SMA",
          "NamaInstitusi": "MA Al Falah",
          "Jurusan": "IPS",
          "Nisn": "5591571520",
          "Npsn": "32058975",
          "TahunLulus": 2020,
          "NilaiLulusan": "83.00",
          "AlamatInstitusiLama": {
            "AlamatId": "",
            "Alamat": "Jl. Pendidikan No. 24",
            "KodePos": "40222",
            "DesaId": "4bac6f1b-3192-4921-baf6-b866813b1c53",
            "KecamatanId": "cd19bff1-38f9-45f2-b7f9-e8aa5a49b191",
            "KabupatenId": "9f47fe17-f67b-4c26-90e8-fe03d10ced20",
            "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
            "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
          }
        }
      },
      {
        "programStudi": {
          "ProgramStudiId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "UniversityId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "NamaProgramStudi": "Teknik Elektro",
          "JenjangProgramStudi": Jenjang.S1,
          "AkreditasiProgramStudi": "A"
        },
        "alamat": {
          "AlamatId": "",
          "Alamat": "Jl. Contoh No. 38 RT 6/RW 1",
          "KodePos": "40111",
          "DesaId": "fd5560e5-89b1-4a22-a0ed-9602f2fe8da2",
          "KecamatanId": "e7401f54-b125-4795-9f4a-ded186365b49",
          "KabupatenId": "fd4a92fd-1a5f-4d56-a086-44061ba399a1",
          "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
          "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
        },
        "user": {
          "UserId": "",
          "Nama": "MTIUI026",
          "Email": "mtiui026@email.com",
          "TempatLahir": "Lampung",
          "TanggalLahir": new Date("1991-05-15T00:00:00Z"),
          "JenisKelamin": JenisKelamin.PRIA,
          "PendidikanTerakhir": Jenjang.S1,
          "Agama": "Katolik",
          "Telepon": "08997341375",
          "NomorWa": "08857409955",
          "NomorHp": "08251563716"
        },
        "pendaftaran": {
          "PendaftaranId": "",
          "MahasiswaId": "",
          "KodePendaftar": "RPL-2025E-0025",
          "NoUjian": "UJ-2025-00025",
          "Periode": "2025 Genap",
          "Gelombang": "Gelombang 3",
          "SistemKuliah": SistemKuliah.RPL,
          "JalurPendaftaran": "RPL Reguler"
        },
        "daftarUlang": {
          "DaftarUlangId": "",
          "Nim": "25000025",
          "JenjangKkniDituju": "8",
          "KipK": false,
          "Aktif": true,
          "MengisiBiodata": true,
          "Finalisasi": true,
          "TanggalDaftar": new Date("2025-11-22T00:00:00Z"),
          "TanggalDaftarUlang": new Date("2025-11-30T00:00:00Z")
        },
        "statusPerkawinan": StatusPerkawinan.Lajang,
        "orangTua": [],
        "informasiKependudukan": {
          "InformasiKependudukanId": "",
          "NoKk": "3174123217251371",
          "NoNik": "3174123561883743",
          "Suku": "Sunda"
        },
        "pekerjaanMahasiswa": [],
        "pesantren": {
          "PesantrenId": "",
          "NamaPesantren": "Pesantren Nurul Ilmi",
          "LamaPesantren": "3 tahun"
        },
        "institusiLama": {
          "InstitusiLamaId": "",
          "Jenjang": Jenjang.SMA,
          "JenisInstitusi": "SMK",
          "NamaInstitusi": "SMA Negeri 1 Contoh",
          "Jurusan": "TKJ",
          "Nisn": "6819021973",
          "Npsn": "94828776",
          "TahunLulus": 2007,
          "NilaiLulusan": "77.00",
          "AlamatInstitusiLama": {
            "AlamatId": "",
            "Alamat": "Jl. Pendidikan No. 89",
            "KodePos": "40111",
            "DesaId": "fd5560e5-89b1-4a22-a0ed-9602f2fe8da2",
            "KecamatanId": "e7401f54-b125-4795-9f4a-ded186365b49",
            "KabupatenId": "fd4a92fd-1a5f-4d56-a086-44061ba399a1",
            "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
            "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
          }
        }
      },
      {
        "programStudi": {
          "ProgramStudiId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "UniversityId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "NamaProgramStudi": "Teknik Elektro",
          "JenjangProgramStudi": Jenjang.S1,
          "AkreditasiProgramStudi": "A"
        },
        "alamat": {
          "AlamatId": "",
          "Alamat": "Jl. Contoh No. 12 RT 8/RW 9",
          "KodePos": "35212",
          "DesaId": "d8f0852f-a2ee-4c4c-bcf4-7692d34036f3",
          "KecamatanId": "651b776b-743b-4222-9312-f3cd505f6858",
          "KabupatenId": "fd4a92fd-1a5f-4d56-a086-44061ba399a1",
          "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
          "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
        },
        "user": {
          "UserId": "",
          "Nama": "MTIUI027",
          "Email": "mtiui027@email.com",
          "TempatLahir": "Lampung",
          "TanggalLahir": new Date("2003-03-15T00:00:00Z"),
          "JenisKelamin": JenisKelamin.PRIA,
          "PendidikanTerakhir": Jenjang.S1,
          "Agama": "Kristen",
          "Telepon": "08390106673",
          "NomorWa": "08899495914",
          "NomorHp": "08899329570"
        },
        "pendaftaran": {
          "PendaftaranId": "",
          "MahasiswaId": "",
          "KodePendaftar": "RPL-2025E-0026",
          "NoUjian": "UJ-2025-00026",
          "Periode": "2025 Genap",
          "Gelombang": "Gelombang 1",
          "SistemKuliah": SistemKuliah.RPL,
          "JalurPendaftaran": "RPL Pekerja"
        },
        "daftarUlang": {
          "DaftarUlangId": "",
          "Nim": "25000026",
          "JenjangKkniDituju": "8",
          "KipK": false,
          "Aktif": false,
          "MengisiBiodata": true,
          "Finalisasi": false,
          "TanggalDaftar": new Date("2025-11-19T00:00:00Z"),
          "TanggalDaftarUlang": null
        },
        "statusPerkawinan": StatusPerkawinan.Lajang,
        "orangTua": [],
        "informasiKependudukan": {
          "InformasiKependudukanId": "",
          "NoKk": "3174123839192248",
          "NoNik": "3174123843910050",
          "Suku": "Minang"
        },
        "pekerjaanMahasiswa": [],
        "pesantren": {
          "PesantrenId": "",
          "NamaPesantren": "Pesantren Nurul Ilmi",
          "LamaPesantren": ""
        },
        "institusiLama": {
          "InstitusiLamaId": "",
          "Jenjang": Jenjang.SMA,
          "JenisInstitusi": "SMK",
          "NamaInstitusi": "SMK Negeri 2 Contoh",
          "Jurusan": "TKJ",
          "Nisn": "1666026446",
          "Npsn": "79044799",
          "TahunLulus": 2022,
          "NilaiLulusan": "94.00",
          "AlamatInstitusiLama": {
            "AlamatId": "",
            "Alamat": "Jl. Pendidikan No. 153",
            "KodePos": "35212",
            "DesaId": "d8f0852f-a2ee-4c4c-bcf4-7692d34036f3",
            "KecamatanId": "651b776b-743b-4222-9312-f3cd505f6858",
            "KabupatenId": "fd4a92fd-1a5f-4d56-a086-44061ba399a1",
            "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
            "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
          }
        }
      },
      {
        "programStudi": {
          "ProgramStudiId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "UniversityId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "NamaProgramStudi": "Teknik Elektro",
          "JenjangProgramStudi": Jenjang.S1,
          "AkreditasiProgramStudi": "A Sekali"
        },
        "alamat": {
          "AlamatId": "",
          "Alamat": "Jl. Contoh No. 72 RT 7/RW 6",
          "KodePos": "40111",
          "DesaId": "fd5560e5-89b1-4a22-a0ed-9602f2fe8da2",
          "KecamatanId": "e7401f54-b125-4795-9f4a-ded186365b49",
          "KabupatenId": "fd4a92fd-1a5f-4d56-a086-44061ba399a1",
          "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
          "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
        },
        "user": {
          "UserId": "",
          "Nama": "MTIUI028",
          "Email": "mtiui028@email.com",
          "TempatLahir": "Surabaya",
          "TanggalLahir": new Date("1995-08-22T00:00:00Z"),
          "JenisKelamin": JenisKelamin.PRIA,
          "PendidikanTerakhir": Jenjang.S1,
          "Agama": "Konghucu",
          "Telepon": "08997981184",
          "NomorWa": "08129640859",
          "NomorHp": "08535194857"
        },
        "pendaftaran": {
          "PendaftaranId": "",
          "MahasiswaId": "",
          "KodePendaftar": "RPL-2025E-0027",
          "NoUjian": "UJ-2025-00027",
          "Periode": "2025 Genap",
          "Gelombang": "Gelombang 1",
          "SistemKuliah": SistemKuliah.RPL,
          "JalurPendaftaran": "RPL Rekognisi"
        },
        "daftarUlang": {
          "DaftarUlangId": "",
          "Nim": "25000027",
          "JenjangKkniDituju": "8",
          "KipK": false,
          "Aktif": true,
          "MengisiBiodata": true,
          "Finalisasi": true,
          "TanggalDaftar": new Date("2025-11-04T00:00:00Z"),
          "TanggalDaftarUlang": new Date("2025-11-15T00:00:00Z")
        },
        "statusPerkawinan": StatusPerkawinan.Lajang,
        "orangTua": [],
        "informasiKependudukan": {
          "InformasiKependudukanId": "",
          "NoKk": "3174123371788276",
          "NoNik": "3174123757932952",
          "Suku": "Minang"
        },
        "pekerjaanMahasiswa": [],
        "pesantren": {
          "PesantrenId": "",
          "NamaPesantren": "Pesantren Nurul Ilmi",
          "LamaPesantren": ""
        },
        "institusiLama": {
          "InstitusiLamaId": "",
          "Jenjang": Jenjang.SMA,
          "JenisInstitusi": "MA",
          "NamaInstitusi": "SMA Negeri 1 Contoh",
          "Jurusan": "TKJ",
          "Nisn": "9538151299",
          "Npsn": "50188216",
          "TahunLulus": 2012,
          "NilaiLulusan": "77.00",
          "AlamatInstitusiLama": {
            "AlamatId": "",
            "Alamat": "Jl. Pendidikan No. 23",
            "KodePos": "40111",
            "DesaId": "fd5560e5-89b1-4a22-a0ed-9602f2fe8da2",
            "KecamatanId": "e7401f54-b125-4795-9f4a-ded186365b49",
            "KabupatenId": "fd4a92fd-1a5f-4d56-a086-44061ba399a1",
            "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
            "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
          }
        }
      },
      {
        "programStudi": {
          "ProgramStudiId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "UniversityId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "NamaProgramStudi": "Teknik Mesin",
          "JenjangProgramStudi": Jenjang.S1,
          "AkreditasiProgramStudi": "A Sekali"
        },
        "alamat": {
          "AlamatId": "",
          "Alamat": "Jl. Contoh No. 108 RT 7/RW 1",
          "KodePos": "50123",
          "DesaId": "1ee02706-008a-4423-bc16-6c58da8afb96",
          "KecamatanId": "cf2ca8f1-ae10-4bf8-aa08-615ca012f9ce",
          "KabupatenId": "6cc90f81-b49c-42fa-96ec-d9d5180961a2",
          "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
          "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
        },
        "user": {
          "UserId": "",
          "Nama": "MTIUI029",
          "Email": "mtiui029@email.com",
          "TempatLahir": "Surabaya",
          "TanggalLahir": new Date("1991-08-15T00:00:00Z"),
          "JenisKelamin": JenisKelamin.PRIA,
          "PendidikanTerakhir": Jenjang.S1,
          "Agama": "Hindu",
          "Telepon": "08749535602",
          "NomorWa": "08553203237",
          "NomorHp": "08338163657"
        },
        "pendaftaran": {
          "PendaftaranId": "",
          "MahasiswaId": "",
          "KodePendaftar": "RPL-2025E-0028",
          "NoUjian": "UJ-2025-00028",
          "Periode": "2025 Genap",
          "Gelombang": "Gelombang 1",
          "SistemKuliah": SistemKuliah.RPL,
          "JalurPendaftaran": "RPL KIP-K"
        },
        "daftarUlang": {
          "DaftarUlangId": "",
          "Nim": "25000028",
          "JenjangKkniDituju": "8",
          "KipK": false,
          "Aktif": true,
          "MengisiBiodata": true,
          "Finalisasi": true,
          "TanggalDaftar": new Date("2025-11-03T00:00:00Z"),
          "TanggalDaftarUlang": new Date("2025-11-10T00:00:00Z")
        },
        "statusPerkawinan": StatusPerkawinan.Lajang,
        "orangTua": [],
        "informasiKependudukan": {
          "InformasiKependudukanId": "",
          "NoKk": "3174123603176738",
          "NoNik": "3174123778461789",
          "Suku": "Jawa"
        },
        "pekerjaanMahasiswa": [],
        "pesantren": {
          "PesantrenId": "",
          "NamaPesantren": "",
          "LamaPesantren": "4 tahun"
        },
        "institusiLama": {
          "InstitusiLamaId": "",
          "Jenjang": Jenjang.SMA,
          "JenisInstitusi": "MA",
          "NamaInstitusi": "SMK Negeri 2 Contoh",
          "Jurusan": "TKJ",
          "Nisn": "2196745158",
          "Npsn": "69605741",
          "TahunLulus": 2007,
          "NilaiLulusan": "77.00",
          "AlamatInstitusiLama": {
            "AlamatId": "",
            "Alamat": "Jl. Pendidikan No. 161",
            "KodePos": "50123",
            "DesaId": "1ee02706-008a-4423-bc16-6c58da8afb96",
            "KecamatanId": "cf2ca8f1-ae10-4bf8-aa08-615ca012f9ce",
            "KabupatenId": "6cc90f81-b49c-42fa-96ec-d9d5180961a2",
            "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
            "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
          }
        }
      },
      {
        "programStudi": {
          "ProgramStudiId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "UniversityId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "NamaProgramStudi": "Teknik Kimia",
          "JenjangProgramStudi": Jenjang.S1,
          "AkreditasiProgramStudi": "A"
        },
        "alamat": {
          "AlamatId": "",
          "Alamat": "Jl. Contoh No. 146 RT 5/RW 8",
          "KodePos": "50123",
          "DesaId": "1ee02706-008a-4423-bc16-6c58da8afb96",
          "KecamatanId": "cf2ca8f1-ae10-4bf8-aa08-615ca012f9ce",
          "KabupatenId": "6cc90f81-b49c-42fa-96ec-d9d5180961a2",
          "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
          "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
        },
        "user": {
          "UserId": "",
          "Nama": "MTIUI030",
          "Email": "mtiui030@email.com",
          "TempatLahir": "Jakarta",
          "TanggalLahir": new Date("2006-03-01T00:00:00Z"),
          "JenisKelamin": JenisKelamin.PRIA,
          "PendidikanTerakhir": Jenjang.S1,
          "Agama": "Buddha",
          "Telepon": "08704841711",
          "NomorWa": "08635075395",
          "NomorHp": "08541490410"
        },
        "pendaftaran": {
          "PendaftaranId": "",
          "MahasiswaId": "",
          "KodePendaftar": "RPL-2025E-0029",
          "NoUjian": "UJ-2025-00029",
          "Periode": "2025 Genap",
          "Gelombang": "Gelombang 1",
          "SistemKuliah": SistemKuliah.RPL,
          "JalurPendaftaran": "RPL Reguler"
        },
        "daftarUlang": {
          "DaftarUlangId": "",
          "Nim": "25000029",
          "JenjangKkniDituju": "8",
          "KipK": false,
          "Aktif": false,
          "MengisiBiodata": true,
          "Finalisasi": false,
          "TanggalDaftar": new Date("2025-11-12T00:00:00Z"),
          "TanggalDaftarUlang": null
        },
        "statusPerkawinan": StatusPerkawinan.Lajang,
        "orangTua": [],
        "informasiKependudukan": {
          "InformasiKependudukanId": "",
          "NoKk": "3174123358436027",
          "NoNik": "3174123663028979",
          "Suku": "Sunda"
        },
        "pekerjaanMahasiswa": [],
        "pesantren": {
          "PesantrenId": "",
          "NamaPesantren": "",
          "LamaPesantren": ""
        },
        "institusiLama": {
          "InstitusiLamaId": "",
          "Jenjang": Jenjang.SMA,
          "JenisInstitusi": "MA",
          "NamaInstitusi": "SMA Negeri 1 Contoh",
          "Jurusan": "IPS",
          "Nisn": "7303097585",
          "Npsn": "72266684",
          "TahunLulus": 2022,
          "NilaiLulusan": "65.00",
          "AlamatInstitusiLama": {
            "AlamatId": "",
            "Alamat": "Jl. Pendidikan No. 27",
            "KodePos": "50123",
            "DesaId": "1ee02706-008a-4423-bc16-6c58da8afb96",
            "KecamatanId": "cf2ca8f1-ae10-4bf8-aa08-615ca012f9ce",
            "KabupatenId": "6cc90f81-b49c-42fa-96ec-d9d5180961a2",
            "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
            "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
          }
        }
      },
      {
        "programStudi": {
          "ProgramStudiId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "UniversityId": "6a5182c3-3d70-489b-b6b7-00a8d863a41b",
          "NamaProgramStudi": "Teknik Mesin",
          "JenjangProgramStudi": Jenjang.S1,
          "AkreditasiProgramStudi": "A"
        },
        "alamat": {
          "AlamatId": "",
          "Alamat": "Jl. Contoh No. 6 RT 7/RW 6",
          "KodePos": "50123",
          "DesaId": "1ee02706-008a-4423-bc16-6c58da8afb96",
          "KecamatanId": "cf2ca8f1-ae10-4bf8-aa08-615ca012f9ce",
          "KabupatenId": "6cc90f81-b49c-42fa-96ec-d9d5180961a2",
          "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
          "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
        },
        "user": {
          "UserId": "",
          "Nama": "MTIUI022",
          "Email": "mtiui022@email.com",
          "TempatLahir": "Medan",
          "TanggalLahir": new Date("1990-07-01T00:00:00Z"),
          "JenisKelamin": JenisKelamin.PRIA,
          "PendidikanTerakhir": Jenjang.S1,
          "Agama": "Konghucu",
          "Telepon": "08228435274",
          "NomorWa": "08585230523",
          "NomorHp": "08103878751"
        },
        "pendaftaran": {
          "PendaftaranId": "",
          "MahasiswaId": "",
          "KodePendaftar": "RPL-2025E-0030",
          "NoUjian": "UJ-2025-00030",
          "Periode": "2025 Genap",
          "Gelombang": "Gelombang 2",
          "SistemKuliah": SistemKuliah.RPL,
          "JalurPendaftaran": "RPL KIP-K"
        },
        "daftarUlang": {
          "DaftarUlangId": "",
          "Nim": "25000030",
          "JenjangKkniDituju": "8",
          "KipK": false,
          "Aktif": true,
          "MengisiBiodata": true,
          "Finalisasi": false,
          "TanggalDaftar": new Date("2025-11-15T00:00:00Z"),
          "TanggalDaftarUlang": new Date("2025-11-26T00:00:00Z")
        },
        "statusPerkawinan": StatusPerkawinan.Lajang,
        "orangTua": [],
        "informasiKependudukan": {
          "InformasiKependudukanId": "",
          "NoKk": "3174123274798342",
          "NoNik": "3174123418257831",
          "Suku": "Sunda"
        },
        "pekerjaanMahasiswa": [],
        "pesantren": {
          "PesantrenId": "",
          "NamaPesantren": "",
          "LamaPesantren": ""
        },
        "institusiLama": {
          "InstitusiLamaId": "",
          "Jenjang": Jenjang.SMA,
          "JenisInstitusi": "MA",
          "NamaInstitusi": "SMA Negeri 1 Contoh",
          "Jurusan": "Akuntansi",
          "Nisn": "8247110150",
          "Npsn": "28588782",
          "TahunLulus": 2010,
          "NilaiLulusan": "86.00",
          "AlamatInstitusiLama": {
            "AlamatId": "",
            "Alamat": "Jl. Pendidikan No. 89",
            "KodePos": "50123",
            "DesaId": "1ee02706-008a-4423-bc16-6c58da8afb96",
            "KecamatanId": "cf2ca8f1-ae10-4bf8-aa08-615ca012f9ce",
            "KabupatenId": "6cc90f81-b49c-42fa-96ec-d9d5180961a2",
            "ProvinsiId": "cfe51e66-c149-4d7f-a041-23f2005feb19",
            "CountryId": "4eb957c9-8fb0-427f-9825-f1eaf05be694"
          }
        }
      }
    ]
}