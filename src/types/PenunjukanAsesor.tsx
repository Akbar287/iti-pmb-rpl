export type ResponseAsesorFromProdi = {
    AsesorId: string
    UserId: string
    Nama: string
    BebanKerja: number
    /** True bila asesor punya SK penugasan yang sudah disetujui Wakil Rektor. */
    SkDisetujui: boolean
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
    AsesorRelation?: number
    Disetujui: boolean
    DisetujuiPada: Date | null
    Catatan: string
}

/** Asesor yang tercakup dalam satu SK penugasan. */
export type ResponseSkRektorAsesorDetail = {
    SkRektorId: string
    AsesorId: string
    NamaAsesor: string
    NamaTipeAsesor: string
    Email: string
}

/** Asesor yang belum tercakup SK penugasan mana pun. */
export type ResponseAsesorTanpaSk = {
    AsesorId: string
    NamaAsesor: string
    NamaTipeAsesor: string
    Email: string
}

export type ResponseSkAsesorForWarek = {
    SkRektorId: string
    NamaSk: string
    NomorSk: string
    TahunSk: number
    NamaFile: string
    NamaDokumen: string
    JumlahAsesor: number
    Asesor: string[]
}

export const ResponseSkAsesorForWarekValue: ResponseSkAsesorForWarek = {
    SkRektorId: '',
    NamaSk: '',
    NomorSk: '',
    TahunSk: 0,
    NamaFile: '',
    NamaDokumen: '',
    JumlahAsesor: 0,
    Asesor: [],
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
