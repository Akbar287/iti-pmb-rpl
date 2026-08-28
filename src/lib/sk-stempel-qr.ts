import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

/**
 * Penempel QR tanda tangan pada dokumen SK.
 *
 * QR-nya **tidak diterbitkan di sini** — gambarnya berasal dari Sisurat
 * (`GET /surat/{letterId}?qr=1`, field `signature.qrBase64`) setelah tahap
 * SIGNING di sana selesai. Modul ini hanya menempelkan gambar itu ke berkas
 * PDF yang dipublikasikan RPL ke mahasiswa, sesuai doc/integrasi-rpl-sisurat.md
 * §8: "Penempelan QR ke dokumen final untuk mahasiswa dikerjakan RPL."
 */

// Ukuran QR pada blok tanda tangan (satuan point PDF).
const QR_SIZE = 72
const MARGIN = 32
const CAPTION_SIZE = 6

export type OpsiStempel = {
    /** Data URI PNG dari Sisurat (`signature.qrBase64`). */
    qrBase64: string
    /** Nomor surat resmi yang diterbitkan Sisurat. */
    nomorSurat: string
    /** Nama pejabat penandatangan menurut Sisurat. */
    namaPejabat: string
    /** URL verifikasi publik, dicetak di bawah QR. */
    verifyUrl: string
}

/** Posisi blok penetapan pada dokumen SK. */
type PosisiTandaTangan = {
    /** Indeks halaman (0-based) yang memuat blok tanda tangan. */
    halaman: number
    /** Titik tengah horizontal blok, dalam koordinat PDF. */
    tengahX: number
    /** Garis dasar baris "Pada Tanggal …". */
    yTanggal: number
    /** Garis dasar baris nama pejabat, bila ditemukan. */
    yNama: number | null
}

function dataUriToBytes(dataUri: string): Uint8Array {
    const base64 = dataUri.includes(',') ? dataUri.split(',')[1] : dataUri
    return new Uint8Array(Buffer.from(base64, 'base64'))
}

/**
 * Mencari blok penetapan ("Ditetapkan di … / Pada Tanggal …") beserta baris
 * nama pejabat di bawahnya, supaya QR dapat ditempel tepat pada ruang tanda
 * tangan — bukan di pojok halaman.
 *
 * Mengembalikan null bila teksnya tidak ditemukan (mis. template berubah),
 * sehingga pemanggil dapat memakai posisi cadangan.
 */
async function cariBlokTandaTangan(
    pdfBytes: Uint8Array
): Promise<PosisiTandaTangan | null> {
    try {
        const pdfjs: any = await import('pdfjs-dist/legacy/build/pdf')
        // Dijalankan di sisi server: tanpa worker terpisah.
        pdfjs.GlobalWorkerOptions.workerSrc = ''

        const dokumen = await pdfjs.getDocument({
            data: pdfBytes,
            useWorkerFetch: false,
            isEvalSupported: false,
            useSystemFonts: true,
        }).promise

        // Ditelusuri dari halaman terakhir karena blok penetapan ada di akhir.
        for (let n = dokumen.numPages; n >= 1; n--) {
            const halaman = await dokumen.getPage(n)
            const konten = await halaman.getTextContent()

            // pdf.js memecah satu baris menjadi beberapa potongan teks, jadi
            // potongan dikelompokkan per garis dasar sebelum dicocokkan.
            type Baris = { y: number; kiri: number; kanan: number; teks: string }
            const baris: Baris[] = []

            for (const item of konten.items as any[]) {
                const teks = (item.str ?? '').trim()
                if (!teks) continue
                const x = item.transform[4] as number
                const y = item.transform[5] as number
                const lebar = (item.width as number) ?? 0

                const sama = baris.find((b) => Math.abs(b.y - y) <= 2)
                if (sama) {
                    sama.teks += ' ' + teks
                    sama.kiri = Math.min(sama.kiri, x)
                    sama.kanan = Math.max(sama.kanan, x + lebar)
                } else {
                    baris.push({ y, kiri: x, kanan: x + lebar, teks })
                }
            }

            const tanggal = baris.find((b) => /pada\s+tanggal/i.test(b.teks))
            if (!tanggal) continue

            // Nama pejabat: baris di bawah tanggal yang dibungkus tanda kurung.
            const nama = baris
                .filter((b) => b.y < tanggal.y && /^\(.*\)$/.test(b.teks.trim()))
                .sort((a, b) => b.y - a.y)[0]

            await dokumen.destroy?.()

            const acuan = nama ?? tanggal

            return {
                halaman: n - 1,
                tengahX: (acuan.kiri + acuan.kanan) / 2,
                yTanggal: tanggal.y,
                yNama: nama ? nama.y : null,
            }
        }

        await dokumen.destroy?.()
        return null
    } catch {
        // Pencarian teks gagal — bukan alasan menggagalkan publikasi.
        return null
    }
}

/**
 * Menempelkan QR dari Sisurat pada blok penetapan SK, di antara baris
 * "Pada Tanggal …" dan nama pejabat, lalu membakukan isian dokumen.
 *
 * Hanya menerima PDF.
 */
export async function stempelQrSisurat(
    pdfBytes: Uint8Array | Buffer,
    opsi: OpsiStempel
): Promise<Uint8Array> {
    const isi = pdfBytes instanceof Buffer ? new Uint8Array(pdfBytes) : pdfBytes

    // pdf-lib mengambil alih buffer yang diberikan, jadi pencarian teks
    // dilakukan atas salinan tersendiri.
    const posisi = await cariBlokTandaTangan(new Uint8Array(isi))

    const pdfDoc = await PDFDocument.load(isi)
    const qrImage = await pdfDoc.embedPng(dataUriToBytes(opsi.qrBase64))
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

    const pages = pdfDoc.getPages()
    const page = pages[posisi ? posisi.halaman : pages.length - 1]
    const { width } = page.getSize()

    if (posisi) {
        // Ruang tanda tangan ada di antara tanggal penetapan dan nama pejabat;
        // QR dipusatkan pada blok tersebut.
        const batasAtas = posisi.yTanggal - 6
        const batasBawah = (posisi.yNama ?? posisi.yTanggal - 70) + 6
        const ruang = batasAtas - batasBawah
        const ukuran = ruang > 20 ? Math.min(QR_SIZE, ruang) : QR_SIZE

        page.drawImage(qrImage, {
            x: Math.max(posisi.tengahX - ukuran / 2, MARGIN),
            y: ruang > 20 ? batasBawah + (ruang - ukuran) / 2 : batasBawah,
            width: ukuran,
            height: ukuran,
        })

        const captions = [
            `Ditandatangani secara elektronik oleh ${opsi.namaPejabat} melalui Sisurat ITI`,
            `No. ${opsi.nomorSurat} — ${opsi.verifyUrl}`,
        ]
        captions.forEach((teks, i) => {
            page.drawText(teks, {
                x: MARGIN,
                y: MARGIN + CAPTION_SIZE * (captions.length - 1 - i) * 1.8,
                size: CAPTION_SIZE,
                font,
                color: rgb(0.35, 0.35, 0.35),
            })
        })
    } else {
        // Cadangan: blok penetapan tidak ditemukan, pakai pojok kanan bawah.
        const x = width - QR_SIZE - MARGIN
        const y = MARGIN + CAPTION_SIZE * 3

        page.drawImage(qrImage, { x, y, width: QR_SIZE, height: QR_SIZE })

        const captions = [
            `Ditandatangani secara elektronik oleh ${opsi.namaPejabat}`,
            `No. ${opsi.nomorSurat}`,
            opsi.verifyUrl,
        ]
        captions.forEach((teks, i) => {
            page.drawText(teks, {
                x,
                y: y - CAPTION_SIZE * (i + 1) - 2 * i,
                size: CAPTION_SIZE,
                font,
                color: rgb(0.35, 0.35, 0.35),
                maxWidth: QR_SIZE + MARGIN,
            })
        })
    }

    // Isian formulir dibakukan agar nilainya tidak dapat diubah setelah SK
    // bertanda tangan dipublikasikan.
    try {
        pdfDoc.getForm().flatten()
    } catch {
        // Dokumen tanpa AcroForm — tidak ada yang perlu dibakukan.
    }

    pdfDoc.setProducer('Sistem Informasi RPL Terpadu ITI')

    return pdfDoc.save()
}
