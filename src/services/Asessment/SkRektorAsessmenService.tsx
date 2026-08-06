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

export type SkAsessmenTerbitType = {
    SkRektorId: string
    JenisSkAsessmen: 'PEROLEHAN_SKS' | 'TRANSFER_SKS'
    NamaSk: string
    NomorSk: string
    TahunSk: number
    NamaFile: string
    NamaDokumen: string
    Disetujui: boolean
    Catatan: string
}

export async function terbitkanSkAsessmen(
    PendaftaranId: string,
    JenisSkAsessmen: 'PEROLEHAN_SKS' | 'TRANSFER_SKS',
    NamaSk: string,
    NomorSk: string,
    TahunSk: string
): Promise<{ status: string; message: string; data: SkAsessmenTerbitType }> {
    const res = await fetch(
        `${BASE_URL}/api/protected/asessment/sk-rektor?jenis=terbitkan`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                PendaftaranId,
                JenisSkAsessmen,
                NamaSk,
                NomorSk,
                TahunSk,
            }),
        }
    )
    const json = await res.json()
    if (!res.ok) throw new Error(json.message ?? 'Gagal menerbitkan SK')
    return json
}

export async function setPublikasiSkAsessmen(
    PendaftaranId: string,
    Publikasikan: boolean
): Promise<{ status: string; message: string; data: { Dipublikasikan: boolean } }> {
    const res = await fetch(
        `${BASE_URL}/api/protected/asessment/sk-rektor?jenis=publikasi`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ PendaftaranId, Publikasikan }),
        }
    )
    const json = await res.json()
    if (!res.ok) throw new Error(json.message ?? 'Gagal mengubah publikasi SK')
    return json
}
