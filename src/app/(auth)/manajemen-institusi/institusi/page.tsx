import InstitusiComponent from '@/components/manajemen-institusi/InstitusiComponent'
import { prisma } from '@/lib/prisma'
import { InstitusiResponseType } from '@/types/ManajemenInstitusiType'
import React from 'react'

const Page = async () => {
    const dataServer = await prisma.university.findMany({
        select: {
            UniversityId: true,
            Nama: true,
            Akreditasi: true,
            CreatedAt: true,
            UpdatedAt: true,
            DeletedAt: true,
            Alamat: {
                select: {
                    AlamatId: true,
                    Alamat: true,
                    KodePos: true,
                    Desa: {
                        select: {
                            DesaId: true,
                            KecamatanId: true,
                            Nama: true,
                            Kecamatan: {
                                select: {
                                    KecamatanId: true,
                                    Nama: true,
                                    Kabupaten: {
                                        select: {
                                            KabupatenId: true,
                                            Nama: true,
                                            Provinsi: {
                                                select: {
                                                    ProvinsiId: true,
                                                    Nama: true,
                                                    Country: {
                                                        select: {
                                                            CountryId: true,
                                                            Nama: true,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    })

    const countryServer = await prisma.country.findMany({
        select: {
            CountryId: true,
            Nama: true,
        },
    })

    const temp = dataServer.map((item) => ({
        UniversityId: item.UniversityId,
        Nama: item.Nama,
        Akreditasi: item.Akreditasi,
        CreatedAt: item.CreatedAt,
        UpdatedAt: item.UpdatedAt,
        DeletedAt: item.DeletedAt,
        AlamatId: item.Alamat.AlamatId,
        Alamat: item.Alamat.Alamat,
        KodePos: item.Alamat.KodePos,
        DesaId: item.Alamat.Desa.DesaId,
        NamaDesa: item.Alamat.Desa.Nama,
        KecamatanId: item.Alamat.Desa.Kecamatan.KecamatanId,
        NamaKecamatan: item.Alamat.Desa.Kecamatan.Nama,
        KabupatenId: item.Alamat.Desa.Kecamatan.Kabupaten.KabupatenId,
        NamaKabupaten: item.Alamat.Desa.Kecamatan.Kabupaten.Nama,
        ProvinsiId: item.Alamat.Desa.Kecamatan.Kabupaten.Provinsi.ProvinsiId,
        NamaProvinsi: item.Alamat.Desa.Kecamatan.Kabupaten.Provinsi.Nama,
        CountryId:
            item.Alamat.Desa.Kecamatan.Kabupaten.Provinsi.Country.CountryId,
        NamaCountry: item.Alamat.Desa.Kecamatan.Kabupaten.Provinsi.Country.Nama,
    })) as InstitusiResponseType[]

    return (
        <InstitusiComponent dataServer={temp} countryServer={countryServer} />
    )
}

export default Page
