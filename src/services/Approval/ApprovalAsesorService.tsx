import { Pagination } from '@/types/Pagination'
import {
    ResponsePenunjukanAsesorForWarek
} from '@/types/PenunjukanAsesor'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getAsesorMahasiswaWarekPagination(
    page: number,
    limit: number,
    search: string
): Promise<Pagination<ResponsePenunjukanAsesorForWarek[]>> {
    const params = new URLSearchParams()
    params.append('page', String(page))
    params.append('limit', String(limit))
    params.append('search', search)
    const res = await fetch(
        `${BASE_URL}/api/protected/approval/asesor?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch asesor mahasiswa')
    return res.json()
}

export async function setPersetujuanAsesor(
    PendaftaranId: string,
    approval: boolean,
    catatan: string
): Promise<{
    status: string, message: string; data: any[]
}> { 
    const res = await fetch(
        `${BASE_URL}/api/protected/approval/asesor`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pendaftaranId: PendaftaranId,
                approval: approval,
                catatan: catatan,
            }),
        }
    )
    if (!res.ok) throw new Error('Failed to fetch asesor mahasiswa')
    return res.json()
}