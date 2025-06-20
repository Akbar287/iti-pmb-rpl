import { Pagination } from '@/types/Pagination'
import {
    ResponseSanggahanAsesorPaginationType,
    ResponseSanggahanMhsPaginationType,
} from '@/types/SanggahanTypes'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getSanggahanAsessmentToAsesor(
    page: number,
    limit: number,
    search: string,
    roleId: string
): Promise<Pagination<ResponseSanggahanAsesorPaginationType[]>> {
    const params = new URLSearchParams()
    params.append('page', String(page))
    params.append('limit', String(limit))
    params.append('search', search)
    params.append('r', roleId)
    params.append('jenis', 'get-sanggahan')
    const res = await fetch(
        `${BASE_URL}/api/protected/asessment/sanggahan?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch sanggahan to asesor')
    return res.json()
}

export async function getSanggahanAsessmentToMahasiswa(
    page: number,
    limit: number,
    search: string,
    roleId: string
): Promise<Pagination<ResponseSanggahanMhsPaginationType[]>> {
    const params = new URLSearchParams()
    params.append('page', String(page))
    params.append('limit', String(limit))
    params.append('search', search)
    params.append('r', roleId)
    params.append('jenis', 'get-sanggahan')
    const res = await fetch(
        `${BASE_URL}/api/protected/asessment/sanggahan?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch sanggahan to mahasiswa')
    return res.json()
}

export async function setSanggahanFromMahasiswa(data: {
    SanggahanAssesmenId: string
    PendaftaranId: string
    ProsesBanding: boolean
    DiskusiBanding: boolean
    CreatedAt: Date | null
    UpdatedAt: Date | null
    SanggahanAssesmenMk: {
        SanggahanAssesmenMkId: string
        SanggahanAssesmenId: string
        MataKuliahMahasiswaId: string
        Keterangan: string | null
        CreatedAt: Date | null
        UpdatedAt: Date | null
    }[]
    SanggahanAssesmenPihak: {
        SanggahanAssesmenPihakId: string
        SanggahanAssesmenId: string
        NamaPihak: string
        JabatanPihak: string | null
        InstansiPihak: string | null
        CreatedAt: Date | null
        UpdatedAt: Date | null
    }[]
}): Promise<{
    SanggahanAssesmenId: string
    PendaftaranId: string
    ProsesBanding: boolean
    DiskusiBanding: boolean
    CreatedAt: Date | null
    UpdatedAt: Date | null
    SanggahanAssesmenMk: {
        SanggahanAssesmenMkId: string
        SanggahanAssesmenId: string
        MataKuliahMahasiswaId: string
        Keterangan: string | null
        CreatedAt: Date | null
        UpdatedAt: Date | null
    }[]
    SanggahanAssesmenPihak: {
        SanggahanAssesmenPihakId: string
        SanggahanAssesmenId: string
        NamaPihak: string
        JabatanPihak: string | null
        InstansiPihak: string | null
        CreatedAt: Date | null
        UpdatedAt: Date | null
    }[]
}> {
    const res = await fetch(`${BASE_URL}/api/protected/asessment/sanggahan`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        throw new Error('Failed to create sanggahan')
    }
    return res.json()
}
