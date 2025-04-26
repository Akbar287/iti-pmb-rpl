import React from 'react'
import { prisma } from '@/lib/prisma'
import PelatihanProfesional from '@/components/kelengkapan-dokumen/PelatihanProfesional'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/provider/api'

export const revalidate = 60

const Page = async () => {
    const session = await getServerSession(authOptions)

    if (!session) {
        throw new Error('Unauthorized')
    }

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
