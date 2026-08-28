/**
 * doc/uji-integrasi-sisurat.ts
 *
 * Uji sambungan RPL -> Sisurat memakai klien sungguhan (`src/lib/sisurat-api`),
 * bukan curl. Tujuannya memastikan kode yang benar-benar dipakai aplikasi ini
 * cocok dengan API Sisurat — termasuk nama kunci placeholder dan bentuk balasan.
 *
 * TIDAK MEMBUAT SURAT. Hanya memanggil endpoint baca dan pratinjau, sehingga
 * aman dijalankan berulang kali. Inisialisasi surat sengaja tidak diikutkan
 * karena membuat surat sungguhan yang masuk alur dan tidak dapat ditarik.
 *
 *   npx tsx doc/uji-integrasi-sisurat.ts
 *
 * Kredensial dan alamat diambil dari .env; timpa lewat environment bila perlu.
 * SISURAT_API_BASE_URL berisi HOST SAJA — klien menambahkan /api/external/v1
 * sendiri; mengisinya dengan path lengkap menghasilkan 404 berganda.
 *   SISURAT_API_BASE_URL=http://localhost:3001 \
 *   SISURAT_CLIENT_ID=... SISURAT_CLIENT_SECRET=... \
 *   npx tsx doc/uji-integrasi-sisurat.ts
 */
import 'dotenv/config'

import {
    cariTemplateRpl,
    KODE_TEMPLATE_RPL,
    sisuratApi,
    type FieldTemplate,
} from '../src/lib/sisurat-api'

/** Kunci yang WAJIB ada; bila namanya berubah, diktum SK terbit kosong. */
const KUNCI_DIKTUM = [
    'decree.considering',
    'decree.observing',
    'decree.paying_attention',
    'decree.stipulating',
]

let gagal = 0
const cek = (lulus: boolean, pesan: string) => {
    if (!lulus) gagal += 1
    console.info(`  ${lulus ? 'OK  ' : 'GAGAL'}  ${pesan}`)
}

async function main() {
    console.info(`Sisurat: ${process.env.SISURAT_API_BASE_URL}\n`)

    console.info('1. Identitas klien (GET /me)')
    const me = await sisuratApi.me()
    console.info(`   klien  : ${me.nama ?? me.clientId}`)
    console.info(`   scopes : ${(me.scopes ?? []).join(', ')}`)
    cek(
        (me.scopes ?? []).includes('letter.initiate'),
        'scope letter.initiate dimiliki'
    )

    console.info('\n2. Daftar template (GET /templates?kode=)')
    for (const kode of Object.values(KODE_TEMPLATE_RPL)) {
        const hasil = await sisuratApi.templates({ kode })
        const t = hasil[0]
        cek(Boolean(t), `template ${kode} ditemukan`)
        if (!t) continue
        cek(
            t.letterType === 'SURAT_KEPUTUSAN',
            `${kode} berjenis SURAT_KEPUTUSAN`
        )
        cek(
            Array.isArray(t.fields) && t.fields.length > 0,
            `${kode} menyertakan fields (${t.fields?.length ?? 0})`
        )
    }

    console.info('\n3. Rincian template (GET /templates/{id})')
    // Memakai pencari milik aplikasi (bukan indeks larik) supaya jalur yang
    // diuji sama dengan yang dipakai layar SK Rektor.
    const daftar = await sisuratApi.templates({
        kode: KODE_TEMPLATE_RPL.PEROLEHAN_SKS,
    })
    const terpilih = cariTemplateRpl(daftar, 'PEROLEHAN_SKS')
    cek(
        terpilih?.kode === KODE_TEMPLATE_RPL.PEROLEHAN_SKS,
        `cariTemplateRpl memilih ${terpilih?.kode ?? '(tidak ada)'}`
    )
    const tvId = terpilih?.templateVersionId
    if (!tvId) throw new Error('templateVersionId tidak diperoleh')

    const detail = await sisuratApi.templateDetail(tvId)
    cek(Boolean(detail), 'endpoint rincian tersedia (bukan 404)')

    const fields: FieldTemplate[] = detail?.fields ?? []
    const kunci = new Set(fields.map((f) => f.key))
    for (const k of KUNCI_DIKTUM) {
        const f = fields.find((x) => x.key === k)
        cek(Boolean(f), `kunci ${k} ada`)
        if (f) cek(f.dataType === 'LIST', `${k} bertipe LIST`)
    }
    cek(
        kunci.has('letter.number') &&
            Boolean(fields.find((f) => f.key === 'letter.number')?.diisiSisurat),
        'letter.number ditandai diisiSisurat'
    )
    cek(Boolean(detail?.document), 'struktur dokumen ikut dikirim')

    console.info('\n4. Pratinjau (POST /templates/{id}/preview)')
    const isiUji: Record<string, string> = {
        'student.name': 'Uji Integrasi',
        'student.program_studi': 'Teknik Informatika',
        'academic.semester': 'Ganjil 2026/2027',
        'rpl.assessment_date': '2026-08-14',
        'decree.considering': JSON.stringify(['Butir menimbang pertama']),
        'decree.observing': JSON.stringify(['Undang Undang No. 12 Tahun 2012']),
        'decree.paying_attention': JSON.stringify(['-']),
        'decree.stipulating': JSON.stringify(['Mengakui 24 SKS']),
        'decree.place': 'Tangerang Selatan',
        'signer.name': 'Prof. Dr. Ir. Syopiansyah Jaya Putra, M.Sis.',
        'signer.jabatan': 'Rektor',
    }
    const pratinjau = await sisuratApi.pratinjauSurat(tvId, {
        fieldValues: isiUji,
        tanggalSurat: '2026-08-21',
        nomorSurat: '421/SK/ITI/VIII/2026',
    })
    cek(Boolean(pratinjau), 'endpoint pratinjau tersedia (bukan 404)')
    if (pratinjau) {
        cek(
            (pratinjau.unfilled ?? []).length === 0,
            `tidak ada placeholder wajib kosong (unfilled=${JSON.stringify(pratinjau.unfilled ?? [])})`
        )
        const html = pratinjau.html ?? ''
        cek(html.includes('Uji Integrasi'), 'nama mahasiswa terender')
        cek(html.includes('Mengakui 24 SKS'), 'diktum Menetapkan terender')
        cek(
            html.includes('421/SK/ITI/VIII/2026'),
            'nomor surat contoh terender'
        )
        cek(html.includes('21 Agustus 2026'), 'tanggal terformat Indonesia')
    }

    console.info(
        gagal === 0
            ? '\nSELESAI — seluruh pemeriksaan lulus.'
            : `\nSELESAI — ${gagal} pemeriksaan GAGAL.`
    )
    process.exitCode = gagal === 0 ? 0 : 1
}

main().catch((e) => {
    console.error('\nGALAT:', (e as Error).message)
    process.exitCode = 1
})
