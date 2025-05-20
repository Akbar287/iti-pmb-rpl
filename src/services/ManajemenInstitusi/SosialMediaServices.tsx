import { UniversitySosialMedia } from '@/generated/prisma'
import { Pagination } from '@/types/Pagination'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getInstitusiSosialMediaPagination(
    page: number,
    limit: number,
    search: string
): Promise<Pagination<UniversitySosialMedia[]>> {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search,
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-institusi/sosial-media?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch institusi sosial media')
    return res.json()
}

export async function getInstitusiSosialMedia(): Promise<
    UniversitySosialMedia[]
> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-institusi/sosial-media`
    )
    if (!res.ok) throw new Error('Failed to fetch institusi sosial media')
    return res.json()
}

export async function getInstitusiSosialMediaId(
    institusiId: string
): Promise<UniversitySosialMedia> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-institusi/sosial-media?id=${institusiId}`
    )
    if (!res.ok) throw new Error('Failed to fetch institusi sosial media')
    return res.json()
}

export async function setInstitusiSosialMedia(
    data: UniversitySosialMedia
): Promise<UniversitySosialMedia> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-institusi/sosial-media`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to create institusi sosial media')
    }
    return res.json()
}

export async function updateInstitusiSosialMedia(
    data: UniversitySosialMedia
): Promise<UniversitySosialMedia> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-institusi/sosial-media`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to update institusi sosial media')
    }
    return res.json()
}

export async function deleteInstitusiSosialMedia(id: string): Promise<void> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-institusi/sosial-media?id=${id}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    if (!res.ok) {
        throw new Error('Failed to delete institusi sosial media')
    }
    return res.json()
}
