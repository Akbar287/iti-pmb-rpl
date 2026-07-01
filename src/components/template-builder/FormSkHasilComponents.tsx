'use client'

import React, { useState } from 'react'
import {
    DocumentTemplateBuilder,
    DocumentTemplateBuilderConfig,
} from '@/components/template-builder/FormAsessmenComponents'
import {
    cloneDefaultSkHasilTemplate,
    SK_HASIL_PLACEHOLDERS,
    SkHasilTemplateVariant,
} from '@/lib/sk-hasil-template'
import {
    getSkHasilTemplate,
    saveSkHasilTemplate,
} from '@/services/SkHasilTemplateService'
import { Button } from '@/components/ui/button'

const sampleValues: Record<string, string> = {
    nama: 'Nama Calon Mahasiswa',
    tempat_lahir: 'Tangerang',
    tanggal_lahir: '12 Mei 2000',
    tempat_tanggal_lahir: 'Tangerang, 12 Mei 2000',
    periode: '2026/2027 Ganjil',
    periode_format: 'Ganjil 2026/2027',
    program_studi: 'Teknik Informatika',
    universitas: 'Institut Teknologi Indonesia',
    alamat_universitas: 'Jl. Raya Puspiptek, Tangerang Selatan',
    kode_pos_universitas: '15314',
    institusi_asal: 'Universitas Contoh',
    jurusan_asal: 'Sistem Informasi',
    jenjang_asal: 'S1',
    nisn: '1234567890',
    nomor_sk: '001/Kept-ITI/VII/2026',
    jenis_sk: 'perolehan kredit',
    rektor: 'Prof. Dr. Ir. Nama Rektor, M.Sis',
    deskripsi_pengakuan:
        'capaian pembelajaran yang diperoleh dari pendidikan formal, nonformal, informal dan / atau pengalaman kerja',
    deskripsi_dasar_penilaian:
        'verifikasi dan validasi oleh penilai atas penilaian mandiri mahasiswa',
    deskripsi_menetapkan:
        'verifikasi dan validasi atas penilaian mandiri',
    deskripsi_pengakuan_sks:
        'capaian pembelajaran yang diperoleh dari pendidikan formal, nonformal, informal dan / atau pengalaman kerja',
    tanggal_sekarang: '1 Juli 2026',
    bulan_tahun: 'Juli 2026',
    tahun: '2026',
}

const transferSampleValues: Record<string, string> = {
    ...sampleValues,
    jenis_sk: 'transfer kredit',
    deskripsi_pengakuan:
        'penyesuaian sub Capaian Pembelajaran Mata Kuliah yang diperoleh dari pendidikan formal sebelumnya',
    deskripsi_dasar_penilaian:
        'check equivalence dari transkrip akademik pendidikan formal sebelumnya',
    deskripsi_menetapkan: 'penilaian Pendidikan Akademik S1 Jalur',
    deskripsi_pengakuan_sks:
        'sub Capaian Pembelajaran Mata Kuliah yang diperoleh dari pendidikan formal sebelumnya',
}

const variants: Record<
    SkHasilTemplateVariant,
    DocumentTemplateBuilderConfig
> = {
    transfer: {
        title: 'Template SK Transfer SKS',
        description:
            'Template khusus keputusan dan konsideran Transfer SKS. Perubahan di sini tidak memengaruhi SK Perolehan SKS.',
        sectionLabel: 'Halaman SK Transfer',
        orientation: 'portrait',
        placeholders: SK_HASIL_PLACEHOLDERS,
        sampleValues: transferSampleValues,
        placementOptions: [
            { value: 'before_landscape', label: 'Sebelum tabel daftar nilai' },
            { value: 'after_landscape', label: 'Sesudah tabel daftar nilai' },
        ],
        load: () => getSkHasilTemplate('transfer'),
        save: (template) => saveSkHasilTemplate(template, 'transfer'),
        getDefault: () => cloneDefaultSkHasilTemplate('transfer'),
    },
    perolehan: {
        title: 'Template SK Perolehan SKS',
        description:
            'Template khusus keputusan dan konsideran Perolehan SKS. Perubahan di sini tidak memengaruhi SK Transfer SKS.',
        sectionLabel: 'Halaman SK Perolehan',
        orientation: 'portrait',
        placeholders: SK_HASIL_PLACEHOLDERS,
        sampleValues,
        placementOptions: [
            { value: 'before_landscape', label: 'Sebelum tabel daftar nilai' },
            { value: 'after_landscape', label: 'Sesudah tabel daftar nilai' },
        ],
        load: () => getSkHasilTemplate('perolehan'),
        save: (template) => saveSkHasilTemplate(template, 'perolehan'),
        getDefault: () => cloneDefaultSkHasilTemplate('perolehan'),
    },
}

export default function FormSkHasilComponents() {
    const [variant, setVariant] =
        useState<SkHasilTemplateVariant>('transfer')

    return (
        <div className="space-y-4">
            <div className="inline-flex rounded-lg border bg-background p-1">
                <Button
                    variant={variant === 'transfer' ? 'default' : 'ghost'}
                    onClick={() => setVariant('transfer')}
                >
                    SK Transfer SKS
                </Button>
                <Button
                    variant={variant === 'perolehan' ? 'default' : 'ghost'}
                    onClick={() => setVariant('perolehan')}
                >
                    SK Perolehan SKS
                </Button>
            </div>
            <DocumentTemplateBuilder
                key={variant}
                config={variants[variant]}
            />
        </div>
    )
}
