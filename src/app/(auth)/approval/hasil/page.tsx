import PersetujuanHasil from '@/components/approval/PersetujuanHasil'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/provider/api'
import React from 'react'

const Page = async () => {
    const session = await getSession()
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
            <h1 className="text-2xl font-bold mb-4">Persetujuan Hasil Asessmen</h1>
            <PersetujuanHasil universityDataServer={universityDataServer} />
        </div>
    )
}

export default Page
