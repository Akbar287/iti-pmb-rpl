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

    // Tanda tangan penilai memakai gambar yang sama dengan Form 03 dan Form 05.
    // Ketua Tim Komite sementara dikosongkan — belum ada sumber tanda tangannya.
    const tandaTangan = {
        penilai1: (data.Penilai ?? []).find((p) => p.Urutan === 1)?.TandaTangan ?? null,
        penilai2: (data.Penilai ?? []).find((p) => p.Urutan === 2)?.TandaTangan ?? null,
    }

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
                            tandaTangan={tandaTangan}
                        />
                    </Page>
                ))}
        </Document>
    )
}
