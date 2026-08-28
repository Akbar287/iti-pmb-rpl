import fs from 'fs/promises'
import { createReadStream } from 'fs'
import path from 'path'

/**
 * Akar penyimpanan berkas. Semua berkas milik pengguna disimpan di sini,
 * bukan lagi sebagai bytes di basis data.
 *
 * Struktur: <STORAGE_ROOT>/<userId>/<jenis>/<namaFile>
 * Berkas tanpa pemilik pengguna memakai <STORAGE_ROOT>/<jenis>/<namaFile>.
 */
export const STORAGE_ROOT =
    process.env.STORAGE_ROOT ?? path.join(process.cwd(), 'storage')

export type JenisBerkas = 'dokumen' | 'sk' | 'avatar' | 'tiket' | 'ttd'

/** Membuat path relatif yang tersimpan di kolom basis data. */
export function buatPathBerkas(
    userId: string | null,
    jenis: JenisBerkas | string,
    namaFile: string
): string {
    const bagian = userId ? [userId, jenis, namaFile] : [jenis, namaFile]
    return bagian.join('/')
}

/**
 * Mengubah path relatif menjadi path absolut, sekaligus menolak percobaan
 * keluar dari akar penyimpanan (path traversal).
 */
export function pathAbsolut(pathRelatif: string): string {
    const bersih = path
        .normalize(pathRelatif)
        .replace(/^(\.\.(\/|\\|$))+/, '')
        .replace(/^[/\\]+/, '')
    const absolut = path.resolve(STORAGE_ROOT, bersih)

    if (
        absolut !== path.resolve(STORAGE_ROOT) &&
        !absolut.startsWith(path.resolve(STORAGE_ROOT) + path.sep)
    ) {
        throw new Error('Path berkas di luar folder penyimpanan')
    }

    return absolut
}

/** Menyimpan berkas dan mengembalikan path relatif untuk disimpan di basis data. */
export async function simpanBerkas(
    userId: string | null,
    jenis: JenisBerkas | string,
    namaFile: string,
    data: Buffer | Uint8Array
): Promise<string> {
    const pathRelatif = buatPathBerkas(userId, jenis, namaFile)
    const absolut = pathAbsolut(pathRelatif)

    await fs.mkdir(path.dirname(absolut), { recursive: true })
    await fs.writeFile(absolut, data)

    return pathRelatif
}

/** Menimpa berkas pada path relatif yang sudah ada (mis. SK bertanda tangan). */
export async function simpanBerkasDiPath(
    pathRelatif: string,
    data: Buffer | Uint8Array
): Promise<string> {
    const absolut = pathAbsolut(pathRelatif)
    await fs.mkdir(path.dirname(absolut), { recursive: true })
    await fs.writeFile(absolut, data)
    return pathRelatif
}

/**
 * Membaca berkas dari penyimpanan. Mengembalikan Uint8Array agar langsung bisa
 * dipakai sebagai badan respons Hono.
 */
export async function bacaBerkas(
    pathRelatif: string
): Promise<Uint8Array<ArrayBuffer>> {
    return new Uint8Array(await fs.readFile(pathAbsolut(pathRelatif)))
}

/** Membaca berkas sebagai stream — dipakai untuk mengalirkan berkas besar. */
export function streamBerkas(pathRelatif: string) {
    return createReadStream(pathAbsolut(pathRelatif))
}

/** True bila berkas benar-benar ada di disk. */
export async function berkasAda(pathRelatif: string): Promise<boolean> {
    try {
        await fs.access(pathAbsolut(pathRelatif))
        return true
    } catch {
        return false
    }
}

/** Menghapus berkas; diabaikan bila memang sudah tidak ada. */
export async function hapusBerkas(pathRelatif: string): Promise<void> {
    try {
        await fs.unlink(pathAbsolut(pathRelatif))
    } catch (err) {
        if ((err as NodeJS.ErrnoException).code !== 'ENOENT') throw err
    }
}
