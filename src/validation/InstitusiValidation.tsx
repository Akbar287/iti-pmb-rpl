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
