import { ResponseSkRektorAsessmenType } from '@/types/FinalAsessmen'
import { Pagination } from '@/types/Pagination'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function sendWaHasilAsessmenToMahasiswa(
    PendaftaranId: string,
): Promise<void> {
    const params = new URLSearchParams()
    params.append('PendaftaranId', PendaftaranId)
    params.append('jenis', 'wa')
    const res = await fetch(
        `${BASE_URL}/api/protected/asessment/sk-rektor?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch sk rektor')
    return res.json()
}

export async function getSkAsessmenPagination(
    page: number,
    limit: number,
    search: string
): Promise<Pagination<ResponseSkRektorAsessmenType[]>> {
    const params = new URLSearchParams()
    params.append('page', String(page))
    params.append('limit', String(limit))
    params.append('search', search)
    params.append('jenis', 'get-sk-rektor')
    const res = await fetch(
        `${BASE_URL}/api/protected/asessment/sk-rektor?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch sk rektor')
    return res.json()
}

export async function getSkAsessmenMahasiswaPagination(
    page: number,
    limit: number,
    search: string
): Promise<Pagination<ResponseSkRektorAsessmenType[]>> {
    const params = new URLSearchParams()
    params.append('page', String(page))
    params.append('limit', String(limit))
    params.append('search', search)
    params.append('_m', 'true')
    params.append('jenis', 'get-sk-rektor')
    const res = await fetch(
        `${BASE_URL}/api/protected/asessment/sk-rektor?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch sk rektor')
    return res.json()
}

export async function getSkAsessmenAsesorRolePagination(
    page: number,
    limit: number,
    search: string
): Promise<Pagination<ResponseSkRektorAsessmenType[]>> {
    const params = new URLSearchParams()
    params.append('page', String(page))
    params.append('limit', String(limit))
    params.append('search', search)
    params.append('_a', 'true')
    params.append('jenis', 'get-sk-rektor')
    const res = await fetch(
        `${BASE_URL}/api/protected/asessment/sk-rektor?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch sk rektor')
    return res.json()
}

export async function getSkAsessmenAkademikRolePagination(
    page: number,
    limit: number,
    search: string
): Promise<Pagination<ResponseSkRektorAsessmenType[]>> {
    const params = new URLSearchParams()
    params.append('page', String(page))
    params.append('limit', String(limit))
    params.append('search', search)
    params.append('_k', 'true')
    params.append('jenis', 'get-sk-rektor')
    const res = await fetch(
        `${BASE_URL}/api/protected/asessment/sk-rektor?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch sk rektor')
    return res.json()
}

export async function getFileSkAsessmenBlobByNamafile(
    NamaFile: string
): Promise<string> {
    const res = await fetch(
        `${BASE_URL}/api/protected/asessment/sk-rektor?jenis=_f&_f=${NamaFile}`
    )

    if (!res.ok) {
        throw new Error('Failed to get dokumen sk asessmen')
    }

    const blob = await res.blob()
    const previewUrl = URL.createObjectURL(blob)
    return previewUrl
}

export async function getSelesaiPagination(
    page: number,
    limit: number,
    search: string
): Promise<Pagination<ResponseSkRektorAsessmenType[]>> {
    const params = new URLSearchParams()
    params.append('page', String(page))
    params.append('limit', String(limit))
    params.append('search', search)
    const res = await fetch(
        `${BASE_URL}/api/protected/asessment/selesai?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch sk rektor')
    return res.json()
}

export type SkAsessmenTerbitType = {
    SkRektorId: string
    JenisSkAsessmen: 'PEROLEHAN_SKS' | 'TRANSFER_SKS'
    NamaSk: string
    NomorSk: string
    TahunSk: number
    NamaFile: string
    NamaDokumen: string
    Disetujui: boolean
    Catatan: string
}

export type FieldTemplateSisurat = {
    key: string
    label?: string | null
    dataType?: string | null
    required?: boolean
    diisiSisurat?: boolean
    fallback?: string | null
}

export type TemplateSisurat = {
    templateVersionId: string
    kode?: string | null
    nama: string
    letterType: string
    versionNumber: number
    placeholders: string[]
    /** Tersedia pada Sisurat versi baru; kosong pada versi lama. */
    fields?: FieldTemplateSisurat[] | null
}

/** Daftar template plus hasil pencocokan template SK RPL per skema. */
export type DaftarTemplateSisurat = {
    Daftar: TemplateSisurat[]
    Rpl: Record<
        'PEROLEHAN_SKS' | 'TRANSFER_SKS',
        TemplateSisurat | null
    >
}

export async function getTemplateSisurat(): Promise<DaftarTemplateSisurat> {
    const res = await fetch(
        `${BASE_URL}/api/protected/asessment/sk-rektor?jenis=template-sisurat`
    )
    const json = await res.json()
    if (!res.ok) throw new Error(json.message ?? 'Gagal memuat template Sisurat')
    return {
        Daftar: json.data ?? [],
        Rpl: json.rpl ?? { PEROLEHAN_SKS: null, TRANSFER_SKS: null },
    }
}

/**
 * Meminta Sisurat merender pratinjau surat dari isian saat ini.
 * Membalas galat 501 bila server Sisurat belum mendukung pratinjau.
 */
export async function pratinjauSkSisurat(payload: {
    PendaftaranId: string
    JenisSkAsessmen: 'PEROLEHAN_SKS' | 'TRANSFER_SKS'
    templateVersionId?: string
    Semester?: string
    TanggalAsesmen?: string
    Menimbang?: string[]
    Mengingat?: string[]
    Memperhatikan?: string[]
    Menetapkan?: string[]
}): Promise<{
    status: string
    message: string
    data: { Html: string; BelumTerisi: string[]; Template: string }
}> {
    const res = await fetch(
        `${BASE_URL}/api/protected/asessment/sk-rektor?jenis=pratinjau-sisurat`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        }
    )
    const json = await res.json()
    if (!res.ok) throw new Error(json.message ?? 'Gagal membuat pratinjau')
    return json
}

/**
 * Mendorong inisialisasi SK ke Sisurat.
 *
 * Template dipilih server berdasarkan kode (TPL-SK-RPL-PEROLEHAN/TRANSFER) dan
 * identitas mahasiswa diisi dari basis data; dari sini hanya dikirim bagian yang
 * memang disunting Akademik. Setelah ini, persetujuan Wakil Rektor, tanda tangan
 * Rektor, dan penomoran berjalan di Sisurat.
 */
export async function kirimSkKeSisurat(payload: {
    PendaftaranId: string
    JenisSkAsessmen: 'PEROLEHAN_SKS' | 'TRANSFER_SKS'
    NamaSk: string
    TahunSk: string
    /** Diisi hanya bila Akademik memilih template secara manual. */
    templateVersionId?: string
    Perihal?: string
    Semester?: string
    TanggalAsesmen?: string
    Menimbang?: string[]
    Mengingat?: string[]
    Memperhatikan?: string[]
    Menetapkan?: string[]
}): Promise<{
    status: string
    message: string
    data: SkAsessmenTerbitType & {
        SisuratLetterId: string
        SisuratStatus: string
        SisuratStepKey: string | null
        Template: string
        Warnings: string[]
    }
}> {
    const res = await fetch(
        `${BASE_URL}/api/protected/asessment/sk-rektor?jenis=kirim-sisurat`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        }
    )
    const json = await res.json()
    if (!res.ok) throw new Error(json.message ?? 'Gagal mengirim SK ke Sisurat')
    return json
}

export type StatusSkSisurat = {
    SkRektorId: string
    JenisSkAsessmen: 'PEROLEHAN_SKS' | 'TRANSFER_SKS' | null
    SisuratStatus: string
    SisuratStepKey: string | null
    NomorSk: string
    Ditandatangani: boolean
    PerluRevisi: boolean
    Catatan: string
}

export async function perbaruiStatusSisurat(PendaftaranId: string): Promise<{
    status: string
    message: string
    data: {
        Daftar: StatusSkSisurat[]
        SemuaDitandatangani: boolean
        AdaPerluRevisi: boolean
        Galat: string[]
    }
}> {
    const res = await fetch(
        `${BASE_URL}/api/protected/asessment/sk-rektor?jenis=perbarui-status`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ PendaftaranId }),
        }
    )
    const json = await res.json()
    if (!res.ok) throw new Error(json.message ?? 'Gagal memperbarui status')
    return json
}

/**
 * Membuka kembali SK agar dapat dikirim ulang ke Sisurat.
 *
 * `paksa` diperlukan bila suratnya masih berjalan di Sisurat — surat di sana
 * tidak ikut terhapus, jadi harus dibatalkan dari Sisurat agar tidak berganda.
 */
export async function resetSkSisurat(
    SkRektorId: string,
    paksa = false
): Promise<{
    status: string
    message: string
    data: {
        SkRektorId: string
        LetterIdDitinggalkan?: string | null
        PendaftaranId?: string | null
        /** true bila tak ada lagi SK pendaftaran ini yang tertaut Sisurat. */
        TidakAdaLagiTerkirim?: boolean
    }
}> {
    const res = await fetch(
        `${BASE_URL}/api/protected/asessment/sk-rektor?jenis=reset-sisurat`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ SkRektorId, Paksa: paksa }),
        }
    )
    const json = await res.json()
    if (!res.ok) throw new Error(json.message ?? 'Gagal membuka kembali SK')
    return json
}

export async function terbitkanSkAsessmen(
    PendaftaranId: string,
    JenisSkAsessmen: 'PEROLEHAN_SKS' | 'TRANSFER_SKS',
    NamaSk: string,
    NomorSk: string,
    TahunSk: string
): Promise<{ status: string; message: string; data: SkAsessmenTerbitType }> {
    const res = await fetch(
        `${BASE_URL}/api/protected/asessment/sk-rektor?jenis=terbitkan`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                PendaftaranId,
                JenisSkAsessmen,
                NamaSk,
                NomorSk,
                TahunSk,
            }),
        }
    )
    const json = await res.json()
    if (!res.ok) throw new Error(json.message ?? 'Gagal menerbitkan SK')
    return json
}

export async function setPublikasiSkAsessmen(
    PendaftaranId: string,
    Publikasikan: boolean
): Promise<{
    status: string
    message: string
    data: {
        Dipublikasikan: boolean
        /** Status berkas setelah publikasi; null bila gagal dimajukan. */
        Status?: string | null
    }
}> {
    const res = await fetch(
        `${BASE_URL}/api/protected/asessment/sk-rektor?jenis=publikasi`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ PendaftaranId, Publikasikan }),
        }
    )
    const json = await res.json()
    if (!res.ok) throw new Error(json.message ?? 'Gagal mengubah publikasi SK')
    return json
}
