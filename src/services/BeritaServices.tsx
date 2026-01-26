import { Pagination } from '@/types/Pagination'
import {
    BeritaListItem,
    BeritaDetail,
    BeritaQueryParams,
    CreateBeritaRequest,
    UpdateBeritaRequest,
    BeritaResponse,
    DeleteBeritaResponse,
    BeritaFormatted
} from '@/types/BeritaTypes'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

/**
 * Get paginated list of berita
 */
export async function getBeritaList(params?: BeritaQueryParams): Promise<Pagination<BeritaListItem[]>> {
    const queryParams = new URLSearchParams()

    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.sort) queryParams.append('sort', params.sort)
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params?.kategoriId) queryParams.append('kategoriId', params.kategoriId)

    const url = `${BASE_URL}/api/news${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

    const response = await fetch(url)

    if (!response.ok) {
        throw new Error('Gagal mengambil data berita')
    }

    return response.json()
}

/**
 * Get single berita detail by ID
 */
export async function getBeritaById(id: string): Promise<BeritaDetail> {
    const response = await fetch(`${BASE_URL}/api/news?id=${id}`)

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Berita tidak ditemukan')
        }
        throw new Error('Gagal mengambil detail berita')
    }

    return response.json()
}

/**
 * Create new berita (with FormData for file upload)
 */
export async function createBerita(data: CreateBeritaRequest): Promise<BeritaResponse<BeritaListItem>> {
    const formData = new FormData()

    formData.append('KategoriBeritaId', data.KategoriBeritaId)
    formData.append('SettingMainPageId', data.SettingMainPageId)
    formData.append('Title', data.Title)
    formData.append('Deskripsi', data.Deskripsi)

    if (data.Gambar) {
        formData.append('Gambar', data.Gambar)
    }

    if (data.Populer !== undefined) {
        formData.append('Populer', data.Populer.toString())
    }

    if (data.Waktu) {
        formData.append('Waktu', data.Waktu)
    }

    const response = await fetch(`${BASE_URL}/api/news`, {
        method: 'POST',
        body: formData
    })

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Gagal membuat berita')
    }

    return response.json()
}

/**
 * Update existing berita
 */
export async function updateBerita(data: UpdateBeritaRequest): Promise<BeritaResponse<BeritaListItem>> {
    const response = await fetch(`${BASE_URL}/api/news`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Gagal memperbarui berita')
    }

    return response.json()
}

/**
 * Delete berita by ID
 */
export async function deleteBerita(id: string): Promise<DeleteBeritaResponse> {
    const response = await fetch(`${BASE_URL}/api/news?id=${id}`, {
        method: 'DELETE'
    })

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Gagal menghapus berita')
    }

    return response.json()
}

// ============ HELPER FUNCTIONS ============

/**
 * Format berita for UI display
 */
export function formatBeritaForDisplay(berita: BeritaListItem): BeritaFormatted {
    const waktu = new Date(berita.Waktu)

    return {
        id: berita.SettingBeritaId,
        title: berita.Title,
        description: berita.Deskripsi,
        excerpt: berita.Deskripsi.length > 150
            ? berita.Deskripsi.substring(0, 150) + '...'
            : berita.Deskripsi,
        category: berita.KategoriBerita.Nama,
        categoryColor: berita.KategoriBerita.Color,
        date: waktu.toISOString(),
        dateFormatted: waktu.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }),
        imageUrl: `${BASE_URL}/api/img?_t=_b&_id=${berita.SettingBeritaId}`,
        isPopular: berita.Populer,
        hasImage: berita.HasImage
    }
}

/**
 * Format berita detail for UI display
 */
export function formatBeritaDetailForDisplay(berita: BeritaDetail): BeritaFormatted {
    const waktu = new Date(berita.Waktu)

    return {
        id: berita.SettingBeritaId,
        title: berita.Title,
        description: berita.Deskripsi,
        excerpt: berita.Deskripsi.length > 150
            ? berita.Deskripsi.substring(0, 150) + '...'
            : berita.Deskripsi,
        category: berita.KategoriBerita.Nama,
        categoryColor: berita.KategoriBerita.Color,
        date: waktu.toISOString(),
        dateFormatted: waktu.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }),
        imageUrl: berita.Gambar
            ? `data:image/jpeg;base64,${berita.Gambar}`
            : `${BASE_URL}/api/img?_t=_b&_id=${berita.SettingBeritaId}`,
        isPopular: berita.Populer,
        hasImage: berita.Gambar !== null
    }
}

/**
 * Format array of berita for UI display
 */
export function formatBeritaListForDisplay(beritaList: BeritaListItem[]): BeritaFormatted[] {
    return beritaList.map(formatBeritaForDisplay)
}

/**
 * Get berita image URL
 */
export function getBeritaImageUrl(beritaId: string): string {
    return `${BASE_URL}/api/img?_t=_b&_id=${beritaId}`
}

/**
 * Convert File to base64 string
 */
export async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            const result = reader.result as string
            // Remove data:image/xxx;base64, prefix
            const base64 = result.split(',')[1]
            resolve(base64)
        }
        reader.onerror = (error) => reject(error)
    })
}

/**
 * Get all kategori berita (you may need to create separate endpoint)
 */
export async function getKategoriBerita(): Promise<{ KategoriBeritaId: string; Nama: string; Color: string }[]> {
    // This can be expanded to use a dedicated endpoint
    const beritaList = await getBeritaList({ limit: 100 })
    const kategoris = beritaList.data.map(b => b.KategoriBerita)

    // Remove duplicates
    const uniqueKategoris = kategoris.filter((kategori, index, self) =>
        index === self.findIndex(k => k.KategoriBeritaId === kategori.KategoriBeritaId)
    )

    return uniqueKategoris
}
