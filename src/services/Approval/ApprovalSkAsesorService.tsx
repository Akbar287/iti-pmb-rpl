import { Pagination } from '@/types/Pagination'
import { ResponseSkAsesorForWarek } from '@/types/PenunjukanAsesor'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getSkAsesorWarekPagination(
    page: number,
    limit: number,
    search: string
): Promise<Pagination<ResponseSkAsesorForWarek[]>> {
    const params = new URLSearchParams()
    params.append('page', String(page))
    params.append('limit', String(limit))
    params.append('search', search)
    const res = await fetch(
        `${BASE_URL}/api/protected/approval/sk-asesor?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch sk asesor')
    return res.json()
}

export async function setPersetujuanSkAsesor(
    SkRektorId: string,
    approval: boolean,
    catatan: string
): Promise<{ status: string; message: string; data: any[] }> {
    const res = await fetch(`${BASE_URL}/api/protected/approval/sk-asesor`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            SkRektorId: SkRektorId,
            approval: approval,
            catatan: catatan,
        }),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.message ?? 'Gagal menyimpan persetujuan')
    return json
}

export async function getFileSkAsesorBlobByNamafile(
    NamaFile: string
): Promise<string> {
    const res = await fetch(
        `${BASE_URL}/api/protected/approval/sk-asesor?file=${NamaFile}`
    )

    if (!res.ok) {
        throw new Error('Failed to get dokumen sk asesor')
    }

    const blob = await res.blob()
    return URL.createObjectURL(blob)
}
