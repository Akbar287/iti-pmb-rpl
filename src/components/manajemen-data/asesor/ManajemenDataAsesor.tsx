'use client'
import { cn, replaceItemAtIndex } from '@/lib/utils'
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
} from '../../ui/dropdown-menu'
import { Button } from '../../ui/button'
import {
    CalendarIcon,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    PenIcon,
    Timer,
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
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '../../ui/sheet'
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
    JenisOrtu,
    Jenjang,
    Kabupaten,
    Kecamatan,
    Provinsi,
    SistemKuliah,
    StatusPekerjaan,
    StatusPerkawinan,
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

const ManajemenDataAsesor = ({
    countryDataServer,
    universitasDataServer,
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
}) => {
    const [dataProvinsi, setDataProvinsi] = React.useState<Provinsi[]>([])
    const [dataKabupaten, setDataKabupaten] = React.useState<Kabupaten[]>([])
    const [dataKecamatan, setDataKecamatan] = React.useState<Kecamatan[]>([])
    const [dataDesa, setDataDesa] = React.useState<Desa[]>([])
    const [selectedData, setSelectedData] = React.useState<{
        NamaDesa: string
        NamaKecamatan: string
        NamaKabupaten: string
        NamaProvinsi: string
        NamaCountry: string
    }>({
        NamaDesa: '',
        NamaKecamatan: '',
        NamaKabupaten: '',
        NamaProvinsi: '',
        NamaCountry: '',
    })
    const [selectedProdi, setSelectedProdi] = React.useState<
        {
            ProgramStudiId: string
            UniversityId: string
            Nama: string
        }[]
    >([])
    const [dataProvinsiInstitusiLama, setDataProvinsiInstitusiLama] =
        React.useState<Provinsi[]>([])
    const [dataKabupatenInstitusiLama, setDataKabupatenInstitusiLama] =
        React.useState<Kabupaten[]>([])
    const [dataKecamatanInstitusiLama, setDataKecamatanInstitusiLama] =
        React.useState<Kecamatan[]>([])
    const [dataDesaInstitusiLama, setDataDesaInstitusiLama] = React.useState<
        Desa[]
    >([])
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
            asesorAkademik: null,
            asesorPraktisi: null,
        },
    })
    const onSubmit = async (data: AsesorFormValidation) => {
        setLoading(true)
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
                TipeAsesor: data.tipeAsesor,
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
                    setLoading(false)
                })
                .catch((err) => {
                    toast('Data Asesor gagal diubah. Error: ' + err)
                    setLoading(false)
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
                TipeAsesor: data.tipeAsesor,
                AsesorAkademik: data.asesorAkademik,
                AsesorPraktisi: data.asesorPraktisi,
            })
                .then((res) => {
                    toast('Data Asesor berhasil ditambah')
                    setDataAsesor([...dataAsesor, res])
                    setLoading(false)
                    setOpenDialog(false)
                })
                .catch((err) => {
                    toast('Data Asesor gagal ditambah. Error: ' + err)
                    setLoading(false)
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
        setTitleDialog('Tambah Asesor')
        setOpenDialog(true)
    }
    const ubahData = async (jd: AsesorPage) => {
        setLoading(true)
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

        form.setValue('alamat', res.Alamat)
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
        form.setValue('asesorAkademik', res.AsesorAkademik)
        form.setValue('asesorPraktisi', res.AsesorPraktisi)
        setLoading(false)
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
                <div className="capitalize">{row.getValue('Prodi')}</div>
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
    return <div></div>
}

export default ManajemenDataAsesor
