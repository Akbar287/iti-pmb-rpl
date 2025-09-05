import { SettingNumber } from '@/generated/prisma'
import { Pagination } from '@/types/Pagination'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getSettingNumberPagination(
    SettingMainPageId: string,
    page: number,
    limit: number,
    search: string
): Promise<Pagination<SettingNumber[]>> {
    const params = new URLSearchParams({
        id: SettingMainPageId,
        page: String(page),
        limit: String(limit),
        search,
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/website/angka?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch SettingNumber')
    return res.json()
}

export async function getSettingNumber(): Promise<SettingNumber[]> {
    const res = await fetch(`${BASE_URL}/api/protected/website/angka`)
    if (!res.ok) throw new Error('Failed to fetch SettingNumber')
    return res.json()
}

export async function getSettingNumberId(
    SettingNumberId: string
): Promise<SettingNumber> {
    const res = await fetch(
        `${BASE_URL}/api/protected/website/angka?id=${SettingNumberId}`
    )
    if (!res.ok) throw new Error('Failed to fetch SettingNumber')
    return res.json()
}

export async function setSettingNumber(
    data: SettingNumber
): Promise<SettingNumber> {
    const res = await fetch(`${BASE_URL}/api/protected/website/angka`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        throw new Error('Failed to create SettingNumber')
    }
    return res.json()
}

export async function updateSettingNumber(
    data: SettingNumber
): Promise<SettingNumber> {
    const res = await fetch(`${BASE_URL}/api/protected/website/angka`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        throw new Error('Failed to update SettingNumber')
    }
    return res.json()
}

export async function deleteSettingNumber(id: string): Promise<void> {
    const res = await fetch(
        `${BASE_URL}/api/protected/website/angka?id=${id}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    if (!res.ok) {
        throw new Error('Failed to delete SettingNumber')
    }
    return res.json()
}
