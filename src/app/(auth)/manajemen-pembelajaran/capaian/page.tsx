import CapaianPembelajaranComponent from '@/components/manajemen-pembelajaran/CapaianPembelajaranComponent'
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
                    MataKuliah: {
                        select: {
                            MataKuliahId: true,
                            Nama: true,
                            Sks: true,
                            Kode: true,
                        },
                    },
                },
            },
        },
    })
    return <CapaianPembelajaranComponent universityDataServer={university} />
}

export default Page
