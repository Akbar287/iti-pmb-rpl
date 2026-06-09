'use client'

import React from 'react'
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table'
import { toast } from 'sonner'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import {
    ChevronLeft,
    ChevronRight,
    Eye,
    MoreHorizontal,
} from 'lucide-react'
import { Input } from '../ui/input'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '../ui/select'
import { Skeleton } from '../ui/skeleton'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../ui/card'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog'
import { Badge } from '../ui/badge'
import { Tickets } from '@/types/TicketsTypes'
import { getTicketsPagination, updateTicket, getTicketById } from '@/services/TicketServices'

const STATUS_OPTIONS = [
    { value: 'ALL', label: 'Semua Status' },
    { value: 'OPEN', label: 'Open' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'REOPEN', label: 'Reopen' },
    { value: 'SOLVED', label: 'Solved' },
    { value: 'ON_HOLD', label: 'On Hold' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'RESOLVED', label: 'Resolved' },
    { value: 'CLOSED', label: 'Closed' },
]

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

export default function TicketsComponent() {
    const [dataTickets, setDataTickets] = React.useState<Tickets[]>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [paginationState, setPaginationState] = React.useState<{
        page: number
        limit: number
        totalElement: number
        totalPage: number
        isFirst: boolean
        isLast: boolean
        hasNext: boolean
        hasPrevious: boolean
    }>({
        page: 1,
        limit: 10,
        totalElement: 0,
        totalPage: 0,
        isFirst: false,
        isLast: false,
        hasNext: false,
        hasPrevious: false,
    })
    const [search, setSearch] = React.useState<string>('')
    const [statusFilter, setStatusFilter] = React.useState<string>('ALL')
    const [loading, setLoading] = React.useState<boolean>(true)
    const [openUpdateDialog, setOpenUpdateDialog] = React.useState<boolean>(false)
    const [selectedTicket, setSelectedTicket] = React.useState<Tickets | null>(null)
    const [newStatus, setNewStatus] = React.useState<string>('')
    const [updating, setUpdating] = React.useState<boolean>(false)

    React.useEffect(() => {
        fetchData()
    }, [paginationState.page, paginationState.limit, search, statusFilter])

    const fetchData = async () => {
        setLoading(true)
        try {
            const res = await getTicketsPagination(
                paginationState.page,
                paginationState.limit,
                search,
                '',
                '',
                statusFilter === 'ALL' ? '' : statusFilter
            )
            setDataTickets(res.data)
            setPaginationState({
                page: res.page,
                limit: res.limit,
                totalElement: res.totalElement,
                totalPage: res.totalPage,
                isFirst: res.isFirst,
                isLast: res.isLast,
                hasNext: res.hasNext,
                hasPrevious: res.hasPrevious,
            })
        } catch (error) {
            toast.error('Gagal memuat data tiket')
        } finally {
            setLoading(false)
        }
    }

    const openUpdateStatusDialog = (ticket: Tickets) => {
        setSelectedTicket(ticket)
        setNewStatus(ticket.Status)
        setOpenUpdateDialog(true)
    }

    const handleUpdateStatus = async () => {
        if (!selectedTicket || !newStatus) return

        setUpdating(true)
        try {
            const detail = await getTicketById(selectedTicket.TicketsId)
            await updateTicket({
                TicketsId: detail.TicketsId,
                UserId: detail.UserId,
                RoleId: detail.RoleId,
                KepadaRoleId: detail.KepadaRoleId,
                Subject: detail.Subject,
                Message: detail.Message,
                Status: newStatus,
            })
            toast.success('Status tiket berhasil diperbarui')
            setOpenUpdateDialog(false)
            fetchData()
        } catch (error) {
            toast.error('Gagal memperbarui status tiket')
        } finally {
            setUpdating(false)
        }
    }

    const columns: ColumnDef<Tickets>[] = [
        {
            accessorKey: 'NamaPengaju',
            header: 'Pengaju',
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue('NamaPengaju')}</div>
            ),
        },
        {
            accessorKey: 'Subject',
            header: 'Subject',
            cell: ({ row }) => (
                <div className="max-w-xs truncate">{row.getValue('Subject')}</div>
            ),
        },
        {
            accessorKey: 'NamaKepadaRole',
            header: 'Kepada',
            cell: ({ row }) => (
                <div>{row.getValue('NamaKepadaRole')}</div>
            ),
        },
        {
            accessorKey: 'Status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.getValue('Status') as string
                return (
                    <Badge variant={getStatusBadgeVariant(status)}>
                        {status.replace('_', ' ')}
                    </Badge>
                )
            },
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }) => {
                const ticket = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() =>
                                    navigator.clipboard.writeText(ticket.TicketsId)
                                }
                            >
                                Copy Ticket ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openUpdateStatusDialog(ticket)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Update Status
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    const table = useReactTable({
        data: dataTickets,
        columns,
        manualPagination: true,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        pageCount: paginationState.totalPage,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            columnFilters,
            columnVisibility,
        },
    })

    return (
        <div className="w-full">
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle>
                        <h1 className="text-2xl">Manajemen Tiket Bantuan</h1>
                    </CardTitle>
                    <CardDescription>
                        Kelola semua tiket bantuan dari pengguna
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row items-center gap-4 py-4">
                        <Input
                            placeholder="Cari berdasarkan subject..."
                            value={search}
                            onChange={(event) => {
                                setPaginationState({
                                    ...paginationState,
                                    page: 1,
                                })
                                setSearch(event.target.value)
                            }}
                            className="max-w-sm"
                        />
                        <Select
                            value={statusFilter}
                            onValueChange={(value) => {
                                setPaginationState({
                                    ...paginationState,
                                    page: 1,
                                })
                                setStatusFilter(value)
                            }}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Status</SelectLabel>
                                    {STATUS_OPTIONS.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <div className="flex-1" />
                        <Select
                            value={String(paginationState.limit)}
                            onValueChange={(value) =>
                                setPaginationState({
                                    ...paginationState,
                                    limit: Number(value),
                                    page: 1,
                                })
                            }
                        >
                            <SelectTrigger className="w-[100px]">
                                <SelectValue placeholder="Limit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Limit Data</SelectLabel>
                                    {[5, 10, 20, 50, 100].map((l) => (
                                        <SelectItem key={l} value={String(l)}>
                                            {l}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {loading ? (
                        <div className="space-y-2">
                            {Array.from({ length: paginationState.limit }).map((_, i) => (
                                <div key={i} className="flex space-x-4">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-[60%]" />
                                        <Skeleton className="h-4 w-[40%]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => (
                                                <TableHead key={header.id}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableHeader>
                                <TableBody>
                                    {table.getRowModel().rows?.length ? (
                                        table.getRowModel().rows.map((row) => (
                                            <TableRow
                                                key={row.id}
                                                data-state={row.getIsSelected() && 'selected'}
                                            >
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={columns.length}
                                                className="h-24 text-center"
                                            >
                                                Tidak Ada Data Tiket.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    <div className="flex items-center justify-end space-x-2 py-4">
                        <div className="flex-1 text-sm text-muted-foreground">
                            Menampilkan{' '}
                            {paginationState.totalElement > 0
                                ? paginationState.page * paginationState.limit -
                                paginationState.limit +
                                1
                                : 0}{' '}
                            -{' '}
                            {paginationState.totalElement <
                                paginationState.page * paginationState.limit
                                ? paginationState.totalElement
                                : paginationState.page * paginationState.limit}{' '}
                            dari {paginationState.totalElement} Data.
                        </div>
                        <div className="flex items-center space-x-2 mt-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    setPaginationState({
                                        ...paginationState,
                                        page: paginationState.page - 1,
                                    })
                                }
                                disabled={!paginationState.hasPrevious}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>

                            {(() => {
                                const pages = []
                                const { page, totalPage } = paginationState

                                const shouldShowLeftDots = page > 3
                                const shouldShowRightDots = page < totalPage - 2

                                const renderPage = (p: number) => (
                                    <Button
                                        key={p}
                                        variant={p === page ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() =>
                                            setPaginationState({
                                                ...paginationState,
                                                page: p,
                                            })
                                        }
                                    >
                                        {p}
                                    </Button>
                                )

                                if (totalPage > 0) pages.push(renderPage(1))

                                if (shouldShowLeftDots) {
                                    pages.push(<span key="left-dots">...</span>)
                                }

                                for (let i = page - 1; i <= page + 1; i++) {
                                    if (i > 1 && i < totalPage) {
                                        pages.push(renderPage(i))
                                    }
                                }

                                if (shouldShowRightDots) {
                                    pages.push(<span key="right-dots">...</span>)
                                }

                                if (totalPage > 1) {
                                    pages.push(renderPage(totalPage))
                                }

                                return pages
                            })()}

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    setPaginationState({
                                        ...paginationState,
                                        page: paginationState.page + 1,
                                    })
                                }
                                disabled={!paginationState.hasNext}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Update Status Dialog */}
            <Dialog open={openUpdateDialog} onOpenChange={setOpenUpdateDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Status Tiket</DialogTitle>
                        <DialogDescription>
                            Pilih status baru untuk tiket ini.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedTicket && (
                        <div className="space-y-1 text-sm">
                            <div><strong>Subject:</strong> {selectedTicket.Subject}</div>
                            <div><strong>Pengaju:</strong> {selectedTicket.NamaPengaju}</div>
                            <div className="flex items-center gap-2">
                                <strong>Status Saat Ini:</strong>
                                <Badge variant={getStatusBadgeVariant(selectedTicket.Status)}>
                                    {selectedTicket.Status.replace('_', ' ')}
                                </Badge>
                            </div>
                        </div>
                    )}
                    <div className="py-4">
                        <label className="text-sm font-medium mb-2 block">
                            Pilih Status Baru
                        </label>
                        <Select value={newStatus} onValueChange={setNewStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {STATUS_OPTIONS.filter((o) => o.value !== '').map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setOpenUpdateDialog(false)}
                            disabled={updating}
                        >
                            Batal
                        </Button>
                        <Button onClick={handleUpdateStatus} disabled={updating}>
                            {updating ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
