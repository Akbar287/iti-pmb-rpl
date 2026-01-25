import { Jenjang } from "@/generated/prisma"

export interface GenerateSkType {
    PendaftaranId: string
    Nama: string
    TempatLahir: string
    Periode: string
    TanggalLahir: Date
    ProgramStudi: {
        ProgramStudiId: string
        Nama: string
    }
    Universitas: {
        UniversityId: string
        Logo: string
        Alamat: string
        KodePos: string
        Nama: string
        UniversitySocialMedia: {
            UniversitySocialMediaId: string
            Nama: string
            Username: string
            Icon: string
        }[]
        UniversityJabatan: {
            UniversityJabatanId: string
            NamaJabatan: string
            Nama: string
        }[]
    }
    InstitusiLama: {
        InstitusiLamaId: string
        Jenjang: Jenjang
        NamaInstitusi: string
        Jurusan: string
        Nisn: string
    }
    MataKuliah: {
        MataKuliahId: string
        Kode: string
        Nama: string
        Sks: number
        Semester: string
    }[]
    MataKuliahMahasiswa: {
        MataKuliahMahasiswaId: string
        Rpl: boolean
        Keterangan: string
        StatusMataKuliahMahasiswa: string
        MataKuliah: {
            Kode: string
            Nama: string
            Sks: number
            Semester: string | null
            Silabus: string | null
        }
        TranskripNilai: {
            TranskripNilaiId: string
            Diakui: boolean
            Sks: number
            NilaiAsessmen: string
        }
        SkorAsessmen: {
            SkorAssesmenId: string
            Diakui: boolean
            NilaiHuruf: string | null
        }
    }[]
}