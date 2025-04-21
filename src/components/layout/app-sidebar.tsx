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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { data: session } = useSession()
    const getMenuByRole = useCountStore((state) => state.getMenuByRole)
    const [selectedRole, setSelectedRole] = React.useState<Role | null>(null)
    const [selectedMenu, setSelectedMenu] = React.useState<MenuProps[] | null>(
        null
    )
    const changeRole = (role: Role) => {
        setSelectedRole(role)
        setSelectedMenu(getMenuByRole(role))
        localStorage.setItem('pmb.iti.role', JSON.stringify(role))
    }

    React.useEffect(() => {
        if (selectedRole) {
            if (!localStorage.getItem('pmb.iti.role')) {
                localStorage.setItem(
                    'pmb.iti.role',
                    JSON.stringify(selectedRole)
                )
                setSelectedMenu(getMenuByRole(selectedRole))
            }
        } else {
            if (localStorage.getItem('pmb.iti.role')) {
                const storedRole = localStorage.getItem('pmb.iti.role')
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
                    localStorage.setItem(
                        'pmb.iti.role',
                        JSON.stringify(session?.user.roles[0])
                    )
            }
        }
    }, [])

    const data = {
        navSecondary: [
            {
                title: 'Dukungan',
                url: '/dukungan',
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
        localStorage.removeItem('pmb.iti.role')
        signOut()
        toast('Sedang Mengeluarkan Anda')
    }

    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                {session?.user.roles && (
                    <TeamSwitcher
                        teams={session?.user.roles}
                        selectedRole={selectedRole}
                        changeRole={changeRole}
                        logout={logout}
                    />
                )}
            </SidebarHeader>
            <SidebarContent>
                <NavMain selectedMenu={selectedMenu} />
                <NavProjects projects={data.projects} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
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
