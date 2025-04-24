import { MahasiswaOrganisasiProfesi } from '@/generated/prisma'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getMahasiswaOrganisasiProfesi(): Promise<
    MahasiswaOrganisasiProfesi[]
> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/organisasi-profesi`
    )
    if (!res.ok) throw new Error('Failed to fetch organisasi profesi')
    return res.json()
}

export async function getMahasiswaOrganisasiProfesiId(
    MahasiswaOrganisasiProfesiId: string
): Promise<MahasiswaOrganisasiProfesi> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/organisasi-profesi?id=${MahasiswaOrganisasiProfesiId}`
    )
    if (!res.ok) throw new Error('Failed to fetch organisasi profesi')
    return res.json()
}

export async function getMahasiswaOrganisasiProfesiByPendaftaranId(
    pendaftaranId: string
): Promise<MahasiswaOrganisasiProfesi[]> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/organisasi-profesi?pendaftaranId=${pendaftaranId}`
    )
    if (!res.ok) throw new Error('Failed to fetch organisasi profesi')
    return res.json()
}

export async function setMahasiswaOrganisasiProfesi(
    data: MahasiswaOrganisasiProfesi
): Promise<MahasiswaOrganisasiProfesi> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/organisasi-profesi`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to create organisasi profesi')
    }
    return res.json()
}

export async function updateMahasiswaOrganisasiProfesi(
    data: MahasiswaOrganisasiProfesi
): Promise<MahasiswaOrganisasiProfesi> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/organisasi-profesi`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to update organisasi profesi')
    }
    return res.json()
}

export async function deleteMahasiswaOrganisasiProfesi(
    id: string
): Promise<void> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/organisasi-profesi?id=${id}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    if (!res.ok) {
        throw new Error('Failed to delete organisasi profesi')
    }
    return res.json()
}
