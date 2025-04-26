import { BuktiFormTypes } from '@/types/BuktiFormUploadDokumenTypes'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getFileBlobByNamafile(NamaFile: string): Promise<string> {
    const res = await fetch(
        `${BASE_URL}/api/protected/upload-dokumen?file=${NamaFile}`
    )

    if (!res.ok) {
        throw new Error('Failed to get dokumen bukti form')
    }

    const blob = await res.blob()
    const previewUrl = URL.createObjectURL(blob)
    return previewUrl
}

export async function getFileId(BuktiFormId: string): Promise<{
    status: string
    message: string
    data: BuktiFormTypes
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
    data: BuktiFormTypes[]
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
): Promise<Response> {
    const formData = new FormData()
    formData.append('files', data)
    formData.append('JenisDokumenId', JenisDokumenId)
    formData.append('PendaftaranId', PendaftaranId)

    return await fetch(`${BASE_URL}/api/protected/upload-dokumen`, {
        method: 'POST',
        body: formData,
    })
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
