'use client'
import { replaceItemAtIndex } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    deleteSettingNumber,
    setSettingNumber,
    updateSettingNumber,
} from '@/services/Website/AngkaService'
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
import {
    SettingNumberFormValidation,
    SettingNumberSkemaValidasi,
} from '@/validation/WebsiteFormValidation'
import { getSettingNumberPagination } from '@/services/Website/AngkaService'
import { SettingNumber } from '@/generated/prisma'

type AngkaUniversityType = {
    UniversityId: string
    Nama: string
    SettingMainPage: {
        SettingMainPageId: string
        TextMainPage2: string
    }[]
}

const AngkaComponent = ({
    university,
}: {
    university: AngkaUniversityType[]
}) => {
    const [selectable, setSelectable] = React.useState<{
        UniversityId: string
        SettingMainPageId: string
    }>({
        UniversityId: '',
        SettingMainPageId: '',
    })
    const [dataNumber, setDataNumber] = React.useState<SettingNumber[]>([])
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
            getSettingNumberPagination(
                selectable.SettingMainPageId,
                paginationState.page,
                paginationState.limit,
                search
            )
                .then(async (res) => {
                    setLoading(false)
                    setDataNumber(res.data)
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

    const form = useForm<SettingNumberFormValidation>({
        resolver: zodResolver(SettingNumberSkemaValidasi),
        defaultValues: {
            Title: '',
            Angka: '',
            Subtitle: '',
            SettingMainPageId: '',
            SettingNumberId: '',
        },
    })

    const onSubmit = async (data: SettingNumberFormValidation) => {
        setLoadingSubmit(true)
        if (titleDialog === 'Ubah Angka') {
            await updateSettingNumber(data)
                .then((res) => {
                    toast('Data Angka berhasil diubah')
                    let idx = dataNumber.findIndex(
                        (r) => r.SettingNumberId === data.SettingNumberId
                    )
                    setDataNumber(replaceItemAtIndex(dataNumber, idx, res))
                    setOpenDialog(false)
                    setLoadingSubmit(false)
                })
                .catch((err) => {
                    toast('Data Angka gagal diubah. Error: ' + err)
                    setLoadingSubmit(false)
                })
        } else {
            await setSettingNumber(data)
                .then((res) => {
                    toast('Data Angka berhasil ditambah')
                    setDataNumber([...dataNumber, res])
                    setLoading(false)
                    setLoadingSubmit(false)
                })
                .catch((err) => {
                    toast('Data Angka gagal ditambah. Error: ' + err)
                    setLoadingSubmit(false)
                })
        }
    }

    const buatData = () => {
        form.reset()
        form.setValue('SettingMainPageId', selectable.SettingMainPageId)
        setTitleDialog('Tambah Angka')
        setOpenDialog(true)
    }
    const ubahData = async (jd: SettingNumber) => {
        form.setValue('Title', jd.Title)
        form.setValue('Subtitle', jd.Subtitle)
        form.setValue('Angka', jd.Angka)
        form.setValue('SettingNumberId', jd.SettingNumberId)
        form.setValue('SettingMainPageId', jd.SettingMainPageId)
        setTitleDialog('Ubah Angka')
        setOpenDialog(true)
    }
    const hapusData = (jd: SettingNumber) => {
        Swal.fire({
            title: 'Ingin Hapus ' + jd.Title + ' ?',
            text: 'Aksi ini tidak dapat di undo',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f45f24',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteSettingNumber(jd.SettingNumberId).then(() => {
                    setDataNumber(
                        dataNumber.filter(
                            (r) => r.SettingNumberId !== jd.SettingNumberId
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

    const columns: ColumnDef<SettingNumber>[] = [
        {
            accessorKey: 'Angka',
            header: 'Angka',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('Angka')}</div>
            ),
        },
        {
            accessorKey: 'Title',
            header: 'Judul',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('Title')}</div>
            ),
        },
        {
            accessorKey: 'Subtitle',
            header: 'Sub Judul',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('Subtitle')}</div>
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
                                        jd.SettingNumberId
                                    )
                                }
                            >
                                Copy Angka ID
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
        data: dataNumber,
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
                        <h1 className="text-2xl">ITI Dalam Angka</h1>
                    </CardTitle>
                    <CardDescription>ITI Dalam Angka</CardDescription>
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

export default AngkaComponent

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
    onSubmit: (data: SettingNumberFormValidation) => void
    form: UseFormReturn<SettingNumberFormValidation>
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
                                            name="Title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Judul</FormLabel>
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
                                                        Judul
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="Subtitle"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Sub Judul
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
                                                        Sub Judul
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="Angka"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Angka</FormLabel>
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
                                                        Angka
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
