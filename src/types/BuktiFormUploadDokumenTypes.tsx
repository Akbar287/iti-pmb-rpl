export interface BuktiFormTypes {
    JenisDokumenId: string
    Jenis: string
    NomorDokumen: number
    Keterangan: string | null
    BuktiFormId: string
    PendaftaranId: string
    NamaFile: string
    NamaDokumen: string
    CreatedAt: Date | null
    UpdatedAt: Date | null
}

export const BuktiFormTypesValues: BuktiFormTypes = {
    JenisDokumenId: '',
    Jenis: '',
    NomorDokumen: 0,
    Keterangan: null,
    BuktiFormId: '',
    PendaftaranId: '',
    NamaFile: '',
    NamaDokumen: '',
    CreatedAt: null,
    UpdatedAt: null,
}
