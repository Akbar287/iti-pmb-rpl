import { BuktiForm } from '@/generated/prisma'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getFileId(BuktiFormId: string): Promise<{
    status: string
    message: string
    data: BuktiForm
}> {
    const res = await fetch(
        `${BASE_URL}/api/protected/upload-dokumen?BuktiFormId=${BuktiFormId}`
    )

    if (!res.ok) {
        throw new Error('Failed to get dokumen bukti form')
    }

    return res.json()
}

export async function getFileByPendaftaranId(PendaftaranId: string): Promise<{
    status: string
    message: string
    data: BuktiForm[]
}> {
    const res = await fetch(
        `${BASE_URL}/api/protected/upload-dokumen?PendaftaranId=${PendaftaranId}`
    )

    if (!res.ok) {
        throw new Error('Failed to get dokumen bukti form')
    }

    return res.json()
}

export async function setFile(
    data: File,
    JenisDokumenId: string,
    PendaftaranId: string
): Promise<{
    status: string
    message: string
    data: string | BuktiForm
}> {
    const formData = new FormData()
    formData.append('avatar', data)
    formData.append('JenisDokumenId', JenisDokumenId)
    formData.append('PendaftaranId', PendaftaranId)

    const res = await fetch(`${BASE_URL}/api/protected/upload-dokumen`, {
        method: 'POST',
        body: formData,
    })

    if (!res.ok) {
        throw new Error('Failed to upload dokumen')
    }

    return res.json()
}

export async function deleteFile(BuktiFormId: string): Promise<{
    status: string
    message: string
    data: any
}> {
    const res = await fetch(
        `${BASE_URL}/api/protected/upload-dokumen?id=${BuktiFormId}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    if (!res.ok) {
        throw new Error('Failed to upload dokumen')
    }
    return res.json()
}
