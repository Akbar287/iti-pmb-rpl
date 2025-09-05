import KomunitasComponent from '@/components/website/KomunitasComponent'
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

    return (
        <div className="p-6">
            <h1 className="mb-4 text-2xl font-bold">Komunitas</h1>
            <KomunitasComponent university={university} />
        </div>
    )
}

export default Page
