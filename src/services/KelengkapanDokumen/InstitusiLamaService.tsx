import { InstitusiLamaType as InstitusiLama } from '@/types/InstitusiLama'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getInstitusiLama(): Promise<InstitusiLama[]> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/institusi-lama`
    )
    if (!res.ok) throw new Error('Failed to fetch country')
    return res.json()
}

export async function getInstitusiLamaId(
    institusiLamaId: string
): Promise<InstitusiLama> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/institusi-lama?id=${institusiLamaId}`
    )
    if (!res.ok) throw new Error('Failed to fetch institusi lama')
    return res.json()
}

export async function getInstitusiLamaByPendaftaranId(
    pendaftaranId: string
): Promise<InstitusiLama[]> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/institusi-lama?pendaftaranId=${pendaftaranId}`
    )
    if (!res.ok) throw new Error('Failed to fetch institusi lama')
    return res.json()
}

export async function setInstitusiLama(
    data: InstitusiLama
): Promise<InstitusiLama> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/institusi-lama`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to create institusi lama')
    }
    return res.json()
}

export async function updateInstitusiLama(
    data: InstitusiLama
): Promise<InstitusiLama> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/institusi-lama`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to update institusi lama')
    }
    return res.json()
}

export async function deleteInstitusiLama(id: string): Promise<void> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/institusi-lama?id=${id}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    if (!res.ok) {
        throw new Error('Failed to delete institusi lama')
    }
    return res.json()
}
