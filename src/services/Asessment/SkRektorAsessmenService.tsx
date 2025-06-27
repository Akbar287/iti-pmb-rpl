import { ResponseSkRektorAsessmenType } from '@/types/FinalAsessmen'
import { Pagination } from '@/types/Pagination'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getSkAsessmenPagination(
    page: number,
    limit: number,
    search: string,
    ProgramStudiId: string
): Promise<Pagination<ResponseSkRektorAsessmenType[]>> {
    const params = new URLSearchParams()
    params.append('page', String(page))
    params.append('limit', String(limit))
    params.append('search', search)
    params.append('program-studi', ProgramStudiId)
    params.append('jenis', 'get-sk-rektor')
    const res = await fetch(
        `${BASE_URL}/api/protected/asessment/sk-rektor?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch sk rektor')
    return res.json()
}
