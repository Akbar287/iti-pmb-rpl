'use client'
import { KategoriBerita } from '@/generated/prisma'
import { cn, replaceItemAtIndex } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
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
    CalendarIcon,
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
import { SettingBeritaTypes } from '@/types/WebsiteTypes'
import {
    deleteBerita,
    getBeritaPagination,
    setBerita,
    updateBerita,
    updatePopulerBerita,
} from '@/services/Website/BeritaService'
import {
    SettingBeritaFormValidation,
    SettingBeritaSkemaValidasi,
} from '@/validation/WebsiteFormValidation'
import { Textarea } from '../ui/textarea'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { format } from 'date-fns'
import { Calendar } from '../ui/calendar'
import { Badge } from '../ui/badge'

type KomunitasUniversityType = {
    UniversityId: string
    Nama: string
    SettingMainPage: {
        SettingMainPageId: string
        TextMainPage2: string
    }[]
}

const BeritaComponent = ({
    university,
    kategoriBerita,
}: {
    university: KomunitasUniversityType[]
    kategoriBerita: KategoriBerita[]
}) => {
    const [selectable, setSelectable] = React.useState<{
        UniversityId: string
        SettingMainPageId: string
    }>({
        UniversityId: '',
        SettingMainPageId: '',
    })
    const [dataBerita, setDataBerita] = React.useState<SettingBeritaTypes[]>([])
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
            getBeritaPagination(
                selectable.SettingMainPageId,
                paginationState.page,
                paginationState.limit,
                search
            )
                .then(async (res) => {
                    setLoading(false)
                    setDataBerita(res.data)
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

    const form = useForm<SettingBeritaFormValidation>({
        resolver: zodResolver(SettingBeritaSkemaValidasi),
        defaultValues: {
            Gambar: null,
            KategoriBeritaId: '',
            Title: '',
            Waktu: new Date(),
            Deskripsi: '',
            Populer: false,
            SettingMainPageId: '',
            SettingBeritaId: '',
        },
    })

    const onSubmit = async (data: SettingBeritaFormValidation) => {
        setLoadingSubmit(true)
        if (titleDialog === 'Ubah Berita' && data.Gambar) {
            await updateBerita(data.Gambar, data)
                .then((res) => {
                    toast('Data Berita berhasil diubah')
                    let idx = dataBerita.findIndex(
                        (r) => r.SettingBeritaId === data.SettingBeritaId
                    )
                    setDataBerita(replaceItemAtIndex(dataBerita, idx, res))
                    setOpenDialog(false)
                    setLoadingSubmit(false)
                })
                .catch((err) => {
                    toast('Data Berita gagal diubah. Error: ' + err)
                    setLoadingSubmit(false)
                })
        } else {
            if (data.Gambar) {
                await setBerita(data.Gambar, data)
                    .then((res) => {
                        toast('Data Berita berhasil ditambah')
                        setDataBerita([...dataBerita, res])
                        setLoadingSubmit(false)
                        setOpenDialog(false)
                    })
                    .catch((err) => {
                        toast('Data Berita gagal ditambah. Error: ' + err)
                        setLoadingSubmit(false)
                    })
            }
        }
    }

    const buatData = () => {
        form.reset()
        form.setValue('SettingMainPageId', selectable.SettingMainPageId)
        setTitleDialog('Tambah Berita')
        setOpenDialog(true)
    }
    const ubahData = async (jd: SettingBeritaTypes) => {
        form.setValue('Gambar', null)
        form.setValue('SettingMainPageId', jd.SettingMainPageId)
        form.setValue('Title', jd.Title)
        form.setValue('KategoriBeritaId', jd.KategoriBeritaId)
        form.setValue('SettingBeritaId', jd.SettingBeritaId)
        form.setValue('Deskripsi', jd.Deskripsi)
        form.setValue('Populer', jd.Populer)
        form.setValue('Waktu', new Date(jd.Waktu))
        let k = kategoriBerita.find(
            (x) => x.KategoriBeritaId === jd.KategoriBeritaId
        )
        if (k) {
            form.setValue('NamaKategori', k.Nama)
            form.setValue('Color', k.Color)
        }
        urlToFile(
            process.env.NEXT_PUBLIC_API_BASE_URL +
                '/api/img?_t=_b&_id=' +
                jd.SettingBeritaId
        )
            .then((res) => form.setValue('Gambar', res))
            .catch((err) => toast('Gagal Ambil data Gambar'))
        setTitleDialog('Ubah Berita')
        setOpenDialog(true)
    }
    const hapusData = (jd: SettingBeritaTypes) => {
        Swal.fire({
            title: 'Ingin Hapus Berita ' + jd.SettingBeritaId + ' ?',
            text: 'Aksi ini tidak dapat di undo',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f45f24',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteBerita(jd.SettingBeritaId).then(() => {
                    setDataBerita(
                        dataBerita.filter(
                            (r) => r.SettingBeritaId !== jd.SettingBeritaId
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

    const makePopuler = (SettingBeritaId: string) => {
        updatePopulerBerita(SettingBeritaId)
            .then((res) => {
                let temp: SettingBeritaTypes[] = dataBerita
                let populerLama = dataBerita.find((x) => x.Populer)
                if (populerLama) {
                    let idx_populerLama = dataBerita.findIndex((x) => x.Populer)
                    temp = replaceItemAtIndex(dataBerita, idx_populerLama, {
                        ...populerLama,
                        Populer: false,
                    })
                }

                let populerBaru = dataBerita.find(
                    (x) => x.SettingBeritaId == SettingBeritaId
                )
                if (populerBaru) {
                    let idx_populerBaru = dataBerita.findIndex(
                        (x) => x.SettingBeritaId == SettingBeritaId
                    )
                    temp = replaceItemAtIndex(temp, idx_populerBaru, {
                        ...populerBaru,
                        Populer: true,
                    })
                }
                setDataBerita(temp)
                toast('Berhasil Menjadikan Berita Populer')
            })
            .catch((err) => {
                toast('Gagal Menjadikan Berita Populer')
            })
    }

    const columns: ColumnDef<SettingBeritaTypes>[] = [
        {
            accessorKey: 'Foto',
            header: 'Foto',
            cell: ({ row }) => (
                <img
                    src={
                        process.env.NEXT_PUBLIC_API_BASE_URL +
                        '/api/img?_t=_b&_id=' +
                        row.original.SettingBeritaId
                    }
                    alt={row.original.SettingBeritaId}
                    width={100}
                    height={100}
                />
            ),
        },
        {
            accessorKey: 'Title',
            header: 'Title',
            cell: ({ row }) => {
                let populer = row.original.Populer ? (
                    <Badge variant="default">Populer</Badge>
                ) : (
                    ''
                )
                return (
                    <div className="capitalize">
                        {populer} {row.getValue('Title')}
                    </div>
                )
            },
        },
        {
            accessorKey: 'KategoriId',
            header: 'Kategori',
            cell: ({ row }) => (
                <div className="capitalize">{row.original.NamaKategori}</div>
            ),
        },
        {
            accessorKey: 'Waktu',
            header: 'Waktu',
            cell: ({ row }) => (
                <div className="capitalize">
                    {format(row.original.Waktu, 'PPP')}
                </div>
            ),
        },
        {
            accessorKey: 'Populer',
            header: 'Populer',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('Populer')}</div>
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
                            <Button variant="ghost" className="w-8 h-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() =>
                                    navigator.clipboard.writeText(
                                        jd.SettingBeritaId
                                    )
                                }
                            >
                                Copy Berita ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {!row.original.Populer && (
                                <DropdownMenuItem
                                    onClick={() =>
                                        makePopuler(jd.SettingBeritaId)
                                    }
                                >
                                    Jadikan Populer
                                </DropdownMenuItem>
                            )}
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
        data: dataBerita,
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
                        <h1 className="text-2xl">Berita</h1>
                    </CardTitle>
                    <CardDescription>Berita</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
                        <div className="flex justify-end w-full">
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
                                        <Skeleton className="w-10 h-10 rounded-full" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-[60%]" />
                                            <Skeleton className="h-4 w-[40%]" />
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    ) : (
                        <div className="border rounded-md">
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
                    <div className="flex items-center justify-end py-4 space-x-2">
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
                        <div className="flex items-center mt-4 space-x-2">
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
                kategoriBerita={kategoriBerita}
            />
        </div>
    )
}

export default BeritaComponent

export function SheetManageData({
    openDialog,
    setOpenDialog,
    onSubmit,
    loading,
    form,
    loadingSubmit,
    titleDialog,
    selectable,
    kategoriBerita,
}: {
    openDialog: boolean
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
    loading: boolean
    onSubmit: (data: SettingBeritaFormValidation) => void
    form: UseFormReturn<SettingBeritaFormValidation>
    titleDialog: string
    loadingSubmit: boolean
    selectable: {
        UniversityId: string
        SettingMainPageId: string
    }
    kategoriBerita: KategoriBerita[]
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
                            <div className="grid w-full grid-cols-1 gap-3 px-4">
                                <div className="container mx-auto">
                                    <div className="grid grid-cols-1 gap-3">
                                        <FormField
                                            control={form.control}
                                            name="Title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Judul Berita
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
                                                        Judul Berita
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="KategoriBeritaId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Kategori Berita
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Select
                                                            disabled={loading}
                                                            value={
                                                                field.value ??
                                                                ''
                                                            }
                                                            onValueChange={(
                                                                e
                                                            ) => {
                                                                field.onChange(
                                                                    e
                                                                )
                                                                let temp =
                                                                    kategoriBerita.find(
                                                                        (x) =>
                                                                            x.KategoriBeritaId ===
                                                                            e
                                                                    )
                                                                if (temp) {
                                                                    form.setValue(
                                                                        'NamaKategori',
                                                                        temp.Nama
                                                                    )
                                                                    form.setValue(
                                                                        'Color',
                                                                        temp.Color
                                                                    )
                                                                }
                                                            }}
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Pilih Kategori" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectLabel>
                                                                        Kategori
                                                                    </SelectLabel>
                                                                    {kategoriBerita.map(
                                                                        (x) => (
                                                                            <SelectItem
                                                                                value={
                                                                                    x.KategoriBeritaId
                                                                                }
                                                                                key={
                                                                                    x.KategoriBeritaId
                                                                                }
                                                                            >
                                                                                {
                                                                                    x.Nama
                                                                                }
                                                                            </SelectItem>
                                                                        )
                                                                    )}
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormDescription>
                                                        Pilih Kategori Berita
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="Waktu"
                                            disabled={loading}
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <FormLabel>
                                                        Waktu Berita
                                                    </FormLabel>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    disabled={
                                                                        loading
                                                                    }
                                                                    variant={
                                                                        'outline'
                                                                    }
                                                                    className={cn(
                                                                        'w-[240px] pl-3 text-left font-normal',
                                                                        !field.value &&
                                                                            'text-muted-foreground'
                                                                    )}
                                                                >
                                                                    {field.value instanceof
                                                                    Date ? (
                                                                        format(
                                                                            field.value,
                                                                            'PPP'
                                                                        )
                                                                    ) : (
                                                                        <span>
                                                                            Pilih
                                                                            Tanggal
                                                                        </span>
                                                                    )}
                                                                    <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent
                                                            className="w-auto p-0"
                                                            align="start"
                                                        >
                                                            <Calendar
                                                                mode="single"
                                                                selected={
                                                                    field.value
                                                                }
                                                                onSelect={
                                                                    field.onChange
                                                                }
                                                                disabled={
                                                                    loading ||
                                                                    loadingSubmit
                                                                }
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormDescription>
                                                        Waktu Berita
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="Deskripsi"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Konten Berita
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
                                                        Konten Berita
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            disabled={loading || loadingSubmit}
                                            name="Gambar"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Gambar
                                                    </FormLabel>
                                                    <FormControl>
                                                        <div className="grid items-center w-full max-w-sm gap-3">
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
                                                                'Gambar'
                                                            ) &&
                                                                form.watch(
                                                                    'Gambar'
                                                                ) instanceof
                                                                    File && (
                                                                    <img
                                                                        src={URL.createObjectURL(
                                                                            form.watch(
                                                                                'Gambar'
                                                                            ) as File
                                                                        )}
                                                                        alt="Preview"
                                                                        className="w-full mt-2 border rounded-md"
                                                                        style={{
                                                                            maxWidth: 200,
                                                                        }}
                                                                    />
                                                                )}
                                                        </div>
                                                    </FormControl>
                                                    <FormDescription>
                                                        Gambar
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
