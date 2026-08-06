# Panduan API Nomor Surat — untuk Aplikasi Klien

Dokumen ini untuk **pengembang aplikasi lain** yang ingin **meminta nomor surat
resmi** dari Sisurat ITI melalui API.

Cara kerjanya: aplikasi Anda memanggil API, **setiap panggilan sukses membuat
satu nomor surat baru**, menyimpannya di basis data Sisurat, lalu mengembalikan
**nomor yang siap dipakai** (teks). Nomor diambil dari deret resmi yang sama
dengan penomoran internal ITI sehingga tidak pernah bentrok.

> API ini **hanya** memberi nomor. Tidak menghasilkan QR Code. Bila Anda butuh
> QR tanda tangan, panggil layanan QR Code Generator ITI secara terpisah dengan
> nomor yang Anda peroleh di sini.

---

## 1. Yang Perlu Anda Siapkan

Minta **kredensial klien** kepada admin Sisurat (dibuat lewat menu superadmin
**Administrasi Sistem → Klien API**). Anda akan menerima dua nilai:

| Nilai          | Keterangan                                                       |
| -------------- | ---------------------------------------------------------------- |
| `clientId`     | Identitas publik aplikasi Anda (mis. `iti_ab12cd34ef`).          |
| `clientSecret` | Rahasia — **hanya ditampilkan sekali** saat dibuat. Simpan aman. |

Bila `clientSecret` hilang, minta admin melakukan **Rotasi secret** (secret lama
langsung tidak berlaku, Anda dapat yang baru).

---

## 2. Ringkasan

| Hal         | Nilai                                                    |
| ----------- | -------------------------------------------------------- |
| Base URL    | `https://sisurat.iti.ac.id`                              |
| Prefix      | `/api/external/v1`                                       |
| Format      | JSON (`status: "success" \| "error"`, `data`, `message`) |
| Autentikasi | Bearer JWT (diperoleh dari endpoint token)               |
| Umur token  | 24 jam                                                   |

Semua respons memakai amplop seragam:

```json
{ "data": {}, "status": "success", "message": "..." }
```

Saat gagal: `data` = `null`, `status` = `"error"`, `message` berisi alasan.

---

## 3. Alur Pemakaian

1. Tukar `clientId` + `clientSecret` di **`POST /auth/token`** → dapat `token`.
2. Simpan token (berlaku 24 jam). Perbarui bila memperoleh respons `401`.
3. (Opsional) Lihat pilihan jenis surat di **`GET /jenis-surat`**.
4. Minta nomor di **`POST /nomor-surat`** dengan header
   `Authorization: Bearer <token>`.
5. Pakai `nomorSurat` dari respons pada dokumen Anda.

---

## 4. Endpoint

### 4.1 `POST /api/external/v1/auth/token` — ambil token

Tanpa header Authorization.

Request:

```json
{ "clientId": "iti_ab12cd34ef", "clientSecret": "RAHASIA_ANDA" }
```

Response `200`:

```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1Ni.....",
    "tokenType": "Bearer",
    "expiresIn": 86400,
    "scopes": ["numbering"]
  },
  "status": "success",
  "message": "Token diterbitkan"
}
```

Galat: `400` (field kurang), `401` (`Kredensial klien tidak valid`).

---

### 4.2 `GET /api/external/v1/me` — cek token

Header `Authorization: Bearer <token>`. Berguna untuk memastikan token masih valid.

Response `200`:

```json
{
  "data": {
    "clientId": "iti_ab12cd34ef",
    "nama": "SIM Akademik",
    "scopes": ["numbering"]
  },
  "status": "success",
  "message": "Token valid"
}
```

---

### 4.3 `GET /api/external/v1/jenis-surat` — daftar jenis surat

Header Bearer. Mengembalikan jenis surat yang bisa dinomori + pola nomornya.

Response `200` (ringkas):

```json
{
  "data": [
    {
      "letterType": "NOTA_DINAS",
      "label": "Nota Dinas",
      "code": "INT",
      "contohPola": "001/INT/{unitKode}-ITI/{bulanRomawi}/2026"
    },
    {
      "letterType": "SURAT_KELUAR",
      "label": "Surat Keluar",
      "code": "",
      "contohPola": "001/{unitKode}/{bulanRomawi}/2026"
    }
  ],
  "status": "success",
  "message": "Daftar jenis surat"
}
```

Jenis yang didukung: `NOTA_DINAS`, `SURAT_EDARAN`, `SURAT_TUGAS_DINAS_LUAR`,
`SURAT_TUGAS_INTERNAL`, `SURAT_KELUAR`, `SURAT_KEPUTUSAN`.

---

### 4.4 `POST /api/external/v1/nomor-surat` — minta nomor ⟵ endpoint utama

Header `Authorization: Bearer <token>`.

**Input (request body):**

| Field               | Wajib  | Tipe   | Keterangan                                                                        |
| ------------------- | ------ | ------ | --------------------------------------------------------------------------------- |
| `letterType`        | **ya** | string | Jenis surat yang diminta (lihat §4.3). Menentukan deret & pola nomor.             |
| `unitKode`          | **ya** | string | Kode unit/prodi penerbit (mis. `Rek`, `FTI`, `EL`). Divalidasi ke data ITI.       |
| `date`              | tidak  | string | ISO-8601 (mis. `2026-08-06`). Menentukan bulan Romawi & tahun. Default: hari ini. |
| `externalReference` | tidak  | string | Referensi milik Anda (mis. id dokumen di sistem Anda) untuk penelusuran.          |
| `note`              | tidak  | string | Catatan bebas.                                                                    |

Contoh request:

```json
{
  "letterType": "NOTA_DINAS",
  "unitKode": "Rek",
  "externalReference": "DOC-2026-0007"
}
```

**Output** — Response `201`:

```json
{
  "data": {
    "nomorSurat": "012/INT/Rek-ITI/VIII/2026",
    "letterType": "NOTA_DINAS",
    "unitKode": "Rek",
    "sequence": 12,
    "scopeYear": 2026,
    "sequenceKey": "NOTA_DINAS",
    "externalReference": "DOC-2026-0007",
    "issuedAt": "2026-08-06T03:11:22.000Z"
  },
  "status": "success",
  "message": "Nomor surat diterbitkan"
}
```

Gunakan `data.nomorSurat` sebagai nomor surat final.

Galat umum: `400` (`letterType tidak valid`, `unitKode wajib diisi`,
`unitKode '...' tidak dikenal atau tidak aktif`, `date tidak valid`),
`401` (token tidak valid/kedaluwarsa), `403` (klien tidak berizin).

> **Penting:** setiap panggilan sukses **memakai satu nomor** dari deret dan
> tidak dapat dibatalkan. Panggil hanya saat Anda benar-benar akan memakai
> nomornya. Tidak ada mode "intip" tanpa menaikkan deret.

---

## 5. Contoh Kode

### cURL

```bash
# 1) Ambil token
TOKEN=$(curl -s -X POST https://sisurat.iti.ac.id/api/external/v1/auth/token \
  -H 'Content-Type: application/json' \
  -d '{"clientId":"iti_ab12cd34ef","clientSecret":"RAHASIA_ANDA"}' \
  | jq -r '.data.token')

# 2) Minta nomor
curl -s -X POST https://sisurat.iti.ac.id/api/external/v1/nomor-surat \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"letterType":"SURAT_KELUAR","unitKode":"Rek"}' | jq
```

### Node.js (fetch)

```ts
const BASE = "https://sisurat.iti.ac.id/api/external/v1";

async function getToken(
  clientId: string,
  clientSecret: string,
): Promise<string> {
  const res = await fetch(`${BASE}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clientId, clientSecret }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data.token;
}

async function mintNumber(
  token: string,
  letterType: string,
  unitKode: string,
): Promise<string> {
  const res = await fetch(`${BASE}/nomor-surat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ letterType, unitKode }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data.nomorSurat; // mis. "012/INT/Rek-ITI/VIII/2026"
}
```

### PHP

```php
<?php
$BASE = "https://sisurat.iti.ac.id/api/external/v1";

function post($url, $body, $headers = []) {
  $ch = curl_init($url);
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => array_merge(["Content-Type: application/json"], $headers),
    CURLOPT_POSTFIELDS => json_encode($body),
  ]);
  $res = json_decode(curl_exec($ch), true);
  curl_close($ch);
  return $res;
}

$tok = post("$BASE/auth/token", ["clientId" => "iti_ab12cd34ef", "clientSecret" => "RAHASIA_ANDA"]);
$token = $tok["data"]["token"];

$out = post("$BASE/nomor-surat",
  ["letterType" => "NOTA_DINAS", "unitKode" => "Rek"],
  ["Authorization: Bearer $token"]);

echo $out["data"]["nomorSurat"]; // 012/INT/Rek-ITI/VIII/2026
```

---

## 6. Catatan Penting

- Simpan `clientSecret` di sisi server aplikasi Anda (brankas rahasia/env),
  **bukan** di kode yang bisa diakses publik/browser. API ini server-to-server.
- Token berumur 24 jam. Cache token dan minta baru saat menerima `401`.
- `letterType` **wajib** dan menentukan deret nomor; pastikan memakai nilai yang
  benar dari §4.3.
- `unitKode` harus cocok dengan kode unit/prodi yang terdaftar & aktif di ITI —
  bila ragu, tanyakan kode yang tepat ke admin Sisurat.
- Setiap nomor yang diterbitkan tercatat pada sistem Sisurat (klien, jenis, unit,
  nomor, waktu) untuk penelusuran.

---

## 7. Ringkasan Kode Galat

| HTTP | Makna                                                            |
| ---- | ---------------------------------------------------------------- |
| 400  | Input tidak valid (field kurang / jenis / unit / tanggal salah). |
| 401  | Token/kredensial tidak valid atau kedaluwarsa.                   |
| 403  | Klien tidak berizin menerbitkan nomor.                           |
| 500  | Gangguan pada server Sisurat — hubungi admin.                    |
