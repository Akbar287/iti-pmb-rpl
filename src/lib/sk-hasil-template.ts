import {
    normalizeDocumentTemplate,
    resolveFormAssessmentPlaceholders,
} from '@/lib/form-assessment-template'
import { FormAssessmentPortraitTemplate } from '@/types/FormAssessmentTemplate'
import { GenerateSkType } from '@/types/GeneratePdfTypes'

export type SkHasilTemplateVariant = 'transfer' | 'perolehan'

// Key lama dipertahankan sebagai fallback agar template yang sudah tersimpan
// sebelum pemisahan varian tidak hilang.
export const LEGACY_SK_HASIL_TEMPLATE_TYPE = 'FORM_SK_HASIL'
export const SK_HASIL_TEMPLATE_TYPES: Record<
    SkHasilTemplateVariant,
    string
> = {
    transfer: 'FORM_SK_HASIL_TRANSFER',
    perolehan: 'FORM_SK_HASIL_PEROLEHAN',
}

export function resolveSkHasilTemplateVariant(
    jenisSk: string
): SkHasilTemplateVariant {
    return jenisSk.toUpperCase().includes('TRANSFER')
        ? 'transfer'
        : 'perolehan'
}

export const SK_HASIL_PLACEHOLDERS = [
    { key: 'nama', label: 'Nama mahasiswa' },
    { key: 'tempat_lahir', label: 'Tempat lahir' },
    { key: 'tanggal_lahir', label: 'Tanggal lahir' },
    { key: 'tempat_tanggal_lahir', label: 'Tempat dan tanggal lahir' },
    { key: 'periode', label: 'Periode pendaftaran' },
    { key: 'periode_format', label: 'Periode format (Semester Tahun)' },
    { key: 'program_studi', label: 'Program studi' },
    { key: 'universitas', label: 'Nama perguruan tinggi' },
    { key: 'alamat_universitas', label: 'Alamat perguruan tinggi' },
    { key: 'kode_pos_universitas', label: 'Kode pos perguruan tinggi' },
    { key: 'institusi_asal', label: 'Nama institusi asal' },
    { key: 'jurusan_asal', label: 'Program studi/jurusan asal' },
    { key: 'jenjang_asal', label: 'Jenjang pendidikan asal' },
    { key: 'nisn', label: 'NIM/NISN mahasiswa' },
    { key: 'nomor_sk', label: 'Nomor SK' },
    { key: 'jenis_sk', label: 'Jenis SK (transfer kredit / perolehan kredit)' },
    { key: 'rektor', label: 'Nama rektor' },
    { key: 'deskripsi_pengakuan', label: 'Deskripsi pengakuan (otomatis sesuai jenis SK)' },
    { key: 'deskripsi_dasar_penilaian', label: 'Deskripsi dasar penilaian (otomatis sesuai jenis SK)' },
    { key: 'deskripsi_menetapkan', label: 'Deskripsi menetapkan (otomatis sesuai jenis SK)' },
    { key: 'deskripsi_pengakuan_sks', label: 'Deskripsi pengakuan SKS (otomatis sesuai jenis SK)' },
    { key: 'tanggal_sekarang', label: 'Tanggal cetak' },
    { key: 'bulan_tahun', label: 'Bulan dan tahun cetak' },
    { key: 'tahun', label: 'Tahun cetak' },
] as const

export const DEFAULT_SK_HASIL_TEMPLATE: FormAssessmentPortraitTemplate = {
    version: 1,
    pages: [
        {
            id: 'sk-halaman-1',
            name: 'Keputusan Rektor (Hal. 1)',
            placement: 'before_landscape',
            blocks: [
                {
                    id: 'sk-header-keputusan',
                    type: 'text',
                    content:
                        'KEPUTUSAN REKTOR\n{universitas}\nNomor {nomor_sk}\nTentang\nPENETAPAN HASIL PENILAIAN PENDIDIKAN AKADEMIK S1\nJALUR REKOGNISI PEMBELAJARAN LAMPAU (RPL) SKEMA {jenis_sk}\nATAS NAMA {nama}\nPROGRAM STUDI {program_studi} {universitas}\nSEMESTER {periode_format}',
                    fontSize: 12,
                    bold: true,
                    italic: false,
                    uppercase: false,
                    align: 'center',
                    lineHeight: 1.3,
                    marginBottom: 16,
                },
                {
                    id: 'sk-separator',
                    type: 'spacer',
                    height: 2,
                    marginBottom: 10,
                },
                {
                    id: 'sk-rektor-title',
                    type: 'text',
                    content: 'REKTOR {universitas}',
                    fontSize: 12,
                    bold: true,
                    italic: false,
                    uppercase: true,
                    align: 'center',
                    lineHeight: 1.2,
                    marginBottom: 12,
                },
                {
                    id: 'sk-menimbang-label',
                    type: 'text',
                    content: 'Menimbang :',
                    fontSize: 11,
                    bold: true,
                    italic: false,
                    uppercase: false,
                    align: 'left',
                    lineHeight: 1.2,
                    marginBottom: 5,
                },
                {
                    id: 'sk-menimbang-list',
                    type: 'list',
                    items: [
                        'Bahwa untuk memperoleh pengakuan yang layak melalui {deskripsi_pengakuan};',
                        'Bahwa untuk mendorong motivasi dan kepercayaan diri untuk terus belajar sepanjang hayat;',
                        'Bahwa untuk peningkatan keterjangkauan dan keterjaminan akses memperoleh pendidikan tinggi;',
                        'Bahwa berdasarkan hasil {deskripsi_dasar_penilaian} dalam rangka penerimaan mahasiswa baru melalui Program Pendidikan Akademik S1 Jalur Rekognisi Pembelajaran Lampau (RPL) Skema {jenis_sk} Program Studi {program_studi} Semester {periode_format};',
                        'Bahwa berdasarkan pertimbangan pada butir 1, 2, 3 dan 4 di atas, perlu diterbitkan Keputusan Rektor tentang Penetapan Hasil Penilaian Pendidikan Akademik S1 Jalur Rekognisi Pembelajaran Lampau (RPL) Skema {jenis_sk} Atas Nama {nama} Program Studi {program_studi} {universitas} Semester {periode_format};',
                    ],
                    ordered: true,
                    fontSize: 11,
                    lineHeight: 1.4,
                    marginBottom: 10,
                },
                {
                    id: 'sk-mengingat-label',
                    type: 'text',
                    content: 'Mengingat :',
                    fontSize: 11,
                    bold: true,
                    italic: false,
                    uppercase: false,
                    align: 'left',
                    lineHeight: 1.2,
                    marginBottom: 5,
                },
                {
                    id: 'sk-mengingat-list',
                    type: 'list',
                    items: [
                        'Undang Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional',
                        'Undang Undang Nomor 12 Tahun 2012 tentang Pendidikan Tinggi',
                        'Peraturan Presiden Nomor 8 Tahun 2012 tentang Kerangka Kualifikasi Nasional Indonesia',
                        'Peraturan Menteri Pendidikan Tinggi, Sains dan Teknologi Nomor 39 Tahun 2025 tentang Penjaminan Mutu Pendidikan Tinggi.',
                        'Peraturan Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi Nomor 41 Tahun 2021 tentang Rekognisi Pembelajaran Lampau.',
                        'Keputusan Dirjen Dikti Kementerian Pendidikan Tinggi, Sains dan Teknologi Nomor 112/B/KPT/2025 tentang Petunjuk Teknis Rekognisi Pembelajaran Lampau pada Perguruan Tinggi yang Menyelenggarakan Pendidikan Akademik',
                        'Keputusan Rektor ITI No. 445/Kept-ITI/XII/2022 tentang Penetapan SOP Pelaksanaan Asesmen Jalur RPL Pendidikan Akademik di Lingkungan Institut Teknologi Indonesia',
                        'Keputusan Rektor No. 665/Kept-ITI/XII/2025 tentang Penetapan Penilai Pengakuan Mata Kuliah Pendidikan Akademik Jalur Rekognisi Pembelajaran Lampau (RPL) Institut Teknologi Indonesia',
                    ],
                    ordered: true,
                    fontSize: 11,
                    lineHeight: 1.4,
                    marginBottom: 0,
                },
            ],
        },
        {
            id: 'sk-halaman-2',
            name: 'Keputusan Rektor (Hal. 2)',
            placement: 'before_landscape',
            blocks: [
                {
                    id: 'sk-mengingat-list-2',
                    type: 'list',
                    items: [
                        'Keputusan Rektor No. 318R/Kept-ITI/VIII/2024 tentang Penetapan Tim Pengelola Rekognisi Pembelajaran Lampau (RPL) Pendidikan Akademik Institut Teknologi Indonesia',
                        'Keputusan Rektor No. 319/Kept-ITI/VIII/2024 tentang Penetapan Pedoman Penyelenggaraan Rekognisi Pembelajaran Lampau (RPL) Tipe A pada Pendidikan Akademik Institut Teknologi Indonesia',
                        'Keputusan Rektor No. 320R/Kept-ITI/VIII/2024 tentang Penetapan Dokumen Penilaian Rekognisi Pembelajaran Lampau (RPL) Pendidikan Akademik pada Program Studi di Lingkungan Institut Teknologi Indonesia',
                        'Surat Keputusan Yayasan Pengembangan Teknologi Indonesia Nomor 8/KEPT-PU/YPTI/III/2025 tentang Pengangkatan Pjs Rektor Institut Teknologi Indonesia',
                    ],
                    ordered: true,
                    fontSize: 11,
                    lineHeight: 1.4,
                    marginBottom: 10,
                },
                {
                    id: 'sk-memperhatikan-label',
                    type: 'text',
                    content: 'Memperhatikan :',
                    fontSize: 11,
                    bold: true,
                    italic: false,
                    uppercase: false,
                    align: 'left',
                    lineHeight: 1.2,
                    marginBottom: 5,
                },
                {
                    id: 'sk-memperhatikan-list',
                    type: 'list',
                    items: [
                        'Hasil Penilaian oleh Penilai dari Program Studi {program_studi} {universitas} tanggal {tanggal_sekarang}',
                    ],
                    ordered: true,
                    fontSize: 11,
                    lineHeight: 1.4,
                    marginBottom: 16,
                },
                {
                    id: 'sk-memutuskan',
                    type: 'text',
                    content: 'Memutuskan',
                    fontSize: 12,
                    bold: true,
                    italic: false,
                    uppercase: false,
                    align: 'center',
                    lineHeight: 1.2,
                    marginBottom: 12,
                },
                {
                    id: 'sk-menetapkan-label',
                    type: 'text',
                    content: 'Menetapkan :',
                    fontSize: 11,
                    bold: true,
                    italic: false,
                    uppercase: false,
                    align: 'left',
                    lineHeight: 1.2,
                    marginBottom: 5,
                },
                {
                    id: 'sk-menetapkan-list',
                    type: 'list',
                    items: [
                        'Hasil {deskripsi_menetapkan} Rekognisi Pembelajaran Lampau (RPL) skema {jenis_sk} atas nama {nama} pada Program Pendidikan Akademik S1 Program Studi {program_studi} {universitas}',
                        'Hasil penilaian terlampir bersama dengan Keputusan Rektor ini.',
                        'Hasil penilaian yang sudah dilaksanakan oleh penilai merupakan pengakuan sks dari {deskripsi_pengakuan_sks}',
                        'Mata kuliah yang wajib ditempuh pada Program Studi {program_studi} ITI terdapat pada kolom 10 dan 11 terlampir',
                    ],
                    ordered: true,
                    fontSize: 11,
                    lineHeight: 1.4,
                    marginBottom: 16,
                },
                {
                    id: 'sk-signature-place',
                    type: 'text',
                    content:
                        'Ditetapkan di Tangerang Selatan\nPada Tanggal {tanggal_sekarang}',
                    fontSize: 11,
                    bold: false,
                    italic: false,
                    uppercase: false,
                    align: 'right',
                    lineHeight: 1.4,
                    marginBottom: 50,
                },
                {
                    id: 'sk-signature-name',
                    type: 'text',
                    content: '({rektor})',
                    fontSize: 11,
                    bold: false,
                    italic: false,
                    uppercase: false,
                    align: 'right',
                    lineHeight: 1.2,
                    marginBottom: 20,
                },
                {
                    id: 'sk-tembusan-label',
                    type: 'text',
                    content: 'Tembusan',
                    fontSize: 11,
                    bold: false,
                    italic: false,
                    uppercase: false,
                    align: 'left',
                    lineHeight: 1.2,
                    marginBottom: 5,
                },
                {
                    id: 'sk-tembusan-list',
                    type: 'list',
                    items: [
                        'Warek Akademik, Penelitian dan Kemahasiswaan',
                        'Ka. SPMI',
                        'Pjs. Ka. Bag Pusat Pelayanan Akademik',
                        'Ka. Sub. Bag Data dan Sistem Informasi',
                        'Ka. PPMB',
                        'Ka. Prodi {program_studi}',
                    ],
                    ordered: false,
                    fontSize: 11,
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

const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) return '-'
    const value = new Date(date)
    if (Number.isNaN(value.getTime())) return '-'
    return `${value.getDate()} ${months[value.getMonth()]} ${value.getFullYear()}`
}

const formatPeriode = (periode: string): string => {
    const parts = periode.trim().split(' ')
    if (parts.length >= 2) {
        const tahun = parts[0]
        const semester = parts.slice(1).join(' ')
        return `${semester} ${tahun}`
    }
    return periode
}

/**
 * Resolve conditional text based on the SK type.
 *
 * Transfer Kredit → texts referencing transcript-based recognition
 * Perolehan Kredit → texts referencing portfolio/assessment-based recognition
 */
function resolveConditionalValues(jenisSk: string): {
    deskripsi_pengakuan: string
    deskripsi_dasar_penilaian: string
    deskripsi_menetapkan: string
    deskripsi_pengakuan_sks: string
} {
    const isTransfer = jenisSk.toUpperCase().includes('TRANSFER')

    return {
        deskripsi_pengakuan: isTransfer
            ? 'penyesuaian sub Capaian Pembelajaran Mata Kuliah yang diperoleh dari pendidikan formal sebelumnya'
            : 'capaian pembelajaran yang diperoleh dari pendidikan formal, nonformal, informal dan / atau pengalaman kerja',
        deskripsi_dasar_penilaian: isTransfer
            ? 'check equivalence dari transkrip akademik pendidikan formal sebelumnya'
            : 'verifikasi dan validasi oleh penilai atas penilaian mandiri mahasiswa',
        deskripsi_menetapkan: isTransfer
            ? 'penilaian Pendidikan Akademik S1 Jalur'
            : 'verifikasi dan validasi atas penilaian mandiri',
        deskripsi_pengakuan_sks: isTransfer
            ? 'sub Capaian Pembelajaran Mata Kuliah yang diperoleh dari pendidikan formal sebelumnya'
            : 'capaian pembelajaran yang diperoleh dari pendidikan formal, nonformal, informal dan / atau pengalaman kerja',
    }
}

export function getSkHasilPlaceholderValues(
    data: GenerateSkType,
    nomorSk: string,
    jenisSk: string,
    now = new Date()
): Record<string, string> {
    const rektor =
        data.Universitas.UniversityJabatan?.find(
            (j) =>
                j.NamaJabatan.toLowerCase().includes('rektor') &&
                !j.NamaJabatan.toLowerCase().includes('wakil')
        )?.Nama || '-'

    const conditional = resolveConditionalValues(jenisSk)

    return {
        nama: data.Nama || '-',
        tempat_lahir: data.TempatLahir || '-',
        tanggal_lahir: formatDate(data.TanggalLahir),
        tempat_tanggal_lahir: `${data.TempatLahir || '-'}, ${formatDate(data.TanggalLahir)}`,
        periode: data.Periode || '-',
        periode_format: formatPeriode(data.Periode || '-'),
        program_studi: data.ProgramStudi?.Nama || '-',
        universitas: data.Universitas?.Nama || '-',
        alamat_universitas: data.Universitas?.Alamat || '-',
        kode_pos_universitas: data.Universitas?.KodePos || '-',
        institusi_asal: data.InstitusiLama?.NamaInstitusi || '-',
        jurusan_asal: data.InstitusiLama?.Jurusan || '-',
        jenjang_asal: data.InstitusiLama?.Jenjang || '-',
        nisn: data.InstitusiLama?.Nisn || '-',
        nomor_sk: nomorSk || '-',
        jenis_sk: jenisSk || '-',
        rektor,
        ...conditional,
        tanggal_sekarang: formatDate(now),
        bulan_tahun: `${months[now.getMonth()]} ${now.getFullYear()}`,
        tahun: String(now.getFullYear()),
    }
}

export const resolveSkHasilPlaceholders = resolveFormAssessmentPlaceholders

export function normalizeSkHasilTemplate(value: unknown) {
    return normalizeDocumentTemplate(
        value,
        ['before_landscape', 'after_landscape'],
        'before_landscape'
    )
}

export function cloneDefaultSkHasilTemplate(
    variant: SkHasilTemplateVariant = 'perolehan'
): FormAssessmentPortraitTemplate {
    const template = JSON.parse(
        JSON.stringify(DEFAULT_SK_HASIL_TEMPLATE)
    ) as FormAssessmentPortraitTemplate

    // Kedua varian sengaja menjadi object terpisah. Isi awal memakai struktur
    // dasar yang sama, tetapi selanjutnya dapat diedit dan berkembang sendiri.
    if (variant === 'transfer') {
        template.pages = template.pages.map((page) => ({
            ...page,
            id: `${page.id}-transfer`,
            name: page.name.replace('Keputusan Rektor', 'SK Transfer SKS'),
            blocks: page.blocks.map((block) => ({
                ...block,
                id: `${block.id}-transfer`,
            })),
        }))
    }

    return template
}
