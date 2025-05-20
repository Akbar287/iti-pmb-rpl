import { prisma } from '@/lib/prisma'
import React from 'react'

const Page = async () => {
    const universityDataServer = await prisma.university.findMany()
    return (
        <div>
            <h1>Manajemen Institusi - Jabatan</h1>
        </div>
    )
}

export default Page
