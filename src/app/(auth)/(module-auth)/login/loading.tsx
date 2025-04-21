import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const Loading = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-6 p-6 bg-gradient-to-br from-green-50 via-yellow-50 to-red-50 dark:from-gray-800 dark:to-gray-700 min-h-svh md:p-10">
            <div className="w-full max-w-sm">
                <Skeleton className="w-full h-1/3" />
            </div>
        </div>
    )
}

export default Loading
