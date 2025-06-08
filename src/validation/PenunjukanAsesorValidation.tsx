import { z } from 'zod'

export const AsesorSkemaValidation = z.object({
    AssesorMahasiswaId: z.string(),
    AsesorId: z.string(),
    NamaTipeAsesor: z.string().min(1, 'Nama TipeAsesor perlu diisi'),
    NamaAsesor: z.string().min(1, 'Nama Asesor perlu diisi'),
    Urutan: z.number().min(0, 'Urutan dimulai dari 0'),
    Confirmation: z.boolean(),
})

export const AsesorMahasiswaSkemaValidation = z.object({
    Asesor: z.array(AsesorSkemaValidation),
    ProgramStudiId: z.string(),
    PendaftaranId: z.string(),
    KodePendaftar: z.string().min(1, 'Kode Pendaftar perlu diisi'),
    NamaProgramStudi: z.string().min(1, 'Nama Program Studi perlu diisi'),
    NamaMahasiswa: z.string().min(1, 'Nama Mahasiswa perlu diisi'),
})

export type AsesorMahasiswaFormValidation = z.infer<
    typeof AsesorMahasiswaSkemaValidation
>
