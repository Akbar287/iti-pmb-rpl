import { z } from 'zod'

export const PelatihanProfesionalSkemaValidation = z.object({
    MahasiswaPelatihanProfessionalId: z.string().optional(),
    PendaftaranId: z.string(),
    NamaPelatihan: z.string().min(1, { message: 'Nama Pelatihan wajib diisi' }),
    Penyelenggara: z.string().min(1, { message: 'Penyelenggara wajib diisi' }),
    Mulai: z.date({ error: (issue) => issue.input === undefined ? 'Tanggal mulai wajib diisi' : '' }),
    Selesai: z.date().optional(),
})

export type PelatihanProfesionalFormValidation = z.infer<
    typeof PelatihanProfesionalSkemaValidation
>
