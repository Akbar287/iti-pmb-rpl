import InstitusiLama from '@/components/kelengkapan-dokumen/InstitusiLama'
import { prisma } from '@/lib/prisma'
import { getSession } from 'next-auth/react'
import React from 'react'

const Page = async () => {
    const session = await getSession()

    const countryData = await prisma.country.findMany()

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
        <InstitusiLama
            countryDataServer={countryData}
            dataMahasiswa={dataMahasiswa}
        />
    )
}

export default Page
