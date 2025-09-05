import { Pagination } from '@/types/Pagination'
import { SettingTestimoniTypes } from '@/types/WebsiteTypes'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getTestimoniPagination(
    SettingMainPageId: string,
    page: number,
    limit: number,
    search: string
): Promise<Pagination<SettingTestimoniTypes[]>> {
    const params = new URLSearchParams({
        _id: SettingMainPageId,
        page: String(page),
        limit: String(limit),
        search,
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/website/testimoni?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch testimoni')
    return res.json()
}

export async function getTestimoniId(
    SettingTestimonyId: string
): Promise<SettingTestimoniTypes> {
    const res = await fetch(
        `${BASE_URL}/api/protected/website/testimoni?_id=${SettingTestimonyId}`
    )

    if (!res.ok) {
        throw new Error('Failed to get SettingTestimony')
    }

    return res.json()
}

export async function setTestimoni(
    Foto: File,
    Data: SettingTestimoniTypes
): Promise<SettingTestimoniTypes> {
    const formData = new FormData()
    formData.append('fileBg', Foto)
    formData.append('request', JSON.stringify(Data))

    const res = await fetch(`${BASE_URL}/api/protected/website/testimoni`, {
        method: 'POST',
        body: formData,
    })
    if (!res.ok) {
        throw new Error('Failed to set Testimoni')
    }
    return res.json()
}

export async function updateTestimoni(
    Foto: File,
    Data: SettingTestimoniTypes
): Promise<SettingTestimoniTypes> {
    const formData = new FormData()
    formData.append('fileBg', Foto)
    formData.append('request', JSON.stringify(Data))

    const res = await fetch(`${BASE_URL}/api/protected/website/testimoni`, {
        method: 'PUT',
        body: formData,
    })
    if (!res.ok) {
        throw new Error('Failed to update Testimoni')
    }
    return res.json()
}

export async function deleteTestimoni(
    SettingTestimonyId: string
): Promise<void> {
    const res = await fetch(
        `${BASE_URL}/api/protected/website/testimoni?id=${SettingTestimonyId}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    if (!res.ok) {
        throw new Error('Failed to del Testimoni')
    }
    return res.json()
}
