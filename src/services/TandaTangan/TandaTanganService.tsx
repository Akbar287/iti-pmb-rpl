import { Pagination } from '@/types/Pagination'
import {
    HasilTandaTanganType,
    PejabatPenandatanganType,
    ResponseTandaTanganSkType,
} from '@/types/TandaTanganTypes'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getTandaTanganPagination(
    page: number,
    limit: number,
    search: string
): Promise<Pagination<ResponseTandaTanganSkType[]>> {
    const params = new URLSearchParams()
    params.append('page', String(page))
    params.append('limit', String(limit))
    params.append('search', search)
    const res = await fetch(
        `${BASE_URL}/api/protected/tanda-tangan?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch data tanda tangan')
    return res.json()
}

export async function getPejabatPenandatangan(
    search: string = ''
): Promise<PejabatPenandatanganType[]> {
    const params = new URLSearchParams({ jenis: 'officials' })
    if (search) params.append('search', search)
    const res = await fetch(
        `${BASE_URL}/api/protected/tanda-tangan?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch daftar pejabat')
    const json = await res.json()
    return json.data ?? []
}

export async function setTandaTanganSk(
    PendaftaranId: string,
    SkRektorId: string,
    OfficialId: number,
    TanggalSk?: string
): Promise<{
    status: string
    message: string
    data: HasilTandaTanganType
}> {
    const res = await fetch(`${BASE_URL}/api/protected/tanda-tangan`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            PendaftaranId: PendaftaranId,
            SkRektorId: SkRektorId,
            OfficialId: OfficialId,
            TanggalSk: TanggalSk,
        }),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.message ?? 'Gagal menandatangani SK')
    return json
}

export async function getFileSkTandaTanganByNamafile(
    NamaFile: string
): Promise<string> {
    const res = await fetch(
        `${BASE_URL}/api/protected/tanda-tangan?file=${NamaFile}`
    )

    if (!res.ok) {
        throw new Error('Failed to get dokumen sk')
    }

    const blob = await res.blob()
    return URL.createObjectURL(blob)
}
