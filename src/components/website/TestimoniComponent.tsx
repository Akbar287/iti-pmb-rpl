'use client'
import { replaceItemAtIndex } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    deleteKomunitas,
    getKomunitasPagination,
    setKomunitas,
    updateKomunitas,
} from '@/services/Website/KomunitasService'
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
import Swal from '@/lib/swal'
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
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../ui/card'
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
import { SettingTestimoniTypes } from '@/types/WebsiteTypes'
import {
    getTestimoniId,
    getTestimoniPagination,
    setTestimoni,
    updateTestimoni,
} from '@/services/Website/TestimoniService'
import {
    SettingTestimonyFormValidation,
    SettingTestimonySkemaValidasi,
} from '@/validation/WebsiteFormValidation'
import { Textarea } from '../ui/textarea'

type KomunitasUniversityType = {
    UniversityId: string
    Nama: string
    SettingMainPage: {
        SettingMainPageId: string
        TextMainPage2: string
    }[]
}
const TestimoniComponent = ({
    university,
}: {
    university: KomunitasUniversityType[]
}) => {
    const [selectable, setSelectable] = React.useState<{
        UniversityId: string
        SettingMainPageId: string
    }>({
        UniversityId: '',
        SettingMainPageId: '',
    })
    const [dataTestimoni, setDataTestimoni] = React.useState<
        SettingTestimoniTypes[]
    >([])
    const [openDialog, setOpenDialog] = React.useState<boolean>(false)
    const [titleDialog, setTitleDialog] = React.useState<string>('')
    const [loadingSubmit, setLoadingSubmit] = React.useState(false)
    const [loading, setLoading] = React.useState<boolean>(false)

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

    async function urlToFile(url: string, filename = 'existing-image') {
        const res = await fetch(url, { cache: 'no-store' })
        const blob = await res.blob()
        const ext = blob.type.split('/')[1] || 'png'
        return new File([blob], `${filename}.${ext}`, { type: blob.type })
    }

    React.useEffect(() => {
        if (selectable.SettingMainPageId !== '') {
            setLoading(true)
            getTestimoniPagination(
                selectable.SettingMainPageId,
                paginationState.page,
                paginationState.limit,
                search
            )
                .then(async (res) => {
                    setLoading(false)
                    setDataTestimoni(res.data)
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
                    toast('Kendala mendapatkan informasi')
                    setLoading(false)
                })
        }
    }, [
        selectable.SettingMainPageId,
        paginationState.page,
        paginationState.limit,
        search,
    ])

    const form = useForm<SettingTestimonyFormValidation>({
        resolver: zodResolver(SettingTestimonySkemaValidasi),
        defaultValues: {
            Foto: null,
            Nama: '',
            Jabatan: '',
            Testimoni: '',
            JurusanTahun: '',
            SettingMainPageId: '',
            SettingTestimonyId: '',
        },
    })

    const onSubmit = async (data: SettingTestimonyFormValidation) => {
        setLoadingSubmit(true)
        if (titleDialog === 'Ubah Testimoni' && data.Foto) {
            await updateTestimoni(data.Foto, data)
                .then((res) => {
                    toast('Data Testimoni berhasil diubah')
                    let idx = dataTestimoni.findIndex(
                        (r) => r.SettingTestimonyId === data.SettingTestimonyId
                    )
                    setDataTestimoni(
                        replaceItemAtIndex(dataTestimoni, idx, res)
                    )
                    setOpenDialog(false)
                    setLoadingSubmit(false)
                })
                .catch((err) => {
                    toast('Data Testimoni gagal diubah. Error: ' + err)
                    setLoadingSubmit(false)
                })
        } else {
            if (data.Foto) {
                await setTestimoni(data.Foto, data)
                    .then((res) => {
                        toast('Data Testimoni berhasil ditambah')
                        setDataTestimoni([...dataTestimoni, res])
                        setLoadingSubmit(false)
                        setOpenDialog(false)
                    })
                    .catch((err) => {
                        toast('Data Testimoni gagal ditambah. Error: ' + err)
                        setLoadingSubmit(false)
                    })
            }
        }
    }

    const buatData = () => {
        form.reset()
        form.setValue('SettingMainPageId', selectable.SettingMainPageId)
        setTitleDialog('Tambah Testimoni')
        setOpenDialog(true)
    }
    const ubahData = async (jd: SettingTestimoniTypes) => {
        form.setValue('Foto', null)
        form.setValue('Nama', jd.Nama)
        form.setValue('Jabatan', jd.Jabatan)
        form.setValue('Testimoni', jd.Testimoni)
        form.setValue('JurusanTahun', jd.JurusanTahun)
        form.setValue('SettingTestimonyId', jd.SettingTestimonyId)
        form.setValue('SettingMainPageId', jd.SettingMainPageId)
        urlToFile(
            process.env.NEXT_PUBLIC_API_BASE_URL +
                '/api/img?_t=_t&_id=' +
                jd.SettingTestimonyId
        )
            .then((res) => form.setValue('Foto', res))
            .catch((err) => toast('Gagal Ambil data Gambar'))
        setTitleDialog('Ubah Testimoni')
        setOpenDialog(true)
    }
    const hapusData = (jd: SettingTestimoniTypes) => {
        Swal.fire({
            title: 'Ingin Hapus Testimoni ' + jd.Nama + ' ?',
            text: 'Aksi ini tidak dapat di undo',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f45f24',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteKomunitas(jd.SettingTestimonyId).then(() => {
                    setDataTestimoni(
                        dataTestimoni.filter(
                            (r) =>
                                r.SettingTestimonyId !== jd.SettingTestimonyId
                        )
                    )
                    Swal.fire({
                        title: 'Terhapus!',
                        text: 'Data sudah dihapus.',
                        icon: 'success',
                    })
                })
            }
        })
    }

    const columns: ColumnDef<SettingTestimoniTypes>[] = [
        {
            accessorKey: 'Foto',
            header: 'Foto',
            cell: ({ row }) => (
                <img
                    src={
                        process.env.NEXT_PUBLIC_API_BASE_URL +
                        '/api/img?_t=_t&_id=' +
                        row.original.SettingTestimonyId
                    }
                    alt={row.original.SettingTestimonyId}
                    width={100}
                    height={100}
                />
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
            accessorKey: 'Jabatan',
            header: 'Jabatan',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('Jabatan')}</div>
            ),
        },
        {
            accessorKey: 'JurusanTahun',
            header: 'Jurusan Tahun',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('JurusanTahun')}</div>
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
                                        jd.SettingTestimonyId
                                    )
                                }
                            >
                                Copy Testimoni ID
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
        data: dataTestimoni,
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
                        <h1 className="text-2xl">Testimoni</h1>
                    </CardTitle>
                    <CardDescription>Testimoni Alumni</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="w-full">
                            <h1>Pilih Universitas</h1>
                            <Select
                                value={selectable.UniversityId}
                                onValueChange={(e) => {
                                    setSelectable({
                                        UniversityId: e,
                                        SettingMainPageId: '',
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
                                        {university.map((m) => (
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
                            <h1>Pilih Homepage</h1>
                            <Select
                                value={selectable.SettingMainPageId}
                                disabled={!selectable.UniversityId}
                                onValueChange={(e) => {
                                    setSelectable({
                                        UniversityId: selectable.UniversityId,
                                        SettingMainPageId: e,
                                    })
                                    setPaginationState({
                                        ...paginationState,
                                        page: 1,
                                    })
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Homepage" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>
                                            Pilih Homepage
                                        </SelectLabel>
                                        {university
                                            .find(
                                                (x) =>
                                                    x.UniversityId ===
                                                    selectable.UniversityId
                                            )
                                            ?.SettingMainPage.map((m) => (
                                                <SelectItem
                                                    key={m.SettingMainPageId}
                                                    value={m.SettingMainPageId}
                                                >
                                                    {m.TextMainPage2}
                                                </SelectItem>
                                            ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>
            {selectable.SettingMainPageId && (
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
                    {loadingSubmit || loading ? (
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
                loadingSubmit={loadingSubmit}
                titleDialog={titleDialog}
                selectable={selectable}
            />
        </div>
    )
}

export default TestimoniComponent

export function SheetManageData({
    openDialog,
    setOpenDialog,
    onSubmit,
    loading,
    form,
    loadingSubmit,
    titleDialog,
    selectable,
}: {
    openDialog: boolean
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
    loading: boolean
    onSubmit: (data: SettingTestimonyFormValidation) => void
    form: UseFormReturn<SettingTestimonyFormValidation>
    titleDialog: string
    loadingSubmit: boolean
    selectable: {
        UniversityId: string
        SettingMainPageId: string
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
                                <SheetDescription>Manage Data</SheetDescription>
                            </SheetHeader>
                            <div className="w-full grid grid-cols-1 gap-3 px-4">
                                <div className="container mx-auto">
                                    <div className="grid grid-cols-1 gap-3">
                                        <FormField
                                            control={form.control}
                                            name="Nama"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nama</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            disabled={
                                                                loadingSubmit ||
                                                                loading
                                                            }
                                                            readOnly={loading}
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
                                            name="Jabatan"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Jabatan
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            disabled={
                                                                loadingSubmit ||
                                                                loading
                                                            }
                                                            readOnly={loading}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Jabatan
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="JurusanTahun"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Jurusan, Tahun
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            disabled={
                                                                loadingSubmit ||
                                                                loading
                                                            }
                                                            readOnly={loading}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Jurusan, Tahun
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="Testimoni"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Testimoni
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            disabled={
                                                                loadingSubmit ||
                                                                loading
                                                            }
                                                            readOnly={loading}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Testimoni
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            disabled={loading || loadingSubmit}
                                            name="Foto"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Foto</FormLabel>
                                                    <FormControl>
                                                        <div className="grid w-full max-w-sm items-center gap-3">
                                                            <Input
                                                                id="picture"
                                                                type="file"
                                                                disabled={
                                                                    loading ||
                                                                    loadingSubmit
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    field.onChange(
                                                                        e.target
                                                                            .files?.[0]
                                                                    )
                                                                }}
                                                            />
                                                            {form.watch(
                                                                'Foto'
                                                            ) &&
                                                                form.watch(
                                                                    'Foto'
                                                                ) instanceof
                                                                    File && (
                                                                    <img
                                                                        src={URL.createObjectURL(
                                                                            form.watch(
                                                                                'Foto'
                                                                            ) as File
                                                                        )}
                                                                        alt="Preview"
                                                                        className="mt-2 rounded-md border w-full"
                                                                        style={{
                                                                            maxWidth: 200,
                                                                        }}
                                                                    />
                                                                )}
                                                        </div>
                                                    </FormControl>
                                                    <FormDescription>
                                                        Foto
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                            <SheetFooter>
                                <Button
                                    type="submit"
                                    disabled={loadingSubmit || loading}
                                >
                                    {loadingSubmit || loading ? (
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
