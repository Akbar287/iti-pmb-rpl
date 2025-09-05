import { Pagination } from '@/types/Pagination'
import { SettingCommunityTypes } from '@/types/WebsiteTypes'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getKomunitasPagination(
    SettingMainPageId: string,
    page: number,
    limit: number,
    search: string
): Promise<Pagination<SettingCommunityTypes[]>> {
    const params = new URLSearchParams({
        _id: SettingMainPageId,
        page: String(page),
        limit: String(limit),
        search,
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/website/komunitas?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch Komunitas')
    return res.json()
}

export async function getKomunitasId(
    SettingCommunityId: string
): Promise<SettingCommunityTypes> {
    const res = await fetch(
        `${BASE_URL}/api/protected/website/komunitas?_id=${SettingCommunityId}`
    )

    if (!res.ok) {
        throw new Error('Failed to get Komunitas')
    }

    return res.json()
}

export async function setKomunitas(
    Foto: File,
    Data: SettingCommunityTypes
): Promise<SettingCommunityTypes> {
    const formData = new FormData()
    formData.append('fileBg', Foto)
    formData.append('request', JSON.stringify(Data))

    const res = await fetch(`${BASE_URL}/api/protected/website/komunitas`, {
        method: 'POST',
        body: formData,
    })
    if (!res.ok) {
        throw new Error('Failed to set Komunitas')
    }
    return res.json()
}

export async function updateKomunitas(
    Foto: File,
    Data: SettingCommunityTypes
): Promise<SettingCommunityTypes> {
    const formData = new FormData()
    formData.append('fileBg', Foto)
    formData.append('request', JSON.stringify(Data))

    const res = await fetch(`${BASE_URL}/api/protected/website/komunitas`, {
        method: 'PUT',
        body: formData,
    })
    if (!res.ok) {
        throw new Error('Failed to update Komunitas')
    }
    return res.json()
}

export async function deleteKomunitas(
    SettingCommunityId: string
): Promise<void> {
    const res = await fetch(
        `${BASE_URL}/api/protected/website/komunitas?id=${SettingCommunityId}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    if (!res.ok) {
        throw new Error('Failed to del Komunitas')
    }
    return res.json()
}
