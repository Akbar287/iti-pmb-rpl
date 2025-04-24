import { z } from 'zod'

export const MahasiswaOrganisasiProfesiSkemaValidation = z.object({
    PendaftaranId: z.string(),
    MahasiswaOrganisasiProfesiId: z.string(),
    Tahun: z
        .number()
        .min(1900, 'Tahun harus diatas 1900')
        .max(2050, 'Maksimal tahun 2050'),
    NamaOrganisasi: z.string().nonempty('Nama tidak boleh kosong'),
    JenjangAnggotaJabatan: z
        .string()
        .nonempty('Jenjang Anggota Jabatan tidak boleh kosong'),
})

export type MahasiswaOrganisasiProfesiFormValidation = z.infer<
    typeof MahasiswaOrganisasiProfesiSkemaValidation
>
