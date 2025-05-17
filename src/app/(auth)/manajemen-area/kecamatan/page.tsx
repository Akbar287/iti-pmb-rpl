import KecamatanComponent from '@/components/manajemen-area/KecamatanComponent'
import { prisma } from '@/lib/prisma'
import React from 'react'

const Page = async () => {
    const kecamatanDataServer = await prisma.country.findMany({
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
                        },
                    },
                },
            },
        },
    })
    return <KecamatanComponent kecamatanDataServer={kecamatanDataServer} />
}

export default Page
