'use client'

import React from 'react'
import {
    DocumentTemplateBuilder,
    DocumentTemplateBuilderConfig,
} from '@/components/template-builder/FormAsessmenComponents'
import {
    cloneDefaultRekapitulasiTemplate,
    REKAPITULASI_PLACEHOLDERS,
} from '@/lib/rekapitulasi-template'
import {
    getRekapitulasiTemplate,
    saveRekapitulasiTemplate,
} from '@/services/RekapitulasiTemplateService'

const sampleValues: Record<string, string> = {
    nama: 'Nama Pemohon RPL',
    alamat: 'Jl. Contoh No. 10, Tangerang Selatan',
    kode_pos: '15310',
    nomor_hp: '0812-3456-7890',
    email: 'pemohon@example.com',
    program_studi: 'Teknik Informatika',
    universitas: 'Institut Teknologi Indonesia',
    alamat_universitas: 'Jl. Raya Puspiptek, Tangerang Selatan',
    kode_pos_universitas: '15314',
    jenjang_sebelumnya: 'S1',
    program_studi_sebelumnya: 'Sistem Informasi',
    institusi_sebelumnya: 'Universitas Contoh',
    jenjang_kkni_dituju: 'Level 6',
    asesor_1: 'Nama Penilai Pertama',
    asesor_2: 'Nama Penilai Kedua',
    tanggal_sekarang: '1 Juli 2026',
    bulan_tahun: 'Juli 2026',
    tahun: '2026',
}

const config: DocumentTemplateBuilderConfig = {
    title: 'Template Form Rekapitulasi',
    description:
        'Atur header, identitas, dan bagian pengesahan Form 05. Tabel rekapitulasi tetap menggunakan format sistem.',
    sectionLabel: 'Bagian dokumen',
    orientation: 'landscape',
    placeholders: REKAPITULASI_PLACEHOLDERS,
    sampleValues,
    placementOptions: [
        { value: 'before_table', label: 'Sebelum tabel rekapitulasi' },
        { value: 'after_table', label: 'Halaman setelah tabel' },
    ],
    load: getRekapitulasiTemplate,
    save: saveRekapitulasiTemplate,
    getDefault: cloneDefaultRekapitulasiTemplate,
}

export default function FormRekapitulasiComponents() {
    return <DocumentTemplateBuilder config={config} />
}
