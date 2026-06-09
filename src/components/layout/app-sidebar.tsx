'use client'

import * as React from 'react'
import { FileQuestionIcon, Frame, LifeBuoy, PieChart } from 'lucide-react'

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from '@/components/ui/sidebar'
import { NavMain } from './nav-main'
import { NavProjects } from './nav-project'
import { NavSecondary } from './nav-secondary'
import { NavUser } from './nav-user'
import { TeamSwitcher } from './service-switcher'
import { signOut, useSession } from 'next-auth/react'
import { Role } from '@/generated/prisma'
import { toast } from 'sonner'
import { MenuProps } from '@/types/types'
import useCountStore from '@/stores/MenuStore'
import { usePathname, useRouter } from 'next/navigation'
import { startTransition } from 'react'
import { safeStorage } from '@/lib/safe-storage'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const router = useRouter()
    const pathname = usePathname()
    const { data: session } = useSession()
    const getMenuByRole = useCountStore((state) => state.getMenuByRole)
    const [selectedRole, setSelectedRole] = React.useState<Role | null>(null)
    const [selectedMenu, setSelectedMenu] = React.useState<MenuProps[] | null>(
        null
    )
    const changeRole = async (role: Role) => {
        toast(`Beralih ke role ${role.Name}`)
        safeStorage.setItem('pmb.iti.role', JSON.stringify(role))
        setSelectedRole(role)
        setSelectedMenu(getMenuByRole(role))
        if (pathname !== '/') {
            router.push('/')
        } else {
            window.location.reload()
        }
    }

    React.useEffect(() => {
        if (selectedRole) {
            if (!safeStorage.getItem('pmb.iti.role')) {
                safeStorage.setItem(
                    'pmb.iti.role',
                    JSON.stringify(selectedRole)
                )
                setSelectedMenu(getMenuByRole(selectedRole))
            }
        } else {
            if (safeStorage.getItem('pmb.iti.role')) {
                const storedRole = safeStorage.getItem('pmb.iti.role')
                if (storedRole) {
                    setSelectedRole(JSON.parse(storedRole))
                    setSelectedMenu(getMenuByRole(JSON.parse(storedRole)))
                }
            } else {
                setSelectedRole(
                    session?.user.roles !== undefined
                        ? session?.user.roles[0]
                        : null
                )
                session?.user.roles &&
                    setSelectedMenu(getMenuByRole(session?.user.roles[0]))
                session?.user.roles &&
                    safeStorage.setItem(
                        'pmb.iti.role',
                        JSON.stringify(session?.user.roles[0])
                    )
            }
        }
    }, [selectedRole])

    const data = {
        navSecondary: [
            {
                title: 'Tiket Bantuan',
                url: '/tickets',
                icon: LifeBuoy,
            },
            {
                title: 'Q&A',
                url: '/question',
                icon: FileQuestionIcon,
            },
        ],
        projects: [
            {
                name: 'Buku Petunjuk',
                url: '/buku-petunjuk',
                icon: Frame,
            },
            {
                name: 'Proses Bisnis RPL',
                url: '/proses-bisnis-rpl',
                icon: PieChart,
            },
        ],
    }

    const logout = () => {
        safeStorage.removeItem('pmb.iti.role')
        toast('Sedang Mengeluarkan Anda')
        signOut({ callbackUrl: '/' })
    }

    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader className="border-white/50
                        bg-white/20 backdrop-blur-xl
                        shadow-sm shadow-black/5
                        dark:border-white/10 dark:bg-slate-950/40">
                {session?.user.roles && (
                    <TeamSwitcher
                        teams={session?.user.roles}
                        selectedRole={selectedRole}
                        changeRole={changeRole}
                        logout={logout}
                    />
                )}
            </SidebarHeader>
            <SidebarContent className="border-white/50
                        bg-white/20 backdrop-blur-xl
                        shadow-sm shadow-black/5
                        dark:border-white/10 dark:bg-slate-950/40">
                <NavMain selectedMenu={selectedMenu} />
                <NavProjects projects={data.projects} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter className="border-white/50
                        bg-white/20 backdrop-blur-xl
                        shadow-sm shadow-black/5
                        dark:border-white/10 dark:bg-slate-950/40">
                <NavUser
                    user={{
                        nama: session?.user.nama,
                        email: session?.user.email,
                        avatar: session?.user.avatar,
                    }}
                    logout={logout}
                />
            </SidebarFooter>
        </Sidebar>
    )
}
