import {
    ChartAkademikData,
    ChartDataItemPmb,
    ChartKaprodiData,
    ChartMahasiswaData,
    ChartResponseAsesor,
} from '@/types/ChartTypes'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getChartMahasiswaRole(
    roleId: string
): Promise<ChartMahasiswaData> {
    const params = new URLSearchParams({
        _r: String(roleId),
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/chart?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch chart')
    return res.json()
}

export async function getChartAsesorRole(
    roleId: string
): Promise<ChartResponseAsesor> {
    const params = new URLSearchParams({
        _r: String(roleId),
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/chart?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch chart')
    return res.json()
}

export async function getChartKaprodiRole(
    roleId: string
): Promise<ChartKaprodiData> {
    const params = new URLSearchParams({
        _r: String(roleId),
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/chart?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch chart')
    return res.json()
}

export async function getChartAkademikRole(
    roleId: string
): Promise<ChartAkademikData> {
    const params = new URLSearchParams({
        _r: String(roleId),
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/chart?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch chart')
    return res.json()
}

export async function getChartPmbRole(
    roleId: string
): Promise<ChartDataItemPmb> {
    const params = new URLSearchParams({
        _r: String(roleId),
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/chart?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch chart')
    return res.json()
}
