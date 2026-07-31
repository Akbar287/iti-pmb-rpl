import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const Loading = () => {
    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col items-center gap-3">
                <Skeleton className="w-16 h-16 rounded-full" />
                <Skeleton className="w-56 h-8" />
                <Skeleton className="h-4 w-80" />
            </div>
            <Skeleton className="w-full h-24" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="w-full h-28" />
                ))}
            </div>
            <Skeleton className="w-full h-40" />
        </div>
    )
}

export default Loading
