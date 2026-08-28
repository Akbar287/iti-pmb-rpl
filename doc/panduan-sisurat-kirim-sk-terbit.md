# SK Final Sisurat → Sistem RPL

Dokumen ini menjelaskan bagaimana Sistem RPL **mengambil berkas SK yang sudah
ditandatangani** dari Sisurat ITI, lalu menyimpannya sebagai dokumen resmi yang
diunduh mahasiswa.

**Yang memanggil adalah RPL.** Sisurat tidak perlu mendorong apa pun; ia cukup
menyediakan berkasnya lewat API yang sudah ada. Dokumen ini ditujukan untuk dua
pembaca: pengembang RPL (bagaimana pengambilannya bekerja) dan pengembang
Sisurat (kontrak API yang diandalkan RPL).

Dokumen pendamping:

- `integrasi-rpl-sisurat.md` — arah sebaliknya: RPL menginisialisasi surat.
- `alur-rpl.md` — alur RPL secara keseluruhan.

---

## 1. Kapan berkas diambil

RPL tidak menerima notifikasi dari Sisurat, jadi statusnya ditarik berkala lewat
tombol **Perbarui Status** pada kartu SK (`POST …/sk-rektor?jenis=perbarui-status`).
Pada setiap penarikan, RPL memanggil:

```
GET /api/external/v1/surat/{letterId}
```

Begitu balasannya memuat **`dokumenFinal`** dan RPL belum menyimpan berkas
finalnya, berkas itu langsung diunduh sekali. Setelah tersimpan, penarikan
berikutnya tidak mengunduh ulang.

---

## 2. Kontrak yang diandalkan RPL

### 2.1 Penanda tersedianya berkas — `GET /surat/{letterId}`

Balasan memuat blok berikut setelah tahap `SIGNING` selesai:

```json
{
  "status": "ARCHIVED",
  "currentStepKey": "ARCHIVE",
  "nomorSurat": "001/SK/TU-ITI/VIII/2026",
  "signature": {
    "officialName": "Prof. Dr. Ir. Syopiansyah Jaya Putra M.Sis., IPU., ASEAN Eng",
    "officialPosition": "Rektor",
    "verifyUrl": "https://qrcode.iti.ac.id/verify.php?t=428b2fe2…",
    "signedAt": "2026-08-28T06:12:42.444Z"
  },
  "signatures": [ … ],
  "dokumenFinal": {
    "attachmentId": "ab646383-f98b-4e54-88ef-4d2b7f1216a7",
    "namaBerkas": "001-SK-TU-ITI-VIII-2026-final.pdf",
    "ukuran": 603570,
    "checksum": "3353612…"
  },
  "dokumenAsli": {
    "attachmentId": "2b48f690-70b0-4be4-bb2e-df01617701c8",
    "namaBerkas": "SK Transfer SKS.pdf",
    "ukuran": 139614,
    "checksum": "78aa433…"
  }
}
```

| Kunci | Dipakai RPL untuk |
| --- | --- |
| `dokumenFinal` | penanda bahwa berkas final siap diunduh |
| `dokumenFinal.checksum` | **SHA-256** isi berkas; diverifikasi setelah unduhan |
| `dokumenFinal.ukuran` | pemeriksaan kasar ukuran |
| `signature.*` | nama, jabatan, waktu, dan URL verifikasi penandatangan |
| `nomorSurat` | nomor resmi yang disimpan pada SK |
| `dokumenAsli` | lampiran yang dulu dikirim RPL — tidak diunduh kembali |

### 2.2 Berkasnya — `GET /surat/{letterId}/dokumen`

```bash
curl -s "$SISURAT_BASE_URL/api/external/v1/surat/$LETTER_ID/dokumen" \
  -H "Authorization: Bearer $TOKEN" -o sk-final.pdf
```

| Hal | Nilai yang diharapkan |
| --- | --- |
| Kode | `200` bila dokumen final sudah ada; `404` bila belum |
| `Content-Type` | `application/pdf` |
| `Content-Disposition` | `inline; filename="001-SK-TU-ITI-VIII-2026-final.pdf"` |
| Isi | PDF final: berkop, bernomor, ber-QR, lengkap dengan seluruh tanda tangan |
| Otorisasi | Token klien yang sama dengan yang menginisialisasi surat |

RPL memakai nama pada `Content-Disposition` sebagai nama tampilan berkas. Bila
header itu tidak ada, dipakai `<letterId>.pdf`.

> **Yang tidak boleh berubah tanpa pemberitahuan:** jalur `/surat/{id}/dokumen`,
> tipe `application/pdf`, dan arti `dokumenFinal` pada balasan status. Ketiganya
> menjadi sandaran RPL untuk menandai SK terbit.

---

## 3. Yang dilakukan RPL setelah berkas diterima

1. **Checksum diperiksa.** SHA-256 isi unduhan dibandingkan dengan
   `dokumenFinal.checksum`. Bila berbeda, berkas dibuang dan ditandai sebagai
   galat — lebih baik gagal daripada menyimpan PDF yang terpotong.
2. **Disimpan sebagai berkas tersendiri** di `storage/<user_id>/sk-final/`.
   Lampiran hasil asesmen di `storage/<user_id>/sk/` **tidak ditimpa**: yang satu
   bahan yang dikirim ke Sisurat, yang satu surat resmi yang keluar dari sana.
3. **Ditandai terbit**: `Ditandatangani = true`, beserta nomor surat, nama dan
   jabatan penandatangan, waktu tanda tangan, dan URL verifikasi QR.
4. RPL **tidak menempel QR apa pun** — dokumen dari Sisurat dipakai apa adanya.

Setelah itu, di aplikasi RPL:

| Tempat | Perubahan |
| --- | --- |
| Menu **Hasil Asessmen** | berkas hilang dari daftar Akademik |
| Menu **Sk. Rektor** | berkas muncul, bertanda *siap dipublikasikan* |
| Halaman detail Sk. Rektor | pratinjau PDF berganti menjadi **SK final dari Sisurat** |
| Tautan unduhan | mengarah ke SK final, bukan lampiran |
| Tombol *Publikasikan ke Mahasiswa* | terbuka |

Publikasi tetap keputusan Akademik; penerbitan dan publikasi sengaja dipisah.

---

## 4. Penanganan galat di sisi RPL

| Keadaan | Perilaku RPL |
| --- | --- |
| `dokumenFinal` belum ada | tidak mengunduh; menunggu penarikan berikutnya |
| `/dokumen` membalas `404` | dicatat sebagai "dokumen final belum dapat diunduh, coba perbarui lagi" |
| Balasan bukan PDF | ditolak dengan pesan tipe yang diterima |
| Checksum tidak cocok | berkas tidak disimpan, SK tidak ditandai terbit |
| Satu SK gagal | SK lain pada pendaftaran yang sama tetap diperbarui |

Seluruh galat muncul apa adanya di antarmuka Akademik, bukan disembunyikan.

---

## 5. Contoh hasil nyata (lingkungan pengembangan)

```
perbarui-status → 200 "Seluruh SK sudah ditandatangani dan siap dipublikasikan"
   TRANSFER_SKS: status=ARCHIVED nomor=001/SK/TU-ITI/VIII/2026 ttd=true

berkas tersimpan:
   SK final : storage/<user>/sk-final/be57b2c9….pdf → 603.570 byte, %PDF-1.7
   lampiran : 164.975 byte, utuh (tidak ditimpa)
   unduh lewat aplikasi: 200 · 603.570 byte
```

---

## 6. Cadangan: Sisurat mendorong berkas (opsional)

Bila suatu saat Sisurat ingin mengirim berkas tanpa menunggu RPL menariknya,
tersedia endpoint di sisi RPL:

```
POST /api/external/sisurat/sk-terbit
Header : X-Sisurat-Token: <token bersama, dari SISURAT_CALLBACK_TOKEN>
Body   : multipart/form-data
         payload = JSON  { letterId, nomorSurat, signature: { … } }   ← ruas teks
         file    = PDF SK final (maks 20 MB)
```

Efeknya sama persis dengan jalur tarik pada §3. Endpoint ini **tidak wajib** dan
mati secara bawaan: selama `SISURAT_CALLBACK_TOKEN` belum diatur di RPL, ia
membalas `503`. Jalur utamanya tetap pengambilan oleh RPL.
