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
    InfoIcon,
    Loader2,
    MoreHorizontal,
    FileText,
} from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog'
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
import { Badge } from '../ui/badge'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { ResponseSanggahanMhsPaginationType } from '@/types/SanggahanTypes'
import { getSanggahanAsessmentToMahasiswa } from '@/services/Asessment/SanggahanService'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { setStatusHasilFinalAsessmen } from '@/services/Status/StatusService'
import { GenerateRekapitulasiPdf } from '@/services/GeneratePdfService'

const SanggahanComponent = () => {
    const router = useRouter()
    const [role, setRole] = React.useState<{
        GuardName: string
        Icon: string
        Name: string
        RoleId: string
    } | null>(null)
    const [dataMahasiswa, setDataMahasiswa] = React.useState<
        ResponseSanggahanMhsPaginationType[]
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
    const [search, setSearch] = React.useState<string>('')
    const [loading, setLoading] = React.useState<boolean>(false)
    const [openDialogGeneratePdf, setOpenDialogGeneratePdf] = React.useState<boolean>(false)
    const [pdfPreviewUrl, setPdfPreviewUrl] = React.useState<string | null>(null)
    const [loadingPdf, setLoadingPdf] = React.useState<boolean>(false)

    const startAsessment = (PendaftaranId: string) => {
        router.push('/asessment/sanggahan-mahasiswa/' + PendaftaranId)
    }

    const generateRekapitulasiPdfWindow = async (PendaftaranId: string) => {
        setLoadingPdf(true)
        setOpenDialogGeneratePdf(true)
        setPdfPreviewUrl(null)
        await GenerateRekapitulasiPdf(PendaftaranId)
            .then((res) => {
                setPdfPreviewUrl(res)
                setLoadingPdf(false)
            })
            .catch((err) => {
                toast.error('Gagal Generate Rekapitulasi Pdf')
                setLoadingPdf(false)
            })
    }

    const handleCloseDialogPdf = () => {
        setOpenDialogGeneratePdf(false)
        setPdfPreviewUrl(null)
    }

    function getAllData(role: {
        GuardName: string
        Icon: string
        Name: string
        RoleId: string
    }) {
        setLoading(true)
        getSanggahanAsessmentToMahasiswa(
            paginationState.page,
            paginationState.limit,
            search,
            role?.RoleId
        )
            .then((res) => {
                setDataMahasiswa(res.data)
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
    }
    React.useEffect(() => {
        if (!role) {
            const rolelogin = localStorage.getItem('pmb.iti.role')
            if (rolelogin) {
                let temp = JSON.parse(rolelogin)
                setRole(temp)
                getAllData(temp)
            }
        }
        if (role) {
            getAllData(role)
        }
    }, [paginationState.page, search, paginationState.limit])

    const columns: ColumnDef<ResponseSanggahanMhsPaginationType>[] = [
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
            accessorKey: 'NamaProgramStudi',
            header: 'Program Studi',
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.getValue('NamaProgramStudi')}
                </div>
            ),
        },
        {
            accessorKey: 'NoUjian',
            header: 'NoUjian',
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.getValue('NoUjian')}
                </div>
            ),
        },
        {
            accessorKey: 'SanggahanAssesmenId',
            header: 'Sanggahan',
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.getValue('SanggahanAssesmenId') === '' ? (
                        <Badge>Tidak</Badge>
                    ) : (
                        <Badge>Menyanggah</Badge>
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'MataKuliah',
            header: 'Total MK',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('MataKuliah')}</div>
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
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        jd.PendaftaranId
                                    )
                                    toast(
                                        'Pendaftaran Mahasiswa ID dicopy ke clipboard'
                                    )
                                }}
                            >
                                Copy Pendaftaran Mahasiswa ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => generateRekapitulasiPdfWindow(row.original.PendaftaranId)}
                            >
                                Preview Generate Rekapitulasi PDF
                            </DropdownMenuItem>
                            {role?.Name === 'Mahasiswa' || (role?.Name === 'Asesor' && row.original.SanggahanAssesmenId !== '') ? (
                                <React.Fragment>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            startAsessment(jd.PendaftaranId)
                                        }
                                    >
                                        {role?.Name === 'Asesor' ? "Menindaklanjuti Sanggahan" : "Lihat Nilai Asessmen"}
                                    </DropdownMenuItem>
                                </React.Fragment>
                            ) : <></>}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    const table = useReactTable({
        data: dataMahasiswa,
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
            <div className="grid grid-cols-1 gap-3 mb-3">
                <Alert>
                    <InfoIcon />
                    <AlertTitle>Pemberitahuan</AlertTitle>
                    <AlertDescription>
                        Jika tidak ada Sanggahan, Silakan klik lanjutkan ke
                        hasil akhir agar nilai asessmen anda di buat SK Rektor
                    </AlertDescription>
                </Alert>
            </div>
            <div className="flex items-center py-4">
                <Input
                    placeholder="Cari Data ..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="max-w-sm"
                />
                <div className="w-full justify-end flex">
                    <Select
                        value={String(paginationState.limit)}
                        onValueChange={(value) =>
                            setPaginationState({
                                ...paginationState,
                                limit: Number(value),
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
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column
                                                            .columnDef.header,
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
                                            row.getIsSelected() && 'selected'
                                        }
                                    >
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

                    {Array.from(
                        { length: paginationState.totalPage },
                        (_, i) => i + 1
                    ).map((p) => (
                        <Button
                            key={p}
                            variant={
                                p === paginationState.page
                                    ? 'default'
                                    : 'outline'
                            }
                            size="sm"
                            onClick={() => {
                                if (paginationState.page !== p) {
                                    setPaginationState({
                                        ...paginationState,
                                        page: p,
                                    })
                                }
                            }}
                        >
                            {p}
                        </Button>
                    ))}

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
            {/* Dialog Preview PDF */}
            <Dialog open={openDialogGeneratePdf} onOpenChange={(open) => {
                if (!open) handleCloseDialogPdf()
                else setOpenDialogGeneratePdf(open)
            }}>
                <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Preview Rekapitulasi PDF
                        </DialogTitle>
                        <DialogDescription>
                            Preview dokumen rekapitulasi hasil penilaian RPL perolehan kredit
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
                                        link.download = 'rekapitulasi-penilaian-rpl.pdf'
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
        </div>
    )
}

export default SanggahanComponent
