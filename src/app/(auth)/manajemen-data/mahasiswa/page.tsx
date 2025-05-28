import ManajemenMahasiswaComponent from '@/components/manajemen-data/mahasiswa/ManajemenMahasiswa'
import { prisma } from '@/lib/prisma'
import React from 'react'

const Page = async () => {
    const countryDataServer = await prisma.country.findMany()
    const universityDataServer = await prisma.university.findMany({
        select: {
            UniversityId: true,
            Nama: true,
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
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Mahasiswa</h1>
            <ManajemenMahasiswaComponent
                countryDataServer={countryDataServer}
                universityDataServer={universityDataServer}
            />
        </div>
    )
}

export default Page
