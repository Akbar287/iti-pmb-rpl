import HomepageComponent from '@/components/website/HomepageComponent'
import { prisma } from '@/lib/prisma'
import React from 'react'

const Page = async () => {
    const university = await prisma.university.findMany()
    return (
        <div className="p-6">
            <h1 className="mb-4 text-2xl font-bold">Homepage</h1>
            <HomepageComponent university={university} />
        </div>
    )
}

export default Page
