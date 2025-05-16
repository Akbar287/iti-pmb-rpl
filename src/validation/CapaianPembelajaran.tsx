import { z } from 'zod'

export const CapaianPembelajaranSchemaValidation = z
    .object({
        CapaianPembelajaranId: z.string(),
        MataKuliahId: z.string(),
        Nama: z.string().nonempty('tidak boleh kosong'),
        Urutan: z.number().int(),
        Active: z.boolean(),
    })
    .strict()

export type CapaianPembelajaranFormValidation = z.infer<
    typeof CapaianPembelajaranSchemaValidation
>
