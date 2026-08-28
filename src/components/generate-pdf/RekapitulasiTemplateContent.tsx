import React from 'react'
import { Image, Page, Text, View } from '@react-pdf/renderer'
import { resolveRekapitulasiPlaceholders } from '@/lib/rekapitulasi-template'
import {
    FormAssessmentPortraitTemplate,
    FormAssessmentTemplateBlock,
} from '@/types/FormAssessmentTemplate'

/**
 * Tanda tangan yang disematkan pada blok pengesahan Form 05. Kunci baris
 * dicocokkan dengan label pada template ("Penilai I", "Penilai II", "Pemohon").
 */
export type TandaTanganRekap = {
    penilai1?: string | null
    penilai2?: string | null
    pemohon?: string | null
}

/**
 * Menentukan tanda tangan untuk satu sel/baris template berdasarkan placeholder
 * mentahnya — bukan labelnya — supaya tetap cocok meski admin menyusun ulang
 * blok pengesahan di Template Builder (tabel maupun key-value).
 *
 * `{nama}` juga dipakai pada blok identitas, jadi tanda tangan pemohon hanya
 * disematkan bila konteksnya (label/header kolom) memang blok pengesahan.
 */
function tandaTanganUntukNilai(
    nilaiMentah: string,
    konteks: string,
    ttd?: TandaTanganRekap
): string | null {
    if (!ttd) return null
    // Form 05 memakai {asesor_n}, Berita Acara memakai {penilai_n}.
    if (nilaiMentah.includes('{asesor_1}') || nilaiMentah.includes('{penilai_1}'))
        return ttd.penilai1 ?? null
    if (nilaiMentah.includes('{asesor_2}') || nilaiMentah.includes('{penilai_2}'))
        return ttd.penilai2 ?? null
    // Hanya kolom/baris yang berjudul persis "Pemohon" — bukan baris identitas
    // seperti "Nama Pemohon RPL" — yang diberi tanda tangan pemohon.
    if (nilaiMentah.includes('{nama}') && /^\s*\(?\s*pemohon\s*\)?\s*$/i.test(konteks)) {
        return ttd.pemohon ?? null
    }
    return null
}

/**
 * Penanda blok pengesahan: placeholder ini hanya muncul pada tabel tanda
 * tangan, tidak pada blok identitas. Dipakai untuk menyamakan perataan judul
 * jabatan, gambar tanda tangan, dan nama penanda tangan.
 */
const PLACEHOLDER_PENGESAHAN =
    /\{(asesor_1|asesor_2|penilai_1|penilai_2|kaprodi|ketua_komite)\}/

/** Gambar tanda tangan pada blok pengesahan Form 05. */
function GambarTandaTangan({ src }: { src: string }) {
    return (
        <Image
            src={src}
            style={{
                width: 110,
                height: 42,
                marginBottom: 2,
                objectFit: 'contain',
                // Tanpa ini tinggi gambar menyusut mengikuti sel tabel yang
                // sempit, sehingga tanda tangan antar kolom tampak tidak sama.
                flexShrink: 0,
            }}
        />
    )
}

export function RekapitulasiTemplateBlocks({
    blocks,
    placeholders,
    logoPath,
    tandaTangan,
}: {
    blocks: FormAssessmentTemplateBlock[]
    placeholders: Record<string, string>
    logoPath: string
    tandaTangan?: TandaTanganRekap
}) {
    const resolve = (value: string) =>
        resolveRekapitulasiPlaceholders(value, placeholders)

    return blocks.map((block, blockIndex) => {
        const key = block.id || `rekap-block-${blockIndex}`

        if (block.type === 'text') {
            return (
                <Text
                    key={key}
                    style={{
                        fontFamily: block.bold
                            ? block.italic
                                ? 'Times-BoldItalic'
                                : 'Times-Bold'
                            : block.italic
                              ? 'Times-Italic'
                              : 'Times-Roman',
                        fontSize: block.fontSize,
                        textAlign: block.align,
                        lineHeight: block.lineHeight,
                        textTransform: block.uppercase ? 'uppercase' : 'none',
                        marginBottom: block.marginBottom,
                    }}
                >
                    {resolve(block.content)}
                </Text>
            )
        }

        if (block.type === 'logo') {
            return (
                <View
                    key={key}
                    style={{
                        alignItems:
                            block.align === 'left'
                                ? 'flex-start'
                                : block.align === 'right'
                                  ? 'flex-end'
                                  : 'center',
                        marginBottom: block.marginBottom,
                    }}
                >
                    <Image
                        src={logoPath}
                        style={{ width: block.width, height: block.height }}
                    />
                </View>
            )
        }

        if (block.type === 'spacer') {
            return (
                <View
                    key={key}
                    style={{
                        height: block.height,
                        marginBottom: block.marginBottom,
                    }}
                />
            )
        }

        if (block.type === 'key_value') {
            return (
                <View key={key} style={{ marginBottom: block.marginBottom }}>
                    {block.rows.map((row, rowIndex) => {
                        // Baris pengesahan (Penilai I/II, Pemohon) memuat gambar
                        // tanda tangan di atas nama bila sudah ditandatangani.
                        const gambar = tandaTanganUntukNilai(
                            row.value,
                            row.label,
                            tandaTangan
                        )
                        return (
                            <View
                                key={`${key}-${rowIndex}`}
                                style={{
                                    flexDirection: 'row',
                                    marginBottom: gambar ? 6 : 3,
                                    alignItems: gambar ? 'flex-end' : 'flex-start',
                                }}
                                wrap={false}
                            >
                                <Text
                                    style={{
                                        width: `${block.labelWidth}%`,
                                        fontFamily: 'Times-Bold',
                                        fontSize: block.fontSize,
                                    }}
                                >
                                    {resolve(row.label)}
                                </Text>
                                <Text
                                    style={{
                                        width: '3%',
                                        fontSize: block.fontSize,
                                    }}
                                >
                                    :
                                </Text>
                                <View
                                    style={{
                                        width: `${97 - block.labelWidth}%`,
                                        alignItems: 'flex-start',
                                    }}
                                >
                                    {gambar ? <GambarTandaTangan src={gambar} /> : null}
                                    <Text style={{ fontSize: block.fontSize }}>
                                        {resolve(row.value)}
                                    </Text>
                                </View>
                            </View>
                        )
                    })}
                </View>
            )
        }

        if (block.type === 'list') {
            return (
                <View key={key} style={{ marginBottom: block.marginBottom }}>
                    {block.items.map((item, itemIndex) => (
                        <View
                            key={`${key}-${itemIndex}`}
                            style={{ flexDirection: 'row', marginBottom: 2 }}
                        >
                            <Text
                                style={{
                                    width: block.ordered ? 18 : 12,
                                    fontSize: block.fontSize,
                                    lineHeight: block.lineHeight,
                                }}
                            >
                                {block.ordered ? `${itemIndex + 1}.` : '•'}
                            </Text>
                            <Text
                                style={{
                                    flex: 1,
                                    fontSize: block.fontSize,
                                    lineHeight: block.lineHeight,
                                    textAlign: 'justify',
                                }}
                            >
                                {resolve(item)}
                            </Text>
                        </View>
                    ))}
                </View>
            )
        }

        if (block.type === 'table') {
            // Pada tabel pengesahan, nama dan tanda tangan mengikuti perataan
            // judul jabatannya supaya ketiganya segaris secara vertikal —
            // termasuk kolom yang tanda tangannya belum ada.
            const blokPengesahan = block.rows.some((row) =>
                row.values.some((v) => PLACEHOLDER_PENGESAHAN.test(v))
            )
            // Bila ada kolom yang sudah bertanda tangan, kolom yang belum diberi
            // ruang setinggi gambar supaya seluruh nama tetap sebaris.
            const adaGambar = block.rows.some((row) =>
                row.values.some(
                    (v, i) =>
                        tandaTanganUntukNilai(
                            v,
                            block.headers[i] ?? '',
                            tandaTangan
                        ) !== null
                )
            )
            const cell = {
                borderRightWidth: block.showBorders ? 1 : 0,
                borderBottomWidth: block.showBorders ? 1 : 0,
                borderColor: '#000000',
                padding: 6,
            }
            return (
                <View
                    key={key}
                    style={{
                        borderTopWidth: block.showBorders ? 1 : 0,
                        borderLeftWidth: block.showBorders ? 1 : 0,
                        borderColor: '#000000',
                        marginBottom: block.marginBottom,
                    }}
                >
                    <View style={{ flexDirection: 'row' }} wrap={false}>
                        {block.headers.map((header, columnIndex) => (
                            <View
                                key={`${key}-header-${columnIndex}`}
                                style={[
                                    cell,
                                    {
                                        width: `${block.columnWidths[columnIndex]}%`,
                                    },
                                ]}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'Times-Bold',
                                        fontSize: block.fontSize,
                                        textAlign:
                                            block.headerAlignments[columnIndex],
                                    }}
                                >
                                    {resolve(header)}
                                </Text>
                            </View>
                        ))}
                    </View>
                    {block.rows.map((row, rowIndex) => (
                        <View
                            key={`${key}-row-${rowIndex}`}
                            style={{ flexDirection: 'row' }}
                            wrap={false}
                        >
                            {row.values.map((value, columnIndex) => {
                                // Blok pengesahan Form 05 umumnya disusun sebagai
                                // tabel: baris kosong untuk ruang tanda tangan,
                                // lalu baris nama penanda tangan.
                                const gambar = tandaTanganUntukNilai(
                                    value,
                                    block.headers[columnIndex] ?? '',
                                    tandaTangan
                                )
                                const perataan = blokPengesahan
                                    ? block.headerAlignments[columnIndex]
                                    : row.alignments[columnIndex]
                                return (
                                    <View
                                        key={`${key}-${rowIndex}-${columnIndex}`}
                                        style={[
                                            cell,
                                            {
                                                width: `${block.columnWidths[columnIndex]}%`,
                                            },
                                        ]}
                                    >
                                        {gambar ? (
                                            <View
                                                style={{
                                                    width: '100%',
                                                    alignItems:
                                                        perataan === 'center'
                                                            ? 'center'
                                                            : perataan === 'right'
                                                                ? 'flex-end'
                                                                : 'flex-start',
                                                }}
                                            >
                                                <GambarTandaTangan src={gambar} />
                                            </View>
                                        ) : adaGambar &&
                                            PLACEHOLDER_PENGESAHAN.test(value) ? (
                                            <View style={{ height: 44 }} />
                                        ) : null}
                                        <Text
                                            style={{
                                                fontSize: block.fontSize,
                                                lineHeight: 1.3,
                                                textAlign: perataan,
                                            }}
                                        >
                                            {resolve(value)}
                                        </Text>
                                    </View>
                                )
                            })}
                        </View>
                    ))}
                </View>
            )
        }

        return null
    })
}

export function RekapitulasiAfterTablePages({
    template,
    placeholders,
    logoPath,
    pageStyle,
    tandaTangan,
}: {
    template: FormAssessmentPortraitTemplate
    placeholders: Record<string, string>
    logoPath: string
    pageStyle: React.ComponentProps<typeof Page>['style']
    tandaTangan?: TandaTanganRekap
}) {
    return template.pages
        .filter((page) => page.placement === 'after_table')
        .map((page) => (
            <Page
                key={page.id}
                size="A4"
                orientation="landscape"
                style={pageStyle}
            >
                <RekapitulasiTemplateBlocks
                    blocks={page.blocks}
                    placeholders={placeholders}
                    logoPath={logoPath}
                    tandaTangan={tandaTangan}
                />
            </Page>
        ))
}
