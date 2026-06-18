'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight, FolderOpen } from 'lucide-react'
import useCountStore from '@/stores/MenuStore'
import { safeStorage } from '@/lib/safe-storage'
import { Role } from '@/generated/prisma'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

// Halaman induk (mis. /manajemen-data) menampilkan daftar sub-menu yang
// boleh diakses role aktif. Sub-menu & filter role diambil dari MenuStore.
const SubMenuLanding = () => {
    const pathname = usePathname()
    const getMenuByRole = useCountStore((s) => s.getMenuByRole)
    const [role, setRole] = React.useState<Role | null>(null)
    const [ready, setReady] = React.useState<boolean>(false)

    React.useEffect(() => {
        const stored = safeStorage.getItem('pmb.iti.role')
        if (stored) {
            try {
                setRole(JSON.parse(stored) as Role)
            } catch {
                setRole(null)
            }
        }
        setReady(true)
    }, [])

    const menus = role ? getMenuByRole(role) : []
    const current = menus.find((m) => m.url === pathname)
    const items = current?.items ?? []
    const Icon = current?.icon ?? FolderOpen

    // Palet warna ikon, dirotasi per kartu agar menu lebih hidup.
    const palette = [
        { box: 'bg-blue-500/15 text-blue-600 dark:bg-blue-400/20 dark:text-blue-300', ring: 'hover:border-blue-500/50' },
        { box: 'bg-green-500/15 text-green-600 dark:bg-green-400/20 dark:text-green-300', ring: 'hover:border-green-500/50' },
        { box: 'bg-violet-500/15 text-violet-600 dark:bg-violet-400/20 dark:text-violet-300', ring: 'hover:border-violet-500/50' },
        { box: 'bg-orange-500/15 text-orange-600 dark:bg-orange-400/20 dark:text-orange-300', ring: 'hover:border-orange-500/50' },
        { box: 'bg-rose-500/15 text-rose-600 dark:bg-rose-400/20 dark:text-rose-300', ring: 'hover:border-rose-500/50' },
        { box: 'bg-cyan-500/15 text-cyan-600 dark:bg-cyan-400/20 dark:text-cyan-300', ring: 'hover:border-cyan-500/50' },
    ]

    if (!ready) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
            </div>
        )
    }

    if (!current || items.length === 0) {
        return (
            <Alert>
                <FolderOpen className="h-4 w-4" />
                <AlertTitle>Tidak ada menu</AlertTitle>
                <AlertDescription>
                    Tidak ada sub-menu yang tersedia untuk role Anda pada halaman ini.
                </AlertDescription>
            </Alert>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 animate-in fade-in-0 slide-in-from-top-2 duration-500">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform hover:scale-110 hover:rotate-3">
                    <Icon className="h-5 w-5" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">{current.title}</h1>
                    <p className="text-sm text-muted-foreground">
                        Pilih menu di bawah untuk melanjutkan.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item, i) => {
                    const c = palette[i % palette.length]
                    return (
                        <Link key={item.url} href={item.url} className="group">
                            <Card
                                className={`h-full animate-in fade-in-0 slide-in-from-bottom-3 duration-500 transition-all hover:shadow-lg group-hover:-translate-y-1 ${c.ring}`}
                                style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'backwards' }}
                            >
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-6 ${c.box}`}
                                        >
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                                    </div>
                                    <CardTitle className="text-base mt-3">{item.title}</CardTitle>
                                    <CardDescription className="truncate">{item.url}</CardDescription>
                                </CardHeader>
                                <CardContent />
                            </Card>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default SubMenuLanding
