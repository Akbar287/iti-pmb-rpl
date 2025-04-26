import { z } from 'zod'

export const PesantrenSkemaValidation = z.object({
    PesantrenId: z.string().optional(),
    PendaftaranId: z.string(),
    NamaPesantren: z.string().min(1, 'Nama Pesantren wajib diisi'),
    LamaPesantren: z.string().min(1, 'Lama Pesantren wajib diisi'),
})

export type PesantrenFormValidation = z.infer<typeof PesantrenSkemaValidation>
