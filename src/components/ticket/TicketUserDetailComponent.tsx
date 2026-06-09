'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { ArrowLeft, Download, FileIcon, Paperclip } from 'lucide-react'
import { Button } from '../ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../ui/card'
import { Badge } from '../ui/badge'
import { Skeleton } from '../ui/skeleton'
import { Separator } from '../ui/separator'
import { TicketsDetail } from '@/types/TicketsTypes'
import { getTicketById, getTicketFilesByTicketsId, getTicketFileDownloadUrl } from '@/services/TicketServices'
import Link from 'next/link'
import { TicketFile } from '@/types/TicketsTypes'

const getStatusBadgeVariant = (status: string) => {
    switch (status) {
        case 'OPEN':
            return 'default'
        case 'IN_PROGRESS':
            return 'secondary'
        case 'PENDING':
            return 'outline'
        case 'ON_HOLD':
            return 'outline'
        case 'SOLVED':
        case 'RESOLVED':
            return 'default'
        case 'CLOSED':
            return 'secondary'
        case 'REOPEN':
            return 'destructive'
        default:
            return 'outline'
    }
}

const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export default function TicketUserDetailComponent({ ticketId }: { ticketId: string }) {
    const { data: session } = useSession()
    const [ticket, setTicket] = React.useState<TicketsDetail | null>(null)
    const [files, setFiles] = React.useState<TicketFile[]>([])
    const [loading, setLoading] = React.useState<boolean>(true)

    React.useEffect(() => {
        fetchTicketDetail()
    }, [ticketId])

    const fetchTicketDetail = async () => {
        setLoading(true)
        try {
            const data = await getTicketById(ticketId)
            setTicket(data)

            const filesData = await getTicketFilesByTicketsId(ticketId)
            setFiles(filesData)
        } catch (error) {
            toast.error('Gagal memuat detail tiket')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="w-full max-w-4xl mx-auto px-4 py-8">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-1/2 mb-2" />
                        <Skeleton className="h-4 w-1/3" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-20 w-full" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!ticket) {
        return (
            <div className="w-full max-w-4xl mx-auto px-4 py-8">
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-gray-500">Tiket tidak ditemukan</p>
                        <Button asChild className="mt-4">
                            <Link href="/tickets">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="outline" asChild>
                    <Link href="/tickets">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali
                    </Link>
                </Button>
            </div>

            {/* Ticket Info */}
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-2xl">
                                {ticket.Subject}
                            </CardTitle>
                            <CardDescription className="mt-2">
                                Tiket ID: {ticket.TicketsId}
                            </CardDescription>
                        </div>
                        <Badge
                            variant={getStatusBadgeVariant(ticket.Status)}
                            className="text-sm px-3 py-1"
                        >
                            {ticket.Status.replace('_', ' ')}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <p className="text-sm text-muted-foreground">Pengaju</p>
                            <p className="font-medium">{ticket.NamaUser}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Role Pengaju</p>
                            <p className="font-medium">{ticket.NamaRole}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Ditujukan Kepada</p>
                            <p className="font-medium">{ticket.NamaKepadaRole}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Dibuat Pada</p>
                            <p className="font-medium">{formatDate(ticket.CreatedAt)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Terakhir Diperbarui</p>
                            <p className="font-medium">{formatDate(ticket.UpdatedAt)}</p>
                        </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Message */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Pesan</h3>
                        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border">
                            <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                                {ticket.Message}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Attachments */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Paperclip className="h-5 w-5" />
                        Lampiran ({files.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {files.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">
                            Tidak ada lampiran
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {files.map((file) => (
                                <div
                                    key={file.TicketsFileId}
                                    className="flex items-center justify-between bg-white dark:bg-gray-900 rounded-lg p-3 border"
                                >
                                    <div className="flex items-center gap-3">
                                        <FileIcon className="h-8 w-8 text-blue-500" />
                                        <div>
                                            <p className="font-medium">{file.NamaDokumen}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatDate(file.CreatedAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" asChild>
                                        <a
                                            href={getTicketFileDownloadUrl(file.TicketsFileId)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Download className="mr-2 h-4 w-4" />
                                            Unduh
                                        </a>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
