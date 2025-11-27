import PersetujuanAsesorComponent from '@/components/approval/PersetujuanAsesorComponent'
import React from 'react'

const Page = async () => {
    
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Persetujuan Asesor</h1>
            <PersetujuanAsesorComponent />
        </div>
    )
}

export default Page
