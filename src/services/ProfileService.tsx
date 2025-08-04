import { UserCreateFormValidation } from '@/validation/ProfilValidation'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getFileBlobAvatarByUserId(
    userId: string
): Promise<string> {
    const res = await fetch(`${BASE_URL}/api/protected/avatar?userId=${userId}`)

    if (!res.ok) {
        throw new Error('Failed to get avatar blob')
    }

    const blob = await res.blob()
    const previewUrl = URL.createObjectURL(blob)
    return previewUrl
}

export async function updateProfilService(
    data: UserCreateFormValidation
): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/protected/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        throw new Error('Failed to update profile')
    }
    return res.json()
}

export async function updatePassword({
    password_lama,
    password_baru,
}: {
    password_lama: string
    password_baru: string
}): Promise<{
    data: Array<Object>
    message: string
}> {
    const res = await fetch(`${BASE_URL}/api/protected/profile/password`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password_lama, password_baru }),
    })
    if (!res.ok) {
        throw new Error('Failed to update password')
    }
    return res.json()
}
