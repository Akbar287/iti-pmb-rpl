import { MataKuliah } from '@/generated/prisma'
import { Pagination } from '@/types/Pagination'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getMataKuliahPagination(
    page: number,
    limit: number,
    search: string,
    programStudiId?: string
): Promise<Pagination<MataKuliah[]>> {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search,
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-pembelajaran/mata-kuliah?${params.toString()}${
            programStudiId ? '&programStudiId=' + programStudiId : ''
        } `
    )
    if (!res.ok) throw new Error('Failed to fetch capaian pembelajaran')
    return res.json()
}

export async function getMataKuliah(): Promise<MataKuliah[]> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-pembelajaran/mata-kuliah`
    )
    if (!res.ok) throw new Error('Failed to fetch mata kuliah')
    return res.json()
}

export async function getMataKuliahId(
    MataKuliahId: string
): Promise<MataKuliah> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-pembelajaran/mata-kuliah?id=${MataKuliahId}`
    )
    if (!res.ok) throw new Error('Failed to fetch mata kuliah')
    return res.json()
}

export async function getMataKuliahByProgramStudiId(
    ProgramStudiId: string
): Promise<MataKuliah[]> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-pembelajaran/mata-kuliah?programStudiId=${ProgramStudiId}`
    )
    if (!res.ok) throw new Error('Failed to fetch mata kuliah')

    return res.json()
}

export async function setMataKuliah(data: MataKuliah): Promise<MataKuliah> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-pembelajaran/mata-kuliah`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to create mata kuliah')
    }
    return res.json()
}

export async function updateMataKuliah(data: MataKuliah): Promise<MataKuliah> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-pembelajaran/mata-kuliah`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to update mata kuliah')
    }
    return res.json()
}

export async function deleteMataKuliah(id: string): Promise<void> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-pembelajaran/mata-kuliah?id=${id}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    if (!res.ok) {
        throw new Error('Failed to delete mata kuliah')
    }
    return res.json()
}
