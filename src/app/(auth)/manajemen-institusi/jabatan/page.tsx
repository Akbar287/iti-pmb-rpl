import JabatanComponent from '@/components/manajemen-institusi/JabatanComponent'
import { prisma } from '@/lib/prisma'
import React from 'react'

const Page = async () => {
    const universityDataServer = await prisma.university.findMany()
    return <JabatanComponent universityData={universityDataServer} />
}

export default Page
