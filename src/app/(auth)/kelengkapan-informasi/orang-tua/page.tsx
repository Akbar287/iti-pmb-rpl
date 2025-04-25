import React from 'react'
import { PrismaClient } from '@/generated/prisma'
import { getSession } from 'next-auth/react'
import OrangTua from '@/components/kelengkapan-dokumen/OrangTua'
const Page = async () => {
    const prisma = new PrismaClient()
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
