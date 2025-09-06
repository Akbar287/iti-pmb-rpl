import KegiatanComponent from '@/components/website/KegiatanComponent'
import { prisma } from '@/lib/prisma'
import React from 'react'

const Page = async () => {
    const university = await prisma.university.findMany({
        select: {
            UniversityId: true,
            Nama: true,
            SettingMainPage: {
                select: {
                    SettingMainPageId: true,
                    TextMainPage2: true,
                },
            },
        },
    })

    const jenisKegiatan = await prisma.jenisKegiatan.findMany()
    return (
        <div className="p-6">
            <h1 className="mb-4 text-2xl font-bold">Kegiatan</h1>
            <KegiatanComponent
                jenisKegiatan={jenisKegiatan}
                university={university}
            />
        </div>
    )
}

export default Page
