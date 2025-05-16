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
import { replaceItemAtIndex } from '@/lib/utils'
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
import { MataKuliah } from '@/generated/prisma'
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
    deleteMataKuliah,
    getMataKuliahPagination,
    setMataKuliah,
    updateMataKuliah,
} from '@/services/ManajemenPembelajaran/MataKuliahService'
import {
    MataKuliahFormValidation,
    MataKuliahSchemaValidation,
} from '@/validation/MataKuliahValidation'

const MataKuliahComponent = ({
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
        }[]
    }[]
}) => {
    const [selectedProgramStudi, setSelectedProgramStudi] = React.useState<{
        UniversityId: string
        ProgramStudiId: string
        NamaUniversity: string
        NamaProgramStudi: string
    }>({
        UniversityId: '',
        NamaUniversity: '',
        ProgramStudiId: '',
        NamaProgramStudi: '',
    })
    const [dataMataKuliah, setDataMataKuliah] = React.useState<MataKuliah[]>([])
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
    const [openDialogMataKuliah, setOpenDialogMataKuliah] =
        React.useState<boolean>(false)

    const createManageData = () => {
        setTitleDialog('Tambah Mata Kuliah')
        setOpenDialogMataKuliah(true)
        form.reset()
        form.setValue(
            'ProgramStudiId',
            selectedProgramStudi?.ProgramStudiId || ''
        )
    }

    const setManageData = async (data: MataKuliah) => {
        setOpenDialogMataKuliah(true)
        setTitleDialog('Ubah Mata Kuliah')
        form.setValue('MataKuliahId', data.MataKuliahId)
        form.setValue('ProgramStudiId', data.ProgramStudiId)
        form.setValue('Kode', data.Kode)
        form.setValue('Nama', data.Nama)
        form.setValue('Sks', data.Sks)
        form.setValue('Semester', data.Semester ?? '')
        form.setValue('Silabus', data.Silabus || '')
    }

    const form = useForm<MataKuliahFormValidation>({
        resolver: zodResolver(MataKuliahSchemaValidation),
        defaultValues: {
            MataKuliahId: '',
            ProgramStudiId: '',
            Kode: '',
            Nama: '',
            Sks: 0,
            Semester: '',
            Silabus: '',
        },
    })

    const onSubmit = async (data: MataKuliahFormValidation) => {
        setLoading(true)

        if (titleDialog === 'Ubah Mata Kuliah') {
            await updateMataKuliah({
                MataKuliahId: data.MataKuliahId,
                ProgramStudiId: data.ProgramStudiId,
                Kode: data.Kode,
                Nama: data.Nama,
                Sks: data.Sks,
                Semester: data.Semester || '',
                Silabus: data.Silabus || '',
                CreatedAt: null,
                UpdatedAt: null,
                DeletedAt: null,
            })
                .then((res) => {
                    toast('Data Mata Kuliah berhasil diubah')
                    let idx = dataMataKuliah.findIndex(
                        (x) => x.MataKuliahId === data.MataKuliahId
                    )
                    setDataMataKuliah(
                        replaceItemAtIndex(dataMataKuliah, idx, res)
                    )
                    setOpenDialogMataKuliah(false)
                    setLoading(false)
                })
                .catch((err) => {
                    toast('Data Mata Kuliah gagal diubah. Error: ' + err)
                    setLoading(false)
                })
        } else {
            await setMataKuliah({
                MataKuliahId: '',
                ProgramStudiId: data.ProgramStudiId,
                Kode: data.Kode,
                Nama: data.Nama,
                Sks: data.Sks,
                Semester: data.Semester || '',
                Silabus: data.Silabus || '',
                CreatedAt: null,
                UpdatedAt: null,
                DeletedAt: null,
            })
                .then((res) => {
                    toast('Data Mata Kuliah berhasil ditambah')
                    setDataMataKuliah([...dataMataKuliah, res])
                    setLoading(false)
                    setOpenDialogMataKuliah(false)
                })
                .catch((err) => {
                    toast('Data Mata Kuliah gagal ditambah. Error: ' + err)
                    setLoading(false)
                })
        }
    }

    const hapusData = (data: MataKuliah) => {
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
                deleteMataKuliah(data.MataKuliahId)
                    .then(() => {
                        setDataMataKuliah(
                            dataMataKuliah.filter(
                                (r) => r.MataKuliahId !== data.MataKuliahId
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
        getMataKuliahPagination(
            paginationState.page,
            paginationState.limit,
            search,
            selectedProgramStudi?.ProgramStudiId || ''
        )
            .then((res) => {
                setDataMataKuliah(res.data)
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
        selectedProgramStudi?.ProgramStudiId,
    ])

    const columns: ColumnDef<MataKuliah>[] = [
        {
            accessorKey: 'Kode',
            header: 'Kode',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('Kode')}</div>
            ),
        },
        {
            accessorKey: 'Nama',
            header: 'Nama',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('Nama')}</div>
            ),
        },
        {
            accessorKey: 'Sks',
            header: 'Sks',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('Sks') ?? '-'}</div>
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
                                        user.ProgramStudiId
                                    )
                                }
                            >
                                Copy Mata Kuliah ID
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
        data: dataMataKuliah,
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
                                value={selectedProgramStudi.UniversityId}
                                onValueChange={(e) => {
                                    const selectedUniversity =
                                        universityDataServer.find(
                                            (x) => x.UniversityId === e
                                        )
                                    setSelectedProgramStudi({
                                        UniversityId: e,
                                        NamaUniversity:
                                            selectedUniversity?.Nama || '',
                                        ProgramStudiId: '',
                                        NamaProgramStudi: '',
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
                                value={selectedProgramStudi.ProgramStudiId}
                                disabled={
                                    selectedProgramStudi.UniversityId === ''
                                }
                                onValueChange={(e) => {
                                    setPaginationState({
                                        ...paginationState,
                                        page: 1,
                                    })
                                    const temp = universityDataServer.find(
                                        (x) =>
                                            x.UniversityId ===
                                            selectedProgramStudi.UniversityId
                                    )
                                    const selectedProgram =
                                        temp?.ProgramStudi.find(
                                            (x) => x.ProgramStudiId === e
                                        )
                                    setSelectedProgramStudi({
                                        ...selectedProgram,
                                        UniversityId:
                                            selectedProgramStudi.UniversityId,
                                        NamaUniversity:
                                            selectedProgramStudi.NamaUniversity,
                                        ProgramStudiId: e,
                                        NamaProgramStudi:
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
                                            Pilih Program Studi
                                        </SelectLabel>
                                        {universityDataServer
                                            .find(
                                                (x) =>
                                                    x.UniversityId ===
                                                    selectedProgramStudi.UniversityId
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
                    </div>
                </CardContent>
            </Card>
            {selectedProgramStudi.ProgramStudiId !== '' && (
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
                openDialogMataKuliah={openDialogMataKuliah}
                setOpenDialogMataKuliah={setOpenDialogMataKuliah}
                selectedProgramStudi={selectedProgramStudi}
                form={form}
                onSubmit={onSubmit}
                loading={loading}
                titleDialog={titleDialog}
            />
        </div>
    )
}

export default MataKuliahComponent

export function SheetManageData({
    openDialogMataKuliah,
    setOpenDialogMataKuliah,
    selectedProgramStudi,
    form,
    onSubmit,
    loading,
    titleDialog,
}: {
    openDialogMataKuliah: boolean
    setOpenDialogMataKuliah: React.Dispatch<React.SetStateAction<boolean>>
    selectedProgramStudi: {
        UniversityId: string
        ProgramStudiId: string
        NamaUniversity: string
        NamaProgramStudi: string
    }
    form: UseFormReturn<MataKuliahFormValidation>
    onSubmit: (data: MataKuliahFormValidation) => void
    loading: boolean
    titleDialog: string
}) {
    return (
        <div className="grid grid-cols-2 gap-2">
            <Sheet
                open={openDialogMataKuliah}
                onOpenChange={setOpenDialogMataKuliah}
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
                                    Manage Data Mata Kuliah
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
                                                name="ProgramStudiId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Program Studi
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly
                                                                {...field}
                                                                value={
                                                                    selectedProgramStudi.NamaProgramStudi
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Nama Program Studi
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="Kode"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Kode
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
                                                            Kode Mata Kuliah
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
                                                            Nama Mata Kuliah
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="Sks"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            SKS
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                value={form.getValues(
                                                                    'Sks'
                                                                )}
                                                                onChange={(e) =>
                                                                    form.setValue(
                                                                        'Sks',
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
                                                            SKS Mata Kuliah
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="Semester"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Semester
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
                                                            Semester Mata Kuliah
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="Silabus"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Silabus
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
                                                            Silabus Mata Kuliah
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
