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
import { Desa } from '@/generated/prisma'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../ui/card'
import {
    DesaFormSkemaValidation,
    DesaFormValidation,
} from '@/validation/AreaFormValidation'
import {
    deleteDesa,
    getDesaPagination,
    setDesa,
    updateDesa,
} from '@/services/AreaServices'

const DesaComponent = ({
    desaDataServer,
}: {
    desaDataServer: {
        Nama: string
        CountryId: string
        Provinsi: {
            Nama: string
            ProvinsiId: string
            Kabupaten: {
                Nama: string
                KabupatenId: string
                Kecamatan: {
                    Nama: string
                    KecamatanId: string
                }[]
            }[]
        }[]
    }[]
}) => {
    const [dataDesa, setDataDesa] = React.useState<Desa[]>([])
    const [selectedData, setselectedData] = React.useState<{
        ProvinsiId: string
        NamaProvinsi: string
        CountryId: string
        NamaCountry: string
        KabupatenId: string
        NamaKabupaten: string
        KecamatanId: string
        NamaKecamatan: string
    }>({
        ProvinsiId: '',
        NamaProvinsi: '',
        CountryId: '',
        NamaCountry: '',
        KabupatenId: '',
        NamaKabupaten: '',
        KecamatanId: '',
        NamaKecamatan: '',
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

    const form = useForm<DesaFormValidation>({
        resolver: zodResolver(DesaFormSkemaValidation),
        defaultValues: {
            KecamatanId: '',
            DesaId: '',
            Nama: '',
        },
    })
    const onSubmit = async (data: DesaFormValidation) => {
        setLoading(true)

        if (titleDialog === 'Ubah Desa') {
            await updateDesa({
                KecamatanId: selectedData.KecamatanId,
                DesaId: data.DesaId,
                Nama: data.Nama,
            })
                .then((res) => {
                    toast('Data Desa berhasil diubah')
                    let idx = dataDesa.findIndex(
                        (r) => r.DesaId === data.DesaId
                    )
                    setDataDesa(replaceItemAtIndex(dataDesa, idx, res))
                    setOpenDialog(false)
                    setLoading(false)
                })
                .catch((err) => {
                    toast('Data Desa gagal diubah. Error: ' + err)
                    setLoading(false)
                })
        } else {
            await setDesa({
                KecamatanId: selectedData.KecamatanId,
                DesaId: data.DesaId,
                Nama: data.Nama,
            })
                .then((res) => {
                    toast('Data Desa berhasil ditambah')
                    setDataDesa([...dataDesa, res])
                    setLoading(false)
                    setOpenDialog(false)
                })
                .catch((err) => {
                    toast('Data Desa gagal ditambah. Error: ' + err)
                    setLoading(false)
                })
        }
    }

    React.useEffect(() => {
        setLoading(true)
        getDesaPagination(
            paginationState.page,
            paginationState.limit,
            search,
            selectedData.KecamatanId
        )
            .then((res) => {
                setDataDesa(res.data)
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
        selectedData.KecamatanId,
    ])

    const buatData = () => {
        form.reset()
        setTitleDialog('Tambah Desa')
        setOpenDialog(true)
    }
    const ubahData = (jd: Desa) => {
        form.setValue('KecamatanId', jd.KecamatanId)
        form.setValue('DesaId', jd.DesaId)
        form.setValue('Nama', String(jd.Nama))
        setTitleDialog('Ubah Desa')
        setOpenDialog(true)
    }
    const hapusData = (jd: Desa) => {
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
                deleteDesa(jd.DesaId).then(() => {
                    setDataDesa(dataDesa.filter((r) => r.DesaId !== jd.DesaId))
                    Swal.fire({
                        title: 'Terhapus!',
                        text: 'Data sudah dihapus.',
                        icon: 'success',
                    })
                })
            }
        })
    }

    const columns: ColumnDef<Desa>[] = [
        {
            accessorKey: 'Nama',
            header: 'Nama',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('Nama')}</div>
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
                                    navigator.clipboard.writeText(jd.DesaId)
                                }
                            >
                                Copy Desa ID
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
        data: dataDesa,
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
                        <h1 className="text-2xl">Desa</h1>
                    </CardTitle>
                    <CardDescription>Desa</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="w-full">
                            <h1>Pilih Negara</h1>
                            <Select
                                value={selectedData.CountryId}
                                onValueChange={(e) => {
                                    let temp = desaDataServer.find(
                                        (x) => x.CountryId === e
                                    )
                                    setselectedData({
                                        CountryId: e,
                                        NamaCountry: temp ? temp.Nama : '',
                                        ProvinsiId: '',
                                        NamaProvinsi: '',
                                        KabupatenId: '',
                                        NamaKabupaten: '',
                                        KecamatanId: '',
                                        NamaKecamatan: '',
                                    })
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Negara" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Pilih Negara</SelectLabel>
                                        {desaDataServer.map((m) => (
                                            <SelectItem
                                                key={m.CountryId}
                                                value={m.CountryId}
                                            >
                                                {m.Nama}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full">
                            <h1>Pilih Provinsi</h1>
                            <Select
                                value={selectedData.ProvinsiId}
                                disabled={!selectedData.CountryId}
                                onValueChange={(e) => {
                                    let temp = desaDataServer
                                        .find(
                                            (x) =>
                                                x.CountryId ===
                                                selectedData.CountryId
                                        )
                                        ?.Provinsi.find(
                                            (y) => y.ProvinsiId === e
                                        )
                                    setselectedData({
                                        CountryId: selectedData.CountryId,
                                        NamaCountry: selectedData.NamaCountry,
                                        ProvinsiId: e,
                                        NamaProvinsi: temp?.Nama ?? '',
                                        KabupatenId: '',
                                        NamaKabupaten: '',
                                        KecamatanId: '',
                                        NamaKecamatan: '',
                                    })
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Provinsi" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>
                                            Pilih Provinsi
                                        </SelectLabel>
                                        {desaDataServer
                                            .find(
                                                (x) =>
                                                    x.CountryId ===
                                                    selectedData.CountryId
                                            )
                                            ?.Provinsi.map((m) => (
                                                <SelectItem
                                                    key={m.ProvinsiId}
                                                    value={m.ProvinsiId}
                                                >
                                                    {m.Nama}
                                                </SelectItem>
                                            ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full">
                            <h1>Pilih Kabupaten</h1>
                            <Select
                                value={selectedData.KabupatenId}
                                disabled={!selectedData.ProvinsiId}
                                onValueChange={(e) => {
                                    let temp = desaDataServer
                                        .find(
                                            (x) =>
                                                x.CountryId ===
                                                selectedData.CountryId
                                        )
                                        ?.Provinsi.find(
                                            (y) =>
                                                y.ProvinsiId ===
                                                selectedData.ProvinsiId
                                        )
                                        ?.Kabupaten.find(
                                            (z) => z.KabupatenId === e
                                        )
                                    setselectedData({
                                        CountryId: selectedData.CountryId,
                                        NamaCountry: selectedData.NamaCountry,
                                        ProvinsiId: selectedData.ProvinsiId,
                                        NamaProvinsi: selectedData.NamaProvinsi,
                                        KabupatenId: e,
                                        NamaKabupaten: temp?.Nama ?? '',
                                        KecamatanId: '',
                                        NamaKecamatan: '',
                                    })
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Kabupaten" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>
                                            Pilih Kabupaten
                                        </SelectLabel>
                                        {desaDataServer
                                            .find(
                                                (x) =>
                                                    x.CountryId ===
                                                    selectedData.CountryId
                                            )
                                            ?.Provinsi.find(
                                                (y) =>
                                                    y.ProvinsiId ===
                                                    selectedData.ProvinsiId
                                            )
                                            ?.Kabupaten.map((m) => (
                                                <SelectItem
                                                    key={m.KabupatenId}
                                                    value={m.KabupatenId}
                                                >
                                                    {m.Nama}
                                                </SelectItem>
                                            ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full">
                            <h1>Pilih Kecamatan</h1>
                            <Select
                                value={selectedData.KecamatanId}
                                disabled={!selectedData.KabupatenId}
                                onValueChange={(e) => {
                                    let temp = desaDataServer
                                        .find(
                                            (x) =>
                                                x.CountryId ===
                                                selectedData.CountryId
                                        )
                                        ?.Provinsi.find(
                                            (y) =>
                                                y.ProvinsiId ===
                                                selectedData.ProvinsiId
                                        )
                                        ?.Kabupaten.find(
                                            (z) =>
                                                z.KabupatenId ===
                                                selectedData.KabupatenId
                                        )
                                        ?.Kecamatan.find(
                                            (a) => a.KecamatanId === e
                                        )
                                    setselectedData({
                                        CountryId: selectedData.CountryId,
                                        NamaCountry: selectedData.NamaCountry,
                                        ProvinsiId: selectedData.ProvinsiId,
                                        NamaProvinsi: selectedData.NamaProvinsi,
                                        KabupatenId: selectedData.KabupatenId,
                                        NamaKabupaten:
                                            selectedData.NamaKabupaten,
                                        KecamatanId: e,
                                        NamaKecamatan: temp?.Nama ?? '',
                                    })
                                    setPaginationState({
                                        ...paginationState,
                                        page: 1,
                                    })
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Kecamatan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>
                                            Pilih Kecamatan
                                        </SelectLabel>
                                        {desaDataServer
                                            .find(
                                                (x) =>
                                                    x.CountryId ===
                                                    selectedData.CountryId
                                            )
                                            ?.Provinsi.find(
                                                (y) =>
                                                    y.ProvinsiId ===
                                                    selectedData.ProvinsiId
                                            )
                                            ?.Kabupaten.find(
                                                (z) =>
                                                    z.KabupatenId ===
                                                    selectedData.KabupatenId
                                            )
                                            ?.Kecamatan.map((m) => (
                                                <SelectItem
                                                    key={m.KecamatanId}
                                                    value={m.KecamatanId}
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
            {selectedData.KecamatanId && (
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

export default DesaComponent

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
    onSubmit: (data: DesaFormValidation) => void
    form: UseFormReturn<DesaFormValidation>
    titleDialog: string
    selectedData: {
        ProvinsiId: string
        NamaProvinsi: string
        CountryId: string
        NamaCountry: string
        KabupatenId: string
        NamaKabupaten: string
        KecamatanId: string
        NamaKecamatan: string
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
                                            name="KecamatanId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Nama Negara
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            readOnly
                                                            value={
                                                                selectedData.NamaCountry
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Nama Negara
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="KecamatanId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Nama Provinsi
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            readOnly
                                                            value={
                                                                selectedData.NamaProvinsi
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Nama Provinsi
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="KecamatanId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Nama Kabupaten
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            readOnly
                                                            value={
                                                                selectedData.NamaKabupaten
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Nama Kabupaten
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="KecamatanId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Nama Kecamatan
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            readOnly
                                                            value={
                                                                selectedData.NamaKecamatan
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Nama Kecamatan
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
                                                        Nama Kecamatan
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            readOnly={loading}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Nama Kecamatan
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
