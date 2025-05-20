import { z } from 'zod'

export const UniversityFormSkemaValidation = z.object({
    UniversityId: z.string(),
    Nama: z.string().nonempty('Nama institusi tidak boleh kosong'),
    Akreditasi: z.string().nonempty('Akreditasi tidak boleh kosong'),
    AlamatId: z.string(),
    Alamat: z.string().nonempty('Alamat tidak boleh kosong'),
    KodePos: z.string().nonempty('Kode pos tidak boleh kosong'),
    DesaId: z.string().nonempty('Desa tidak boleh kosong'),
    NamaDesa: z.string(),
    KecamatanId: z.string().nonempty('Kecamatan tidak boleh kosong'),
    NamaKecamatan: z.string(),
    KabupatenId: z.string().nonempty('Kabupaten tidak boleh kosong'),
    NamaKabupaten: z.string(),
    ProvinsiId: z.string().nonempty('Provinsi tidak boleh kosong'),
    NamaProvinsi: z.string(),
    CountryId: z.string().nonempty('Negara tidak boleh kosong'),
    NamaCountry: z.string(),
})

export type UniversityFormValidation = z.infer<
    typeof UniversityFormSkemaValidation
>

const UniversityJabatanFormSkemaValidation = z.object({
    UniversityJabatanId: z.string(),
    UniversityId: z.string(),
    Nama: z.string(),
    Keterangan: z.string().nullable(),
})

export type UniversityJabatanFormValidation = z.infer<
    typeof UniversityJabatanFormSkemaValidation
>

export const UniversityJabatanOrangFormSkemaValidation = z.object({
    UniversityJabatanOrangId: z.string(),
    UniversityJabatanId: z.string(),
    Nama: z.string(),
    Keterangan: z.string().nullable(),
    CreatedAt: z.date().nullable(),
    UpdatedAt: z.date().nullable(),
    DeletedAt: z.date().nullable(),
})

export type UniversityJabatanOrangFormValidation = z.infer<
    typeof UniversityJabatanOrangFormSkemaValidation
>

export const UniversitySosialMediaFormSkemaValidation = z.object({
    UniversitySosialMediaId: z.string(),
    UniversityId: z.string(),
    Nama: z.string(),
    Username: z.string().nullable(),
    Icon: z.string().nullable(),
})

export type UniversitySosialMediaFormValidation = z.infer<
    typeof UniversitySosialMediaFormSkemaValidation
>
