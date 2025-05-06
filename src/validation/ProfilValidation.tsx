import { z } from 'zod'

export const JenisKelaminEnum = z.enum(['PRIA', 'WANITA'])
export const JenjangEnum = z.enum([
    'TIDAK_TAMAT_SD',
    'SD',
    'SMP',
    'SMA',
    'D3',
    'S1',
    'S2',
    'S3',
])

export const UserCreateSkemaValidation = z.object({
    Nama: z.string().min(1, 'Nama tidak boleh kosong'),
    Email: z
        .string()
        .email('Email tidak valid')
        .nonempty('Email tidak boleh kosong'),
    TempatLahir: z.string().nonempty('Tempat Lahir tidakk boleh kosong'),
    TanggalLahir: z.coerce.date(),
    JenisKelamin: JenisKelaminEnum.default('PRIA').optional(),
    PendidikanTerakhir: JenjangEnum.default('TIDAK_TAMAT_SD').optional(),
    Avatar: z.string(),
    Agama: z.string(),
    Telepon: z.string(),
    NomorWa: z.string(),
    NomorHp: z.string(),
    Username: z
        .string()
        .nonempty('tidak boleh kosong')
        .min(8, 'Minimal Username 8 Karakter')
        .max(16, 'Maksimal 16 Karakter'),
    CountryId: z.string().nonempty('tidak boleh kosong'),
    ProvinsiId: z.string().nonempty('tidak boleh kosong'),
    KabupatenId: z.string().nonempty('tidak boleh kosong'),
    KecamatanId: z.string().nonempty('tidak boleh kosong'),
    DesaId: z.string().nonempty('tidak boleh kosong'),
    Alamat: z.string().nonempty('tidak boleh kosong'),
    KodePos: z
        .string()
        .min(5, 'Minimal 5 Karakter')
        .max(5, 'Maksimal 5 karakter'),
})

export type UserCreateFormValidation = z.infer<typeof UserCreateSkemaValidation>
