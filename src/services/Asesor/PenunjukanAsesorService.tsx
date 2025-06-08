import { Pagination } from '@/types/Pagination'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getAsesorMahasiswaPagination(
    page: number,
    limit: number,
    search: string,
    prodiId: string
): Promise<Pagination<ResponsePenunjukanAsesor[]>> {
    const params = new URLSearchParams()
    params.append('page', String(page))
    params.append('limit', String(limit))
    params.append('search', search)
    if (prodiId) {
        params.append('prodiId', prodiId)
    }
    const res = await fetch(
        `${BASE_URL}/api/protected/asesor/penunjukan-asesor?jenis=get-page-mhs&${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch asesor mahasiswa')
    return res.json()
}

export async function getMahasiswaFromProdiId(
    ProgramStudiId: string
): Promise<ResponseMhsFromAsesor[]> {
    const res = await fetch(
        `${BASE_URL}/api/protected/asesor/penunjukan-asesor?jenis=get-mhs-from-prodiId&prodiId=${ProgramStudiId}`
    )
    if (!res.ok) throw new Error('Failed to fetch mhs')
    return res.json()
}

export async function getAsesorFromProdiId(
    ProgramStudiId: string
): Promise<ResponseAsesorFromProdi[]> {
    const res = await fetch(
        `${BASE_URL}/api/protected/asesor/penunjukan-asesor?jenis=get-asesor-from-prodiId&prodiId=${ProgramStudiId}`
    )
    if (!res.ok) throw new Error('Failed to fetch asesor')
    return res.json()
}

export async function getMahasiswaFromAsesorId(
    asesorId: string
): Promise<ResponseMhsFromAsesor[]> {
    const res = await fetch(
        `${BASE_URL}/api/protected/asesor/penunjukan-asesor?jenis=get-mhs-from-asesorId&asesorId=${asesorId}`
    )
    if (!res.ok) throw new Error('Failed to fetch mhs')
    return res.json()
}

export async function getAsesorFromMahasiswaId(
    mahasiswaId: string
): Promise<ResponseAsesorFromProdi[]> {
    const res = await fetch(
        `${BASE_URL}/api/protected/asesor/penunjukan-asesor?jenis=get-asesor-from-mhsId&mhsId=${mahasiswaId}`
    )
    if (!res.ok) throw new Error('Failed to fetch asesor')
    return res.json()
}

export async function setAsesorMahasiswa(
    data: RequestPenunjukanAsesor
): Promise<ResponsePenunjukanAsesor> {
    const res = await fetch(
        `${BASE_URL}/api/protected/asesor/penunjukan-asesor`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to create asesor mahasiswa')
    }
    return res.json()
}

export async function updateAsesorMahasiswa(
    data: RequestPenunjukanAsesor
): Promise<ResponsePenunjukanAsesor> {
    const res = await fetch(
        `${BASE_URL}/api/protected/asesor/penunjukan-asesor`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    return res.json()
}

export async function deleteAsesorMahasiswa(
    PendaftarId: string
): Promise<void> {
    const res = await fetch(
        `${BASE_URL}/api/protected/asesor/penunjukan-asesor?id=${PendaftarId}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    if (!res.ok) {
        throw new Error('Failed to delete asesor mahasiswa')
    }
    return res.json()
}
