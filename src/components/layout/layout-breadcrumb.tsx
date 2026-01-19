'use client'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import React from 'react'

export default function LayoutBreadcrumb() {
    const toTitleCase = (str: string) =>
        str.replace(/[-_]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
    const pathname = usePathname()

    const pathSegments = pathname.split('/').filter((seg) => seg)
    const [isClient, setIsClient] = React.useState(false)

    React.useEffect(() => {
        setIsClient(true)
    }, [])

    const breadcrumbs: React.ReactNode[] = []

    // Add Home item
    breadcrumbs.push(
        <BreadcrumbItem key="home">
            <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
            </BreadcrumbLink>
        </BreadcrumbItem>
    )

    // Add separator after Home if there are more segments
    if (pathSegments.length > 0) {
        breadcrumbs.push(<BreadcrumbSeparator key="home-sep" />)
    }

    // Add path segments
    pathSegments.forEach((segment, index) => {
        const href = '/' + pathSegments.slice(0, index + 1).join('/')
        const isLast = index === pathSegments.length - 1

        const label = /^\d+$/.test(segment)
            ? `ID ${toTitleCase(pathSegments[index - 1] || 'Item')}`
            : toTitleCase(segment)

        breadcrumbs.push(
            <BreadcrumbItem key={href}>
                {isLast ? (
                    <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                    <BreadcrumbLink asChild>
                        <Link href={href}>{label}</Link>
                    </BreadcrumbLink>
                )}
            </BreadcrumbItem>
        )

        // Add separator if not the last segment
        if (!isLast) {
            breadcrumbs.push(<BreadcrumbSeparator key={`${href}-sep`} />)
        }
    })

    return isClient ? (
        <Breadcrumb>
            <BreadcrumbList>{breadcrumbs}</BreadcrumbList>
        </Breadcrumb>
    ) : (
        <></>
    )
}
