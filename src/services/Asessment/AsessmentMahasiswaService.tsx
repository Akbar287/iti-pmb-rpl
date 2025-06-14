import { Pagination } from '@/types/Pagination'
import { ResponseMhsFromAsesorSession } from '@/types/PenunjukanAsesor'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getMahasiswaFromAsesor(
    page: number,
    limit: number,
    search: string
): Promise<Pagination<ResponseMhsFromAsesorSession[]>> {
    const params = new URLSearchParams()
    params.append('page', String(page))
    params.append('limit', String(limit))
    params.append('search', search)
    const res = await fetch(
        `${BASE_URL}/api/protected/asessment/asessmen-mahasiswa?jenis=get-mhs-from-asesor&${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch mahasiswa from asesor')
    return res.json()
}
