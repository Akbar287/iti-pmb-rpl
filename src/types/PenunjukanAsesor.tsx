type ResponseAsesorFromProdi = {
    AsesorId: string
    UserId: string
    Nama: string
    AssesorMahasiswa: {
        Confirmation: boolean
    }[]
    TipeAsesor: {
        Nama: string
        TipeAsesorId: string
    }
}

type ResponseMhsFromAsesor = {
    UserId: string
    MahasiswaId: string
    Nama: string
    ProgramStudi: {
        Nama: string
        ProgramStudiId: string
    }[]
    Confirmation: boolean
}

type RequestPenunjukanAsesor = {
    Asesor: {
        AssesorMahasiswaId: string
        AsesorId: string
        Urutan: number
        Confirmation: boolean
    }[]
    PendaftaranId: string
    ProgramStudiId: string
    KodePendaftar: string
}

type ResponsePenunjukanAsesor = {
    Asesor: {
        AssesorMahasiswaId: string
        AsesorId: string
        NamaTipeAsesor: string
        NamaAsesor: string
        Urutan: number
        Confirmation: boolean
    }[]
    ProgramStudiId: string
    PendaftaranId: string
    KodePendaftar: string
    NamaProgramStudi: string
    NamaMahasiswa: string
}

type ResponseSkRektorAsesor = {
    SkRektorId: string
    NamaSk: string
    TahunSk: number
    NomorSk: string
    NamaFile: string
    NamaDokumen: string
    AsesorRelation: number
}

type ResponseSkRektorAsesorDetail = {
    SkRektorId: string
    AsesorMahasiswaId: string
    PendaftaranId: string
    KodePendaftar: string
    Asesor: {
        AsesorId: string
        NamaTipeAsesor: string
        NamaAsesor: string
        Urutan: number
        Confirmation: boolean
    }[]
}
