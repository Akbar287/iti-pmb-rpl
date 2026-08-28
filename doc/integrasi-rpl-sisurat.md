# Integrasi Sistem RPL ⇄ Sisurat ITI — SK Hasil Asesmen

Dokumen ini untuk **tim pengembang Sistem RPL**. Isinya: pembagian tanggung jawab
antara RPL dan Sisurat, alur (workflow) yang dijalankan Sisurat untuk SK hasil
asesmen, serta cara memanggil API-nya dari awal sampai SK siap dipublikasikan.

Dokumen pendamping:

- `panduan-api-inisialisasi-surat.md` — spesifikasi lengkap endpoint inisialisasi.
- `panduan-api-nomor-surat.md` — API nomor surat (tidak dipakai pada alur ini).
- `panduan-integrasi-nextjs.md` — API QR Code Generator ITI (dipanggil Sisurat,
  bukan oleh RPL).

---

## 1. Prinsip pembagian

> **Sistem RPL menyusun dan mempublikasikan SK. Sisurat yang menyetujui,
> menomori, dan menandatangani.**

Yang **wajib** terjadi di Sisurat dan tidak boleh dikerjakan RPL:

| Tindakan | Alasan |
| --- | --- |
| Persetujuan **Wakil Rektor A** | Kewenangan persetujuan melekat pada Sisurat, beserta jejak auditnya |
| Persetujuan **Rektor** | idem |
| **Nomor surat** resmi | Deret nomor institusi dipegang Sisurat; penomoran ganda tidak dapat diperbaiki |
| **Tanda tangan QR** | QR ITI hanya sah bila terbit dari dokumen bernomor yang tercatat di Sisurat |
| **Arsip** | SK Rektor wajib masuk Sikarsip |

Yang tetap milik Sistem RPL:

- menyusun isi SK (Tahap 9) dan memilih skema Perolehan / Transfer;
- merender **lampiran PDF hasil asesmen**;
- mendorong SK ke Sisurat (Tahap 10);
- **mempublikasikan** SK ke mahasiswa dan mengirim notifikasi (Tahap 12);
- sinkronisasi & penutupan berkas (Tahap 13).

> ⚠️ **Jangan menghidupkan kembali** modul lama RPL `/approval/sk-hasil`,
> `/tanda-tangan`, dan `src/lib/sk-signature.ts`. Ketiganya memindahkan
> persetujuan dan QR keluar dari Sisurat — persis yang dilarang aturan di atas.

---

## 2. Peta tahap RPL ↔ Sisurat

```
Sistem RPL                                  Sisurat ITI
──────────────────────────────────────      ─────────────────────────────────
Tahap 9  Hasil final & penyusunan SK
Tahap 10 Inisialisasi SK  ───────────────▶  1. SUBMIT            (otomatis)
                                            2. Persetujuan Wakil Rektor A
Tahap 11 (menunggu; tarik status berkala)   3. Persetujuan Rektor
                                            4. Penomoran surat
                                            5. Tanda tangan QR
                                            6. Arsip (Sikarsip)
Tahap 12 Publikasi ke mahasiswa  ◀────────  nomor + QR siap diambil
Tahap 13 Sinkronisasi & selesai
```

Tahap 11 **tidak lagi berisi peninjauan unit maupun distribusi**. Yang tersisa di
sisi RPL pada tahap itu hanyalah memantau status.

---

## 3. Workflow Sisurat: `WF-SK-RPL`

Kode alur `WF-SK-RPL` · jenis surat `SURAT_KEPUTUSAN` · konteks `RPL` · 6 tahap.

| # | StepKey | Jenis | Pelaksana | `status` surat saat tahap berjalan |
| --- | --- | --- | --- | --- |
| 1 | `SUBMIT` | SUBMISSION | otomatis (service user API) | `SUBMITTED` |
| 2 | `WAREK_APPROVAL` | APPROVAL | **Wakil Rektor A** | `PENDING_VICE_RECTOR_APPROVALS` |
| 3 | `RECTOR_APPROVAL` | APPROVAL | **Rektor** | `PENDING_RECTOR_APPROVAL` |
| 4 | `ADMINISTRATION` | ADMINISTRATION | Admin Tata Usaha | `PENDING_ADMINISTRATION` |
| 5 | `SIGNING` | SIGNING | Admin Tata Usaha | `PENDING_SIGNATURE` |
| 6 | `ARCHIVE` | ARCHIVE | Admin Tata Usaha | `COMPLETED` |

Perbedaan terhadap alur SK biasa (`WF-SK-REKTORAT`, 8 tahap): **tanpa** peninjauan
unit, **tanpa** penentuan jalur oleh Tata Usaha, dan **tanpa** distribusi. Wakil
Rektor A dipatok — tidak ada pemilihan Warek A/B seperti alur biasa.

### Kenapa penomoran tidak bisa dipindah ke RPL

QR ITI dibuat lewat `POST /api/documents.php` yang **mewajibkan `doc_number`**,
dan tahap `SIGNING` di Sisurat menolak surat tanpa nomor. Bila RPL menomori lebih
dulu, nomor sudah terpakai walaupun SK batal di tengah jalan — dan nomor yang
sudah keluar tidak bisa ditarik kembali.

### Alur ini tidak dapat dipilih manusia

`WF-SK-RPL` ditandai **machine-only**: ia tidak muncul sebagai pilihan alur bagi
pengguna Sisurat. Satu-satunya jalan masuk adalah klien API yang dipatok ke
konteks `RPL`. Ini mencegah SK biasa memakai jalan pintas tanpa peninjauan.

---

## 4. Prasyarat (disiapkan admin Sisurat, sekali saja)

1. **Klien API** dibuat di Sisurat → Anda menerima `clientId` + `clientSecret`
   (secret hanya tampil sekali).
2. Klien diberi scope **`letter.initiate`**.
3. Klien diikat ke **service user + peran** — surat dibuat atas nama akun itu.
4. Klien **dipatok ke konteks alur `RPL`**. Tanpa ini, SK Anda akan masuk alur SK
   biasa yang 8 tahap.

Nilai konteks **tidak dapat dikirim lewat payload** — hanya admin Sisurat yang
menetapkannya. Bila klien dipatok ke `RPL` lalu Anda mengirim template dengan
jenis surat yang tidak punya alur `RPL`, permintaan **ditolak `409`** dan
suratnya tersimpan sebagai draft; ia tidak pernah diam-diam jatuh ke alur lain.

Simpan di environment RPL:

```env
SISURAT_BASE_URL=https://sisurat.iti.ac.id
SISURAT_CLIENT_ID=...
SISURAT_CLIENT_SECRET=...
```

---

## 5. Template SK RPL

Dua template sudah tersedia dan **terbit** di Sisurat. Keduanya `SURAT_KEPUTUSAN`
dan memakai kumpulan placeholder yang **identik**.

| Template | Kode | Dipakai untuk |
| --- | --- | --- |
| SK RPL Skema Perolehan Kredit | `TPL-SK-RPL-PEROLEHAN` | skema perolehan SKS |
| SK RPL Skema Transfer Kredit | `TPL-SK-RPL-TRANSFER` | skema transfer SKS |

Ambil `templateVersionId` yang berlaku lewat `GET /api/external/v1/templates`
— **jangan menyalin UUID ke dalam kode**, karena berganti setiap template
diterbitkan ulang.

Tabel di bawah adalah rangkuman untuk dibaca manusia. **Sumber kebenarannya
adalah `fields`** dari endpoint template (§6.2/§6.3); bila template direvisi,
`fields` ikut berubah sedangkan tabel ini bisa tertinggal.

### Placeholder yang harus Anda isi di `fieldValues`

| Kunci | Tipe | Wajib | Keterangan |
| --- | --- | --- | --- |
| `letter.number` | TEXT | – | **Jangan diisi.** Diisi Sisurat saat penomoran |
| `letter.date` | DATE | ya | Umumnya cukup kirim `tanggalSurat` di payload |
| `student.name` | TEXT | ya | Nama mahasiswa |
| `student.program_studi` | TEXT | ya | Program studi |
| `academic.semester` | TEXT | ya | mis. `Ganjil 2026/2027` |
| `rpl.assessment_date` | DATE | ya | Tanggal penilaian RPL |
| `decree.considering` | **LIST** | ya | Butir "Menimbang" |
| `decree.observing` | **LIST** | ya | Butir "Mengingat" |
| `decree.paying_attention` | **LIST** | ya | Butir "Memperhatikan" (isi `["-"]` bila tidak ada) |
| `decree.stipulating` | **LIST** | ya | Diktum "Menetapkan" |
| `decree.place` | TEXT | ya | mis. `Tangerang Selatan` |
| `signer.name` | TEXT | ya | Nama Rektor |
| `signer.jabatan` | TEXT | ya | mis. `Rektor` |

**Placeholder bertipe LIST dikirim sebagai JSON array yang di-*stringify*** —
`fieldValues` hanya menerima nilai bertipe string:

```js
"decree.considering": JSON.stringify([
  "bahwa berdasarkan hasil asesmen RPL ...",
  "bahwa untuk tertib administrasi akademik ...",
])
```

Mengirimnya sebagai teks biasa tetap diterima, tetapi akan dirender sebagai
**satu butir**.

---

## 6. Langkah pemanggilan API

### 6.1 Ambil token (berlaku 24 jam)

```bash
curl -s -X POST "$SISURAT_BASE_URL/api/external/v1/auth/token" \
  -H 'Content-Type: application/json' \
  -d '{"clientId":"'"$SISURAT_CLIENT_ID"'","clientSecret":"'"$SISURAT_CLIENT_SECRET"'"}'
```

Seluruh endpoint lain memakai header `Authorization: Bearer <token>`.

### 6.2 Daftar template — `GET /templates`

```bash
# seluruh template terbit
curl -s "$SISURAT_BASE_URL/api/external/v1/templates" -H "Authorization: Bearer $TOKEN"

# langsung satu template (hemat, dianjurkan)
curl -s "$SISURAT_BASE_URL/api/external/v1/templates?kode=TPL-SK-RPL-PEROLEHAN" \
  -H "Authorization: Bearer $TOKEN"
```

Penyaring opsional: `?kode=`, `?letterType=`, `?search=`.

Tiap entri berisi `kode`, `nama`, `letterType`, `versionNumber`, `placeholders`,
`fields`, dan `templateVersionId`.

`fields` adalah rincian tiap placeholder — pakai ini, jangan menebak dari nama
kuncinya:

```json
{ "key": "decree.considering", "label": "Menimbang",
  "dataType": "LIST", "required": true, "diisiSisurat": false }
```

- `dataType: "LIST"` (atau `"TABLE"`) → nilainya JSON array yang di-*stringify*.
- `diisiSisurat: true` → **jangan dikirim**; Sisurat yang mengisinya
  (mis. `letter.number`, yang baru terbit saat penomoran).
- `fallback` → teks yang muncul bila nilainya dibiarkan kosong.

**Cocokkan lewat `kode`** (`TPL-SK-RPL-PEROLEHAN` /
`TPL-SK-RPL-TRANSFER`) — kode bersifat stabil, sedangkan nama dapat disunting
admin sewaktu-waktu.

### 6.3 Rincian satu template — `GET /templates/{templateVersionId}`

```bash
curl -s "$SISURAT_BASE_URL/api/external/v1/templates/$TVID" \
  -H "Authorization: Bearer $TOKEN"
```

Mengembalikan `fields` (sama seperti di atas) plus **`document`** — struktur
dokumen apa adanya:

```json
"document": {
  "Page": { "PaperSize": "A4", "Orientation": "PORTRAIT",
            "MarginTopMm": 20, "MarginRightMm": 20,
            "MarginBottomMm": 20, "MarginLeftMm": 20 },
  "Letterhead": { "Enabled": true, "FirstPageOnly": true },
  "Blocks": [ { "BlockId": "...", "Type": "HEADING", ... } ]
}
```

Pakai ini bila Anda ingin **merender sendiri** di sisi RPL. Jenis blok yang
dipakai template SK RPL: `HEADING`, `PARAGRAPH`, `LIST`, `SIGNATURE`, `DIVIDER`,
`SPACER`, `CC_LIST`.

> Blok `LIST` dan `TABLE` dinamis menyimpan kunci placeholder-nya pada properti
> **`SourceKey`**, bukan sebagai token `{{...}}` di dalam teks. Bila Anda
> memindai `{{...}}` sendiri, butir "Menimbang/Mengingat/Menetapkan" akan
> terlewat — inilah alasan `fields` selalu lebih tepercaya.

### 6.4 Pratinjau surat — `POST /templates/{templateVersionId}/preview`

Cara termudah menampilkan pratinjau di aplikasi RPL: **biarkan Sisurat yang
merender.** Hasilnya HTML mandiri (kop, ukuran kertas, margin, dan pemenggalan
halaman sudah benar) yang tinggal ditaruh di `<iframe srcdoc>` atau dicetak ke
PDF. Dengan begitu pratinjau tidak akan pernah menyimpang dari surat yang nanti
benar-benar terbit.

```bash
curl -s -X POST "$SISURAT_BASE_URL/api/external/v1/templates/$TVID/preview" \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{
        "fieldValues": { "student.name": "Budi Santoso", "...": "..." },
        "tanggalSurat": "2026-08-21",
        "nomorSurat": "421/SK/ITI/VIII/2026"
      }'
```

```json
{
  "data": {
    "templateVersionId": "b00d...",
    "kode": "TPL-SK-RPL-PEROLEHAN",
    "nama": "SK RPL Skema Perolehan Kredit",
    "html": "<!doctype html>…",
    "unfilled": ["decree.stipulating"]
  },
  "status": "success",
  "message": "Pratinjau dibuat. 1 placeholder wajib belum terisi."
}
```

- **Tidak membuat surat apa pun** dan tidak menyentuh alur — aman dipanggil
  berulang kali sementara pengguna menyunting isian.
- `unfilled` = placeholder **wajib** yang masih kosong. Isian belum lengkap
  bukan galat; pratinjau justru berguna pada saat itu.
- `nomorSurat` di sini hanya contoh untuk pratinjau. Nomor sungguhan terbit di
  Sisurat pada tahap penomoran.
- Nilai untuk placeholder ber-`diisiSisurat: true` **diabaikan** — dipakai
  `tanggalSurat`/`nomorSurat` di atas, persis seperti pada surat sungguhan
  (termasuk pemformatan tanggalnya menjadi "21 Agustus 2026").

### 6.5 Inisialisasi SK + lampiran (satu panggilan)

`POST /api/external/v1/surat` — `multipart/form-data`:

| Field | Wajib | Isi |
| --- | --- | --- |
| `payload` | ya | String JSON (lihat di bawah) |
| `attachment` | tidak | Berkas **PDF**, boleh diulang untuk beberapa lampiran. Maks 15 MB/berkas |

```json
{
  "templateVersionId": "<dari langkah 6.2>",
  "perihal": "SK RPL Skema Perolehan Kredit a.n. Budi Santoso",
  "tanggalSurat": "2026-08-21",
  "externalReference": "RPL-1234-PEROLEHAN",
  "fieldValues": {
    "letter.date": "2026-08-21",
    "student.name": "Budi Santoso",
    "student.program_studi": "Teknik Informatika",
    "academic.semester": "Ganjil 2026/2027",
    "rpl.assessment_date": "2026-08-14",
    "decree.considering": "[\"bahwa berdasarkan hasil asesmen RPL ...\"]",
    "decree.observing": "[\"Undang-Undang Nomor 12 Tahun 2012 ...\"]",
    "decree.paying_attention": "[\"-\"]",
    "decree.stipulating": "[\"Mengakui perolehan kredit sebanyak 24 SKS ...\"]",
    "decree.place": "Tangerang Selatan",
    "signer.name": "Prof. Dr. Ir. Syopiansyah Jaya Putra, M.Sis.",
    "signer.jabatan": "Rektor"
  }
}
```

```bash
curl -s -X POST "$SISURAT_BASE_URL/api/external/v1/surat" \
  -H "Authorization: Bearer $TOKEN" \
  -F "payload=$(cat payload.json)" \
  -F "attachment=@hasil-asesmen.pdf;type=application/pdf"
```

Respons `201` memuat `letterId` — **simpan ke `SkRektor.SisuratLetterId`**.

`externalReference` sebaiknya diisi `RPL-<PendaftaranId>-<JenisSk>` agar mudah
ditelusuri dari dua sisi.

> **Idempotensi ada di pihak Anda.** Sisurat tidak menolak inisialisasi kedua
> dengan `externalReference` yang sama. Tolak inisialisasi ulang selama
> `SisuratLetterId` masih terisi, seperti yang sudah dilakukan sekarang.

### 6.6 Pantau status

```bash
curl -s "$SISURAT_BASE_URL/api/external/v1/surat/$LETTER_ID" \
  -H "Authorization: Bearer $TOKEN"
```

Tambahkan `?qr=1` **hanya ketika Anda siap mengambil gambar QR** — gambarnya
puluhan KB dan tidak perlu diulang pada setiap pemantauan.

```json
{
  "data": {
    "letterId": "9f8e...",
    "status": "COMPLETED",
    "nomorSurat": "421/SK/ITI/VIII/2026",
    "nomorSuratTerbitPada": "2026-08-21T03:15:00.000Z",
    "workflowStatus": "COMPLETED",
    "currentStepKey": "ARCHIVE",
    "externalReference": "RPL-1234-PEROLEHAN",
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

---

## 7. Membaca status: apa yang harus dilakukan RPL

| `currentStepKey` / `status` | Artinya | Tindakan RPL |
| --- | --- | --- |
| `WAREK_APPROVAL` / `PENDING_VICE_RECTOR_APPROVALS` | menunggu Wakil Rektor A | tunggu |
| `RECTOR_APPROVAL` / `PENDING_RECTOR_APPROVAL` | menunggu Rektor | tunggu |
| `ADMINISTRATION` / `PENDING_ADMINISTRATION` | menunggu penomoran TU | tunggu |
| `SIGNING` / `PENDING_SIGNATURE` | sudah bernomor, menunggu QR | simpan `nomorSurat`; **belum boleh publikasi** |
| `ARCHIVE` atau `COMPLETED` + `signature` terisi | selesai & tertandatangani | ambil `?qr=1`, tempel QR, **publikasikan** |
| `status` = `REVISION_REQUESTED` | diminta perbaikan | baca `lastDecision.note`, perbaiki di RPL |
| `status` = `REJECTED` | ditolak | baca `lastDecision.note`; bila SK harus diulang, kosongkan `SisuratLetterId` agar dapat diinisialisasi ulang |

**Aturan publikasi:** jangan memakai `nomorSurat` sebagai tanda selesai. Nomor
terbit **sebelum** tanda tangan. Syarat publikasi adalah **`signature` sudah
terisi** (`signature !== null`).

### Penolakan dan revisi

`lastDecision` memuat keputusan penolakan/permintaan revisi terakhir:

```json
"lastDecision": {
  "stepKey": "WAREK_APPROVAL",
  "decision": "REVISION_REQUESTED",
  "note": "Diktum menetapkan belum mencantumkan jumlah SKS.",
  "byRoleName": "WAKIL_REKTOR_A",
  "decidedAt": "2026-08-21T02:40:00.000Z"
}
```

Tampilkan `note` apa adanya kepada Akademik — itulah alasan dari penyetuju.

---

## 8. Batasan yang perlu diketahui

- **Tidak ada webhook.** Status ditarik oleh RPL (tombol "Perbarui Status" atau
  penjadwal). Panggilan tanpa `?qr=1` ringan, aman dipanggil berkala.
- **Lampiran hanya PDF**, maksimal 15 MB per berkas.
- `GET /surat/{letterId}` hanya melayani surat yang **klien ini** inisialisasi;
  surat milik klien lain menghasilkan `404`.
- Token berumur 24 jam — perbarui bila menerima `401`.
- Sisurat merender badan SK dari templatenya sendiri. Berkas PDF yang Anda kirim
  diperlakukan sebagai **lampiran**, bukan badan surat.
- QR yang dikembalikan adalah **QR verifikasi pejabat**, bukan berkas SK jadi.
  Penempelan QR ke dokumen final untuk mahasiswa dikerjakan RPL.

---

## 9. Daftar periksa integrasi

- [ ] `clientId` / `clientSecret` diterima dan disimpan sebagai environment.
- [ ] Klien punya scope `letter.initiate`, terikat service user, dan dipatok ke
      konteks alur `RPL` — konfirmasikan ke admin Sisurat.
- [ ] `templateVersionId` diambil dari `GET /templates` saat runtime, tidak
      di-hardcode.
- [ ] Formulir isian dibangun dari `fields`, bukan dari daftar kunci yang
      ditulis manual.
- [ ] Pratinjau memakai `POST /templates/{id}/preview`, bukan perender sendiri.
- [ ] Seluruh placeholder wajib terisi; yang bertipe LIST di-`JSON.stringify`.
- [ ] `letter.number` **tidak** dikirim.
- [ ] `externalReference` = `RPL-<PendaftaranId>-<JenisSk>`.
- [ ] Inisialisasi ulang ditolak selama `SisuratLetterId` terisi.
- [ ] Publikasi ke mahasiswa hanya bila `signature` sudah terisi.
- [ ] `lastDecision.note` ditampilkan saat SK ditolak / diminta revisi.
- [ ] Modul lama `/approval/sk-hasil`, `/tanda-tangan`, `sk-signature.ts` tetap
      nonaktif.
