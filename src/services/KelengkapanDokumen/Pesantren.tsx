import { Pesantren } from '@/generated/prisma'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getPesantren(): Promise<Pesantren[]> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/pesantren`
    )
    if (!res.ok) throw new Error('Failed to fetch pesantren')
    return res.json()
}

export async function getPesantrenId(PesantrenId: string): Promise<Pesantren> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/pesantren?id=${PesantrenId}`
    )
    if (!res.ok) throw new Error('Failed to fetch pesantren')
    return res.json()
}

export async function getPesantrenByPendaftaranId(
    pendaftaranId: string
): Promise<Pesantren[]> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/pesantren?pendaftaranId=${pendaftaranId}`
    )
    if (!res.ok) throw new Error('Failed to fetch pesantren')
    return res.json()
}

export async function setPesantren(data: Pesantren): Promise<Pesantren> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/pesantren`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to create pesantren')
    }
    return res.json()
}

export async function updatePesantren(data: Pesantren): Promise<Pesantren> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/pesantren`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to update pesantren')
    }
    return res.json()
}

export async function deletePesantren(id: string): Promise<Pesantren> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/pesantren?id=${id}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    if (!res.ok) {
        throw new Error('Failed to delete pesantren')
    }
    return res.json()
}
