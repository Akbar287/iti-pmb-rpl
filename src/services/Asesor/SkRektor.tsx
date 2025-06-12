import { Pagination } from '@/types/Pagination'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getSkRektorAsesorPagination(
    page: number,
    limit: number,
    search: string
): Promise<Pagination<ResponseSkRektorAsesor[]>> {
    const params = new URLSearchParams()
    params.append('page', String(page))
    params.append('limit', String(limit))
    params.append('search', search)
    const res = await fetch(
        `${BASE_URL}/api/protected/asesor/sk?jenis=get-page-sk&${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch sk asesor mahasiswa')
    return res.json()
}

export async function getAsesorMahasiswaPagination(
    page: number,
    limit: number,
    search: string
): Promise<Pagination<ResponseAsesorMahasiswa[]>> {
    const params = new URLSearchParams()
    params.append('page', String(page))
    params.append('limit', String(limit))
    params.append('search', search)
    const res = await fetch(
        `${BASE_URL}/api/protected/asesor/sk?jenis=get-page-mhs-asesor&${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch relasi asesor mahasiswa')
    return res.json()
}

export async function getSkRektorAsesorDetailPagination(
    page: number,
    limit: number,
    search: string,
    SkAsesorId: string
): Promise<Pagination<ResponseSkRektorAsesorDetail[]>> {
    const params = new URLSearchParams()
    params.append('page', String(page))
    params.append('limit', String(limit))
    params.append('search', search)
    params.append('sk-asesor-id', SkAsesorId)
    const res = await fetch(
        `${BASE_URL}/api/protected/asesor/sk?jenis=get-page-mhs-from-sk-asesor-id&${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch sk asesor mahasiswa detail')
    return res.json()
}

export async function getFileBlobByNamafile(NamaFile: string): Promise<string> {
    const res = await fetch(
        `${BASE_URL}/api/protected/asesor/sk?jenis=get-sk-file&filename=${NamaFile}`
    )

    if (!res.ok) {
        throw new Error('Failed to get dokumen bukti form')
    }

    const blob = await res.blob()
    const previewUrl = URL.createObjectURL(blob)
    return previewUrl
}

export async function setSkRektorAsesor(
    data: File,
    NamaSk: string,
    TahunSk: string,
    NomorSk: string,
    ArrayRelation: string[]
): Promise<ResponseSkRektorAsesor> {
    const formData = new FormData()
    formData.append('files', data)
    formData.append('NamaSk', NamaSk)
    formData.append('TahunSk', TahunSk)
    formData.append('NomorSk', NomorSk)
    formData.append('ArrayRelation', JSON.stringify(ArrayRelation))

    const res = await fetch(`${BASE_URL}/api/protected/asesor/sk`, {
        method: 'POST',
        body: formData,
    })
    if (!res.ok) {
        throw new Error('Failed to post sk asesor data')
    }
    return res.json()
}

export async function deleteSkRektorAsesor(SkRektorId: string): Promise<{
    status: string
    message: string
    data: any
}> {
    const res = await fetch(
        `${BASE_URL}/api/protected/asesor/sk?id=${SkRektorId}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    if (!res.ok) {
        throw new Error('Failed to delete a file sk asesor')
    }
    return res.json()
}
