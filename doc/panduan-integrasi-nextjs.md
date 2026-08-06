# QR Code Generator ITI

## Panduan Integrasi ke Next.js

Dokumen ini menjelaskan cara mengintegrasikan aplikasi QR Code Generator ITI (backend PHP) ke aplikasi Next.js. Semua komunikasi dilakukan lewat REST API berbasis JSON dan HTTP, sehingga tidak ada ketergantungan dengan bahasa atau framework backend aplikasi Anda.

Contoh kode di dokumen ini mengikuti struktur Next.js App Router (TypeScript). Pendekatan yang digunakan: seluruh pemanggilan API yang membutuhkan token dilakukan di sisi server (Route Handler / Server Action) agar kredensial dan token tidak pernah bocor ke browser.

| Item            | Nilai                                    |
| --------------- | ---------------------------------------- |
| Base URL API    | `https://pdsi.iti.ac.id/qrcodegenerator` |
| Format Response | JSON (`success: true/false`)             |
| Autentikasi     | Bearer Token (token berlaku 24 jam)      |
| CORS            | Terbuka (`Access-Control-Allow-Origin`)  |
| Login default   | username: `admin`, password: `password`  |

## 1. Prasyarat

- Next.js App Router (14 atau lebih baru) dengan TypeScript.
- Node.js versi 18 ke atas (`fetch` global sudah tersedia).
- Akses ke server API URL QR Code Generator dapat dijangkau dari server tempat Next.js berjalan.
- Kredensial API username dan password user yang terdaftar di aplikasi QR Code Generator (role admin atau user unit).

> **CATATAN PENTING**  
> Endpoint publik (`officials`, `units`, `verify`) dapat dipanggil tanpa token. Hanya operasi dokumen (`list` dan `create`) yang membutuhkan token hasil login.

## 2. Konfigurasi Environment

Simpan konfigurasi di file `.env.local` (development) atau di secret manager pada saat deployment. Jangan pernah menuliskan kredensial langsung di dalam kode.

```dotenv
# .env.local
QR_API_BASE_URL=https://pdsi.iti.ac.id/qrcodegenerator
QR_API_USERNAME=admin
QR_API_PASSWORD=password
```

> **CATATAN PENTING**  
> File `.env.local` sebaiknya dimasukkan ke `.gitignore`. Pada produksi, gunakan environment variable (misalnya Vercel/Netlify Environment Variables atau secret manager di server Anda).

## 3. Alur Integrasi (Ringkas)

1. Next.js memanggil `POST /api/login.php` dengan username dan password untuk mendapat token.
2. Token dikirim sebagai header `Authorization: Bearer <token>` pada endpoint yang dilindungi.
3. Ambil daftar pejabat (`GET /api/officials.php`) sebagai referensi nilai `official_id`.
4. Buat dokumen dan QR lewat `POST /api/documents.php`; server mengembalikan `qrcode_base64` dan `verify_url`.
5. Tempel QR ke dokumen, PDF, atau email Anda. `qrcode_base64` bersifat mandiri (tidak perlu akses file server).
6. Verifikasi publik lewat `GET /api/verify.php?t=<token>`.

## 4. Referensi Endpoint

| Method | Endpoint                    | Auth   | Keterangan                                                       |
| ------ | --------------------------- | ------ | ---------------------------------------------------------------- |
| `POST` | `/api/login.php`            | -      | Login, mendapat token API                                        |
| `POST` | `/api/logout.php`           | Bearer | Mencabut (revoke) token                                          |
| `GET`  | `/api/verify.php?t={token}` | -      | Verifikasi dokumen/pejabat dari QR (publik)                      |
| `GET`  | `/api/officials.php`        | -      | Daftar pejabat aktif. Filter: `?level=`, `?unit_id=`, `?search=` |
| `GET`  | `/api/units.php`            | -      | Daftar unit dan jumlah pejabat                                   |
| `GET`  | `/api/documents.php`        | Bearer | Daftar dokumen. Filter: `?official_id=`, `?search=`              |
| `POST` | `/api/documents.php`        | Bearer | Buat dokumen dan generate QR unik                                |

**Catatan:** user unit (non-admin) hanya melihat/membuat dokumen untuk pejabat di unitnya sendiri. User non-admin tidak dapat membuat dokumen untuk pejabat di luar unitnya.

### Badan Permintaan `POST /api/documents.php`

```json
{
    "official_id": 30,
    "doc_number": "123/ITI.R/Rek/VI/2026",
    "doc_title": "SK Pengangkatan Rektor",
    "doc_date": "2026-07-31"
}
```

`official_id` dan `doc_number` wajib diisi. `doc_title` dan `doc_date` (format `YYYY-MM-DD`) bersifat opsional. Response sukses (HTTP 201) berisi:

```json
{
    "success": true,
    "message": "Dokumen dan QR Code berhasil dibuat.",
    "data": {
        "id": 6,
        "official_id": 30,
        "official_name": "Dr. Ir. Iyus Hendrawan, ...",
        "official_position": "Kepala Biro Kerjasama Dan Humas",
        "official_unit": "Biro Kerjasama Dan Humas",
        "token": "5cea...08",
        "doc_number": "123/ITI.R/Rek/VI/2026",
        "doc_title": "SK Pengangkatan Rektor",
        "doc_date": "2026-07-31",
        "qrcode_url": "https://pdsi.iti.ac.id/qrcodegenerator/uploads/qrcodes/dok_5cea...08.png",
        "qrcode_base64": "data:image/png;base64,iVBORw0KG...",
        "verify_url": "https://pdsi.iti.ac.id/qrcodegenerator/verify.php?t=5cea...08"
    }
}
```

## 5. Membuat API Client (`lib/qrcode-api.ts`)

Buat satu file helper yang membungkus seluruh pemanggilan API. Token login di-cache per proses server; ini cukup untuk menghindari login berulang tanpa menyimpan token di database sendiri.

```ts
// lib/qrcode-api.ts
const API_BASE =
    process.env.QR_API_BASE_URL ?? 'https://pdsi.iti.ac.id/qrcodegenerator'

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
    return cachedToken
}

export const qrApi = {
    async officials(params?: Record<string, string>) {
        const qs = new URLSearchParams(params ?? {}).toString()
        return call('/api/officials.php' + (qs ? '?' + qs : ''))
    },

    async units() {
        return call('/api/units.php')
    },

    async documents() {
        const token = await getToken()
        return call('/api/documents.php', {
            headers: { Authorization: 'Bearer ' + token },
        })
    },

    async createDocument(payload: CreateDocumentPayload) {
        const token = await getToken()
        return call('/api/documents.php', {
            method: 'POST',
            headers: { Authorization: 'Bearer ' + token },
            body: JSON.stringify(payload),
        })
    },

    async verify(token: string) {
        return call('/api/verify.php?t=' + encodeURIComponent(token))
    },
}
```

## 6. Route Handler (`app/api/qrcode/route.ts`)

Untuk klien browser, jangan panggil `qrApi` secara langsung. Bungkus dengan Route Handler atau Server Action. Dengan begitu token tidak pernah dikirim ke browser.

```ts
// app/api/qrcode/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { qrApi } from '@/lib/qrcode-api'

export async function GET() {
    try {
        const result = await qrApi.documents()
        return NextResponse.json(result)
    } catch (e) {
        return NextResponse.json(
            { success: false, message: (e as Error).message },
            { status: 500 }
        )
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const result = await qrApi.createDocument({
            official_id: Number(body.official_id),
            doc_number: String(body.doc_number ?? ''),
            doc_title: body.doc_title ?? undefined,
            doc_date: body.doc_date ?? undefined,
        })

        return NextResponse.json(result, { status: 201 })
    } catch (e) {
        return NextResponse.json(
            { success: false, message: (e as Error).message },
            { status: 400 }
        )
    }
}
```

## 7. Server Action (`app/actions.ts`)

Alternatif yang lebih sederhana untuk formulir: gunakan Server Action dengan atribut `action` pada form, atau panggil dari komponen client.

```ts
// app/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { qrApi } from '@/lib/qrcode-api'

export type CreateDocumentState =
    | {
          ok: true
          message: string
          verifyUrl: string
          qrcodeBase64: string
      }
    | { ok: false; message: string }

export async function createDocumentAction(
    _prev: CreateDocumentState | null,
    formData: FormData
): Promise<CreateDocumentState> {
    try {
        const result = await qrApi.createDocument({
            official_id: Number(formData.get('official_id')),
            doc_number: String(formData.get('doc_number') ?? ''),
            doc_title: (formData.get('doc_title') as string) || undefined,
            doc_date: (formData.get('doc_date') as string) || undefined,
        })

        revalidatePath('/documents')

        return {
            ok: true,
            message: result.message,
            verifyUrl: result.data.verify_url,
            qrcodeBase64: result.data.qrcode_base64,
        }
    } catch (e) {
        return { ok: false, message: (e as Error).message }
    }
}
```

## 8. Contoh Halaman

### 8.1 Form Buat Dokumen (`app/documents/create/page.tsx`)

```tsx
// app/documents/create/page.tsx
'use client'

import { useActionState } from 'react'
import { createDocumentAction, type CreateDocumentState } from '@/app/actions'

const initial: CreateDocumentState = { ok: false, message: '' }

export default function CreateDocumentPage() {
    const [state, action, pending] = useActionState(
        createDocumentAction,
        initial
    )

    return (
        <form action={action}>
            <label>
                Official ID
                <input name="official_id" type="number" required />
            </label>

            <label>
                Nomor Dokumen
                <input
                    name="doc_number"
                    type="text"
                    required
                    placeholder="123/ITI.R/Rek/VI/2026"
                />
            </label>

            <label>
                Judul Dokumen (opsional)
                <input name="doc_title" type="text" />
            </label>

            <label>
                Tanggal (opsional, YYYY-MM-DD)
                <input name="doc_date" type="date" />
            </label>

            <button disabled={pending}>
                {pending ? 'Memproses...' : 'Buat Dokumen + QR'}
            </button>

            {state.message && <p>{state.message}</p>}

            {state.ok && (
                <img
                    src={state.qrcodeBase64}
                    alt="QR Dokumen"
                    width={200}
                    height={200}
                />
            )}
        </form>
    )
}
```

> **CATATAN PENTING**  
> Contoh di atas menggunakan `useActionState` (Next.js 15+). `qrcode_base64` dikembalikan oleh server action dalam bentuk data URI PNG sehingga bisa langsung dipakai sebagai `src` pada `<img>` tanpa memuat file dari server.

### 8.2 Daftar Dokumen (`app/documents/page.tsx`)

```tsx
// app/documents/page.tsx
import { qrApi } from '@/lib/qrcode-api'

type DocumentItem = {
    id: number
    doc_number: string
    doc_title: string | null
    official_name: string
    official_position: string
    qrcode_url: string
    verify_url: string
    created_at: string
}

export default async function DocumentsPage() {
    const { data } = await qrApi.documents()

    return (
        <ul>
            {(data as DocumentItem[]).map((d) => (
                <li key={d.id}>
                    <strong>{d.doc_number}</strong> - {d.official_name}
                    <br />
                    <img src={d.qrcode_url} alt="QR" width={120} height={120} />
                    <a href={d.verify_url}>Lihat verifikasi</a>
                </li>
            ))}
        </ul>
    )
}
```

### 8.3 Halaman Verifikasi Publik (`app/verify/[token]/page.tsx`)

Halaman ini meniru `verify.php` milik QR Code Generator: menerima token dari URL dan menampilkan detail dokumen beserta pejabatnya.

```tsx
// app/verify/[token]/page.tsx
import { qrApi } from '@/lib/qrcode-api'

type Params = { params: Promise<{ token: string }> }

export default async function VerifyPage({ params }: Params) {
    const { token } = await params
    const { data } = await qrApi.verify(token)
    const official = data.official

    return (
        <main>
            <h1>Verifikasi Dokumen</h1>
            <dl>
                <dt>Nomor Dokumen</dt>
                <dd>{data.doc_number}</dd>

                <dt>Judul</dt>
                <dd>{data.doc_title ?? '-'}</dd>

                <dt>Tanggal</dt>
                <dd>{data.doc_date ?? '-'}</dd>

                <dt>Ditandatangani oleh</dt>
                <dd>
                    {official.name} ({official.position})
                </dd>

                <dt>Unit</dt>
                <dd>{official.unit}</dd>
            </dl>
        </main>
    )
}
```

## 9. Menampilkan QR Code di Next.js

`qrcode_base64` adalah data URI PNG sehingga bisa langsung dipakai sebagai sumber gambar tanpa memuat file dari server:

```tsx
// data URI: data:image/png;base64,iVBORw0KG...
<img src={qrcode_base64} alt="QR Dokumen" width={200} height={200} />
```

Jika menginginkan unduhan gambar QR, konversi data URI menjadi Blob di browser atau fetch `qrcode_url` di server dan set `Content-Disposition`.

## 10. Catatan Keamanan

- Jangan pernah mengekspos token atau kredensial ke browser. Semua pemanggilan yang membutuhkan auth dilakukan di Route Handler atau Server Action (sisi server).
- Simpan kredensial di environment variable (server-side), bukan di kode atau di file yang dibundel ke client.
- Gunakan HTTPS pada produksi. Sesuaikan CORS di sisi API bila hanya domain tertentu yang diizinkan.
- Token API berlaku 24 jam dan hanya disimpan sebagai hash SHA-256 di database server.
- Server API memiliki rate limit login (10 kali gagal dalam 15 menit).

## 11. Kode Error yang Sering Muncul

|  Kode | Arti                                  | Solusi                                           |
| ----: | ------------------------------------- | ------------------------------------------------ |
| `400` | Parameter salah / pejabat tidak valid | Cek `official_id` aktif dan `doc_number` terisi. |
| `401` | Token salah / kedaluwarsa             | Login ulang, gunakan token baru.                 |
| `404` | Token QR tidak ditemukan              | QR tidak terdaftar atau dokumen nonaktif.        |
| `405` | Method tidak diizinkan                | Gunakan GET/POST sesuai tabel endpoint.          |
| `429` | Terlalu banyak percobaan login gagal  | Tunggu 15 menit sebelum mencoba lagi.            |

## 12. Skenario Integrasi Umum

| Kebutuhan                   | Cara                                                                      |
| --------------------------- | ------------------------------------------------------------------------- |
| Tempel QR di surat/PDF      | Gunakan `qrcode_base64` sebagai gambar di template dokumen.               |
| Kirim QR via email/WhatsApp | Kirim `qrcode_base64` atau `qrcode_url` ke API pengirim pesan.            |
| Cek keaslian dari aplikasi  | `GET /api/verify.php?t=<token>` lalu validasi `success` dan `doc_number`. |
| Menampilkan daftar pejabat  | `GET /api/officials.php?unit_id=<id>` (publik, tanpa token).              |
| Menampilkan daftar dokumen  | `GET /api/documents.php` dengan header Bearer.                            |
