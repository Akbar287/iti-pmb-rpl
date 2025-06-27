import {
    KeteranganMataKuliah,
    ProfiensiPengetahuan,
    StatusMataKuliahMahasiswa,
} from '@/generated/prisma'

export type ResponseFinalAsessmenPaginationType = {
    PendaftaranId: string
    NamaProgramStudi: string
    KodePendaftar: string
    NoUjian: string
    Periode: string
    Status: string
    Asesor: {
        Urutan: number
        Nama: string
    }[]
}

export type ResponseFinalAsessmenAsesorPaginationType = {
    PendaftaranId: string
    NamaProgramStudi: string
    Nama: string
    KodePendaftar: string
    NoUjian: string
    Periode: string
    Status: string
    Asesor: {
        Urutan: number
        Nama: string
    }[]
}

export type ResponseFinalAsessmenAsesorDetailMKMType = {
    MataKuliahMahasiswaId: string
    Rpl: boolean
    StatusMataKuliahMahasiswa: StatusMataKuliahMahasiswa | null
    Keterangan: KeteranganMataKuliah | null
    MataKuliah: {
        MataKuliahId: string
        Kode: string
        Nama: string
        Sks: number
        Semester: string | null
        Silabus: string | null
        CapaianPembelajaran: {
            CapaianPembelajaranId: string
            Nama: string
            Urutan: number
            EvaluasiDiri: {
                EvaluasiDiriId: string
                ProfiensiPengetahuan: ProfiensiPengetahuan
                TanggalPengesahan: Date | null
                CreatedAt: Date | null
                UpdatedAt: Date | null
                HasilAsessment: {
                    HasilAssesmenId: string
                    Valid: boolean
                    Autentik: boolean
                    Terkini: boolean
                    Memadai: boolean
                    Assesmen: string
                    Nilai: number
                    TanggalAssesmen: Date | null
                }
            }
        }[]
    }
    SkorAssesmen: {
        SkorAssesmenId: string
        MataKuliahMahasiswaId: string
        Portofolio: number
        Tulis: number
        Wawancara: number
        Demo: number
        Diakui: boolean
        SkorRataRata: number
        NilaiHuruf: string | null
    }
}

export type ResponseFinalAsessmenAsesorDetailType = {
    Nama: string
    Email: string
    NomorHp: string
    Agama: string
    TanggalLahir: Date | null
    TempatLahir: string
    PendaftaranId: string
    KodePendaftar: string
    JalurPendaftaran: string
    Periode: string
    Nim: string
    NoUjian: string
    Gelombang: string
    SistemKuliah: string
    AssesorMahasiswa: {
        AssesorMahasiswaId: string
        Nama: string
        Urutan: number
        Confirmation: boolean
    }[]
    ProgramStudi: {
        ProgramStudiId: string
        Nama: string
        UniversityId: string
        Jenjang: string
        Akreditasi: string
    }
    MataKuliahMahasiswa: ResponseFinalAsessmenAsesorDetailMKMType[]
}

export type ResponseSkRektorAsessmenType = {
    Nama: string
    Email: string
    NomorHp: string
    PendaftaranId: string
    KodePendaftar: string
    Nim: string
    SkRektor: boolean
    NamaFile: string
}
