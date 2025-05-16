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
import { Jenjang, ProgramStudi } from '@/generated/prisma'
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
    ProgramStudiFormValidation,
    ProgramStudiSchemaValidation,
} from '@/validation/ProgramStudiValidation'
import {
    deleteProgramStudi,
    getProgramStudiPagination,
    setProgramStudi,
    updateProgramStudi,
} from '@/services/ManajemenPembelajaran/ProgramStudiService'

const ProgramStudiComponent = ({
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
    const [selectedUniversity, setSelectedUniversity] = React.useState<{
        Nama: string
        UniversityId: string
        Akreditasi: string
        ProgramStudi: {
            Nama: string
            Jenjang: string | null
            Akreditasi: string
            ProgramStudiId: string
        }[]
    } | null>(null)
    const [dataProgramStudi, setDataProgramStudi] = React.useState<
        ProgramStudi[]
    >([])
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
    const [openDialogProgramStudi, setOpenDialogProgramStudi] =
        React.useState<boolean>(false)

    const createManageData = () => {
        setTitleDialog('Tambah Program Studi')
        setOpenDialogProgramStudi(true)
        form.reset()
        form.setValue('UniversityId', selectedUniversity?.UniversityId || '')
    }

    const setManageData = async (data: ProgramStudi) => {
        setOpenDialogProgramStudi(true)
        setTitleDialog('Ubah Program Studi')
        form.setValue('ProgramStudiId', data.ProgramStudiId || '')
        form.setValue('UniversityId', selectedUniversity?.UniversityId || '')
        form.setValue('Nama', data.Nama || '')
        form.setValue('Jenjang', data.Jenjang || '')
        form.setValue('Akreditasi', data.Akreditasi || '')
    }

    const form = useForm<ProgramStudiFormValidation>({
        resolver: zodResolver(ProgramStudiSchemaValidation),
        defaultValues: {
            ProgramStudiId: '',
            UniversityId: '',
            Nama: '',
            Jenjang: '',
            Akreditasi: '',
        },
    })
    const onSubmit = async (data: ProgramStudiFormValidation) => {
        setLoading(true)

        if (titleDialog === 'Ubah Program Studi') {
            await updateProgramStudi({
                ProgramStudiId: data.ProgramStudiId,
                UniversityId: data.UniversityId,
                Nama: data.Nama,
                Jenjang: data.Jenjang ?? Jenjang.TIDAK_TAMAT_SD,
                Akreditasi: data.Akreditasi,
                CreatedAt: null,
                UpdatedAt: null,
                DeletedAt: null,
            })
                .then((res) => {
                    toast('Data Program Studi berhasil diubah')
                    let idx = dataProgramStudi.findIndex(
                        (x) => x.ProgramStudiId === data.ProgramStudiId
                    )
                    setDataProgramStudi(
                        replaceItemAtIndex(dataProgramStudi, idx, res)
                    )
                    setOpenDialogProgramStudi(false)
                    setLoading(false)
                })
                .catch((err) => {
                    toast('Data Program Studi gagal diubah. Error: ' + err)
                    setLoading(false)
                })
        } else {
            await setProgramStudi({
                ProgramStudiId: '',
                UniversityId: data.UniversityId,
                Nama: data.Nama,
                Jenjang: data.Jenjang ?? Jenjang.TIDAK_TAMAT_SD,
                Akreditasi: data.Akreditasi,
                CreatedAt: null,
                UpdatedAt: null,
                DeletedAt: null,
            })
                .then((res) => {
                    toast('Data Program Studi berhasil ditambah')
                    setDataProgramStudi([...dataProgramStudi, res])
                    setLoading(false)
                    setOpenDialogProgramStudi(false)
                })
                .catch((err) => {
                    toast('Data Program Studi gagal ditambah. Error: ' + err)
                    setLoading(false)
                })
        }
    }

    const hapusData = (data: ProgramStudi) => {
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
                deleteProgramStudi(data.ProgramStudiId)
                    .then(() => {
                        setDataProgramStudi(
                            dataProgramStudi.filter(
                                (r) => r.ProgramStudiId !== data.ProgramStudiId
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
        getProgramStudiPagination(
            paginationState.page,
            paginationState.limit,
            search,
            selectedUniversity?.UniversityId || ''
        )
            .then((res) => {
                setDataProgramStudi(res.data)
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
    }, [paginationState.page, search, paginationState.limit])

    const columns: ColumnDef<ProgramStudi>[] = [
        {
            accessorKey: 'Nama',
            header: 'Nama',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('Nama')}</div>
            ),
        },
        {
            accessorKey: 'Jenjang',
            header: 'Jenjang',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('Jenjang')}</div>
            ),
        },
        {
            accessorKey: 'Akreditasi',
            header: 'Akreditasi',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('Akreditasi')}</div>
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
                                Copy Program Studi ID
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
        data: dataProgramStudi,
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
                        <h1 className="text-2xl">Program Studi</h1>
                    </CardTitle>
                    <CardDescription>Catat Program Studi Anda</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="my-2 w-full">
                        <h1>Pilih Universitas</h1>
                        <Select
                            value={selectedUniversity?.UniversityId}
                            onValueChange={(e) => {
                                const uni = universityDataServer.find(
                                    (m) => m.UniversityId === e
                                )
                                if (uni) {
                                    setSelectedUniversity({
                                        UniversityId: uni.UniversityId,
                                        Nama: uni.Nama,
                                        Akreditasi: uni.Akreditasi,
                                        ProgramStudi: uni.ProgramStudi,
                                    })
                                } else {
                                    setSelectedUniversity(null)
                                }
                            }}
                        >
                            <SelectTrigger className="w-1/2">
                                <SelectValue placeholder="Pilih Universitas" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Pilih Universitas</SelectLabel>
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
                </CardContent>
            </Card>
            {selectedUniversity && (
                <>
                    <div className="flex items-center py-4">
                        <Input
                            placeholder="Filter Nama Program Studi..."
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
                </>
            )}
            <SheetManageData
                openDialogProgramStudi={openDialogProgramStudi}
                setOpenDialogProgramStudi={setOpenDialogProgramStudi}
                selectedUniversity={selectedUniversity}
                form={form}
                onSubmit={onSubmit}
                loading={loading}
                titleDialog={titleDialog}
            />
        </div>
    )
}

export function SheetManageData({
    openDialogProgramStudi,
    setOpenDialogProgramStudi,
    selectedUniversity,
    form,
    onSubmit,
    loading,
    titleDialog,
}: {
    openDialogProgramStudi: boolean
    setOpenDialogProgramStudi: React.Dispatch<React.SetStateAction<boolean>>
    selectedUniversity: {
        Nama: string
        UniversityId: string
        Akreditasi: string
        ProgramStudi: {
            Nama: string
            Jenjang: string | null
            Akreditasi: string
            ProgramStudiId: string
        }[]
    } | null
    form: UseFormReturn<ProgramStudiFormValidation>
    onSubmit: (data: ProgramStudiFormValidation) => void
    loading: boolean
    titleDialog: string
}) {
    return (
        <div className="grid grid-cols-2 gap-2">
            <Sheet
                open={openDialogProgramStudi}
                onOpenChange={setOpenDialogProgramStudi}
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
                                    Manage Data Program Studi
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
                                                name="UniversityId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Universitas
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly
                                                                {...field}
                                                                value={
                                                                    selectedUniversity?.Nama
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Nama Universitas
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
                                                            Nama Program Studi
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="Jenjang"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Jenjang
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                disabled={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value ??
                                                                    ''
                                                                }
                                                                onValueChange={
                                                                    field.onChange
                                                                }
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Jenjang" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectGroup>
                                                                        <SelectLabel>
                                                                            Jenjang
                                                                        </SelectLabel>
                                                                        <SelectItem value="SD">
                                                                            SD
                                                                        </SelectItem>
                                                                        <SelectItem value="SMP">
                                                                            SMP
                                                                        </SelectItem>
                                                                        <SelectItem value="SMA">
                                                                            SMA
                                                                        </SelectItem>
                                                                        <SelectItem value="D3">
                                                                            D3
                                                                        </SelectItem>
                                                                        <SelectItem value="S1">
                                                                            S1
                                                                        </SelectItem>
                                                                        <SelectItem value="S2">
                                                                            S2
                                                                        </SelectItem>
                                                                        <SelectItem value="S3">
                                                                            S3
                                                                        </SelectItem>
                                                                    </SelectGroup>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Pilih Jenjang Anda.
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="Akreditasi"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Akreditasi
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                disabled={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value ??
                                                                    ''
                                                                }
                                                                onValueChange={
                                                                    field.onChange
                                                                }
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Akreditasi" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectGroup>
                                                                        <SelectLabel>
                                                                            Akreditasi
                                                                        </SelectLabel>
                                                                        <SelectItem value="A">
                                                                            A
                                                                        </SelectItem>
                                                                        <SelectItem value="B">
                                                                            B
                                                                        </SelectItem>
                                                                        <SelectItem value="C">
                                                                            C
                                                                        </SelectItem>
                                                                        <SelectItem value="Tidak Terakreditasi">
                                                                            Tidak
                                                                            Terakreditasi
                                                                        </SelectItem>
                                                                    </SelectGroup>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Pilih Jenjang Anda.
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

export default ProgramStudiComponent
