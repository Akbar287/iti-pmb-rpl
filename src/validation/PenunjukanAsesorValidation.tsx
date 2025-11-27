import { z } from 'zod'

export const AsesorMahasiswaSkemaValidation = z.object({
    AsesorPertama: z.string(),
    AsesorKedua: z.string(),
    ProgramStudiId: z.string(),
    PendaftaranId: z.string(),
    KodePendaftar: z.string().min(1, 'Kode Pendaftar perlu diisi'),
    NamaProgramStudi: z.string().min(1, 'Nama Program Studi perlu diisi'),
    NamaMahasiswa: z.string().min(1, 'Nama Mahasiswa perlu diisi'),
})

export type AsesorMahasiswaFormValidation = z.infer<
    typeof AsesorMahasiswaSkemaValidation
>
