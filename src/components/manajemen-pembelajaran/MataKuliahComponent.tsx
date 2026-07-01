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
    Download,
    FileSpreadsheet,
    Loader2,
    MoreHorizontal,
    PenIcon,
    Timer,
    Trash2,
    Upload,
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
import { Textarea } from '@/components/ui/textarea'
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
import Swal from '@/lib/swal'
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
    importMataKuliah,
    MataKuliahImportItem,
} from '@/services/ManajemenPembelajaran/MataKuliahService'
import {
    MataKuliahFormValidation,
    MataKuliahSchemaValidation,
} from '@/validation/MataKuliahValidation'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

interface MataKuliahImportRow extends MataKuliahImportItem {
    id: string
    sourceRow: number
}

const normalizeExcelHeader = (value: unknown) =>
    String(value ?? '')
        .trim()
        .toLocaleLowerCase('id-ID')

const validateImportRow = (row: MataKuliahImportRow): string[] => {
    const errors: string[] = []
    if (!row.Kode.trim()) errors.push('Kode wajib diisi')
    if (!row.Nama.trim()) errors.push('Nama wajib diisi')
    if (!Number.isInteger(row.Sks) || row.Sks < 1 || row.Sks > 30) {
        errors.push('SKS harus bilangan bulat 1–30')
    }
    return errors
}

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
    const [refreshKey, setRefreshKey] = React.useState(0)
    const [openImportDialog, setOpenImportDialog] = React.useState(false)
    const [importRows, setImportRows] = React.useState<
        MataKuliahImportRow[]
    >([])
    const [importLoading, setImportLoading] = React.useState(false)
    const importInputRef = React.useRef<HTMLInputElement>(null)

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

    const handleExcelFile = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0]
        event.target.value = ''
        if (!file) return

        if (!/\.(xls|xlsx)$/i.test(file.name)) {
            toast.error('File harus berformat .xls atau .xlsx.')
            return
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Ukuran file maksimal 5 MB.')
            return
        }

        try {
            const XLSX = await import('xlsx')
            const workbook = XLSX.read(await file.arrayBuffer(), {
                type: 'array',
            })
            const worksheet = workbook.Sheets[workbook.SheetNames[0]]
            if (!worksheet) {
                throw new Error('File Excel tidak memiliki worksheet.')
            }

            const matrix = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
                header: 1,
                defval: '',
                raw: false,
            })
            const headers = (matrix[0] ?? []).map(normalizeExcelHeader)
            const requiredHeaders = [
                'kode',
                'nama',
                'sks',
                'semester',
                'silabus',
            ]
            const missingHeaders = requiredHeaders.filter(
                (header) => !headers.includes(header)
            )
            if (missingHeaders.length > 0) {
                throw new Error(
                    `Kolom tidak ditemukan: ${missingHeaders.join(', ')}. Gunakan template yang disediakan.`
                )
            }

            const headerIndex = new Map(
                headers.map((header, index) => [header, index])
            )
            const parsedRows = matrix
                .slice(1)
                .map((cells, index): MataKuliahImportRow => {
                    const value = (header: string) =>
                        cells[headerIndex.get(header) ?? -1] ?? ''
                    const sksValue = Number(
                        String(value('sks')).trim().replace(',', '.')
                    )
                    return {
                        id:
                            typeof crypto !== 'undefined' &&
                            crypto.randomUUID
                                ? crypto.randomUUID()
                                : `row-${Date.now()}-${index}`,
                        sourceRow: index + 2,
                        Kode: String(value('kode')).trim(),
                        Nama: String(value('nama')).trim(),
                        Sks: Number.isFinite(sksValue) ? sksValue : 0,
                        Semester: String(value('semester')).trim(),
                        Silabus: String(value('silabus')).trim(),
                    }
                })
                .filter((row) =>
                    [row.Kode, row.Nama, row.Semester, row.Silabus].some(
                        (value) => value !== ''
                    ) || row.Sks !== 0
                )

            if (parsedRows.length === 0) {
                throw new Error('File Excel tidak memiliki data mata kuliah.')
            }
            if (parsedRows.length > 1000) {
                throw new Error('Maksimal 1.000 mata kuliah per impor.')
            }

            setImportRows(parsedRows)
            setOpenImportDialog(true)
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'File Excel gagal dibaca.'
            )
        }
    }

    const updateImportRow = (
        id: string,
        field: keyof MataKuliahImportItem,
        value: string | number
    ) => {
        setImportRows((current) =>
            current.map((row) =>
                row.id === id ? { ...row, [field]: value } : row
            )
        )
    }

    const saveImportedRows = async () => {
        const invalidCount = importRows.filter(
            (row) => validateImportRow(row).length > 0
        ).length
        const normalizedCodes = importRows.map((row) =>
            row.Kode.trim().toLocaleLowerCase('id-ID')
        )
        const hasDuplicate = normalizedCodes.some(
            (code, index) =>
                !!code && normalizedCodes.indexOf(code) !== index
        )
        if (invalidCount > 0 || hasDuplicate || importRows.length === 0) {
            toast.error('Perbaiki data yang ditandai sebelum menyimpan.')
            return
        }

        setImportLoading(true)
        try {
            const result = await importMataKuliah(
                selectedProgramStudi.ProgramStudiId,
                importRows.map(({ Kode, Nama, Sks, Semester, Silabus }) => ({
                    Kode,
                    Nama,
                    Sks,
                    Semester,
                    Silabus,
                }))
            )
            toast.success(`${result.count} mata kuliah berhasil diimpor.`)
            setOpenImportDialog(false)
            setImportRows([])
            setPaginationState((current) => ({ ...current, page: 1 }))
            setRefreshKey((current) => current + 1)
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Gagal menyimpan hasil impor.'
            )
        } finally {
            setImportLoading(false)
        }
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
        refreshKey,
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
            <Card className="shadow-md">
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
                        <div className="w-full justify-end flex flex-wrap gap-2">
                            <Button
                                onClick={() => createManageData()}
                            >
                                Tambah
                            </Button>
                            <input
                                ref={importInputRef}
                                type="file"
                                accept=".xls,.xlsx"
                                className="hidden"
                                onChange={handleExcelFile}
                            />
                            <Button
                                variant="outline"
                                onClick={() =>
                                    importInputRef.current?.click()
                                }
                            >
                                <Upload />
                                Import Excel
                            </Button>
                            <Button
                                variant="outline"
                                asChild
                            >
                                <a href="/api/protected/manajemen-pembelajaran/mata-kuliah/template">
                                    <Download />
                                    Template Excel
                                </a>
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
            <ImportMataKuliahDialog
                open={openImportDialog}
                onOpenChange={setOpenImportDialog}
                rows={importRows}
                onUpdate={updateImportRow}
                onRemove={(id) =>
                    setImportRows((current) =>
                        current.filter((row) => row.id !== id)
                    )
                }
                onSave={saveImportedRows}
                loading={importLoading}
                programStudi={selectedProgramStudi.NamaProgramStudi}
            />
        </div>
    )
}

export default MataKuliahComponent

function ImportMataKuliahDialog({
    open,
    onOpenChange,
    rows,
    onUpdate,
    onRemove,
    onSave,
    loading,
    programStudi,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    rows: MataKuliahImportRow[]
    onUpdate: (
        id: string,
        field: keyof MataKuliahImportItem,
        value: string | number
    ) => void
    onRemove: (id: string) => void
    onSave: () => void
    loading: boolean
    programStudi: string
}) {
    const codeCounts = new Map<string, number>()
    rows.forEach((row) => {
        const code = row.Kode.trim().toLocaleLowerCase('id-ID')
        if (code) codeCounts.set(code, (codeCounts.get(code) ?? 0) + 1)
    })
    const rowErrors = new Map(
        rows.map((row) => {
            const errors = validateImportRow(row)
            const code = row.Kode.trim().toLocaleLowerCase('id-ID')
            if (code && (codeCounts.get(code) ?? 0) > 1) {
                errors.push('Kode duplikat di file')
            }
            return [row.id, errors] as const
        })
    )
    const invalidCount = [...rowErrors.values()].filter(
        (errors) => errors.length > 0
    ).length

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!loading) onOpenChange(nextOpen)
            }}
        >
            <DialogContent className="max-h-[92vh] overflow-hidden sm:max-w-[95vw]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileSpreadsheet className="size-5" />
                        Review Import Mata Kuliah
                    </DialogTitle>
                    <DialogDescription>
                        Periksa dan edit data untuk Program Studi{' '}
                        <strong>{programStudi}</strong>. Baris yang tidak
                        diperlukan dapat dihapus sebelum disimpan.
                    </DialogDescription>
                </DialogHeader>

                <div className="max-h-[68vh] overflow-auto rounded-md border">
                    <Table>
                        <TableHeader className="sticky top-0 z-10 bg-background">
                            <TableRow>
                                <TableHead className="w-14">Baris</TableHead>
                                <TableHead className="min-w-32">Kode</TableHead>
                                <TableHead className="min-w-56">Nama</TableHead>
                                <TableHead className="min-w-24">SKS</TableHead>
                                <TableHead className="min-w-28">
                                    Semester
                                </TableHead>
                                <TableHead className="min-w-72">
                                    Silabus
                                </TableHead>
                                <TableHead className="w-16">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows.map((row) => {
                                const errors = rowErrors.get(row.id) ?? []
                                return (
                                    <TableRow
                                        key={row.id}
                                        className={
                                            errors.length > 0
                                                ? 'bg-destructive/5'
                                                : undefined
                                        }
                                    >
                                        <TableCell className="align-top text-center">
                                            {row.sourceRow}
                                        </TableCell>
                                        <TableCell className="align-top">
                                            <Input
                                                value={row.Kode}
                                                onChange={(event) =>
                                                    onUpdate(
                                                        row.id,
                                                        'Kode',
                                                        event.target.value
                                                    )
                                                }
                                                aria-invalid={errors.some(
                                                    (error) =>
                                                        error
                                                            .toLowerCase()
                                                            .includes('kode')
                                                )}
                                            />
                                            {errors.length > 0 && (
                                                <p className="mt-1 text-xs text-destructive">
                                                    {errors.join(' • ')}
                                                </p>
                                            )}
                                        </TableCell>
                                        <TableCell className="align-top">
                                            <Input
                                                value={row.Nama}
                                                onChange={(event) =>
                                                    onUpdate(
                                                        row.id,
                                                        'Nama',
                                                        event.target.value
                                                    )
                                                }
                                                aria-invalid={!row.Nama.trim()}
                                            />
                                        </TableCell>
                                        <TableCell className="align-top">
                                            <Input
                                                type="number"
                                                min={1}
                                                max={30}
                                                value={row.Sks}
                                                onChange={(event) =>
                                                    onUpdate(
                                                        row.id,
                                                        'Sks',
                                                        Number(
                                                            event.target.value
                                                        )
                                                    )
                                                }
                                                aria-invalid={
                                                    !Number.isInteger(
                                                        row.Sks
                                                    ) ||
                                                    row.Sks < 1 ||
                                                    row.Sks > 30
                                                }
                                            />
                                        </TableCell>
                                        <TableCell className="align-top">
                                            <Input
                                                value={row.Semester}
                                                onChange={(event) =>
                                                    onUpdate(
                                                        row.id,
                                                        'Semester',
                                                        event.target.value
                                                    )
                                                }
                                            />
                                        </TableCell>
                                        <TableCell className="align-top">
                                            <Textarea
                                                className="min-h-20"
                                                value={row.Silabus}
                                                onChange={(event) =>
                                                    onUpdate(
                                                        row.id,
                                                        'Silabus',
                                                        event.target.value
                                                    )
                                                }
                                            />
                                        </TableCell>
                                        <TableCell className="align-top">
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="ghost"
                                                onClick={() =>
                                                    onRemove(row.id)
                                                }
                                                disabled={loading}
                                                title="Hapus baris"
                                            >
                                                <Trash2 />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>

                <DialogFooter className="items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                        {rows.length} baris
                        {invalidCount > 0
                            ? ` • ${invalidCount} perlu diperbaiki`
                            : ' • Semua data valid'}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            onClick={onSave}
                            disabled={
                                loading ||
                                rows.length === 0 ||
                                invalidCount > 0
                            }
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <Upload />
                            )}
                            Simpan {rows.length} Data
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

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
