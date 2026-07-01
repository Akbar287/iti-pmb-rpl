'use client'

import React from 'react'
import {
    DocumentTemplateBuilder,
    DocumentTemplateBuilderConfig,
} from '@/components/template-builder/FormAsessmenComponents'
import {
    BERITA_ACARA_PLACEHOLDERS,
    cloneDefaultBeritaAcaraTemplate,
} from '@/lib/berita-acara-template'
import {
    getBeritaAcaraTemplate,
    saveBeritaAcaraTemplate,
} from '@/services/BeritaAcaraTemplateService'

const sampleValues: Record<string, string> = {
    nama: 'Nama Calon Mahasiswa',
    tanggal_rapat: '1 Juli 2026',
    semester: 'Ganjil',
    tahun_akademik: '2026/2027',
    program_studi: 'Teknik Informatika',
    universitas: 'Institut Teknologi Indonesia',
    alamat_universitas: 'Jl. Raya Puspiptek, Tangerang Selatan',
    kode_pos_universitas: '15314',
    sks_diakui: '48',
    sks_harus_diambil: '96',
    penilai_1: 'Nama Penilai Pertama',
    penilai_2: 'Nama Penilai Kedua',
    daftar_penilai: 'Nama Penilai Pertama\nNama Penilai Kedua',
    kaprodi: 'Nama Ketua Program Studi',
    ketua_komite: 'Nama Ketua Tim Komite',
    tanggal_sekarang: '1 Juli 2026',
    bulan_tahun: 'Juli 2026',
}

const config: DocumentTemplateBuilderConfig = {
    title: 'Template Form Berita Acara',
    description:
        'Atur seluruh isi Berita Acara Rapat Pleno, termasuk tabel hasil dan bagian tanda tangan.',
    sectionLabel: 'Halaman dokumen',
    orientation: 'landscape',
    placeholders: BERITA_ACARA_PLACEHOLDERS,
    sampleValues,
    placementOptions: [{ value: 'document', label: 'Isi berita acara' }],
    load: getBeritaAcaraTemplate,
    save: saveBeritaAcaraTemplate,
    getDefault: cloneDefaultBeritaAcaraTemplate,
}

export default function FormBeritaAcaraComponents() {
    return <DocumentTemplateBuilder config={config} />
}
