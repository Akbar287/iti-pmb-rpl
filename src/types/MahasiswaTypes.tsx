import {
    JenisKelamin,
    JenisOrtu,
    Jenjang,
    SistemKuliah,
    StatusPekerjaan,
    StatusPerkawinan,
} from '@/generated/prisma'

export type CalonMahasiswaRplRequestResponseDTO = {
    ProgramStudi: {
        ProgramStudiId: string
        UniversityId: string
        NamaProgramStudi: string
        JenjangProgramStudi: string | null
        AkreditasiProgramStudi: string
    }
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
    }
    User: {
        UserId: string
        Nama: string
        Email: string
        TempatLahir: string
        TanggalLahir: Date | null
        JenisKelamin: JenisKelamin
        PendidikanTerakhir: Jenjang
        Avatar: string
        Agama: string
        Telepon: string
        NomorWa: string
        NomorHp: string
    }
    Pendaftaran: {
        PendaftaranId: string
        MahasiswaId: string
        KodePendaftar: string
        NoUjian: string
        Periode: string
        Gelombang: string
        SistemKuliah: SistemKuliah
        JalurPendaftaran: string
    }
    DaftarUlang: {
        DaftarUlangId: string
        Nim: string
        JenjangKkniDituju: string
        KipK: boolean
        Aktif: boolean
        MengisiBiodata: boolean
        Finalisasi: boolean
        TanggalDaftar: Date | null
        TanggalDaftarUlang: Date | null
    }
    StatusPerkawinan: StatusPerkawinan
    OrangTua: {
        OrangTuaId: string
        NamaOrangTua: string
        PekerjaanOrangTua: string
        JenisOrtu: JenisOrtu
        PenghasilanOrangTua: number
        EmailOrangTua: string
        NomorHpOrangTua: string
    }[]
    InformasiKependudukan: {
        InformasiKependudukanId: string
        NoKk: string
        NoNik: string
        Suku: string
    }
    PekerjaanMahasiswa: {
        InstitusiTempatBekerja: string
        Jabatan: string
        StatusPekerjaan: StatusPekerjaan
    }[]
    Pesantren: {
        PesantrenId: string
        NamaPesantren: string
        LamaPesantren: string
    }
    InstitusiLama: {
        InstitusiLamaId: string
        Jenjang: Jenjang
        JenisInstitusi: string
        NamaInstitusi: string
        Jurusan: string
        Nisn: string
        Npsn: string
        TahunLulus: number
        NilaiLulusan: number
    }
}

export type CalonMahasiswaRplPage = {
    KodePendaftar: string
    NoNik: string
    Nim: string
    Nama: string
    NoUjian: string
    Periode: string
    Gelombang: string
    NamaProdi: string
}
