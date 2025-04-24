import React from 'react'
import { PrismaClient } from '@/generated/prisma'
import { getSession } from '@/provider/api'
import OrganisasiProfesi from '@/components/kelengkapan-dokumen/OrganisasiProfesi'

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

    return <OrganisasiProfesi dataMahasiswa={dataMahasiswa} />
}

export default Page
