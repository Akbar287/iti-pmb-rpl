import { KeteranganMataKuliah, StatusMataKuliahMahasiswa } from "@/generated/prisma"

export interface EkuivalenCheckType {
    MataKuliahMahasiswa: {
        MataKuliahMahasiswaId: string
        PendaftaranId: string
        MataKuliahId: string
        Rpl: boolean
        StatusMataKuliahMahasiswa: StatusMataKuliahMahasiswa | null
        Keterangan: KeteranganMataKuliah | null
        MataKuliah: {
            MataKuliahId: string
            ProgramStudiId: string
            NamaProgramStudi: string
            Nama: string
            Sks: number
            Semester: string | null
            Silabus: string | null
        }
    }[]
    TranskripNilai: {
        TranskripNilaiId: string
        PendaftaranId: string
        KodeMataKuliah: string
        NamaMataKuliah: string
        Sks: number
        Nilai: string
        CreatedAt: Date
        UpdatedAt: Date
    }[]
}

export interface TranskripNilaiType {
    TranskripNilaiId: string
    PendaftaranId: string
    KodeMataKuliah: string
    NamaMataKuliah: string
    Sks: number
    Nilai: string
    CreatedAt: Date
    UpdatedAt: Date

}
export interface EkuivalenCheckAsessmenType {
    MataKuliahMahasiswa: {
        MataKuliahMahasiswaId: string
        PendaftaranId: string
        MataKuliahId: string
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
        }
        MataKuliah: {
            MataKuliahId: string
            ProgramStudiId: string
            NamaProgramStudi: string
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
            }[]
        }
    }[]
    TranskripNilai: {
        TranskripNilaiId: string
        PendaftaranId: string
        KodeMataKuliah: string
        NamaMataKuliah: string
        Sks: number
        Nilai: string
        CreatedAt: Date
        UpdatedAt: Date
    }[]
    BuktiFormEvaluasiDiri: {
        BuktiFormId: string
        PendaftaranId: string
        NamaFile: string
        NamaDokumen: string
        JenisDokumen: {
            Jenis: string
            NomorDokumen: number
        }
    }
}

export interface UpdateEkuivalenCheckType {
    TranskripNilaiIdSebelum: string
    MataKuliahMahasiswaIdSebelum: string
    TranskripNilaiIdSetelah: string
    MataKuliahMahasiswaIdSetelah: string
    NilaiAsessment: string
    Diakui: boolean
}