import { Pagination } from '@/types/Pagination'
import { ResponseSkHasilForWarek } from '@/types/FinalAsessmen'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getSkHasilWarekPagination(
    page: number,
    limit: number,
    search: string
): Promise<Pagination<ResponseSkHasilForWarek[]>> {
    const params = new URLSearchParams()
    params.append('page', String(page))
    params.append('limit', String(limit))
    params.append('search', search)
    const res = await fetch(
        `${BASE_URL}/api/protected/approval/sk-hasil?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch sk hasil asesmen')
    return res.json()
}

export async function setPersetujuanSkHasil(
    SkRektorId: string,
    PendaftaranId: string,
    approval: boolean,
    catatan: string
): Promise<{
    status: string
    message: string
    data: { SemuaDisetujui: boolean; SisaBelumDisetujui: number }
}> {
    const res = await fetch(`${BASE_URL}/api/protected/approval/sk-hasil`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            SkRektorId,
            PendaftaranId,
            approval,
            catatan,
        }),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.message ?? 'Gagal menyimpan persetujuan')
    return json
}

export async function getFileSkHasilBlobByNamafile(
    NamaFile: string
): Promise<string> {
    const res = await fetch(
        `${BASE_URL}/api/protected/approval/sk-hasil?file=${NamaFile}`
    )
    if (!res.ok) throw new Error('Failed to get dokumen sk hasil')
    const blob = await res.blob()
    return URL.createObjectURL(blob)
}
