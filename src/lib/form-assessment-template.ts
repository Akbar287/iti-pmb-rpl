import {
    DocumentTemplatePlacement,
    FormAssessmentPortraitTemplate,
    FormAssessmentTemplateBlock,
    FormAssessmentTemplatePage,
    FormAssessmentTableCellAlign,
    FormAssessmentTextAlign,
} from '@/types/FormAssessmentTemplate'
import { GenerateFormAsessmenType } from '@/types/GeneratePdfTypes'

export const FORM_ASSESSMENT_TEMPLATE_TYPE = 'FORM_ASESSMEN'

export const FORM_ASSESSMENT_PLACEHOLDERS = [
    { key: 'kode_pendaftar', label: 'Kode pendaftar' },
    { key: 'periode', label: 'Periode pendaftaran' },
    { key: 'nama', label: 'Nama calon mahasiswa' },
    { key: 'tempat_lahir', label: 'Tempat lahir' },
    { key: 'tanggal_lahir', label: 'Tanggal lahir' },
    { key: 'tempat_tanggal_lahir', label: 'Tempat dan tanggal lahir' },
    { key: 'alamat', label: 'Alamat calon mahasiswa' },
    { key: 'nomor_hp', label: 'Nomor telepon/HP' },
    { key: 'email', label: 'Alamat email' },
    { key: 'program_studi', label: 'Program studi' },
    { key: 'universitas', label: 'Nama perguruan tinggi' },
    { key: 'alamat_universitas', label: 'Alamat perguruan tinggi' },
    { key: 'kode_pos_universitas', label: 'Kode pos perguruan tinggi' },
    { key: 'asesor_1', label: 'Nama asesor/penilai 1' },
    { key: 'asesor_2', label: 'Nama asesor/penilai 2' },
    { key: 'tanggal_sekarang', label: 'Tanggal cetak' },
    { key: 'bulan_tahun', label: 'Bulan dan tahun cetak' },
    { key: 'tahun', label: 'Tahun cetak' },
] as const

const evidenceItems = [
    'Ijazah dan/atau Transkrip Nilai dari Mata Kuliah yang pernah ditempuh di jenjang Pendidikan Tinggi sebelumnya (khusus untuk transfer sks);',
    'Daftar Riwayat pekerjaan dengan rincian tugas yang dilakukan;',
    'Sertifikat Kompetensi;',
    'Sertifikat pengoperasian/lisensi yang sesuai dengan jabatan kerja dimiliki;',
    'Foto pekerjaan yang pernah dilakukan dan deskripsi pekerjaan;',
    'Buku harian;',
    'Lembar tugas/lembar kerja ketika bekerja di perusahaan;',
    'Dokumen analisis/perancangan (parsial atau lengkap) ketika bekerja di perusahaan;',
    'Logbook;',
    'Catatan pelatihan di lokasi tempat kerja;',
    'Keanggotaan asosiasi profesi yang relevan;',
    'Referensi/surat keterangan/laporan verifikasi pihak ketiga dari pemberi kerja/supervisor;',
    'Penghargaan dari industri; dan',
    'Penilaian kinerja dari perusahaan;',
    'Dokumen lain yang relevan.',
]

const principleItems = [
    'Valid/Sahih: ada hubungan yang jelas antara persyaratan bukti dari unit kompetensi/mata kuliah yang akan dinilai dengan bukti yang menjadi dasar penilaian;',
    'Autentik/Asli: dapat dibuktikan bahwa buktinya adalah karya calon sendiri;',
    'Terkini: bukti menunjukkan pengetahuan dan keterampilan kandidat saat ini;',
    'Memadai/Cukup: kriteria mengacu kepada kriteria unjuk kerja dan panduan bukti, semua dimensi kompetensi, serta konteks yang berbeda.',
]

const termItems = [
    'Semua informasi yang saya tuliskan adalah sepenuhnya benar dan saya bertanggung jawab atas seluruh data dalam formulir ini. Apabila di kemudian hari ternyata informasi tersebut tidak benar, saya bersedia menerima sanksi sesuai ketentuan yang berlaku;',
    'Saya memberikan izin kepada pihak pengelola program RPL untuk melakukan pemeriksaan kebenaran informasi yang saya berikan kepada pihak yang terkait dengan data akademik dan pekerjaan saya;',
    'Saya bersedia mengikuti asesmen lanjutan untuk membuktikan kompetensi saya sesuai waktu dan tempat/platform daring yang ditentukan oleh unit RPL.',
]

export const DEFAULT_FORM_ASSESSMENT_TEMPLATE: FormAssessmentPortraitTemplate = {
    version: 1,
    pages: [
        {
            id: 'cover',
            name: 'Sampul',
            placement: 'before_landscape',
            blocks: [
                {
                    id: 'cover-number',
                    type: 'text',
                    content: 'Form (03)',
                    fontSize: 11,
                    bold: true,
                    italic: false,
                    uppercase: false,
                    align: 'right',
                    lineHeight: 1.2,
                    marginBottom: 60,
                },
                {
                    id: 'cover-university',
                    type: 'text',
                    content: '{universitas}',
                    fontSize: 16,
                    bold: true,
                    italic: false,
                    uppercase: true,
                    align: 'center',
                    lineHeight: 1.2,
                    marginBottom: 8,
                },
                {
                    id: 'cover-program',
                    type: 'text',
                    content: 'Program Studi {program_studi}',
                    fontSize: 12,
                    bold: true,
                    italic: false,
                    uppercase: false,
                    align: 'center',
                    lineHeight: 1.2,
                    marginBottom: 70,
                },
                {
                    id: 'cover-logo',
                    type: 'logo',
                    width: 120,
                    height: 120,
                    align: 'center',
                    marginBottom: 70,
                },
                {
                    id: 'cover-title',
                    type: 'text',
                    content:
                        'FORMULIR EVALUASI DIRI CALON MAHASISWA\nREKOGNISI PEMBELAJARAN LAMPAU (RPL)',
                    fontSize: 13,
                    bold: true,
                    italic: false,
                    uppercase: false,
                    align: 'center',
                    lineHeight: 1.2,
                    marginBottom: 32,
                },
                {
                    id: 'cover-place',
                    type: 'text',
                    content: 'Tangerang Selatan\n{bulan_tahun}',
                    fontSize: 11,
                    bold: true,
                    italic: false,
                    uppercase: false,
                    align: 'center',
                    lineHeight: 1.2,
                    marginBottom: 0,
                },
            ],
        },
        {
            id: 'identity',
            name: 'Identitas dan Petunjuk',
            placement: 'before_landscape',
            blocks: [
                {
                    id: 'identity-form',
                    type: 'text',
                    content: 'Formulir Evaluasi Diri (Form 03)',
                    fontSize: 12,
                    bold: false,
                    italic: false,
                    uppercase: false,
                    align: 'left',
                    lineHeight: 1.4,
                    marginBottom: 10,
                },
                {
                    id: 'identity-title',
                    type: 'text',
                    content: 'FORMULIR EVALUASI DIRI',
                    fontSize: 12,
                    bold: true,
                    italic: false,
                    uppercase: false,
                    align: 'center',
                    lineHeight: 1.2,
                    marginBottom: 16,
                },
                {
                    id: 'identity-data',
                    type: 'key_value',
                    rows: [
                        { label: 'NAMA PERGURUAN TINGGI', value: '{universitas}' },
                        { label: 'PROGRAM STUDI', value: '{program_studi}' },
                        { label: 'Nama Calon', value: '{nama}' },
                        { label: 'Tempat/Tgl lahir', value: '{tempat_tanggal_lahir}' },
                        { label: 'Alamat', value: '{alamat}' },
                        { label: 'Nomor Telepon/HP', value: '{nomor_hp}' },
                        { label: 'Alamat Email', value: '{email}' },
                    ],
                    fontSize: 12,
                    labelWidth: 35,
                    marginBottom: 10,
                },
                {
                    id: 'identity-instruction',
                    type: 'text',
                    content:
                        'Isilah setiap kriteria unjuk kerja atau capaian pembelajaran pada halaman-halaman berikut sesuai dengan tingkat profisiensi yang Saudara miliki. Saudara harus jujur dalam melakukan penilaian ini.',
                    fontSize: 12,
                    bold: false,
                    italic: false,
                    uppercase: false,
                    align: 'justify',
                    lineHeight: 1.4,
                    marginBottom: 10,
                },
                {
                    id: 'identity-note',
                    type: 'text',
                    content:
                        'Catatan: Jika Saudara yakin dengan kemampuan atas pencapaian profisiensi yang dideskripsikan, lampirkan bukti yang valid, autentik, terkini, dan memadai untuk mendukung klaim tersebut.',
                    fontSize: 12,
                    bold: false,
                    italic: false,
                    uppercase: false,
                    align: 'justify',
                    lineHeight: 1.4,
                    marginBottom: 10,
                },
                {
                    id: 'identity-level-intro',
                    type: 'text',
                    content:
                        'Identifikasi tingkat profisiensi pencapaian Saudara dengan menggunakan jawaban berikut:',
                    fontSize: 12,
                    bold: false,
                    italic: false,
                    uppercase: false,
                    align: 'justify',
                    lineHeight: 1.4,
                    marginBottom: 8,
                },
                {
                    id: 'identity-levels',
                    type: 'table',
                    showBorders: true,
                    headers: ['Profisiensi/kemampuan', 'Uraian'],
                    headerAlignments: ['center', 'center'],
                    rows: [
                        {
                            values: [
                                'Sangat baik',
                                'Saya melakukan tugas atau menguasai bahan kajian ini dengan sangat baik.\nSaya selalu menggunakan keterampilan ini dengan tepat tanpa kesalahan.',
                            ],
                            alignments: ['center', 'left'],
                        },
                        {
                            values: [
                                'Baik',
                                'Saya melakukan tugas atau menguasai bahan kajian ini dengan baik.\nSaya memiliki keterampilan ini dan kadang-kadang menggunakannya dalam pekerjaan.',
                            ],
                            alignments: ['center', 'left'],
                        },
                        {
                            values: [
                                'Tidak pernah',
                                'Saya tidak pernah melakukan tugas atau tidak menguasai bahan kajian ini.\nSaya tidak memiliki keterampilan ini.',
                            ],
                            alignments: ['center', 'left'],
                        },
                    ],
                    fontSize: 11,
                    columnWidths: [30, 70],
                    marginBottom: 10,
                },
                {
                    id: 'identity-evidence-intro',
                    type: 'text',
                    content:
                        'Bukti yang dapat digunakan untuk mendukung klaim Saudara antara lain:',
                    fontSize: 12,
                    bold: false,
                    italic: false,
                    uppercase: false,
                    align: 'justify',
                    lineHeight: 1.4,
                    marginBottom: 5,
                },
                {
                    id: 'identity-evidence',
                    type: 'list',
                    items: evidenceItems,
                    ordered: true,
                    fontSize: 11,
                    lineHeight: 1.25,
                    marginBottom: 10,
                },
                {
                    id: 'identity-principle-intro',
                    type: 'text',
                    content:
                        'Bukti (portofolio) akan diverifikasi dan divalidasi oleh Asesor sesuai prinsip berikut:',
                    fontSize: 12,
                    bold: false,
                    italic: false,
                    uppercase: false,
                    align: 'justify',
                    lineHeight: 1.4,
                    marginBottom: 5,
                },
                {
                    id: 'identity-principles',
                    type: 'list',
                    items: principleItems,
                    ordered: false,
                    fontSize: 11,
                    lineHeight: 1.25,
                    marginBottom: 0,
                },
            ],
        },
        {
            id: 'closing',
            name: 'Pernyataan Penutup',
            placement: 'after_landscape',
            blocks: [
                {
                    id: 'closing-note',
                    type: 'text',
                    content:
                        'Keterangan:\nKolom 1 diisi oleh Program Studi berupa capaian pembelajaran mata kuliah.\nKolom 2 diisi oleh calon mahasiswa sesuai tingkat profisiensi yang dikuasainya.\nKolom 3 diisi oleh Asesor setelah calon melampirkan bukti portofolio.\nKolom 4 berisi nomor urut bukti portofolio.\nKolom 5 berisi jenis bukti portofolio dan dapat digunakan untuk mendukung beberapa capaian pembelajaran.',
                    fontSize: 12,
                    bold: false,
                    italic: false,
                    uppercase: false,
                    align: 'justify',
                    lineHeight: 1.4,
                    marginBottom: 30,
                },
                {
                    id: 'closing-intro',
                    type: 'text',
                    content:
                        'Saya telah membaca dan mengisi Formulir Evaluasi Diri ini untuk mengikuti asesmen RPL dan dengan ini saya menyatakan:',
                    fontSize: 12,
                    bold: false,
                    italic: false,
                    uppercase: false,
                    align: 'justify',
                    lineHeight: 1.4,
                    marginBottom: 6,
                },
                {
                    id: 'closing-terms',
                    type: 'list',
                    items: termItems,
                    ordered: true,
                    fontSize: 12,
                    lineHeight: 1.4,
                    marginBottom: 16,
                },
                {
                    id: 'closing-signature-place',
                    type: 'text',
                    content:
                        'Tangerang Selatan, {tanggal_sekarang}\nTanda Tangan Calon Mahasiswa',
                    fontSize: 10,
                    bold: false,
                    italic: false,
                    uppercase: false,
                    align: 'right',
                    lineHeight: 1.4,
                    marginBottom: 54,
                },
                {
                    id: 'closing-signature-name',
                    type: 'text',
                    content: '({nama})',
                    fontSize: 10,
                    bold: false,
                    italic: false,
                    uppercase: false,
                    align: 'right',
                    lineHeight: 1.2,
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

export function getFormAssessmentPlaceholderValues(
    data: GenerateFormAsessmenType,
    now = new Date()
): Record<string, string> {
    const birthDate = formatDate(data.TanggalLahir)
    const birthPlace = data.TempatLahir || '-'
    const assessor = (order: number) =>
        data.Asesor?.find((item) => item.Urutan === order)?.Nama || '-'

    return {
        kode_pendaftar: data.KodePendaftar || '-',
        periode: data.Periode || '-',
        nama: data.Nama || '-',
        tempat_lahir: birthPlace,
        tanggal_lahir: birthDate,
        tempat_tanggal_lahir: `${birthPlace}, ${birthDate}`,
        alamat: data.Alamat || '-',
        nomor_hp: data.NomorHp || '-',
        email: data.Email || '-',
        program_studi: data.ProgramStudi?.Nama || '-',
        universitas: data.Universitas?.Nama || '-',
        alamat_universitas: data.Universitas?.Alamat || '-',
        kode_pos_universitas: data.Universitas?.KodePos || '-',
        asesor_1: assessor(1),
        asesor_2: assessor(2),
        tanggal_sekarang: formatDate(now),
        bulan_tahun: `${months[now.getMonth()]} ${now.getFullYear()}`,
        tahun: String(now.getFullYear()),
    }
}

export function resolveFormAssessmentPlaceholders(
    value: string,
    values: Record<string, string>
): string {
    return value.replace(/\{([^{}]+)\}/g, (match, key: string) => {
        const normalizedKey = key.trim().toLowerCase().replace(/\s+/g, '_')
        return values[normalizedKey] ?? match
    })
}

const numberInRange = (
    value: unknown,
    fallback: number,
    min: number,
    max: number
) => {
    const number = typeof value === 'number' ? value : Number(value)
    return Number.isFinite(number) ? Math.min(Math.max(number, min), max) : fallback
}

const text = (value: unknown, fallback = '', maxLength = 10000) =>
    typeof value === 'string' ? value.slice(0, maxLength) : fallback

const alignment = (
    value: unknown,
    fallback: FormAssessmentTextAlign = 'left'
): FormAssessmentTextAlign =>
    value === 'left' ||
    value === 'center' ||
    value === 'right' ||
    value === 'justify'
        ? value
        : fallback

function normalizeBlock(
    value: unknown,
    index: number
): FormAssessmentTemplateBlock | null {
    if (!value || typeof value !== 'object') return null
    const raw = value as Record<string, unknown>
    const base = {
        id: text(raw.id, `block-${index}`, 100),
        marginBottom: numberInRange(raw.marginBottom, 8, 0, 200),
    }

    if (raw.type === 'text') {
        return {
            ...base,
            type: 'text',
            content: text(raw.content),
            fontSize: numberInRange(raw.fontSize, 12, 6, 36),
            bold: raw.bold === true,
            italic: raw.italic === true,
            uppercase: raw.uppercase === true,
            align: alignment(raw.align),
            lineHeight: numberInRange(raw.lineHeight, 1.4, 1, 3),
        }
    }

    if (raw.type === 'logo') {
        const logoAlign = alignment(raw.align, 'center')
        return {
            ...base,
            type: 'logo',
            width: numberInRange(raw.width, 120, 20, 300),
            height: numberInRange(raw.height, 120, 20, 300),
            align: logoAlign === 'justify' ? 'center' : logoAlign,
        }
    }

    if (raw.type === 'spacer') {
        return {
            ...base,
            type: 'spacer',
            height: numberInRange(raw.height, 20, 1, 300),
        }
    }

    if (raw.type === 'key_value') {
        const rows = Array.isArray(raw.rows)
            ? raw.rows.slice(0, 50).map((row) => {
                  const item =
                      row && typeof row === 'object'
                          ? (row as Record<string, unknown>)
                          : {}
                  return {
                      label: text(item.label, '', 500),
                      value: text(item.value, '', 2000),
                  }
              })
            : []
        return {
            ...base,
            type: 'key_value',
            rows,
            fontSize: numberInRange(raw.fontSize, 12, 6, 24),
            labelWidth: numberInRange(raw.labelWidth, 35, 15, 70),
        }
    }

    if (raw.type === 'list') {
        return {
            ...base,
            type: 'list',
            items: Array.isArray(raw.items)
                ? raw.items.slice(0, 100).map((item) => text(item, '', 3000))
                : [],
            ordered: raw.ordered === true,
            fontSize: numberInRange(raw.fontSize, 11, 6, 24),
            lineHeight: numberInRange(raw.lineHeight, 1.3, 1, 3),
        }
    }

    if (raw.type === 'table' || raw.type === 'table_three_columns') {
        const legacyColumnCount = raw.type === 'table_three_columns' ? 3 : 2
        const headers = Array.isArray(raw.headers)
            ? raw.headers
                  .slice(0, 10)
                  .map((header) => text(header, '', 500))
            : Array.from({ length: legacyColumnCount }, () => '')
        if (headers.length === 0) headers.push('')
        const columnCount = headers.length
        const cellAlignment = (
            value: unknown,
            fallback: FormAssessmentTableCellAlign
        ): FormAssessmentTableCellAlign =>
            value === 'left' || value === 'center' || value === 'right'
                ? value
                : fallback
        const rawHeaderAlignments = Array.isArray(raw.headerAlignments)
            ? raw.headerAlignments
            : []
        const headerAlignments = Array.from(
            { length: columnCount },
            (_, index) =>
                cellAlignment(rawHeaderAlignments[index], 'center')
        )
        const rows = Array.isArray(raw.rows)
            ? raw.rows.slice(0, 100).map((row) => {
                  const item =
                      row && typeof row === 'object'
                          ? (row as Record<string, unknown>)
                          : {}
                  const legacyValues =
                      'label' in item || 'value' in item
                          ? [item.label, item.value]
                          : []
                  const sourceValues = Array.isArray(item.values)
                      ? item.values
                      : legacyValues
                  const values = Array.from(
                      { length: columnCount },
                      (_, index) => text(sourceValues[index], '', 5000)
                  )
                  const rawAlignments = Array.isArray(item.alignments)
                      ? item.alignments
                      : []
                  return {
                      values,
                      alignments: Array.from(
                          { length: columnCount },
                          (_, index) =>
                              cellAlignment(rawAlignments[index], 'left')
                      ),
                  }
              })
            : []
        const legacyFirstWidth = numberInRange(
            raw.firstColumnWidth,
            50,
            5,
            95
        )
        const fallbackWidths =
            columnCount === 2
                ? [legacyFirstWidth, 100 - legacyFirstWidth]
                : Array.from({ length: columnCount }, () => 100 / columnCount)
        const rawWidths = Array.isArray(raw.columnWidths)
            ? raw.columnWidths.slice(0, columnCount)
            : fallbackWidths
        const positiveWidths = Array.from(
            { length: columnCount },
            (_, index) => numberInRange(rawWidths[index], 100 / columnCount, 1, 100)
        )
        const total = positiveWidths.reduce((sum, width) => sum + width, 0)

        return {
            ...base,
            type: 'table',
            showBorders: raw.showBorders !== false,
            headers,
            headerAlignments,
            rows,
            fontSize: numberInRange(raw.fontSize, 11, 6, 24),
            columnWidths: positiveWidths.map((width) => (width / total) * 100),
        }
    }

    return null
}

export function normalizeFormAssessmentTemplate(
    value: unknown
): FormAssessmentPortraitTemplate | null {
    return normalizeDocumentTemplate(
        value,
        ['before_landscape', 'after_landscape'],
        'before_landscape'
    )
}

export function normalizeDocumentTemplate(
    value: unknown,
    allowedPlacements: DocumentTemplatePlacement[],
    fallbackPlacement: DocumentTemplatePlacement
): FormAssessmentPortraitTemplate | null {
    if (!value || typeof value !== 'object') return null
    const raw = value as Record<string, unknown>
    if (!Array.isArray(raw.pages) || raw.pages.length === 0) return null

    const pages: FormAssessmentTemplatePage[] = raw.pages
        .slice(0, 10)
        .map((page, pageIndex) => {
            const item =
                page && typeof page === 'object'
                    ? (page as Record<string, unknown>)
                    : {}
            const blocks = Array.isArray(item.blocks)
                ? item.blocks
                      .slice(0, 100)
                      .map(normalizeBlock)
                      .filter(
                          (block): block is FormAssessmentTemplateBlock => !!block
                      )
                : []
            return {
                id: text(item.id, `page-${pageIndex + 1}`, 100),
                name: text(item.name, `Halaman ${pageIndex + 1}`, 100),
                placement: allowedPlacements.includes(
                    item.placement as DocumentTemplatePlacement
                )
                    ? (item.placement as DocumentTemplatePlacement)
                    : fallbackPlacement,
                blocks,
            }
        })

    return { version: 1, pages }
}

export function cloneDefaultFormAssessmentTemplate(): FormAssessmentPortraitTemplate {
    return JSON.parse(
        JSON.stringify(DEFAULT_FORM_ASSESSMENT_TEMPLATE)
    ) as FormAssessmentPortraitTemplate
}
