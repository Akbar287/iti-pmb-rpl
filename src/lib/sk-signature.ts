import { stempelQrSisurat } from './sk-stempel-qr'

/**
 * @deprecated Modul alur tanda tangan lama.
 *
 * Penandatanganan SK hasil asesmen kini dikerjakan Sisurat; RPL hanya
 * menempelkan QR yang dikembalikan Sisurat lewat `sk-stempel-qr.ts`. Berkas ini
 * dipertahankan hanya agar modul lama yang sudah dinonaktifkan tetap ter-*compile*.
 */
export type StampOptions = {
    qrcodeBase64: string
    nomorSk: string
    officialName: string
    verifyUrl: string
}

/** @deprecated Pakai `stempelQrSisurat` dengan QR dari Sisurat. */
export async function stampQrToSkPdf(
    pdfBytes: Uint8Array | Buffer,
    options: StampOptions
): Promise<Uint8Array> {
    return stempelQrSisurat(pdfBytes, {
        qrBase64: options.qrcodeBase64,
        nomorSurat: options.nomorSk,
        namaPejabat: options.officialName,
        verifyUrl: options.verifyUrl,
    })
}
