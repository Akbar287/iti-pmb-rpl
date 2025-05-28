import JabatanOrangComponent from '@/components/manajemen-institusi/JabatanOrangComponent'
import { prisma } from '@/lib/prisma'
import React from 'react'

const Page = async () => {
    const universityDataServer = await prisma.university.findMany({
        select: {
            UniversityId: true,
            Nama: true,
            Akreditasi: true,
            UniversityJabatan: {
                select: {
                    UniversityJabatanId: true,
                    Nama: true,
                    Keterangan: true,
                },
            },
        },
    })
    return <JabatanOrangComponent universityData={universityDataServer} />
}

export default Page
