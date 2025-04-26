import PendidikanMahasiswa from '@/components/kelengkapan-dokumen/PendidikanMahasiswa'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/provider/api'
import { getServerSession } from 'next-auth'
import React from 'react'

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

    return (
        <div className="w-full min-h-screen">
            <PendidikanMahasiswa dataMahasiswa={dataMahasiswa} />
        </div>
    )
}

export default Page
