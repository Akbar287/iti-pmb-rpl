const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function GenerateSkPdf(PendaftaranId: string, NomorSK: string, JenisSK: string): Promise<string> {
    const params = new URLSearchParams({
        _id: String(PendaftaranId),
        _t: String("sk"),
        _n: String(NomorSK),
        _j: String(JenisSK)
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/generate-pdf?${params.toString()}`
    )
    if (!res.ok) {
        throw new Error('Failed to get dokumen bukti form')
    }

    const blob = await res.blob()
    const previewUrl = URL.createObjectURL(blob)
    return previewUrl
}

export async function GenerateRekapitulasiPdf(PendaftaranId: string): Promise<string> {
    const params = new URLSearchParams({
        _id: String(PendaftaranId),
        _t: String("rekapitulasi")
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/generate-pdf?${params.toString()}`
    )
    if (!res.ok) {
        throw new Error('Failed to get dokumen bukti form')
    }

    const blob = await res.blob()
    const previewUrl = URL.createObjectURL(blob)
    return previewUrl
}
