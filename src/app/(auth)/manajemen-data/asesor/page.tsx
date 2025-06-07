import ManajemenDataAsesor from '@/components/manajemen-data/asesor/ManajemenDataAsesor'
import { prisma } from '@/lib/prisma'
import React from 'react'

const Index = async () => {
    const countryDataServer = await prisma.country.findMany()
    const universitasDataServer = await prisma.university.findMany({
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

    const tipeAsesorDataServer = await prisma.tipeAsesor.findMany({
        select: {
            TipeAsesorId: true,
            Nama: true,
            Icon: true,
            Deskripsi: true,
        },
    })

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Asesor</h1>
            <ManajemenDataAsesor
                countryDataServer={countryDataServer}
                universitasDataServer={universitasDataServer}
                tipeAsesorDataServer={tipeAsesorDataServer}
            />
        </div>
    )
}

export default Index
