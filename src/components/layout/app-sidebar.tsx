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
    const [teams, setTeams] = React.useState<Role[]>([])
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

    // JWT hanya membawa role ringan (tanpa Icon) agar cookie sesi tidak
    // membengkak dan ditolak proxy (502). Icon lengkap di-fetch di sini.
    React.useEffect(() => {
        const sessionRoles = session?.user.roles
        if (!sessionRoles || sessionRoles.length === 0) return

        let active = true
        fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/protected/role`,
            { credentials: 'include' }
        )
            .then((r) => (r.ok ? r.json() : []))
            .then((all: Role[]) => {
                if (!active) return
                const byId = new Map(all.map((r) => [r.RoleId, r]))
                setTeams(sessionRoles.map((r) => byId.get(r.RoleId) ?? r))
            })
            .catch(() => {
                if (active) setTeams(sessionRoles)
            })
        return () => {
            active = false
        }
    }, [session?.user.roles])

    // Tentukan role aktif dari localStorage (dicocokkan ke teams ber-Icon),
    // jatuh ke role pertama bila belum ada.
    React.useEffect(() => {
        if (teams.length === 0) return

        const stored = safeStorage.getItem('pmb.iti.role')
        const storedId = stored ? (JSON.parse(stored) as Role).RoleId : null
        const resolved = teams.find((t) => t.RoleId === storedId) ?? teams[0]

        setSelectedRole(resolved)
        setSelectedMenu(getMenuByRole(resolved))
        safeStorage.setItem('pmb.iti.role', JSON.stringify(resolved))
    }, [teams])

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
                        teams={teams.length > 0 ? teams : session.user.roles}
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
