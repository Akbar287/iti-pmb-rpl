// DTO Types for Berita (News) API

// Kategori Berita
export interface KategoriBerita {
    KategoriBeritaId: string
    Nama: string
    Color: string
}

// Setting Main Page (for relations)
export interface SettingMainPage {
    SettingMainPageId: string
    // Add other fields as needed
}

// Base Berita interface
export interface BeritaBase {
    SettingBeritaId: string
    KategoriBeritaId: string
    SettingMainPageId: string
    Title: string
    Deskripsi: string
    Populer: boolean
    Waktu: Date | string
}

// Berita for list (without image)
export interface BeritaListItem extends BeritaBase {
    KategoriBerita: KategoriBerita
    HasImage: boolean
}

// Berita Detail (with image and full relations)
export interface BeritaDetail extends BeritaBase {
    Gambar: string | null // base64 string
    KategoriBerita: KategoriBerita
    SettingMainPage: SettingMainPage
}

// Request DTOs
export interface CreateBeritaRequest {
    KategoriBeritaId: string
    SettingMainPageId: string
    Title: string
    Deskripsi: string
    Gambar?: File
    Populer?: boolean
    Waktu?: string
}

export interface UpdateBeritaRequest {
    SettingBeritaId: string
    KategoriBeritaId?: string
    Title?: string
    Deskripsi?: string
    Gambar?: string | null // base64 string
    Populer?: boolean
    Waktu?: string
}

// Response DTOs
export interface BeritaResponse<T> {
    message: string
    data: T
}

export interface DeleteBeritaResponse {
    message: string
    deletedId: string
}

export interface BeritaErrorResponse {
    error: string
}

// Query Parameters for GET list
export interface BeritaQueryParams {
    page?: number
    limit?: number
    search?: string
    sort?: 'asc' | 'desc'
    sortBy?: 'Waktu' | 'Title' | 'Populer'
    kategoriId?: string
}

// Formatted Berita for UI display
export interface BeritaFormatted {
    id: string
    title: string
    description: string
    excerpt: string
    category: string
    categoryColor: string
    date: string
    dateFormatted: string
    imageUrl: string
    isPopular: boolean
    hasImage: boolean
}
