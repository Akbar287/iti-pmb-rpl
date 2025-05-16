import { ProgramStudi } from '@/generated/prisma'
import { Pagination } from '@/types/Pagination'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getProgramStudiPagination(
    page: number,
    limit: number,
    search: string,
    universityId?: string
): Promise<Pagination<ProgramStudi[]>> {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search,
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-pembelajaran/program-studi?${params.toString()}${
            universityId ? '&universityId=' + universityId : ''
        } `
    )
    if (!res.ok) throw new Error('Failed to fetch capaian pembelajaran')
    return res.json()
}

export async function getProgramStudi(): Promise<ProgramStudi[]> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-pembelajaran/program-studi`
    )
    if (!res.ok) throw new Error('Failed to fetch program studi')
    return res.json()
}

export async function getProgramStudiId(
    ProgramStudiId: string
): Promise<ProgramStudi> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-pembelajaran/program-studi?id=${ProgramStudiId}`
    )
    if (!res.ok) throw new Error('Failed to fetch program studi')
    return res.json()
}

export async function getProgramStudiByUniversityId(
    universityId: string
): Promise<ProgramStudi[]> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-pembelajaran/program-studi?universityId=${universityId}`
    )
    if (!res.ok) throw new Error('Failed to fetch program studi')

    return res.json()
}

export async function setProgramStudi(
    data: ProgramStudi
): Promise<ProgramStudi> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-pembelajaran/program-studi`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to create program studi')
    }
    return res.json()
}

export async function updateProgramStudi(
    data: ProgramStudi
): Promise<ProgramStudi> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-pembelajaran/program-studi`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to update program studi')
    }
    return res.json()
}

export async function deleteProgramStudi(id: string): Promise<void> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-pembelajaran/program-studi?id=${id}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    if (!res.ok) {
        throw new Error('Failed to delete program studi')
    }
    return res.json()
}
