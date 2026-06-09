'use client'
import {
    ResponseFinalAsessmenAsesorDetailMKMType,
    ResponseFinalAsessmenAsesorDetailType,
} from '@/types/FinalAsessmen'
import React from 'react'
import { safeStorage } from '@/lib/safe-storage'
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
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form'
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../ui/card'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import {
    CheckCircle2Icon,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    PenIcon,
    Timer,
    TimerIcon,
    X,
} from 'lucide-react'
import { Skeleton } from '../ui/skeleton'
import { truncateText } from '@/lib/utils'
import { toast } from 'sonner'
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
import { Loader2 } from 'lucide-react'
import { Separator } from '../ui/separator'
import { KeteranganMataKuliah, Role } from '@/generated/prisma'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { useForm } from 'react-hook-form'
import { SkRektorAsessmenSkemaValidasi, SkRektorAsessmenSkemaValidasiTipe } from '@/validation/SkAsessmenValidation'
import { zodResolver } from '@hookform/resolvers/zod'
import { setStatusPersetujuanHasilFinalAsessmen } from '@/services/Status/StatusService'
import { getFileSkAsessmenBlobByNamafile, setFile } from '@/services/Asessment/SkRektorAsessmenService'
import { GenerateSkPdf } from '@/services/GeneratePdfService'
import { isGenerateSk } from '@/config/checkGenerateSkStats'

const HasilAsessmenIdComponent = ({
    dataServer, stats
}: {
    dataServer: ResponseFinalAsessmenAsesorDetailType
    stats: { StatusMahasiswaAssesmentId: string; NamaStatus: string }
}) => {
    const [dataPage, setDataPage] = React.useState<
        ResponseFinalAsessmenAsesorDetailMKMType[]
    >([])
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [statusServer, setStatusServer] = React.useState<{ StatusMahasiswaAssesmentId: string; NamaStatus: string }>(stats)
    const [formGenerate, setFormGenerate] = React.useState<{
        NomorSk: string
        JenisSk: string
    }>({
        NomorSk: '',
        JenisSk: '',
    })
    const [pdfPreview, setPdfPreview] = React.useState<string | null>(null)
    const [loading, setLoading] = React.useState<boolean>(false)
    const [role, setRole] = React.useState<Role | null>(null)
    const [openDialog, setOpenDialog] = React.useState<boolean>(false)
    const [openDialogGenerateSk, setOpenDialogGenerateSk] = React.useState<boolean>(false)
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
        totalElement: dataServer.MataKuliahMahasiswa.length,
        totalPage: Math.ceil(dataServer.MataKuliahMahasiswa.length / 5),
        isFirst: false,
        isLast: false,
        hasNext: false,
        hasPrevious: false,
    })

    const form = useForm<SkRektorAsessmenSkemaValidasiTipe>({
        resolver: zodResolver(SkRektorAsessmenSkemaValidasi),
        defaultValues: {
            data: undefined,
            NamaSk: '',
            TahunSk: '',
            NomorSk: '',
        },
    })

    const onSubmit = async (data: SkRektorAsessmenSkemaValidasiTipe) => {
        setLoading(true)
        if (data.data) {
            await setFile(
                data.data,
                dataServer.PendaftaranId,
                data.NamaSk,
                data.TahunSk,
                data.NomorSk
            )
                .then((res) => {
                    setStatusPersetujuanHasilFinalAsessmen(dataServer.PendaftaranId).then(
                        (res) => {
                            toast('Data SK Asesor Mahasiswa berhasil disimpan')
                            setStatusServer({ StatusMahasiswaAssesmentId: '3b610de5-9c8b-4f98-8214-29e1d954d40k', NamaStatus: 'Persetujuan Hasil Final' })
                            setLoading(false)
                        }
                    )
                    setLoading(false)
                })
                .catch((err) => {
                    toast('Data SK Asesor Mahasiswa gagal disimpan. Error: ' + err)
                    setLoading(false)
                })
        }
    }

    React.useEffect(() => {
        if (role === null) {
            setLoading(true)
            const r = safeStorage.getItem('pmb.iti.role')
            if (r) {
                setRole(JSON.parse(r))
                setLoading(false)
                if (dataServer.SkRektor.SkRektorId !== '') {
                    getFileSkAsessmenBlobByNamafile(dataServer.SkRektor.NamaFile)
                        .then((res) => {
                            setPdfPreview(res)
                            form.setValue('NamaSk', dataServer.SkRektor.NamaSk)
                            form.setValue(
                                'TahunSk',
                                String(dataServer.SkRektor.TahunSk)
                            )
                            form.setValue('NomorSk', dataServer.SkRektor.NomorSk)
                        })
                        .catch((err) => { })
                }
            }
            setLoading(false)
        }
    }, [])

    React.useEffect(() => {
        const startIndex2 = (paginationState.page - 1) * paginationState.limit
        const endIndex2 = startIndex2 + paginationState.limit
        setDataPage(
            dataServer.MataKuliahMahasiswa.slice(startIndex2, endIndex2)
        )

        const isFirstPage = paginationState.page === 1
        const isLastPage = paginationState.page === paginationState.totalPage

        setPaginationState({
            ...paginationState,
            isFirst: isFirstPage,
            isLast: isLastPage,
            hasPrevious: !isFirstPage,
            hasNext: !isLastPage && paginationState.totalPage > 1,
        })
    }, [paginationState.page, paginationState.limit])

    const [detailData, setDetailData] = React.useState<{
        Keterangan: KeteranganMataKuliah | null
        SkorAssesmenId: string
        MataKuliahMahasiswaId: string
        Portofolio: number
        Tulis: number
        Wawancara: number
        Demo: number
        Diakui: boolean
        SkorRataRata: number
        NilaiHuruf: string | null
        TranskripNilai: {
            NilaiAsessment: string
            Diakui: boolean
            TranskripNilaiId: string
            PendaftaranId: string
            KodeMataKuliah: string
            NamaMataKuliah: string
            Sks: number
            KodeMataKuliahTujuan: string
            NamaMataKuliahTujuan: string
            SksTujuan: number
            Nilai: string
            CreatedAt: Date
            UpdatedAt: Date
        },
        HasilAssesmen: {
            HasilAssesmenId: string
            Nama: string
            Urutan: number
            Valid: boolean
            Autentik: boolean
            Terkini: boolean
            Memadai: boolean
            Assesmen: string
            Nilai: number
            TanggalAssesmen: Date | null
        }[]
    }>({
        Keterangan: null,
        SkorAssesmenId: '',
        MataKuliahMahasiswaId: '',
        Portofolio: 0,
        Tulis: 0,
        Wawancara: 0,
        Demo: 0,
        Diakui: false,
        SkorRataRata: 0,
        NilaiHuruf: null,
        HasilAssesmen: [],
        TranskripNilai: {
            NilaiAsessment: '',
            Diakui: false,
            TranskripNilaiId: '',
            PendaftaranId: '',
            KodeMataKuliah: '',
            NamaMataKuliah: '',
            Sks: 0,
            KodeMataKuliahTujuan: '',
            NamaMataKuliahTujuan: '',
            SksTujuan: 0,
            Nilai: '',
            CreatedAt: new Date,
            UpdatedAt: new Date
        },
    })
    const see_detail = (data: ResponseFinalAsessmenAsesorDetailMKMType) => {
        setDetailData({
            Keterangan: data.Keterangan,
            SkorAssesmenId: data.SkorAssesmen.SkorAssesmenId ?? '',
            MataKuliahMahasiswaId:
                data.SkorAssesmen.MataKuliahMahasiswaId ?? '',
            Portofolio: data.SkorAssesmen.Portofolio ?? 0,
            Tulis: data.SkorAssesmen.Tulis ?? 0,
            Wawancara: data.SkorAssesmen.Wawancara ?? 0,
            Demo: data.SkorAssesmen.Demo ?? 0,
            Diakui: data.SkorAssesmen.Diakui ?? false,
            SkorRataRata: data.SkorAssesmen.SkorRataRata ?? 0,
            NilaiHuruf: data.SkorAssesmen.NilaiHuruf ?? null,
            TranskripNilai: {
                NilaiAsessment: data.TranskripNilai.NilaiAsessment,
                Diakui: data.TranskripNilai.Diakui,
                TranskripNilaiId: data.TranskripNilai.TranskripNilaiId,
                PendaftaranId: data.TranskripNilai.PendaftaranId,
                KodeMataKuliah: data.TranskripNilai.KodeMataKuliah,
                NamaMataKuliah: data.TranskripNilai.NamaMataKuliah,
                Sks: data.TranskripNilai.Sks,
                KodeMataKuliahTujuan: data.MataKuliah.Kode,
                NamaMataKuliahTujuan: data.MataKuliah.Nama,
                SksTujuan: data.MataKuliah.Sks,
                Nilai: data.TranskripNilai.Nilai,
                CreatedAt: data.TranskripNilai.CreatedAt,
                UpdatedAt: data.TranskripNilai.UpdatedAt,
            },
            HasilAssesmen: data.MataKuliah.CapaianPembelajaran.map((cp) => ({
                HasilAssesmenId: cp.EvaluasiDiri.HasilAsessment.HasilAssesmenId,
                Nama: cp.Nama,
                Urutan: cp.Urutan,
                Valid: cp.EvaluasiDiri.HasilAsessment.Valid,
                Autentik: cp.EvaluasiDiri.HasilAsessment.Autentik,
                Terkini: cp.EvaluasiDiri.HasilAsessment.Terkini,
                Memadai: cp.EvaluasiDiri.HasilAsessment.Memadai,
                Assesmen: cp.EvaluasiDiri.HasilAsessment.Assesmen,
                Nilai: cp.EvaluasiDiri.HasilAsessment.Nilai,
                TanggalAssesmen: cp.EvaluasiDiri.HasilAsessment.TanggalAssesmen,
            })),
        })
        setOpenDialog(true)
    }
    const columns: ColumnDef<ResponseFinalAsessmenAsesorDetailMKMType>[] = [
        {
            accessorKey: 'Kode',
            header: 'Kode',
            cell: ({ row }) => (
                <div className="capitalize">{row.original.MataKuliah.Kode}</div>
            ),
        },
        {
            accessorKey: 'Nama',
            header: 'Nama',
            cell: ({ row }) => (
                <div className="capitalize">
                    {truncateText(row.original.MataKuliah.Nama, 35)}
                </div>
            ),
        },
        {
            accessorKey: 'Keterangan',
            header: 'Keterangan',
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.original.Keterangan?.replaceAll('_', ' ')}
                </div>
            ),
        },
        {
            accessorKey: 'NilaiHuruf',
            header: 'Nilai Huruf',
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.original.Keterangan === 'Transfer_SKS' ? row.original.TranskripNilai.NilaiAsessment : row.original.SkorAssesmen.NilaiHuruf}
                </div>
            ),
        },
        {
            accessorKey: 'SkorRataRata',
            header: 'Skor Rata-Rata',
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.original.Keterangan === 'Transfer_SKS' ? '-' : row.original.SkorAssesmen.SkorRataRata}
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
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        jd.MataKuliahMahasiswaId
                                    )
                                    toast('Id sudah di salin ke Clipboard')
                                }}
                            >
                                Copy Mata Kuliah Mahasiswa ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => see_detail(jd)}>
                                Lihat Detail Capaian
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]
    const table = useReactTable({
        data: dataPage,
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

    async function generateSk(): Promise<string | null> {
        try {
            const previewUrl = await GenerateSkPdf(dataServer.PendaftaranId, formGenerate.NomorSk, formGenerate.JenisSk)
            return previewUrl
        } catch (err) {
            console.error('Error generating SK PDF:', err)
            toast('Gagal membuat SK PDF. Error: ' + err)
            return null
        }
    }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-1 gap-3">
            {
                role?.Name === 'Akademik' && statusServer.NamaStatus == 'Persetujuan Hasil Final' ? (
                    <Alert>
                        <CheckCircle2Icon />
                        <AlertTitle>Sedang Menunggu Approval Wakil Rektor</AlertTitle>
                        <AlertDescription>
                            Saat ini Proses sedang Menunggu Approval Wakil Rektor
                        </AlertDescription>
                    </Alert>
                ) : <></>
            }
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Informasi Pendaftaran Mahasiswa</CardTitle>
                    <CardDescription>
                        Informasi Umum mengenai Jalu Masuk Pendaftaran Mahasiswa
                    </CardDescription>
                    <CardAction></CardAction>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-3">
                        <Table>
                            <TableCaption>Informasi Profil</TableCaption>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Nama</TableCell>
                                    <TableCell>{dataServer.Nama}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Tempat Lahir</TableCell>
                                    <TableCell>
                                        {dataServer.TempatLahir}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Tanggal Lahir</TableCell>
                                    <TableCell>
                                        {dataServer.TanggalLahir?.toString() ??
                                            '-'}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Email</TableCell>
                                    <TableCell>{dataServer.Email}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Agama</TableCell>
                                    <TableCell>{dataServer.Agama}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Nomor HP</TableCell>
                                    <TableCell>{dataServer.NomorHp}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <Table>
                            <TableCaption>Asesor</TableCaption>
                            <TableBody>
                                {dataServer.AssesorMahasiswa.map((am) => (
                                    <React.Fragment key={am.Urutan}>
                                        <TableRow>
                                            <TableCell>
                                                Nama Asesor {am.Urutan}
                                            </TableCell>
                                            <TableCell>{am.Nama}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Urutan</TableCell>
                                            <TableCell>{am.Urutan}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Konfirmasi</TableCell>
                                            <TableCell>
                                                {am.Confirmation ? (
                                                    <Badge variant={'default'}>
                                                        Ya
                                                    </Badge>
                                                ) : (
                                                    <Badge variant={'default'}>
                                                        Tidak
                                                    </Badge>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                        <Table>
                            <TableCaption>Jalur Masuk</TableCaption>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Jalur Masuk</TableCell>
                                    <TableCell>
                                        {dataServer.JalurPendaftaran}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Kode Pendaftaran</TableCell>
                                    <TableCell>
                                        {dataServer.KodePendaftar}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>No. Ujian</TableCell>
                                    <TableCell>{dataServer.NoUjian}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>NIM</TableCell>
                                    <TableCell>{dataServer.Nim}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Gelombang</TableCell>
                                    <TableCell>
                                        {dataServer.Gelombang}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <Table>
                            <TableCaption>Informasi Program Studi</TableCaption>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Nama Program Studi</TableCell>
                                    <TableCell>
                                        {dataServer.ProgramStudi.Nama}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Jenjang</TableCell>
                                    <TableCell>
                                        {dataServer.ProgramStudi.Jenjang}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Akreditasi</TableCell>
                                    <TableCell>
                                        {dataServer.ProgramStudi.Akreditasi}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Sistem Kuliah</TableCell>
                                    <TableCell>
                                        {dataServer.SistemKuliah}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Periode</TableCell>
                                    <TableCell>{dataServer.Periode}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Informasi Penilaian Asesor</CardTitle>
                    <CardDescription>
                        Informasi Penilaian terhadap seluruh capaian
                        pembelajaran per mata kuliah
                    </CardDescription>
                    <CardAction></CardAction>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-1 gap-3">
                        <div className="w-full">
                            <div className="flex items-center py-4">
                                <div className="w-full justify-end flex">
                                    <Select
                                        value={String(paginationState.limit)}
                                        onValueChange={(value) => {
                                            setPaginationState({
                                                ...paginationState,
                                                limit: Number(value),
                                                totalPage: Math.ceil(
                                                    dataServer
                                                        .MataKuliahMahasiswa
                                                        .length / Number(value)
                                                ),
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
                                    {Array.from({
                                        length: paginationState.limit,
                                    }).map((_, i) => (
                                        <div key={i} className="flex space-x-4">
                                            <Skeleton className="h-10 w-10 rounded-full" />
                                            <div className="flex-1 space-y-2">
                                                <Skeleton className="h-4 w-[60%]" />
                                                <Skeleton className="h-4 w-[40%]" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            {table
                                                .getHeaderGroups()
                                                .map((headerGroup) => (
                                                    <TableRow
                                                        key={headerGroup.id}
                                                    >
                                                        {headerGroup.headers.map(
                                                            (header) => {
                                                                return (
                                                                    <TableHead
                                                                        key={
                                                                            header.id
                                                                        }
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
                                            {table.getRowModel().rows
                                                ?.length ? (
                                                table
                                                    .getRowModel()
                                                    .rows.map((row) => (
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
                                                                        key={
                                                                            cell.id
                                                                        }
                                                                    >
                                                                        {flexRender(
                                                                            cell
                                                                                .column
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
                                    {paginationState.page *
                                        paginationState.limit -
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
                                                if (
                                                    paginationState.page !== p
                                                ) {
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
                        </div>
                    </div>
                </CardContent>
            </Card>
            {role?.Name === 'Akademik' && pdfPreview ? (
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Dokumen Draft SK</CardTitle>
                            <CardDescription>
                                Dokumen Surat Keputusan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-2 mb-3">
                                <iframe
                                    src={pdfPreview || ''}
                                    title="PDF Preview"
                                    width="100%"
                                    height="500px"
                                    className="border rounded"
                                ></iframe>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : <></>}
            {
                role?.Name === 'Akademik' && (
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Draft Surat Keputusan</CardTitle>
                            <CardDescription>
                                Draft Surat Keputusan Asessmen Mahasiswa
                            </CardDescription>
                            {
                                isGenerateSk(stats?.NamaStatus ?? '') ? (
                                    <CardAction>
                                        <Button
                                            type="button"
                                            size="sm"
                                            className='bg-primary transition-all duration-100 hover:scale-105 active:scale-95'
                                            onClick={() => {
                                                setOpenDialogGenerateSk(true)
                                            }}
                                        >
                                            Generate SK
                                        </Button>
                                    </CardAction>
                                ) : (<></>)
                            }
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-1 md:gap-3">
                                        <FormField
                                            control={form.control}
                                            name="TahunSk"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Tahun SK
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            readOnly={loading || statusServer.NamaStatus == 'Persetujuan Hasil Final'}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Tahun Surat Keterangan
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="NamaSk"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Nama SK
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            readOnly={loading || statusServer.NamaStatus == 'Persetujuan Hasil Final'}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Nama Surat Keterangan
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="NomorSk"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Nomor SK
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            readOnly={loading || statusServer.NamaStatus == 'Persetujuan Hasil Final'}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Nomor Surat Keterangan
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="data"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Unggah SK Disini
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="file"
                                                            disabled={loading || statusServer.NamaStatus == 'Persetujuan Hasil Final'}
                                                            accept="application/pdf"
                                                            onChange={(e) => {
                                                                const file =
                                                                    e.target
                                                                        .files?.[0]
                                                                if (file) {
                                                                    field.onChange(
                                                                        file
                                                                    )
                                                                    setPdfPreview(
                                                                        URL.createObjectURL(
                                                                            file
                                                                        )
                                                                    )
                                                                }
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Upload SK (PDF)
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    {
                                        statusServer.NamaStatus == 'Hasil Final Asessmen' && (
                                            <div className="flex justify-center w-full my-5">
                                                <Button
                                                    type="submit"
                                                    className="hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer w-2/3 md:w-1/2"
                                                    disabled={loading}
                                                >
                                                    {
                                                        loading ? (
                                                            <>
                                                                <TimerIcon /> Loading
                                                            </>
                                                        ) : (
                                                            <>
                                                                <PenIcon /> Simpan
                                                            </>
                                                        )
                                                    }
                                                </Button>
                                            </div>
                                        )
                                    }
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                )
            }
            <SheetManageData
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                loading={loading}
                dataDetail={detailData}
            />
            <DialogGenerateSk
                openDialog={openDialogGenerateSk}
                setOpenDialog={setOpenDialogGenerateSk}
                formGenerate={formGenerate}
                setFormGenerate={setFormGenerate}
                generateSk={generateSk}
            />
        </div>
    )
}

export default HasilAsessmenIdComponent

export function DialogGenerateSk({
    openDialog,
    setOpenDialog,
    formGenerate,
    setFormGenerate,
    generateSk
}: {
    openDialog: boolean
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
    formGenerate: {
        NomorSk: string
        JenisSk: string
    }
    setFormGenerate: React.Dispatch<React.SetStateAction<{
        NomorSk: string
        JenisSk: string
    }>>
    generateSk: () => Promise<string | null>
}) {
    const [loading, setLoading] = React.useState<boolean>(false)
    const [pdfUrl, setPdfUrl] = React.useState<string | null>(null)

    const handleSubmit = async () => {
        if (!formGenerate.NomorSk || !formGenerate.JenisSk) {
            toast('Nomor SK dan Jenis SK harus diisi')
            return
        }
        setLoading(true)
        setPdfUrl(null)
        const url = await generateSk()
        if (url) {
            setPdfUrl(url)
        }
        setLoading(false)
    }

    const handleClose = () => {
        setOpenDialog(false)
        setPdfUrl(null)
        setFormGenerate({ NomorSk: '', JenisSk: '' })
    }

    return (
        <Dialog open={openDialog} onOpenChange={(open) => {
            if (!open) handleClose()
            else setOpenDialog(open)
        }}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Generate SK</DialogTitle>
                    <DialogDescription>
                        Formulir untuk generate SK. Isi data kemudian klik Generate.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="nomorSk" className="text-sm font-medium leading-none">
                                Nomor SK
                            </label>
                            <Input
                                id="nomorSk"
                                placeholder="Masukkan Nomor SK"
                                value={formGenerate.NomorSk}
                                onChange={(e) => setFormGenerate(prev => ({ ...prev, NomorSk: e.target.value }))}
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="jenisSk" className="text-sm font-medium leading-none">
                                Jenis SK
                            </label>
                            <Select
                                value={formGenerate.JenisSk}
                                onValueChange={(value) => setFormGenerate(prev => ({ ...prev, JenisSk: value }))}
                                disabled={loading}
                            >
                                <SelectTrigger id="jenisSk">
                                    <SelectValue placeholder="Pilih Jenis SK" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Jenis SK</SelectLabel>
                                        <SelectItem value="TRANSFER KREDIT">TRANSFER SKS</SelectItem>
                                        <SelectItem value="PEROLEHAN KREDIT">PEROLEHAN SKS</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {pdfUrl && (
                        <div className="mt-4">
                            <label className="text-sm font-medium leading-none mb-2 block">
                                Hasil Generate SK
                            </label>
                            <iframe
                                src={pdfUrl}
                                title="PDF Preview"
                                width="100%"
                                height="400px"
                                className="border rounded"
                            />
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Tutup
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            'Generate SK'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export function SheetManageData({
    openDialog,
    setOpenDialog,
    loading,
    dataDetail,
}: {
    openDialog: boolean
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
    loading: boolean
    dataDetail: {
        Keterangan: KeteranganMataKuliah | null
        SkorAssesmenId: string
        MataKuliahMahasiswaId: string
        Portofolio: number
        Tulis: number
        Wawancara: number
        Demo: number
        Diakui: boolean
        SkorRataRata: number
        NilaiHuruf: string | null
        TranskripNilai: {
            NilaiAsessment: string,
            Diakui: boolean,
            TranskripNilaiId: string,
            PendaftaranId: string,
            KodeMataKuliah: string,
            NamaMataKuliah: string,
            Sks: number,
            KodeMataKuliahTujuan: string
            NamaMataKuliahTujuan: string
            SksTujuan: number
            Nilai: string,
            CreatedAt: Date,
            UpdatedAt: Date
        },
        HasilAssesmen: {
            HasilAssesmenId: string
            Nama: string
            Urutan: number
            Valid: boolean
            Autentik: boolean
            Terkini: boolean
            Memadai: boolean
            Assesmen: string
            Nilai: number
            TanggalAssesmen: Date | null
        }[]
    }
}) {
    return (
        <div className="grid grid-cols-2 gap-2">
            <Sheet open={openDialog} onOpenChange={setOpenDialog}>
                <SheetContent
                    side="right"
                    className="w-screen h-screen max-w-full overflow-scroll"
                >
                    <SheetHeader>
                        <SheetTitle>Detail Hasil Penilaian</SheetTitle>
                        <SheetDescription>
                            Detail Capaian Pembelajaran
                        </SheetDescription>
                    </SheetHeader>
                    <div className="w-full grid grid-cols-1 gap-3 px-4">
                        <div className="container mx-auto">
                            <div className="grid grid-cols-1 gap-3">
                                {
                                    dataDetail.Keterangan === 'Transfer_SKS' ? (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Skor Asessmen</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <Table>
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell>Nilai</TableCell>
                                                            <TableCell>
                                                                {dataDetail.TranskripNilai.NilaiAsessment}
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>
                                                                Diakui
                                                            </TableCell>
                                                            <TableCell>
                                                                {dataDetail.TranskripNilai.Diakui
                                                                    ? 'Ya'
                                                                    : 'Tidak'}
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Skor Asessmen</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <Table>
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell>Demo</TableCell>
                                                            <TableCell>
                                                                {dataDetail.Demo}
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>
                                                                Portfolio
                                                            </TableCell>
                                                            <TableCell>
                                                                {dataDetail.Portofolio}
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>Tulis</TableCell>
                                                            <TableCell>
                                                                {dataDetail.Tulis}
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>
                                                                Wawancara
                                                            </TableCell>
                                                            <TableCell>
                                                                {dataDetail.Wawancara}
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>
                                                                Skor Rata-rata
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    dataDetail.SkorRataRata
                                                                }
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>
                                                                Diakui
                                                            </TableCell>
                                                            <TableCell>
                                                                {dataDetail.Diakui
                                                                    ? 'Ya'
                                                                    : 'Tidak'}
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </CardContent>
                                        </Card>
                                    )
                                }
                                <Separator className="my-2" />
                                <div className="grid grid-cols-1 gap-3">
                                    {dataDetail.Keterangan === 'Transfer_SKS' ? (
                                        <>
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>
                                                        Mata Kuliah PT. Asal
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <Table>
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell>
                                                                    Kode MK
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="w-full text-wrap">
                                                                        {dataDetail.TranskripNilai.KodeMataKuliah}
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
                                                                    Nama MK
                                                                </TableCell>
                                                                <TableCell>
                                                                    {dataDetail.TranskripNilai.NamaMataKuliah}
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
                                                                    SKS
                                                                </TableCell>
                                                                <TableCell>
                                                                    {dataDetail.TranskripNilai.Sks}
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
                                                                    Nilai
                                                                </TableCell>
                                                                <TableCell>
                                                                    {dataDetail.TranskripNilai.Nilai}
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </CardContent>
                                            </Card>
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>
                                                        Mata Kuliah PT. Tujuan
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <Table>
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell>
                                                                    Kode MK
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="w-full text-wrap">
                                                                        {dataDetail.TranskripNilai.KodeMataKuliahTujuan}
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
                                                                    Nama MK
                                                                </TableCell>
                                                                <TableCell>
                                                                    {dataDetail.TranskripNilai.NamaMataKuliahTujuan}
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
                                                                    SKS
                                                                </TableCell>
                                                                <TableCell>
                                                                    {dataDetail.TranskripNilai.SksTujuan}
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </CardContent>
                                            </Card>
                                        </>
                                    ) : dataDetail.HasilAssesmen.sort(
                                        (a, b) => a.Urutan - b.Urutan
                                    ).map((ha) => (
                                        <Card key={ha.HasilAssesmenId}>
                                            <CardHeader>
                                                <CardTitle>
                                                    Capaian #{ha.Urutan}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <Table>
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell>
                                                                Capaian
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="w-full text-wrap">
                                                                    {ha.Nama}
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>
                                                                Autentik
                                                            </TableCell>
                                                            <TableCell>
                                                                {ha.Autentik
                                                                    ? 'Ya'
                                                                    : 'Tidak'}
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>
                                                                Memadai
                                                            </TableCell>
                                                            <TableCell>
                                                                {ha.Memadai
                                                                    ? 'Ya'
                                                                    : 'Tidak'}
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>
                                                                Valid
                                                            </TableCell>
                                                            <TableCell>
                                                                {ha.Valid
                                                                    ? 'Ya'
                                                                    : 'Tidak'}
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>
                                                                Terkini
                                                            </TableCell>
                                                            <TableCell>
                                                                {ha.Terkini
                                                                    ? 'Ya'
                                                                    : 'Tidak'}
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>
                                                                Asessmen
                                                            </TableCell>
                                                            <TableCell>
                                                                {ha.Assesmen}
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>
                                                                Nilai
                                                            </TableCell>
                                                            <TableCell>
                                                                {ha.Nilai}
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <SheetFooter>
                        <Button
                            type="button"
                            onClick={() => setOpenDialog(false)}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Timer />
                                    Loading
                                </>
                            ) : (
                                <>
                                    <X /> Tutup
                                </>
                            )}
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    )
}
