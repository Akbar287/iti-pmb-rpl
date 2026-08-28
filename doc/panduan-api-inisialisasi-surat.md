# Panduan API Inisialisasi Surat — untuk Aplikasi Klien

Dokumen ini untuk **pengembang aplikasi lain** yang ingin **menginisialisasi
surat** di Sisurat ITI lewat API: mengirim template + semua nilai placeholder
beserta **lampiran PDF**. Setelah diinisialisasi, surat **langsung masuk ke alur
(workflow)** Sisurat dan diproses normal (peninjauan, persetujuan, disposisi,
penomoran, dst.) oleh pihak internal.

> API ini **hanya untuk inisialisasi**. Setelah surat masuk alur, kelanjutannya
> mengikuti workflow Sisurat — tidak dikendalikan lewat API. Aplikasi Anda cukup
> memanggil sekali; sisanya ditangani ITI.

Base URL `https://sisurat.iti.ac.id`, prefix `/api/external/v1`. Amplop respons
seragam: `{ "data": ..., "status": "success"|"error", "message": "..." }`.

---

## 1. Prasyarat (disiapkan admin Sisurat)

1. Admin membuat **Klien API** (menu superadmin **Administrasi Sistem → Klien API**)
   dan memberi scope **`letter.initiate`**.
2. Admin **mengikat klien ke satu "service user" + peran** (mis. akun sistem yang
   memegang peran pembuat surat). Surat dari API dibuat **atas nama peran itu** —
   di mata workflow, sama seperti orang ber-peran itu yang memulai.

Anda menerima `clientId` + `clientSecret` (secret hanya tampil sekali).

---

## 2. Alur Pemakaian

1. Ambil token: `POST /auth/token` `{ clientId, clientSecret }` → Bearer JWT (24 jam).
2. Lihat template & placeholder: `GET /templates`.
3. (opsional) Rincian & pratinjau: `GET /templates/{templateVersionId}` dan
   `POST /templates/{templateVersionId}/preview`.
4. Inisialisasi surat: `POST /surat` (multipart) — kirim `payload` (JSON) + `attachment` (PDF).
5. Pantau status: `GET /surat/{letterId}`.

Semua endpoint (selain `/auth/token`) butuh header `Authorization: Bearer <token>`.

---

## 3. `GET /api/external/v1/templates` — pilih template & tahu field-nya

Mengembalikan template terbit + jenis surat + daftar kunci placeholder yang perlu
Anda isi di `fieldValues`.

```json
{
  "data": [
    {
      "templateVersionId": "b1c2...",
      "kode": "TPL-NOTA-DINAS",
      "nama": "Nota Dinas Umum",
      "letterType": "NOTA_DINAS",
      "versionNumber": 3,
      "placeholders": ["nomor", "perihal", "isi.paragraf1", "signer.name", "signer.jabatan"]
    }
  ],
  "status": "success",
  "message": "Daftar template dimuat"
}
```

Selain `placeholders` (daftar kunci), tiap entri juga memuat **`fields`** —
rincian per placeholder: `key`, `label`, `dataType`, `required`, dan
`diisiSisurat`. Pakai `fields` untuk membangun formulir: `dataType` `LIST`/`TABLE`
menandakan nilainya JSON array yang di-stringify, dan `diisiSisurat: true`
menandakan placeholder yang tidak boleh Anda kirim (diisi Sisurat sendiri).

Cocokkan template lewat **`kode`**, bukan `nama`: kode bersifat stabil sedangkan
nama dapat disunting admin. `templateVersionId` berganti setiap template
diterbitkan ulang, jadi ambil saat runtime — jangan ditanam di kode.

Placeholder bertipe **daftar** (mis. butir "Menimbang" pada SK) dikirim sebagai
JSON array yang di-*stringify*, karena `fieldValues` hanya menerima string:
`"decree.considering": "[\"butir pertama\",\"butir kedua\"]"`.

Penyaring opsional pada `GET /templates`: `?kode=`, `?letterType=`, `?search=`.

---

## 3b. `GET /templates/{templateVersionId}` — rincian & struktur dokumen

Mengembalikan `fields` (seperti §3) plus **`document`**: `Page` (ukuran kertas &
margin), `Letterhead`, dan `Blocks`. Dipakai bila aplikasi Anda ingin merender
sendiri. Hanya versi **terbit** yang dapat diambil; selain itu `404`.

> Blok daftar/tabel dinamis menyimpan kunci placeholder-nya pada properti
> `SourceKey`, bukan sebagai token `{{...}}`. Memindai `{{...}}` sendiri akan
> melewatkannya — pakai `fields`.

---

## 3c. `POST /templates/{templateVersionId}/preview` — pratinjau HTML

Merender surat memakai perender Sisurat sendiri, **tanpa membuat surat apa pun**.
Aman dipanggil berulang kali sementara pengguna menyunting isian.

Body: `{ fieldValues?, tanggalSurat?, nomorSurat? }` → balasan `{ html, unfilled }`.

- `html` — dokumen HTML mandiri (kop, margin, pemenggalan halaman sudah benar);
  taruh di `<iframe srcdoc>` atau cetak ke PDF.
- `unfilled` — placeholder **wajib** yang masih kosong. Bukan galat.
- Nilai untuk placeholder ber-`diisiSisurat: true` diabaikan; dipakai
  `tanggalSurat`/`nomorSurat` agar pratinjau sama dengan surat sungguhan.

---

## 4. `POST /api/external/v1/surat` — inisialisasi surat ⟵ endpoint utama

**`Content-Type: multipart/form-data`.** Field form:

| Field        | Wajib | Keterangan                                                                 |
| ------------ | ----- | ------------------------------------------------------------------------- |
| `payload`    | ya    | String **JSON** (lihat di bawah).                                          |
| `attachment` | tidak | Berkas **PDF** (boleh lebih dari satu; ulangi field `attachment`). Maks 15 MB/berkas. |

Isi `payload` (JSON):

| Kunci               | Wajib | Keterangan                                                             |
| ------------------- | ----- | --------------------------------------------------------------------- |
| `templateVersionId` | ya    | Dari `GET /templates`. Jenis surat diturunkan dari template.          |
| `perihal`           | ya    | Perihal surat (≥ 3 karakter).                                         |
| `fieldValues`       | tidak | Objek `{ "kunci": "nilai" }` untuk semua placeholder (lihat §3).       |
| `tanggalSurat`      | tidak | ISO-8601 (mis. `2026-08-07`).                                         |
| `externalReference` | tidak | Referensi milik Anda (mis. id dokumen di sistem Anda) untuk penelusuran. |

**Proses:** create draft (atas nama service user + peran klien) → lampirkan PDF →
**submit → alur menyala**. Satu panggilan.

**Output** `201`:

```json
{
  "data": {
    "letterId": "9f8e...",
    "status": "SUBMITTED",
    "letterType": "NOTA_DINAS",
    "perihal": "Undangan Rapat Koordinasi",
    "currentStepKey": "UNIT_HEAD_REVIEW",
    "pendingTasks": 1,
    "attachments": 1,
    "externalReference": "DOC-2026-0007",
    "warnings": []
  },
  "status": "success",
  "message": "Surat berhasil diinisialisasi dan masuk ke alur."
}
```

Simpan `letterId` untuk memantau status.

**Galat umum:** `400` (payload/perihal/templateVersionId/fieldValues/PDF tidak
valid), `401` (token), `403` (klien tanpa scope `letter.initiate`), `409`
(klien belum diikat service user+peran, atau alur belum bisa dinyalakan —
surat tersimpan sebagai draft).

---

## 5. `GET /api/external/v1/surat/{letterId}` — status

Hanya untuk surat yang **klien ini** inisialisasi.

Tambahkan `?qr=1` bila Anda siap mengambil gambar QR-nya. Tanpa parameter itu
`signature.qrBase64` tidak dikirim — gambarnya puluhan KB dan tidak perlu
diulang pada setiap pemantauan berkala.

```json
{
  "data": {
    "letterId": "9f8e...",
    "perihal": "SK Hasil Asesmen RPL a.n. Budi",
    "letterType": "SURAT_KEPUTUSAN",
    "status": "COMPLETED",
    "nomorSurat": "421/SK/ITI/VIII/2026",
    "nomorSuratTerbitPada": "2026-08-21T03:15:00.000Z",
    "workflowStatus": "COMPLETED",
    "currentStepKey": "ARCHIVE",
    "externalReference": "RPL-1234-PEROLEHAN",
    "initiatedAt": "2026-08-20T02:10:00.000Z",
    "signature": {
      "officialName": "Prof. Dr. Ir. Syopiansyah Jaya Putra ...",
      "officialPosition": "Rektor",
      "officialUnit": "Rektorat",
      "verifyUrl": "https://qrcode.iti.ac.id/verify.php?t=...",
      "signedAt": "2026-08-21T03:20:00.000Z",
      "qrBase64": "data:image/png;base64,..."
    },
    "lastDecision": null
  },
  "status": "success",
  "message": "Status surat dimuat"
}
```

| Kunci                  | Kapan terisi                                                        |
| ---------------------- | ------------------------------------------------------------------- |
| `nomorSurat`           | setelah tahap penomoran (ADMINISTRATION) selesai                     |
| `nomorSuratTerbitPada` | bersamaan dengan `nomorSurat`                                        |
| `signature`            | setelah tahap SIGNING selesai; `null` selama belum ditandatangani    |
| `signature.qrBase64`   | hanya bila dipanggil dengan `?qr=1`                                  |
| `lastDecision`         | bila ada penolakan / permintaan revisi terakhir (berisi `note`)      |

**Terbitkan dokumen final Anda hanya ketika `signature` sudah terisi.** Nomor
surat saja belum berarti sudah ditandatangani.

Bila `lastDecision.decision` bernilai `REJECTED` atau `REVISION_REQUESTED`,
`note` memuat alasan dari penyetuju — pakai itu untuk memperbaiki dokumen di
sistem Anda.

---

## 5b. Alur yang dipatok per klien (opsional)

Secara baku, surat dari API mengikuti alur sesuai peran service user klien —
sama seperti surat buatan manusia. Untuk integrasi yang hanya membutuhkan
sebagian tahap, admin Sisurat dapat **mematok klien Anda ke satu konteks alur**
(kolom `ApiClient.WorkflowContext`).

Nilai ini **tidak dapat dikirim lewat payload** — hanya admin Sisurat yang
menetapkannya, supaya aplikasi luar tidak bisa memindahkan suratnya ke alur lain.

Contoh yang sudah tersedia — **`RPL`** untuk SK hasil asesmen Sistem RPL
(`SURAT_KEPUTUSAN`, alur `WF-SK-RPL`):

```
SUBMIT (API)  →  Persetujuan Wakil Rektor A  →  Persetujuan Rektor
              →  Penomoran  →  TTD QR  →  Arsip
```

Tanpa peninjauan unit, tanpa penentuan jalur oleh TU, dan tanpa distribusi —
penyusunan serta publikasi SK ke mahasiswa tetap di sistem RPL.

Bila klien dipatok ke sebuah konteks lalu mengirim template dengan **jenis surat
yang tidak punya alur pada konteks itu**, permintaan ditolak `409` dan suratnya
tersimpan sebagai draft — tidak pernah diam-diam jatuh ke alur lain.

---

## 6. Contoh

### cURL

```bash
# token
TOKEN=$(curl -s -X POST https://sisurat.iti.ac.id/api/external/v1/auth/token \
  -H 'Content-Type: application/json' \
  -d '{"clientId":"iti_ab12cd34ef","clientSecret":"RAHASIA"}' | jq -r '.data.token')

# inisialisasi surat + lampiran PDF
curl -s -X POST https://sisurat.iti.ac.id/api/external/v1/surat \
  -H "Authorization: Bearer $TOKEN" \
  -F 'payload={"templateVersionId":"b1c2...","perihal":"Undangan Rapat","fieldValues":{"isi.paragraf1":"Dengan hormat..."},"externalReference":"DOC-7"};type=application/json' \
  -F 'attachment=@/path/surat.pdf;type=application/pdf' | jq
```

### Node.js (FormData)

```ts
const BASE = "https://sisurat.iti.ac.id/api/external/v1";

const fd = new FormData();
fd.set(
  "payload",
  JSON.stringify({
    templateVersionId: "b1c2...",
    perihal: "Undangan Rapat",
    fieldValues: { "isi.paragraf1": "Dengan hormat..." },
    externalReference: "DOC-7",
  }),
);
fd.set("attachment", new Blob([pdfBytes], { type: "application/pdf" }), "surat.pdf");

const res = await fetch(`${BASE}/surat`, {
  method: "POST",
  headers: { Authorization: `Bearer ${token}` }, // JANGAN set Content-Type manual
  body: fd,
});
const json = await res.json();
if (!res.ok) throw new Error(json.message);
console.log(json.data.letterId, json.data.status);
```

---

## 7. Catatan

- Surat dibuat **atas nama peran** yang diikatkan admin ke klien — inilah maksud
  "inisialisasi surat dari API **atau** dari role tertentu": alur menerima
  pemrakarsa dari manusia ber-peran maupun dari API (service user ber-peran).
- Nomor surat **belum** ada saat inisialisasi; nomor diberikan pada tahap
  administrasi internal. Pantau lewat `GET /surat/{letterId}`.
- Simpan `clientSecret` di server aplikasi Anda (bukan di klien publik/browser).
