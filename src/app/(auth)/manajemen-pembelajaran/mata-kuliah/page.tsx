import MataKuliahComponent from '@/components/manajemen-pembelajaran/MataKuliahComponent'
import { prisma } from '@/lib/prisma'
import React from 'react'

const Page = async () => {
    const university = await prisma.university.findMany({
        select: {
            UniversityId: true,
            Nama: true,
            Akreditasi: true,
            ProgramStudi: {
                select: {
                    ProgramStudiId: true,
                    Nama: true,
                    Jenjang: true,
                    Akreditasi: true,
                },
            },
        },
    })
    return <MataKuliahComponent universityDataServer={university} />
}

export default Page
