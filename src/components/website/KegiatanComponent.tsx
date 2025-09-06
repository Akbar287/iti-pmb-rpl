'use client'
import { JenisKegiatan } from '@/generated/prisma'
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
import { Textarea } from '../ui/textarea'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { format } from 'date-fns'
import { Calendar } from '../ui/calendar'
import { SettingKegiatanTypes } from '@/types/WebsiteTypes'
import {
    deleteSettingKegiatan,
    getSettingKegiatanPagination,
    setSettingKegiatan,
    updateSettingKegiatan,
} from '@/services/Website/KegiatanService'
import {
    SettingKegiatanFormValidation,
    SettingKegiatanSkemaValidasi,
} from '@/validation/WebsiteFormValidation'

type KomunitasUniversityType = {
    UniversityId: string
    Nama: string
    SettingMainPage: {
        SettingMainPageId: string
        TextMainPage2: string
    }[]
}

const KegiatanComponent = ({
    university,
    jenisKegiatan,
}: {
    university: KomunitasUniversityType[]
    jenisKegiatan: JenisKegiatan[]
}) => {
    const [selectable, setSelectable] = React.useState<{
        UniversityId: string
        SettingMainPageId: string
    }>({
        UniversityId: '',
        SettingMainPageId: '',
    })
    const [dataKegiatan, setDataKegiatan] = React.useState<
        SettingKegiatanTypes[]
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

    React.useEffect(() => {
        if (selectable.SettingMainPageId !== '') {
            setLoading(true)
            getSettingKegiatanPagination(
                selectable.SettingMainPageId,
                paginationState.page,
                paginationState.limit,
                search
            )
                .then(async (res) => {
                    setLoading(false)
                    setDataKegiatan(res.data)
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

    const form = useForm<SettingKegiatanFormValidation>({
        resolver: zodResolver(SettingKegiatanSkemaValidasi),
        defaultValues: {
            Nama: '',
            Lokasi: '',
            Deskripsi: '',
            JenisKegiatanId: '',
            NamaJenis: '',
            Color: '',
            SettingMainPageId: '',
            SettingKegiatanId: '',
            WaktuMulai: new Date(),
            WaktuSelesai: new Date(),
        },
    })

    const onSubmit = async (data: SettingKegiatanFormValidation) => {
        setLoadingSubmit(true)
        if (titleDialog === 'Ubah Kegiatan') {
            await updateSettingKegiatan(data)
                .then((res) => {
                    toast('Data Kegiatan berhasil diubah')
                    let idx = dataKegiatan.findIndex(
                        (r) => r.SettingKegiatanId === data.SettingKegiatanId
                    )
                    setDataKegiatan(replaceItemAtIndex(dataKegiatan, idx, res))
                    setOpenDialog(false)
                    setLoadingSubmit(false)
                })
                .catch((err) => {
                    toast('Data Kegiatan gagal diubah. Error: ' + err)
                    setLoadingSubmit(false)
                })
        } else {
            await setSettingKegiatan(data)
                .then((res) => {
                    toast('Data Kegiatan berhasil ditambah')
                    setDataKegiatan([...dataKegiatan, res])
                    setLoadingSubmit(false)
                    setOpenDialog(false)
                })
                .catch((err) => {
                    toast('Data Kegiatan gagal ditambah. Error: ' + err)
                    setLoadingSubmit(false)
                })
        }
    }

    const buatData = () => {
        form.reset()
        form.setValue('SettingMainPageId', selectable.SettingMainPageId)
        setTitleDialog('Tambah Kegiatan')
        setOpenDialog(true)
    }
    const ubahData = async (jd: SettingKegiatanTypes) => {
        form.setValue('Nama', jd.Nama)
        form.setValue('Lokasi', jd.Lokasi ?? '')
        form.setValue('Deskripsi', jd.Deskripsi ?? '')
        form.setValue('JenisKegiatanId', jd.JenisKegiatanId)
        form.setValue('SettingMainPageId', jd.SettingMainPageId)
        form.setValue('SettingKegiatanId', jd.SettingKegiatanId)
        form.setValue('WaktuMulai', new Date(jd.WaktuMulai))
        form.setValue(
            'WaktuSelesai',
            jd.WaktuSelesai ? new Date(jd.WaktuSelesai) : new Date()
        )
        let k = jenisKegiatan.find(
            (x) => x.JenisKegiatanId === jd.JenisKegiatanId
        )
        if (k) {
            form.setValue('NamaJenis', k.Nama)
            form.setValue('Color', k.Color)
        }
        setTitleDialog('Ubah Kegiatan')
        setOpenDialog(true)
    }
    const hapusData = (jd: SettingKegiatanTypes) => {
        Swal.fire({
            title: 'Ingin Hapus Kegiatan ' + jd.Nama + ' ?',
            text: 'Aksi ini tidak dapat di undo',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f45f24',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteSettingKegiatan(jd.SettingKegiatanId).then(() => {
                    setDataKegiatan(
                        dataKegiatan.filter(
                            (r) => r.SettingKegiatanId !== jd.SettingKegiatanId
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

    const columns: ColumnDef<SettingKegiatanTypes>[] = [
        {
            accessorKey: 'Nama',
            header: 'Nama',
            cell: ({ row }) => (
                <div className="capitalize">{row.original.Nama}</div>
            ),
        },
        {
            accessorKey: 'Waktu',
            header: 'Waktu',
            cell: ({ row }) => (
                <div className="capitalize">
                    {format(row.original.WaktuMulai, 'PPP')} -{' '}
                    {row.original.WaktuSelesai &&
                        format(row.original.WaktuSelesai, 'PPP')}
                </div>
            ),
        },
        {
            accessorKey: 'Lokasi',
            header: 'Lokasi',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('Lokasi')}</div>
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
                                        jd.SettingKegiatanId
                                    )
                                }
                            >
                                Copy Kegiatan ID
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
        data: dataKegiatan,
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
            <Card className="shadow-md bg-gray-50 dark:bg-gray-800">
                <CardHeader>
                    <CardTitle>
                        <h1 className="text-2xl">Kegiatan</h1>
                    </CardTitle>
                    <CardDescription>Kegiatan</CardDescription>
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
                jenisKegiatan={jenisKegiatan}
            />
        </div>
    )
}

export default KegiatanComponent

export function SheetManageData({
    openDialog,
    setOpenDialog,
    onSubmit,
    loading,
    form,
    loadingSubmit,
    titleDialog,
    selectable,
    jenisKegiatan,
}: {
    openDialog: boolean
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
    loading: boolean
    onSubmit: (data: SettingKegiatanFormValidation) => void
    form: UseFormReturn<SettingKegiatanFormValidation>
    titleDialog: string
    loadingSubmit: boolean
    selectable: {
        UniversityId: string
        SettingMainPageId: string
    }
    jenisKegiatan: JenisKegiatan[]
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
                                            name="Nama"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Nama Kegiatan
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
                                                        Nama Kegiatan
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="Lokasi"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Lokasi Kegiatan
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
                                                        Lokasi Kegiatan
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="JenisKegiatanId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Jenis kegiatan
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
                                                                    jenisKegiatan.find(
                                                                        (x) =>
                                                                            x.JenisKegiatanId ===
                                                                            e
                                                                    )
                                                                if (temp) {
                                                                    form.setValue(
                                                                        'NamaJenis',
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
                                                                <SelectValue placeholder="Pilih Jenis kegiatan" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectLabel>
                                                                        Jenis
                                                                        kegiatan
                                                                    </SelectLabel>
                                                                    {jenisKegiatan.map(
                                                                        (x) => (
                                                                            <SelectItem
                                                                                value={
                                                                                    x.JenisKegiatanId
                                                                                }
                                                                                key={
                                                                                    x.JenisKegiatanId
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
                                                        Pilih Jenis kegiatan
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="WaktuMulai"
                                            render={({ field }) => {
                                                const current = field.value
                                                const [tempDate, setTempDate] =
                                                    React.useState<
                                                        Date | undefined
                                                    >(current)
                                                const [tempTime, setTempTime] =
                                                    React.useState<string>(
                                                        current
                                                            ? current
                                                                  .toTimeString()
                                                                  .slice(0, 5)
                                                            : '08:00'
                                                    )

                                                const commit = (
                                                    d?: Date,
                                                    t?: string
                                                ) => {
                                                    if (!d || !t) return
                                                    const [h, m] = t
                                                        .split(':')
                                                        .map(Number)
                                                    const combined = new Date(
                                                        d.getFullYear(),
                                                        d.getMonth(),
                                                        d.getDate(),
                                                        h ?? 0,
                                                        m ?? 0,
                                                        0,
                                                        0
                                                    )
                                                    field.onChange(combined)
                                                }

                                                const displayText = current
                                                    ? `${format(
                                                          current,
                                                          'PPP'
                                                      )} • ${format(
                                                          current,
                                                          'p'
                                                      )}`
                                                    : 'Pilih Tanggal & Waktu'

                                                return (
                                                    <FormItem className="flex flex-col">
                                                        <FormLabel>
                                                            Waktu Mulai Kegiatan
                                                        </FormLabel>
                                                        <Popover>
                                                            <PopoverTrigger
                                                                asChild
                                                            >
                                                                <FormControl>
                                                                    <Button
                                                                        variant="outline"
                                                                        className={cn(
                                                                            'w-[280px] pl-3 justify-between text-left font-normal',
                                                                            !current &&
                                                                                'text-muted-foreground'
                                                                        )}
                                                                    >
                                                                        {
                                                                            displayText
                                                                        }
                                                                        <CalendarIcon className="w-4 h-4 opacity-50" />
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent
                                                                className="w-auto p-3 space-y-3"
                                                                align="start"
                                                            >
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={
                                                                        tempDate
                                                                    }
                                                                    onSelect={(
                                                                        d
                                                                    ) => {
                                                                        setTempDate(
                                                                            d
                                                                        )
                                                                        commit(
                                                                            d,
                                                                            tempTime
                                                                        )
                                                                    }}
                                                                />

                                                                <div className="flex items-center gap-2">
                                                                    <label className="text-sm text-muted-foreground">
                                                                        Jam
                                                                    </label>
                                                                    <input
                                                                        type="time"
                                                                        value={
                                                                            tempTime
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            const v =
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            setTempTime(
                                                                                v
                                                                            )
                                                                            if (
                                                                                tempDate
                                                                            )
                                                                                commit(
                                                                                    tempDate,
                                                                                    v
                                                                                )
                                                                        }}
                                                                        className="px-2 border rounded-md h-9"
                                                                        step={
                                                                            60
                                                                        }
                                                                    />
                                                                </div>
                                                            </PopoverContent>
                                                        </Popover>
                                                        <FormDescription>
                                                            Waktu Awal
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )
                                            }}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="WaktuSelesai"
                                            render={({ field }) => {
                                                const current = field.value
                                                const [tempDate, setTempDate] =
                                                    React.useState<
                                                        Date | undefined
                                                    >(current)
                                                const [tempTime, setTempTime] =
                                                    React.useState<string>(
                                                        current
                                                            ? current
                                                                  .toTimeString()
                                                                  .slice(0, 5)
                                                            : '08:00'
                                                    )

                                                const commit = (
                                                    d?: Date,
                                                    t?: string
                                                ) => {
                                                    if (!d || !t) return
                                                    const [h, m] = t
                                                        .split(':')
                                                        .map(Number)
                                                    const combined = new Date(
                                                        d.getFullYear(),
                                                        d.getMonth(),
                                                        d.getDate(),
                                                        h ?? 0,
                                                        m ?? 0,
                                                        0,
                                                        0
                                                    )
                                                    field.onChange(combined)
                                                }

                                                const displayText = current
                                                    ? `${format(
                                                          current,
                                                          'PPP'
                                                      )} • ${format(
                                                          current,
                                                          'p'
                                                      )}`
                                                    : 'Pilih Tanggal & Waktu'

                                                return (
                                                    <FormItem className="flex flex-col">
                                                        <FormLabel>
                                                            Waktu Selesai
                                                            Kegiatan
                                                        </FormLabel>
                                                        <Popover>
                                                            <PopoverTrigger
                                                                asChild
                                                            >
                                                                <FormControl>
                                                                    <Button
                                                                        variant="outline"
                                                                        className={cn(
                                                                            'w-[280px] pl-3 justify-between text-left font-normal',
                                                                            !current &&
                                                                                'text-muted-foreground'
                                                                        )}
                                                                    >
                                                                        {
                                                                            displayText
                                                                        }
                                                                        <CalendarIcon className="w-4 h-4 opacity-50" />
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent
                                                                className="w-auto p-3 space-y-3"
                                                                align="start"
                                                            >
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={
                                                                        tempDate
                                                                    }
                                                                    onSelect={(
                                                                        d
                                                                    ) => {
                                                                        setTempDate(
                                                                            d
                                                                        )
                                                                        commit(
                                                                            d,
                                                                            tempTime
                                                                        )
                                                                    }}
                                                                />

                                                                <div className="flex items-center gap-2">
                                                                    <label className="text-sm text-muted-foreground">
                                                                        Jam
                                                                    </label>
                                                                    <input
                                                                        type="time"
                                                                        value={
                                                                            tempTime
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            const v =
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            setTempTime(
                                                                                v
                                                                            )
                                                                            if (
                                                                                tempDate
                                                                            )
                                                                                commit(
                                                                                    tempDate,
                                                                                    v
                                                                                )
                                                                        }}
                                                                        className="px-2 border rounded-md h-9"
                                                                        step={
                                                                            60
                                                                        }
                                                                    />
                                                                </div>
                                                            </PopoverContent>
                                                        </Popover>
                                                        <FormDescription>
                                                            Waktu Selesai
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )
                                            }}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="Deskripsi"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Deskripsi Kegiatan
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
                                                        Deskripsi
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
