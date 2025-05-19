import {
    InstitusiRequestType,
    InstitusiResponseType,
} from '@/types/ManajemenInstitusiType'
import { Pagination } from '@/types/Pagination'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getInstitusiPagination(
    page: number,
    limit: number,
    search: string
): Promise<Pagination<InstitusiResponseType[]>> {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search,
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-institusi/institusi?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch institusi')
    return res.json()
}

export async function getInstitusi(): Promise<InstitusiResponseType[]> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-institusi/institusi`
    )
    if (!res.ok) throw new Error('Failed to fetch institusi')
    return res.json()
}

export async function getInstitusiId(
    institusiId: string
): Promise<InstitusiResponseType> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-institusi/institusi?id=${institusiId}`
    )
    if (!res.ok) throw new Error('Failed to fetch institusi')
    return res.json()
}

export async function setInstitusi(
    data: InstitusiRequestType
): Promise<InstitusiResponseType> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-institusi/institusi`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to create institusi')
    }
    return res.json()
}

export async function updateInstitusi(
    data: InstitusiRequestType
): Promise<InstitusiResponseType> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-institusi/institusi`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to update institusi')
    }
    return res.json()
}

export async function deleteInstitusi(id: string): Promise<void> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-institusi/institusi?id=${id}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    if (!res.ok) {
        throw new Error('Failed to delete institusi')
    }
    return res.json()
}
