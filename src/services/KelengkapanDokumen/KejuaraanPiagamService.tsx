import { MahasiswaPiagam } from '@/generated/prisma'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getMahasiswaPiagam(): Promise<MahasiswaPiagam[]> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/kejuaraan-piagam`
    )
    if (!res.ok) throw new Error('Failed to fetch kejuaraan piagam')
    return res.json()
}

export async function getMahasiswaPiagamId(
    MahasiswaPiagamId: string
): Promise<MahasiswaPiagam> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/kejuaraan-piagam?id=${MahasiswaPiagamId}`
    )
    if (!res.ok) throw new Error('Failed to fetch kejuaraan piagam')
    return res.json()
}

export async function getMahasiswaPiagamByPendaftaranId(
    pendaftaranId: string
): Promise<MahasiswaPiagam[]> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/kejuaraan-piagam?pendaftaranId=${pendaftaranId}`
    )
    if (!res.ok) throw new Error('Failed to fetch kejuaraan piagam')
    return res.json()
}

export async function setMahasiswaPiagam(
    data: MahasiswaPiagam
): Promise<MahasiswaPiagam> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/kejuaraan-piagam`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to create kejuaraan piagam')
    }
    return res.json()
}

export async function updateMahasiswaPiagam(
    data: MahasiswaPiagam
): Promise<MahasiswaPiagam> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/kejuaraan-piagam`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to update kejuaraan piagam')
    }
    return res.json()
}

export async function deleteMahasiswaPiagam(id: string): Promise<void> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/kejuaraan-piagam?id=${id}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    if (!res.ok) {
        throw new Error('Failed to delete kejuaraan piagam')
    }
    return res.json()
}
