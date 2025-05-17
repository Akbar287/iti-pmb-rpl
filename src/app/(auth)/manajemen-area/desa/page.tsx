import DesaComponent from '@/components/manajemen-area/DesaComponent'
import { prisma } from '@/lib/prisma'
import React from 'react'

const Page = async () => {
    const desaDataServer = await prisma.country.findMany({
        select: {
            CountryId: true,
            Nama: true,
            Provinsi: {
                select: {
                    ProvinsiId: true,
                    Nama: true,
                    Kabupaten: {
                        select: {
                            KabupatenId: true,
                            Nama: true,
                            Kecamatan: {
                                select: {
                                    KecamatanId: true,
                                    Nama: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    })
    return <DesaComponent desaDataServer={desaDataServer} />
}

export default Page
