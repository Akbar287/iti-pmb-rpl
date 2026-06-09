'use client'
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
import React from 'react'
import { safeStorage } from '@/lib/safe-storage'
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
import { BookCheck, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
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
import { getMahasiswaFromAsesorRekapitulasi } from '@/services/Asessment/AsessmentMahasiswaService'
import { Badge } from '../ui/badge'
import { ResponseMhsFromAsesorSession } from '@/types/PenunjukanAsesor'
import { useRouter } from 'next/navigation'
import Swal from '@/lib/swal'
import { setStatusSanggahan } from '@/services/Status/StatusService'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'

const RekapitulasiComponent = () => {
    const router = useRouter()
    const [dataMahasiswa, setDataMahasiswa] = React.useState<
        ResponseMhsFromAsesorSession[]
    >([])
    const [role, setRole] = React.useState<{
        GuardName: string
        Icon: string
        Name: string
        RoleId: string
    } | null>(null)
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
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
        limit: 5,
        totalElement: 0,
        totalPage: 0,
        isFirst: false,
        isLast: false,
        hasNext: false,
        hasPrevious: false,
    })
    const [search, setSearch] = React.useState<string>('')
    const [loading, setLoading] = React.useState<boolean>(false)

    const startAsessment = (PendaftaranId: string) => {
        router.push('/asessment/rekapitulasi/' + PendaftaranId)
    }

    const continueSanggahan = (dt: ResponseMhsFromAsesorSession) => {
        Swal.fire({
            title: 'Lanjutkan ke Proses Sanggahan ?',
            text:
                'Lanjutkan Asessmen Calon Mahasiswa ' +
                dt.Nama +
                ' ke Proses Sanggahan. Aksi ini tidak dapat di undo',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f45f24',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Lanjutkan!',
            cancelButtonText: 'Batalkan',
        }).then((result) => {
            if (result.isConfirmed) {
                setStatusSanggahan(dt.PendaftaranId).then(() => {
                    setDataMahasiswa(
                        dataMahasiswa.filter(
                            (x) => x.PendaftaranId !== dt.PendaftaranId
                        )
                    )
                    Swal.fire({
                        title: 'Berhasil!',
                        text:
                            'Asessmen ' +
                            dt.Nama +
                            ' dilanjutkan ke Proses Sanggahan.',
                        icon: 'success',
                    })
                })
            }
        })
    }

    React.useEffect(() => {
        let currentRole = role
        if (!currentRole) {
            const rolelogin = safeStorage.getItem('pmb.iti.role')
            if (rolelogin) {
                currentRole = JSON.parse(rolelogin)
                setRole(currentRole)
            }
        }

        if (currentRole) {
            setLoading(true)
            getMahasiswaFromAsesorRekapitulasi(
                paginationState.page,
                paginationState.limit,
                search,
                currentRole.Name
            )
                .then((res) => {
                    setDataMahasiswa(res.data)
                    setLoading(false)
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
                })
                .catch((err) => {
                    console.error(err)
                    toast.error('Failed to fetch mahasiswa from asesor')
                }).finally(() => {
                    setLoading(false)
                })
        }
    }, [paginationState.page, search, paginationState.limit, role])

    const columns: ColumnDef<ResponseMhsFromAsesorSession>[] = role?.Name === 'Mahasiswa' ? [
        {
            accessorKey: 'Nama',
            header: 'Nama',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('Nama')}</div>
            ),
        },
        {
            accessorKey: 'NamaProgramStudi',
            header: 'Program Studi',
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.getValue('NamaProgramStudi')}
                </div>
            ),
        },
        {
            accessorKey: 'Confirmation',
            header: 'Terkonfirmasi',
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.getValue('Confirmation') ? (
                        <Badge>Konfirm</Badge>
                    ) : (
                        <Badge>Tidak</Badge>
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'TotalAsessmen',
            header: 'Total Asessmen MK',
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.getValue('TotalAsessmen')}
                </div>
            ),
        },
        {
            accessorKey: 'TotalEval',
            header: 'Total MK',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('TotalEval')}</div>
            ),
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }) => {
                const jd = row.original
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
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        jd.PendaftaranId
                                    )
                                    toast(
                                        'Pendaftaran Mahasiswa ID dicopy ke clipboard'
                                    )
                                }}
                            >
                                Copy Pendaftaran Mahasiswa ID
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ] : [
        {
            accessorKey: 'Nama',
            header: 'Nama',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('Nama')}</div>
            ),
        },
        {
            accessorKey: 'NamaProgramStudi',
            header: 'Program Studi',
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.getValue('NamaProgramStudi')}
                </div>
            ),
        },
        {
            accessorKey: 'Urutan',
            header: 'Urutan',
            cell: ({ row }) => (
                <div className="capitalize">
                    Asesor Ke {row.getValue('Urutan')}
                </div>
            ),
        },
        {
            accessorKey: 'Confirmation',
            header: 'Terkonfirmasi',
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.getValue('Confirmation') ? (
                        <Badge>Konfirm</Badge>
                    ) : (
                        <Badge>Tidak</Badge>
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'TotalAsessmen',
            header: 'Total Asessmen MK',
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.getValue('TotalAsessmen')}
                </div>
            ),
        },
        {
            accessorKey: 'TotalEval',
            header: 'Total MK',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('TotalEval')}</div>
            ),
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }) => {
                const jd = row.original
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
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        jd.PendaftaranId
                                    )
                                    toast(
                                        'Pendaftaran Mahasiswa ID dicopy ke clipboard'
                                    )
                                }}
                            >
                                Copy Pendaftaran Mahasiswa ID
                            </DropdownMenuItem>
                            {
                                role?.Name == 'Asesor' && <DropdownMenuSeparator />
                            }
                            {role?.Name == 'Asesor' && jd.Status === 'Rekapitulasi Asessmen' &&
                                (
                                    <DropdownMenuItem
                                        onClick={() =>
                                            startAsessment(jd.PendaftaranId)
                                        }
                                    >
                                        Mulai Rekapitulasi
                                    </DropdownMenuItem>
                                )}
                            {jd.TotalEval === jd.TotalAsessmen &&
                                jd.Status === 'Rekapitulasi Asessmen' && (
                                    <DropdownMenuItem
                                        onClick={() => continueSanggahan(jd)}
                                    >
                                        Lanjutkan Ke Sanggahan
                                    </DropdownMenuItem>
                                )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    const table = useReactTable({
        data: dataMahasiswa,
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
            <Alert>
                <BookCheck />
                <AlertTitle>Mata Kuliah!</AlertTitle>
                <AlertDescription>
                    Rekapitulasi Asessmen ini adalah Mata Kuliah yang dipilih mahasiswa berdasarkan pilihan Perolehan SKS.
                </AlertDescription>
            </Alert>
            <div className="flex items-center py-4">
                <Input
                    placeholder="Cari Data ..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="max-w-sm"
                />
                <div className="w-full justify-end flex">
                    <Select
                        value={String(paginationState.limit)}
                        onValueChange={(value) =>
                            setPaginationState({
                                ...paginationState,
                                limit: Number(value),
                            })
                        }
                    >
                        <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Pilih Limit Data" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Pilih Limit Data</SelectLabel>
                                {[5, 10, 20, 50, 75, 100].map((l, idx) => (
                                    <SelectItem value={String(l)} key={idx}>
                                        {l}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {loading ? (
                <div className="space-y-2">
                    {Array.from({ length: paginationState.limit }).map(
                        (_, i) => (
                            <div key={i} className="flex space-x-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-[60%]" />
                                    <Skeleton className="h-4 w-[40%]" />
                                </div>
                            </div>
                        )
                    )}
                </div>
            ) : (
                <div className="rounded-md border">
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
                                                        header.column
                                                            .columnDef.header,
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
                                        data-state={
                                            row.getIsSelected() && 'selected'
                                        }
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
                                        Tidak Ada Data.
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
                    {paginationState.page * paginationState.limit -
                        paginationState.limit +
                        1}{' '}
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
                        onClick={() => {
                            setPaginationState({
                                ...paginationState,
                                page: paginationState.page - 1,
                            })
                        }}
                        disabled={!paginationState.hasPrevious}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>

                    {Array.from(
                        { length: paginationState.totalPage },
                        (_, i) => i + 1
                    ).map((p) => (
                        <Button
                            key={p}
                            variant={
                                p === paginationState.page
                                    ? 'default'
                                    : 'outline'
                            }
                            size="sm"
                            onClick={() => {
                                if (paginationState.page !== p) {
                                    setPaginationState({
                                        ...paginationState,
                                        page: p,
                                    })
                                }
                            }}
                        >
                            {p}
                        </Button>
                    ))}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setPaginationState({
                                ...paginationState,
                                page: paginationState.page + 1,
                            })
                        }}
                        disabled={!paginationState.hasNext}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default RekapitulasiComponent
