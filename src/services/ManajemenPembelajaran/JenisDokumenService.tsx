import { JenisDokumen } from '@/generated/prisma'
import { Pagination } from '@/types/Pagination'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getJenisDokumenPagination(
    page: number,
    limit: number,
    search: string
): Promise<Pagination<JenisDokumen[]>> {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search,
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-pembelajaran/jenis-dokumen?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch jenis dokumen')
    return res.json()
}

export async function getJenisDokumen(): Promise<JenisDokumen[]> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-pembelajaran/jenis-dokumen`
    )
    if (!res.ok) throw new Error('Failed to fetch jenis dokumen')
    return res.json()
}

export async function getJenisDokumenId(
    JenisDokumenId: string
): Promise<JenisDokumen> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-pembelajaran/jenis-dokumen?id=${JenisDokumenId}`
    )
    if (!res.ok) throw new Error('Failed to fetch jenis dokumen')
    return res.json()
}

export async function setJenisDokumen(
    data: JenisDokumen
): Promise<JenisDokumen> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-pembelajaran/jenis-dokumen`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to create jenis dokumen')
    }
    return res.json()
}

export async function updateJenisDokumen(
    data: JenisDokumen
): Promise<JenisDokumen> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-pembelajaran/jenis-dokumen`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to update jenis dokumen')
    }
    return res.json()
}

export async function deleteJenisDokumen(id: string): Promise<void> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-pembelajaran/jenis-dokumen?id=${id}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    if (!res.ok) {
        throw new Error('Failed to delete jenis dokumen')
    }
    return res.json()
}
