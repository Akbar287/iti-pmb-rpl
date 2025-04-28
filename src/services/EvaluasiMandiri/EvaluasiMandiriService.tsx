import { MataKuliahMahasiswa } from '@/generated/prisma'
import {
    CreateMataKuliahMahasiswaTypes,
    DaftarUlangProdiType,
} from '@/types/DaftarUlangProdi'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getEvaluasiMandiri(
    PendaftaranId: string
): Promise<DaftarUlangProdiType> {
    const res = await fetch(
        `${BASE_URL}/api/protected/evaluasi-mandiri?id=${PendaftaranId}`
    )
    if (!res.ok) throw new Error('Failed to fetch Mata Kuliah Mahasiswa')
    return res.json()
}

export async function setMataKuliahMahasiswa(
    PendaftaranId: string,
    data: CreateMataKuliahMahasiswaTypes
): Promise<MataKuliahMahasiswa[]> {
    const res = await fetch(
        `${BASE_URL}/api/protected/evaluasi-mandiri?id=${PendaftaranId}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to update Mata Kuliah Mahasiswa')
    }
    return res.json()
}
