import {
    CalonMahasiswaRplPage,
    CalonMahasiswaRplRequestResponseDTO,
} from '@/types/MahasiswaTypes'
import { Pagination } from '@/types/Pagination'
import { SevimaImportCaseType } from '../SevimaImportCase'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getCalonMahasiswaPagination(
    page: number,
    limit: number,
    search: string
): Promise<Pagination<CalonMahasiswaRplPage[]>> {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search,
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-data/mahasiswa?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch calon mahasiswa')
    return res.json()
}
export async function getCalonMahasiswaAllNik(
): Promise<String[]> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-data/mahasiswa?get=nik`
    )
    if (!res.ok) throw new Error('Failed to fetch calon mahasiswa')
    return res.json()
}

export async function getKodePendaftarId(
    KodePendaftarId: string
): Promise<CalonMahasiswaRplRequestResponseDTO> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-data/mahasiswa?id=${KodePendaftarId}`
    )
    if (!res.ok) throw new Error('Failed to fetch calon mahasiswa')
    return res.json()
}


export async function setCalonMahasiswaSinkronisasi(
    data: SevimaImportCaseType[]
): Promise<CalonMahasiswaRplPage[]> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-data/mahasiswa?jenis=set-user-sinkronisasi`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to create calon mahasiswa sinkronisasi')
    }
    return res.json()
}

export async function setCalonMahasiswa(
    data: CalonMahasiswaRplRequestResponseDTO
): Promise<CalonMahasiswaRplPage> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-data/mahasiswa?jenis=set-user`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to create calon mahasiswa')
    }
    return res.json()
}

export async function updateCalonMahasiswa(
    data: CalonMahasiswaRplRequestResponseDTO
): Promise<CalonMahasiswaRplPage> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-data/mahasiswa`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    return res.json()
}

export async function deleteCalonMahasiswa(
    PendaftaranId: string
): Promise<void> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-data/mahasiswa?id=${PendaftaranId}&jenis=manual`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    if (!res.ok) {
        throw new Error('Failed to delete calon mahasiswa')
    }
    return res.json()
}

export async function deleteCalonMahasiswaSinkronisasi(
    Nik: string[]
): Promise<void> {
    const query = Nik.map((n) => `id=${encodeURIComponent(n)}`).join("&")
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-data/mahasiswa?${query}&jenis=sinkronisasi`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    if (!res.ok) {
        throw new Error('Failed to delete calon mahasiswa sinkronisasi')
    }
    return res.json()
}
