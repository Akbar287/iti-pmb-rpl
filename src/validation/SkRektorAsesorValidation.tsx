import { z } from 'zod'

const MAX_FILE_SIZE = 10 * 1024 * 1024 //10 MB
const ACCEPTED_FILE_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

export const SkRektorSkemaValidasi = z.object({
    data: z
        .instanceof(File, { message: 'Data SK harus berupa file.' })
        .refine((file) => file.size > 0, 'File tidak boleh kosong.')
        .refine(
            (file) => file.size <= MAX_FILE_SIZE,
            `Ukuran file maksimal adalah 5MB.`
        )
        .refine(
            (file) => ACCEPTED_FILE_TYPES.includes(file.type),
            'Format file tidak valid. Hanya .pdf, .jpg, atau .png yang diterima.'
        ),

    NamaSk: z
        .string({
            required_error: 'Nama SK tidak boleh kosong.',
        })
        .min(1, 'Nama SK tidak boleh kosong.'),

    TahunSk: z
        .string({
            required_error: 'Tahun SK tidak boleh kosong.',
        })
        .regex(/^\d{4}$/, 'Tahun SK harus berupa 4 digit angka.'),

    NomorSk: z
        .string({
            required_error: 'Nomor SK tidak boleh kosong.',
        })
        .min(1, 'Nomor SK tidak boleh kosong.'),
    ArrayRelation: z
        .array(z.string(), {
            required_error: 'Relasi tidak boleh kosong.',
        })
        .min(1, 'Pilih setidaknya satu relasi.'),
})

export type SkRektorSkemaValidasiTipe = z.infer<typeof SkRektorSkemaValidasi>
