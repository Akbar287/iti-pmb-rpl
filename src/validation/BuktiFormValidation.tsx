import { z } from 'zod'

export const BuktiFormSkemaValidation = z.object({
    BuktiFormId: z.string().optional(),
    JenisDokumenId: z.string(),
    NamaFile: z
        .any()
        .refine((file) => file instanceof File, {
            message: 'File wajib diunggah',
        })
        .refine((file) => file?.size <= 5 * 1024 * 1024, {
            message: 'Ukuran file maksimal 5MB',
        })
        .refine((file) => ['application/pdf'].includes(file?.type), {
            message: 'File harus berupa PDF',
        })
        .optional(),
})

export type BuktiFormFormValidation = z.infer<typeof BuktiFormSkemaValidation>
