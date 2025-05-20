import { UniversityJabatanOrang } from '@/generated/prisma'
import { Pagination } from '@/types/Pagination'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getInstitusiJabatanOrangPagination(
    page: number,
    limit: number,
    search: string
): Promise<Pagination<UniversityJabatanOrang[]>> {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search,
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-institusi/jabatan-orang?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch jabatan institusi orang')
    return res.json()
}

export async function getInstitusiJabatanOrang(): Promise<
    UniversityJabatanOrang[]
> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-institusi/jabatan-orang`
    )
    if (!res.ok) throw new Error('Failed to fetch jabatan institusi orang')
    return res.json()
}

export async function getInstitusiJabatanOrangId(
    institusiId: string
): Promise<UniversityJabatanOrang> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-institusi/jabatan-orang?id=${institusiId}`
    )
    if (!res.ok) throw new Error('Failed to fetch jabatan institusi orang')
    return res.json()
}

export async function setInstitusiJabatanOrang(
    data: UniversityJabatanOrang
): Promise<UniversityJabatanOrang> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-institusi/jabatan-orang`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to create jabatan institusi orang')
    }
    return res.json()
}

export async function updateInstitusiJabatanOrang(
    data: UniversityJabatanOrang
): Promise<UniversityJabatanOrang> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-institusi/jabatan-orang`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to update jabatan institusi orang')
    }
    return res.json()
}

export async function deleteInstitusiJabatanOrang(id: string): Promise<void> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-institusi/jabatan-orang?id=${id}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    if (!res.ok) {
        throw new Error('Failed to delete jabatan institusi orang')
    }
    return res.json()
}
