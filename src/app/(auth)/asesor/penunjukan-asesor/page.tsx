import PenunjukanAsesorComponent from '@/components/asesor/PenunjukanAsesorComponent'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/provider/api'
import React from 'react'

const Page = async () => {
    const universityDataServer = await prisma.university.findMany({
        select: {
            UniversityId: true,
            Nama: true,
            ProgramStudi: {
                select: {
                    ProgramStudiId: true,
                    Nama: true,
                },
            },
        },
    })

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Penunjukan Asesor</h1>
            <PenunjukanAsesorComponent
                universityDataServer={universityDataServer}
            />
        </div>
    )
}

export default Page
