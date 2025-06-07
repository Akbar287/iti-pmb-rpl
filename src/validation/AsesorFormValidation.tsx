import { z } from 'zod'
import { JenisKelamin, Jenjang } from '@/generated/prisma'

const getEnumValues = <T extends Record<string, string>>(
    enumObject: T
): [string, ...string[]] => {
    const values = Object.values(enumObject)
    if (values.length === 0) {
        throw new Error(
            `Enum object ${Object.keys(enumObject)} cannot be empty.`
        )
    }
    return values as [string, ...string[]]
}

const ProgramStudiSchema = z.object({
    ProgramStudiId: z.string(),
    UniversityId: z.string(),
    NamaProgramStudi: z.string().min(1, 'Nama Program Studi is required'),
})

const AlamatSchema = z.object({
    AlamatId: z.string(),
    Alamat: z.string().min(1, 'Alamat is required'),
    KodePos: z
        .string()
        .min(1, 'Kode Pos is required')
        .regex(/^\d{5}$/, 'Kode Pos tidak valid'),
    DesaId: z.string().min(1, 'DesaId is required'),
    KecamatanId: z.string().min(1, 'KecamatanId is required'),
    KabupatenId: z.string().min(1, 'KabupatenId is required'),
    ProvinsiId: z.string().min(1, 'ProvinsiId is required'),
    CountryId: z.string().min(1, 'CountryId is required'),
})

const UserSchema = z.object({
    UserId: z.string(),
    Nama: z.string().min(1, 'Nama is required'),
    Email: z.string().email('Email tidak valid'),
    TempatLahir: z.string().min(1, 'Tempat Lahir is required'),
    TanggalLahir: z
        .date()
        .nullable()
        .refine((val) => val !== null, {
            message: 'Tanggal Lahir is required',
        }),
    JenisKelamin: z
        .enum(getEnumValues(JenisKelamin))
        .nullable()
        .refine((val) => val !== null, {
            message: 'Jenis Kelamin is required',
        }),
    PendidikanTerakhir: z
        .enum(getEnumValues(Jenjang))
        .nullable()
        .refine((val) => val !== null, {
            message: 'Pendidikan Terakhir is required',
        }),
    Agama: z.string().min(1, 'Agama is required'),
    Telepon: z
        .string()
        .min(1, 'Telepon is required')
        .regex(/^\+?[0-9\s-()]+$/, 'Nomor Telepon tidak valid'),
    NomorWa: z
        .string()
        .min(1, 'Nomor WA is required')
        .regex(/^\+?[0-9\s-()]+$/, 'Nomor WA tidak valid'),
    NomorHp: z
        .string()
        .min(1, 'Nomor HP is required')
        .regex(/^\+?[0-9\s-()]+$/, 'Nomor HP tidak valid'),
})

export const TipeAsesorSchema = z.object({
    TipeAsesorId: z.string(),
    Nama: z.string().min(1, 'Nama tidak boleh kosong'),
    Icon: z.string().nullable(),
    Deskripsi: z.string().nullable(),
})

export const AsesorAkademikKeanggotaanAsosiasiSchema = z.object({
    AsesorAkademikKeanggotaanAsosiasiId: z.string(),
    AsesorAkademikId: z.string(),
    NamaAsosiasi: z.string().min(1, 'Nama Asosiasi tidak boleh kosong'),
    NomorKeanggotaan: z.string().min(1, 'Nomor Keanggotaan tidak boleh kosong'),
})

export const AsesorAkademikSchema = z.object({
    AsesorAkademikId: z.string(),
    Pangkat: z.string(),
    JabatanFungsionalAkademik: z.string(),
    NipNidn: z.string(),
    NamaPerguruanTinggi: z.string(),
    AlamatPerguruanTinggi: z.string().nullable(),
    PendidikanTerakhirBidangKeilmuan: z.string().nullable(),
    AsesorAkademikKeanggotaanAsosiasi: z
        .array(AsesorAkademikKeanggotaanAsosiasiSchema)
        .nullable(),
})

export const AsesorPraktisiSchema = z.object({
    AsesorPraktisiId: z.string(),
    AsesorId: z.string(),
    NamaAsosiasi: z.string(),
    NomorKeanggotaan: z.string(),
    Jabatan: z.string(),
    AlamatKantor: z.string().nullable(),
    NamaInstansi: z.string(),
    JabatanInstansi: z.string(),
    BidangKeahlian: z.string(),
})

export const AsesorSchemaValidation = z
    .object({
        programStudi: z.array(ProgramStudiSchema).nullable(),
        alamat: AlamatSchema,
        user: UserSchema,
        asesorId: z.string(),
        username: z.string().min(1, 'Username Wajib diisi'),
        tipeAsesor: TipeAsesorSchema,
        asesorAkademik: AsesorAkademikSchema.nullable(),
        asesorPraktisi: AsesorPraktisiSchema.nullable(),
    })
    .superRefine((data, ctx) => {
        // Condition 1: If TipeAsesor is 'Asesor Akademik'
        if (data.tipeAsesor.Nama === 'Asesor Akademik') {
            // Check if asesorAkademik data is provided. If not, add an error.
            if (!data.asesorAkademik) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    // Path to the field that will receive the error
                    path: ['asesorAkademik'],
                    // Error message
                    message: 'Detail Asesor Akademik wajib diisi.',
                })
            }
        }

        // Condition 2: If TipeAsesor is 'Asesor Praktisi'
        if (data.tipeAsesor.Nama === 'Asesor Praktisi') {
            // Check if asesorPraktisi data is provided. If not, add an error.
            if (!data.asesorPraktisi) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    // Path to the field that will receive the error
                    path: ['asesorPraktisi'],
                    // Error message
                    message: 'Detail Asesor Praktisi wajib diisi.',
                })
            }
        }
    })

export type AsesorFormValidation = z.infer<typeof AsesorSchemaValidation>
