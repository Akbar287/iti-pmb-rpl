// Client API Nomor Surat Sisurat ITI (lihat doc/panduan-api-nomor-surat.md).
// Server-to-server: clientId/clientSecret hanya boleh dibaca di sisi server.
const API_BASE =
    (process.env.SISURAT_API_BASE_URL ?? 'https://sisurat.iti.ac.id') +
    '/api/external/v1'

const CLIENT_ID = process.env.clientId ?? process.env.SISURAT_CLIENT_ID
const CLIENT_SECRET =
    process.env.clientSecret ?? process.env.SISURAT_CLIENT_SECRET

/** Jenis surat yang dipakai untuk SK hasil asesmen RPL. */
export const LETTER_TYPE_SK = process.env.SISURAT_LETTER_TYPE ?? 'SURAT_KEPUTUSAN'

/** Kode unit penerbit SK Rektor. */
export const UNIT_KODE_REKTOR = process.env.SISURAT_UNIT_KODE ?? 'Rek'

export type NomorSuratResult = {
    nomorSurat: string
    letterType: string
    unitKode: string
    sequence: number
    scopeYear: number
    sequenceKey: string
    externalReference: string | null
    issuedAt: string
}

type MintPayload = {
    letterType?: string
    unitKode?: string
    /** ISO-8601, mis. 2026-08-06. Menentukan bulan Romawi & tahun. */
    date?: string
    /** Referensi milik kita untuk penelusuran di Sisurat. */
    externalReference?: string
    note?: string
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

    const json = await res.json().catch(() => null)

    if (!res.ok || json?.status === 'error') {
        throw new Error(
            json?.message ?? `Sisurat membalas HTTP ${res.status}`
        )
    }

    return json
}

let cachedToken: string | null = null

async function getToken(): Promise<string> {
    if (cachedToken) return cachedToken

    if (!CLIENT_ID || !CLIENT_SECRET) {
        throw new Error(
            'Kredensial Sisurat belum diatur (clientId / clientSecret)'
        )
    }

    const json = await call('/auth/token', {
        method: 'POST',
        body: JSON.stringify({
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
        }),
    })

    cachedToken = json.data.token
    return cachedToken as string
}

// Hanya galat autentikasi yang layak diulang. Pencocokan sengaja ketat: untuk
// POST /nomor-surat, percobaan ulang yang keliru dapat menerbitkan nomor kedua
// dari deret yang tidak bisa dibatalkan.
const GALAT_AUTH =
    /token tidak valid|kedaluwarsa|expired|unauthorized|\bHTTP 401\b/i

// Token berumur 24 jam; saat kedaluwarsa Sisurat membalas 401 sehingga cache
// dibuang lalu permintaan diulang sekali dengan token baru.
async function withToken<T>(fn: (token: string) => Promise<T>): Promise<T> {
    try {
        return await fn(await getToken())
    } catch (err) {
        if (!GALAT_AUTH.test(String((err as Error).message))) throw err
        cachedToken = null
        return fn(await getToken())
    }
}

export const sisuratApi = {
    async me() {
        return withToken(async (token) => {
            const json = await call('/me', {
                headers: { Authorization: 'Bearer ' + token },
            })
            return json.data
        })
    },

    async jenisSurat() {
        return withToken(async (token) => {
            const json = await call('/jenis-surat', {
                headers: { Authorization: 'Bearer ' + token },
            })
            return json.data
        })
    },

    /**
     * Menerbitkan satu nomor surat resmi.
     *
     * PERHATIAN: setiap panggilan sukses memakai satu nomor dari deret dan
     * tidak dapat dibatalkan. Panggil hanya ketika nomornya benar-benar dipakai.
     */
    async mintNomorSurat(payload: MintPayload = {}): Promise<NomorSuratResult> {
        return withToken(async (token) => {
            const json = await call('/nomor-surat', {
                method: 'POST',
                headers: { Authorization: 'Bearer ' + token },
                body: JSON.stringify({
                    letterType: payload.letterType ?? LETTER_TYPE_SK,
                    unitKode: payload.unitKode ?? UNIT_KODE_REKTOR,
                    ...(payload.date ? { date: payload.date } : {}),
                    ...(payload.externalReference
                        ? { externalReference: payload.externalReference }
                        : {}),
                    ...(payload.note ? { note: payload.note } : {}),
                }),
            })
            return json.data as NomorSuratResult
        })
    },
}
