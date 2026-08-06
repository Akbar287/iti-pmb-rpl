import React from 'react'
import PersetujuanSkAsesorComponent from '@/components/approval/PersetujuanSkAsesorComponent'

const Page = async () => {
    return (
        <div className="p-6">
            <h1 className="mb-4 text-2xl font-bold">
                Persetujuan SK Penugasan Asesor
            </h1>
            <PersetujuanSkAsesorComponent />
        </div>
    )
}

export default Page
