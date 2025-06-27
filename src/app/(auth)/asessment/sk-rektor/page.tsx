import SkRektorAsessmenComponent from '@/components/asessment/SkRektorAsessmenComponent'
import { prisma } from '@/lib/prisma'
import React from 'react'

const Page = async () => {
    const data = await prisma.university.findMany({
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
            <h1 className="text-2xl font-bold mb-4">Sk Rektor</h1>
            <SkRektorAsessmenComponent dataServer={data} />
        </div>
    )
}

export default Page
