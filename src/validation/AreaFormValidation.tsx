import { z } from 'zod'

export const CountryFormSkemaValidation = z.object({
    CountryId: z.string(),
    Nama: z.string().nonempty('Nama tidak boleh kosong'),
})

export type CountryFormValidation = z.infer<typeof CountryFormSkemaValidation>

export const ProvinsiFormSkemaValidation = z.object({
    ProvinsiId: z.string(),
    CountryId: z.string(),
    Nama: z.string().nonempty('Nama tidak boleh kosong'),
})

export type ProvinsiFormValidation = z.infer<typeof ProvinsiFormSkemaValidation>

export const KabupatenFormSkemaValidation = z.object({
    KabupatenId: z.string(),
    ProvinsiId: z.string(),
    Nama: z.string().nonempty('Nama tidak boleh kosong'),
})

export type KabupatenFormValidation = z.infer<
    typeof KabupatenFormSkemaValidation
>

export const KecamatanFormSkemaValidation = z.object({
    KecamatanId: z.string(),
    KabupatenId: z.string(),
    Nama: z.string().nonempty('Nama tidak boleh kosong'),
})

export type KecamatanFormValidation = z.infer<
    typeof KecamatanFormSkemaValidation
>

export const DesaFormSkemaValidation = z.object({
    DesaId: z.string(),
    KecamatanId: z.string(),
    Nama: z.string().nonempty('Nama tidak boleh kosong'),
})

export type DesaFormValidation = z.infer<typeof DesaFormSkemaValidation>
