import { PekerjaanMahasiswa } from '@/generated/prisma'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getPekerjaanMahasiswa(): Promise<PekerjaanMahasiswa[]> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/pekerjaan`
    )
    if (!res.ok) throw new Error('Failed to fetch pekerjaan')
    return res.json()
}

export async function getPekerjaanMahasiswaId(
    PekerjaanMahasiswaId: string
): Promise<PekerjaanMahasiswa> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/pekerjaan?id=${PekerjaanMahasiswaId}`
    )
    if (!res.ok) throw new Error('Failed to fetch pekerjaan')
    return res.json()
}

export async function getPekerjaanMahasiswaByPendaftaranId(
    pendaftaranId: string
): Promise<PekerjaanMahasiswa[]> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/pekerjaan?pendaftaranId=${pendaftaranId}`
    )
    if (!res.ok) throw new Error('Failed to fetch pekerjaan')
    return res.json()
}

export async function setPekerjaanMahasiswa(
    data: PekerjaanMahasiswa
): Promise<PekerjaanMahasiswa> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/pekerjaan`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to create pekerjaan')
    }
    return res.json()
}

export async function updatePekerjaanMahasiswa(
    data: PekerjaanMahasiswa
): Promise<PekerjaanMahasiswa> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/pekerjaan`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to update pekerjaan')
    }
    return res.json()
}

export async function deletePekerjaanMahasiswa(id: string): Promise<void> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/pekerjaan?id=${id}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    if (!res.ok) {
        throw new Error('Failed to delete pekerjaan')
    }
    return res.json()
}
