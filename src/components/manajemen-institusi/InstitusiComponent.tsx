'use client'
import { replaceItemAtIndex } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import {
    ChevronLeft,
    ChevronRight,
    PenIcon,
    PlusCircle,
    Timer,
    Trash2,
} from 'lucide-react'
import Swal from 'sweetalert2'
import { Input } from '../ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select'
import { Skeleton } from '../ui/skeleton'
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
import { InstitusiResponseType } from '@/types/ManajemenInstitusiType'
import {
    UniversityFormSkemaValidation,
    UniversityFormValidation,
} from '@/validation/InstitusiValidation'
import {
    deleteInstitusi,
    getInstitusiPagination,
    setInstitusi,
    updateInstitusi,
} from '@/services/ManajemenInstitusi/InstitusiServices'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../ui/card'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableRow,
} from '../ui/table'
import {
    Country,
    Desa,
    Kabupaten,
    Kecamatan,
    Provinsi,
} from '@/generated/prisma'
import {
    getDesaByKecamatanId,
    getKabupatenByProvinsiId,
    getKecamatanByKabupatenId,
    getProvinsiByCountryId,
} from '@/services/AreaServices'
import { Textarea } from '../ui/textarea'

const InstitusiComponent = ({
    dataServer,
    countryServer,
}: {
    dataServer: InstitusiResponseType[]
    countryServer: Country[]
}) => {
    const [dataUniversity, setDataUniversity] =
        React.useState<InstitusiResponseType[]>(dataServer)
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
    const [countryData, setCountryData] =
        React.useState<Country[]>(countryServer)
    const [provinsiData, setProvinsiData] = React.useState<Provinsi[]>([])
    const [kabupatenData, setKabupatenData] = React.useState<Kabupaten[]>([])
    const [kecamatanData, setKecamatanData] = React.useState<Kecamatan[]>([])
    const [desaData, setDesaData] = React.useState<Desa[]>([])
    const [openDialog, setOpenDialog] = React.useState<boolean>(false)
    const [titleDialog, setTitleDialog] = React.useState<string>('')
    const [loading, setLoading] = React.useState<boolean>(false)
    const form = useForm<UniversityFormValidation>({
        resolver: zodResolver(UniversityFormSkemaValidation),
        defaultValues: {
            UniversityId: '',
            Nama: '',
            Akreditasi: '',
            AlamatId: '',
            Alamat: '',
            KodePos: '',
            DesaId: '',
            NamaDesa: '',
            KecamatanId: '',
            NamaKecamatan: '',
            KabupatenId: '',
            NamaKabupaten: '',
            ProvinsiId: '',
            NamaProvinsi: '',
            CountryId: '',
            NamaCountry: '',
        },
    })
    const onSubmit = async (data: UniversityFormValidation) => {
        setLoading(true)

        if (titleDialog === 'Ubah Institusi') {
            await updateInstitusi({
                University: {
                    UniversityId: data.UniversityId,
                    Nama: data.Nama,
                    AlamatId: data.AlamatId,
                    Akreditasi: data.Akreditasi,
                    CreatedAt: null,
                    UpdatedAt: null,
                    DeletedAt: null,
                },
                Alamat: {
                    AlamatId: data.AlamatId,
                    Alamat: data.Alamat,
                    KodePos: data.KodePos,
                    DesaId: data.DesaId,
                },
            })
                .then((res) => {
                    toast('Data Institusi berhasil diubah')
                    let idx = dataUniversity.findIndex(
                        (r) => r.UniversityId === data.UniversityId
                    )
                    setDataUniversity(
                        replaceItemAtIndex(dataUniversity, idx, res)
                    )
                    setOpenDialog(false)
                    setLoading(false)
                })
                .catch((err) => {
                    toast('Data Institusi gagal diubah. Error: ' + err)
                    setLoading(false)
                })
        } else {
            await setInstitusi({
                University: {
                    UniversityId: data.UniversityId,
                    Nama: data.Nama,
                    AlamatId: '',
                    Akreditasi: data.Akreditasi,
                    CreatedAt: new Date(),
                    UpdatedAt: new Date(),
                    DeletedAt: null,
                },
                Alamat: {
                    AlamatId: '',
                    Alamat: data.Alamat,
                    KodePos: data.KodePos,
                    DesaId: data.DesaId,
                },
            })
                .then((res) => {
                    toast('Data Institusi berhasil ditambah')
                    setDataUniversity([...dataUniversity, res])
                    setLoading(false)
                    setOpenDialog(false)
                })
                .catch((err) => {
                    toast('Data Institusi gagal ditambah. Error: ' + err)
                    setLoading(false)
                })
        }
    }

    React.useEffect(() => {
        setLoading(true)
        getInstitusiPagination(paginationState.page, paginationState.limit, '')
            .then((res) => {
                setDataUniversity(res.data)
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
    }, [paginationState.page, paginationState.limit])

    const buatData = () => {
        form.reset()
        setTitleDialog('Tambah Institusi')
        setOpenDialog(true)
    }
    const ubahData = (jd: InstitusiResponseType) => {
        form.reset()
        getProvinsiByCountryId(jd.CountryId).then((res) => setProvinsiData(res))
        getKabupatenByProvinsiId(jd.ProvinsiId).then((res) =>
            setKabupatenData(res)
        )
        getKecamatanByKabupatenId(jd.KabupatenId).then((res) =>
            setKecamatanData(res)
        )
        getDesaByKecamatanId(jd.KecamatanId).then((res) => setDesaData(res))
        form.setValue('UniversityId', jd.UniversityId)
        form.setValue('Nama', jd.Nama)
        form.setValue('Akreditasi', jd.Akreditasi)
        form.setValue('AlamatId', jd.AlamatId)
        form.setValue('Alamat', jd.Alamat)
        form.setValue('KodePos', jd.KodePos)
        form.setValue('DesaId', jd.DesaId)
        form.setValue('NamaDesa', jd.NamaDesa)
        form.setValue('KecamatanId', jd.KecamatanId)
        form.setValue('NamaKecamatan', jd.NamaKecamatan)
        form.setValue('KabupatenId', jd.KabupatenId)
        form.setValue('NamaKabupaten', jd.NamaKabupaten)
        form.setValue('ProvinsiId', jd.ProvinsiId)
        form.setValue('NamaProvinsi', jd.NamaProvinsi)
        form.setValue('CountryId', jd.CountryId)
        form.setValue('NamaCountry', jd.NamaCountry)
        setTitleDialog('Ubah Institusi')
        setOpenDialog(true)
    }
    const hapusData = (jd: InstitusiResponseType) => {
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
                deleteInstitusi(jd.UniversityId).then(() => {
                    setDataUniversity(
                        dataUniversity.filter(
                            (r) => r.UniversityId !== jd.UniversityId
                        )
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

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <h1 className="text-2xl">Institusi</h1>
                </CardTitle>
                <CardDescription>
                    {!loading ? (
                        <Button
                            onClick={() => buatData()}
                            className="hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer"
                        >
                            <PlusCircle /> Tambah
                        </Button>
                    ) : (
                        <Skeleton className="w-20 h-8" />
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <Skeleton className="w-full flex" />
                ) : (
                    dataUniversity.map((d) => (
                        <Card key={d.UniversityId}>
                            <CardHeader>
                                <CardTitle>
                                    <h1 className="text-xl">{d.Nama}</h1>
                                </CardTitle>
                                <CardDescription>
                                    {d.Akreditasi}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 gap-3">
                                <Table>
                                    <TableCaption>
                                        Informasi Institusi
                                    </TableCaption>
                                    <TableBody>
                                        <TableRow>
                                            <TableHead>
                                                Nama Institusi
                                            </TableHead>
                                            <TableCell>{d.Nama}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableHead>Akreditasi</TableHead>
                                            <TableCell>
                                                {d.Akreditasi}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                                <Table>
                                    <TableCaption>
                                        Alamat Institusi
                                    </TableCaption>
                                    <TableBody>
                                        <TableRow>
                                            <TableHead>Negara</TableHead>
                                            <TableCell>
                                                {d.NamaCountry}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableHead>Provinsi</TableHead>
                                            <TableCell>
                                                {d.NamaProvinsi}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableHead>Kabupaten</TableHead>
                                            <TableCell>
                                                {d.NamaKabupaten}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableHead>Kecamatan</TableHead>
                                            <TableCell>
                                                {d.NamaKecamatan}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableHead>Desa</TableHead>
                                            <TableCell>{d.NamaDesa}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableHead>Alamat</TableHead>
                                            <TableCell>{d.Alamat}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableHead>Kode Pos</TableHead>
                                            <TableCell>{d.KodePos}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="mx-2  hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer "
                                    type="button"
                                    onClick={() => ubahData(d)}
                                >
                                    <PenIcon />
                                    Ubah
                                </Button>
                                <Button
                                    className="mx-2  hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer "
                                    variant={'destructive'}
                                    type="button"
                                    onClick={() => hapusData(d)}
                                >
                                    <Trash2 />
                                    Hapus
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </CardContent>
            <CardFooter className="flex items-center justify-between space-x-2 py-4">
                {!loading ? (
                    <>
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
                    </>
                ) : (
                    <Skeleton className="w-full h-20 " />
                )}
            </CardFooter>
            <SheetManageData
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                onSubmit={onSubmit}
                loading={loading}
                form={form}
                titleDialog={titleDialog}
                countryData={countryData}
                provinsiData={provinsiData}
                kabupatenData={kabupatenData}
                kecamatanData={kecamatanData}
                desaData={desaData}
                setCountryData={setCountryData}
                setProvinsiData={setProvinsiData}
                setKabupatenData={setKabupatenData}
                setKecamatanData={setKecamatanData}
                setDesaData={setDesaData}
            />
        </Card>
    )
}

export default InstitusiComponent

export function SheetManageData({
    openDialog,
    setOpenDialog,
    onSubmit,
    loading,
    form,
    titleDialog,
    countryData,
    provinsiData,
    kabupatenData,
    kecamatanData,
    desaData,
    setCountryData,
    setProvinsiData,
    setKabupatenData,
    setKecamatanData,
    setDesaData,
}: {
    openDialog: boolean
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
    loading: boolean
    onSubmit: (data: UniversityFormValidation) => void
    form: UseFormReturn<UniversityFormValidation>
    titleDialog: string
    countryData: Country[]
    provinsiData: Provinsi[]
    kabupatenData: Kabupaten[]
    kecamatanData: Kecamatan[]
    desaData: Desa[]
    setCountryData: React.Dispatch<React.SetStateAction<Country[]>>
    setProvinsiData: React.Dispatch<React.SetStateAction<Provinsi[]>>
    setKabupatenData: React.Dispatch<React.SetStateAction<Kabupaten[]>>
    setKecamatanData: React.Dispatch<React.SetStateAction<Kecamatan[]>>
    setDesaData: React.Dispatch<React.SetStateAction<Desa[]>>
}) {
    return (
        <div className="grid grid-cols-2 gap-2">
            <Sheet open={openDialog} onOpenChange={setOpenDialog}>
                <SheetContent
                    side="right"
                    className="w-screen h-screen max-w-full overflow-scroll"
                >
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <SheetHeader>
                                <SheetTitle>{titleDialog}</SheetTitle>
                                <SheetDescription>
                                    Manage Data untuk {form.getValues('Nama')}
                                </SheetDescription>
                            </SheetHeader>
                            <div className="w-full grid grid-cols-1 gap-3 px-4">
                                <div className="container mx-auto">
                                    <div className="grid grid-cols-1 gap-3">
                                        <FormField
                                            control={form.control}
                                            name="CountryId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Negara
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Select
                                                            disabled={loading}
                                                            value={
                                                                field.value ??
                                                                ''
                                                            }
                                                            onValueChange={(
                                                                value
                                                            ) => {
                                                                setKabupatenData(
                                                                    []
                                                                )
                                                                setKecamatanData(
                                                                    []
                                                                )
                                                                setDesaData([])
                                                                field.onChange(
                                                                    value
                                                                )
                                                                form.setValue(
                                                                    'ProvinsiId',
                                                                    ''
                                                                )
                                                                form.setValue(
                                                                    'KabupatenId',
                                                                    ''
                                                                )
                                                                form.setValue(
                                                                    'KecamatanId',
                                                                    ''
                                                                )
                                                                form.setValue(
                                                                    'DesaId',
                                                                    ''
                                                                )
                                                                getProvinsiByCountryId(
                                                                    form.watch(
                                                                        'CountryId'
                                                                    ) || ''
                                                                ).then((res) =>
                                                                    setProvinsiData(
                                                                        res
                                                                    )
                                                                )
                                                            }}
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Pilih Negara" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {countryData.map(
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
                                            name="ProvinsiId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Provinsi
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Select
                                                            disabled={
                                                                loading ||
                                                                provinsiData.length ===
                                                                    0
                                                            }
                                                            value={
                                                                field.value ??
                                                                ''
                                                            }
                                                            onValueChange={(
                                                                value
                                                            ) => {
                                                                field.onChange(
                                                                    value
                                                                )
                                                                setKecamatanData(
                                                                    []
                                                                )
                                                                setDesaData([])
                                                                form.setValue(
                                                                    'KabupatenId',
                                                                    ''
                                                                )
                                                                form.setValue(
                                                                    'KecamatanId',
                                                                    ''
                                                                )
                                                                form.setValue(
                                                                    'DesaId',
                                                                    ''
                                                                )
                                                                getKabupatenByProvinsiId(
                                                                    form.watch(
                                                                        'ProvinsiId'
                                                                    ) || ''
                                                                ).then((res) =>
                                                                    setKabupatenData(
                                                                        res
                                                                    )
                                                                )
                                                            }}
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Pilih Provinsi" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {provinsiData.map(
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
                                            name="KabupatenId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Kabupaten
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Select
                                                            disabled={
                                                                loading ||
                                                                kabupatenData.length ===
                                                                    0
                                                            }
                                                            value={
                                                                field.value ??
                                                                ''
                                                            }
                                                            onValueChange={(
                                                                value
                                                            ) => {
                                                                field.onChange(
                                                                    value
                                                                )
                                                                setDesaData([])
                                                                form.setValue(
                                                                    'KecamatanId',
                                                                    ''
                                                                )
                                                                form.setValue(
                                                                    'DesaId',
                                                                    ''
                                                                )
                                                                getKecamatanByKabupatenId(
                                                                    form.watch(
                                                                        'KabupatenId'
                                                                    ) || ''
                                                                ).then((res) =>
                                                                    setKecamatanData(
                                                                        res
                                                                    )
                                                                )
                                                            }}
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Pilih Kabupaten" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {kabupatenData.map(
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
                                            name="KecamatanId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Kecamatan
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Select
                                                            disabled={
                                                                loading ||
                                                                kecamatanData.length ===
                                                                    0
                                                            }
                                                            value={
                                                                field.value ??
                                                                ''
                                                            }
                                                            onValueChange={(
                                                                value
                                                            ) => {
                                                                field.onChange(
                                                                    value
                                                                )
                                                                form.setValue(
                                                                    'DesaId',
                                                                    ''
                                                                )
                                                                getDesaByKecamatanId(
                                                                    form.watch(
                                                                        'KecamatanId'
                                                                    ) || ''
                                                                ).then((res) =>
                                                                    setDesaData(
                                                                        res
                                                                    )
                                                                )
                                                            }}
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Pilih Kecamatan" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {kecamatanData.map(
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
                                            name="DesaId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Desa</FormLabel>
                                                    <FormControl>
                                                        <Select
                                                            disabled={
                                                                loading ||
                                                                desaData.length ===
                                                                    0
                                                            }
                                                            value={
                                                                field.value ??
                                                                ''
                                                            }
                                                            onValueChange={
                                                                field.onChange
                                                            }
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Pilih Desa" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {desaData.map(
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
                                            name="Alamat"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Alamat
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            disabled={loading}
                                                            {...field}
                                                            placeholder="Alamat Anda."
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Masukan Alamat Lengkap
                                                        Rumah Anda
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="KodePos"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Kode Pos
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            readOnly={loading}
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
                                        <FormField
                                            control={form.control}
                                            name="Nama"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Nama Institusi
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            readOnly={loading}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Nama Institusi
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="Akreditasi"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Akreditasi Institusi
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            readOnly={loading}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Akreditasi Institusi
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
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
                </SheetContent>
            </Sheet>
        </div>
    )
}
