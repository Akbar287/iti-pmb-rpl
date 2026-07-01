import {
    normalizeDocumentTemplate,
    resolveFormAssessmentPlaceholders,
} from '@/lib/form-assessment-template'
import { FormAssessmentPortraitTemplate } from '@/types/FormAssessmentTemplate'
import { GenerateRekapitulasiType } from '@/types/GeneratePdfTypes'

export const REKAPITULASI_TEMPLATE_TYPE = 'FORM_REKAPITULASI'

export const REKAPITULASI_PLACEHOLDERS = [
    { key: 'nama', label: 'Nama pemohon RPL' },
    { key: 'alamat', label: 'Alamat pemohon' },
    { key: 'kode_pos', label: 'Kode pos pemohon' },
    { key: 'nomor_hp', label: 'Nomor telepon/HP' },
    { key: 'email', label: 'Alamat email' },
    { key: 'program_studi', label: 'Program studi tujuan' },
    { key: 'universitas', label: 'Nama perguruan tinggi' },
    { key: 'alamat_universitas', label: 'Alamat perguruan tinggi' },
    { key: 'kode_pos_universitas', label: 'Kode pos perguruan tinggi' },
    { key: 'jenjang_sebelumnya', label: 'Jenjang pendidikan sebelumnya' },
    { key: 'program_studi_sebelumnya', label: 'Program studi sebelumnya' },
    { key: 'institusi_sebelumnya', label: 'Institusi sebelumnya' },
    { key: 'jenjang_kkni_dituju', label: 'Jenjang KKNI yang dituju' },
    { key: 'asesor_1', label: 'Nama penilai 1' },
    { key: 'asesor_2', label: 'Nama penilai 2' },
    { key: 'tanggal_sekarang', label: 'Tanggal cetak' },
    { key: 'bulan_tahun', label: 'Bulan dan tahun cetak' },
    { key: 'tahun', label: 'Tahun cetak' },
] as const

export const DEFAULT_REKAPITULASI_TEMPLATE: FormAssessmentPortraitTemplate = {
    version: 1,
    pages: [
        {
            id: 'rekap-header',
            name: 'Header dan Identitas',
            placement: 'before_table',
            blocks: [
                {
                    id: 'rekap-logo',
                    type: 'logo',
                    width: 60,
                    height: 60,
                    align: 'center',
                    marginBottom: 5,
                },
                {
                    id: 'rekap-university',
                    type: 'text',
                    content: '{universitas}',
                    fontSize: 20,
                    bold: true,
                    italic: false,
                    uppercase: true,
                    align: 'center',
                    lineHeight: 1.2,
                    marginBottom: 3,
                },
                {
                    id: 'rekap-address',
                    type: 'text',
                    content:
                        '{alamat_universitas}, Tangerang Selatan - {kode_pos_universitas}\n(021) 7562757',
                    fontSize: 10,
                    bold: false,
                    italic: false,
                    uppercase: false,
                    align: 'center',
                    lineHeight: 1.2,
                    marginBottom: 5,
                },
                {
                    id: 'rekap-form-number',
                    type: 'text',
                    content: 'Form (05)',
                    fontSize: 10,
                    bold: true,
                    italic: false,
                    uppercase: false,
                    align: 'right',
                    lineHeight: 1.2,
                    marginBottom: 5,
                },
                {
                    id: 'rekap-title',
                    type: 'text',
                    content:
                        'REKAPITULASI HASIL PENILAIAN RPL PEROLEHAN KREDIT\n{universitas}',
                    fontSize: 11,
                    bold: true,
                    italic: false,
                    uppercase: true,
                    align: 'center',
                    lineHeight: 1.2,
                    marginBottom: 10,
                },
                {
                    id: 'rekap-identity',
                    type: 'key_value',
                    rows: [
                        { label: 'Nama Pemohon RPL', value: '{nama}' },
                        { label: 'Alamat', value: '{alamat}' },
                        { label: 'No. HP', value: '{nomor_hp}' },
                        { label: 'Email', value: '{email}' },
                        {
                            label: 'Jenjang Pendidikan Sebelumnya',
                            value: '{jenjang_sebelumnya}',
                        },
                        {
                            label: 'Program Studi Sebelumnya',
                            value: '{program_studi_sebelumnya}',
                        },
                        {
                            label: 'Nama Perguruan Tinggi Sebelumnya',
                            value: '{institusi_sebelumnya}',
                        },
                        {
                            label: 'Jenjang KKNI yang Dituju',
                            value: '{jenjang_kkni_dituju}',
                        },
                        { label: 'Program Studi', value: '{program_studi}' },
                    ],
                    fontSize: 9,
                    labelWidth: 32,
                    marginBottom: 8,
                },
            ],
        },
        {
            id: 'rekap-signature',
            name: 'Tanda Tangan',
            placement: 'after_table',
            blocks: [
                {
                    id: 'rekap-sign-date',
                    type: 'text',
                    content: 'Tangerang Selatan, {tanggal_sekarang}',
                    fontSize: 10,
                    bold: false,
                    italic: false,
                    uppercase: false,
                    align: 'right',
                    lineHeight: 1.2,
                    marginBottom: 30,
                },
                {
                    id: 'rekap-sign-title',
                    type: 'text',
                    content: 'PENGESAHAN HASIL PENILAIAN RPL',
                    fontSize: 12,
                    bold: true,
                    italic: false,
                    uppercase: false,
                    align: 'center',
                    lineHeight: 1.2,
                    marginBottom: 30,
                },
                {
                    id: 'rekap-signatures',
                    type: 'key_value',
                    rows: [
                        { label: 'Penilai I', value: '({asesor_1})' },
                        { label: 'Penilai II', value: '({asesor_2})' },
                        { label: 'Pemohon', value: '({nama})' },
                    ],
                    fontSize: 11,
                    labelWidth: 30,
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

const formatDate = (date: Date) =>
    `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`

export function getRekapitulasiPlaceholderValues(
    data: GenerateRekapitulasiType,
    now = new Date()
): Record<string, string> {
    const assessor = (order: number) =>
        data.Asesor?.find((item) => item.Urutan === order)?.Nama || '-'

    return {
        nama: data.Nama || '-',
        alamat: data.Alamat || '-',
        kode_pos: data.KodePos || '-',
        nomor_hp: data.NomorHp || '-',
        email: data.Email || '-',
        program_studi: data.ProgramStudi?.Nama || '-',
        universitas: data.Universitas?.Nama || '-',
        alamat_universitas: data.Universitas?.Alamat || '-',
        kode_pos_universitas: data.Universitas?.KodePos || '-',
        jenjang_sebelumnya: data.InstitusiLama?.Jenjang || '-',
        program_studi_sebelumnya: data.InstitusiLama?.Jurusan || '-',
        institusi_sebelumnya: data.InstitusiLama?.NamaInstitusi || '-',
        jenjang_kkni_dituju: data.InstitusiLama?.JenjangKKNIDituju || '-',
        asesor_1: assessor(1),
        asesor_2: assessor(2),
        tanggal_sekarang: formatDate(now),
        bulan_tahun: `${months[now.getMonth()]} ${now.getFullYear()}`,
        tahun: String(now.getFullYear()),
    }
}

export const resolveRekapitulasiPlaceholders =
    resolveFormAssessmentPlaceholders

export function normalizeRekapitulasiTemplate(value: unknown) {
    return normalizeDocumentTemplate(
        value,
        ['before_table', 'after_table'],
        'before_table'
    )
}

export function cloneDefaultRekapitulasiTemplate(): FormAssessmentPortraitTemplate {
    return JSON.parse(
        JSON.stringify(DEFAULT_REKAPITULASI_TEMPLATE)
    ) as FormAssessmentPortraitTemplate
}
