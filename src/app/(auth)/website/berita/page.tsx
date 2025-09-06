import BeritaComponent from '@/components/website/BeritaComponent'
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

    const kategoriBerita = await prisma.kategoriBerita.findMany()
    return (
        <div className="p-6">
            <h1 className="mb-4 text-2xl font-bold">Berita</h1>
            <BeritaComponent
                university={university}
                kategoriBerita={kategoriBerita}
            />
        </div>
    )
}

export default Page
