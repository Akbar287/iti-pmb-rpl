import {
    ChartAkademikData,
    ChartDataItemAdmin,
    ChartDataItemPmb,
    ChartDataItemRektor,
    ChartKaprodiData,
    ChartMahasiswaData,
    ChartResponseAsesor,
} from '@/types/ChartTypes'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getChartMahasiswaRole(
    roleId: string,
    periode = ''
): Promise<ChartMahasiswaData> {
    const params = new URLSearchParams({
        _r: String(roleId),
    })
    if (periode) params.set('_p', periode)
    const res = await fetch(
        `${BASE_URL}/api/protected/chart?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch chart')
    return res.json()
}

export async function getChartAsesorRole(
    roleId: string,
    periode = ''
): Promise<ChartResponseAsesor> {
    const params = new URLSearchParams({
        _r: String(roleId),
    })
    if (periode) params.set('_p', periode)
    const res = await fetch(
        `${BASE_URL}/api/protected/chart?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch chart')
    return res.json()
}

export async function getChartKaprodiRole(
    roleId: string,
    periode = ''
): Promise<ChartKaprodiData> {
    const params = new URLSearchParams({
        _r: String(roleId),
    })
    if (periode) params.set('_p', periode)
    const res = await fetch(
        `${BASE_URL}/api/protected/chart?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch chart')
    return res.json()
}

export async function getChartAkademikRole(
    roleId: string,
    periode = ''
): Promise<ChartAkademikData> {
    const params = new URLSearchParams({
        _r: String(roleId),
    })
    if (periode) params.set('_p', periode)
    const res = await fetch(
        `${BASE_URL}/api/protected/chart?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch chart')
    return res.json()
}

export async function getChartPmbRole(
    roleId: string,
    periode = ''
): Promise<ChartDataItemPmb> {
    const params = new URLSearchParams({
        _r: String(roleId),
    })
    if (periode) params.set('_p', periode)
    const res = await fetch(
        `${BASE_URL}/api/protected/chart?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch chart')
    return res.json()
}

export async function getChartRektorRole(
    roleId: string,
    periode = ''
): Promise<ChartDataItemRektor> {
    const params = new URLSearchParams({
        _r: String(roleId),
    })
    if (periode) params.set('_p', periode)
    const res = await fetch(
        `${BASE_URL}/api/protected/chart?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch chart')
    return res.json()
}

export async function getChartAdminRole(
    roleId: string,
    periode = ''
): Promise<ChartDataItemAdmin> {
    const params = new URLSearchParams({
        _r: String(roleId),
    })
    if (periode) params.set('_p', periode)
    const res = await fetch(
        `${BASE_URL}/api/protected/chart?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch chart')
    return res.json()
}

export interface MultiPeriodeChart {
    periods: string[]
    categories: string[]
    rows: Record<string, string | number>[]
    trend: { periode: string; total: number }[]
    prodiRows: Record<string, string | number>[]
}

// Agregasi distribusi status mahasiswa lintas periode (maks 8 periode terbaru).
export async function getMultiPeriodeChart(): Promise<MultiPeriodeChart> {
    const res = await fetch(`${BASE_URL}/api/protected/chart?_agg=periode`)
    if (!res.ok) throw new Error('Failed to fetch multi periode chart')
    const json = await res.json()
    return json.data as MultiPeriodeChart
}

// Daftar periode pendaftaran untuk filter dashboard.
export async function getPeriodeList(): Promise<string[]> {
    const res = await fetch(
        `${BASE_URL}/api/protected/chart?_list=periode`
    )
    if (!res.ok) throw new Error('Failed to fetch periode list')
    const json = await res.json()
    return Array.isArray(json.data) ? json.data : []
}
