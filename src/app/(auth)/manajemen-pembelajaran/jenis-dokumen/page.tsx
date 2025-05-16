import JenisDokumen from '@/components/manajemen-pembelajaran/JenisDokumenComponent'
import { prisma } from '@/lib/prisma'
import React from 'react'

const Page = async () => {
    const JenisDokumenServer = await prisma.jenisDokumen.findMany()
    return <JenisDokumen JenisDokumenServer={JenisDokumenServer} />
}

export default Page
