import { Pagination } from '@/types/Pagination'
import { SettingBeritaTypes } from '@/types/WebsiteTypes'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getBeritaPagination(
    SettingMainPageId: string,
    page: number,
    limit: number,
    search: string
): Promise<Pagination<SettingBeritaTypes[]>> {
    const params = new URLSearchParams({
        _id: SettingMainPageId,
        page: String(page),
        limit: String(limit),
        search,
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/website/berita?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch Berita')
    return res.json()
}

export async function getBeritaId(
    SettingCommunityId: string
): Promise<SettingBeritaTypes> {
    const res = await fetch(
        `${BASE_URL}/api/protected/website/berita?_id=${SettingCommunityId}`
    )

    if (!res.ok) {
        throw new Error('Failed to get Berita')
    }

    return res.json()
}

export async function setBerita(
    Foto: File,
    Data: SettingBeritaTypes
): Promise<SettingBeritaTypes> {
    const formData = new FormData()
    formData.append('fileBg', Foto)
    formData.append('request', JSON.stringify(Data))

    const res = await fetch(`${BASE_URL}/api/protected/website/berita`, {
        method: 'POST',
        body: formData,
    })
    if (!res.ok) {
        throw new Error('Failed to set Berita')
    }
    return res.json()
}

export async function updateBerita(
    Foto: File,
    Data: SettingBeritaTypes
): Promise<SettingBeritaTypes> {
    const formData = new FormData()
    formData.append('fileBg', Foto)
    formData.append('request', JSON.stringify(Data))

    const res = await fetch(`${BASE_URL}/api/protected/website/berita?_m=_i`, {
        method: 'PUT',
        body: formData,
    })
    if (!res.ok) {
        throw new Error('Failed to update Berita')
    }
    return res.json()
}

export async function updatePopulerBerita(
    SettingBeritaId: string
): Promise<void> {
    const res = await fetch(
        `${BASE_URL}/api/protected/website/berita?_m=_p&_i=${SettingBeritaId}`,
        {
            method: 'PUT',
        }
    )
    if (!res.ok) {
        throw new Error('Failed to update Berita')
    }
    return res.json()
}

export async function deleteBerita(SettingCommunityId: string): Promise<void> {
    const res = await fetch(
        `${BASE_URL}/api/protected/website/berita?id=${SettingCommunityId}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    if (!res.ok) {
        throw new Error('Failed to del Berita')
    }
    return res.json()
}
