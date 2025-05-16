import { z } from 'zod'

export const JenisDokumenSkemaValidation = z.object({
    JenisDokumenId: z.string().optional(),
    Jenis: z.string().nonempty('tidak boleh kosong'),
    NomorDokumen: z.string().nonempty('Isi dengan Angka'),
    Keterangan: z.string().optional(),
})

export type JenisDokumenFormValidation = z.infer<
    typeof JenisDokumenSkemaValidation
>
