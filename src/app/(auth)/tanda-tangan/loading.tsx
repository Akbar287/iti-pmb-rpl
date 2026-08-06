import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const Loading = () => {
    return (
        <div className="w-full p-6 space-y-4">
            <Skeleton className="w-64 h-8" />
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-64" />
        </div>
    )
}

export default Loading
