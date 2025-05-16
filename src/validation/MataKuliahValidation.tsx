import { z } from 'zod'

export const MataKuliahSchemaValidation = z.object({
    MataKuliahId: z.string(),
    ProgramStudiId: z.string(),
    Kode: z.string().nonempty('Tidak boleh kosong'),
    Nama: z.string().nonempty('Tidak boleh kosong'),
    Sks: z.number().int(),
    Semester: z.string().optional(),
    Silabus: z.string().optional(),
})

export type MataKuliahFormValidation = z.infer<
    typeof MataKuliahSchemaValidation
>
