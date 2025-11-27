export type ResponseAsesorFromProdi = {
    AsesorId: string
    UserId: string
    Nama: string
    BebanKerja: number
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
    Status: string
    TotalAsessmen: number
    TotalEval: number
}

export type RequestPenunjukanAsesor = {
    AsesorPertamaId: string
    AsesorKeduaId: string
    PendaftaranId: string
    ProgramStudiId: string
    KodePendaftar: string
}

export type ResponsePenunjukanAsesor = {
    AsesorPertamaId: string
    AsesorKeduaId: string
    ProgramStudiId: string
    PendaftaranId: string
    KodePendaftar: string
    NamaProgramStudi: string
    NamaMahasiswa: string
    Status: string
}

export type ResponseSkRektorAsesor = {
    SkRektorId: string
    NamaSk: string
    TahunSk: number
    NomorSk: string
    NamaFile: string
    NamaDokumen: string
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

export type ResponsePenunjukanAsesorForWarek = {
    AsesorPertamaId: string
    NamaAsesorPertama: string
    BebanAsesorPertama: number
    AsesorKeduaId: string
    NamaAsesorKedua: string
    BebanAsesorKedua: number
    PendaftaranId: string
    KodePendaftar: string
    NamaProgramStudi: string
    NamaMahasiswa: string
    Status: string
}

export const ResponsePenunjukanAsesorForWarekValue = {
    AsesorPertamaId: '',
    NamaAsesorPertama: '',
    BebanAsesorPertama: 0,
    AsesorKeduaId: '',
    NamaAsesorKedua: '',
    BebanAsesorKedua: 0,
    PendaftaranId: '',
    KodePendaftar: '',
    NamaProgramStudi: '',
    NamaMahasiswa: '',
    Status: '',
}
