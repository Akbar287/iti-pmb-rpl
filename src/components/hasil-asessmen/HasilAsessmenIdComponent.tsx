'use client'
import {
    ResponseFinalAsessmenAsesorDetailMKMType,
    ResponseFinalAsessmenAsesorDetailType,
} from '@/types/FinalAsessmen'
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
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    PenIcon,
    Timer,
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
import { Separator } from '../ui/separator'

const HasilAsessmenIdComponent = ({
    dataServer,
}: {
    dataServer: ResponseFinalAsessmenAsesorDetailType
}) => {
    const [dataPage, setDataPage] = React.useState<
        ResponseFinalAsessmenAsesorDetailMKMType[]
    >([])
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [loading, setLoading] = React.useState<boolean>(false)
    const [openDialog, setOpenDialog] = React.useState<boolean>(false)
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

    React.useEffect(() => {
        const startIndex2 = (paginationState.page - 1) * paginationState.limit
        const endIndex2 = startIndex2 + paginationState.limit
        setDataPage(
            dataServer.MataKuliahMahasiswa.slice(startIndex2, endIndex2)
        )
        if (paginationState.page === 1) {
            setPaginationState({
                ...paginationState,
                isFirst: true,
                hasPrevious: false,
                hasNext: true,
                isLast: false,
            })
        } else if (paginationState.page === paginationState.totalPage) {
            setPaginationState({
                ...paginationState,
                isLast: true,
                isFirst: false,
                hasPrevious: true,
                hasNext: false,
            })
        } else {
            setPaginationState({
                ...paginationState,
                isLast: true,
                isFirst: true,
                hasPrevious: true,
                hasNext: true,
            })
        }
    }, [paginationState.page, paginationState.limit])
    const [detailData, setDetailData] = React.useState<{
        SkorAssesmenId: string
        MataKuliahMahasiswaId: string
        Portofolio: number
        Tulis: number
        Wawancara: number
        Demo: number
        Diakui: boolean
        SkorRataRata: number
        NilaiHuruf: string | null
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
    })
    const see_detail = (data: ResponseFinalAsessmenAsesorDetailMKMType) => {
        setDetailData({
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
                    {row.original.SkorAssesmen.NilaiHuruf}
                </div>
            ),
        },
        {
            accessorKey: 'SkorRataRata',
            header: 'Skor Rata-Rata',
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.original.SkorAssesmen.SkorRataRata}
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

    return (
        <div className="grid grid-cols-1 sm:grid-cols-1 gap-3">
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
            <SheetManageData
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                loading={loading}
                dataDetail={detailData}
            />
        </div>
    )
}

export default HasilAsessmenIdComponent

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
        SkorAssesmenId: string
        MataKuliahMahasiswaId: string
        Portofolio: number
        Tulis: number
        Wawancara: number
        Demo: number
        Diakui: boolean
        SkorRataRata: number
        NilaiHuruf: string | null
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
                                <Separator className="my-2" />
                                <div className="grid grid-cols-1 gap-3">
                                    {dataDetail.HasilAssesmen.sort(
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
