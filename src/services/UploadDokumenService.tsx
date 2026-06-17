import { BuktiFormTypes } from '@/types/BuktiFormUploadDokumenTypes'
import { pdfFileToBase64Images } from "@/lib/pdfClient";

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

export type UploadProgress =
    | { stage: 'pdf'; percent: number }
    | { stage: 'upload'; percent: number }

export async function setFile(
    data: File,
    JenisDokumenId: string,
    PendaftaranId: string,
    onProgress?: (info: UploadProgress) => void
): Promise<Response> {
    const formData = new FormData()
    formData.append('files', data)
    formData.append('JenisDokumenId', JenisDokumenId)
    formData.append('PendaftaranId', PendaftaranId)

    if (data.type === 'application/pdf') {
        await pdfFileToBase64Images(data, {
            maxPages: 5,
            onPage: (current, total) =>
                onProgress?.({ stage: 'pdf', percent: (current / total) * 100 }),
        })
    }

    // Gunakan XMLHttpRequest agar progress unggahan byte bisa dipantau
    // (Fetch API tidak menyediakan event progress untuk upload).
    return await new Promise<Response>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', `${BASE_URL}/api/protected/upload-dokumen`)

        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                onProgress?.({
                    stage: 'upload',
                    percent: (e.loaded / e.total) * 100,
                })
            }
        }

        xhr.onload = () => {
            resolve(
                new Response(xhr.responseText, {
                    status: xhr.status,
                    statusText: xhr.statusText,
                })
            )
        }
        xhr.onerror = () => reject(new Error('Failed to upload dokumen'))
        xhr.ontimeout = () => reject(new Error('Upload dokumen timeout'))

        xhr.send(formData)
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
