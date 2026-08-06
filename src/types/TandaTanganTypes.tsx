export type ResponseTandaTanganSkType = {
    PendaftaranId: string
    KodePendaftar: string
    NamaMahasiswa: string
    NamaProgramStudi: string
    TotalMk: number
    Sk: {
        SkRektorId: string
        JenisSkAsessmen: 'PEROLEHAN_SKS' | 'TRANSFER_SKS' 
        NamaSk: string
        NomorSk: string
        TahunSk: number
        NamaFile: string
        NamaDokumen: string
        Ditandatangani: boolean
        TandaTanganPada: Date | null
        QrVerifyUrl: string
        QrOfficialNama: string
    }
}

export const ResponseTandaTanganSkValue: ResponseTandaTanganSkType = {
    PendaftaranId: '',
    KodePendaftar: '',
    NamaMahasiswa: '',
    NamaProgramStudi: '',
    TotalMk: 0,
    Sk: {
        SkRektorId: '',
        JenisSkAsessmen: 'PEROLEHAN_SKS',
        NamaSk: '',
        NomorSk: '',
        TahunSk: 0,
        NamaFile: '',
        NamaDokumen: '',
        Ditandatangani: false,
        TandaTanganPada: null,
        QrVerifyUrl: '',
        QrOfficialNama: '',
    },
}

export type PejabatPenandatanganType = {
    id: number
    name: string
    position: string
    unit: string
}

export type HasilTandaTanganType = {
    VerifyUrl: string
    QrcodeBase64: string
    OfficialNama: string
    OfficialJabatan: string
    NomorSurat: string
    SemuaDitandatangani: boolean
    SisaBelumDitandatangani: number
}
