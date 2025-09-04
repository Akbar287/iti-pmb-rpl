import KomunitasComponent from '@/components/website/KomunitasComponent'
import React from 'react'

const Page = async () => {
    return (
        <div className="p-6">
            <h1 className="mb-4 text-2xl font-bold">Komunitas</h1>
            <KomunitasComponent />
        </div>
    )
}

export default Page
