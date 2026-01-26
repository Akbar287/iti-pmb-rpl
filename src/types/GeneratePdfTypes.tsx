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


export interface GenerateRekapitulasiType {
    PendaftaranId: string
    Nama: string
    Alamat: string
    KodePos: string
    NomorHp: string
    Email: string
    Asesor: {
        AsesorId: string
        Nama: string
        Urutan: number
    }[]
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
        JenjangKKNIDituju: string
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
            Nilai: string
            NilaiAsessmen: string
        }
        SkorAsessmen: {
            SkorAssesmenId: string
            Portofolio: number
            Tulis: number
            Wawancara: number
            Demo: number
            Diakui: boolean
            SkorRataRata: number
            NilaiHuruf: string
        }
    }[]
}