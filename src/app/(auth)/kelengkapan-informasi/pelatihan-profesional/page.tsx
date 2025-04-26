import React from 'react'
import { getSession } from 'next-auth/react'
import { prisma } from '@/lib/prisma'
import PelatihanProfesional from '@/components/kelengkapan-dokumen/PelatihanProfesional'

const Page = async () => {
    const session = await getSession()

    const dataMahasiswa = await prisma.mahasiswa.findMany({
        select: {
            MahasiswaId: true,
            StatusPerkawinan: true,
            Pendaftaran: {
                select: {
                    PendaftaranId: true,
                    KodePendaftar: true,
                    NoUjian: true,
                    Periode: true,
                },
            },
        },
        where: {
            UserId: session?.user.id,
        },
    })

    return <PelatihanProfesional dataMahasiswa={dataMahasiswa} />
}

export default Page
