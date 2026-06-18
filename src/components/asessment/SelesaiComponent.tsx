'use client'
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { ChevronLeft, ChevronRight, FileText, Loader2, MoreHorizontal, X } from 'lucide-react'
import { toast } from 'sonner'
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
import { ResponseSkRektorAsessmenType } from '@/types/FinalAsessmen'
import {
    getFileSkAsessmenBlobByNamafile,
    getSelesaiPagination,
    getSkAsessmenAkademikRolePagination,
    getSkAsessmenAsesorRolePagination,
    getSkAsessmenMahasiswaPagination,
    getSkAsessmenPagination,
} from '@/services/Asessment/SkRektorAsessmenService'
import { Badge } from '../ui/badge'
import { useRouter } from 'next/navigation'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog'
import {
    GenerateRekapitulasiPdf,
    GenerateBeritaAcara,
    GenerateFormAsessmen,
} from '@/services/GeneratePdfService'

export default function SelesaiComponent() {
    const [data, setData] = React.useState<ResponseSkRektorAsessmenType[]>([])
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
    const [previewPdf, setPreviewPdf] = React.useState<string>('')
    const [openDialog, setOpenDialog] = React.useState<boolean>(false)
    const [loading, setLoading] = React.useState<boolean>(false)
    const [openDialogGeneratePdf, setOpenDialogGeneratePdf] = React.useState<boolean>(false)
    const [pdfPreviewUrl, setPdfPreviewUrl] = React.useState<string | null>(null)
    const [loadingPdf, setLoadingPdf] = React.useState<boolean>(false)
    const [pdfDialogMeta, setPdfDialogMeta] = React.useState<{
        title: string
        description: string
        downloadFileName: string
    }>({
        title: 'Preview PDF',
        description: 'Preview dokumen PDF',
        downloadFileName: 'dokumen.pdf',
    })


    React.useEffect(() => {
        getSelesaiPagination(
            paginationState.page,
            paginationState.limit,
            search,
        )
            .then((res) => {
                setData(res.data)
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
    ])
    const unduhSk = (d: ResponseSkRektorAsessmenType) => {
        getFileSkAsessmenBlobByNamafile(d.NamaFile)
            .then((res) => {
                setPreviewPdf(res)
                setOpenDialog(true)
            })
            .catch((err) => { })
    }

    const generateRekapitulasiPdfWindow = async (PendaftaranId: string) => {
        setLoadingPdf(true)
        setOpenDialogGeneratePdf(true)
        setPdfPreviewUrl(null)
        setPdfDialogMeta({
            title: 'Preview Rekapitulasi PDF',
            description: 'Preview dokumen rekapitulasi hasil penilaian RPL perolehan kredit',
            downloadFileName: 'rekapitulasi-penilaian-rpl.pdf',
        })
        await GenerateRekapitulasiPdf(PendaftaranId)
            .then((res) => {
                setPdfPreviewUrl(res)
                setLoadingPdf(false)
            })
            .catch((err) => {
                toast.error(`Gagal Generate Rekapitulasi Pdf${err instanceof Error ? `: ${err.message}` : ''}`)
                setLoadingPdf(false)
            })
    }

    const generateBeritaAcaraWindow = async (PendaftaranId: string) => {
        setLoadingPdf(true)
        setOpenDialogGeneratePdf(true)
        setPdfPreviewUrl(null)
        setPdfDialogMeta({
            title: 'Preview Berita Acara PDF',
            description: 'Preview berita acara rapat pleno pengesahan penilaian RPL',
            downloadFileName: 'berita-acara-rpl.pdf',
        })
        await GenerateBeritaAcara(PendaftaranId)
            .then((res) => {
                setPdfPreviewUrl(res)
                setLoadingPdf(false)
            })
            .catch((err) => {
                toast.error(`Gagal Generate Berita Acara Pdf${err instanceof Error ? `: ${err.message}` : ''}`)
                setLoadingPdf(false)
            })
    }

    const generateFormAsessmenWindow = async (PendaftaranId: string) => {
        setLoadingPdf(true)
        setOpenDialogGeneratePdf(true)
        setPdfPreviewUrl(null)
        setPdfDialogMeta({
            title: 'Preview Form Asessmen PDF',
            description: 'Preview formulir evaluasi diri calon mahasiswa RPL',
            downloadFileName: 'form-asessmen-rpl.pdf',
        })
        await GenerateFormAsessmen(PendaftaranId)
            .then((res) => {
                setPdfPreviewUrl(res)
                setLoadingPdf(false)
            })
            .catch((err) => {
                toast.error(`Gagal Generate Form Asessmen Pdf${err instanceof Error ? `: ${err.message}` : ''}`)
                setLoadingPdf(false)
            })
    }

    const handleCloseDialogPdf = () => {
        setOpenDialogGeneratePdf(false)
        setPdfPreviewUrl(null)
    }

    const columns: ColumnDef<ResponseSkRektorAsessmenType>[] = [
        {
            accessorKey: 'KodePendaftar',
            header: 'KodePendaftar',
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.getValue('KodePendaftar')}
                </div>
            ),
        },
        {
            accessorKey: 'Nim',
            header: 'Nim',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('Nim')}</div>
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
            accessorKey: 'ProgramStudi',
            header: 'Program Studi',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('ProgramStudi')}</div>
            ),
        },
        {
            accessorKey: 'NomorSk',
            header: 'Nomor Sk',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('NomorSk')}</div>
            ),
        },
        {
            accessorKey: 'SkRektor',
            header: 'SkRektor',
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.original.Status == 'Hasil Final Asessmen' ? (
                        <Badge variant={'default'}>Upload Sk</Badge>
                    ) : row.original.Status == 'Persetujuan Hasil Final' ? (
                        <Badge variant={'destructive'}>Persetujuan Warek</Badge>
                    ) : row.original.Status == 'Penerbitan SK Asessmen' ? (
                        <Badge variant={'destructive'}>Finalisasi Sk</Badge>
                    ) : row.original.Status == 'Sinkronisasi Hasil Asessmen' ? (
                        <Badge variant={'destructive'}>Sk Terbit</Badge>
                    ) : (<Badge variant={'destructive'}>Selesai</Badge>)}
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
                                        jd.PendaftaranId
                                    )
                                }
                            >
                                Copy Pendaftaran ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => generateRekapitulasiPdfWindow(row.original.PendaftaranId)}
                            >
                                Preview Generate Rekapitulasi PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => generateBeritaAcaraWindow(row.original.PendaftaranId)}
                            >
                                Preview Generate Berita Acara PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => generateFormAsessmenWindow(row.original.PendaftaranId)}
                            >
                                Preview Generate Form Asessmen PDF
                            </DropdownMenuItem>
                            {jd.NamaFile !== '' ? (
                                <DropdownMenuItem onClick={() => unduhSk(jd)}>
                                    Unduh SK
                                </DropdownMenuItem>
                            ) : <></>}
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
            <Dialog open={openDialogGeneratePdf} onOpenChange={(open) => {
                if (!open) handleCloseDialogPdf()
                else setOpenDialogGeneratePdf(open)
            }}>
                <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            {pdfDialogMeta.title}
                        </DialogTitle>
                        <DialogDescription>
                            {pdfDialogMeta.description}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        {loadingPdf ? (
                            <div className="flex flex-col items-center justify-center h-[400px] gap-4">
                                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                <p className="text-sm text-muted-foreground">Generating PDF...</p>
                            </div>
                        ) : pdfPreviewUrl ? (
                            <div>
                                <iframe
                                    src={pdfPreviewUrl}
                                    title="PDF Preview"
                                    width="100%"
                                    height="500px"
                                    className="border rounded"
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[400px] gap-4">
                                <FileText className="h-16 w-16 text-muted-foreground/50" />
                                <p className="text-sm text-muted-foreground">Tidak ada PDF untuk ditampilkan</p>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCloseDialogPdf}
                        >
                            Tutup
                        </Button>
                        {pdfPreviewUrl && (
                            <Button
                                type="button"
                                onClick={() => {
                                    if (pdfPreviewUrl) {
                                        const link = document.createElement('a')
                                        link.href = pdfPreviewUrl
                                        link.download = pdfDialogMeta.downloadFileName
                                        link.click()
                                    }
                                }}
                            >
                                Download PDF
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <DialogPreviewDokumen
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                pdfPreview={previewPdf}
            />
        </div>
    )
}


function DialogPreviewDokumen({
    openDialog,
    pdfPreview,
    setOpenDialog,
}: {
    pdfPreview: string | null
    openDialog: boolean
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
}) {
    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className="w-full max-h-[80vh]  overflow-y-scroll">
                <DialogHeader>
                    <DialogTitle>Dokumen SK</DialogTitle>
                    <DialogDescription>Surat Keputusan</DialogDescription>
                </DialogHeader>
                {pdfPreview === null ? (
                    <Skeleton className="w-full h-32" />
                ) : (
                    <iframe
                        src={pdfPreview || ''}
                        title="PDF Preview"
                        width="100%"
                        height="500px"
                        className="border rounded"
                    ></iframe>
                )}
                <DialogFooter>
                    <Button
                        className="mx-2  hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer"
                        variant={'destructive'}
                        onClick={() => {
                            setOpenDialog(false)
                        }}
                        type="button"
                    >
                        <X />
                        Tutup
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
