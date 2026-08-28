// Client API Nomor Surat Sisurat ITI (lihat doc/panduan-api-nomor-surat.md).
// Server-to-server: clientId/clientSecret hanya boleh dibaca di sisi server.
/**
 * Domain Sisurat diambil dari environment supaya dapat diarahkan ke server
 * pengembangan tanpa mengubah kode. `SISURAT_BASE_URL` didukung sebagai nama
 * alternatif karena itulah yang dipakai dokumen integrasi. Nilai kosong atau
 * hanya spasi diabaikan, dan garis miring di ujung dibuang agar tidak menjadi
 * URL berganda (…iti.ac.id//api/external/v1).
 */
function domainSisurat(): string {
    const dariEnv = [
        process.env.SISURAT_API_BASE_URL,
        process.env.SISURAT_BASE_URL,
    ]
        .map((x) => (x ?? '').trim())
        .find((x) => x.length > 0)

    return (dariEnv ?? 'https://sisurat.iti.ac.id').replace(/\/+$/, '')
}

/** Domain Sisurat yang sedang dipakai; berguna untuk pesan galat & diagnosis. */
export const SISURAT_DOMAIN = domainSisurat()

const API_BASE = SISURAT_DOMAIN + '/api/external/v1'

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

/**
 * Rincian satu placeholder template. Inilah sumber kebenaran isian — lebih
 * tepercaya daripada menebak dari nama kuncinya (integrasi-rpl-sisurat §6.2).
 */
export type FieldTemplate = {
    key: string
    label?: string | null
    /** TEXT | DATE | LIST | TABLE | … */
    dataType?: string | null
    required?: boolean
    /** true = Sisurat yang mengisinya; jangan dikirim dari sini. */
    diisiSisurat?: boolean
    fallback?: string | null
}

/** Template surat yang tersedia di Sisurat beserta placeholder-nya. */
export type TemplateSurat = {
    templateVersionId: string
    /** Kode stabil template (mis. TPL-SK-RPL-PEROLEHAN); dipakai untuk mencocokkan. */
    kode?: string | null
    nama: string
    letterType: string
    versionNumber: number
    placeholders: string[]
    /** Tersedia pada Sisurat versi baru; kosong pada versi lama. */
    fields?: FieldTemplate[] | null
}

/** Hasil pratinjau surat (POST /templates/{id}/preview). */
export type PratinjauSurat = {
    templateVersionId: string
    kode?: string | null
    nama?: string | null
    /** Dokumen HTML mandiri, siap ditaruh pada iframe srcDoc. */
    html: string
    /** Placeholder wajib yang masih kosong. */
    unfilled?: string[]
}

/**
 * Kode template SK RPL di Sisurat. Dicocokkan lewat kode — bukan nama atau
 * UUID — karena kode bersifat stabil sedangkan `templateVersionId` berganti
 * setiap template diterbitkan ulang (lihat doc/integrasi-rpl-sisurat.md §6.2).
 */
export const KODE_TEMPLATE_RPL = {
    PEROLEHAN_SKS: 'TPL-SK-RPL-PEROLEHAN',
    TRANSFER_SKS: 'TPL-SK-RPL-TRANSFER',
} as const

/** Kata kunci nama template SK RPL, dipakai bila kodenya belum ditetapkan. */
export const NAMA_TEMPLATE_RPL = 'SK Hasil Asesmen RPL'

const KATA_SKEMA: Record<keyof typeof KODE_TEMPLATE_RPL, RegExp> = {
    PEROLEHAN_SKS: /perolehan/i,
    TRANSFER_SKS: /transfer/i,
}

/**
 * Mencari template SK RPL untuk satu skema.
 *
 * Urutan pencarian: kode resmi → nama "SK Hasil Asesmen RPL" yang menyebut
 * skemanya → satu-satunya template bernama "SK Hasil Asesmen RPL" (dipakai
 * kedua skema). Mengembalikan null bila tidak ada yang cocok, supaya pemanggil
 * dapat memberi tahu bahwa templatenya belum terbit di Sisurat.
 */
export function cariTemplateRpl(
    daftar: TemplateSurat[],
    jenis: keyof typeof KODE_TEMPLATE_RPL
): TemplateSurat | null {
    const kode = KODE_TEMPLATE_RPL[jenis]
    const skema = KATA_SKEMA[jenis]

    const lewatKode = daftar.find((t) => t.kode === kode)
    if (lewatKode) return lewatKode

    const berlabelRpl = daftar.filter((t) =>
        (t.nama ?? '').toLowerCase().includes(NAMA_TEMPLATE_RPL.toLowerCase())
    )
    const lewatSkema = berlabelRpl.find((t) => skema.test(t.nama ?? ''))
    if (lewatSkema) return lewatSkema

    // Satu template untuk kedua skema — skemanya dibedakan lewat isian.
    if (berlabelRpl.length === 1) return berlabelRpl[0]

    return null
}

/** Tanda tangan QR pejabat; terisi setelah tahap SIGNING di Sisurat selesai. */
export type TandaTanganSurat = {
    officialName: string | null
    officialPosition: string | null
    officialUnit: string | null
    verifyUrl: string | null
    signedAt: string | null
    /** Hanya terisi bila status diminta dengan `qr=1`. */
    qrBase64?: string | null
}

/** Berkas surat di Sisurat: dokumen final bertanda tangan maupun lampiran asli. */
export type DokumenSurat = {
    attachmentId: string
    namaBerkas: string
    ukuran: number
    /** SHA-256 isi berkas, untuk memastikan unduhan tidak rusak. */
    checksum?: string | null
}

/** Keputusan penolakan / permintaan revisi terakhir pada alur Sisurat. */
export type KeputusanSurat = {
    stepKey: string | null
    decision: string | null
    note: string | null
    byRoleName: string | null
    decidedAt: string | null
}

/** Hasil inisialisasi surat (POST /surat). */
export type SuratInisialisasi = {
    letterId: string
    status: string
    letterType: string
    perihal: string
    currentStepKey: string | null
    pendingTasks: number
    attachments: number
    externalReference: string | null
    warnings: string[]
}

/** Status surat yang sedang berjalan di alur Sisurat (GET /surat/{id}). */
export type StatusSurat = {
    letterId: string
    perihal: string
    letterType: string
    status: string
    nomorSurat: string | null
    nomorSuratTerbitPada?: string | null
    workflowStatus: string
    currentStepKey: string | null
    externalReference: string | null
    initiatedAt?: string
    signature: TandaTanganSurat | null
    /** Seluruh penanda tangan pada surat, bila lebih dari satu. */
    signatures?: TandaTanganSurat[] | null
    /** Berkas SK final bertanda tangan; ada setelah tahap SIGNING selesai. */
    dokumenFinal?: DokumenSurat | null
    /** Lampiran yang dulu dikirim RPL saat inisialisasi. */
    dokumenAsli?: DokumenSurat | null
    lastDecision: KeputusanSurat | null
}

/** Status yang berarti surat perlu diperbaiki lalu diinisialisasi ulang. */
export const STATUS_PERLU_REVISI = ['REJECTED', 'REVISION_REQUESTED', 'CANCELLED']

type InisialisasiPayload = {
    templateVersionId: string
    perihal: string
    fieldValues?: Record<string, string>
    tanggalSurat?: string
    externalReference?: string
}

/** Lampiran PDF yang disertakan saat inisialisasi. */
export type LampiranPdf = {
    namaFile: string
    data: Uint8Array | Buffer
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
    let res: Response
    try {
        res = await fetch(API_BASE + path, {
            ...init,
            headers: {
                'Content-Type': 'application/json',
                ...(init?.headers ?? {}),
            },
            cache: 'no-store',
        })
    } catch (err) {
        // Domain salah atau server tidak terjangkau — sebutkan alamatnya supaya
        // salah konfigurasi environment langsung kelihatan.
        throw new Error(
            `Tidak dapat menghubungi Sisurat di ${SISURAT_DOMAIN} — periksa SISURAT_API_BASE_URL. (${(err as Error).message})`
        )
    }

    const json = await res.json().catch(() => null)

    if (!res.ok || json?.status === 'error') {
        throw new Error(
            json?.message ??
            `Sisurat (${SISURAT_DOMAIN}) membalas HTTP ${res.status}`
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
     * Daftar template terbit beserta placeholder yang perlu diisi.
     *
     * Penyaring `kode` / `letterType` / `search` diabaikan Sisurat versi lama,
     * jadi hasilnya tetap disaring ulang di sini bila `kode` diminta.
     */
    async templates(
        saring: { kode?: string; letterType?: string; search?: string } = {}
    ): Promise<TemplateSurat[]> {
        const params = new URLSearchParams()
        if (saring.kode) params.set('kode', saring.kode)
        if (saring.letterType) params.set('letterType', saring.letterType)
        if (saring.search) params.set('search', saring.search)
        const kueri = params.toString()

        return withToken(async (token) => {
            const json = await call('/templates' + (kueri ? '?' + kueri : ''), {
                headers: { Authorization: 'Bearer ' + token },
            })
            const data = (json.data ?? []) as TemplateSurat[]
            return saring.kode
                ? data.filter((t) => t.kode === saring.kode)
                : data
        })
    },

    /**
     * Rincian satu template: `fields` lengkap plus struktur dokumennya.
     * Belum tersedia pada Sisurat versi lama — di sana membalas 404.
     */
    async templateDetail(
        templateVersionId: string
    ): Promise<(TemplateSurat & { document?: unknown }) | null> {
        return withToken(async (token) => {
            try {
                const json = await call(
                    '/templates/' + encodeURIComponent(templateVersionId),
                    { headers: { Authorization: 'Bearer ' + token } }
                )
                return json.data as TemplateSurat & { document?: unknown }
            } catch (err) {
                if (/\b404\b|tidak ditemukan|not found/i.test(String(err))) {
                    return null
                }
                throw err
            }
        })
    },

    /**
     * Meminta Sisurat merender pratinjau surat. Tidak membuat surat apa pun,
     * aman dipanggil berulang saat pengguna menyunting isian.
     *
     * Mengembalikan null bila endpointnya belum tersedia (404), supaya
     * antarmuka dapat menjelaskannya alih-alih menampilkan galat.
     */
    async pratinjauSurat(
        templateVersionId: string,
        payload: {
            fieldValues: Record<string, string>
            tanggalSurat?: string
            nomorSurat?: string
        }
    ): Promise<PratinjauSurat | null> {
        return withToken(async (token) => {
            try {
                const json = await call(
                    '/templates/' +
                    encodeURIComponent(templateVersionId) +
                    '/preview',
                    {
                        method: 'POST',
                        headers: { Authorization: 'Bearer ' + token },
                        body: JSON.stringify(payload),
                    }
                )
                return json.data as PratinjauSurat
            } catch (err) {
                if (/\b404\b|tidak ditemukan|not found/i.test(String(err))) {
                    return null
                }
                throw err
            }
        })
    },

    /**
     * Menginisialisasi surat di Sisurat: template + nilai placeholder + lampiran
     * PDF. Sekali panggil, surat langsung masuk alur Sisurat (peninjauan,
     * persetujuan, penomoran) dan kelanjutannya tidak dikendalikan dari sini.
     */
    async inisialisasiSurat(
        payload: InisialisasiPayload,
        lampiran: LampiranPdf[] = []
    ): Promise<SuratInisialisasi> {
        return withToken(async (token) => {
            const fd = new FormData()
            // `payload` harus berupa RUAS TEKS biasa. Bila dikirim sebagai Blob,
            // ia menjadi bagian berkas (filename "blob") dan Sisurat membalas
            // 400 "Field 'payload' (JSON) wajib diisi".
            fd.set('payload', JSON.stringify(payload))
            for (const l of lampiran) {
                fd.append(
                    'attachment',
                    new Blob([new Uint8Array(l.data)], {
                        type: 'application/pdf',
                    }),
                    l.namaFile
                )
            }

            // Content-Type sengaja tidak diisi manual supaya boundary multipart
            // dibuat oleh runtime.
            const res = await fetch(API_BASE + '/surat', {
                method: 'POST',
                headers: { Authorization: 'Bearer ' + token },
                body: fd,
                cache: 'no-store',
            })

            const json = await res.json().catch(() => null)
            if (!res.ok || json?.status === 'error') {
                throw new Error(
                    json?.message ??
                    `Sisurat (${SISURAT_DOMAIN}) membalas HTTP ${res.status}`
                )
            }
            return json.data as SuratInisialisasi
        })
    },

    /**
     * Memantau status surat yang sudah diinisialisasi klien ini.
     *
     * `qr` hanya diaktifkan ketika gambar QR benar-benar akan dipakai — gambarnya
     * puluhan KB dan tidak perlu ikut pada setiap pemantauan.
     */
    async statusSurat(
        letterId: string,
        opsi: { qr?: boolean } = {}
    ): Promise<StatusSurat> {
        return withToken(async (token) => {
            const json = await call(
                '/surat/' +
                encodeURIComponent(letterId) +
                (opsi.qr ? '?qr=1' : ''),
                { headers: { Authorization: 'Bearer ' + token } }
            )
            return json.data as StatusSurat
        })
    },

    /**
     * Mengunduh berkas SK final bertanda tangan dari Sisurat.
     *
     * Inilah dokumen resmi yang nantinya diunduh mahasiswa — bukan lampiran
     * hasil asesmen yang dulu dikirim RPL. Tersedia setelah tahap SIGNING
     * selesai; sebelum itu Sisurat membalas 404.
     */
    async unduhDokumenFinal(
        letterId: string
    ): Promise<{ data: Uint8Array; namaBerkas: string } | null> {
        return withToken(async (token) => {
            const res = await fetch(
                API_BASE + '/surat/' + encodeURIComponent(letterId) + '/dokumen',
                {
                    headers: { Authorization: 'Bearer ' + token },
                    cache: 'no-store',
                }
            )

            if (res.status === 404) return null

            if (!res.ok) {
                throw new Error(
                    `Gagal mengunduh dokumen SK dari Sisurat (${SISURAT_DOMAIN}): HTTP ${res.status}`
                )
            }

            const tipe = res.headers.get('content-type') ?? ''
            if (!tipe.includes('pdf')) {
                throw new Error(
                    `Sisurat mengembalikan ${tipe || 'tipe tidak dikenal'}, bukan PDF`
                )
            }

            // Nama berkas diambil dari Content-Disposition bila ada.
            const disposisi = res.headers.get('content-disposition') ?? ''
            const cocok = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(disposisi)

            return {
                data: new Uint8Array(await res.arrayBuffer()),
                namaBerkas: cocok?.[1] ?? `${letterId}.pdf`,
            }
        })
    },

    /**
     * Menerbitkan satu nomor surat resmi.
     *
     * TIDAK DIPAKAI pada alur SK hasil asesmen: penomoran adalah kewenangan
     * Sisurat (doc/integrasi-rpl-sisurat.md §1). Fungsi ini dipertahankan untuk
     * keperluan lain dan dikunci di belakang SISURAT_IZINKAN_NOMOR_MANUAL agar
     * tidak terpanggil tanpa sengaja — sekali nomor terbit, ia tidak dapat
     * ditarik kembali.
     */
    async mintNomorSurat(payload: MintPayload = {}): Promise<NomorSuratResult> {
        if (process.env.SISURAT_IZINKAN_NOMOR_MANUAL !== 'true') {
            throw new Error(
                'Penomoran surat dari RPL dinonaktifkan — nomor surat diterbitkan Sisurat pada tahap ADMINISTRATION'
            )
        }
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
