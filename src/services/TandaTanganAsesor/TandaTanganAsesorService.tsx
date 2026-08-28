const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export type TandaTanganAsesorItem = {
    Urutan: number
    Nama: string
    SudahTandaTangan: boolean
    TandaTanganPada: string | null
    MilikSaya: boolean
}

export type StatusTandaTanganAsesor = {
    Daftar: TandaTanganAsesorItem[]
    UrutanSaya: number | null
    SemuaSudahTandaTangan: boolean
    DapatDiubah: boolean
}

/** Status tanda tangan Penilai 1 & 2 pada satu berkas pendaftaran. */
export async function getStatusTandaTanganAsesor(
    PendaftaranId: string
): Promise<StatusTandaTanganAsesor> {
    const params = new URLSearchParams({ p: PendaftaranId })
    const res = await fetch(
        `${BASE_URL}/api/protected/tanda-tangan-asesor?${params.toString()}`
    )
    const json = await res.json()
    if (!res.ok) {
        throw new Error(json.message ?? 'Gagal memuat tanda tangan asesor')
    }
    return json.data
}

/** URL gambar tanda tangan penilai untuk pratinjau; `v` memaksa muat ulang. */
export function urlTandaTanganAsesor(
    PendaftaranId: string,
    Urutan: number,
    v?: string | number
) {
    const params = new URLSearchParams({
        p: PendaftaranId,
        urutan: String(Urutan),
        file: '1',
        ...(v ? { v: String(v) } : {}),
    })
    return `${BASE_URL}/api/protected/tanda-tangan-asesor?${params.toString()}`
}

/** Menyimpan tanda tangan asesor yang sedang masuk (slotnya sendiri). */
export async function simpanTandaTanganAsesor(
    PendaftaranId: string,
    TandaTangan: string
): Promise<StatusTandaTanganAsesor> {
    const res = await fetch(`${BASE_URL}/api/protected/tanda-tangan-asesor`, {
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
