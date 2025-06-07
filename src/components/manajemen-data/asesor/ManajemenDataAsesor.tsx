'use client'
import { cn, replaceItemAtIndex, truncateText } from '@/lib/utils'
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
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../../ui/dropdown-menu'
import { Button } from '../../ui/button'
import {
    CalendarIcon,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    SaveAll,
} from 'lucide-react'
import Swal from 'sweetalert2'
import { Input } from '../../ui/input'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '../../ui/select'
import { Skeleton } from '../../ui/skeleton'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../../ui/table'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../../ui/form'
import {
    Country,
    Desa,
    JenisKelamin,
    Jenjang,
    Kabupaten,
    Kecamatan,
    Provinsi,
} from '@/generated/prisma'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Textarea } from '@/components/ui/textarea'
import { AsesorPage, AsesorRequestResponseDTO } from '@/types/AsesorTypes'
import {
    AsesorFormValidation,
    AsesorSchemaValidation,
} from '@/validation/AsesorFormValidation'
import {
    deleteAsesor,
    getAsesorId,
    getAsesorPagination,
    setAsesor,
    updateAsesor,
} from '@/services/ManajemenData/AsesorServices'
import {
    getDesaByKecamatanId,
    getKabupatenByProvinsiId,
    getKecamatanByKabupatenId,
    getProvinsiByCountryId,
} from '@/services/AreaServices'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'

const ManajemenDataAsesor = ({
    countryDataServer,
    universitasDataServer,
    tipeAsesorDataServer,
}: {
    countryDataServer: Country[]
    universitasDataServer: {
        Nama: string
        UniversityId: string
        ProgramStudi: {
            Nama: string
            ProgramStudiId: string
        }[]
    }[]
    tipeAsesorDataServer: {
        Nama: string
        TipeAsesorId: string
        Icon: string | null
        Deskripsi: string | null
    }[]
}) => {
    const [dataProvinsi, setDataProvinsi] = React.useState<Provinsi[]>([])
    const [dataKabupaten, setDataKabupaten] = React.useState<Kabupaten[]>([])
    const [dataKecamatan, setDataKecamatan] = React.useState<Kecamatan[]>([])
    const [dataDesa, setDataDesa] = React.useState<Desa[]>([])
    const [selectedData, setSelectedData] = React.useState<{
        UniversityId: string
        TipeAsesorId: string
        NamaDesa: string
        NamaKecamatan: string
        NamaKabupaten: string
        NamaProvinsi: string
        NamaCountry: string
    }>({
        UniversityId: '',
        TipeAsesorId: '',
        NamaDesa: '',
        NamaKecamatan: '',
        NamaKabupaten: '',
        NamaProvinsi: '',
        NamaCountry: '',
    })
    const [loadingChangeData, setLoadingChangeData] =
        React.useState<boolean>(false)
    const [dataAsesor, setDataAsesor] = React.useState<AsesorPage[]>([])
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
    const [titleDialog, setTitleDialog] = React.useState<string>('')
    const [loading, setLoading] = React.useState<boolean>(false)
    const form = useForm<AsesorFormValidation>({
        resolver: zodResolver(AsesorSchemaValidation) as any,
        defaultValues: {
            programStudi: null,
            alamat: {
                AlamatId: '',
                Alamat: '',
                KodePos: '',
                DesaId: '',
                KecamatanId: '',
                KabupatenId: '',
                ProvinsiId: '',
                CountryId: '',
            },
            user: {
                UserId: '',
                Nama: '',
                Email: '',
                TempatLahir: '',
                TanggalLahir: new Date(),
                JenisKelamin: Object.values(JenisKelamin)[0] || '',
                PendidikanTerakhir: Object.values(Jenjang)[0] || '',
                Agama: '',
                Telepon: '',
                NomorWa: '',
                NomorHp: '',
            },
            asesorId: '',
            username: '',
            tipeAsesor: {
                TipeAsesorId: '',
                Nama: '',
                Icon: '',
                Deskripsi: '',
            },
            asesorAkademik: {
                AsesorAkademikId: '',
                Pangkat: '',
                JabatanFungsionalAkademik: '',
                NipNidn: '',
                NamaPerguruanTinggi: '',
                AlamatPerguruanTinggi: '',
                PendidikanTerakhirBidangKeilmuan: '',
                AsesorAkademikKeanggotaanAsosiasi: null,
            },
            asesorPraktisi: {
                AsesorPraktisiId: '',
                AsesorId: '',
                NamaAsosiasi: '',
                NomorKeanggotaan: '',
                Jabatan: '',
                AlamatKantor: '',
                NamaInstansi: '',
                JabatanInstansi: '',
                BidangKeahlian: '',
            },
        },
    })
    const onSubmit = async (data: AsesorFormValidation) => {
        setLoadingChangeData(true)
        if (titleDialog === 'Ubah Asesor') {
            await updateAsesor({
                ProgramStudi: (data.programStudi ?? []).map((prodi) => ({
                    ProgramStudiId: prodi.ProgramStudiId,
                    UniversityId: prodi.UniversityId,
                    Nama: prodi.NamaProgramStudi,
                })),
                Alamat: {
                    AlamatId: data.alamat.AlamatId,
                    Alamat: data.alamat.Alamat,
                    KodePos: data.alamat.KodePos,
                    DesaId: data.alamat.DesaId,
                    NamaDesa: selectedData.NamaDesa,
                    KecamatanId: data.alamat.KecamatanId,
                    NamaKecamatan: selectedData.NamaKecamatan,
                    KabupatenId: data.alamat.KabupatenId,
                    NamaKabupaten: selectedData.NamaKabupaten,
                    ProvinsiId: data.alamat.ProvinsiId,
                    NamaProvinsi: selectedData.NamaProvinsi,
                    CountryId: data.alamat.CountryId,
                    NamaCountry: selectedData.NamaCountry,
                },
                User: {
                    UserId: data.user.UserId,
                    Nama: data.user.Nama,
                    Email: data.user.Email,
                    TempatLahir: data.user.TempatLahir,
                    TanggalLahir: data.user.TanggalLahir,
                    JenisKelamin: data.user.JenisKelamin as JenisKelamin,
                    PendidikanTerakhir: data.user.PendidikanTerakhir as Jenjang,
                    Avatar: '',
                    Agama: data.user.Agama,
                    Telepon: data.user.Telepon,
                    NomorWa: data.user.NomorWa,
                    NomorHp: data.user.NomorHp,
                },
                AsesorId: data.asesorId,
                Username: data.username,
                TipeAsesor: {
                    Nama: data.tipeAsesor.Nama,
                    TipeAsesorId: data.tipeAsesor.TipeAsesorId,
                    Icon: data.tipeAsesor.Icon ?? '',
                    Deskripsi: data.tipeAsesor.Deskripsi ?? '',
                },
                AsesorAkademik: {
                    AsesorAkademikId:
                        data?.asesorAkademik?.AsesorAkademikId ?? '',
                    Pangkat: data?.asesorAkademik?.Pangkat ?? '',
                    JabatanFungsionalAkademik:
                        data?.asesorAkademik?.JabatanFungsionalAkademik ?? '',
                    NipNidn: data?.asesorAkademik?.NipNidn ?? '',
                    NamaPerguruanTinggi:
                        data?.asesorAkademik?.NamaPerguruanTinggi ?? '',
                    AlamatPerguruanTinggi:
                        data?.asesorAkademik?.AlamatPerguruanTinggi ?? '',
                    PendidikanTerakhirBidangKeilmuan:
                        data?.asesorAkademik
                            ?.PendidikanTerakhirBidangKeilmuan ?? '',
                    AsesorAkademikKeanggotaanAsosiasi: data?.asesorAkademik
                        ?.AsesorAkademikKeanggotaanAsosiasi
                        ? data.asesorAkademik.AsesorAkademikKeanggotaanAsosiasi.map(
                              (as) => ({
                                  AsesorAkademikKeanggotaanAsosiasiId:
                                      as.AsesorAkademikKeanggotaanAsosiasiId,
                                  AsesorAkademikId: as.AsesorAkademikId,
                                  NamaAsosiasi: as.NamaAsosiasi,
                                  NomorKeanggotaan: as.NomorKeanggotaan,
                              })
                          )
                        : [],
                },
                AsesorPraktisi: {
                    AsesorPraktisiId:
                        data?.asesorPraktisi?.AsesorPraktisiId ?? '',
                    AsesorId: data?.asesorPraktisi?.AsesorId ?? '',
                    NamaAsosiasi: data?.asesorPraktisi?.NamaAsosiasi ?? '',
                    NomorKeanggotaan:
                        data?.asesorPraktisi?.NomorKeanggotaan ?? '',
                    Jabatan: data?.asesorPraktisi?.Jabatan ?? '',
                    AlamatKantor: data?.asesorPraktisi?.AlamatKantor ?? '',
                    NamaInstansi: data?.asesorPraktisi?.NamaInstansi ?? '',
                    JabatanInstansi:
                        data?.asesorPraktisi?.JabatanInstansi ?? '',
                    BidangKeahlian: data?.asesorPraktisi?.BidangKeahlian ?? '',
                },
            })
                .then((res) => {
                    toast('Data Asesor berhasil diubah')
                    let idx = dataAsesor.findIndex(
                        (r) => r.AsesorId === data.asesorId
                    )
                    setDataAsesor(replaceItemAtIndex(dataAsesor, idx, res))
                    setOpenDialog(false)
                    setLoadingChangeData(false)
                })
                .catch((err) => {
                    toast('Data Asesor gagal diubah. Error: ' + err)
                    setLoadingChangeData(false)
                })
        } else {
            await setAsesor({
                ProgramStudi: (data.programStudi ?? []).map((prodi) => ({
                    ProgramStudiId: prodi.ProgramStudiId,
                    UniversityId: prodi.UniversityId,
                    Nama: prodi.NamaProgramStudi,
                })),
                Alamat: {
                    AlamatId: '',
                    Alamat: data.alamat.Alamat,
                    KodePos: data.alamat.KodePos,
                    DesaId: data.alamat.DesaId,
                    NamaDesa: selectedData.NamaDesa,
                    KecamatanId: data.alamat.KecamatanId,
                    NamaKecamatan: selectedData.NamaKecamatan,
                    KabupatenId: data.alamat.KabupatenId,
                    NamaKabupaten: selectedData.NamaKabupaten,
                    ProvinsiId: data.alamat.ProvinsiId,
                    NamaProvinsi: selectedData.NamaProvinsi,
                    CountryId: data.alamat.CountryId,
                    NamaCountry: selectedData.NamaCountry,
                },
                User: {
                    UserId: '',
                    Nama: data.user.Nama,
                    Email: data.user.Email,
                    TempatLahir: data.user.TempatLahir,
                    TanggalLahir: data.user.TanggalLahir,
                    JenisKelamin: data.user.JenisKelamin as JenisKelamin,
                    PendidikanTerakhir: data.user.PendidikanTerakhir as Jenjang,
                    Avatar: '',
                    Agama: data.user.Agama,
                    Telepon: data.user.Telepon,
                    NomorWa: data.user.NomorWa,
                    NomorHp: data.user.NomorHp,
                },
                AsesorId: '',
                Username: data.username,
                TipeAsesor: {
                    Nama: data.tipeAsesor.Nama,
                    TipeAsesorId: data.tipeAsesor.TipeAsesorId,
                    Icon: data.tipeAsesor.Icon ?? '',
                    Deskripsi: data.tipeAsesor.Deskripsi ?? '',
                },
                AsesorAkademik: data.asesorAkademik
                    ? {
                          ...data.asesorAkademik,
                          AsesorAkademikKeanggotaanAsosiasi:
                              data.asesorAkademik
                                  .AsesorAkademikKeanggotaanAsosiasi ?? [],
                      }
                    : null,
                AsesorPraktisi: data.asesorPraktisi
                    ? {
                          ...data.asesorPraktisi,
                          AsesorPraktisiId:
                              data.asesorPraktisi.AsesorPraktisiId ?? '',
                          AsesorId: data.asesorPraktisi.AsesorId ?? '',
                      }
                    : null,
            })
                .then((res) => {
                    toast('Data Asesor berhasil ditambah')
                    setDataAsesor([...dataAsesor, res])
                    setLoadingChangeData(false)
                    setOpenDialog(false)
                })
                .catch((err) => {
                    toast('Data Asesor gagal ditambah. Error: ' + err)
                    setLoadingChangeData(false)
                })
        }
    }
    React.useEffect(() => {
        setLoading(true)
        getAsesorPagination(paginationState.page, paginationState.limit, search)
            .then((res) => {
                setDataAsesor(res.data)
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
    }, [paginationState.page, search, paginationState.limit])

    const buatData = () => {
        form.reset()
        setSelectedData({
            UniversityId: '',
            TipeAsesorId: '',
            NamaDesa: '',
            NamaKecamatan: '',
            NamaKabupaten: '',
            NamaProvinsi: '',
            NamaCountry: '',
        })
        setTitleDialog('Tambah Asesor')
        setOpenDialog(true)
    }
    const ubahData = async (jd: AsesorPage) => {
        setLoadingChangeData(true)
        setTitleDialog('Ubah Asesor')
        setOpenDialog(true)
        const res: AsesorRequestResponseDTO = await getAsesorId(jd.AsesorId)
        await getProvinsiByCountryId(res.Alamat?.CountryId)
            .then((res) => {
                setDataProvinsi(res)
            })
            .catch((err) => toast('Terjadi Kesalahan, Error: ' + err))
        await getKabupatenByProvinsiId(res?.Alamat?.ProvinsiId)
            .then((res) => {
                setDataKabupaten(res)
            })
            .catch((err) => toast('Terjadi Kesalahan, Error: ' + err))
        await getKecamatanByKabupatenId(res?.Alamat?.KabupatenId)
            .then((res) => {
                setDataKecamatan(res)
            })
            .catch((err) => toast('Terjadi Kesalahan, Error: ' + err))
        await getDesaByKecamatanId(res?.Alamat?.KecamatanId)
            .then((res) => {
                setDataDesa(res)
            })
            .catch((err) => toast('Terjadi Kesalahan, Error: ' + err))
        setSelectedData({
            UniversityId: res.ProgramStudi[0]?.UniversityId ?? '',
            TipeAsesorId: res.TipeAsesor?.TipeAsesorId ?? '',
            NamaDesa: res.Alamat?.NamaDesa ?? '',
            NamaKecamatan: res.Alamat?.NamaKecamatan ?? '',
            NamaKabupaten: res.Alamat?.NamaKabupaten ?? '',
            NamaProvinsi: res.Alamat?.NamaProvinsi ?? '',
            NamaCountry: res.Alamat?.NamaCountry ?? '',
        })
        form.setValue('alamat', {
            AlamatId: res.Alamat?.AlamatId ?? '',
            Alamat: res.Alamat?.Alamat ?? '',
            KodePos: res.Alamat?.KodePos ?? '',
            DesaId: res.Alamat?.DesaId ?? '',
            KecamatanId: res.Alamat?.KecamatanId ?? '',
            KabupatenId: res.Alamat?.KabupatenId ?? '',
            ProvinsiId: res.Alamat?.ProvinsiId ?? '',
            CountryId: res.Alamat?.CountryId ?? '',
        })
        form.setValue('user', {
            UserId: res.User.UserId,
            Nama: res.User.Nama,
            Email: res.User.Email,
            TempatLahir: res.User.TempatLahir,
            TanggalLahir:
                res.User.TanggalLahir !== null
                    ? new Date(res.User.TanggalLahir)
                    : new Date(),
            JenisKelamin: res.User.JenisKelamin,
            PendidikanTerakhir: res.User.PendidikanTerakhir,
            Agama: res.User.Agama,
            Telepon: res.User.Telepon,
            NomorWa: res.User.NomorWa,
            NomorHp: res.User.NomorHp,
        })
        form.setValue(
            'programStudi',
            res.ProgramStudi.map((prodi) => ({
                ProgramStudiId: prodi.ProgramStudiId,
                UniversityId: prodi.UniversityId,
                NamaProgramStudi: prodi.Nama,
            }))
        )
        form.setValue('asesorId', res.AsesorId)
        form.setValue('username', res.Username)
        form.setValue('tipeAsesor', res.TipeAsesor)
        form.setValue('asesorAkademik', {
            AsesorAkademikId: res.AsesorAkademik?.AsesorAkademikId ?? '',
            Pangkat: res.AsesorAkademik?.Pangkat ?? '',
            JabatanFungsionalAkademik:
                res.AsesorAkademik?.JabatanFungsionalAkademik ?? '',
            NipNidn: res.AsesorAkademik?.NipNidn ?? '',
            NamaPerguruanTinggi: res.AsesorAkademik?.NamaPerguruanTinggi ?? '',
            AlamatPerguruanTinggi:
                res.AsesorAkademik?.AlamatPerguruanTinggi ?? '',
            PendidikanTerakhirBidangKeilmuan:
                res.AsesorAkademik?.PendidikanTerakhirBidangKeilmuan ?? '',
            AsesorAkademikKeanggotaanAsosiasi:
                res.AsesorAkademik?.AsesorAkademikKeanggotaanAsosiasi ?? [],
        })
        form.setValue('asesorPraktisi', {
            AsesorPraktisiId: res.AsesorPraktisi?.AsesorPraktisiId ?? '',
            AsesorId: res.AsesorPraktisi?.AsesorId ?? '',
            NamaAsosiasi: res.AsesorPraktisi?.NamaAsosiasi ?? '',
            NomorKeanggotaan: res.AsesorPraktisi?.NomorKeanggotaan ?? '',
            Jabatan: res.AsesorPraktisi?.Jabatan ?? '',
            AlamatKantor: res.AsesorPraktisi?.AlamatKantor ?? '',
            NamaInstansi: res.AsesorPraktisi?.NamaInstansi ?? '',
            JabatanInstansi: res.AsesorPraktisi?.JabatanInstansi ?? '',
            BidangKeahlian: res.AsesorPraktisi?.BidangKeahlian ?? '',
        })
        setLoadingChangeData(false)
    }
    const hapusData = (jd: AsesorPage) => {
        Swal.fire({
            title: 'Ingin Hapus ' + jd.Nama + ' ?',
            text: 'Aksi ini tidak dapat di undo',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f45f24',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteAsesor(jd.AsesorId).then(() => {
                    setDataAsesor(
                        dataAsesor.filter((r) => r.AsesorId !== jd.AsesorId)
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

    const columns: ColumnDef<AsesorPage>[] = [
        {
            accessorKey: 'Nama',
            header: 'Nama',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('Nama')}</div>
            ),
        },
        {
            accessorKey: 'TipeAsesor',
            header: 'Tipe Asesor',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('TipeAsesor')}</div>
            ),
        },
        {
            accessorKey: 'Prodi',
            header: 'Prodi',
            cell: ({ row }) => (
                <div className="capitalize">
                    {truncateText(row.getValue('Prodi'), 35)}
                </div>
            ),
        },
        {
            accessorKey: 'PendidikanTerakhir',
            header: 'Pendidikan Terakhir',
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.getValue('PendidikanTerakhir')}
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
                                    navigator.clipboard.writeText(jd.AsesorId)
                                }
                            >
                                Copy Asesor ID
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
        data: dataAsesor,
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
        <div className="w-full flex flex-col">
            <div className="w-full flex items-center py-4">
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
                    <Button
                        className="mr-2"
                        disabled={loading || loadingChangeData}
                        onClick={() =>
                            openDialog ? setOpenDialog(false) : buatData()
                        }
                    >
                        {openDialog ? 'Tutup' : 'Tambah'}
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
            {openDialog ? (
                <div className="w-full py-4">
                    {loadingChangeData ? (
                        <Skeleton className="h-10 w-full" />
                    ) : (
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit, (err) => {
                                    console.dir(err)
                                })}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{titleDialog}</CardTitle>
                                        <CardDescription>
                                            Isi Form Dibawah ini untuk{' '}
                                            {titleDialog === 'Tambah Asesor'
                                                ? 'Tambah'
                                                : 'Ubah'}{' '}
                                            data
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-base font-bold my-3">
                                            Informasi Program Studi Asesor
                                        </div>
                                        <div className="grid grid-cols-1">
                                            <Select
                                                disabled={loading}
                                                value={
                                                    selectedData.UniversityId
                                                }
                                                onValueChange={(val) =>
                                                    setSelectedData({
                                                        ...selectedData,
                                                        UniversityId: val,
                                                    })
                                                }
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Pilih Universitas" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {universitasDataServer.map(
                                                        (p) => (
                                                            <SelectItem
                                                                value={
                                                                    p.UniversityId
                                                                }
                                                                key={
                                                                    p.UniversityId
                                                                }
                                                            >
                                                                {p.Nama}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="my-2">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            Nama
                                                        </TableHead>
                                                        <TableHead>
                                                            Aksi
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {selectedData.UniversityId ===
                                                    '' ? (
                                                        <TableRow>
                                                            <TableCell
                                                                colSpan={2}
                                                            >
                                                                <div className="my-2 flex w-full justify-center">
                                                                    Tidak Ada
                                                                    Program
                                                                    Studi
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        universitasDataServer
                                                            .find(
                                                                (x) =>
                                                                    x.UniversityId ==
                                                                    selectedData.UniversityId
                                                            )
                                                            ?.ProgramStudi.map(
                                                                (y) => (
                                                                    <TableRow
                                                                        key={
                                                                            y.ProgramStudiId
                                                                        }
                                                                    >
                                                                        <TableCell>
                                                                            {
                                                                                y.Nama
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Checkbox
                                                                                disabled={
                                                                                    loading
                                                                                }
                                                                                id={
                                                                                    y.ProgramStudiId
                                                                                }
                                                                                checked={(
                                                                                    form.watch(
                                                                                        'programStudi'
                                                                                    ) ||
                                                                                    []
                                                                                ).some(
                                                                                    (
                                                                                        item
                                                                                    ) =>
                                                                                        item.ProgramStudiId ===
                                                                                        y.ProgramStudiId
                                                                                )}
                                                                                onCheckedChange={(
                                                                                    checked
                                                                                ) => {
                                                                                    if (
                                                                                        checked
                                                                                    ) {
                                                                                        form.setValue(
                                                                                            'programStudi',
                                                                                            [
                                                                                                ...(form.watch(
                                                                                                    'programStudi'
                                                                                                ) ||
                                                                                                    []),
                                                                                                {
                                                                                                    ProgramStudiId:
                                                                                                        y.ProgramStudiId,
                                                                                                    UniversityId:
                                                                                                        selectedData.UniversityId,
                                                                                                    NamaProgramStudi:
                                                                                                        y.Nama,
                                                                                                },
                                                                                            ]
                                                                                        )
                                                                                    } else {
                                                                                        form.setValue(
                                                                                            'programStudi',
                                                                                            (
                                                                                                form.watch(
                                                                                                    'programStudi'
                                                                                                ) ||
                                                                                                []
                                                                                            ).filter(
                                                                                                (
                                                                                                    f
                                                                                                ) =>
                                                                                                    f.ProgramStudiId !==
                                                                                                    y.ProgramStudiId
                                                                                            )
                                                                                        )
                                                                                    }
                                                                                }}
                                                                            />
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )
                                                            )
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                        <Separator className="my-5" />
                                        <div className="text-base font-bold my-3">
                                            Informasi Pribadi Asesor
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                            <FormField
                                                control={form.control}
                                                name="user.Nama"
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
                                                                value={
                                                                    field.value ||
                                                                    ''
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Nama
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="user.Email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Email
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
                                                            Email
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="username"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Username
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
                                                            Username
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="user.TempatLahir"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Tempat Lahir
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
                                                            Tempat Lahir
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="user.TanggalLahir"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-col">
                                                        <FormLabel>
                                                            Tanggal Lahir
                                                        </FormLabel>
                                                        <Popover>
                                                            <PopoverTrigger
                                                                asChild
                                                            >
                                                                <FormControl>
                                                                    <Button
                                                                        variant={
                                                                            'outline'
                                                                        }
                                                                        className={cn(
                                                                            'w-[240px] pl-3 text-left font-normal',
                                                                            !field.value &&
                                                                                'text-muted-foreground'
                                                                        )}
                                                                    >
                                                                        {field.value instanceof
                                                                        Date ? (
                                                                            format(
                                                                                field.value,
                                                                                'PPP'
                                                                            )
                                                                        ) : (
                                                                            <span>
                                                                                Pilih
                                                                                Tanggal
                                                                            </span>
                                                                        )}
                                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent
                                                                className="w-auto p-0"
                                                                align="start"
                                                            >
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={
                                                                        field.value
                                                                    }
                                                                    onSelect={
                                                                        field.onChange
                                                                    }
                                                                    disabled={(
                                                                        date
                                                                    ) =>
                                                                        date >
                                                                            new Date() ||
                                                                        date <
                                                                            new Date(
                                                                                '1900-01-01'
                                                                            )
                                                                    }
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                        <FormDescription>
                                                            Tanggal Lahir kamu
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="user.JenisKelamin"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Jenis Kelamin
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                disabled={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value ??
                                                                    ''
                                                                }
                                                                onValueChange={(
                                                                    value
                                                                ) =>
                                                                    field.onChange(
                                                                        value
                                                                    )
                                                                }
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Jenis Kelamin" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectGroup>
                                                                        <SelectLabel>
                                                                            Jenis
                                                                            Kelamin
                                                                        </SelectLabel>
                                                                        <SelectItem value="PRIA">
                                                                            PRIA
                                                                        </SelectItem>
                                                                        <SelectItem value="WANITA">
                                                                            WANITA
                                                                        </SelectItem>
                                                                    </SelectGroup>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Pilih Jenis Kelamin
                                                            Anda.
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="user.PendidikanTerakhir"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Pendidikan Terakhir
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                disabled={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value
                                                                }
                                                                onValueChange={(
                                                                    value
                                                                ) =>
                                                                    field.onChange(
                                                                        value
                                                                    )
                                                                }
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Jenis Kelamin" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectGroup>
                                                                        <SelectLabel>
                                                                            Pendidikan
                                                                            Terakhir
                                                                        </SelectLabel>
                                                                        <SelectItem value="TIDAK_TAMAT_SD">
                                                                            TIDAK
                                                                            TAMAT
                                                                            SD
                                                                        </SelectItem>
                                                                        <SelectItem value="SD">
                                                                            SD
                                                                        </SelectItem>
                                                                        <SelectItem value="SMP">
                                                                            SMP
                                                                        </SelectItem>
                                                                        <SelectItem value="SMA">
                                                                            SMA
                                                                        </SelectItem>
                                                                        <SelectItem value="D3">
                                                                            D3
                                                                        </SelectItem>
                                                                        <SelectItem value="S1">
                                                                            S1
                                                                        </SelectItem>
                                                                        <SelectItem value="S2">
                                                                            S2
                                                                        </SelectItem>
                                                                        <SelectItem value="S3">
                                                                            S3
                                                                        </SelectItem>
                                                                    </SelectGroup>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Pendidikan Terakhir
                                                            Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="user.Agama"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Agama
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                disabled={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value
                                                                }
                                                                onValueChange={(
                                                                    value
                                                                ) =>
                                                                    field.onChange(
                                                                        value
                                                                    )
                                                                }
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Agama" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectGroup>
                                                                        <SelectLabel>
                                                                            Agama
                                                                        </SelectLabel>
                                                                        <SelectItem value="Islam">
                                                                            Islam
                                                                        </SelectItem>
                                                                        <SelectItem value="Kristen">
                                                                            Kristen
                                                                        </SelectItem>
                                                                        <SelectItem value="Hindu">
                                                                            Hindu
                                                                        </SelectItem>
                                                                        <SelectItem value="Budha">
                                                                            Budha
                                                                        </SelectItem>
                                                                        <SelectItem value="Konghucu">
                                                                            Konghucu
                                                                        </SelectItem>
                                                                        <SelectItem value="Lainnya">
                                                                            Lainnya
                                                                        </SelectItem>
                                                                        <SelectItem value="Tidak Punya">
                                                                            Tidak
                                                                            Punya
                                                                        </SelectItem>
                                                                    </SelectGroup>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Pilih Agama Anda.
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="user.NomorHp"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Nomor HP
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
                                                            Nomor HP
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="user.NomorWa"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Nomor WhatsApp
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
                                                            Nomor WhatsApp
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="user.Telepon"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Nomor Telepon
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
                                                            Nomor Telepon
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="alamat.CountryId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Negara
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                disabled={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value ??
                                                                    ''
                                                                }
                                                                onValueChange={(
                                                                    value
                                                                ) => {
                                                                    setDataKabupaten(
                                                                        []
                                                                    )
                                                                    setDataKecamatan(
                                                                        []
                                                                    )
                                                                    setDataDesa(
                                                                        []
                                                                    )
                                                                    let country =
                                                                        countryDataServer.find(
                                                                            (
                                                                                x
                                                                            ) =>
                                                                                x.CountryId ===
                                                                                value
                                                                        )
                                                                    if (
                                                                        country
                                                                    ) {
                                                                        setSelectedData(
                                                                            {
                                                                                ...selectedData,
                                                                                NamaCountry:
                                                                                    country.Nama,
                                                                            }
                                                                        )
                                                                    }
                                                                    field.onChange(
                                                                        value
                                                                    )
                                                                    form.setValue(
                                                                        'alamat.ProvinsiId',
                                                                        ''
                                                                    )
                                                                    form.setValue(
                                                                        'alamat.KabupatenId',
                                                                        ''
                                                                    )
                                                                    form.setValue(
                                                                        'alamat.KecamatanId',
                                                                        ''
                                                                    )
                                                                    form.setValue(
                                                                        'alamat.DesaId',
                                                                        ''
                                                                    )
                                                                    getProvinsiByCountryId(
                                                                        form.watch(
                                                                            'alamat.CountryId'
                                                                        ) || ''
                                                                    ).then(
                                                                        (res) =>
                                                                            setDataProvinsi(
                                                                                res
                                                                            )
                                                                    )
                                                                }}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Negara" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {countryDataServer.map(
                                                                        (c) => (
                                                                            <SelectItem
                                                                                value={
                                                                                    c.CountryId
                                                                                }
                                                                                key={
                                                                                    c.CountryId
                                                                                }
                                                                            >
                                                                                {
                                                                                    c.Nama
                                                                                }
                                                                            </SelectItem>
                                                                        )
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Pilih Negara Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="alamat.ProvinsiId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Provinsi
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                disabled={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value
                                                                }
                                                                onValueChange={(
                                                                    value
                                                                ) => {
                                                                    field.onChange(
                                                                        value
                                                                    )
                                                                    let data =
                                                                        dataProvinsi.find(
                                                                            (
                                                                                x
                                                                            ) =>
                                                                                x.ProvinsiId ===
                                                                                value
                                                                        )
                                                                    if (data) {
                                                                        setSelectedData(
                                                                            {
                                                                                ...selectedData,
                                                                                NamaProvinsi:
                                                                                    data.Nama,
                                                                            }
                                                                        )
                                                                    }
                                                                    setDataKecamatan(
                                                                        []
                                                                    )
                                                                    setDataDesa(
                                                                        []
                                                                    )
                                                                    form.setValue(
                                                                        'alamat.KabupatenId',
                                                                        ''
                                                                    )
                                                                    form.setValue(
                                                                        'alamat.KecamatanId',
                                                                        ''
                                                                    )
                                                                    form.setValue(
                                                                        'alamat.DesaId',
                                                                        ''
                                                                    )
                                                                    getKabupatenByProvinsiId(
                                                                        form.watch(
                                                                            'alamat.ProvinsiId'
                                                                        ) || ''
                                                                    ).then(
                                                                        (res) =>
                                                                            setDataKabupaten(
                                                                                res
                                                                            )
                                                                    )
                                                                }}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Provinsi" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {dataProvinsi.map(
                                                                        (p) => (
                                                                            <SelectItem
                                                                                value={
                                                                                    p.ProvinsiId
                                                                                }
                                                                                key={
                                                                                    p.ProvinsiId
                                                                                }
                                                                            >
                                                                                {
                                                                                    p.Nama
                                                                                }
                                                                            </SelectItem>
                                                                        )
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Pilih Provinsi Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="alamat.KabupatenId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Kabupaten
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                disabled={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value
                                                                }
                                                                onValueChange={(
                                                                    value
                                                                ) => {
                                                                    field.onChange(
                                                                        value
                                                                    )
                                                                    let data =
                                                                        dataKabupaten.find(
                                                                            (
                                                                                x
                                                                            ) =>
                                                                                x.KabupatenId ===
                                                                                value
                                                                        )
                                                                    if (data) {
                                                                        setSelectedData(
                                                                            {
                                                                                ...selectedData,
                                                                                NamaKabupaten:
                                                                                    data.Nama,
                                                                            }
                                                                        )
                                                                    }
                                                                    setDataDesa(
                                                                        []
                                                                    )
                                                                    form.setValue(
                                                                        'alamat.KecamatanId',
                                                                        ''
                                                                    )
                                                                    form.setValue(
                                                                        'alamat.DesaId',
                                                                        ''
                                                                    )
                                                                    getKecamatanByKabupatenId(
                                                                        form.watch(
                                                                            'alamat.KabupatenId'
                                                                        ) || ''
                                                                    ).then(
                                                                        (res) =>
                                                                            setDataKecamatan(
                                                                                res
                                                                            )
                                                                    )
                                                                }}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Kabupaten" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {dataKabupaten.map(
                                                                        (p) => (
                                                                            <SelectItem
                                                                                value={
                                                                                    p.KabupatenId
                                                                                }
                                                                                key={
                                                                                    p.KabupatenId
                                                                                }
                                                                            >
                                                                                {
                                                                                    p.Nama
                                                                                }
                                                                            </SelectItem>
                                                                        )
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Pilih Kabupaten Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="alamat.KecamatanId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Kecamatan
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                disabled={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value
                                                                }
                                                                onValueChange={(
                                                                    value
                                                                ) => {
                                                                    field.onChange(
                                                                        value
                                                                    )
                                                                    let data =
                                                                        dataKecamatan.find(
                                                                            (
                                                                                x
                                                                            ) =>
                                                                                x.KecamatanId ===
                                                                                value
                                                                        )
                                                                    if (data) {
                                                                        setSelectedData(
                                                                            {
                                                                                ...selectedData,
                                                                                NamaKecamatan:
                                                                                    data.Nama,
                                                                            }
                                                                        )
                                                                    }
                                                                    form.setValue(
                                                                        'alamat.DesaId',
                                                                        ''
                                                                    )
                                                                    getDesaByKecamatanId(
                                                                        form.watch(
                                                                            'alamat.KecamatanId'
                                                                        ) || ''
                                                                    ).then(
                                                                        (res) =>
                                                                            setDataDesa(
                                                                                res
                                                                            )
                                                                    )
                                                                }}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Kecamatan" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {dataKecamatan.map(
                                                                        (p) => (
                                                                            <SelectItem
                                                                                value={
                                                                                    p.KecamatanId
                                                                                }
                                                                                key={
                                                                                    p.KecamatanId
                                                                                }
                                                                            >
                                                                                {
                                                                                    p.Nama
                                                                                }
                                                                            </SelectItem>
                                                                        )
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Pilih Kecamatan Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="alamat.DesaId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Desa
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                disabled={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value
                                                                }
                                                                onValueChange={(
                                                                    val
                                                                ) => {
                                                                    let data =
                                                                        dataDesa.find(
                                                                            (
                                                                                x
                                                                            ) =>
                                                                                x.DesaId ===
                                                                                val
                                                                        )
                                                                    if (data) {
                                                                        setSelectedData(
                                                                            {
                                                                                ...selectedData,
                                                                                NamaDesa:
                                                                                    data.Nama,
                                                                            }
                                                                        )
                                                                    }
                                                                    field.onChange(
                                                                        val
                                                                    )
                                                                }}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Desa" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {dataDesa.map(
                                                                        (p) => (
                                                                            <SelectItem
                                                                                value={
                                                                                    p.DesaId
                                                                                }
                                                                                key={
                                                                                    p.DesaId
                                                                                }
                                                                            >
                                                                                {
                                                                                    p.Nama
                                                                                }
                                                                            </SelectItem>
                                                                        )
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Pilih Desa Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="alamat.Alamat"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Alamat
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                disabled={
                                                                    loading
                                                                }
                                                                {...field}
                                                                placeholder="Alamat Anda."
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Masukan Alamat
                                                            Lengkap Rumah Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="alamat.KodePos"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Kode Pos
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
                                                            Kode Pos Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <Separator className="my-5" />
                                        <div className="text-base font-bold my-3">
                                            Informasi Detail Asesor
                                        </div>
                                        <div className="grid grid-cols-1 gap-2 mb-5">
                                            <Select
                                                disabled={loading}
                                                value={
                                                    selectedData.TipeAsesorId
                                                }
                                                onValueChange={(val) => {
                                                    setSelectedData({
                                                        ...selectedData,
                                                        TipeAsesorId: val,
                                                    })
                                                    let temp =
                                                        tipeAsesorDataServer.find(
                                                            (x) =>
                                                                x.TipeAsesorId ===
                                                                val
                                                        )
                                                    if (temp) {
                                                        if (
                                                            temp.Nama.match(
                                                                'Asesor Akademik'
                                                            )
                                                        ) {
                                                            form.setValue(
                                                                'asesorAkademik',
                                                                {
                                                                    AsesorAkademikId:
                                                                        '',
                                                                    Pangkat: '',
                                                                    JabatanFungsionalAkademik:
                                                                        '',
                                                                    NipNidn: '',
                                                                    NamaPerguruanTinggi:
                                                                        '',
                                                                    AlamatPerguruanTinggi:
                                                                        '',
                                                                    PendidikanTerakhirBidangKeilmuan:
                                                                        '',
                                                                    AsesorAkademikKeanggotaanAsosiasi:
                                                                        null,
                                                                }
                                                            )
                                                        }
                                                        if (
                                                            temp.Nama.match(
                                                                'Asesor Akademik'
                                                            )
                                                        ) {
                                                            form.setValue(
                                                                'asesorPraktisi',
                                                                {
                                                                    AsesorPraktisiId:
                                                                        '',
                                                                    AsesorId:
                                                                        '',
                                                                    NamaAsosiasi:
                                                                        '',
                                                                    NomorKeanggotaan:
                                                                        '',
                                                                    Jabatan: '',
                                                                    AlamatKantor:
                                                                        '',
                                                                    NamaInstansi:
                                                                        '',
                                                                    JabatanInstansi:
                                                                        '',
                                                                    BidangKeahlian:
                                                                        '',
                                                                }
                                                            )
                                                        }
                                                        form.setValue(
                                                            'tipeAsesor',
                                                            {
                                                                TipeAsesorId:
                                                                    val,
                                                                Icon:
                                                                    temp.Icon ||
                                                                    '',
                                                                Deskripsi:
                                                                    temp.Deskripsi ||
                                                                    '',
                                                                Nama: temp.Nama,
                                                            }
                                                        )
                                                    }
                                                }}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Pilih Tipe Asesor" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {tipeAsesorDataServer.map(
                                                        (p) => (
                                                            <SelectItem
                                                                value={
                                                                    p.TipeAsesorId
                                                                }
                                                                key={
                                                                    p.TipeAsesorId
                                                                }
                                                            >
                                                                {p.Nama}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div
                                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2"
                                            hidden={
                                                form
                                                    .watch('tipeAsesor.Nama')
                                                    .match('Asesor Akademik')
                                                    ? false
                                                    : form
                                                          .watch(
                                                              'tipeAsesor.Nama'
                                                          )
                                                          .match('')
                                                    ? true
                                                    : true
                                            }
                                        >
                                            <FormField
                                                control={form.control}
                                                name="asesorAkademik.NamaPerguruanTinggi"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Nama Perguruan
                                                            Tinggi
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
                                                            Nama Perguruan
                                                            Tinggi Asesor
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="asesorAkademik.AlamatPerguruanTinggi"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Alamat Perguruan
                                                            Tinggi
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                {...field}
                                                                value={
                                                                    field.value ||
                                                                    ''
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Alamat Perguruan
                                                            Tinggi
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="asesorAkademik.NipNidn"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            NIP / NIDN
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
                                                            Nomor Induk Dosen /
                                                            Pegawai
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="asesorAkademik.Pangkat"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Pangkat
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
                                                            Pangkat Asesor
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="asesorAkademik.PendidikanTerakhirBidangKeilmuan"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Pendidikan Terakhir
                                                            Bidang Keilmuan
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                {...field}
                                                                value={
                                                                    field.value ||
                                                                    ''
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Pendidikan Terakhir
                                                            Bidang Keilmuan
                                                            Asesor
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="asesorAkademik.JabatanFungsionalAkademik"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Jabatan Fungsional
                                                            Akademik
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
                                                            Jabatan Fungsional
                                                            Akademik Asesor
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div
                                            hidden={
                                                form
                                                    .watch('tipeAsesor.Nama')
                                                    .match('Asesor Praktisi')
                                                    ? false
                                                    : form
                                                          .watch(
                                                              'tipeAsesor.Nama'
                                                          )
                                                          .match('')
                                                    ? true
                                                    : true
                                            }
                                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2"
                                        >
                                            <FormField
                                                control={form.control}
                                                name="asesorPraktisi.NamaAsosiasi"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Nama Asosiasi
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
                                                            Nama Asosiasi
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="asesorPraktisi.NomorKeanggotaan"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Nomor Keanggotaan
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
                                                            Nomor Keanggotaan
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="asesorPraktisi.Jabatan"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Jabatan
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
                                                            Jabatan
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="asesorPraktisi.AlamatKantor"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Alamat Kantor
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value ??
                                                                    ''
                                                                }
                                                                onChange={(
                                                                    val
                                                                ) =>
                                                                    field.onChange(
                                                                        val
                                                                    )
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Alamat Kantor
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="asesorPraktisi.NamaInstansi"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Nama Instansi
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
                                                            Nama Instansi
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="asesorPraktisi.JabatanInstansi"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Jabatan Instansi
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
                                                            Jabatan Instansi
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="asesorPraktisi.BidangKeahlian"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Bidang Keahlian
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
                                                            Bidang Keahlian
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div
                                            hidden={
                                                form
                                                    .watch('tipeAsesor.Nama')
                                                    .match('Asesor Akademik') ||
                                                form
                                                    .watch('tipeAsesor.Nama')
                                                    .match('Asesor Praktisi')
                                                    ? true
                                                    : false
                                            }
                                            className="w-full flex justify-center"
                                        >
                                            Silakan Pilih Tipe Asesor
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="mr-2" type="submit">
                                            <SaveAll />
                                            Simpan
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </form>
                        </Form>
                    )}
                </div>
            ) : (
                <></>
            )}
            {loading ? (
                <div className="space-y-2 w-full">
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
                <div className="w-full rounded-md border">
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
            <div className="w-full flex items-center justify-end space-x-2 py-4">
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
        </div>
    )
}

export default ManajemenDataAsesor
