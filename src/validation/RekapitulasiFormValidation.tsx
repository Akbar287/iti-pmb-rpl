import { z } from 'zod'

export const SkorAssesmenSchemaValidation = z.object({
    SkorAssesmenId: z.string(),
    MataKuliahMahasiswaId: z.string(),
    Portofolio: z
        .number({ error: (issue) => issue.input === undefined ? "Skor Portofolio harus diisi" : 'Skor Portofolio harus angka.' })
        .min(0, 'Skor tidak boleh kurang dari 0.')
        .max(100, 'Skor tidak boleh lebih dari 100.'),
    Tulis: z
        .number({ error: (issue) => issue.input === undefined ? "Skor Tulis harus diisi" : 'Skor Tulis harus angka.' })
        .min(0, 'Skor tidak boleh kurang dari 0.')
        .max(100, 'Skor tidak boleh lebih dari 100.'),
    Wawancara: z
        .number({ error: (issue) => issue.input === undefined ? "Skor Wawancara harus diisi" : 'Skor Wawancara harus angka.' })
        .min(0, 'Skor tidak boleh kurang dari 0.')
        .max(100, 'Skor tidak boleh lebih dari 100.'),
    Demo: z
        .number({ error: (issue) => issue.input === undefined ? "Skor Demo harus diisi" : 'Skor Demo harus angka.' })
        .min(0, 'Skor tidak boleh kurang dari 0.')
        .max(100, 'Skor tidak boleh lebih dari 100.'),
    Diakui: z.boolean({ error: (issue) => issue.input === undefined ? "Status 'Diakui' harus ditentukan." : 'Status harus berupa pilihan' }),
    SkorRataRata: z
        .number({ error: (issue) => issue.input === undefined ? "Skor Rata-Rata harus diisi" : 'Skor Rata-Rata harus angka.' })
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
