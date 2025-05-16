import ProgramStudiComponent from '@/components/manajemen-pembelajaran/ProgramStudiComponent'
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
    return <ProgramStudiComponent universityDataServer={university} />
}

export default Page
