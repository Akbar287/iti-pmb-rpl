import PendidikanMahasiswa from '@/components/kelengkapan-dokumen/PendidikanMahasiswa'
import { PrismaClient } from '@/generated/prisma'
import { getSession } from '@/provider/api'
import React from 'react'

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

    return (
        <div className="w-full min-h-screen">
            <PendidikanMahasiswa dataMahasiswa={dataMahasiswa} />
        </div>
    )
}

export default Page
