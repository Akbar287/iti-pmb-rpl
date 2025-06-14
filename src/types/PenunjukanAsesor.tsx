export type ResponseAsesorFromProdi = {
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

export type ResponseMhsFromAsesor = {
    UserId: string
    MahasiswaId: string
    Nama: string
    ProgramStudi: {
        Nama: string
        ProgramStudiId: string
    }[]
    Confirmation: boolean
}

export type ResponseMhsFromAsesorSession = {
    UserId: string
    PendaftaranId: string
    Nama: string
    ProgramStudiId: string
    NamaProgramStudi: string
    Confirmation: boolean
    Urutan: number
}

export type RequestPenunjukanAsesor = {
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

export type ResponsePenunjukanAsesor = {
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

export type ResponseSkRektorAsesor = {
    SkRektorId: string
    NamaSk: string
    TahunSk: number
    NomorSk: string
    NamaFile: string
    NamaDokumen: string
    AsesorRelation: number
}

export type ResponseSkRektorAsesorDetail = {
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

export type ResponseAsesorMahasiswa = {
    AIM: string
    AI: string
    PI: string
    NA: string
    NM: string
}
