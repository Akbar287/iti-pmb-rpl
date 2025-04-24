import { MahasiswaPendidikan } from '@/generated/prisma'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getMahasiswaPendidikan(): Promise<MahasiswaPendidikan[]> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/pendidikan`
    )
    if (!res.ok) throw new Error('Failed to fetch pendidikan mahasiswa')
    return res.json()
}

export async function getMahasiswaPendidikanId(
    MahasiswaPendidikanId: string
): Promise<MahasiswaPendidikan> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/pendidikan?id=${MahasiswaPendidikanId}`
    )
    if (!res.ok) throw new Error('Failed to fetch pendidikan mahasiswa')
    return res.json()
}

export async function getMahasiswaPendidikanByPendaftaranId(
    pendaftaranId: string
): Promise<MahasiswaPendidikan[]> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/pendidikan?pendaftaranId=${pendaftaranId}`
    )
    if (!res.ok) throw new Error('Failed to fetch pendidikan mahasiswa')
    return res.json()
}

export async function setMahasiswaPendidikan(
    data: MahasiswaPendidikan
): Promise<MahasiswaPendidikan> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/pendidikan`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to create pendidikan mahasiswa')
    }
    return res.json()
}

export async function updateMahasiswaPendidikan(
    data: MahasiswaPendidikan
): Promise<MahasiswaPendidikan> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/pendidikan`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to update pendidikan mahasiswa')
    }
    return res.json()
}

export async function deleteMahasiswaPendidikan(id: string): Promise<void> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/pendidikan?id=${id}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    if (!res.ok) {
        throw new Error('Failed to delete pendidikan mahasiswa')
    }
    return res.json()
}
