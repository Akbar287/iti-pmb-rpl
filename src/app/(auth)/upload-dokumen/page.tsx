import React from 'react'
import { getSession } from '@/provider/api'
import { prisma } from '@/lib/prisma'
import UploadDokumen from '@/components/upload-dokumen/UploadDokumen'

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

    const jenisDokumen = await prisma.jenisDokumen.findMany()

    return (
        <UploadDokumen
            dataMahasiswa={dataMahasiswa}
            jenisDokumenServer={jenisDokumen}
        />
    )
}

export default Page
