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
import { useSession } from 'next-auth/react'
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
    FileIcon,
    MoreHorizontal,
    PenIcon,
    Plus,
    Timer,
    Trash2,
    Upload,
    X,
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
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form'
import { Badge } from '../ui/badge'
import { Textarea } from '../ui/textarea'
import { Tickets } from '@/types/TicketsTypes'
import {
    getTicketsPagination,
    createTicket,
    updateTicket,
    deleteTicket,
    uploadTicketFile,
    getTicketFilesByTicketsId,
    deleteTicketFile,
} from '@/services/TicketServices'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Swal from 'sweetalert2'
import Link from 'next/link'
import { getRolesPagination } from '@/services/RoleServices'
import { TicketFile } from '@/types/TicketsTypes'

const ticketFormSchema = z.object({
    TicketsId: z.string().optional(),
    Subject: z.string().min(1, 'Subject wajib diisi'),
    Message: z.string().min(1, 'Pesan wajib diisi'),
    KepadaRoleId: z.string().min(1, 'Tujuan wajib dipilih'),
})

type TicketFormValidation = z.infer<typeof ticketFormSchema>

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

// Role tujuan yang diizinkan
const ALLOWED_ROLE_NAMES = ['PMB', 'Admin', 'Akademik']

export default function TicketUserComponent() {
    const { data: session } = useSession()
    const [dataTickets, setDataTickets] = React.useState<Tickets[]>([])
    const [roles, setRoles] = React.useState<{ value: string; label: string }[]>([])
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
    const [loading, setLoading] = React.useState<boolean>(true)
    const [openDialog, setOpenDialog] = React.useState<boolean>(false)
    const [dialogTitle, setDialogTitle] = React.useState<string>('')
    const [submitting, setSubmitting] = React.useState<boolean>(false)

    // File upload states
    const [selectedFiles, setSelectedFiles] = React.useState<File[]>([])
    const [existingFiles, setExistingFiles] = React.useState<TicketFile[]>([])
    const [uploadingFiles, setUploadingFiles] = React.useState<boolean>(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const form = useForm<TicketFormValidation>({
        resolver: zodResolver(ticketFormSchema),
        defaultValues: {
            TicketsId: '',
            Subject: '',
            Message: '',
            KepadaRoleId: '',
        },
    })

    React.useEffect(() => {
        const fetchRoles = async () => {
            try {
                const res = await getRolesPagination(1, 100, '')
                const filteredRoles = res.data
                    .filter((r) => ALLOWED_ROLE_NAMES.includes(r.Name))
                    .map((r) => ({
                        value: r.RoleId,
                        label: r.Name,
                    }))
                setRoles(filteredRoles)
            } catch (error) {
                console.error('Failed to fetch roles:', error)
            }
        }
        fetchRoles()
    }, [])

    React.useEffect(() => {
        if (session?.user?.id) {
            fetchData()
        }
    }, [paginationState.page, paginationState.limit, search, session?.user?.id])

    const fetchData = async () => {
        if (!session?.user?.id) return
        setLoading(true)
        try {
            const res = await getTicketsPagination(
                paginationState.page,
                paginationState.limit,
                search,
                session.user.id,
                '',
                ''
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

    const openCreateDialog = () => {
        form.reset({
            TicketsId: '',
            Subject: '',
            Message: '',
            KepadaRoleId: roles.length > 0 ? roles[0].value : '',
        })
        setSelectedFiles([])
        setExistingFiles([])
        setDialogTitle('Buat Tiket Baru')
        setOpenDialog(true)
    }

    const openEditDialog = async (ticket: Tickets) => {
        form.reset({
            TicketsId: ticket.TicketsId,
            Subject: ticket.Subject,
            Message: ticket.Message,
            KepadaRoleId: '',
        })
        setSelectedFiles([])

        // Load existing files
        try {
            const files = await getTicketFilesByTicketsId(ticket.TicketsId)
            setExistingFiles(files)
        } catch (error) {
            setExistingFiles([])
        }

        setDialogTitle('Edit Tiket')
        setOpenDialog(true)
    }

    const handleDelete = (ticket: Tickets) => {
        if (ticket.Status !== 'PENDING') {
            toast.error('Tiket hanya bisa dihapus saat status PENDING')
            return
        }
        Swal.fire({
            title: 'Hapus Tiket?',
            text: 'Aksi ini tidak dapat dibatalkan',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f45f24',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteTicket(ticket.TicketsId)
                    toast.success('Tiket berhasil dihapus')
                    fetchData()
                } catch (error) {
                    toast.error('Gagal menghapus tiket')
                }
            }
        })
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        const allowedExtensions = ['pdf', 'doc', 'docx']
        const maxSize = 10 * 1024 * 1024 // 10MB

        const validFiles: File[] = []
        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            const ext = file.name.split('.').pop()?.toLowerCase() || ''

            if (!allowedExtensions.includes(ext)) {
                toast.error(`File ${file.name}: Format tidak valid. Hanya PDF, DOC, DOCX`)
                continue
            }
            if (file.size > maxSize) {
                toast.error(`File ${file.name}: Ukuran melebihi 10MB`)
                continue
            }
            validFiles.push(file)
        }

        setSelectedFiles((prev) => [...prev, ...validFiles])
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const removeSelectedFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    }

    const removeExistingFile = async (file: TicketFile) => {
        try {
            await deleteTicketFile(file.TicketsFileId)
            setExistingFiles((prev) => prev.filter((f) => f.TicketsFileId !== file.TicketsFileId))
            toast.success('File berhasil dihapus')
        } catch (error) {
            toast.error('Gagal menghapus file')
        }
    }

    const onSubmit = async (data: TicketFormValidation) => {
        if (!session?.user?.id) return
        setSubmitting(true)

        try {
            const selectedRole = JSON.parse(localStorage.getItem('pmb.iti.role') || '{}')
            let ticketId = data.TicketsId

            if (dialogTitle === 'Edit Tiket') {
                await updateTicket({
                    TicketsId: data.TicketsId || '',
                    UserId: session.user.id,
                    RoleId: selectedRole.RoleId || '',
                    KepadaRoleId: data.KepadaRoleId,
                    Subject: data.Subject,
                    Message: data.Message,
                    Status: 'PENDING',
                })
                toast.success('Tiket berhasil diperbarui')
            } else {
                const result = await createTicket({
                    UserId: session.user.id,
                    RoleId: selectedRole.RoleId || '',
                    KepadaRoleId: data.KepadaRoleId,
                    Subject: data.Subject,
                    Message: data.Message,
                })
                ticketId = result.TicketsId
                toast.success('Tiket berhasil dibuat')
            }

            // Upload files
            if (selectedFiles.length > 0 && ticketId) {
                setUploadingFiles(true)
                for (const file of selectedFiles) {
                    try {
                        await uploadTicketFile(ticketId, file)
                    } catch (error) {
                        toast.error(`Gagal upload file: ${file.name}`)
                    }
                }
                setUploadingFiles(false)
            }

            setOpenDialog(false)
            fetchData()
        } catch (error) {
            toast.error('Gagal menyimpan tiket')
        } finally {
            setSubmitting(false)
        }
    }

    const columns: ColumnDef<Tickets>[] = [
        {
            accessorKey: 'Subject',
            header: 'Subject',
            cell: ({ row }) => (
                <div className="max-w-xs truncate font-medium">
                    {row.getValue('Subject')}
                </div>
            ),
        },
        {
            accessorKey: 'NamaKepadaRole',
            header: 'Kepada',
            cell: ({ row }) => <div>{row.getValue('NamaKepadaRole')}</div>,
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
                const isPending = ticket.Status === 'PENDING'
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
                            <DropdownMenuItem asChild>
                                <Link href={`/tickets/${ticket.TicketsId}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Lihat Detail
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {isPending && (
                                <>
                                    <DropdownMenuItem onClick={() => openEditDialog(ticket)}>
                                        <PenIcon className="mr-2 h-4 w-4" />
                                        Edit Tiket
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => handleDelete(ticket)}
                                        className="text-red-600"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Hapus Tiket
                                    </DropdownMenuItem>
                                </>
                            )}
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
            <Card className="bg-gray-50 shadow-md dark:bg-gray-800">
                <CardHeader>
                    <CardTitle>
                        <h1 className="text-2xl">Tiket Bantuan Saya</h1>
                    </CardTitle>
                    <CardDescription>
                        Kelola tiket bantuan Anda. Tiket hanya dapat diedit/dihapus saat status PENDING.
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
                        <div className="flex-1" />
                        <Button onClick={openCreateDialog}>
                            <Plus className="mr-2 h-4 w-4" />
                            Buat Tiket
                        </Button>
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
                                                Tidak Ada Tiket.
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

            {/* Create/Edit Dialog */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <DialogHeader>
                                <DialogTitle>{dialogTitle}</DialogTitle>
                                <DialogDescription>
                                    Isi form di bawah untuk {dialogTitle.toLowerCase()}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <FormField
                                    control={form.control}
                                    name="KepadaRoleId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kirim Kepada</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih tujuan" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {roles.map((role) => (
                                                        <SelectItem
                                                            key={role.value}
                                                            value={role.value}
                                                        >
                                                            {role.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Pilih role tujuan tiket
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="Subject"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Subject</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Masukkan subject tiket..."
                                                    {...field}
                                                    disabled={submitting}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Judul singkat tentang bantuan yang dibutuhkan
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="Message"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Pesan</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Jelaskan detail permasalahan..."
                                                    {...field}
                                                    rows={5}
                                                    disabled={submitting}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Jelaskan detail permasalahan atau bantuan yang diperlukan
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* File Upload Section */}
                                <div className="space-y-3">
                                    <FormLabel>Lampiran (Opsional)</FormLabel>
                                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileSelect}
                                            multiple
                                            accept=".pdf,.doc,.docx"
                                            className="hidden"
                                        />
                                        <div className="text-center">
                                            <Upload className="mx-auto h-8 w-8 text-gray-400" />
                                            <p className="mt-1 text-sm text-gray-500">
                                                PDF, DOC, DOCX (Maks. 10MB per file)
                                            </p>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="mt-2"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={submitting}
                                            >
                                                Pilih File
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Existing Files */}
                                    {existingFiles.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                File Terlampir:
                                            </p>
                                            {existingFiles.map((file) => (
                                                <div
                                                    key={file.TicketsFileId}
                                                    className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-lg p-2"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <FileIcon className="h-4 w-4 text-blue-500" />
                                                        <span className="text-sm truncate max-w-[200px]">
                                                            {file.NamaDokumen}
                                                        </span>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeExistingFile(file)}
                                                        disabled={submitting}
                                                    >
                                                        <X className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* New Selected Files */}
                                    {selectedFiles.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                File Baru:
                                            </p>
                                            {selectedFiles.map((file, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/30 rounded-lg p-2"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <FileIcon className="h-4 w-4 text-blue-500" />
                                                        <span className="text-sm truncate max-w-[200px]">
                                                            {file.name}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                                        </span>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeSelectedFile(index)}
                                                        disabled={submitting}
                                                    >
                                                        <X className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpenDialog(false)}
                                    disabled={submitting}
                                >
                                    Batal
                                </Button>
                                <Button type="submit" disabled={submitting || uploadingFiles}>
                                    {submitting || uploadingFiles ? (
                                        <>
                                            <Timer className="mr-2 h-4 w-4 animate-spin" />
                                            {uploadingFiles ? 'Mengupload file...' : 'Menyimpan...'}
                                        </>
                                    ) : (
                                        <>
                                            <PenIcon className="mr-2 h-4 w-4" />
                                            Simpan
                                        </>
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
