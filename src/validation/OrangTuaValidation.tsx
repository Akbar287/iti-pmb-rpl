import { z } from 'zod'

const JenisOrtu = z.enum(['AYAH', 'IBU', 'KAKEK', 'NENEK'])

export const OrangTuaSkemaValidation = z.object({
    OrangTuaId: z.string().optional(),
    PendaftaranId: z.string(),
    Nama: z.string().nonempty('Nama tidak boleh kosong'),
    Pekerjaan: z.string().optional(),
    JenisOrtu: JenisOrtu.default('AYAH').optional(),
    Penghasilan: z.string().nonempty('Penghasilan tidak boleh kosong'),
    Email: z.string().email('Format Email Salah'),
    NomorHp: z.string().min(6, 'Minimal 6 Nomor').max(16, 'Maksimal 16 Nomor'),
})

export type OrangTuaFormValidation = z.infer<typeof OrangTuaSkemaValidation>
