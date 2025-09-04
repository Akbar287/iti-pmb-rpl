import { JenisKegiatan } from '@/generated/prisma'
import { Pagination } from '@/types/Pagination'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getJenisKegiatanPagination(
    page: number,
    limit: number,
    search: string
): Promise<Pagination<JenisKegiatan[]>> {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search,
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/website/jenis-kegiatan?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch JenisKegiatan')
    return res.json()
}

export async function getJenisKegiatan(): Promise<JenisKegiatan[]> {
    const res = await fetch(`${BASE_URL}/api/protected/website/jenis-kegiatan`)
    if (!res.ok) throw new Error('Failed to fetch JenisKegiatan')
    return res.json()
}

export async function getJenisKegiatanId(
    JenisKegiatanId: string
): Promise<JenisKegiatan> {
    const res = await fetch(
        `${BASE_URL}/api/protected/website/jenis-kegiatan?id=${JenisKegiatanId}`
    )
    if (!res.ok) throw new Error('Failed to fetch JenisKegiatan')
    return res.json()
}

export async function setJenisKegiatan(
    data: JenisKegiatan
): Promise<JenisKegiatan> {
    const res = await fetch(
        `${BASE_URL}/api/protected/website/jenis-kegiatan`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to create JenisKegiatan')
    }
    return res.json()
}

export async function updateJenisKegiatan(
    data: JenisKegiatan
): Promise<JenisKegiatan> {
    const res = await fetch(
        `${BASE_URL}/api/protected/website/jenis-kegiatan`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to update JenisKegiatan')
    }
    return res.json()
}

export async function deleteJenisKegiatan(id: string): Promise<void> {
    const res = await fetch(
        `${BASE_URL}/api/protected/website/jenis-kegiatan?id=${id}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    if (!res.ok) {
        throw new Error('Failed to delete JenisKegiatan')
    }
    return res.json()
}
