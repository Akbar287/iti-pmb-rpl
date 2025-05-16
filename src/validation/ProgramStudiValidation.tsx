import { z } from 'zod'

export const ProgramStudiSchemaValidation = z.object({
    ProgramStudiId: z.string(),
    UniversityId: z.string(),
    Nama: z.string().nonempty('Tidak boleh kosong'),
    Jenjang: z.string().optional(),
    Akreditasi: z.string().nonempty('Tidak boleh kosong'),
})

export type ProgramStudiFormValidation = z.infer<
    typeof ProgramStudiSchemaValidation
>
