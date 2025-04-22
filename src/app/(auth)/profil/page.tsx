import Profil from '@/components/auth/profil'
import { PrismaClient } from '@/generated/prisma'
import { getSession } from '@/provider/api'
import React from 'react'

const Page = async () => {
    const prisma = new PrismaClient()
    const session = await getSession()

    const data = await prisma.user.findFirst({
        where: {
            UserId: session?.user.id,
        },
        select: {
            Userlogin: {
                select: {
                    Username: true,
                },
            },
            UserId: true,
            Nama: true,
            Email: true,
            TempatLahir: true,
            TanggalLahir: true,
            JenisKelamin: true,
            PendidikanTerakhir: true,
            Avatar: true,
            Agama: true,
            Telepon: true,
            NomorWa: true,
            NomorHp: true,
            Alamat: {
                select: {
                    AlamatId: true,
                    Alamat: true,
                    KodePos: true,
                    Desa: {
                        select: {
                            DesaId: true,
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

    const countryDataServer = await prisma.country.findMany()
    const provinsiDataServer = await prisma.provinsi.findMany({
        where: {
            CountryId:
                data?.Alamat.Desa.Kecamatan.Kabupaten.Provinsi.Country
                    .CountryId,
        },
    })
    const kabupatenDataServer = await prisma.kabupaten.findMany({
        where: {
            ProvinsiId:
                data?.Alamat.Desa.Kecamatan.Kabupaten.Provinsi.ProvinsiId,
        },
    })

    const kecamatanDataServer = await prisma.kecamatan.findMany({
        where: {
            KabupatenId: data?.Alamat.Desa.Kecamatan.Kabupaten.KabupatenId,
        },
    })

    const desaDataServer = await prisma.desa.findMany({
        where: {
            KecamatanId: data?.Alamat.Desa.Kecamatan.KecamatanId,
        },
    })

    return (
        <Profil
            data={data}
            countryDataServer={countryDataServer}
            provinsiDataServer={provinsiDataServer}
            kabupatenDataServer={kabupatenDataServer}
            kecamatanDataServer={kecamatanDataServer}
            desaDataServer={desaDataServer}
        />
    )
}

export default Page
