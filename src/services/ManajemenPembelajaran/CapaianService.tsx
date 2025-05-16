import { CapaianPembelajaran } from '@/generated/prisma'
import { Pagination } from '@/types/Pagination'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getCapaianPembelajaranPagination(
    page: number,
    limit: number,
    search: string,
    mataKuliahId?: string
): Promise<Pagination<CapaianPembelajaran[]>> {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search,
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-pembelajaran/capaian-pembelajaran?${params.toString()}${
            mataKuliahId ? '&mataKuliahId=' + mataKuliahId : ''
        } `
    )
    if (!res.ok) throw new Error('Failed to fetch capaian pembelajaran')
    return res.json()
}

export async function getCapaianPembelajaran(): Promise<CapaianPembelajaran[]> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-pembelajaran/capaian-pembelajaran`
    )
    if (!res.ok) throw new Error('Failed to fetch capaian pembelajaran')
    return res.json()
}

export async function getCapaianPembelajaranId(
    CapaianPembelajaranId: string
): Promise<CapaianPembelajaran> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-pembelajaran/capaian-pembelajaran?id=${CapaianPembelajaranId}`
    )
    if (!res.ok) throw new Error('Failed to fetch capaian pembelajaran')
    return res.json()
}

export async function getCapaianPembelajaranByMataKuliahId(
    MataKuliahId: string
): Promise<CapaianPembelajaran[]> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-pembelajaran/capaian-pembelajaran?mataKuliahId=${MataKuliahId}`
    )
    if (!res.ok) throw new Error('Failed to fetch capaian pembelajaran')

    return res.json()
}

export async function setCapaianPembelajaran(
    data: CapaianPembelajaran
): Promise<CapaianPembelajaran> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-pembelajaran/capaian-pembelajaran`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to create capaian pembelajaran')
    }
    return res.json()
}

export async function updateCapaianPembelajaran(
    data: CapaianPembelajaran
): Promise<CapaianPembelajaran> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-pembelajaran/capaian-pembelajaran`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to update capaian pembelajaran')
    }
    return res.json()
}

export async function deleteCapaianPembelajaran(id: string): Promise<void> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-pembelajaran/capaian-pembelajaran?id=${id}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    if (!res.ok) {
        throw new Error('Failed to delete capaian pembelajaran')
    }
    return res.json()
}
