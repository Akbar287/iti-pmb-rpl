'use client'

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { usePathname } from 'next/navigation'
import { Skeleton } from '../ui/skeleton'
import { MenuProps } from '@/types/types'
import Link from 'next/link'

export function NavMain({
    selectedMenu,
}: {
    selectedMenu: MenuProps[] | null
}) {
    const pathname = usePathname()
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
            <SidebarMenu>
                {selectedMenu === null ? (
                    <Skeleton className="w-full h-10" />
                ) : (
                    selectedMenu.map((item) => {
                        const isMenuActive =
                            (item.url === '/'
                                ? pathname === '/'
                                : pathname.startsWith(item.url + '/')) ||
                            pathname === item.url ||
                            item.items?.some(
                                (sub) =>
                                    pathname === sub.url ||
                                    pathname.startsWith(sub.url + '/')
                            )

                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    tooltip={item.title}
                                    isActive={isMenuActive}
                                >
                                    <Link className="flex" href={item.url}>
                                        {item.icon && (
                                            <item.icon className="w-4 h-4 mr-1" />
                                        )}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                                {item.items?.length ? (
                                    <SidebarMenuSub>
                                        {item.items.map((item) => {
                                            const isSubActive =
                                                pathname.startsWith(item.url)

                                            return (
                                                <SidebarMenuSubItem
                                                    key={item.title}
                                                >
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        isActive={isSubActive}
                                                    >
                                                        <Link href={item.url}>
                                                            {item.title}
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            )
                                        })}
                                    </SidebarMenuSub>
                                ) : null}
                            </SidebarMenuItem>
                        )
                    })
                )}
            </SidebarMenu>
        </SidebarGroup>
    )
}
