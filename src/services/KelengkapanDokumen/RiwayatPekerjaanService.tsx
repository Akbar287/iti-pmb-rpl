import { MahasiswaRiwayatPekerjaan } from '@/generated/prisma'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getMahasiswaRiwayatPekerjaan(): Promise<
    MahasiswaRiwayatPekerjaan[]
> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/riwayat-pekerjaan`
    )
    if (!res.ok) throw new Error('Failed to fetch riwayat pekerjaan')
    return res.json()
}

export async function getMahasiswaRiwayatPekerjaanId(
    MahasiswaRiwayatPekerjaanId: string
): Promise<MahasiswaRiwayatPekerjaan> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/riwayat-pekerjaan?id=${MahasiswaRiwayatPekerjaanId}`
    )
    if (!res.ok) throw new Error('Failed to fetch riwayat pekerjaan')
    return res.json()
}

export async function getMahasiswaRiwayatPekerjaanByPendaftaranId(
    pendaftaranId: string
): Promise<MahasiswaRiwayatPekerjaan[]> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/riwayat-pekerjaan?pendaftaranId=${pendaftaranId}`
    )
    if (!res.ok) throw new Error('Failed to fetch riwayat pekerjaan')
    return res.json()
}

export async function setMahasiswaRiwayatPekerjaan(
    data: MahasiswaRiwayatPekerjaan
): Promise<MahasiswaRiwayatPekerjaan> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/riwayat-pekerjaan`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to create riwayat pekerjaan')
    }
    return res.json()
}

export async function updateMahasiswaRiwayatPekerjaan(
    data: MahasiswaRiwayatPekerjaan
): Promise<MahasiswaRiwayatPekerjaan> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/riwayat-pekerjaan`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to update riwayat pekerjaan')
    }
    return res.json()
}

export async function deleteMahasiswaRiwayatPekerjaan(
    id: string
): Promise<void> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/riwayat-pekerjaan?id=${id}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    if (!res.ok) {
        throw new Error('Failed to delete riwayat pekerjaan')
    }
    return res.json()
}
