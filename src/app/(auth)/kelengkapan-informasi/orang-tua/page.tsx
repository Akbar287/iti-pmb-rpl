import React from 'react'
import { getSession } from 'next-auth/react'
import OrangTua from '@/components/kelengkapan-dokumen/OrangTua'
import { prisma } from '@/lib/prisma'
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

    return <OrangTua dataMahasiswa={dataMahasiswa} />
}

export default Page
