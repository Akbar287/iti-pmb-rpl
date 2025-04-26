import { z } from 'zod'

export const KejuaraanPiagamSkemaValidation = z.object({
    MahasiswaPiagamId: z.string().optional(),
    PendaftaranId: z.string(),
    Tahun: z.coerce
        .number()
        .int()
        .min(1900, { message: 'Tahun terlalu kecil' })
        .max(new Date().getFullYear(), {
            message: 'Tahun tidak boleh melebihi tahun ini',
        }),
    BentukPenghargaan: z
        .string()
        .min(1, { message: 'Bentuk Penghargaan wajib diisi' }),
    PemberiPenghargaan: z
        .string()
        .min(1, { message: 'Pemberi Penghargaan wajib diisi' }),
})

export type KejuaraanPiagamFormValidation = z.infer<
    typeof KejuaraanPiagamSkemaValidation
>
