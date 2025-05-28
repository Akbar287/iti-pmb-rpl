'use client'
import { replaceItemAtIndex } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { useForm, UseFormReturn } from 'react-hook-form'
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
    MoreHorizontal,
    PenIcon,
    Timer,
} from 'lucide-react'
import Swal from 'sweetalert2'
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
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '../ui/sheet'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form'
import { UniversityJabatanOrang } from '@/generated/prisma'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../ui/card'
import {
    UniversityJabatanOrangFormSkemaValidation,
    UniversityJabatanOrangFormValidation,
} from '@/validation/InstitusiValidation'
import {
    deleteInstitusiJabatanOrang,
    getInstitusiJabatanOrangPagination,
    setInstitusiJabatanOrang,
    updateInstitusiJabatanOrang,
} from '@/services/ManajemenInstitusi/JabatanOrangServices'

const JabatanOrangComponent = ({
    universityData,
}: {
    universityData: {
        Nama: string
        UniversityId: string
        Akreditasi: string
        UniversityJabatan: {
            Nama: string
            UniversityJabatanId: string
            Keterangan: string | null
        }[]
    }[]
}) => {
    const [dataJabatanOrang, setDataJabatanOrang] = React.useState<
        UniversityJabatanOrang[]
    >([])
    const [selectedData, setselectedData] = React.useState<{
        UniversityId: string
        NamaUniverstity: string
        UniversityJabatanId: string
        NamaUniversityJabatan: string
    }>({
        UniversityId: '',
        NamaUniverstity: '',
        UniversityJabatanId: '',
        NamaUniversityJabatan: '',
    })
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
    const [openDialog, setOpenDialog] = React.useState<boolean>(false)
    const [titleDialog, setTitleDialog] = React.useState<string>('')
    const [loading, setLoading] = React.useState<boolean>(false)

    const form = useForm<UniversityJabatanOrangFormValidation>({
        resolver: zodResolver(UniversityJabatanOrangFormSkemaValidation),
        defaultValues: {
            UniversityJabatanOrangId: '',
            UniversityJabatanId: '',
            Nama: '',
            Keterangan: '',
        },
    })
    const onSubmit = async (data: UniversityJabatanOrangFormValidation) => {
        setLoading(true)

        if (titleDialog === 'Ubah Jabatan Institusi Orang') {
            await updateInstitusiJabatanOrang({
                UniversityJabatanOrangId: data.UniversityJabatanOrangId,
                UniversityJabatanId: data.UniversityJabatanId,
                Nama: data.Nama,
                Keterangan: data.Keterangan,
                CreatedAt: null,
                UpdatedAt: null,
                DeletedAt: null,
            })
                .then((res) => {
                    toast('Data Jabatan Institusi Orang berhasil diubah')
                    let idx = dataJabatanOrang.findIndex(
                        (r) =>
                            r.UniversityJabatanOrangId ===
                            data.UniversityJabatanOrangId
                    )
                    setDataJabatanOrang(
                        replaceItemAtIndex(dataJabatanOrang, idx, res)
                    )
                    setOpenDialog(false)
                    setLoading(false)
                })
                .catch((err) => {
                    toast(
                        'Data Jabatan Institusi Orang gagal diubah. Error: ' +
                            err
                    )
                    setLoading(false)
                })
        } else {
            await setInstitusiJabatanOrang({
                UniversityJabatanOrangId: '',
                UniversityJabatanId: selectedData.UniversityJabatanId,
                Nama: data.Nama,
                Keterangan: data.Keterangan,
                CreatedAt: null,
                UpdatedAt: null,
                DeletedAt: null,
            })
                .then((res) => {
                    toast('Data Jabatan Institusi Orang berhasil ditambah')
                    setDataJabatanOrang([...dataJabatanOrang, res])
                    setLoading(false)
                    setOpenDialog(false)
                })
                .catch((err) => {
                    toast(
                        'Data Jabatan Institusi Orang gagal ditambah. Error: ' +
                            err
                    )
                    setLoading(false)
                })
        }
    }

    React.useEffect(() => {
        setLoading(true)
        getInstitusiJabatanOrangPagination(
            paginationState.page,
            paginationState.limit,
            search
        )
            .then((res) => {
                setDataJabatanOrang(res.data)
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

    const buatData = () => {
        form.reset()
        form.setValue(
            'UniversityJabatanId',
            selectedData?.UniversityJabatanId || ''
        )
        setTitleDialog('Tambah Jabatan Institusi Orang')
        setOpenDialog(true)
    }
    const ubahData = (jd: UniversityJabatanOrang) => {
        form.reset()
        form.setValue('Nama', String(jd.Nama))
        form.setValue(
            'UniversityJabatanOrangId',
            String(jd.UniversityJabatanOrangId)
        )
        form.setValue('UniversityJabatanId', String(jd.UniversityJabatanId))
        form.setValue('Keterangan', String(jd.Keterangan))
        setTitleDialog('Ubah Jabatan Institusi Orang')
        setOpenDialog(true)
    }
    const hapusData = (jd: UniversityJabatanOrang) => {
        Swal.fire({
            title: 'Ingin Hapus ' + jd.Nama + ' ?',
            text: 'Aksi ini tidak dapat di undo',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f45f24',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteInstitusiJabatanOrang(jd.UniversityJabatanOrangId).then(
                    () => {
                        setDataJabatanOrang(
                            dataJabatanOrang.filter(
                                (r) =>
                                    r.UniversityJabatanOrangId !==
                                    jd.UniversityJabatanOrangId
                            )
                        )
                        Swal.fire({
                            title: 'Terhapus!',
                            text: 'Data sudah dihapus.',
                            icon: 'success',
                        })
                    }
                )
            }
        })
    }

    const columns: ColumnDef<UniversityJabatanOrang>[] = [
        {
            accessorKey: 'Nama',
            header: 'Nama',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('Nama')}</div>
            ),
        },
        {
            accessorKey: 'Keterangan',
            header: 'Keterangan',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('Keterangan')}</div>
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
                                onClick={() =>
                                    navigator.clipboard.writeText(
                                        jd.UniversityJabatanId
                                    )
                                }
                            >
                                Copy Universitas Jabatan ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => ubahData(jd)}>
                                Ubah Data
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => hapusData(jd)}>
                                Hapus Data
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    const table = useReactTable({
        data: dataJabatanOrang,
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
                        <h1 className="text-2xl">Institusi Jabatan Orang</h1>
                    </CardTitle>
                    <CardDescription>Institusi Jabatan Orang</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="w-full">
                            <h1>Pilih Universitas</h1>
                            <Select
                                value={selectedData?.UniversityId}
                                onValueChange={(e) => {
                                    let temp = universityData.find(
                                        (x) => x.UniversityId === e
                                    )
                                    setselectedData({
                                        UniversityId: e,
                                        NamaUniverstity: temp?.Nama || '',
                                        UniversityJabatanId: '',
                                        NamaUniversityJabatan: '',
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
                                        {universityData.map((m) => (
                                            <SelectItem
                                                key={m.UniversityId}
                                                value={m.UniversityId}
                                            >
                                                {m.Nama}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full">
                            <h1>Pilih Jabatan</h1>
                            <Select
                                value={selectedData?.UniversityJabatanId}
                                disabled={selectedData?.UniversityId === ''}
                                onValueChange={(e) => {
                                    let temp = universityData
                                        .find(
                                            (x) =>
                                                x.UniversityId ===
                                                selectedData?.UniversityId
                                        )
                                        ?.UniversityJabatan.find(
                                            (y) => y.UniversityJabatanId === e
                                        )
                                    setselectedData({
                                        UniversityId: selectedData.UniversityId,
                                        NamaUniverstity:
                                            selectedData.NamaUniverstity,
                                        UniversityJabatanId: e,
                                        NamaUniversityJabatan: temp?.Nama || '',
                                    })
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Jabatan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Pilih Jabatan</SelectLabel>
                                        {universityData
                                            .find(
                                                (x) =>
                                                    x.UniversityId ===
                                                    selectedData.UniversityId
                                            )
                                            ?.UniversityJabatan.map((m) => (
                                                <SelectItem
                                                    key={m.UniversityJabatanId}
                                                    value={
                                                        m.UniversityJabatanId
                                                    }
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
            {selectedData.UniversityJabatanId !== '' && (
                <>
                    <div className="flex items-center py-4">
                        <Input
                            placeholder="Cari Data ..."
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
                            <Button className="mr-2" onClick={() => buatData()}>
                                Tambah
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
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                onSubmit={onSubmit}
                loading={loading}
                form={form}
                titleDialog={titleDialog}
                selectedData={selectedData}
            />
        </div>
    )
}

export default JabatanOrangComponent

export function SheetManageData({
    openDialog,
    setOpenDialog,
    onSubmit,
    loading,
    form,
    titleDialog,
    selectedData,
}: {
    openDialog: boolean
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
    loading: boolean
    onSubmit: (data: UniversityJabatanOrangFormValidation) => void
    form: UseFormReturn<UniversityJabatanOrangFormValidation>
    titleDialog: string
    selectedData: {
        UniversityId: string
        NamaUniverstity: string
        UniversityJabatanId: string
        NamaUniversityJabatan: string
    }
}) {
    return (
        <div className="grid grid-cols-2 gap-2">
            <Sheet open={openDialog} onOpenChange={setOpenDialog}>
                <SheetContent
                    side="right"
                    className="w-screen h-screen max-w-full overflow-scroll"
                >
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <SheetHeader>
                                <SheetTitle>{titleDialog}</SheetTitle>
                                <SheetDescription>
                                    Manage Data untuk {form.getValues('Nama')}
                                </SheetDescription>
                            </SheetHeader>
                            <div className="w-full grid grid-cols-1 gap-3 px-4">
                                <div className="container mx-auto">
                                    <div className="grid grid-cols-1 gap-3">
                                        <FormField
                                            control={form.control}
                                            name="UniversityJabatanId"
                                            render={({}) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Nama Institusi
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            readOnly
                                                            value={
                                                                selectedData?.NamaUniverstity
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Nama Institusi
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="UniversityJabatanId"
                                            render={({}) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Nama Jabatan
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            readOnly
                                                            value={
                                                                selectedData?.NamaUniversityJabatan
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Nama Jabatan
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
                                                        Nama Orang
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            readOnly={loading}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Nama Orang
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="Keterangan"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Keterangan
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            readOnly={loading}
                                                            {...field}
                                                            value={
                                                                field.value ||
                                                                ''
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Keterangan
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
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
