import { z } from 'zod'

export const EkuivalenCheckSanggahanSchemaValidation = z.object({
    TranskripNilaiIdSebelum: z.string(),
    MataKuliahMahasiswaIdSebelum: z.string(),
    TranskripNilaiIdSetelah: z.string(),
    MataKuliahMahasiswaIdSetelah: z.string(),
    NilaiAsessment: z.string(),
    Diakui: z.boolean({ error: (issue) => issue.input === undefined ? "Status 'Diakui' harus ditentukan." : 'Status harus berupa pilihan' }),
})

export type EkuivalenCheckSanggahanFormValidation = z.infer<
    typeof EkuivalenCheckSanggahanSchemaValidation
>
