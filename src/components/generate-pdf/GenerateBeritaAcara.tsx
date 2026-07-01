import React from 'react'
import { Document, Page, StyleSheet } from '@react-pdf/renderer'
import path from 'path'
import { GenerateBeritaAcaraType } from '@/types/GeneratePdfTypes'
import { FormAssessmentPortraitTemplate } from '@/types/FormAssessmentTemplate'
import { getBeritaAcaraPlaceholderValues } from '@/lib/berita-acara-template'
import { RekapitulasiTemplateBlocks } from './RekapitulasiTemplateContent'

const logoPath = path.join(process.cwd(), 'public', 'images', 'logo.png')

const styles = StyleSheet.create({
    page: {
        paddingTop: '1.5cm',
        paddingBottom: '1.5cm',
        paddingHorizontal: '2cm',
        backgroundColor: '#ffffff',
        fontFamily: 'Times-Roman',
        fontSize: 12,
        flexDirection: 'column',
    },
})

export const GenerateBeritaAcara = ({
    data,
    template,
}: {
    data: GenerateBeritaAcaraType
    template: FormAssessmentPortraitTemplate
}) => {
    const placeholders = getBeritaAcaraPlaceholderValues(data)

    return (
        <Document>
            {template.pages
                .filter((page) => page.placement === 'document')
                .map((page) => (
                    <Page
                        key={page.id}
                        size="A4"
                        orientation="landscape"
                        style={styles.page}
                    >
                        <RekapitulasiTemplateBlocks
                            blocks={page.blocks}
                            placeholders={placeholders}
                            logoPath={logoPath}
                        />
                    </Page>
                ))}
        </Document>
    )
}
