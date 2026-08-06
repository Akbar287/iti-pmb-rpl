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
import Image from 'next/image'
import { toast } from 'sonner'
import {
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    FileText,
    MoreHorizontal,
    PenLine,
    Timer,
    X,
} from 'lucide-react'
import {
    ResponseTandaTanganSkType,
    ResponseTandaTanganSkValue,
    PejabatPenandatanganType,
    HasilTandaTanganType,
} from '@/types/TandaTanganTypes'
import {
    getFileSkTandaTanganByNamafile,
    getPejabatPenandatangan,
    getTandaTanganPagination,
    setTandaTanganSk,
} from '@/services/TandaTangan/TandaTanganService'
import { setStatusSinkronisasiHasilAsessmen } from '@/services/Status/StatusService'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'
import { Skeleton } from '../ui/skeleton'
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
import Swal from '@/lib/swal'

export default function TandaTanganComponent() {
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
    const [data, setData] = React.useState<ResponseTandaTanganSkType[]>([])
    const [dataSelected, setDataSelected] =
        React.useState<ResponseTandaTanganSkType>(ResponseTandaTanganSkValue)
    const [loading, setLoading] = React.useState<boolean>(false)
    const [hasil, setHasil] = React.useState<HasilTandaTanganType | null>(null)

    React.useEffect(() => {
        setLoading(true)
        getTandaTanganPagination(
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
                toast.error('Gagal memuat daftar SK yang menunggu tanda tangan')
            })
    }, [paginationState.page, search, paginationState.limit])

    const kirimTandaTangan = async (officialId: number, tanggalSk: string) => {
        const konfirmasi = await Swal.fire({
            title: 'Tandatangani SK ini ?',
            text:
                'SK ' +
                dataSelected.Sk.NomorSk +
                ' akan ditandatangani secara elektronik dan dikunci. Aksi ini tidak dapat dibatalkan.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f45f24',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Tandatangani!',
            cancelButtonText: 'Batalkan',
        })

        if (!konfirmasi.isConfirmed) return

        setLoading(true)
        try {
            const res = await setTandaTanganSk(
                dataSelected.PendaftaranId,
                dataSelected.Sk.SkRektorId,
                officialId,
                tanggalSk || undefined
            )

            // Berkas lanjut ke sinkronisasi hanya bila seluruh SK mahasiswa
            // tersebut sudah ditandatangani.
            if (res.data.SemuaDitandatangani) {
                await setStatusSinkronisasiHasilAsessmen(
                    dataSelected.PendaftaranId
                )
                // Mahasiswa belum dikabari di sini: Akademik yang memutuskan
                // kapan SK dipublikasikan.
                toast.success(
                    'Seluruh SK mahasiswa ini sudah ditandatangani dan menunggu publikasi Akademik'
                )
            } else {
                toast.success(
                    `SK ditandatangani. Masih ada ${res.data.SisaBelumDitandatangani} SK milik mahasiswa ini.`
                )
            }

            setHasil(res.data)
            setData(
                data.filter(
                    (x) => x.Sk.SkRektorId !== dataSelected.Sk.SkRektorId
                )
            )
            setOpenDialog(false)
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : 'Gagal menandatangani SK'
            )
        } finally {
            setLoading(false)
        }
    }

    const columns: ColumnDef<ResponseTandaTanganSkType>[] = [
        {
            accessorKey: 'NamaMahasiswa',
            header: 'Nama Mahasiswa',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('NamaMahasiswa')}</div>
            ),
        },
        {
            accessorKey: 'KodePendaftar',
            header: 'Kode Pendaftar',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('KodePendaftar')}</div>
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
                    {row.original.Sk.JenisSkAsessmen === 'TRANSFER_SKS'
                        ? 'Transfer SKS'
                        : 'Perolehan SKS'}
                </Badge>
            ),
        },
        {
            id: 'NomorSk',
            header: 'Nomor SK',
            cell: ({ row }) => <div>{row.original.Sk.NomorSk || '-'}</div>,
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
                                        jd.KodePendaftar
                                    )
                                }
                            >
                                Salin Kode Pendaftar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setDataSelected(jd)
                                    setOpenDialog(true)
                                }}
                            >
                                Tandatangani SK
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
                                        Tidak ada SK yang menunggu tanda tangan.
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

            <SheetTandaTangan
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                loading={loading}
                dataSelected={dataSelected}
                kirimTandaTangan={kirimTandaTangan}
            />

            <DialogHasilTandaTangan
                hasil={hasil}
                setHasil={setHasil}
            />
        </div>
    )
}

function SheetTandaTangan({
    openDialog,
    setOpenDialog,
    loading,
    dataSelected,
    kirimTandaTangan,
}: {
    openDialog: boolean
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
    loading: boolean
    dataSelected: ResponseTandaTanganSkType
    kirimTandaTangan: (officialId: number, tanggalSk: string) => Promise<void>
}) {
    const [pdfPreviewUrl, setPdfPreviewUrl] = React.useState<string | null>(null)
    const [openPreview, setOpenPreview] = React.useState<boolean>(false)
    const [pejabat, setPejabat] = React.useState<PejabatPenandatanganType[]>([])
    const [loadingPejabat, setLoadingPejabat] = React.useState<boolean>(false)
    const [officialId, setOfficialId] = React.useState<string>('')
    const [tanggalSk, setTanggalSk] = React.useState<string>(
        new Date().toISOString().slice(0, 10)
    )

    React.useEffect(() => {
        if (!openDialog) return
        setLoadingPejabat(true)
        getPejabatPenandatangan()
            .then((res) => {
                setPejabat(res)
                // Pejabat dengan jabatan Rektor dipilih lebih dulu bila tersedia.
                const rektor = res.find((p) =>
                    p.position.toLowerCase().includes('rektor')
                )
                if (rektor) setOfficialId(String(rektor.id))
            })
            .catch(() =>
                toast.error(
                    'Gagal memuat daftar pejabat dari QR Code Generator ITI'
                )
            )
            .finally(() => setLoadingPejabat(false))
    }, [openDialog])

    const openPreviewSk = async () => {
        try {
            const url = await getFileSkTandaTanganByNamafile(
                dataSelected.Sk.NamaFile
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
                        <SheetTitle>Penandatanganan SK</SheetTitle>
                        <SheetDescription>
                            Periksa dokumen SK yang diunggah Akademik, lalu
                            konfirmasi penandatanganan. QR verifikasi akan
                            ditempel ke dokumen dan SK dikunci setelahnya.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid w-full grid-cols-1 px-4">
                        <div className="container mx-auto">
                            <div className="grid grid-cols-1 gap-3">
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
                                    <Label htmlFor="programstudi">
                                        Program Studi
                                    </Label>
                                    <Input
                                        readOnly
                                        id="programstudi"
                                        value={dataSelected.NamaProgramStudi}
                                    />
                                </div>

                                <div className="grid items-center w-full max-w-sm gap-3">
                                    <Label htmlFor="kodependaftar">
                                        Kode Pendaftar
                                    </Label>
                                    <Input
                                        readOnly
                                        id="kodependaftar"
                                        value={dataSelected.KodePendaftar}
                                    />
                                </div>

                                <Separator />
                                <h5 className="text-center">
                                    Surat Keputusan dari Akademik
                                </h5>

                                <div className="grid items-center w-full max-w-sm gap-3">
                                    <Label htmlFor="jenissk">Jenis SK</Label>
                                    <Input
                                        readOnly
                                        id="jenissk"
                                        value={
                                            dataSelected.Sk.JenisSkAsessmen ===
                                                'TRANSFER_SKS'
                                                ? 'SK Transfer SKS'
                                                : 'SK Perolehan SKS'
                                        }
                                    />
                                </div>

                                <div className="grid items-center w-full max-w-sm gap-3">
                                    <Label htmlFor="namask">Nama SK</Label>
                                    <Input
                                        readOnly
                                        id="namask"
                                        value={dataSelected.Sk.NamaSk}
                                    />
                                </div>

                                <div className="grid items-center w-full max-w-sm gap-3">
                                    <Label htmlFor="nomorsk">Nomor SK</Label>
                                    <Input
                                        readOnly
                                        id="nomorsk"
                                        value={dataSelected.Sk.NomorSk}
                                    />
                                </div>

                                <div className="grid items-center w-full max-w-sm gap-3">
                                    <Label htmlFor="tahunsk">Tahun SK</Label>
                                    <Input
                                        readOnly
                                        id="tahunsk"
                                        value={String(dataSelected.Sk.TahunSk)}
                                    />
                                </div>

                                <div className="grid items-center w-full max-w-sm gap-3">
                                    <Label>Dokumen SK</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={
                                            loading || !dataSelected.Sk.NamaFile
                                        }
                                        onClick={() => openPreviewSk()}
                                    >
                                        <FileText className="w-4 h-4" />
                                        {dataSelected.Sk.NamaDokumen ||
                                            'Dokumen belum tersedia'}
                                    </Button>
                                </div>

                                <Separator />
                                <h5 className="text-center">
                                    Konfirmasi Tanda Tangan
                                </h5>

                                <div className="grid items-center w-full max-w-sm gap-3">
                                    <Label htmlFor="pejabat">
                                        Pejabat Penandatangan
                                    </Label>
                                    <Select
                                        value={officialId}
                                        disabled={loading || loadingPejabat}
                                        onValueChange={setOfficialId}
                                    >
                                        <SelectTrigger
                                            id="pejabat"
                                            className="w-full"
                                        >
                                            <SelectValue
                                                placeholder={
                                                    loadingPejabat
                                                        ? 'Memuat daftar pejabat ...'
                                                        : 'Pilih Pejabat'
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>
                                                    Pejabat Aktif
                                                </SelectLabel>
                                                {pejabat.map((p) => (
                                                    <SelectItem
                                                        key={p.id}
                                                        value={String(p.id)}
                                                    >
                                                        {p.name} - {p.position}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid items-center w-full max-w-sm gap-3">
                                    <Label htmlFor="tanggalsk">
                                        Tanggal SK
                                    </Label>
                                    <Input
                                        id="tanggalsk"
                                        type="date"
                                        disabled={loading}
                                        value={tanggalSk}
                                        onChange={(e) =>
                                            setTanggalSk(e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <SheetFooter>
                        <Button
                            className="transition-all duration-150 hover:scale-105 active:scale-95"
                            disabled={loading || !officialId}
                            onClick={() =>
                                kirimTandaTangan(Number(officialId), tanggalSk)
                            }
                        >
                            {loading ? (
                                <React.Fragment>
                                    <Timer /> Loading
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <PenLine /> Tandatangani
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
                            Preview {dataSelected.Sk.NamaDokumen}
                        </DialogTitle>
                        <DialogDescription>
                            Dokumen SK Penetapan Hasil Asessmen
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

function DialogHasilTandaTangan({
    hasil,
    setHasil,
}: {
    hasil: HasilTandaTanganType | null
    setHasil: React.Dispatch<React.SetStateAction<HasilTandaTanganType | null>>
}) {
    return (
        <Dialog open={hasil !== null} onOpenChange={() => setHasil(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>SK Telah Ditandatangani</DialogTitle>
                    <DialogDescription>
                        Nomor surat resmi dari Sisurat dan QR verifikasi sudah
                        disematkan ke dokumen SK. Dokumen kini terkunci dan tidak
                        dapat diganti lagi.
                    </DialogDescription>
                </DialogHeader>
                {hasil && (
                    <div className="flex flex-col items-center gap-3">
                        <Image
                            src={hasil.QrcodeBase64}
                            alt="QR Tanda Tangan"
                            width={180}
                            height={180}
                            unoptimized
                        />
                        <p className="text-sm text-center">
                            <span className="block mb-2 font-mono text-xs">
                                Nomor surat: {hasil.NomorSurat}
                            </span>
                            <span className="font-semibold">
                                {hasil.OfficialNama}
                            </span>
                            <br />
                            <span className="text-muted-foreground">
                                {hasil.OfficialJabatan}
                            </span>
                        </p>
                        <a
                            href={hasil.VerifyUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Halaman verifikasi
                        </a>
                    </div>
                )}
                <DialogFooter>
                    <Button type="button" onClick={() => setHasil(null)}>
                        Tutup
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
