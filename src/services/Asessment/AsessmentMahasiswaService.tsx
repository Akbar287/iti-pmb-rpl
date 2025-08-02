import { Pagination } from '@/types/Pagination'
import { ResponseMhsFromAsesorSession } from '@/types/PenunjukanAsesor'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getMahasiswaFromAsesor(
    page: number,
    limit: number,
    search: string
): Promise<Pagination<ResponseMhsFromAsesorSession[]>> {
    const params = new URLSearchParams()
    params.append('page', String(page))
    params.append('limit', String(limit))
    params.append('search', search)
    const res = await fetch(
        `${BASE_URL}/api/protected/asessment/asessmen-mahasiswa?jenis=get-mhs-from-asesor&${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch mahasiswa from asesor')
    return res.json()
}

export async function getMahasiswaFromAsesorForMahasiswa(
    page: number,
    limit: number,
    search: string
): Promise<Pagination<ResponseMhsFromAsesorSession[]>> {
    const params = new URLSearchParams()
    params.append('page', String(page))
    params.append('limit', String(limit))
    params.append('search', search)
    params.append('_m', 'true')
    const res = await fetch(
        `${BASE_URL}/api/protected/asessment/asessmen-mahasiswa?jenis=get-mhs-from-asesor&${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch mahasiswa from asesor')
    return res.json()
}

export async function setSkorAsessmenFromAsesor(
    SkorAssesmenId: string,
    MataKuliahMahasiswaId: string,
    Portofolio: number,
    Tulis: number,
    Wawancara: number,
    Demo: number,
    Diakui: boolean,
    SkorRataRata: number,
    NilaiHuruf: string | null
): Promise<{
    SkorAssesmenId: string
    MataKuliahMahasiswaId: string
    Portofolio: number
    Tulis: number
    Wawancara: number
    Demo: number
    Diakui: boolean
    SkorRataRata: number
    NilaiHuruf: string | null
}> {
    const res = await fetch(
        `${BASE_URL}/api/protected/asessment/asessmen-mahasiswa`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                SkorAssesmenId,
                MataKuliahMahasiswaId,
                Portofolio,
                Tulis,
                Wawancara,
                Demo,
                Diakui,
                SkorRataRata,
                NilaiHuruf,
            }),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to set Skor Asessmen')
    }
    return res.json()
}

export async function setAsessmentMahasiswaFromAsesor(
    HasilAssesmenId: string,
    EvaluasiDiriId: string,
    Valid: boolean,
    Autentik: boolean,
    Terkini: boolean,
    Memadai: boolean,
    Assesmen: string,
    Nilai: number,
    TanggalAssesmen: Date
): Promise<{
    HasilAssesmenId: string
    EvaluasiDiriId: string
    Valid: boolean
    Autentik: boolean
    Terkini: boolean
    Memadai: boolean
    Assesmen: string
    Nilai: number
    TanggalAssesmen: Date
}> {
    const res = await fetch(
        `${BASE_URL}/api/protected/asessment/asessmen-mahasiswa`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                HasilAssesmenId,
                EvaluasiDiriId,
                Valid,
                Autentik,
                Terkini,
                Memadai,
                Assesmen,
                Nilai,
                TanggalAssesmen,
            }),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to create institusi lama')
    }
    return res.json()
}

export async function getMahasiswaFromAsesorRekapitulasi(
    page: number,
    limit: number,
    search: string
): Promise<Pagination<ResponseMhsFromAsesorSession[]>> {
    const params = new URLSearchParams()
    params.append('page', String(page))
    params.append('limit', String(limit))
    params.append('search', search)
    const res = await fetch(
        `${BASE_URL}/api/protected/asessment/asessmen-mahasiswa?jenis=get-mhs-from-asesor-rekapitulasi&${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch mahasiswa from asesor')
    return res.json()
}
