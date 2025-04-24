import { MahasiswaKonferensi } from '@/generated/prisma'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getMahasiswaKonferensi(): Promise<MahasiswaKonferensi[]> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/konferensi-seminar`
    )
    if (!res.ok) throw new Error('Failed to fetch konferensi seminar')
    return res.json()
}

export async function getMahasiswaKonferensiId(
    MahasiswaKonferensiId: string
): Promise<MahasiswaKonferensi> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/konferensi-seminar?id=${MahasiswaKonferensiId}`
    )
    if (!res.ok) throw new Error('Failed to fetch konferensi seminar')
    return res.json()
}

export async function getMahasiswaKonferensiByPendaftaranId(
    pendaftaranId: string
): Promise<MahasiswaKonferensi[]> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/konferensi-seminar?pendaftaranId=${pendaftaranId}`
    )
    if (!res.ok) throw new Error('Failed to fetch konferensi seminar')
    return res.json()
}

export async function setMahasiswaKonferensi(
    data: MahasiswaKonferensi
): Promise<MahasiswaKonferensi> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/konferensi-seminar`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to create konferensi seminar')
    }
    return res.json()
}

export async function updateMahasiswaKonferensi(
    data: MahasiswaKonferensi
): Promise<MahasiswaKonferensi> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/konferensi-seminar`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to update konferensi seminar')
    }
    return res.json()
}

export async function deleteMahasiswaKonferensi(id: string): Promise<void> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/konferensi-seminar?id=${id}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    if (!res.ok) {
        throw new Error('Failed to delete konferensi seminar')
    }
    return res.json()
}
