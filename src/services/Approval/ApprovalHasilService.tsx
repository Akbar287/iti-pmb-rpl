import { Pagination } from "@/types/Pagination"
import { ResponseHasilAsessmenForWarek } from "@/types/PenunjukanAsesor"
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getHasilFinalWarekPagination(
    page: number,
    limit: number,
    search: string
): Promise<Pagination<ResponseHasilAsessmenForWarek[]>> {
    const params = new URLSearchParams()
    params.append('page', String(page))
    params.append('limit', String(limit))
    params.append('search', search)
    const res = await fetch(
        `${BASE_URL}/api/protected/approval/hasil?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch asesor mahasiswa')
    return res.json()
}

export async function setPersetujuanHasilFinal(
    PendaftaranId: string,
    approval: boolean,
    catatan: string
): Promise<{
    status: string, message: string; data: any[]
}> { 
    const res = await fetch(
        `${BASE_URL}/api/protected/approval/hasil`, {
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

export async function getFileSkBlobByNamafile(NamaFile: string): Promise<string> {
    const res = await fetch(
        `${BASE_URL}/api/protected/approval/hasil?file=${NamaFile}`
    )

    if (!res.ok) {
        throw new Error('Failed to get dokumen bukti form')
    }

    const blob = await res.blob()
    const previewUrl = URL.createObjectURL(blob)
    return previewUrl
}
