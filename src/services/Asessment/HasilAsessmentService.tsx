import {
    ResponseFinalAsessmenAsesorPaginationType,
    ResponseFinalAsessmenPaginationType,
} from '@/types/FinalAsessmen'
import { Pagination } from '@/types/Pagination'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getResponseFinalAsessmenPaginationType(
    page: number,
    limit: number,
    search: string,
    roleId: string
): Promise<Pagination<ResponseFinalAsessmenPaginationType[]>> {
    const params = new URLSearchParams()
    params.append('page', String(page))
    params.append('limit', String(limit))
    params.append('search', search)
    params.append('r', roleId)
    params.append('jenis', 'get-sanggahan')
    const res = await fetch(
        `${BASE_URL}/api/protected/asessment/hasil-asessment?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch hasil asessmen')
    return res.json()
}

export async function getResponseFinalAsessmenAsesorPaginationType(
    page: number,
    limit: number,
    search: string,
    roleId: string
): Promise<Pagination<ResponseFinalAsessmenAsesorPaginationType[]>> {
    const params = new URLSearchParams()
    params.append('page', String(page))
    params.append('limit', String(limit))
    params.append('search', search)
    params.append('r', roleId)
    params.append('jenis', 'get-sanggahan')
    const res = await fetch(
        `${BASE_URL}/api/protected/asessment/hasil-asessment?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch hasil asessmen')
    return res.json()
}
