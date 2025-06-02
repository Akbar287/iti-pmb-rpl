import { AsesorPage, AsesorRequestResponseDTO } from '@/types/AsesorTypes'
import { Pagination } from '@/types/Pagination'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getAsesorPagination(
    page: number,
    limit: number,
    search: string
): Promise<Pagination<AsesorPage[]>> {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search,
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-data/asesor?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch asesor')
    return res.json()
}

export async function getAsesorId(
    AsesorId: string
): Promise<AsesorRequestResponseDTO> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-data/asesor?id=${AsesorId}`
    )
    if (!res.ok) throw new Error('Failed to fetch asesor')
    return res.json()
}

export async function setAsesor(
    data: AsesorRequestResponseDTO
): Promise<AsesorPage> {
    const res = await fetch(`${BASE_URL}/api/protected/manajemen-data/asesor`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        throw new Error('Failed to create asesor')
    }
    return res.json()
}

export async function updateAsesor(
    data: AsesorRequestResponseDTO
): Promise<AsesorPage> {
    const res = await fetch(`${BASE_URL}/api/protected/manajemen-data/asesor`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    return res.json()
}

export async function deleteAsesor(AsesorId: string): Promise<void> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-data/asesor?id=${AsesorId}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    if (!res.ok) {
        throw new Error('Failed to delete asesor')
    }
    return res.json()
}
