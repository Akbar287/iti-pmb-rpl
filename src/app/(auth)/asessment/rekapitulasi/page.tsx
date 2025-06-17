import RekapitulasiComponent from '@/components/rekapitulasi/RekapitulasiComponent'
import React from 'react'

const Page = async () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">
                Rekapitulasi Asessmen Mahasiswa
            </h1>
            <RekapitulasiComponent />
        </div>
    )
}

export default Page
