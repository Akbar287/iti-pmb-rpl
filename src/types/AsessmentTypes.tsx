import {
    KeteranganMataKuliah,
    MataKuliah,
    ProfiensiPengetahuan,
    ProgramStudi,
    SkorAssesmen,
    StatusMataKuliahMahasiswa,
} from '@/generated/prisma'

export type AsessmenAsesorTypes = {
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
            HasilAsessment: {
                HasilAssesmenId: string
                Valid: boolean
                Autentik: boolean
                Terkini: boolean
                Memadai: boolean
                Assesmen: string
                Nilai: number
                TanggalAssesmen: Date
            }
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

export type SkorAsessmenTypes = {
    PendaftaranId: string
    KodePendaftar: string
    ProgramStudi: {
        ProgramStudiId: string
        Nama: string
        UniversityId: string
        Jenjang: string | null
        Akreditasi: string
        MataKuliahMahasiswa: {
            MataKuliahMahasiswaId: string
            Rpl: string
            Keterangan: string
            StatusMataKuliahMahasiswa: string
            MataKuliah: {
                Kode: string
                Nama: string
                Sks: number
                Semester: string | null
                Silabus: string | null
            }
            SkorAsessmen: {
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
        }[]
    }
}
