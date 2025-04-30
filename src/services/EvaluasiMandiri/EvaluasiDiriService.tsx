import { EvaluasiDiri } from '@/generated/prisma'
import {
    MataKuliahMahasiswaCapaianPembelajaranTypes,
    RequestSetEvaluasiDiri,
    ResponseSetEvaluasiDiri,
} from '@/types/DaftarUlangProdi'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getMataKuliahMahasiswaCapaianPembelajaran(
    PendaftaranId: string
): Promise<MataKuliahMahasiswaCapaianPembelajaranTypes[]> {
    const res = await fetch(
        `${BASE_URL}/api/protected/evaluasi-mandiri/evaluasi?PendaftaranId=${PendaftaranId}`
    )
    if (!res.ok) throw new Error('Failed to fetch evaluasi-diri')
    return res.json()
}

export async function getEvaluasiDiriId(
    EvaluasiDiriId: string
): Promise<EvaluasiDiri> {
    const res = await fetch(
        `${BASE_URL}/api/protected/evaluasi-mandiri/evaluasi?EvaluasiDiriId=${EvaluasiDiriId}`
    )
    if (!res.ok) throw new Error('Failed to fetch evaluasi-diri')
    return res.json()
}

export async function setEvaluasiDiri(
    data: RequestSetEvaluasiDiri
): Promise<ResponseSetEvaluasiDiri> {
    const res = await fetch(
        `${BASE_URL}/api/protected/evaluasi-mandiri/evaluasi`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to create evaluasi-diri')
    }
    return res.json()
}
