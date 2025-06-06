import React from 'react'
import { authOptions } from '@/provider/api'
import { prisma } from '@/lib/prisma'
import InformasiKependudukan from '@/components/kelengkapan-dokumen/InformasiKependudukan'
import { getServerSession } from 'next-auth'

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

    return <InformasiKependudukan dataMahasiswa={dataMahasiswa} />
}

export default Page
