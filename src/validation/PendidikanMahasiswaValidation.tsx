import { z } from 'zod'

export const MahasiswaPendidikanSkemaValidation = z.object({
    PendaftaranId: z.string(),
    MahasiswaPendidikanId: z.string(),
    NamaSekolah: z.string().nonempty('Nama tidak boleh kosong'),
    TahunLulus: z
        .number()
        .min(1900, 'Tahun harus diatas 1900')
        .max(2050, 'Maksimal tahun 2050'),
    Jurusan: z.string().nonempty('Jurusan tidak boleh kosong'),
})

export type MahasiswaPendidikanFormValidation = z.infer<
    typeof MahasiswaPendidikanSkemaValidation
>
