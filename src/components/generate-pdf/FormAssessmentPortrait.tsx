import React from 'react'
import { Image, Page, Text, View } from '@react-pdf/renderer'
import {
    getFormAssessmentPlaceholderValues,
    resolveFormAssessmentPlaceholders,
} from '@/lib/form-assessment-template'
import { FormAssessmentPortraitTemplate } from '@/types/FormAssessmentTemplate'
import { GenerateFormAsessmenType } from '@/types/GeneratePdfTypes'

const resolve = (value: string, placeholders: Record<string, string>) =>
    resolveFormAssessmentPlaceholders(value, placeholders)

export function FormAssessmentPortrait({
    data,
    template,
    logoPath,
    pageStyle,
    placement,
}: {
    data: GenerateFormAsessmenType
    template: FormAssessmentPortraitTemplate
    logoPath: string
    pageStyle: React.ComponentProps<typeof Page>['style']
    placement: 'before_landscape' | 'after_landscape'
}) {
    const placeholders = getFormAssessmentPlaceholderValues(data)

    return template.pages
        .filter((page) => page.placement === placement)
        .map((page, pageIndex) => (
        <Page
            key={page.id || pageIndex}
            size="A4"
            orientation="portrait"
            style={pageStyle}
        >
            {page.blocks.map((block, blockIndex) => {
                const key = block.id || `${page.id}-${blockIndex}`

                if (block.type === 'text') {
                    const content = resolve(block.content, placeholders)

                    // Blok penetapan tanda tangan mahasiswa: gambar tanda
                    // tangannya disisipkan di ruang kosong antara baris
                    // "Tanda Tangan Calon Mahasiswa" dan baris nama di bawahnya.
                    // Dikenali lewat isi teksnya supaya seluruh blok bertanda
                    // tangan mahasiswa ikut terisi — termasuk bila admin
                    // menggandakan bloknya di Template Builder dengan id lain.
                    const blokTtdMahasiswa =
                        !!data.TandaTanganMahasiswa &&
                        (block.id === 'closing-signature-place' ||
                            /tanda\s+tangan\s+calon\s+mahasiswa/i.test(content))

                    if (blokTtdMahasiswa) {
                        return (
                            // Ruang kosong bawaan blok dipakai gambar tanda
                            // tangan, jadi marginnya dikurangi setinggi gambar.
                            <View
                                key={key}
                                style={{
                                    marginBottom: Math.max(
                                        block.marginBottom - 52,
                                        4
                                    ),
                                }}
                            >
                                <Text
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
                                        textTransform: block.uppercase
                                            ? 'uppercase'
                                            : 'none',
                                    }}
                                >
                                    {content}
                                </Text>
                                <View
                                    style={{
                                        alignItems:
                                            block.align === 'left'
                                                ? 'flex-start'
                                                : block.align === 'center'
                                                    ? 'center'
                                                    : 'flex-end',
                                        marginTop: 4,
                                    }}
                                >
                                    <Image
                                        src={data.TandaTanganMahasiswa as string}
                                        style={{
                                            width: 120,
                                            height: 48,
                                            objectFit: 'contain',
                                        }}
                                    />
                                </View>
                            </View>
                        )
                    }

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
                                textTransform: block.uppercase
                                    ? 'uppercase'
                                    : 'none',
                                marginBottom: block.marginBottom,
                            }}
                        >
                            {content}
                        </Text>
                    )
                }

                if (block.type === 'logo') {
                    const alignItems =
                        block.align === 'left'
                            ? 'flex-start'
                            : block.align === 'right'
                              ? 'flex-end'
                              : 'center'
                    return (
                        <View
                            key={key}
                            style={{
                                alignItems,
                                marginBottom: block.marginBottom,
                            }}
                        >
                            <Image
                                src={logoPath}
                                style={{
                                    width: block.width,
                                    height: block.height,
                                }}
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
                        <View
                            key={key}
                            style={{ marginBottom: block.marginBottom }}
                        >
                            {block.rows.map((row, rowIndex) => (
                                <View
                                    key={`${key}-${rowIndex}`}
                                    style={{
                                        flexDirection: 'row',
                                        marginBottom: 3,
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
                                        {resolve(row.label, placeholders)}
                                    </Text>
                                    <Text
                                        style={{
                                            width: '3%',
                                            fontSize: block.fontSize,
                                        }}
                                    >
                                        :
                                    </Text>
                                    <Text
                                        style={{
                                            width: `${97 - block.labelWidth}%`,
                                            fontSize: block.fontSize,
                                        }}
                                    >
                                        {resolve(row.value, placeholders)}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )
                }

                if (block.type === 'list') {
                    return (
                        <View
                            key={key}
                            style={{ marginBottom: block.marginBottom }}
                        >
                            {block.items.map((item, itemIndex) => (
                                <View
                                    key={`${key}-${itemIndex}`}
                                    style={{
                                        flexDirection: 'row',
                                        marginBottom: 2,
                                    }}
                                >
                                    <Text
                                        style={{
                                            width: block.ordered ? 18 : 12,
                                            fontSize: block.fontSize,
                                            lineHeight: block.lineHeight,
                                        }}
                                    >
                                        {block.ordered
                                            ? `${itemIndex + 1}.`
                                            : '•'}
                                    </Text>
                                    <Text
                                        style={{
                                            flex: 1,
                                            fontSize: block.fontSize,
                                            lineHeight: block.lineHeight,
                                            textAlign: 'justify',
                                        }}
                                    >
                                        {resolve(item, placeholders)}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )
                }

                if (block.type === 'table') {
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
                            <View
                                style={{ flexDirection: 'row' }}
                                wrap={false}
                            >
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
                                                    block.headerAlignments[
                                                        columnIndex
                                                    ],
                                            }}
                                        >
                                            {resolve(header, placeholders)}
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
                                    {row.values.map(
                                        (value, columnIndex) => (
                                            <View
                                                key={`${key}-${rowIndex}-${columnIndex}`}
                                                style={[
                                                    cell,
                                                    {
                                                        width: `${block.columnWidths[columnIndex]}%`,
                                                    },
                                                ]}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize:
                                                            block.fontSize,
                                                        lineHeight: 1.3,
                                                        textAlign:
                                                            row.alignments[
                                                                columnIndex
                                                            ],
                                                    }}
                                                >
                                                    {resolve(
                                                        value,
                                                        placeholders
                                                    )}
                                                </Text>
                                            </View>
                                        )
                                    )}
                                </View>
                            ))}
                        </View>
                    )
                }

                return null
            })}
        </Page>
        ))
}
