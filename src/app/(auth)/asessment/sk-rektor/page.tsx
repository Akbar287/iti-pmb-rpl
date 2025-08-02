import SkRektorAsessmenComponent from '@/components/asessment/SkRektorAsessmenComponent'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/provider/api'
import React from 'react'

const Page = async () => {
    const session = await getSession()
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
            <SkRektorAsessmenComponent dataServer={data} session={session} />
        </div>
    )
}

export default Page
