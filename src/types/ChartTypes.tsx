export interface ChartMahasiswaData {
    data: [
        { chart1: MhsChart1Entry[] },
        { chart2: MhsChart2Entry[] },
        { chart3: MhsChart3Entry[] },
        { chart4: MhsChart4Entry[] }
    ]
    status: string
    message: string
}

interface MhsChart1Entry {
    PendaftarId: string
    KodePendaftar: string
    ProgramStudi: string
    Pesantren: number
    InstitusiLama: number
    PekerjaanMahasiswa: number
    InformasiKependudukan: number
    OrangTua: number
    MahasiswaRiwayatPekerjaan: number
    MahasiswaPendidikan: number
    MahasiswaOrganisasiProfesi: number
    MahasiswaPiagam: number
    MahasiswaKonferensi: number
    MahasiswaPelatihanProfessional: number
}

interface MhsChart2Entry {
    PendaftaranId: string
    KodePendaftar: string
    BuktiForm: BuktiFormEntry[]
}

interface BuktiFormEntry {
    JenisDokumen: string
    NomorDokumen: number
    BuktiFormId: string | null
    Upload: number
}

interface MhsChart3Entry {
    PendaftaranId: string
    KodePendaftar: string
    ProgramStudi: string
    SanggahanAssesmen: {
        SanggahanAssesmenId: string
        MataKuliah: string
    }[]
}

interface MhsChart4Entry {
    PendaftaranId: string
    KodePendaftar: string
    Status: StatusEntry[]
}

interface StatusEntry {
    StatusId: string
    Status: string
    Urutan: number
    Tanggal: string | null
    Keterangan: string | null
    Aktif: number
}

////
export interface Chart1Item {
    programStudi: string
    sudahAsses: number
    belumAsses: number
}

export interface Chart2Item {
    Status: string
    Jumlah: number
}

export interface ChartData {
    chart1: Chart1Item[]
    chart2: Chart2Item[]
}

export interface ChartResponseAsesor {
    data: ChartData
    status: 'success' | 'error'
    message: string
}

///

export interface Chart1ItemKaprodi {
    date: string
    'Asesor Akademik'?: number
    'Asesor Praktisi'?: number
}

export interface Chart2ItemKaprodi {
    tipe: string
    count: number
    fill: string
}

export interface Chart3ItemKaprodi {
    program_studi: string
    count: number
    fill: string
}

export interface Chart4ItemKaprodi {
    program_studi: string
    count: number
    fill: string
}

export interface ChartDataItemKaprodi {
    chart_1?: Chart1ItemKaprodi[]
    chart_2?: Chart2ItemKaprodi[]
    chart_3?: Chart3ItemKaprodi[]
    chart_4?: Chart4ItemKaprodi[]
}

export interface ChartKaprodiData {
    data: ChartDataItemKaprodi[]
    status: string
    message: string
}

export interface ChartItem {
    name: string
    total: number
}

export interface ChartAkademikData {
    data: ChartItem[][]
    status: string
    message: string
}

export interface HasilPerProdiPmb {
    programStudiId: string
    programStudi: string
    jumlahMahasiswa: number
}

export interface CountPerStatusLengkapPmb {
    statusId: string
    status: string
    jumlah: number
}

export interface HasilMKPmb {
    programStudiId: string
    programStudi: string
    jumlahMataKuliah: number
}

export interface HasilCPPmb {
    programStudiId: string
    programStudi: string
    jumlahCapaianPembelajaran: number
}

export interface ChartDataPmb {
    hasilPerProdi?: HasilPerProdiPmb[]
    countPerStatusLengkap?: CountPerStatusLengkapPmb[]
    hasilMK?: HasilMKPmb[]
    hasilCP?: HasilCPPmb[]
}

export interface ChartDataItemPmb {
    data: ChartDataPmb[]
    status: string
    message: string
}
