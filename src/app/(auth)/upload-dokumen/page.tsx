import React from 'react'
import { authOptions } from '@/provider/api'
import { prisma } from '@/lib/prisma'
import UploadDokumen from '@/components/upload-dokumen/UploadDokumen'
import { getServerSession } from 'next-auth'
import { StatusPerkawinan } from '@/generated/prisma'

export const revalidate = 60

const Page = async () => {
    const session = await getServerSession(authOptions)

    if (!session) {
        throw new Error('Unauthorized')
    }

    const dataMahasiswa = await prisma.statusMahasiswaAssesmentHistory.findMany(
        {
            where: {
                AND: [
                    {
                        Pendaftaran: {
                            Mahasiswa: { UserId: session?.user.id },
                        },
                    },
                    { Aktif: true },
                ],
            },
            select: {
                StatusMahasiswaAssesment: {
                    select: {
                        NamaStatus: true,
                    },
                },
                Pendaftaran: {
                    select: {
                        PendaftaranId: true,
                        KodePendaftar: true,
                        NoUjian: true,
                        Periode: true,
                        Mahasiswa: {
                            select: {
                                MahasiswaId: true,
                                StatusPerkawinan: true,
                            },
                        },
                    },
                },
            },
        }
    )

    // const dataMahasiswa = await prisma.mahasiswa.findMany({
    //     select: {
    //         MahasiswaId: true,
    //         StatusPerkawinan: true,
    //         Pendaftaran: {
    //             select: {
    //                 PendaftaranId: true,
    //                 KodePendaftar: true,
    //                 NoUjian: true,
    //                 Periode: true,
    //                 StatusMahasiswaAssesmentHistory: {
    //                     select: {
    //                         StatusMahasiswaAssesment: {
    //                             select: {},
    //                         },
    //                     },
    //                 },
    //             },
    //         },
    //     },
    //     where: {
    //         UserId: session?.user.id,
    //     },
    // })

    const res: {
        MahasiswaId: string
        StatusPerkawinan: StatusPerkawinan
        Status: string
        PendaftaranId: string
        KodePendaftar: string
        NoUjian: string
        Periode: string
    }[] = dataMahasiswa.map((item) => ({
        MahasiswaId: item.Pendaftaran.Mahasiswa.MahasiswaId,
        StatusPerkawinan: item.Pendaftaran.Mahasiswa.StatusPerkawinan,
        Status: item.StatusMahasiswaAssesment.NamaStatus,
        PendaftaranId: item.Pendaftaran.PendaftaranId,
        KodePendaftar: item.Pendaftaran.KodePendaftar,
        NoUjian: item.Pendaftaran.NoUjian,
        Periode: item.Pendaftaran.Periode,
    }))

    const jenisDokumen = await prisma.jenisDokumen.findMany()

    return (
        <UploadDokumen dataMahasiswa={res} jenisDokumenServer={jenisDokumen} />
    )
}

export default Page
