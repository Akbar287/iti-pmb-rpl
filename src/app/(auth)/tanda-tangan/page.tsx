import React from 'react'
import TandaTanganComponent from '@/components/tanda-tangan/TandaTanganComponent'

const Page = async () => {
    return (
        <div className="p-6">
            <h1 className="mb-4 text-2xl font-bold">Penandatanganan SK</h1>
            <TandaTanganComponent />
        </div>
    )
}

export default Page
