import React from 'react'
import { getSession } from '@/provider/api'
import { prisma } from '@/lib/prisma'
import EkuivalenCheck from '@/components/mata-kuliah/ekuivalen-check/EkuivalenCheck'

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

    return <EkuivalenCheck dataMahasiswa={dataMahasiswa} />
}

export default Page
