'use client'

import { ResponseSkRektorAsessmenType, ResponseSkRektorAsessmenTypeValue } from '@/types/FinalAsessmen'
import React from 'react'
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, FolderSync, FolderSyncIcon, MoreHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Label } from '../ui/label'
import { toast } from 'sonner'
import { setStatusSelesai } from '@/services/Status/StatusService'


export default function SinkronisasiComponent({ dataServer }: {
    dataServer: ResponseSkRektorAsessmenType[]
}) {
    const [data, setData] = React.useState<ResponseSkRektorAsessmenType[]>(dataServer)
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [selectedPendaftaranIds, setSelectedPendaftaranIds] = React.useState<string[]>([])
    const [globalFilter, setGlobalFilter] = React.useState<string>('')
    const [progress, setProgress] = React.useState(0)
    const [beforeSinkronisasi, setBeforeSinkronisasi] = React.useState(false)
    const [afterSinkronisasi, setAfterSinkronisasi] = React.useState(false)
    const [openDialog, setOpenDialog] = React.useState(false)
    const [openDialogSinkronisasi, setOpenDialogSinkronisasi] = React.useState(false)
    const [dataSelected, setDataSelected] = React.useState<ResponseSkRektorAsessmenType>(ResponseSkRektorAsessmenTypeValue)

    const columns: ColumnDef<ResponseSkRektorAsessmenType>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "KodePendaftar",
            header: "Kode Pendaftaran",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("KodePendaftar")}</div>
            ),
            enableGlobalFilter: true
        },
        {
            accessorKey: "Nim",
            header: "Nim",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("Nim")}</div>
            ),
            enableGlobalFilter: true
        },
        {
            accessorKey: "NomorSk",
            header: "Nomor SK",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("NomorSk")}</div>
            ),
            enableGlobalFilter: true
        },
        {
            accessorKey: "Nama",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Nama Mahasiswa
                        <ArrowUpDown />
                    </Button>
                )
            },
            enableGlobalFilter: true,
            cell: ({ row }) => <div className="lowercase">{row.getValue("Nama")}</div>,
        },
        {
            accessorKey: "ProgramStudi",
            header: () => <div className="text-right">Program Studi</div>,
            cell: ({ row }) => {
                return <div className="text-right font-medium">{row.getValue("ProgramStudi")}</div>
            },
            enableGlobalFilter: true
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
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
                                onClick={() => navigator.clipboard.writeText(row.original.PendaftaranId)}
                            >
                                Salin ID Pendaftaran
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                                setDataSelected(row.original)
                                setOpenDialog(true)
                            }}>Lihat Detail</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    React.useEffect(() => {
        const selectedRows = table.getSelectedRowModel().rows
        const allPendaftaranIds = selectedRows.map(r => r.original.PendaftaranId)
        setSelectedPendaftaranIds(allPendaftaranIds)
    }, [rowSelection])

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter
        },
    })

    const runLoadSinkronisasi = async () => {
        setBeforeSinkronisasi(true)
        setProgress(0)
        const total = selectedPendaftaranIds.length

        for (let i = 0; i < selectedPendaftaranIds.length; i++) {
            const id = selectedPendaftaranIds[i]

            try {
                await setStatusSelesai(id)
            } catch (e) {
                console.error('gagal sinkronisasi pendaftaran', id, e)
            }

            setProgress(Math.round(((i + 1) / total) * 100))
        }

        setAfterSinkronisasi(true)
        setData(data.filter(x => !selectedPendaftaranIds.includes(x.PendaftaranId)))
        toast("Sinkronisasi berhasil")
    }

    const circumference = 2 * Math.PI * 90
    const strokeDashoffset = circumference - (progress / 100) * circumference

    return (
        <div className="w-full">
            <div className="flex items-center justify-between py-4">
                <Input
                    placeholder="Cari Data"
                    value={globalFilter}
                    onChange={(e) => table.setGlobalFilter(e.target.value)}
                    className="max-w-sm"
                />
                {
                    selectedPendaftaranIds.length > 0 && (
                        <Button
                            className="mx-2  hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer"
                            variant={'default'}
                            onClick={() => {setBeforeSinkronisasi(false); setAfterSinkronisasi(false); setOpenDialogSinkronisasi(true)}}
                        >
                            <FolderSyncIcon /> Sinkronisasi
                        </Button>
                    )
                }
            </div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
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
                                    Tidak ada Data
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} dari{" "}
                    {table.getFilteredRowModel().rows.length} baris dipilih.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Sebelumnya
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Berikutnya
                    </Button>
                </div>
            </div>
            {/* Dialog Sinkronisasi  */}
            <Dialog open={openDialogSinkronisasi} onOpenChange={setOpenDialogSinkronisasi}>
                <DialogContent className="w-full max-h-[80vh]  overflow-y-scroll" onInteractOutside={(e) => e.preventDefault()} >
                    <DialogHeader>
                        <DialogTitle>Sinkronisasi Hasil Asessmen</DialogTitle>
                        <DialogDescription>
                            {selectedPendaftaranIds.length} data akan disinkronisasi
                        </DialogDescription>
                    </DialogHeader>
                    <div className="w-full justify-center md:justify-between">
                        {
                            beforeSinkronisasi ? (
                                <div className="flex flex-col items-center justify-center py-8">
                                    <div className="relative w-64 h-64 flex items-center justify-center">
                                        <svg
                                            className="absolute transform -rotate-90"
                                            width="240"
                                            height="240"
                                            viewBox="0 0 200 200"
                                        >
                                            <defs>
                                                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#06b6d4" />
                                                    <stop offset="50%" stopColor="#8b5cf6" />
                                                    <stop offset="100%" stopColor="#ec4899" />
                                                </linearGradient>
                                                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#10b981" />
                                                    <stop offset="50%" stopColor="#f59e0b" />
                                                    <stop offset="100%" stopColor="#ef4444" />
                                                </linearGradient>
                                                <filter id="glow">
                                                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                                    <feMerge>
                                                        <feMergeNode in="coloredBlur" />
                                                        <feMergeNode in="SourceGraphic" />
                                                    </feMerge>
                                                </filter>
                                            </defs>

                                            <circle
                                                cx="100"
                                                cy="100"
                                                r="90"
                                                stroke="rgba(255, 255, 255, 0.1)"
                                                strokeWidth="8"
                                                fill="none"
                                            />

                                            <circle
                                                cx="100"
                                                cy="100"
                                                r="90"
                                                stroke="url(#gradient1)"
                                                strokeWidth="8"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeDasharray={circumference}
                                                strokeDashoffset={strokeDashoffset}
                                                style={{
                                                    transition: "stroke-dashoffset 0.3s ease",
                                                    filter: "url(#glow)",
                                                }}
                                            />
                                        </svg>

                                        <svg
                                            className="absolute transform -rotate-90 animate-spin"
                                            style={{ animationDuration: "3s" }}
                                            width="200"
                                            height="200"
                                            viewBox="0 0 200 200"
                                        >
                                            <circle
                                                cx="100"
                                                cy="100"
                                                r="75"
                                                stroke="url(#gradient2)"
                                                strokeWidth="4"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeDasharray="20 200"
                                                opacity="0.5"
                                            />
                                        </svg>

                                        <div className="absolute flex flex-col items-center justify-center">
                                            <div className="text-7xl font-bold bg-linear-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                                                {progress}
                                            </div>
                                            <div className="text-xl font-semibold text-white/80 mt-2">%</div>
                                        </div>

                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            {[...Array(8)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="absolute w-2 h-2 rounded-full bg-linear-to-r from-cyan-400 to-pink-400"
                                                    style={{
                                                        animation: `orbit ${2 + i * 0.2}s linear infinite`,
                                                        animationDelay: `${i * 0.2}s`,
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-8 w-64">
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                                            <div
                                                className="h-full bg-linear-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out shadow-lg"
                                                style={{
                                                    width: `${progress}%`,
                                                    boxShadow: "0 0 20px rgba(139, 92, 246, 0.6)",
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <p className="mt-6 text-sm text-white/70 font-medium">
                                        {afterSinkronisasi ? selectedPendaftaranIds.length + ' data telah di sinkronisasi' : 'Loading...'}
                                    </p>
                                </div>
                            ) : (
                                <h3 className="flex justify-center items-center">
                                    {selectedPendaftaranIds.length} data akan di Sinkronisasi ke Sistem Sevima
                                </h3>
                            )
                        }
                    </div>
                    {
                        beforeSinkronisasi == afterSinkronisasi && (
                            <DialogFooter>
                                <Button
                                    className="mx-2  hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer"
                                    variant={'default'}
                                    onClick={() => setOpenDialogSinkronisasi(false)}
                                >
                                    <X /> Tutup
                                </Button>
                                {
                                    beforeSinkronisasi == false && (
                                <Button
                                    className="mx-2  hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer"
                                    variant={'default'}
                                    onClick={() => runLoadSinkronisasi()}
                                >
                                    <FolderSync /> Sinkronisasi
                                </Button>
                                    )
                                }
                            </DialogFooter>
                        )
                    }
                </DialogContent>
            </Dialog>
            {/* Dialog Informasi  */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="w-full max-h-[80vh]  overflow-y-scroll">
                    <DialogHeader>
                        <DialogTitle>Informasi Detail</DialogTitle>
                        <DialogDescription>
                            Informasi detail mengenai Mahasiswa dan Penetapan Sk
                        </DialogDescription>
                    </DialogHeader>
                    <div className="w-full justify-center md:justify-between">
                        <div className="grid grid-cols-1 gap-4 py-4">
                            <div className="grid w-full items-center gap-3">
                                <Label htmlFor="Nama">Nama</Label>
                                <Input type="text" readOnly defaultValue={dataSelected.Nama} id="Nama" placeholder="Nama" />
                            </div>
                            <div className="grid w-full items-center gap-3">
                                <Label htmlFor="Nama">Email</Label>
                                <Input type="text" readOnly defaultValue={dataSelected.Email} id="Email" placeholder="Email" />
                            </div>
                            <div className="grid w-full items-center gap-3">
                                <Label htmlFor="Nama">NomorHp</Label>
                                <Input type="text" readOnly defaultValue={dataSelected.NomorHp} id="NomorHp" placeholder="NomorHp" />
                            </div>
                            <div className="grid w-full items-center gap-3">
                                <Label htmlFor="Nama">KodePendaftar</Label>
                                <Input type="text" readOnly defaultValue={dataSelected.KodePendaftar} id="KodePendaftar" placeholder="KodePendaftar" />
                            </div>
                            <div className="grid w-full items-center gap-3">
                                <Label htmlFor="Nama">ProgramStudi</Label>
                                <Input type="text" readOnly defaultValue={dataSelected.ProgramStudi} id="ProgramStudi" placeholder="ProgramStudi" />
                            </div>
                            <div className="grid w-full items-center gap-3">
                                <Label htmlFor="Nama">NomorSk</Label>
                                <Input type="text" readOnly defaultValue={dataSelected.NomorSk} id="NomorSk" placeholder="NomorSk" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            className="mx-2  hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer"
                            variant={'default'}
                            onClick={() => setOpenDialog(false)}
                        >
                            <X /> Tutup
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <style jsx>{`
          @keyframes orbit {
            0% {
              transform: rotate(0deg) translateX(100px) rotate(0deg);
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
            100% {
              transform: rotate(360deg) translateX(100px) rotate(-360deg);
              opacity: 0;
            }
          }
        `}</style>
        </div>
    )
}
