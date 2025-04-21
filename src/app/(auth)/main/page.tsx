import React from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { User } from 'lucide-react'

const Page = () => {
    return (
        <React.Fragment>
            <div className="w-full flex">
                <Alert>
                    <User className="h-4 w-4" />
                    <AlertTitle>Selamat Datang</AlertTitle>
                    <AlertDescription>
                        Selamat Datang di Sistem Penerimaan Mahasiswa Baru Untuk
                        RPL
                    </AlertDescription>
                </Alert>
            </div>
        </React.Fragment>
    )
}

export default Page
