import ProvinsiComponent from '@/components/manajemen-area/ProvinsiComponent'
import { prisma } from '@/lib/prisma'
import React from 'react'

const Page = async () => {
    const provinsiDataServer = await prisma.country.findMany({
        select: { CountryId: true, Nama: true },
    })
    return <ProvinsiComponent provinsiDataServer={provinsiDataServer} />
}

export default Page
