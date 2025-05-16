'use client'

import React from 'react'
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import {
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    PenIcon,
    Timer,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { replaceItemAtIndex, truncateText } from '@/lib/utils'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import { toast } from 'sonner'
import Swal from 'sweetalert2'
import { useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CapaianPembelajaran, MataKuliah } from '@/generated/prisma'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../ui/card'
import {
    CapaianPembelajaranFormValidation,
    CapaianPembelajaranSchemaValidation,
} from '@/validation/CapaianPembelajaran'
import {
    deleteCapaianPembelajaran,
    getCapaianPembelajaranPagination,
    setCapaianPembelajaran,
    updateCapaianPembelajaran,
} from '@/services/ManajemenPembelajaran/CapaianService'
import { Badge } from '../ui/badge'

const CapaianPembelajaranComponent = ({
    universityDataServer,
}: {
    universityDataServer: {
        Nama: string
        UniversityId: string
        Akreditasi: string
        ProgramStudi: {
            Nama: string
            Jenjang: string | null
            Akreditasi: string
            ProgramStudiId: string
            MataKuliah: {
                MataKuliahId: string
                Nama: string
                Sks: number
                Kode: string
            }[]
        }[]
    }[]
}) => {
    const [selectedMataKuliah, setSelectedMataKuliah] = React.useState<{
        UniversityId: string
        ProgramStudiId: string
        NamaUniversity: string
        NamaProgramStudi: string
        MataKuliahId: string
        NamaMataKuliah: string
    }>({
        UniversityId: '',
        NamaUniversity: '',
        ProgramStudiId: '',
        NamaProgramStudi: '',
        MataKuliahId: '',
        NamaMataKuliah: '',
    })
    const [dataCapaianPembelajaran, setDataCapaianPembelajaran] =
        React.useState<CapaianPembelajaran[]>([])
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
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
    const [search, setSearch] = React.useState('')
    const [titleDialog, setTitleDialog] = React.useState('')
    const [loading, setLoading] = React.useState<boolean>(false)

    // Manage Data
    const [openDialogCapaianPembelajaran, setOpenDialogCapaianPembelajaran] =
        React.useState<boolean>(false)

    const createManageData = () => {
        form.reset()
        form.setValue('MataKuliahId', selectedMataKuliah.MataKuliahId)
        setTitleDialog('Tambah Capaian Pembelajaran')
        setOpenDialogCapaianPembelajaran(true)
    }

    const setManageData = async (data: CapaianPembelajaran) => {
        setOpenDialogCapaianPembelajaran(true)
        setTitleDialog('Ubah Capaian Pembelajaran')
        form.setValue('CapaianPembelajaranId', data.CapaianPembelajaranId)
        form.setValue('MataKuliahId', data.MataKuliahId)
        form.setValue('Nama', data.Nama)
        form.setValue('Urutan', data.Urutan)
        form.setValue('Active', data.Active)
    }

    const form = useForm<CapaianPembelajaranFormValidation>({
        resolver: zodResolver(CapaianPembelajaranSchemaValidation),
        defaultValues: {
            CapaianPembelajaranId: '',
            MataKuliahId: '',
            Nama: '',
            Urutan: 0,
            Active: false,
        },
    })

    const onSubmit = async (data: CapaianPembelajaranFormValidation) => {
        setLoading(true)

        if (titleDialog === 'Ubah Capaian Pembelajaran') {
            await updateCapaianPembelajaran({
                CapaianPembelajaranId: data.CapaianPembelajaranId,
                MataKuliahId: data.MataKuliahId,
                Nama: data.Nama,
                Urutan: data.Urutan,
                Active: data.Active,
                CreatedAt: null,
                UpdatedAt: null,
                DeletedAt: null,
            })
                .then((res) => {
                    toast('Data Capaian Pembelajaran berhasil diubah')
                    let idx = dataCapaianPembelajaran.findIndex(
                        (x) =>
                            x.CapaianPembelajaranId ===
                            data.CapaianPembelajaranId
                    )
                    setDataCapaianPembelajaran(
                        replaceItemAtIndex(dataCapaianPembelajaran, idx, res)
                    )
                    setOpenDialogCapaianPembelajaran(false)
                    setLoading(false)
                })
                .catch((err) => {
                    toast(
                        'Data Capaian Pembelajaran gagal diubah. Error: ' + err
                    )
                    setLoading(false)
                })
        } else {
            await setCapaianPembelajaran({
                CapaianPembelajaranId: '',
                MataKuliahId: data.MataKuliahId,
                Nama: data.Nama,
                Urutan: data.Urutan,
                Active: data.Active,
                CreatedAt: null,
                UpdatedAt: null,
                DeletedAt: null,
            })
                .then((res) => {
                    toast('Data Capaian Pembelajaran berhasil ditambah')
                    setDataCapaianPembelajaran([
                        ...dataCapaianPembelajaran,
                        res,
                    ])
                    setLoading(false)
                    setOpenDialogCapaianPembelajaran(false)
                })
                .catch((err) => {
                    toast(
                        'Data Capaian Pembelajaran gagal ditambah. Error: ' +
                            err
                    )
                    setLoading(false)
                })
        }
    }

    const hapusData = (data: CapaianPembelajaran) => {
        Swal.fire({
            title: 'Hapus Data ' + data.Nama + ' ?',
            text: 'Aksi ini tidak dapat di undo',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f45f24',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteCapaianPembelajaran(data.CapaianPembelajaranId)
                    .then(() => {
                        setDataCapaianPembelajaran(
                            dataCapaianPembelajaran.filter(
                                (r) =>
                                    r.CapaianPembelajaranId !==
                                    data.CapaianPembelajaranId
                            )
                        )
                        Swal.fire({
                            title: 'Tereset!',
                            text: 'Data sudah dihapus.',
                            icon: 'success',
                        })
                    })
                    .catch((err) => {
                        toast('Data gagal dihapus. Error: ' + err)
                    })
            }
        })
    }
    // End Manage Data

    React.useEffect(() => {
        setLoading(true)
        getCapaianPembelajaranPagination(
            paginationState.page,
            paginationState.limit,
            search,
            selectedMataKuliah.MataKuliahId || ''
        )
            .then((res) => {
                setDataCapaianPembelajaran(
                    res.data.sort((a, b) => a.Urutan - b.Urutan)
                )
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
    }, [
        paginationState.page,
        search,
        paginationState.limit,
        selectedMataKuliah.MataKuliahId,
    ])

    const columns: ColumnDef<CapaianPembelajaran>[] = [
        {
            accessorKey: 'Nama',
            header: 'Nama',
            cell: ({ row }) => (
                <div className="capitalize">
                    {truncateText(row.getValue('Nama'), 50)}
                </div>
            ),
        },
        {
            accessorKey: 'Urutan',
            header: 'Urutan',
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.getValue('Urutan') ?? '-'}
                </div>
            ),
        },
        {
            accessorKey: 'Active',
            header: 'Aktif',
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.getValue('Active') ? (
                        <Badge variant="outline">Aktif</Badge>
                    ) : (
                        <Badge variant="secondary">Tidak Aktif</Badge>
                    )}
                </div>
            ),
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }) => {
                const user = row.original
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
                                    navigator.clipboard.writeText(
                                        user.CapaianPembelajaranId
                                    )
                                }
                            >
                                Copy Capaian Pembelajaran ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => setManageData(user)}
                            >
                                Manage Data
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => hapusData(user)}>
                                Hapus Data
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    const table = useReactTable({
        data: dataCapaianPembelajaran,
        columns,
        onSortingChange: setSorting,
        manualPagination: true,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        pageCount: paginationState.totalPage,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className="w-full">
            <Card className="bg-gray-50 shadow-md dark:bg-gray-800">
                <CardHeader>
                    <CardTitle>
                        <h1 className="text-2xl">Mata Kuliah</h1>
                    </CardTitle>
                    <CardDescription>Catat Mata Kuliah Anda</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="w-full">
                            <h1>Pilih Universitas</h1>
                            <Select
                                value={selectedMataKuliah.UniversityId}
                                onValueChange={(e) => {
                                    const selectedUniversity =
                                        universityDataServer.find(
                                            (x) => x.UniversityId === e
                                        )
                                    setSelectedMataKuliah({
                                        UniversityId: e,
                                        NamaUniversity:
                                            selectedUniversity?.Nama || '',
                                        ProgramStudiId: '',
                                        NamaProgramStudi: '',
                                        MataKuliahId: '',
                                        NamaMataKuliah: '',
                                    })
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Universitas" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>
                                            Pilih Universitas
                                        </SelectLabel>
                                        {universityDataServer.map((m) => (
                                            <SelectItem
                                                key={m.UniversityId}
                                                value={m.UniversityId}
                                            >
                                                {m.Nama} - {m.Akreditasi}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full">
                            <h1>Pilih Program Studi</h1>
                            <Select
                                value={selectedMataKuliah.ProgramStudiId}
                                disabled={
                                    selectedMataKuliah.UniversityId === ''
                                }
                                onValueChange={(e) => {
                                    const temp = universityDataServer.find(
                                        (x) =>
                                            x.UniversityId ===
                                            selectedMataKuliah.UniversityId
                                    )
                                    const selectedProgram =
                                        temp?.ProgramStudi.find(
                                            (x) => x.ProgramStudiId === e
                                        )
                                    setSelectedMataKuliah({
                                        UniversityId:
                                            selectedMataKuliah.UniversityId,
                                        NamaUniversity:
                                            selectedMataKuliah.NamaUniversity,
                                        ProgramStudiId: e,
                                        NamaProgramStudi:
                                            selectedProgram?.Nama || '',
                                        MataKuliahId: '',
                                        NamaMataKuliah: '',
                                    })
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Program Studi" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>
                                            Pilih Program Studi
                                        </SelectLabel>
                                        {universityDataServer
                                            .find(
                                                (x) =>
                                                    x.UniversityId ===
                                                    selectedMataKuliah.UniversityId
                                            )
                                            ?.ProgramStudi.map((m) => (
                                                <SelectItem
                                                    key={m.ProgramStudiId}
                                                    value={m.ProgramStudiId}
                                                >
                                                    {m.Nama} - {m.Akreditasi}
                                                </SelectItem>
                                            ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full">
                            <h1>Pilih Mata Kuliah</h1>
                            <Select
                                value={selectedMataKuliah.MataKuliahId}
                                disabled={
                                    selectedMataKuliah.ProgramStudiId === ''
                                }
                                onValueChange={(e) => {
                                    setPaginationState({
                                        ...paginationState,
                                        page: 1,
                                    })
                                    const temp = universityDataServer
                                        .find(
                                            (x) =>
                                                x.UniversityId ===
                                                selectedMataKuliah.UniversityId
                                        )
                                        ?.ProgramStudi.find(
                                            (y) =>
                                                y.ProgramStudiId ===
                                                selectedMataKuliah.ProgramStudiId
                                        )

                                    const selectedProgram =
                                        temp?.MataKuliah.find(
                                            (x) => x.MataKuliahId === e
                                        )
                                    setSelectedMataKuliah({
                                        UniversityId:
                                            selectedMataKuliah.UniversityId,
                                        NamaUniversity:
                                            selectedMataKuliah.NamaUniversity,
                                        ProgramStudiId:
                                            selectedMataKuliah.ProgramStudiId,
                                        NamaProgramStudi:
                                            selectedMataKuliah.NamaProgramStudi,
                                        MataKuliahId: e,
                                        NamaMataKuliah:
                                            selectedProgram?.Nama || '',
                                    })
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Program Studi" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>
                                            Pilih Mata Kuliah
                                        </SelectLabel>
                                        {universityDataServer
                                            .find(
                                                (x) =>
                                                    x.UniversityId ===
                                                    selectedMataKuliah.UniversityId
                                            )
                                            ?.ProgramStudi.find(
                                                (y) =>
                                                    y.ProgramStudiId ===
                                                    selectedMataKuliah.ProgramStudiId
                                            )
                                            ?.MataKuliah.map((m) => (
                                                <SelectItem
                                                    key={m.MataKuliahId}
                                                    value={m.MataKuliahId}
                                                >
                                                    {m.Nama}
                                                </SelectItem>
                                            ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>
            {selectedMataKuliah.MataKuliahId !== '' && (
                <>
                    <div className="flex items-center py-4">
                        <Input
                            placeholder="Filter Nama Mata Kuliah..."
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
                        <div className="w-full justify-end flex">
                            <Button
                                className="mr-2"
                                onClick={() => createManageData()}
                            >
                                Tambah
                            </Button>
                            <Select
                                value={String(paginationState.limit)}
                                onValueChange={(value) => {
                                    setPaginationState({
                                        ...paginationState,
                                        page: 1,
                                        limit: Number(value),
                                    })
                                }}
                            >
                                <SelectTrigger className="w-[100px]">
                                    <SelectValue placeholder="Pilih Limit Data" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>
                                            Pilih Limit Data
                                        </SelectLabel>
                                        {[5, 10, 20, 50, 75, 100].map(
                                            (l, idx) => (
                                                <SelectItem
                                                    value={String(l)}
                                                    key={idx}
                                                >
                                                    {l}
                                                </SelectItem>
                                            )
                                        )}
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
                                    {table
                                        .getHeaderGroups()
                                        .map((headerGroup) => (
                                            <TableRow key={headerGroup.id}>
                                                {headerGroup.headers.map(
                                                    (header) => {
                                                        return (
                                                            <TableHead
                                                                key={header.id}
                                                            >
                                                                {header.isPlaceholder
                                                                    ? null
                                                                    : flexRender(
                                                                          header
                                                                              .column
                                                                              .columnDef
                                                                              .header,
                                                                          header.getContext()
                                                                      )}
                                                            </TableHead>
                                                        )
                                                    }
                                                )}
                                            </TableRow>
                                        ))}
                                </TableHeader>
                                <TableBody>
                                    {table.getRowModel().rows?.length ? (
                                        table.getRowModel().rows.map((row) => (
                                            <TableRow
                                                key={row.id}
                                                data-state={
                                                    row.getIsSelected() &&
                                                    'selected'
                                                }
                                            >
                                                {row
                                                    .getVisibleCells()
                                                    .map((cell) => (
                                                        <TableCell
                                                            key={cell.id}
                                                        >
                                                            {flexRender(
                                                                cell.column
                                                                    .columnDef
                                                                    .cell,
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
                                : paginationState.page *
                                  paginationState.limit}{' '}
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

                            {(() => {
                                const pages = []
                                const { page, totalPage } = paginationState

                                const shouldShowLeftDots = page > 3
                                const shouldShowRightDots = page < totalPage - 2

                                const renderPage = (p: number) => (
                                    <Button
                                        key={p}
                                        variant={
                                            p === page ? 'default' : 'outline'
                                        }
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

                                pages.push(renderPage(1))

                                if (shouldShowLeftDots) {
                                    pages.push(<span key="left-dots">...</span>)
                                }

                                for (let i = page - 1; i <= page + 1; i++) {
                                    if (i > 1 && i < totalPage) {
                                        pages.push(renderPage(i))
                                    }
                                }

                                if (shouldShowRightDots) {
                                    pages.push(
                                        <span key="right-dots">...</span>
                                    )
                                }

                                if (totalPage > 1) {
                                    pages.push(renderPage(totalPage))
                                }

                                return pages
                            })()}

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
                </>
            )}
            <SheetManageData
                openDialogCapaianPembelajaran={openDialogCapaianPembelajaran}
                setOpenDialogCapaianPembelajaran={
                    setOpenDialogCapaianPembelajaran
                }
                selectedMataKuliah={selectedMataKuliah}
                form={form}
                onSubmit={onSubmit}
                loading={loading}
                titleDialog={titleDialog}
            />
        </div>
    )
}

export default CapaianPembelajaranComponent

export function SheetManageData({
    openDialogCapaianPembelajaran,
    setOpenDialogCapaianPembelajaran,
    selectedMataKuliah,
    form,
    onSubmit,
    loading,
    titleDialog,
}: {
    openDialogCapaianPembelajaran: boolean
    setOpenDialogCapaianPembelajaran: React.Dispatch<
        React.SetStateAction<boolean>
    >
    selectedMataKuliah: {
        UniversityId: string
        ProgramStudiId: string
        NamaUniversity: string
        NamaProgramStudi: string
        MataKuliahId: string
        NamaMataKuliah: string
    }
    form: UseFormReturn<CapaianPembelajaranFormValidation>
    onSubmit: (data: CapaianPembelajaranFormValidation) => void
    loading: boolean
    titleDialog: string
}) {
    return (
        <div className="grid grid-cols-2 gap-2">
            <Sheet
                open={openDialogCapaianPembelajaran}
                onOpenChange={setOpenDialogCapaianPembelajaran}
            >
                <SheetContent
                    side="right"
                    className="w-screen h-screen max-w-full overflow-scroll"
                >
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <SheetHeader>
                                <SheetTitle>{titleDialog}</SheetTitle>
                                <SheetDescription>
                                    Manage Data Capaian Pembelajaran
                                </SheetDescription>
                            </SheetHeader>
                            {loading ? (
                                <div className="w-full grid grid-cols-1 gap-3 px-4">
                                    <Skeleton className="w-full h-20" />
                                    <Skeleton className="w-full h-20" />
                                    <Skeleton className="w-full h-20" />
                                    <Skeleton className="w-full h-20" />
                                </div>
                            ) : (
                                <div className="w-full grid grid-cols-1 gap-3 px-4">
                                    <div className="container mx-auto">
                                        <div className="grid grid-cols-1 gap-3">
                                            <FormField
                                                control={form.control}
                                                name="MataKuliahId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Mata Kuliah
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly
                                                                {...field}
                                                                value={
                                                                    selectedMataKuliah.NamaMataKuliah
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Nama Mata Kuliah
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="Nama"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Nama
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Nama
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="Urutan"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Urutan
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                value={form.getValues(
                                                                    'Urutan'
                                                                )}
                                                                onChange={(e) =>
                                                                    form.setValue(
                                                                        'Urutan',
                                                                        Number(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    )
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Urutan Capaian
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="Active"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Aktif
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                disabled={
                                                                    loading
                                                                }
                                                                value={
                                                                    String(
                                                                        field.value
                                                                    ) ?? false
                                                                }
                                                                onValueChange={(
                                                                    val
                                                                ) =>
                                                                    field.onChange(
                                                                        val ===
                                                                            'true'
                                                                    )
                                                                }
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Aktif" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectGroup>
                                                                        <SelectLabel>
                                                                            Aktif
                                                                        </SelectLabel>
                                                                        <SelectItem value="false">
                                                                            Tidak
                                                                            Aktif
                                                                        </SelectItem>
                                                                        <SelectItem value="true">
                                                                            Aktif
                                                                        </SelectItem>
                                                                    </SelectGroup>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Pilih Aktif.
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <SheetFooter>
                                <Button type="submit" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Timer />
                                            Loading
                                        </>
                                    ) : (
                                        <>
                                            <PenIcon /> Simpan
                                        </>
                                    )}
                                </Button>
                            </SheetFooter>
                        </form>
                    </Form>
                </SheetContent>
            </Sheet>
        </div>
    )
}
