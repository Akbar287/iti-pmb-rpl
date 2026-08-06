'use client'

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
import { toast } from 'sonner'
import {
    ChevronLeft,
    ChevronRight,
    FileText,
    MoreHorizontal,
    PenIcon,
    Timer,
    X,
} from 'lucide-react'
import {
    ResponseSkHasilForWarek,
    ResponseSkHasilForWarekValue,
} from '@/types/FinalAsessmen'
import {
    getFileSkHasilBlobByNamafile,
    getSkHasilWarekPagination,
    setPersetujuanSkHasil,
} from '@/services/Approval/ApprovalSkHasilService'
import {
    setStatusPenandatangananSk,
    setStatusPenerbitanSKAsessmen,
} from '@/services/Status/StatusService'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { Skeleton } from '../ui/skeleton'
import { Textarea } from '../ui/textarea'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu'
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog'

export default function PersetujuanSkHasilComponent() {
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
    const [approval, setApproval] = React.useState<{
        approval: boolean
        catatan: string
    }>({ approval: true, catatan: '' })
    const [data, setData] = React.useState<ResponseSkHasilForWarek[]>([])
    const [dataSelected, setDataSelected] =
        React.useState<ResponseSkHasilForWarek>(ResponseSkHasilForWarekValue)
    const [loading, setLoading] = React.useState<boolean>(false)

    React.useEffect(() => {
        setLoading(true)
        getSkHasilWarekPagination(
            paginationState.page,
            paginationState.limit,
            search
        )
            .then((res) => {
                setData(res.data)
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
                setLoading(false)
            })
            .catch(() => {
                setLoading(false)
                toast.error('Gagal memuat daftar SK hasil asesmen')
            })
    }, [paginationState.page, search, paginationState.limit])

    const sendApproval = async () => {
        setLoading(true)
        try {
            const res = await setPersetujuanSkHasil(
                dataSelected.SkRektorId,
                dataSelected.PendaftaranId,
                approval.approval,
                approval.catatan
            )

            if (approval.approval) {
                // Berkas lanjut ke Rektor hanya bila seluruh SK mahasiswa itu
                // sudah disetujui.
                if (res.data.SemuaDisetujui) {
                    await setStatusPenandatangananSk(dataSelected.PendaftaranId)
                    toast.success(
                        'Seluruh SK disetujui, berkas lanjut ke Rektor untuk ditandatangani'
                    )
                } else {
                    toast.success(
                        `SK disetujui. Masih ada ${res.data.SisaBelumDisetujui} SK yang menunggu persetujuan.`
                    )
                }
                setData(
                    data.filter(
                        (x) => x.SkRektorId !== dataSelected.SkRektorId
                    )
                )
            } else {
                // SK ditolak: berkas dikembalikan ke Akademik untuk direvisi.
                await setStatusPenerbitanSKAsessmen(dataSelected.PendaftaranId)
                toast.success(
                    'SK dikembalikan ke Akademik untuk direvisi'
                )
                setData(
                    data.filter(
                        (x) => x.PendaftaranId !== dataSelected.PendaftaranId
                    )
                )
            }
            setOpenDialog(false)
        } catch (err) {
            toast.error(
                err instanceof Error
                    ? err.message
                    : 'Terjadi kesalahan saat menyimpan persetujuan'
            )
        } finally {
            setLoading(false)
        }
    }

    const columns: ColumnDef<ResponseSkHasilForWarek>[] = [
        {
            accessorKey: 'NamaMahasiswa',
            header: 'Nama Mahasiswa',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('NamaMahasiswa')}</div>
            ),
        },
        {
            accessorKey: 'NamaProgramStudi',
            header: 'Program Studi',
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.getValue('NamaProgramStudi')}
                </div>
            ),
        },
        {
            id: 'JenisSk',
            header: 'Jenis SK',
            cell: ({ row }) => (
                <Badge variant="secondary">
                    {row.original.JenisSkAsessmen === 'TRANSFER_SKS'
                        ? 'Transfer SKS'
                        : 'Perolehan SKS'}
                </Badge>
            ),
        },
        {
            accessorKey: 'NomorSk',
            header: 'Nomor SK',
            cell: ({ row }) => <div>{row.getValue('NomorSk')}</div>,
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
                                    navigator.clipboard.writeText(jd.NomorSk)
                                }
                            >
                                Salin Nomor SK
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setDataSelected(jd)
                                    setApproval({ approval: true, catatan: '' })
                                    setOpenDialog(true)
                                }}
                            >
                                Berikan Approval
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    const table = useReactTable({
        data: data,
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
                        setPaginationState({ ...paginationState, page: 1 })
                        setSearch(event.target.value)
                    }}
                    className="max-w-sm"
                />
                <div className="flex justify-end w-full">
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
            {loading ? (
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
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
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
                                        Tidak ada SK hasil asesmen yang menunggu persetujuan.
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
                    {paginationState.totalElement === 0
                        ? 0
                        : paginationState.page * paginationState.limit -
                        paginationState.limit +
                        1}{' '}
                    -{' '}
                    {paginationState.totalElement <
                        paginationState.page * paginationState.limit
                        ? paginationState.totalElement
                        : paginationState.page * paginationState.limit}{' '}
                    dari {paginationState.totalElement} Data.
                </div>
                <div className="flex items-center mt-4 space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setPaginationState({
                                ...paginationState,
                                page: paginationState.page - 1,
                            })
                        }
                        disabled={!paginationState.hasPrevious}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setPaginationState({
                                ...paginationState,
                                page: paginationState.page + 1,
                            })
                        }
                        disabled={!paginationState.hasNext}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <SheetPersetujuanSkHasil
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                loading={loading}
                dataSelected={dataSelected}
                approval={approval}
                setApproval={setApproval}
                sendApproval={sendApproval}
            />
        </div>
    )
}

function SheetPersetujuanSkHasil({
    openDialog,
    setOpenDialog,
    loading,
    dataSelected,
    approval,
    setApproval,
    sendApproval,
}: {
    openDialog: boolean
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
    loading: boolean
    dataSelected: ResponseSkHasilForWarek
    approval: { approval: boolean; catatan: string }
    setApproval: React.Dispatch<
        React.SetStateAction<{ approval: boolean; catatan: string }>
    >
    sendApproval: () => void
}) {
    const [pdfPreviewUrl, setPdfPreviewUrl] = React.useState<string | null>(null)
    const [openPreview, setOpenPreview] = React.useState<boolean>(false)

    const openPreviewSk = async () => {
        try {
            const url = await getFileSkHasilBlobByNamafile(
                dataSelected.NamaFile
            )
            setPdfPreviewUrl(url)
            setOpenPreview(true)
        } catch {
            toast.error('Gagal membuka preview dokumen SK')
        }
    }

    return (
        <React.Fragment>
            <Sheet open={openDialog} onOpenChange={setOpenDialog}>
                <SheetContent
                    side="right"
                    className="w-screen h-screen max-w-full overflow-scroll"
                    onEscapeKeyDown={(event) => event.preventDefault()}
                    onPointerDownOutside={(event) => event.preventDefault()}
                >
                    <SheetHeader>
                        <SheetTitle>Persetujuan SK Hasil Asessmen</SheetTitle>
                        <SheetDescription>
                            SK yang disetujui diteruskan ke Rektor untuk
                            ditandatangani. SK yang ditolak dikembalikan ke
                            Akademik untuk direvisi.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid w-full grid-cols-1 px-4">
                        <div className="container mx-auto">
                            <div className="grid grid-cols-1 gap-3">
                                <h5 className="text-center">Informasi SK</h5>

                                <div className="grid items-center w-full max-w-sm gap-3">
                                    <Label htmlFor="namask">Nama SK</Label>
                                    <Input
                                        readOnly
                                        id="namask"
                                        value={dataSelected.NamaSk}
                                    />
                                </div>

                                <div className="grid items-center w-full max-w-sm gap-3">
                                    <Label htmlFor="nomorsk">Nomor SK</Label>
                                    <Input
                                        readOnly
                                        id="nomorsk"
                                        value={dataSelected.NomorSk}
                                    />
                                </div>

                                <div className="grid items-center w-full max-w-sm gap-3">
                                    <Label htmlFor="tahunsk">Tahun SK</Label>
                                    <Input
                                        readOnly
                                        id="tahunsk"
                                        value={String(dataSelected.TahunSk)}
                                    />
                                </div>

                                <div className="grid items-center w-full max-w-sm gap-3">
                                    <Label>Dokumen SK</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={
                                            loading || !dataSelected.NamaFile
                                        }
                                        onClick={() => openPreviewSk()}
                                    >
                                        <FileText className="w-4 h-4" />
                                        {dataSelected.NamaDokumen ||
                                            'Dokumen belum tersedia'}
                                    </Button>
                                </div>

                                <Separator />
                                <h5 className="text-center">
                                    Informasi Mahasiswa
                                </h5>

                                <div className="grid items-center w-full max-w-sm gap-3">
                                    <Label htmlFor="namamahasiswa">
                                        Nama Mahasiswa
                                    </Label>
                                    <Input
                                        readOnly
                                        id="namamahasiswa"
                                        value={dataSelected.NamaMahasiswa}
                                    />
                                </div>

                                <div className="grid items-center w-full max-w-sm gap-3">
                                    <Label htmlFor="prodi">Program Studi</Label>
                                    <Input
                                        readOnly
                                        id="prodi"
                                        value={dataSelected.NamaProgramStudi}
                                    />
                                </div>

                                <div className="grid items-center w-full max-w-sm gap-3">
                                    <Label htmlFor="jenissk">Jenis SK</Label>
                                    <Input
                                        readOnly
                                        id="jenissk"
                                        value={
                                            dataSelected.JenisSkAsessmen ===
                                                'TRANSFER_SKS'
                                                ? 'SK Transfer SKS'
                                                : 'SK Perolehan SKS'
                                        }
                                    />
                                </div>

                                <Separator />
                                <h5 className="text-center">
                                    Masukan Approval anda
                                </h5>

                                <label
                                    className={`flex cursor-pointer flex-col rounded-2xl border p-4 shadow transition-all hover:shadow-md ${approval.approval
                                        ? 'border-primary/50 bg-primary/20 dark:bg-gray-800 dark:border-gray-300 dark:text-gray-100'
                                        : 'border-gray-300'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        disabled={loading}
                                        checked={approval.approval}
                                        onChange={() =>
                                            setApproval({
                                                ...approval,
                                                approval: true,
                                            })
                                        }
                                        className="hidden peer"
                                    />
                                    <div className="text-lg font-medium text-center">
                                        Disetujui
                                    </div>
                                </label>

                                <label
                                    className={`flex cursor-pointer flex-col rounded-2xl border p-4 shadow transition-all hover:shadow-md ${!approval.approval
                                        ? 'border-primary/50 bg-primary/20 dark:bg-gray-800 dark:border-gray-300 dark:text-gray-100'
                                        : 'border-gray-300'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        disabled={loading}
                                        checked={!approval.approval}
                                        onChange={() =>
                                            setApproval({
                                                ...approval,
                                                approval: false,
                                            })
                                        }
                                        className="hidden peer"
                                    />
                                    <div className="text-lg font-medium text-center">
                                        Tidak Disetujui
                                    </div>
                                </label>

                                <div className="grid items-center w-full max-w-sm gap-3">
                                    <Label htmlFor="catatan">Catatan</Label>
                                    <Textarea
                                        id="catatan"
                                        disabled={loading}
                                        placeholder="Catatan untuk Akademik"
                                        value={approval.catatan}
                                        onChange={(e) =>
                                            setApproval({
                                                ...approval,
                                                catatan: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <SheetFooter>
                        <Button
                            onClick={() => sendApproval()}
                            className="transition-all duration-150 hover:scale-105 active:scale-95"
                            disabled={loading}
                        >
                            {loading ? (
                                <React.Fragment>
                                    <Timer /> Loading
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <PenIcon /> Simpan
                                </React.Fragment>
                            )}
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            <Dialog open={openPreview} onOpenChange={setOpenPreview}>
                <DialogContent className="w-full max-h-[80vh] overflow-y-scroll">
                    <DialogHeader>
                        <DialogTitle>
                            Preview {dataSelected.NamaDokumen}
                        </DialogTitle>
                        <DialogDescription>
                            Dokumen SK Hasil Asessmen
                        </DialogDescription>
                    </DialogHeader>
                    {pdfPreviewUrl === null ? (
                        <Skeleton className="w-full h-32" />
                    ) : (
                        <iframe
                            src={pdfPreviewUrl}
                            title="PDF Preview"
                            width="100%"
                            height="500px"
                            className="border rounded"
                        />
                    )}
                    <DialogFooter>
                        <Button
                            variant="destructive"
                            type="button"
                            onClick={() => setOpenPreview(false)}
                        >
                            <X /> Tutup
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    )
}
