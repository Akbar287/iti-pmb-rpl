// Client QR Code Generator ITI (lihat doc/panduan-integrasi-nextjs.md).
// Hanya dipakai di sisi server (Route Handler) agar kredensial dan token
// tidak pernah sampai ke browser.
const API_BASE =
    process.env.QR_API_BASE_URL ?? 'https://pdsi.iti.ac.id/qrcodegenerator'

export type QrOfficial = {
    id: number
    name: string
    position: string
    unit: string
}

export type QrDocument = {
    id: number
    official_id: number
    official_name: string
    official_position: string
    official_unit: string
    token: string
    doc_number: string
    doc_title: string | null
    doc_date: string | null
    qrcode_url: string
    qrcode_base64: string
    verify_url: string
}

type CreateDocumentPayload = {
    official_id: number
    doc_number: string
    doc_title?: string
    doc_date?: string
}

async function call(path: string, init?: RequestInit): Promise<any> {
    const res = await fetch(API_BASE + path, {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            ...(init?.headers ?? {}),
        },
        cache: 'no-store',
    })

    const json = await res.json()

    if (!res.ok || json.success === false) {
        throw new Error(json.message ?? 'HTTP ' + res.status)
    }

    return json
}

let cachedToken: string | null = null

async function getToken(): Promise<string> {
    if (cachedToken) return cachedToken

    const data = await call('/api/login.php', {
        method: 'POST',
        body: JSON.stringify({
            username: process.env.QR_API_USERNAME,
            password: process.env.QR_API_PASSWORD,
        }),
    })

    cachedToken = data.token
    return cachedToken as string
}

// Token berlaku 24 jam; bila kedaluwarsa server membalas 401 sehingga cache
// dibuang lalu permintaan diulang sekali dengan token baru.
async function withToken<T>(fn: (token: string) => Promise<T>): Promise<T> {
    try {
        return await fn(await getToken())
    } catch (err) {
        if (!String((err as Error).message).includes('401')) throw err
        cachedToken = null
        return fn(await getToken())
    }
}

export const qrApi = {
    async officials(params?: Record<string, string>): Promise<QrOfficial[]> {
        const qs = new URLSearchParams(params ?? {}).toString()
        const json = await call('/api/officials.php' + (qs ? '?' + qs : ''))
        return (json.data ?? []) as QrOfficial[]
    },

    async units() {
        return call('/api/units.php')
    },

    async documents(): Promise<QrDocument[]> {
        return withToken(async (token) => {
            const json = await call('/api/documents.php', {
                headers: { Authorization: 'Bearer ' + token },
            })
            return (json.data ?? []) as QrDocument[]
        })
    },

    async createDocument(payload: CreateDocumentPayload): Promise<QrDocument> {
        return withToken(async (token) => {
            const json = await call('/api/documents.php', {
                method: 'POST',
                headers: { Authorization: 'Bearer ' + token },
                body: JSON.stringify(payload),
            })
            return json.data as QrDocument
        })
    },

    async verify(token: string) {
        return call('/api/verify.php?t=' + encodeURIComponent(token))
    },
}
