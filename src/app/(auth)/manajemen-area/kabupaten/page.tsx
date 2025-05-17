import KabupatenComponent from '@/components/manajemen-area/KabupatenComponent'
import { prisma } from '@/lib/prisma'
import React from 'react'

const Page = async () => {
    const kabupatenDataServer = await prisma.country.findMany({
        select: {
            CountryId: true,
            Nama: true,
            Provinsi: {
                select: {
                    ProvinsiId: true,
                    Nama: true,
                },
            },
        },
    })
    return <KabupatenComponent kabupatenDataServer={kabupatenDataServer} />
}

export default Page
