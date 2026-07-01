import React from 'react'
import { Image, Page, Text, View } from '@react-pdf/renderer'
import { resolveRekapitulasiPlaceholders } from '@/lib/rekapitulasi-template'
import {
    FormAssessmentPortraitTemplate,
    FormAssessmentTemplateBlock,
} from '@/types/FormAssessmentTemplate'

export function RekapitulasiTemplateBlocks({
    blocks,
    placeholders,
    logoPath,
}: {
    blocks: FormAssessmentTemplateBlock[]
    placeholders: Record<string, string>
    logoPath: string
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
                    {block.rows.map((row, rowIndex) => (
                        <View
                            key={`${key}-${rowIndex}`}
                            style={{ flexDirection: 'row', marginBottom: 3 }}
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
                            <Text
                                style={{
                                    width: `${97 - block.labelWidth}%`,
                                    fontSize: block.fontSize,
                                }}
                            >
                                {resolve(row.value)}
                            </Text>
                        </View>
                    ))}
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
                            {row.values.map((value, columnIndex) => (
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
                                            fontSize: block.fontSize,
                                            lineHeight: 1.3,
                                            textAlign:
                                                row.alignments[columnIndex],
                                        }}
                                    >
                                        {resolve(value)}
                                    </Text>
                                </View>
                            ))}
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
}: {
    template: FormAssessmentPortraitTemplate
    placeholders: Record<string, string>
    logoPath: string
    pageStyle: React.ComponentProps<typeof Page>['style']
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
                />
            </Page>
        ))
}
