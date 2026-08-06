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
    TranskripNilai: {
        NilaiAsessment: string
        Diakui: boolean
        TranskripNilaiId: string
        PendaftaranId: string
        KodeMataKuliah: string
        NamaMataKuliah: string
        Sks: number
        Nilai: string
        CreatedAt: Date
        UpdatedAt: Date
    },
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
    SkRektor: {
        SkRektorId: string,
        NamaSk: string,
        TahunSk: number,
        NomorSk: string,
        NamaFile: string,
        NamaDokumen: string,
        Catatan: string
    }
}

export type SkAsessmenRingkasType = {
    SkRektorId: string
    JenisSkAsessmen: 'PEROLEHAN_SKS' | 'TRANSFER_SKS'
    NomorSk: string
    NamaFile: string
    NamaDokumen: string
}

export type ResponseSkRektorAsessmenType = {
    Nama: string
    Email: string
    NomorHp: string
    PendaftaranId: string
    KodePendaftar: string
    Nim: string
    ProgramStudi: string
    NomorSk: string
    SkRektor: boolean
    NamaFile: string
    DaftarSk?: SkAsessmenRingkasType[]
    /** Seluruh SK sudah ditandatangani Rektor sehingga siap dipublikasikan. */
    SiapDipublikasikan?: boolean
    /** Seluruh SK sudah dipublikasikan ke mahasiswa. */
    Dipublikasikan?: boolean
    Status: string
}

export const ResponseSkRektorAsessmenTypeValue = {
    Nama: '',
    Email: '',
    NomorHp: '',
    PendaftaranId: '',
    KodePendaftar: '',
    Nim: '',
    ProgramStudi: '',
    NomorSk: '',
    SkRektor: false,
    NamaFile: '',
    Status: '',
}

export type ResponseSkHasilForWarek = {
    SkRektorId: string
    PendaftaranId: string
    JenisSkAsessmen: 'PEROLEHAN_SKS' | 'TRANSFER_SKS'
    NamaSk: string
    NomorSk: string
    TahunSk: number
    NamaFile: string
    NamaDokumen: string
    Catatan: string
    KodePendaftar: string
    NamaMahasiswa: string
    NamaProgramStudi: string
}

export const ResponseSkHasilForWarekValue: ResponseSkHasilForWarek = {
    SkRektorId: '',
    PendaftaranId: '',
    JenisSkAsessmen: 'PEROLEHAN_SKS',
    NamaSk: '',
    NomorSk: '',
    TahunSk: 0,
    NamaFile: '',
    NamaDokumen: '',
    Catatan: '',
    KodePendaftar: '',
    NamaMahasiswa: '',
    NamaProgramStudi: '',
}
