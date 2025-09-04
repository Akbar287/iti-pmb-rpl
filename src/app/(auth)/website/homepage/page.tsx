import HomepageComponent from '@/components/website/HomepageComponent'
import React from 'react'

const Page = async () => {
    return (
        <div className="p-6">
            <h1 className="mb-4 text-2xl font-bold">Homepage</h1>
            <HomepageComponent />
        </div>
    )
}

export default Page
