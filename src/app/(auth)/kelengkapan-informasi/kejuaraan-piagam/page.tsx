import React from 'react'
import { getSession } from '@/provider/api'
import { prisma } from '@/lib/prisma'
import KejuaraanPiagam from '@/components/kelengkapan-dokumen/KejuaraanPiagam'

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

    return <KejuaraanPiagam dataMahasiswa={dataMahasiswa} />
}

export default Page
