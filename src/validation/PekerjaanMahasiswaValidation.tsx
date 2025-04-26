import { z } from 'zod'

export const MahasiswaRiwayatPekerjaanSkemaValidation = z.object({
    MahasiswaRiwayatPekerjaanId: z.string().optional(),
    PendaftaranId: z.string(),
    Nama: z.string().min(1, { message: 'Nama tidak boleh kosong' }),
    PosisiJabatan: z
        .string()
        .min(1, { message: 'Posisi jabatan tidak boleh kosong' }),
    Alamat: z.string().optional().nullable(),
    UraianTugas: z.string().optional().nullable(),
    MulaiBekerja: z.coerce.date({
        required_error: 'Tanggal mulai bekerja harus diisi',
    }),
    SelesaiBekerja: z.coerce.date().optional().nullable(),
    CreatedAt: z.date().optional().nullable(),
    UpdatedAt: z.date().optional().nullable(),
})

export type MahasiswaRiwayatPekerjaanFormValidation = z.infer<
    typeof MahasiswaRiwayatPekerjaanSkemaValidation
>
