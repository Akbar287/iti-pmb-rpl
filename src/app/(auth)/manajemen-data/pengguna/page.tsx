import { UserDataTable } from '@/components/manajemen-data/pengguna/ManajemenPengguna'
import React from 'react'

const Page = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Pengguna</h1>
            <UserDataTable />
        </div>
    )
}

export default Page
