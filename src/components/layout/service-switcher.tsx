'use client'

import * as React from 'react'
import { ChevronsUpDown, LogOut } from 'lucide-react'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar'
import { Role } from '@/generated/prisma'
import Image from 'next/image'

export function TeamSwitcher({
    teams,
    selectedRole,
    changeRole,
    logout,
}: {
    teams: Role[]
    selectedRole: Role | null
    changeRole: (team: Role) => void
    logout: () => void
}) {
    const { isMobile } = useSidebar()

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-600 text-white">
                                <img
                                    alt="icon"
                                    src={
                                        selectedRole?.Icon ??
                                        'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%20%3Cpath%20d%3D%22M8%207a4%204%200%201%200%208%200a4%204%200%200%200%20-8%200%22%20%2F%3E%20%3Cpath%20d%3D%22M6%2021v-2a4%204%200%200%201%204%20-4h4a4%204%200%200%201%204%204v2%22%20%2F%3E%20%3C%2Fsvg%3E%20'
                                    }
                                    className="size-4"
                                />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {selectedRole !== null
                                        ? selectedRole.Name
                                        : 'Role'}
                                </span>
                                <span className="truncate text-xs">
                                    {selectedRole !== null
                                        ? selectedRole.GuardName
                                        : 'Guard'}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? 'bottom' : 'right'}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Peran
                        </DropdownMenuLabel>
                        {teams.map((team, index) => (
                            <DropdownMenuItem
                                key={index}
                                onClick={() => changeRole(team)}
                                className="gap-2 p-2"
                            >
                                <div className="flex size-6 items-center justify-center rounded-sm border">
                                    <img
                                        alt="icon"
                                        src={
                                            team?.Icon ??
                                            'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%3E%20%3Cpath%20d%3D%22M8%207a4%204%200%201%200%208%200a4%204%200%200%200%20-8%200%22%20%2F%3E%20%3Cpath%20d%3D%22M6%2021v-2a4%204%200%200%201%204%20-4h4a4%204%200%200%201%204%204v2%22%20%2F%3E%20%3C%2Fsvg%3E%20'
                                        }
                                        className="size-4 shrink-0"
                                    />
                                </div>
                                {team.Name}
                                <DropdownMenuShortcut>
                                    ⌘{index + 1}
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="gap-2 p-2"
                            onClick={() => logout()}
                        >
                            <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                                <LogOut className="size-4" />
                            </div>
                            <div className="font-medium text-muted-foreground">
                                Keluar
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
