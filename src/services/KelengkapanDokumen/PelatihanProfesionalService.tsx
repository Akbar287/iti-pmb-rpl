import { MahasiswaPelatihanProfessional } from '@/generated/prisma'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getMahasiswaPelatihanProfessional(): Promise<
    MahasiswaPelatihanProfessional[]
> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/pelatihan-profesional`
    )
    if (!res.ok) throw new Error('Failed to fetch pelatihan profesional')
    return res.json()
}

export async function getMahasiswaPelatihanProfessionalId(
    MahasiswaPelatihanProfessionalId: string
): Promise<MahasiswaPelatihanProfessional> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/pelatihan-profesional?id=${MahasiswaPelatihanProfessionalId}`
    )
    if (!res.ok) throw new Error('Failed to fetch pelatihan profesional')
    return res.json()
}

export async function getMahasiswaPelatihanProfessionalByPendaftaranId(
    pendaftaranId: string
): Promise<MahasiswaPelatihanProfessional[]> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/pelatihan-profesional?pendaftaranId=${pendaftaranId}`
    )
    if (!res.ok) throw new Error('Failed to fetch pelatihan profesional')
    return res.json()
}

export async function setMahasiswaPelatihanProfessional(
    data: MahasiswaPelatihanProfessional
): Promise<MahasiswaPelatihanProfessional> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/pelatihan-profesional`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to create pelatihan profesional')
    }
    return res.json()
}

export async function updateMahasiswaPelatihanProfessional(
    data: MahasiswaPelatihanProfessional
): Promise<MahasiswaPelatihanProfessional> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/pelatihan-profesional`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to update pelatihan profesional')
    }
    return res.json()
}

export async function deleteMahasiswaPelatihanProfessional(
    id: string
): Promise<void> {
    const res = await fetch(
        `${BASE_URL}/api/protected/kelengkapan-dokumen/pelatihan-profesional?id=${id}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    if (!res.ok) {
        throw new Error('Failed to delete pelatihan profesional')
    }
    return res.json()
}
