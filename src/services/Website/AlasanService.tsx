import { SettingWhy } from '@/generated/prisma'
import { Pagination } from '@/types/Pagination'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getSettingWhyPagination(
    page: number,
    limit: number,
    search: string
): Promise<Pagination<SettingWhy[]>> {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search,
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/website/alasan?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch SettingWhy')
    return res.json()
}

export async function getSettingWhy(): Promise<SettingWhy[]> {
    const res = await fetch(`${BASE_URL}/api/protected/website/alasan`)
    if (!res.ok) throw new Error('Failed to fetch SettingWhy')
    return res.json()
}

export async function getSettingWhyId(
    SettingWhyId: string
): Promise<SettingWhy> {
    const res = await fetch(
        `${BASE_URL}/api/protected/website/alasan?id=${SettingWhyId}`
    )
    if (!res.ok) throw new Error('Failed to fetch SettingWhy')
    return res.json()
}

export async function setSettingWhy(data: SettingWhy): Promise<SettingWhy> {
    const res = await fetch(`${BASE_URL}/api/protected/website/alasan`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        throw new Error('Failed to create SettingWhy')
    }
    return res.json()
}

export async function updateSettingWhy(data: SettingWhy): Promise<SettingWhy> {
    const res = await fetch(`${BASE_URL}/api/protected/website/alasan`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        throw new Error('Failed to update SettingWhy')
    }
    return res.json()
}

export async function deleteSettingWhy(id: string): Promise<void> {
    const res = await fetch(
        `${BASE_URL}/api/protected/website/alasan?id=${id}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    if (!res.ok) {
        throw new Error('Failed to delete SettingWhy')
    }
    return res.json()
}
