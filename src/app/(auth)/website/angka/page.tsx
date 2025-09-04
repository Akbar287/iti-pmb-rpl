import AngkaComponent from '@/components/website/AngkaComponent'
import React from 'react'

const Page = async () => {
    return (
        <div className="p-6">
            <h1 className="mb-4 text-2xl font-bold">Angka</h1>
            <AngkaComponent />
        </div>
    )
}

export default Page
