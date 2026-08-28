'use client'

import React from 'react'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select'
import { ChevronDownIcon, ChevronUpIcon, PlusIcon, Trash2Icon } from 'lucide-react'

/**
 * Editor butir diktum SK (Menimbang, Mengingat, Memperhatikan, Menetapkan).
 *
 * Tiap butir adalah satu baris yang dapat ditambah, dihapus, dan diurutkan.
 * Gaya penomorannya dipilih pengguna; penanda yang dipilih ikut dikirim sebagai
 * awalan teks butir, sebab Sisurat merender isi `fieldValues` apa adanya.
 */

export type GayaNomor = 'tanpa' | 'angka' | 'huruf-kecil' | 'huruf-besar' | 'romawi'

export const GAYA_NOMOR: { nilai: GayaNomor; label: string; contoh: string }[] = [
    { nilai: 'tanpa', label: 'Ikuti format Sisurat', contoh: 'tanpa awalan' },
    { nilai: 'angka', label: 'Angka', contoh: '1. 2. 3.' },
    { nilai: 'huruf-kecil', label: 'Huruf kecil', contoh: 'a. b. c.' },
    { nilai: 'huruf-besar', label: 'Huruf besar', contoh: 'A. B. C.' },
    { nilai: 'romawi', label: 'Romawi', contoh: 'i. ii. iii.' },
]

const ROMAWI = [
    'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x',
    'xi', 'xii', 'xiii', 'xiv', 'xv', 'xvi', 'xvii', 'xviii', 'xix', 'xx',
]

/** Penanda butir ke-`i` (0-based) menurut gaya yang dipilih. */
export function penandaButir(gaya: GayaNomor, i: number): string {
    switch (gaya) {
        case 'angka':
            return `${i + 1}.`
        case 'huruf-kecil':
            return `${String.fromCharCode(97 + (i % 26))}.`
        case 'huruf-besar':
            return `${String.fromCharCode(65 + (i % 26))}.`
        case 'romawi':
            return `${ROMAWI[i] ?? String(i + 1)}.`
        default:
            return ''
    }
}

/** Butir siap kirim: kosong dibuang, penanda ditambahkan bila dipilih. */
export function butirTerkirim(butir: string[], gaya: GayaNomor): string[] {
    return butir
        .map((x) => x.trim())
        .filter((x) => x.length > 0)
        .map((x, i) => {
            const penanda = penandaButir(gaya, i)
            return penanda ? `${penanda} ${x}` : x
        })
}

export default function EditorButirSk({
    judul,
    bantuan,
    butir,
    gaya,
    nonaktif,
    onUbah,
    onUbahGaya,
}: {
    judul: string
    bantuan: string
    butir: string[]
    gaya: GayaNomor
    nonaktif?: boolean
    onUbah: (butir: string[]) => void
    onUbahGaya: (gaya: GayaNomor) => void
}) {
    const ubahSatu = (i: number, nilai: string) =>
        onUbah(butir.map((x, n) => (n === i ? nilai : x)))

    const tambah = () => onUbah([...butir, ''])

    const hapus = (i: number) =>
        onUbah(butir.length === 1 ? [''] : butir.filter((_, n) => n !== i))

    const geser = (i: number, arah: -1 | 1) => {
        const tujuan = i + arah
        if (tujuan < 0 || tujuan >= butir.length) return
        const salinan = [...butir]
        const [diangkat] = salinan.splice(i, 1)
        salinan.splice(tujuan, 0, diangkat)
        onUbah(salinan)
    }

    return (
        <div className="p-3 border rounded-lg">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <Label className="text-sm font-semibold">{judul}</Label>
                <Select
                    value={gaya}
                    onValueChange={(v) => onUbahGaya(v as GayaNomor)}
                    disabled={nonaktif}
                >
                    <SelectTrigger className="h-8 w-44">
                        <SelectValue placeholder="Penomoran" />
                    </SelectTrigger>
                    <SelectContent>
                        {GAYA_NOMOR.map((g) => (
                            <SelectItem key={g.nilai} value={g.nilai}>
                                {g.label} — {g.contoh}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <p className="mt-1 mb-2 text-xs text-muted-foreground">{bantuan}</p>

            <div className="grid gap-2">
                {butir.map((isi, i) => (
                    <div key={i} className="flex items-start gap-2">
                        <span className="w-8 pt-2 font-mono text-xs shrink-0 text-muted-foreground">
                            {penandaButir(gaya, i) || `${i + 1})`}
                        </span>
                        {/* Butir diktum kerap panjang, jadi dipakai area teks
                            dua baris agar isinya terbaca utuh. */}
                        <Textarea
                            value={isi}
                            rows={2}
                            disabled={nonaktif}
                            placeholder={`Butir ${i + 1}`}
                            onChange={(e) => ubahSatu(i, e.target.value)}
                        />
                        <div className="flex gap-1 shrink-0">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="w-8 h-8"
                                disabled={nonaktif || i === 0}
                                title="Naikkan"
                                onClick={() => geser(i, -1)}
                            >
                                <ChevronUpIcon className="w-4 h-4" />
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="w-8 h-8"
                                disabled={nonaktif || i === butir.length - 1}
                                title="Turunkan"
                                onClick={() => geser(i, 1)}
                            >
                                <ChevronDownIcon className="w-4 h-4" />
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="w-8 h-8 text-destructive"
                                disabled={nonaktif}
                                title="Hapus butir"
                                onClick={() => hapus(i)}
                            >
                                <Trash2Icon className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                disabled={nonaktif}
                onClick={() => tambah()}
            >
                <PlusIcon className="w-4 h-4" /> Tambah butir
            </Button>
        </div>
    )
}
