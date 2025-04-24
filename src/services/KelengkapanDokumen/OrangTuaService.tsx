import { OrangTua } from '@/generated/prisma'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getOrangTua(): Promise<OrangTua[]> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/orang-tua`
    )
    if (!res.ok) throw new Error('Failed to fetch orang tua')
    return res.json()
}

export async function getOrangTuaId(OrangTuaId: string): Promise<OrangTua> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/orang-tua?id=${OrangTuaId}`
    )
    if (!res.ok) throw new Error('Failed to fetch orang tua')
    return res.json()
}

export async function getOrangTuaByPendaftaranId(
    pendaftaranId: string
): Promise<OrangTua[]> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/orang-tua?pendaftaranId=${pendaftaranId}`
    )
    if (!res.ok) throw new Error('Failed to fetch orang tua')
    return res.json()
}

export async function setOrangTua(data: OrangTua): Promise<OrangTua> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/orang-tua`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to create orang tua')
    }
    return res.json()
}

export async function updateOrangTua(data: OrangTua): Promise<OrangTua> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/orang-tua`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to update orang tua')
    }
    return res.json()
}

export async function deleteOrangTua(id: string): Promise<void> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/orang-tua?id=${id}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    if (!res.ok) {
        throw new Error('Failed to delete orang tua')
    }
    return res.json()
}
