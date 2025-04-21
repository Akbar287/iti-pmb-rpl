import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const Loading = () => {
    return (
        <div className={`min-h-screen transition-opacity w-full duration-500`}>
            <Skeleton className="w-full h-32" />
            <Skeleton className="w-full h-56" />
            <div className="bg-white/80 dark:bg-gray-700">
                <Skeleton className="w-full h-20" />
                <Skeleton className="w-full h-20" />
                <Skeleton className="w-full h-20" />
                <Skeleton className="w-full h-20" />
                <Skeleton className="w-full h-20" />
                <Skeleton className="w-full h-20" />
                <Skeleton className="w-full h-20" />
                <Skeleton className="w-full h-20" />
            </div>
        </div>
    )
}

export default Loading
