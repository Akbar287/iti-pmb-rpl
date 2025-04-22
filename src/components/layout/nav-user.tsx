'use client'

import {
    BadgeCheck,
    Bell,
    ChevronsUpDown,
    LogOut,
    MoonStar,
    SunIcon,
    SunMoonIcon,
} from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'

export function NavUser({
    user,
    logout,
}: {
    user: {
        nama: string | undefined
        email: string | undefined
        avatar: string | undefined
    }
    logout: () => void
}) {
    const { isMobile } = useSidebar()
    const router = useRouter()

    const { theme, setTheme } = useTheme()

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    size="lg"
                    onClick={() =>
                        theme === 'dark' ? setTheme('light') : setTheme('dark')
                    }
                >
                    <SunMoonIcon className="h-8 w-8" />
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                            Tema Aplikasi
                        </span>
                        {theme === 'dark' ? (
                            <span className="truncate text-xs">Gelap</span>
                        ) : (
                            <span className="truncate text-xs">Terang</span>
                        )}
                    </div>
                    {theme === 'dark' ? (
                        <MoonStar className="ml-auto size-4" />
                    ) : (
                        <SunIcon className="ml-auto size-4" />
                    )}
                </SidebarMenuButton>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage
                                    src={
                                        '/api/protected/avatar?avatar=' +
                                        (user.avatar ?? 'default.png')
                                    }
                                    alt={user.nama ?? 'Nama'}
                                />
                                <AvatarFallback className="rounded-lg">
                                    {user.nama ?? 'Nama'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {user.nama ?? 'Nama'}
                                </span>
                                <span className="truncate text-xs">
                                    {user.email ?? 'Email'}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? 'bottom' : 'right'}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage
                                        src={
                                            '/api/protected/avatar?avatar=' +
                                            user.avatar
                                        }
                                        alt={user.nama ?? 'Nama'}
                                    />
                                    <AvatarFallback className="rounded-lg">
                                        {user.nama ?? 'Nama'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {user.nama ?? 'Nama'}
                                    </span>
                                    <span className="truncate text-xs">
                                        {user.email ?? 'Email'}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                onClick={() => router.push('/profil')}
                            >
                                <BadgeCheck />
                                Profil Saya
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => router.push('/notifikasi')}
                            >
                                <Bell />
                                Notifikasi
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                logout()
                            }}
                        >
                            <LogOut />
                            Keluar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
