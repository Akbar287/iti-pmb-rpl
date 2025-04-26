import { z } from 'zod'

export const InformasiKependudukanSkemaValidation = z.object({
    InformasiKependudukanId: z.string().optional(),
    PendaftaranId: z.string(),
    NoKk: z
        .string()
        .min(16, 'Nomor KK harus minimal 16 digit')
        .max(16, 'Nomor KK harus 16 digit'),
    NoNik: z
        .string()
        .min(16, 'Nomor NIK harus minimal 16 digit')
        .max(16, 'Nomor NIK harus 16 digit'),
    Suku: z.string().min(2, 'Nama suku harus diisi'),
})

export type InformasiKependudukanFormValidation = z.infer<
    typeof InformasiKependudukanSkemaValidation
>
