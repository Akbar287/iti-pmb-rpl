const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export type StatusTandaTanganMahasiswa = {
    SudahTandaTangan: boolean
    TandaTanganPada: string | null
    DapatDiubah: boolean
}

/** Membaca apakah mahasiswa sudah menandatangani Form 03 pada pendaftaran ini. */
export async function getStatusTandaTangan(
    PendaftaranId: string
): Promise<StatusTandaTanganMahasiswa> {
    const params = new URLSearchParams({ p: PendaftaranId })
    const res = await fetch(
        `${BASE_URL}/api/protected/tanda-tangan-mahasiswa?${params.toString()}`
    )
    const json = await res.json()
    if (!res.ok) {
        throw new Error(json.message ?? 'Gagal memuat status tanda tangan')
    }
    return json.data
}

/** URL gambar tanda tangan untuk pratinjau; `v` memaksa muat ulang. */
export function urlTandaTangan(PendaftaranId: string, v?: string | number) {
    const params = new URLSearchParams({
        p: PendaftaranId,
        file: '1',
        ...(v ? { v: String(v) } : {}),
    })
    return `${BASE_URL}/api/protected/tanda-tangan-mahasiswa?${params.toString()}`
}

/** Menyimpan tanda tangan (PNG data URI) milik mahasiswa. */
export async function simpanTandaTangan(
    PendaftaranId: string,
    TandaTangan: string
): Promise<StatusTandaTanganMahasiswa> {
    const res = await fetch(`${BASE_URL}/api/protected/tanda-tangan-mahasiswa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ PendaftaranId, TandaTangan }),
    })
    const json = await res.json()
    if (!res.ok) {
        throw new Error(json.message ?? 'Gagal menyimpan tanda tangan')
    }
    return json.data
}
