import { KategoriBerita } from '@/generated/prisma'
import { Pagination } from '@/types/Pagination'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getKategoriBeritaPagination(
    page: number,
    limit: number,
    search: string
): Promise<Pagination<KategoriBerita[]>> {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search,
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/website/kategori-berita?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch KategoriBerita')
    return res.json()
}

export async function getKategoriBerita(): Promise<KategoriBerita[]> {
    const res = await fetch(`${BASE_URL}/api/protected/website/kategori-berita`)
    if (!res.ok) throw new Error('Failed to fetch KategoriBerita')
    return res.json()
}

export async function getKategoriBeritaId(
    KategoriBeritaId: string
): Promise<KategoriBerita> {
    const res = await fetch(
        `${BASE_URL}/api/protected/website/kategori-berita?id=${KategoriBeritaId}`
    )
    if (!res.ok) throw new Error('Failed to fetch KategoriBerita')
    return res.json()
}

export async function setKategoriBerita(
    data: KategoriBerita
): Promise<KategoriBerita> {
    const res = await fetch(
        `${BASE_URL}/api/protected/website/kategori-berita`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to create KategoriBerita')
    }
    return res.json()
}

export async function updateKategoriBerita(
    data: KategoriBerita
): Promise<KategoriBerita> {
    const res = await fetch(
        `${BASE_URL}/api/protected/website/kategori-berita`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to update KategoriBerita')
    }
    return res.json()
}

export async function deleteKategoriBerita(id: string): Promise<void> {
    const res = await fetch(
        `${BASE_URL}/api/protected/website/kategori-berita?id=${id}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    if (!res.ok) {
        throw new Error('Failed to delete KategoriBerita')
    }
    return res.json()
}
