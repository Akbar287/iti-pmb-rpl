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
    AsesorMahasiswaFormValidation,
    AsesorMahasiswaSkemaValidation,
} from '@/validation/PenunjukanAsesorValidation'
import {
    deleteAsesorMahasiswa,
    getAsesorFromProdiId,
    getAsesorMahasiswaPagination,
    updateAsesorMahasiswa,
} from '@/services/Asesor/PenunjukanAsesorService'
import { MultiSelect } from '../ui/multi-select'

const PenunjukanAsesorComponent = ({
    universityDataServer,
}: {
    universityDataServer: {
        Nama: string
        UniversityId: string
        ProgramStudi: {
            Nama: string
            ProgramStudiId: string
        }[]
    }[]
}) => {
    const [dataAsesorMahasiswa, setDataAsesorMahasiswa] = React.useState<
        ResponsePenunjukanAsesor[]
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
    const [dataAsesor, setDataAsesor] = React.useState<
        ResponseAsesorFromProdi[]
    >([])
    const [selectedData, setSelectedData] = React.useState<{
        UniversityId: string
        NamaUniversity: string
        ProgramStudiId: string
        NamaProgramStudi: string
    }>({
        UniversityId: '',
        NamaProgramStudi: '',
        NamaUniversity: '',
        ProgramStudiId: '',
    })
    const [search, setSearch] = React.useState<string>('')
    const [openDialog, setOpenDialog] = React.useState<boolean>(false)
    const [loading, setLoading] = React.useState<boolean>(false)
    const [asesorSelected, setAsesorSelected] = React.useState<string[]>([])
    const form = useForm<AsesorMahasiswaFormValidation>({
        resolver: zodResolver(AsesorMahasiswaSkemaValidation) as any,
        defaultValues: {
            Asesor: [],
            ProgramStudiId: '',
            PendaftaranId: '',
            KodePendaftar: '',
            NamaProgramStudi: '',
            NamaMahasiswa: '',
        },
    })
    const onSubmit = async (data: AsesorMahasiswaFormValidation) => {
        setLoading(true)
        if (asesorSelected.length === 0) {
            toast.error('Silakan pilih Asesor terlebih dahulu')
            setLoading(false)
            return
        }
        if (dataAsesor.length === 0) {
            toast.error(
                'Asesor Program Studi ' +
                    selectedData.NamaProgramStudi +
                    ' belum diatur'
            )
            setLoading(false)
            return
        }
        let temp: {
            AssesorMahasiswaId: string
            AsesorId: string
            Urutan: number
            Confirmation: boolean
        }[] = []
        asesorSelected.forEach((a, idx) => {
            let tempAsesor = dataAsesor.find((x) => x.AsesorId === a)
            if (tempAsesor) {
                temp.push({
                    AssesorMahasiswaId: '',
                    AsesorId: a,
                    Urutan: idx + 1,
                    Confirmation: true,
                })
            }
        })
        await updateAsesorMahasiswa({
            Asesor: temp,
            ProgramStudiId: data.ProgramStudiId,
            KodePendaftar: data.KodePendaftar,
            PendaftaranId: data.PendaftaranId,
        })
            .then((res) => {
                toast('Data Asesor Mahasiswa berhasil diubah')
                let idx = dataAsesorMahasiswa.findIndex(
                    (r) => r.PendaftaranId === data.PendaftaranId
                )
                setDataAsesorMahasiswa(
                    replaceItemAtIndex(dataAsesorMahasiswa, idx, res)
                )
                setOpenDialog(false)
                setLoading(false)
            })
            .catch((err) => {
                toast('Data Asesor Mahasiswa gagal diubah. Error: ' + err)
                setLoading(false)
            })
    }
    React.useEffect(() => {
        setLoading(true)
        getAsesorMahasiswaPagination(
            paginationState.page,
            paginationState.limit,
            search,
            selectedData.ProgramStudiId
        )
            .then((res) => {
                setDataAsesorMahasiswa(res.data)
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

        if (dataAsesor.length === 0 && selectedData.ProgramStudiId !== '') {
            getAsesorFromProdiId(selectedData.ProgramStudiId)
                .then((res) => setDataAsesor(res))
                .catch((err) => {})
        }
    }, [
        paginationState.page,
        search,
        paginationState.limit,
        selectedData.ProgramStudiId,
    ])
    const ubahData = async (jd: ResponsePenunjukanAsesor) => {
        form.reset()
        setLoading(true)
        setOpenDialog(true)
        setAsesorSelected(jd.Asesor.map((a) => a.AsesorId))
        form.setValue(
            'Asesor',
            jd.Asesor.map((a) => ({
                AssesorMahasiswaId: a.AssesorMahasiswaId,
                AsesorId: a.AsesorId,
                NamaTipeAsesor: a.NamaTipeAsesor,
                NamaAsesor: a.NamaAsesor,
                Urutan: a.Urutan,
                Confirmation: a.Confirmation,
            }))
        )
        form.setValue('KodePendaftar', jd.KodePendaftar)
        form.setValue('NamaMahasiswa', jd.NamaMahasiswa)
        form.setValue('ProgramStudiId', jd.ProgramStudiId)
        form.setValue('NamaProgramStudi', jd.NamaProgramStudi)
        form.setValue('PendaftaranId', jd.PendaftaranId)
        setLoading(false)
    }
    const hapusData = (jd: ResponsePenunjukanAsesor) => {
        Swal.fire({
            title:
                'Ingin Hapus Asesor dari Mahasiswa ' + jd.NamaMahasiswa + ' ?',
            text: 'Aksi ini tidak dapat di undo',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f45f24',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteAsesorMahasiswa(jd.PendaftaranId).then(() => {
                    let idx = dataAsesorMahasiswa.findIndex(
                        (r) => r.PendaftaranId === jd.PendaftaranId
                    )
                    let temp = dataAsesorMahasiswa.find(
                        (r) => r.PendaftaranId === jd.PendaftaranId
                    )
                    if (temp) {
                        setDataAsesorMahasiswa(
                            replaceItemAtIndex(dataAsesorMahasiswa, idx, {
                                Asesor: [],
                                PendaftaranId: temp.PendaftaranId,
                                KodePendaftar: temp.KodePendaftar,
                                NamaProgramStudi: temp.NamaProgramStudi,
                                ProgramStudiId: temp.ProgramStudiId,
                                NamaMahasiswa: temp.NamaMahasiswa,
                            })
                        )
                    }
                    Swal.fire({
                        title: 'Terhapus!',
                        text: 'Asesor Mahasiswa sudah dihapus.',
                        icon: 'success',
                    })
                })
            }
        })
    }
    const columns: ColumnDef<ResponsePenunjukanAsesor>[] = [
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
            accessorKey: 'NamaMahasiswa',
            header: 'Nama',
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.getValue('NamaMahasiswa')}
                </div>
            ),
        },
        {
            accessorKey: 'NamaAsesor1',
            header: 'Nama Asesor 1',
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.original.Asesor.find((x) => x.Urutan === 1)
                        ?.NamaAsesor ?? '-'}
                </div>
            ),
        },
        {
            accessorKey: 'NamaAsesor2',
            header: 'Nama Asesor 2',
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.original.Asesor.find((x) => x.Urutan === 2)
                        ?.NamaAsesor ?? '-'}
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
                                onClick={() =>
                                    navigator.clipboard.writeText(
                                        jd.KodePendaftar
                                    )
                                }
                            >
                                Copy Kode Pendaftar ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => ubahData(jd)}>
                                Atur Asesor
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => hapusData(jd)}>
                                Hapus Semua Asesor
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]
    const table = useReactTable({
        data: dataAsesorMahasiswa,
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
                    <Select
                        value={String(paginationState.limit)}
                        disabled={loading}
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
            <div className="grid grid-cols-1 md:grid-cols-2 my-5 gap-5">
                <Select
                    disabled={universityDataServer.length === 0 || loading}
                    value={selectedData.UniversityId}
                    onValueChange={(val) => {
                        let temp = universityDataServer.find(
                            (x) => x.UniversityId === val
                        )
                        if (temp) {
                            setSelectedData({
                                UniversityId: temp.UniversityId,
                                NamaUniversity: temp.Nama,
                                ProgramStudiId: '',
                                NamaProgramStudi: '',
                            })
                        }
                    }}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih Universitas" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Pilih Universitas</SelectLabel>
                            {universityDataServer.map((u) => (
                                <SelectItem
                                    key={u.UniversityId}
                                    value={u.UniversityId}
                                >
                                    {u.Nama}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Select
                    disabled={loading || selectedData.UniversityId === ''}
                    value={selectedData.ProgramStudiId}
                    onValueChange={(val) => {
                        let temp = universityDataServer
                            .find(
                                (x) =>
                                    x.UniversityId === selectedData.UniversityId
                            )
                            ?.ProgramStudi.find((y) => y.ProgramStudiId === val)
                        if (temp) {
                            setSelectedData({
                                ...selectedData,
                                ProgramStudiId: val,
                                NamaProgramStudi: temp.Nama,
                            })
                            form.setValue('NamaProgramStudi', temp.Nama)
                            form.setValue('ProgramStudiId', val)
                            getAsesorFromProdiId(selectedData.ProgramStudiId)
                                .then((res) => setDataAsesor(res))
                                .catch((err) => {})
                        }
                    }}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih Program Studi" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Pilih Program Studi</SelectLabel>
                            {universityDataServer
                                .find(
                                    (x) =>
                                        x.UniversityId ===
                                        selectedData.UniversityId
                                )
                                ?.ProgramStudi.map((u) => (
                                    <SelectItem
                                        key={u.ProgramStudiId}
                                        value={u.ProgramStudiId}
                                    >
                                        {u.Nama}
                                    </SelectItem>
                                ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
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
                    {selectedData.ProgramStudiId === '' ? (
                        <div className="p-4 text-center text-muted-foreground">
                            Silakan pilih Universitas dan Program Studi terlebih
                            dahulu.
                        </div>
                    ) : (
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
                                                                  .columnDef
                                                                  .header,
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
                                                row.getIsSelected() &&
                                                'selected'
                                            }
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
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
                    )}
                </div>
            )}
            {selectedData.ProgramStudiId !== '' && (
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

                        {(() => {
                            const pages = []
                            const { page, totalPage } = paginationState

                            const shouldShowLeftDots = page > 3
                            const shouldShowRightDots = page < totalPage - 2

                            const renderPage = (p: number) => (
                                <Button
                                    key={p}
                                    variant={p === page ? 'default' : 'outline'}
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
                                pages.push(<span key="right-dots">...</span>)
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
            )}
            <SheetManageData
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                onSubmit={onSubmit}
                loading={loading}
                form={form}
                universityDataServer={universityDataServer}
                selectedData={selectedData}
                asesorSelected={asesorSelected}
                setAsesorSelected={setAsesorSelected}
                dataAsesor={dataAsesor}
                setDataAsesor={setDataAsesor}
            />
        </div>
    )
}

export default PenunjukanAsesorComponent

export function SheetManageData({
    openDialog,
    setOpenDialog,
    onSubmit,
    loading,
    form,
    universityDataServer,
    selectedData,
    asesorSelected,
    setAsesorSelected,
    dataAsesor,
    setDataAsesor,
}: {
    openDialog: boolean
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
    loading: boolean
    onSubmit: (data: AsesorMahasiswaFormValidation) => void
    form: UseFormReturn<AsesorMahasiswaFormValidation>
    universityDataServer: {
        UniversityId: string
        Nama: string
        ProgramStudi: {
            ProgramStudiId: string
            Nama: string
        }[]
    }[]
    selectedData: {
        UniversityId: string
        ProgramStudiId: string
        NamaProgramStudi: string
        NamaUniversity: string
    }
    asesorSelected: string[]
    setAsesorSelected: React.Dispatch<React.SetStateAction<string[]>>
    dataAsesor: ResponseAsesorFromProdi[]
    setDataAsesor: React.Dispatch<
        React.SetStateAction<ResponseAsesorFromProdi[]>
    >
}) {
    return (
        <div className="grid grid-cols-2 gap-2">
            <Sheet open={openDialog} onOpenChange={setOpenDialog}>
                <SheetContent
                    side="right"
                    className="w-screen h-screen max-w-full overflow-scroll"
                    onEscapeKeyDown={(event) => event.preventDefault()}
                    onPointerDownOutside={(event) => event.preventDefault()}
                >
                    {loading ? (
                        <div className="flex justify-center mt-3 flex-col">
                            <Skeleton className="w-full my-2 h-20" />
                            <Skeleton className="w-full my-2 h-20" />
                            <Skeleton className="w-full my-2 h-20" />
                            <Skeleton className="w-full my-2 h-20" />
                            <Skeleton className="w-full my-2 h-20" />
                        </div>
                    ) : (
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(
                                    onSubmit,
                                    (err) => {}
                                )}
                            >
                                <SheetHeader>
                                    <SheetTitle>
                                        Atur Asesor Mahasiswa
                                    </SheetTitle>
                                    <SheetDescription>
                                        Manage Data Asesor untuk Mahasiswa{' '}
                                        {form.watch('NamaMahasiswa')}
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="w-full grid grid-cols-1 gap-3 px-4">
                                    <div className="container mx-auto">
                                        <div className="grid grid-cols-1 gap-3">
                                            <FormField
                                                control={form.control}
                                                name="ProgramStudiId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Nama Universitas
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly
                                                                value={
                                                                    selectedData.NamaUniversity
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
                                                name="ProgramStudiId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Nama Program Studi
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly
                                                                value={
                                                                    selectedData.NamaProgramStudi
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
                                                name="KodePendaftar"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Kode Pendaftar
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Kode Pendaftar
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="NamaMahasiswa"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Nama Mahasiswa
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Nama Mahasiswa
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <MultiSelect
                                                options={dataAsesor.map(
                                                    (p) => ({
                                                        label: p.Nama,
                                                        value: p.AsesorId,
                                                    })
                                                )}
                                                selected={asesorSelected}
                                                onChange={setAsesorSelected}
                                                placeholder="Pilih Asesor"
                                                className="w-full"
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
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
