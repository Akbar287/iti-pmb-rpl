import {
    normalizeDocumentTemplate,
    resolveFormAssessmentPlaceholders,
} from '@/lib/form-assessment-template'
import { FormAssessmentPortraitTemplate } from '@/types/FormAssessmentTemplate'
import { GenerateBeritaAcaraType } from '@/types/GeneratePdfTypes'

export const BERITA_ACARA_TEMPLATE_TYPE = 'FORM_BERITA_ACARA'

export const BERITA_ACARA_PLACEHOLDERS = [
    { key: 'nama', label: 'Nama calon mahasiswa' },
    { key: 'tanggal_rapat', label: 'Tanggal rapat pleno' },
    { key: 'semester', label: 'Semester aktif kuliah' },
    { key: 'tahun_akademik', label: 'Tahun akademik' },
    { key: 'program_studi', label: 'Program studi' },
    { key: 'universitas', label: 'Nama perguruan tinggi' },
    { key: 'alamat_universitas', label: 'Alamat perguruan tinggi' },
    { key: 'kode_pos_universitas', label: 'Kode pos perguruan tinggi' },
    { key: 'sks_diakui', label: 'Jumlah SKS diakui' },
    { key: 'sks_harus_diambil', label: 'Jumlah SKS yang harus diambil' },
    { key: 'penilai_1', label: 'Nama penilai 1' },
    { key: 'penilai_2', label: 'Nama penilai 2' },
    { key: 'daftar_penilai', label: 'Daftar nama penilai' },
    { key: 'kaprodi', label: 'Nama ketua program studi' },
    { key: 'ketua_komite', label: 'Nama ketua tim komite' },
    { key: 'tanggal_sekarang', label: 'Tanggal cetak' },
    { key: 'bulan_tahun', label: 'Bulan dan tahun cetak' },
] as const

export const DEFAULT_BERITA_ACARA_TEMPLATE: FormAssessmentPortraitTemplate = {
    version: 1,
    pages: [
        {
            id: 'berita-acara',
            name: 'Berita Acara',
            placement: 'document',
            blocks: [
                {
                    id: 'ba-logo',
                    type: 'logo',
                    width: 80,
                    height: 80,
                    align: 'center',
                    marginBottom: 12,
                },
                {
                    id: 'ba-title',
                    type: 'text',
                    content:
                        'BERITA ACARA RAPAT PLENO PENGESAHAN PENILAIAN PROGRAM AKADEMIK\nJALUR REKOGNISI PEMBELAJARAN LAMPAU (RPL)',
                    fontSize: 13,
                    bold: true,
                    italic: false,
                    uppercase: false,
                    align: 'center',
                    lineHeight: 1.2,
                    marginBottom: 10,
                },
                {
                    id: 'ba-opening',
                    type: 'text',
                    content:
                        'Pada hari ini tanggal {tanggal_rapat} telah diselenggarakan Rapat Pleno untuk pengesahan penilaian Program Akademik Jalur Rekognisi Pembelajaran Lampau (RPL) atas nama calon mahasiswa: {nama}, yang akan aktif kuliah pada Semester {semester} Tahun Akademik {tahun_akademik} pada Program Studi {program_studi}.',
                    fontSize: 12,
                    bold: false,
                    italic: false,
                    uppercase: false,
                    align: 'justify',
                    lineHeight: 1.3,
                    marginBottom: 6,
                },
                {
                    id: 'ba-result-intro',
                    type: 'text',
                    content:
                        'Hasil penilaian yang telah dilaksanakan dan disahkan adalah sebagai berikut:',
                    fontSize: 12,
                    bold: false,
                    italic: false,
                    uppercase: false,
                    align: 'justify',
                    lineHeight: 1.2,
                    marginBottom: 8,
                },
                {
                    id: 'ba-result-table',
                    type: 'table',
                    showBorders: true,
                    headers: [
                        'Nama Penilai',
                        'Jumlah SKS yang Diakui',
                        'Jumlah SKS yang Masih Harus Diambil',
                    ],
                    headerAlignments: ['center', 'center', 'center'],
                    rows: [
                        {
                            values: [
                                '{daftar_penilai}',
                                '{sks_diakui}',
                                '{sks_harus_diambil}',
                            ],
                            alignments: ['left', 'center', 'center'],
                        },
                    ],
                    fontSize: 12,
                    columnWidths: [50, 25, 25],
                    marginBottom: 10,
                },
                {
                    id: 'ba-closing',
                    type: 'text',
                    content:
                        'Berita acara ini dilengkapi dengan lampiran SK Pengakuan.\nDemikian berita acara rapat pleno ini agar dapat digunakan sebagaimana perlunya.',
                    fontSize: 12,
                    bold: false,
                    italic: false,
                    uppercase: false,
                    align: 'justify',
                    lineHeight: 1.3,
                    marginBottom: 12,
                },
                {
                    id: 'ba-date',
                    type: 'text',
                    content: 'Tangerang Selatan, {tanggal_rapat}',
                    fontSize: 12,
                    bold: false,
                    italic: false,
                    uppercase: false,
                    align: 'right',
                    lineHeight: 1.2,
                    marginBottom: 10,
                },
                {
                    id: 'ba-sign-space',
                    type: 'spacer',
                    height: 35,
                    marginBottom: 0,
                },
                {
                    id: 'ba-signatures',
                    type: 'table',
                    showBorders: false,
                    headers: ['Penilai I', 'Penilai II', 'Ketua Program Studi'],
                    headerAlignments: ['center', 'center', 'center'],
                    rows: [
                        {
                            values: [
                                '\n\n\n( {penilai_1} )',
                                '\n\n\n( {penilai_2} )',
                                '{program_studi}\n\n\n( {kaprodi} )',
                            ],
                            alignments: ['center', 'center', 'center'],
                        },
                    ],
                    fontSize: 11,
                    columnWidths: [33, 33, 34],
                    marginBottom: 0,
                },
                {
                    id: 'ba-committee',
                    type: 'text',
                    content: 'Ketua Tim Komite\n\n\n( {ketua_komite} )',
                    fontSize: 11,
                    bold: false,
                    italic: false,
                    uppercase: false,
                    align: 'center',
                    lineHeight: 1.3,
                    marginBottom: 0,
                },
            ],
        },
    ],
}

const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
]

const formatDate = (date: Date | string) => {
    const value = new Date(date)
    return `${value.getDate()} ${months[value.getMonth()]} ${value.getFullYear()}`
}

export function getBeritaAcaraPlaceholderValues(
    data: GenerateBeritaAcaraType,
    now = new Date()
): Record<string, string> {
    const penilai = (order: number) =>
        data.Penilai?.find((item) => item.Urutan === order)?.Nama || '-'

    return {
        nama: data.Nama || '-',
        tanggal_rapat: formatDate(data.TanggalRapat),
        semester: data.Semester || '-',
        tahun_akademik: data.TahunAkademik || '-',
        program_studi: data.ProgramStudi?.Nama || '-',
        universitas: data.Universitas?.Nama || '-',
        alamat_universitas: data.Universitas?.Alamat || '-',
        kode_pos_universitas: data.Universitas?.KodePos || '-',
        sks_diakui: String(data.SksDiakui ?? 0),
        sks_harus_diambil: String(data.SksHarusDiambil ?? 0),
        penilai_1: penilai(1),
        penilai_2: penilai(2),
        daftar_penilai: [penilai(1), penilai(2)].join('\n'),
        kaprodi: data.Kaprodi || '-',
        ketua_komite: data.KetuaKomite || '-',
        tanggal_sekarang: formatDate(now),
        bulan_tahun: `${months[now.getMonth()]} ${now.getFullYear()}`,
    }
}

export const resolveBeritaAcaraPlaceholders =
    resolveFormAssessmentPlaceholders

export function normalizeBeritaAcaraTemplate(value: unknown) {
    return normalizeDocumentTemplate(value, ['document'], 'document')
}

export function cloneDefaultBeritaAcaraTemplate(): FormAssessmentPortraitTemplate {
    return JSON.parse(
        JSON.stringify(DEFAULT_BERITA_ACARA_TEMPLATE)
    ) as FormAssessmentPortraitTemplate
}
