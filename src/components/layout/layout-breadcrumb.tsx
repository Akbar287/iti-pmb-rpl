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

    const breadcrumbs = [
        <BreadcrumbItem key="home">
            <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
            </BreadcrumbLink>
            {pathSegments.length > 0 && <BreadcrumbSeparator />}
        </BreadcrumbItem>,
        ...pathSegments.map((segment, index) => {
            const href = '/' + pathSegments.slice(0, index + 1).join('/')
            const isLast = index === pathSegments.length - 1

            const label = /^\d+$/.test(segment)
                ? `ID ${toTitleCase(pathSegments[index - 1] || 'Item')}`
                : toTitleCase(segment)

            return (
                <BreadcrumbItem key={href}>
                    {isLast ? (
                        <BreadcrumbPage>{label}</BreadcrumbPage>
                    ) : (
                        <>
                            <BreadcrumbLink asChild>
                                <Link href={href}>{label}</Link>
                            </BreadcrumbLink>
                            <BreadcrumbSeparator />
                        </>
                    )}
                </BreadcrumbItem>
            )
        }),
    ]

    return isClient ? (
        <Breadcrumb>
            <BreadcrumbList>{breadcrumbs}</BreadcrumbList>
        </Breadcrumb>
    ) : (
        <></>
    )
}
