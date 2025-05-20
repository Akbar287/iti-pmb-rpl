import SosialMediaComponent from '@/components/manajemen-institusi/SosialMediaComponent'
import { prisma } from '@/lib/prisma'
import React from 'react'

const Page = async () => {
    const universityDataServer = await prisma.university.findMany()
    return <SosialMediaComponent universityData={universityDataServer} />
}

export default Page
