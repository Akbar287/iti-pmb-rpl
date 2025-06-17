import { z } from 'zod'

export const SkorAssesmenSchemaValidation = z.object({
    SkorAssesmenId: z.string(),
    MataKuliahMahasiswaId: z.string(),
    Portofolio: z
        .number({ invalid_type_error: 'Skor Portofolio harus angka.' })
        .min(0, 'Skor tidak boleh kurang dari 0.')
        .max(100, 'Skor tidak boleh lebih dari 100.'),
    Tulis: z
        .number({ invalid_type_error: 'Skor Tulis harus angka.' })
        .min(0, 'Skor tidak boleh kurang dari 0.')
        .max(100, 'Skor tidak boleh lebih dari 100.'),
    Wawancara: z
        .number({ invalid_type_error: 'Skor Wawancara harus angka.' })
        .min(0, 'Skor tidak boleh kurang dari 0.')
        .max(100, 'Skor tidak boleh lebih dari 100.'),
    Demo: z
        .number({ invalid_type_error: 'Skor Demo harus angka.' })
        .min(0, 'Skor tidak boleh kurang dari 0.')
        .max(100, 'Skor tidak boleh lebih dari 100.'),
    Diakui: z.boolean({ required_error: "Status 'Diakui' harus ditentukan." }),
    SkorRataRata: z
        .number({ invalid_type_error: 'Skor Rata-Rata harus angka.' })
        .min(0, 'Skor tidak boleh kurang dari 0.')
        .max(100, 'Skor tidak boleh lebih dari 100.'),
    NilaiHuruf: z
        .string()
        .min(1, 'Nilai Huruf tidak boleh string kosong.')
        .nullable(),
})

export type SkorAssesmenFormValidation = z.infer<
    typeof SkorAssesmenSchemaValidation
>
