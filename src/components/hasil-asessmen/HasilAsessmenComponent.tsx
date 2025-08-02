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
    InfoIcon,
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
    ResponseFinalAsessmenAsesorPaginationType,
    ResponseFinalAsessmenPaginationType,
} from '@/types/FinalAsessmen'
import {
    getResponseFinalAsessmenAkademikPaginationType,
    getResponseFinalAsessmenAsesorPaginationType,
    getResponseFinalAsessmenPaginationType,
} from '@/services/Asessment/HasilAsessmentService'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { useRouter } from 'next/navigation'

const HasilAsessmenComponent = () => {
    const router = useRouter()
    const [role, setRole] = React.useState<{
        GuardName: string
        Icon: string
        Name: string
        RoleId: string
    } | null>(null)
    const [dataMahasiswa, setDataMahasiswa] = React.useState<
        ResponseFinalAsessmenPaginationType[]
    >([])
    const [dataAsesor, setDataAsesor] = React.useState<
        ResponseFinalAsessmenAsesorPaginationType[]
    >([])
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

    function getAllData(role: {
        GuardName: string
        Icon: string
        Name: string
        RoleId: string
    }) {
        setLoading(true)
        if (role.Name.match('Mahasiswa')) {
            getResponseFinalAsessmenPaginationType(
                paginationState.page,
                paginationState.limit,
                search,
                role?.RoleId
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
                    setLoading(false)
                })
        } else if (role.Name.match('Akademik')) {
            getResponseFinalAsessmenAkademikPaginationType(
                paginationState.page,
                paginationState.limit,
                search,
                role?.RoleId
            )
                .then((res) => {
                    setDataAsesor(res.data)
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
                    setLoading(false)
                })
        } else {
            getResponseFinalAsessmenAsesorPaginationType(
                paginationState.page,
                paginationState.limit,
                search,
                role?.RoleId
            )
                .then((res) => {
                    setDataAsesor(res.data)
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
                    setLoading(false)
                })
        }
    }
    React.useEffect(() => {
        if (!role) {
            const rolelogin = localStorage.getItem('pmb.iti.role')
            if (rolelogin) {
                let temp = JSON.parse(rolelogin)
                setRole(temp)
                getAllData(temp)
            }
        }
        if (role) {
            getAllData(role)
        }
    }, [paginationState.page, search, paginationState.limit])

    const columnsAsesor: ColumnDef<ResponseFinalAsessmenAsesorPaginationType>[] =
        [
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
                accessorKey: 'KodePendaftar',
                header: 'Kode Pendaftar',
                cell: ({ row }) => (
                    <div className="capitalize">
                        {row.getValue('KodePendaftar')}
                    </div>
                ),
            },
            {
                accessorKey: 'NoUjian',
                header: 'No. Ujian',
                cell: ({ row }) => (
                    <div className="capitalize">{row.getValue('NoUjian')}</div>
                ),
            },
            {
                accessorKey: 'Periode',
                header: 'Periode',
                cell: ({ row }) => (
                    <div className="capitalize">{row.getValue('Periode')}</div>
                ),
            },
            {
                accessorKey: 'Urutan',
                header: 'Urutan',
                cell: ({ row }) => (
                    <div className="capitalize">
                        <ol>
                            {row.original.Asesor.sort(
                                (a, b) => a.Urutan - b.Urutan
                            ).map((x, index) => (
                                <li key={index}>{x.Urutan + ': ' + x.Nama}</li>
                            ))}
                        </ol>
                    </div>
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
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => gotoDetail(jd.PendaftaranId)}
                                >
                                    Lihat Detail
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )
                },
            },
        ]
    const columnsMahasiswa: ColumnDef<ResponseFinalAsessmenPaginationType>[] = [
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
            accessorKey: 'KodePendaftar',
            header: 'Kode Pendaftar',
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.getValue('KodePendaftar')}
                </div>
            ),
        },
        {
            accessorKey: 'NoUjian',
            header: 'No. Ujian',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('NoUjian')}</div>
            ),
        },
        {
            accessorKey: 'Periode',
            header: 'Periode',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('Periode')}</div>
            ),
        },
        {
            accessorKey: 'Urutan',
            header: 'Urutan',
            cell: ({ row }) => (
                <div className="capitalize">
                    <ol>
                        {row.original.Asesor.sort(
                            (a, b) => a.Urutan - b.Urutan
                        ).map((x, index) => (
                            <li key={index}>{x.Urutan + ': ' + x.Nama}</li>
                        ))}
                    </ol>
                </div>
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
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => gotoDetail(jd.PendaftaranId)}
                            >
                                Lihat Detail
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    const gotoDetail = (id: string) => {
        router.push('/asessment/hasil-asessmen/' + id)
    }

    type TableData =
        | ResponseFinalAsessmenPaginationType
        | ResponseFinalAsessmenAsesorPaginationType

    const isMahasiswa = role?.Name === 'Mahasiswa'
    const table = useReactTable<TableData>({
        data: isMahasiswa
            ? (dataMahasiswa as TableData[])
            : (dataAsesor as TableData[]),
        columns: isMahasiswa
            ? (columnsMahasiswa as ColumnDef<TableData>[])
            : (columnsAsesor as ColumnDef<TableData>[]),
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
            <div className="grid grid-cols-1 gap-3 mb-3">
                <Alert>
                    <InfoIcon />
                    <AlertTitle>Pemberitahuan</AlertTitle>
                    <AlertDescription>
                        SK Rektor akan dibuat setelah bagian akademik memproses
                        Hasil Final Asessmen
                    </AlertDescription>
                </Alert>
            </div>
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
                                        colSpan={
                                            role?.Name === 'Mahasiswa'
                                                ? columnsMahasiswa.length
                                                : columnsAsesor.length
                                        }
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

export default HasilAsessmenComponent
