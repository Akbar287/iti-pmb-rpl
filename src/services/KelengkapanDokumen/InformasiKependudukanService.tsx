import { InformasiKependudukan } from '@/generated/prisma'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getInformasiKependudukan(): Promise<
    InformasiKependudukan[]
> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/informasi-kependudukan`
    )
    if (!res.ok) throw new Error('Failed to fetch informasi kependudukan')
    return res.json()
}

export async function getInformasiKependudukanId(
    InformasiKependudukanId: string
): Promise<InformasiKependudukan> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/informasi-kependudukan?id=${InformasiKependudukanId}`
    )
    if (!res.ok) throw new Error('Failed to fetch informasi kependudukan')
    return res.json()
}

export async function getInformasiKependudukanByPendaftaranId(
    pendaftaranId: string
): Promise<InformasiKependudukan[]> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/informasi-kependudukan?pendaftaranId=${pendaftaranId}`
    )
    if (!res.ok) throw new Error('Failed to fetch informasi kependudukan')
    return res.json()
}

export async function setInformasiKependudukan(
    data: InformasiKependudukan
): Promise<InformasiKependudukan> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/informasi-kependudukan`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to create informasi kependudukan')
    }
    return res.json()
}

export async function updateInformasiKependudukan(
    data: InformasiKependudukan
): Promise<InformasiKependudukan> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/informasi-kependudukan`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to update informasi kependudukan')
    }
    return res.json()
}

export async function deleteInformasiKependudukan(id: string): Promise<void> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/informasi-kependudukan?id=${id}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    if (!res.ok) {
        throw new Error('Failed to delete informasi kependudukan')
    }
    return res.json()
}
