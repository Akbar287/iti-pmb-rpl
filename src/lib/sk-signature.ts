import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

// Ukuran QR pada blok tanda tangan (satuan point PDF).
const QR_SIZE = 72
const MARGIN = 32
const CAPTION_SIZE = 6

export type StampOptions = {
    /** Data URI PNG dari QR Code Generator (`qrcode_base64`). */
    qrcodeBase64: string
    /** Nomor surat resmi dari Sisurat, disematkan ke dokumen. */
    nomorSk: string
    /** Nama pejabat penandatangan. */
    officialName: string
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
            const isi = await halaman.getTextContent()

            // Satu baris visual bisa terpecah jadi beberapa item teks
            // (mis. "(" dan nama pejabat terpisah), jadi item dikelompokkan
            // dulu berdasarkan garis dasar yang sama.
            const perBaris = new Map<
                number,
                { teks: string; kiri: number; kanan: number; y: number }
            >()

            for (const it of isi.items as any[]) {
                if (typeof it.str !== 'string' || !it.str.trim()) continue
                const y = Math.round(it.transform[5])
                const kunci = [...perBaris.keys()].find(
                    (k) => Math.abs(k - y) <= 2
                ) ?? y
                const x = it.transform[4]
                const lebar = it.width ?? 0
                const ada = perBaris.get(kunci)
                perBaris.set(kunci, {
                    y: kunci,
                    teks: ((ada?.teks ?? '') + it.str).replace(/\s+/g, ' '),
                    kiri: Math.min(ada?.kiri ?? x, x),
                    kanan: Math.max(ada?.kanan ?? x + lebar, x + lebar),
                })
            }

            const baris = [...perBaris.values()]
                .map((b) => ({ ...b, teks: b.teks.trim() }))
                .filter((b) => b.teks)

            const tanggal = baris.find((b) => /^pada\s+tanggal/i.test(b.teks))
            if (!tanggal) continue

            // Baris nama pejabat berbentuk "(Nama …)" dan berada di bawahnya.
            const nama = baris
                .filter((b) => b.y < tanggal.y && /^\(.*\)$/.test(b.teks))
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
        // Pencarian teks gagal — bukan alasan menggagalkan penandatanganan.
        return null
    }
}

/**
 * Menempelkan QR tanda tangan pada blok penetapan SK, di antara baris
 * "Pada Tanggal …" dan nama pejabat, lalu membakukan isian dokumen.
 *
 * Hanya menerima PDF — berkas doc/docx harus dikonversi lebih dulu.
 */
export async function stampQrToSkPdf(
    pdfBytes: Uint8Array | Buffer,
    options: StampOptions
): Promise<Uint8Array> {
    const isi = pdfBytes instanceof Buffer ? new Uint8Array(pdfBytes) : pdfBytes

    // pdf-lib mengambil alih buffer yang diberikan, jadi pencarian teks
    // dilakukan atas salinan tersendiri.
    const posisi = await cariBlokTandaTangan(new Uint8Array(isi))

    const pdfDoc = await PDFDocument.load(isi)
    const qrImage = await pdfDoc.embedPng(dataUriToBytes(options.qrcodeBase64))
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

        // Keterangan verifikasi diletakkan di kaki halaman agar tidak menabrak
        // nama pejabat.
        const captions = [
            `Ditandatangani secara elektronik oleh ${options.officialName}`,
            `No. ${options.nomorSk} — ${options.verifyUrl}`,
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
            `Ditandatangani secara elektronik oleh ${options.officialName}`,
            `No. ${options.nomorSk}`,
            options.verifyUrl,
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

    // Isian formulir (bila ada) dibakukan menjadi bagian tetap halaman supaya
    // nilainya tidak dapat diubah lagi setelah SK ditandatangani. pdf-lib tidak
    // mendukung enkripsi/permission PDF, sehingga kunci sesungguhnya ditegakkan
    // di aplikasi: berkas SK yang sudah ditandatangani tidak dapat diganti lagi.
    try {
        pdfDoc.getForm().flatten()
    } catch {
        // Dokumen tanpa AcroForm — tidak ada yang perlu dibakukan.
    }

    pdfDoc.setProducer('Sistem Informasi RPL Terpadu ITI')

    return pdfDoc.save()
}
