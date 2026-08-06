import React from 'react'
import PersetujuanSkHasilComponent from '@/components/approval/PersetujuanSkHasilComponent'

const Page = async () => {
    return (
        <div className="p-6">
            <h1 className="mb-4 text-2xl font-bold">
                Persetujuan SK Hasil Asessmen
            </h1>
            <PersetujuanSkHasilComponent />
        </div>
    )
}

export default Page
