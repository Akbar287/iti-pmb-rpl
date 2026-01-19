import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const Loading = () => {
    return (
        <div className="w-full min-h-screen flex">
            <Skeleton className="w-full h-32" />
        </div>
    )
}

export default Loading
