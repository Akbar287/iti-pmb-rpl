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
