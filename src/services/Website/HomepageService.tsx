import { SettingMainPageTypes } from '@/types/WebsiteTypes'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getHomepageId(
    SettingMainPageId: string
): Promise<SettingMainPageTypes> {
    const res = await fetch(
        `${BASE_URL}/api/protected/website/homepage?_id=${SettingMainPageId}`
    )

    if (!res.ok) {
        throw new Error('Failed to get SettingMainPage')
    }

    return res.json()
}

export async function setHomepage(
    MainBackground: File,
    SelayangBackground: File,
    Data: SettingMainPageTypes
): Promise<SettingMainPageTypes> {
    const formData = new FormData()
    formData.append('fileBg', MainBackground)
    formData.append('selayangBg', SelayangBackground)
    formData.append('request', JSON.stringify(Data))

    const res = await fetch(`${BASE_URL}/api/protected/website/homepage`, {
        method: 'POST',
        body: formData,
    })
    if (!res.ok) {
        throw new Error('Failed to set Homepage')
    }
    return res.json()
}

export async function updateHomepage(
    MainBackground: File,
    SelayangBackground: File,
    Data: SettingMainPageTypes
): Promise<SettingMainPageTypes> {
    const formData = new FormData()
    formData.append('fileBg', MainBackground)
    formData.append('selayangBg', SelayangBackground)
    formData.append('request', JSON.stringify(Data))

    const res = await fetch(`${BASE_URL}/api/protected/website/homepage`, {
        method: 'PUT',
        body: formData,
    })
    if (!res.ok) {
        throw new Error('Failed to update Homepage')
    }
    return res.json()
}

export async function deleteHomepage(SettingMainPageId: string): Promise<void> {
    const res = await fetch(
        `${BASE_URL}/api/protected/website/homepage?id=${SettingMainPageId}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    if (!res.ok) {
        throw new Error('Failed to del Homepage')
    }
    return res.json()
}
