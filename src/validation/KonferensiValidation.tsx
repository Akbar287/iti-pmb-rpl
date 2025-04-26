import { z } from 'zod'

export const StatusKeikutsertaan = z.enum(['Peserta', 'Panitia', 'Pembicara'])

export const KonferensiSkemaValidation = z.object({
    MahasiswaKonferensiId: z.string().optional(),
    PendaftaranId: z.string(),
    Tahun: z.coerce
        .number()
        .int()
        .min(1900, { message: 'Tahun terlalu kecil' })
        .max(new Date().getFullYear(), {
            message: 'Tahun tidak boleh melebihi tahun ini',
        }),
    JudulSeminar: z.string().min(1, 'Judul seminar wajib diisi'),
    Penyelenggara: z.string().min(1, 'Penyelenggara wajib diisi'),
    StatusKeikutsertaan: StatusKeikutsertaan.optional(),
})

export type KonferensiFormValidation = z.infer<typeof KonferensiSkemaValidation>
