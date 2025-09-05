import { z } from 'zod'

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ACCEPTED_FILE_TYPES = [
    'image/png',
    'image/jpeg',
    'image/webp',
] as const

const fileSchema = z
    .custom<File>((v) => typeof window !== 'undefined' && v instanceof File, {
        message: 'Harus berupa file.',
    })
    .refine((file) => file.size > 0, 'File tidak boleh kosong.')
    .refine(
        (file) => file.size <= MAX_FILE_SIZE,
        `Ukuran file maksimal adalah 10MB.`
    )
    .refine(
        (file) => ACCEPTED_FILE_TYPES.includes(file.type as any),
        'Format file tidak valid. Hanya PNG, JPG/JPEG, atau WebP.'
    )
    .nullable()

export const SettingMainPageSkemaValidasi = z.object({
    BackgroundFileUtama: fileSchema,
    SelayangPandangBackgroundFile: fileSchema,
    UniversityId: z.string().min(1, 'Id Universitas tidak boleh kosong'),
    SettingMainPageId: z
        .string()
        .min(1, 'Id SettingMainPage tidak boleh kosong'),
    TextMainPage1: z.string().min(1, 'Teks Utama 1 tidak boleh kosong'),
    TextMainPage2: z.string().min(1, 'Teks Utama 2 tidak boleh kosong'),
    TextMainPage3: z.string().min(1, 'Teks Utama 3 tidak boleh kosong'),
    SelayangPandangText: z
        .string()
        .min(1, 'Selayang Pandang Text tidak boleh kosong'),
    SelayangPandangDeskripsi: z
        .string()
        .min(1, 'Selayang Pandang Deskripsi tidak boleh kosong'),
    WhyText: z.string().min(1, 'Alasan Text tidak boleh kosong'),
    WhyDeskripsi: z.string().min(1, 'Alasan Deskripsi tidak boleh kosong'),
    CommunityText: z.string().min(1, 'Community Teks tidak boleh kosong'),
    CommunityDeskripsi: z
        .string()
        .min(1, 'Community Deskripsi tidak boleh kosong'),
    KegiatanText: z.string().min(1, 'Kegiatan Teks tidak boleh kosong'),
    KegiatanDeskripsi: z
        .string()
        .min(1, 'Kegiatan Deskripsi tidak boleh kosong'),
    BeritaText: z.string().min(1, 'Berita Teks tidak boleh kosong'),
    BeritaDeskripsi: z.string().min(1, 'Berita Deskripsi tidak boleh kosong'),
    TestomoniText: z.string().min(1, 'Testomoni Text tidak boleh kosong'),
    TestomoniDeskripsi: z
        .string()
        .min(1, 'Testomoni Deskripsi tidak boleh kosong'),
})

export type SettingMainPageFormValidation = z.infer<
    typeof SettingMainPageSkemaValidasi
>

export const SettingCommunitySkemaValidasi = z.object({
    Gambar: fileSchema,
    Title: z.string().min(1, 'Title tidak boleh kosong'),
    SettingMainPageId: z
        .string()
        .min(1, 'Id SettingMainPage tidak boleh kosong'),
    SettingCommunityId: z.string(),
})

export type SettingCommunityFormValidation = z.infer<
    typeof SettingCommunitySkemaValidasi
>

export const SettingTestimonySkemaValidasi = z.object({
    Foto: fileSchema,
    Nama: z.string().min(1, 'Nama tidak boleh kosong'),
    Jabatan: z.string().min(1, 'Jabatan tidak boleh kosong'),
    Testimoni: z.string().min(1, 'Testimoni tidak boleh kosong'),
    JurusanTahun: z.string().min(1, 'Jurusan dan Tahun tidak boleh kosong'),
    SettingMainPageId: z
        .string()
        .min(1, 'Id SettingMainPage tidak boleh kosong'),
    SettingTestimonyId: z.string(),
})

export type SettingTestimonyFormValidation = z.infer<
    typeof SettingTestimonySkemaValidasi
>

export const SettingNumberSkemaValidasi = z.object({
    Angka: z.string().min(1, 'Angka tidak boleh kosong'),
    Title: z.string().min(1, 'Title tidak boleh kosong'),
    Subtitle: z.string().min(1, 'Subtitle tidak boleh kosong'),
    SettingMainPageId: z
        .string()
        .min(1, 'Id SettingMainPage tidak boleh kosong'),
    SettingNumberId: z.string(),
})

export type SettingNumberFormValidation = z.infer<
    typeof SettingNumberSkemaValidasi
>

const MAX_SVG_BYTES = 100 * 1024
const DATA_URL_PREFIX = 'data:image/svg+xml;base64,'

function decodeBase64ToUtf8(b64: string): string {
    if (typeof Buffer !== 'undefined') {
        return Buffer.from(b64, 'base64').toString('utf-8')
    }
    return atob(b64)
}

export const SettingWhySkemaValidasi = z.object({
    Icon: z
        .string({ required_error: 'Icon tidak boleh kosong' })
        .refine((v) => v.startsWith(DATA_URL_PREFIX), {
            message: `Ikon harus berformat lengkap "${DATA_URL_PREFIX}<BASE64>"`,
        })
        .refine((v) => !/^\s|\s$/.test(v), {
            message: 'Ikon tidak boleh diawali/diakhiri spasi.',
        })
        .superRefine((val, ctx) => {
            const base64 = val.slice(DATA_URL_PREFIX.length)
            if (!base64) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Payload base64 kosong.',
                })
                return
            }
            const base64Regex = /^[A-Za-z0-9+/=\r\n]+$/
            if (!base64Regex.test(base64)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Base64 tidak valid.',
                })
                return
            }

            const pad = base64.match(/=*$/)?.[0].length ?? 0
            const approxBytes =
                Math.floor((base64.replace(/\s+/g, '').length * 3) / 4) - pad
            if (approxBytes <= 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Data ikon kosong.',
                })
                return
            }
            if (approxBytes > MAX_SVG_BYTES) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `Ukuran ikon maksimal ${Math.floor(
                        MAX_SVG_BYTES / 1024
                    )}KB.`,
                })
                return
            }

            let decoded = ''
            try {
                decoded = decodeBase64ToUtf8(base64.replace(/\s+/g, '')).trim()
            } catch {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Gagal mendekode base64.',
                })
                return
            }

            if (!/^<svg[\s\S]*<\/svg>\s*$/i.test(decoded)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Data bukan SVG yang valid.',
                })
                return
            }

            // Minimal sanitasi
            if (/<script[\s>]/i.test(decoded)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'SVG tidak boleh mengandung <script>.',
                })
            }
        }),
    Title: z.string().min(1, 'Title tidak boleh kosong'),
    Subtitle: z.string().min(1, 'Subtitle tidak boleh kosong'),
    SettingMainPageId: z
        .string()
        .min(1, 'Id SettingMainPage tidak boleh kosong'),
    SettingWhyId: z.string(),
})

export type SettingWhyFormValidation = z.infer<typeof SettingWhySkemaValidasi>
