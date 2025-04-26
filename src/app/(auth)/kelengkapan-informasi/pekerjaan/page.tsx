import RiwayatPekerjaanMahasiswa from '@/components/kelengkapan-dokumen/PekerjaanMahasiswa'
import { prisma } from '@/lib/prisma'
import { getSession } from 'next-auth/react'
import React from 'react'

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

    return <RiwayatPekerjaanMahasiswa dataMahasiswa={dataMahasiswa} />
}

export default Page
