import { SkRektor } from '@/generated/prisma'
import { ResponseSkRektorAsessmenType } from '@/types/FinalAsessmen'
import { Pagination } from '@/types/Pagination'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function sendWaHasilAsessmenToMahasiswa(
    PendaftaranId: string,
): Promise<void> {
    const params = new URLSearchParams()
    params.append('PendaftaranId', PendaftaranId)
    params.append('jenis', 'wa')
    const res = await fetch(
        `${BASE_URL}/api/protected/asessment/sk-rektor?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch sk rektor')
    return res.json()
}

export async function getSkAsessmenPagination(
    page: number,
    limit: number,
    search: string
): Promise<Pagination<ResponseSkRektorAsessmenType[]>> {
    const params = new URLSearchParams()
    params.append('page', String(page))
    params.append('limit', String(limit))
    params.append('search', search)
    params.append('jenis', 'get-sk-rektor')
    const res = await fetch(
        `${BASE_URL}/api/protected/asessment/sk-rektor?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch sk rektor')
    return res.json()
}

export async function getSkAsessmenMahasiswaPagination(
    page: number,
    limit: number,
    search: string
): Promise<Pagination<ResponseSkRektorAsessmenType[]>> {
    const params = new URLSearchParams()
    params.append('page', String(page))
    params.append('limit', String(limit))
    params.append('search', search)
    params.append('_m', 'true')
    params.append('jenis', 'get-sk-rektor')
    const res = await fetch(
        `${BASE_URL}/api/protected/asessment/sk-rektor?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch sk rektor')
    return res.json()
}

export async function getSkAsessmenAsesorRolePagination(
    page: number,
    limit: number,
    search: string
): Promise<Pagination<ResponseSkRektorAsessmenType[]>> {
    const params = new URLSearchParams()
    params.append('page', String(page))
    params.append('limit', String(limit))
    params.append('search', search)
    params.append('_a', 'true')
    params.append('jenis', 'get-sk-rektor')
    const res = await fetch(
        `${BASE_URL}/api/protected/asessment/sk-rektor?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch sk rektor')
    return res.json()
}

export async function getSkAsessmenAkademikRolePagination(
    page: number,
    limit: number,
    search: string
): Promise<Pagination<ResponseSkRektorAsessmenType[]>> {
    const params = new URLSearchParams()
    params.append('page', String(page))
    params.append('limit', String(limit))
    params.append('search', search)
    params.append('_k', 'true')
    params.append('jenis', 'get-sk-rektor')
    const res = await fetch(
        `${BASE_URL}/api/protected/asessment/sk-rektor?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch sk rektor')
    return res.json()
}

export async function getFileSkAsessmenBlobByNamafile(
    NamaFile: string
): Promise<string> {
    const res = await fetch(
        `${BASE_URL}/api/protected/asessment/sk-rektor?jenis=_f&_f=${NamaFile}`
    )

    if (!res.ok) {
        throw new Error('Failed to get dokumen sk asessmen')
    }

    const blob = await res.blob()
    const previewUrl = URL.createObjectURL(blob)
    return previewUrl
}

export async function getSelesaiPagination(
    page: number,
    limit: number,
    search: string
): Promise<Pagination<ResponseSkRektorAsessmenType[]>> {
    const params = new URLSearchParams()
    params.append('page', String(page))
    params.append('limit', String(limit))
    params.append('search', search)
    const res = await fetch(
        `${BASE_URL}/api/protected/asessment/selesai?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch sk rektor')
    return res.json()
}

export async function setFile(
    data: File,
    PendaftaranId: string,
    NamaSk: string,
    TahunSk: string,
    NomorSk: string
): Promise<{
    status: string; message: string; data: SkRektor
}> {
    const formData = new FormData()
    formData.append('files', data)
    formData.append('PendaftaranId', PendaftaranId)
    formData.append('NamaSk', NamaSk)
    formData.append('TahunSk', TahunSk)
    formData.append('NomorSk', NomorSk)

    const res = await fetch(`${BASE_URL}/api/protected/asessment/sk-rektor`, {
        method: 'POST',
        body: formData,
    })
    if (!res.ok) throw new Error('Failed to fetch sk rektor')
    return res.json()
}
