import { SettingKegiatan } from '@/generated/prisma'
import { Pagination } from '@/types/Pagination'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getSettingKegiatanPagination(
    page: number,
    limit: number,
    search: string
): Promise<Pagination<SettingKegiatan[]>> {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search,
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/website/kegiatan?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch SettingKegiatan')
    return res.json()
}

export async function getSettingKegiatan(): Promise<SettingKegiatan[]> {
    const res = await fetch(`${BASE_URL}/api/protected/website/kegiatan`)
    if (!res.ok) throw new Error('Failed to fetch SettingKegiatan')
    return res.json()
}

export async function getSettingKegiatanId(
    SettingKegiatanId: string
): Promise<SettingKegiatan> {
    const res = await fetch(
        `${BASE_URL}/api/protected/website/kegiatan?id=${SettingKegiatanId}`
    )
    if (!res.ok) throw new Error('Failed to fetch SettingKegiatan')
    return res.json()
}

export async function setSettingKegiatan(
    data: SettingKegiatan
): Promise<SettingKegiatan> {
    const res = await fetch(`${BASE_URL}/api/protected/website/kegiatan`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        throw new Error('Failed to create SettingKegiatan')
    }
    return res.json()
}

export async function updateSettingKegiatan(
    data: SettingKegiatan
): Promise<SettingKegiatan> {
    const res = await fetch(`${BASE_URL}/api/protected/website/kegiatan`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        throw new Error('Failed to update SettingKegiatan')
    }
    return res.json()
}

export async function deleteSettingKegiatan(id: string): Promise<void> {
    const res = await fetch(
        `${BASE_URL}/api/protected/website/kegiatan?id=${id}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    if (!res.ok) {
        throw new Error('Failed to delete SettingKegiatan')
    }
    return res.json()
}
