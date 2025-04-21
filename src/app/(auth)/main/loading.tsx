import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const Loading = () => {
    return (
        <React.Fragment>
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <Skeleton className="aspect-video rounded-xl bg-muted/50" />
                <Skeleton className="aspect-video rounded-xl bg-muted/50" />
                <Skeleton className="aspect-video rounded-xl bg-muted/50" />
            </div>
            <Skeleton className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </React.Fragment>
    )
}

export default Loading
