import { UniversityJabatan } from '@/generated/prisma'
import { Pagination } from '@/types/Pagination'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getInstitusiJabatanPagination(
    page: number,
    limit: number,
    search: string
): Promise<Pagination<UniversityJabatan[]>> {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search,
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-institusi/jabatan?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch jabatan institusi')
    return res.json()
}

export async function getInstitusiJabatan(): Promise<UniversityJabatan[]> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-institusi/jabatan`
    )
    if (!res.ok) throw new Error('Failed to fetch jabatan institusi')
    return res.json()
}

export async function getInstitusiJabatanId(
    institusiId: string
): Promise<UniversityJabatan> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-institusi/jabatan?id=${institusiId}`
    )
    if (!res.ok) throw new Error('Failed to fetch jabatan institusi')
    return res.json()
}

export async function setInstitusiJabatan(
    data: UniversityJabatan
): Promise<UniversityJabatan> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-institusi/jabatan`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to create jabatan institusi')
    }
    return res.json()
}

export async function updateInstitusiJabatan(
    data: UniversityJabatan
): Promise<UniversityJabatan> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-institusi/jabatan`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to update jabatan institusi')
    }
    return res.json()
}

export async function deleteInstitusiJabatan(id: string): Promise<void> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-institusi/jabatan?id=${id}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    if (!res.ok) {
        throw new Error('Failed to delete jabatan institusi')
    }
    return res.json()
}
