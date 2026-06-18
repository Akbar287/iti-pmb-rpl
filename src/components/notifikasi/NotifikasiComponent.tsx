'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import {
    Activity,
    Bell,
    CheckCheck,
    Clock,
    Inbox,
    LifeBuoy,
} from 'lucide-react'
import { getNotifikasi, NotifikasiItem } from '@/services/NotifikasiService'
import { safeStorage } from '@/lib/safe-storage'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const READ_KEY = 'pmb.iti.notif.read'

const loadReadIds = (): Set<string> => {
    try {
        const raw = safeStorage.getItem(READ_KEY)
        return raw ? new Set<string>(JSON.parse(raw)) : new Set<string>()
    } catch {
        return new Set<string>()
    }
}

const saveReadIds = (ids: Set<string>) => {
    safeStorage.setItem(READ_KEY, JSON.stringify(Array.from(ids)))
}

// Waktu relatif sederhana berbahasa Indonesia.
const timeAgo = (iso: string): string => {
    const diff = Date.now() - new Date(iso).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1) return 'Baru saja'
    if (m < 60) return `${m} menit lalu`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h} jam lalu`
    const d = Math.floor(h / 24)
    if (d < 30) return `${d} hari lalu`
    return new Date(iso).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

const NotifikasiComponent = () => {
    const router = useRouter()
    const [items, setItems] = React.useState<NotifikasiItem[]>([])
    const [readIds, setReadIds] = React.useState<Set<string>>(new Set())
    const [loading, setLoading] = React.useState<boolean>(true)
    const [filter, setFilter] = React.useState<'all' | 'unread'>('all')

    React.useEffect(() => {
        setReadIds(loadReadIds())
        getNotifikasi()
            .then((res) => setItems(res))
            .catch(() => setItems([]))
            .finally(() => setLoading(false))
    }, [])

    const unreadCount = items.filter((n) => !readIds.has(n.id)).length

    const markRead = (id: string) => {
        setReadIds((prev) => {
            if (prev.has(id)) return prev
            const next = new Set(prev)
            next.add(id)
            saveReadIds(next)
            return next
        })
    }

    const markAllRead = () => {
        setReadIds(() => {
            const next = new Set(items.map((n) => n.id))
            saveReadIds(next)
            return next
        })
    }

    const open = (n: NotifikasiItem) => {
        markRead(n.id)
        router.push(n.url)
    }

    const visible = filter === 'unread'
        ? items.filter((n) => !readIds.has(n.id))
        : items

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Notifikasi</h1>
                        <p className="text-sm text-muted-foreground">
                            {unreadCount > 0
                                ? `${unreadCount} notifikasi belum dibaca`
                                : 'Semua notifikasi sudah dibaca'}
                        </p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    onClick={markAllRead}
                    disabled={unreadCount === 0}
                    className="gap-2"
                >
                    <CheckCheck className="h-4 w-4" />
                    Tandai semua dibaca
                </Button>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
                <Button
                    size="sm"
                    variant={filter === 'all' ? 'default' : 'outline'}
                    onClick={() => setFilter('all')}
                >
                    Semua ({items.length})
                </Button>
                <Button
                    size="sm"
                    variant={filter === 'unread' ? 'default' : 'outline'}
                    onClick={() => setFilter('unread')}
                >
                    Belum dibaca ({unreadCount})
                </Button>
            </div>

            {/* List */}
            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full rounded-xl" />
                    ))}
                </div>
            ) : visible.length === 0 ? (
                <Alert>
                    <Inbox className="h-4 w-4" />
                    <AlertTitle>Tidak ada notifikasi</AlertTitle>
                    <AlertDescription>
                        {filter === 'unread'
                            ? 'Semua notifikasi sudah dibaca.'
                            : 'Belum ada notifikasi untuk Anda saat ini.'}
                    </AlertDescription>
                </Alert>
            ) : (
                <div className="space-y-3">
                    {visible.map((n) => {
                        const isUnread = !readIds.has(n.id)
                        const isTicket = n.tipe === 'ticket'
                        return (
                            <Card
                                key={n.id}
                                onClick={() => open(n)}
                                className={`cursor-pointer transition-all hover:shadow-md ${isUnread
                                        ? 'border-primary/40 bg-primary/5 dark:bg-primary/10'
                                        : 'opacity-90'
                                    }`}
                            >
                                <CardContent className="flex items-start gap-3 py-4">
                                    <div
                                        className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isTicket
                                                ? 'bg-violet-500/15 text-violet-600 dark:bg-violet-400/20 dark:text-violet-300'
                                                : 'bg-blue-500/15 text-blue-600 dark:bg-blue-400/20 dark:text-blue-300'
                                            }`}
                                    >
                                        {isTicket ? (
                                            <LifeBuoy className="h-5 w-5" />
                                        ) : (
                                            <Activity className="h-5 w-5" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <p
                                                className={`truncate ${isUnread ? 'font-semibold' : 'font-medium'}`}
                                            >
                                                {n.judul}
                                            </p>
                                            {isUnread && (
                                                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-rose-500" />
                                            )}
                                        </div>
                                        <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
                                            {n.pesan}
                                        </p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <Badge variant="secondary" className="text-[10px]">
                                                {isTicket ? 'Tiket' : 'Status'}
                                            </Badge>
                                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                {timeAgo(n.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default NotifikasiComponent
