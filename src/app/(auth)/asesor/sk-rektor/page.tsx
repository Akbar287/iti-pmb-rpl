import SkRektorAsesorComponent from '@/components/asesor/SkRektorAsesorComponent'
import { getSession } from '@/provider/api'
import React from 'react'

const Page = async () => {
    const session = await getSession()
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">SK Asesor</h1>
            <SkRektorAsesorComponent session={session} />
        </div>
    )
}

export default Page
