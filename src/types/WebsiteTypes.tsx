export interface SettingMainPageTypes {
    UniversityId: string
    SettingMainPageId: string
    TextMainPage1: string
    TextMainPage2: string
    TextMainPage3: string
    SelayangPandangText: string
    SelayangPandangDeskripsi: string
    WhyText: string
    WhyDeskripsi: string
    CommunityText: string
    CommunityDeskripsi: string
    KegiatanText: string
    KegiatanDeskripsi: string
    BeritaText: string
    BeritaDeskripsi: string
    TestomoniText: string
    TestomoniDeskripsi: string
}

export interface SettingTestimoniTypes {
    SettingTestimonyId: string
    SettingMainPageId: string
    Nama: string
    Jabatan: string
    JurusanTahun: string
    Testimoni: string
}

export interface SettingCommunityTypes {
    SettingCommunityId: string
    SettingMainPageId: string
    Title: string
}

export interface SettingBeritaTypes {
    KategoriBeritaId: string
    NamaKategori: string
    Color: string
    SettingMainPageId: string
    Title: string
    SettingBeritaId: string
    Deskripsi: string
    Populer: boolean
    Waktu: Date
}

export interface SettingKegiatanTypes {
    Nama: string
    SettingMainPageId: string
    JenisKegiatanId: string
    SettingKegiatanId: string
    Lokasi: string | null
    Deskripsi: string | null
    WaktuMulai: Date
    WaktuSelesai: Date | null
    NamaJenis: string
    Color: string
}
