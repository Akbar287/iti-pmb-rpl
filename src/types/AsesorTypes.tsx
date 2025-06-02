import { JenisKelamin, Jenjang } from '@/generated/prisma'

export type AsesorRequestResponseDTO = {
    ProgramStudi: {
        ProgramStudiId: string
        UniversityId: string
        Nama: string
    }[]
    AsesorId: string
    Username: string
    Alamat: {
        AlamatId: string
        Alamat: string
        KodePos: string
        DesaId: string
        NamaDesa: string
        KecamatanId: string
        NamaKecamatan: string
        KabupatenId: string
        NamaKabupaten: string
        ProvinsiId: string
        NamaProvinsi: string
        CountryId: string
        NamaCountry: string
    }
    User: {
        UserId: string
        Nama: string
        Email: string
        TempatLahir: string
        TanggalLahir: Date | null
        JenisKelamin: JenisKelamin
        PendidikanTerakhir: Jenjang
        Avatar: string
        Agama: string
        Telepon: string
        NomorWa: string
        NomorHp: string
    }
    TipeAsesor: {
        TipeAsesorId: string
        Nama: string
        Icon: string
        Deskripsi: string
    }
    AsesorAkademik: {
        AsesorAkademikId: string
        Pangkat: string
        JabatanFungsionalAkademik: string
        NipNidn: string
        NamaPerguruanTinggi: string
        AlamatPerguruanTinggi: string | null
        PendidikanTerakhirBidangKeilmuan: string | null
        AsesorAkademikKeanggotaanAsosiasi: {
            AsesorAkademikKeanggotaanAsosiasiId: string
            AsesorAkademikId: string
            NamaAsosiasi: string
            NomorKeanggotaan: string
        }[]
    } | null
    AsesorPraktisi: {
        AsesorPraktisiId: string
        AsesorId: string
        NamaAsosiasi: string
        NomorKeanggotaan: string
        Jabatan: string
        AlamatKantor: string | null
        NamaInstansi: string
        JabatanInstansi: string
        BidangKeahlian: string
    } | null
}

export type AsesorPage = {
    UserId: string
    AsesorId: string
    Nama: string
    TipeAsesor: string
    Prodi: string
    PendidikanTerakhir: string
}
