'use client'
import {
    Country,
    Desa,
    Jenjang,
    Kabupaten,
    Kecamatan,
    Provinsi,
    StatusPerkawinan,
} from '@/generated/prisma'
import { InstitusiLamaType, InstitusiLamaValue } from '@/types/InstitusiLama'
import React from 'react'
import Swal from 'sweetalert2'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../ui/card'
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
    deleteInstitusiLama,
    getInstitusiLamaByPendaftaranId,
    setInstitusiLama,
    updateInstitusiLama,
} from '@/services/KelengkapanDokumen/InstitusiLamaService'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableRow,
} from '../ui/table'
import { Button } from '../ui/button'
import { PenIcon, PlusCircle, Trash2 } from 'lucide-react'
import {
    getCountryId,
    getDesaByKecamatanId,
    getDesaId,
    getKabupatenByProvinsiId,
    getKabupatenId,
    getKecamatanByKabupatenId,
    getKecamatanId,
    getProvinsiByCountryId,
    getProvinsiId,
} from '@/services/AreaServices'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { toast } from 'sonner'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../ui/tooltip'
import { Textarea } from '../ui/textarea'
import { replaceItemAtIndex } from '@/lib/utils'
import { Skeleton } from '../ui/skeleton'

const InstitusiLama = ({
    dataMahasiswa,
    countryDataServer,
}: {
    countryDataServer: Country[]
    dataMahasiswa: {
        MahasiswaId: string
        StatusPerkawinan: StatusPerkawinan
        Pendaftaran: {
            PendaftaranId: string
            KodePendaftar: string
            NoUjian: string
            Periode: string
        }[]
    }[]
}) => {
    const [selectableMahasiswa, setSelectableMahasiswa] =
        React.useState<string>('')
    const [form, setForm] =
        React.useState<InstitusiLamaType>(InstitusiLamaValue)
    const [data, setData] = React.useState<InstitusiLamaType[]>([])
    const [openDialog, setOpenDialog] = React.useState<boolean>(false)
    const [titleDialog, setTitleDialog] = React.useState<string>('')
    const [area, setArea] = React.useState<
        {
            InstitusiLamaId: string
            country: Country
            provinsi: Provinsi
            kabupaten: Kabupaten
            kecamatan: Kecamatan
            desa: Desa
        }[]
    >([])
    const [countryData, setCountryData] =
        React.useState<Country[]>(countryDataServer)
    const [provinsiData, setProvinsiData] = React.useState<Provinsi[]>([])
    const [kabupatenData, setKabupatenData] = React.useState<Kabupaten[]>([])
    const [kecamatanData, setKecamatanData] = React.useState<Kecamatan[]>([])
    const [desaData, setDesaData] = React.useState<Desa[]>([])
    const [loadingAwal, setLoadingAwal] = React.useState(false)

    React.useEffect(() => {
        setLoadingAwal(true)
        getInstitusiLamaByPendaftaranId(selectableMahasiswa).then(
            async (res) => {
                const temp = await Promise.all(
                    res.map(async (r) => ({
                        InstitusiLamaId: r.InstitusiLamaId,
                        country: await getCountryId(r.CountryId),
                        provinsi: await getProvinsiId(r.ProvinsiId),
                        kabupaten: await getKabupatenId(r.KabupatenId),
                        kecamatan: await getKecamatanId(r.KecamatanId),
                        desa: await getDesaId(r.DesaId),
                    }))
                )
                setArea(temp)
                setData(res)
                setLoadingAwal(false)
            }
        )
        setForm({ ...form, PendaftaranId: selectableMahasiswa })
    }, [selectableMahasiswa])

    const [loading, setLoading] = React.useState<boolean>(false)
    const tambahData = () => {
        setForm({ ...InstitusiLamaValue, PendaftaranId: selectableMahasiswa })
        setTitleDialog('Tambah Institusi Sebelumnya')
        setOpenDialog(true)
    }
    const submitEvent = () => {
        setLoading(true)
        if (titleDialog === 'Tambah Institusi Sebelumnya') {
            setInstitusiLama(form).then(async (res) => {
                setData([...data, res])
                const newArea = {
                    InstitusiLamaId: res.InstitusiLamaId,
                    country: await getCountryId(res.CountryId),
                    provinsi: await getProvinsiId(res.ProvinsiId),
                    kabupaten: await getKabupatenId(res.KabupatenId),
                    kecamatan: await getKecamatanId(res.KecamatanId),
                    desa: await getDesaId(res.DesaId),
                }
                setArea([...area, newArea])
                toast('Berhasil Menambah Institusi Sebelumnya')
            })
        } else {
            updateInstitusiLama(form).then(async (res) => {
                let index = data.findIndex(
                    (r) => r.InstitusiLamaId == form.InstitusiLamaId
                )
                let indexArea = area.findIndex(
                    (r) => r.InstitusiLamaId == form.InstitusiLamaId
                )
                setData(replaceItemAtIndex(data, index, res))
                const newArea = {
                    InstitusiLamaId: res.InstitusiLamaId,
                    country: await getCountryId(res.CountryId),
                    provinsi: await getProvinsiId(res.ProvinsiId),
                    kabupaten: await getKabupatenId(res.KabupatenId),
                    kecamatan: await getKecamatanId(res.KecamatanId),
                    desa: await getDesaId(res.DesaId),
                }
                setArea(replaceItemAtIndex(area, indexArea, newArea))
                toast('Berhasil Mengubah Institusi Sebelumnya')
            })
        }
        setOpenDialog(false)
        setLoading(false)
    }
    const ubahData = (e: InstitusiLamaType) => {
        setForm(e)
        getProvinsiByCountryId(e.CountryId).then((res) => setProvinsiData(res))
        getKabupatenByProvinsiId(e.ProvinsiId).then((res) =>
            setKabupatenData(res)
        )
        getKecamatanByKabupatenId(e.KabupatenId).then((res) =>
            setKecamatanData(res)
        )
        getDesaByKecamatanId(e.KecamatanId).then((res) => setDesaData(res))
        setTitleDialog('Ubah Data Institusi ' + e.NamaInstitusi)
        setOpenDialog(true)
    }
    const hapusData = (e: InstitusiLamaType) => {
        Swal.fire({
            title: 'Ingin Hapus ' + e.NamaInstitusi + ' ?',
            text: 'Aksi ini tidak dapat di undo',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f45f24',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteInstitusiLama(e.InstitusiLamaId).then(() => {
                    setData(
                        data.filter(
                            (r) => r.InstitusiLamaId !== e.InstitusiLamaId
                        )
                    )
                    setArea(
                        area.filter(
                            (r) => r.InstitusiLamaId !== e.InstitusiLamaId
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
                    <h1 className="text-2xl">Institusi Sebelumnya</h1>
                </CardTitle>
                <CardDescription>
                    Tambahkan Institusi Lama anda sebelum masuk ITI
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="my-2 w-full">
                    <h1>Silakan Pilih Nomor Ujian</h1>
                    <Select
                        value={selectableMahasiswa}
                        onValueChange={(e) => {
                            setSelectableMahasiswa(e)
                        }}
                    >
                        <SelectTrigger className="w-1/2">
                            <SelectValue placeholder="Pilih No. Ujian Anda" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Pilih No. Ujian Anda</SelectLabel>
                                {dataMahasiswa.map((m) => (
                                    <SelectItem
                                        key={m.MahasiswaId}
                                        value={m.Pendaftaran[0].PendaftaranId}
                                    >
                                        {m.Pendaftaran[0].NoUjian} -{' '}
                                        {m.Pendaftaran[0].Periode}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    {selectableMahasiswa && data.length === 0 ? (
                        <Button
                            className="hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer "
                            type="button"
                            onClick={() => tambahData()}
                        >
                            <PlusCircle />
                            Buat Baru
                        </Button>
                    ) : (
                        <></>
                    )}
                </div>
                {!selectableMahasiswa ? (
                    <></>
                ) : loadingAwal ? (
                    <Skeleton className="w-full h-56" />
                ) : (
                    <div className="my-2 w-full gap-3 grid grid-cols-1">
                        {data.length === 0 ? (
                            <h1 className="text-2xl text-center">
                                Tidak ada Data
                            </h1>
                        ) : (
                            data.map((d) => (
                                <Card key={d.InstitusiLamaId}>
                                    <CardHeader>
                                        <CardTitle>
                                            <h1 className="text-xl">
                                                {d.NamaInstitusi}
                                            </h1>
                                        </CardTitle>
                                        <CardDescription>
                                            {d.TahunLulus} - Nilai:{' '}
                                            {d.NilaiLulusan}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <Table>
                                            <TableCaption>
                                                Informasi Institusi
                                            </TableCaption>
                                            <TableBody>
                                                <TableRow>
                                                    <TableHead>
                                                        Jenis Institusi
                                                    </TableHead>
                                                    <TableCell>
                                                        {d.JenisInstitusi}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableHead>
                                                        Nama Institusi
                                                    </TableHead>
                                                    <TableCell>
                                                        {d.NamaInstitusi}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableHead>
                                                        Jurusan
                                                    </TableHead>
                                                    <TableCell>
                                                        {d.Jurusan}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableHead>Nisn</TableHead>
                                                    <TableCell>
                                                        {d.Nisn}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableHead>Npsn</TableHead>
                                                    <TableCell>
                                                        {d.Npsn}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableHead>
                                                        Tahun Lulus
                                                    </TableHead>
                                                    <TableCell>
                                                        {d.TahunLulus}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableHead>
                                                        Jenjang
                                                    </TableHead>
                                                    <TableCell>
                                                        {d.Jenjang}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableHead>
                                                        Nilai Lulusan
                                                    </TableHead>
                                                    <TableCell>
                                                        {d.NilaiLulusan}
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
                                                    <TableHead>
                                                        Negara
                                                    </TableHead>
                                                    <TableCell>
                                                        {
                                                            area.find(
                                                                (r) =>
                                                                    r.InstitusiLamaId ==
                                                                    d.InstitusiLamaId
                                                            )?.country.Nama
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableHead>
                                                        Provinsi
                                                    </TableHead>
                                                    <TableCell>
                                                        {
                                                            area.find(
                                                                (r) =>
                                                                    r.InstitusiLamaId ==
                                                                    d.InstitusiLamaId
                                                            )?.provinsi.Nama
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableHead>
                                                        Kabupaten
                                                    </TableHead>
                                                    <TableCell>
                                                        {
                                                            area.find(
                                                                (r) =>
                                                                    r.InstitusiLamaId ==
                                                                    d.InstitusiLamaId
                                                            )?.kabupaten.Nama
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableHead>
                                                        Kecamatan
                                                    </TableHead>
                                                    <TableCell>
                                                        {
                                                            area.find(
                                                                (r) =>
                                                                    r.InstitusiLamaId ==
                                                                    d.InstitusiLamaId
                                                            )?.kecamatan.Nama
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableHead>Desa</TableHead>
                                                    <TableCell>
                                                        {
                                                            area.find(
                                                                (r) =>
                                                                    r.InstitusiLamaId ==
                                                                    d.InstitusiLamaId
                                                            )?.desa.Nama
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableHead>
                                                        Alamat
                                                    </TableHead>
                                                    <TableCell>
                                                        {d.Alamat}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableHead>
                                                        Kode Pos
                                                    </TableHead>
                                                    <TableCell>
                                                        {d.KodePos}
                                                    </TableCell>
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
                    </div>
                )}
                <DialogInstitusiLama
                    submitEvent={submitEvent}
                    title={titleDialog}
                    openDialog={openDialog}
                    setOpenDialog={setOpenDialog}
                    form={form}
                    setForm={setForm}
                    loading={loading}
                    countryData={countryData}
                    setCountryData={setCountryData}
                    provinsiData={provinsiData}
                    setProvinsiData={setProvinsiData}
                    kabupatenData={kabupatenData}
                    setKabupatenData={setKabupatenData}
                    kecamatanData={kecamatanData}
                    setKecamatanData={setKecamatanData}
                    desaData={desaData}
                    setDesaData={setDesaData}
                />
            </CardContent>
        </Card>
    )
}

export default InstitusiLama

function DialogInstitusiLama({
    openDialog,
    submitEvent,
    setOpenDialog,
    title,
    form,
    setForm,
    loading,
    countryData,
    setCountryData,
    provinsiData,
    setProvinsiData,
    kabupatenData,
    setKabupatenData,
    kecamatanData,
    setKecamatanData,
    desaData,
    setDesaData,
}: {
    submitEvent: () => void
    openDialog: boolean
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
    title: string
    loading: boolean
    form: InstitusiLamaType
    setForm: React.Dispatch<React.SetStateAction<InstitusiLamaType>>
    countryData: Country[]
    setCountryData: React.Dispatch<React.SetStateAction<Country[]>>
    provinsiData: Provinsi[]
    setProvinsiData: React.Dispatch<React.SetStateAction<Provinsi[]>>
    kabupatenData: Kabupaten[]
    setKabupatenData: React.Dispatch<React.SetStateAction<Kabupaten[]>>
    kecamatanData: Kecamatan[]
    setKecamatanData: React.Dispatch<React.SetStateAction<Kecamatan[]>>
    desaData: Desa[]
    setDesaData: React.Dispatch<React.SetStateAction<Desa[]>>
}) {
    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className="w-full max-h-[80vh]  overflow-y-scroll">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        Catat Data Institusi Sebelumnya
                    </DialogDescription>
                </DialogHeader>
                <div className="w-full justify-center md:justify-between">
                    <div className="grid grid-cols-1 gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="jenis_institusi"
                                className="text-right"
                            >
                                Jenis Institusi
                            </Label>
                            <Input
                                id="jenis_institusi"
                                disabled={loading}
                                value={form.JenisInstitusi}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        JenisInstitusi: e.target.value,
                                    })
                                }
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="nama_institusi"
                                className="text-right"
                            >
                                Nama Institusi
                            </Label>
                            <Input
                                id="nama_institusi"
                                disabled={loading}
                                value={form.NamaInstitusi}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        NamaInstitusi: e.target.value,
                                    })
                                }
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="jurusan" className="text-right">
                                Jurusan
                            </Label>
                            <Input
                                id="jurusan"
                                disabled={loading}
                                value={form.Jurusan}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        Jurusan: e.target.value,
                                    })
                                }
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="jenjang" className="text-right">
                                Jenjang
                            </Label>
                            <Select
                                disabled={loading}
                                value={form.Jenjang}
                                onValueChange={(value) => {
                                    setForm({
                                        ...form,
                                        Jenjang: value as Jenjang,
                                    })
                                }}
                            >
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Pilih Jenjang" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={Jenjang.TIDAK_TAMAT_SD}>
                                        {Jenjang.TIDAK_TAMAT_SD}
                                    </SelectItem>
                                    <SelectItem value={Jenjang.SD}>
                                        {Jenjang.SD}
                                    </SelectItem>
                                    <SelectItem value={Jenjang.SMP}>
                                        {Jenjang.SMP}
                                    </SelectItem>
                                    <SelectItem value={Jenjang.SMA}>
                                        {Jenjang.SMA}
                                    </SelectItem>
                                    <SelectItem value={Jenjang.D3}>
                                        {Jenjang.D3}
                                    </SelectItem>
                                    <SelectItem value={Jenjang.S1}>
                                        {Jenjang.S1}
                                    </SelectItem>
                                    <SelectItem value={Jenjang.S2}>
                                        {Jenjang.S2}
                                    </SelectItem>
                                    <SelectItem value={Jenjang.S3}>
                                        {Jenjang.S3}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nisn" className="text-right">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>NISN</TooltipTrigger>
                                        <TooltipContent>
                                            Nomor Induk Siswa Nasional
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </Label>
                            <Input
                                id="nisn"
                                disabled={loading}
                                value={form.Nisn}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        Nisn: e.target.value,
                                    })
                                }
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="npsn" className="text-right">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>NPSN</TooltipTrigger>
                                        <TooltipContent>
                                            Nomor Pokok Sekolah Nasional
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </Label>
                            <Input
                                id="npsn"
                                disabled={loading}
                                value={form.Npsn}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        Npsn: e.target.value,
                                    })
                                }
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-sm font-medium">Tahun</label>
                            <Input
                                type="text"
                                value={form.TahunLulus}
                                onChange={(e) => {
                                    const val = e.target.value.slice(0, 4)
                                    setForm({
                                        ...form,
                                        TahunLulus: Number(e.target.value),
                                    })
                                }}
                                placeholder="Masukkan tahun (contoh: 2024)"
                                className="w-[200px]"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="nilai_kelulusan"
                                className="text-right"
                            >
                                Nilai Kelulusan
                            </Label>
                            <Input
                                id="nilai_kelulusan"
                                type="number"
                                min={0}
                                disabled={loading}
                                value={form.NilaiLulusan}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        NilaiLulusan: Number(e.target.value),
                                    })
                                }
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 py-4">
                        <div className="grid grid-cols-4 w-full items-center gap-4">
                            <Label htmlFor="negara" className="text-right">
                                Negara
                            </Label>
                            <Select
                                disabled={loading}
                                value={form.CountryId}
                                onValueChange={(value) => {
                                    setKabupatenData([])
                                    setKecamatanData([])
                                    setDesaData([])
                                    setForm({
                                        ...form,
                                        CountryId: value,
                                        ProvinsiId: '',
                                        KabupatenId: '',
                                        KecamatanId: '',
                                        DesaId: '',
                                    })
                                    getProvinsiByCountryId(value).then((res) =>
                                        setProvinsiData(res)
                                    )
                                }}
                            >
                                <SelectTrigger
                                    id="negara"
                                    className="w-[200px]"
                                >
                                    <SelectValue placeholder="Pilih Negara" />
                                </SelectTrigger>
                                <SelectContent id="negara">
                                    {countryData.map((c) => (
                                        <SelectItem
                                            value={c.CountryId}
                                            key={c.CountryId}
                                        >
                                            {c.Nama}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="provinsi" className="text-right">
                                Provinsi
                            </Label>
                            <Select
                                disabled={loading}
                                value={form.ProvinsiId}
                                onValueChange={(value) => {
                                    setForm({
                                        ...form,
                                        ProvinsiId: value,
                                        KecamatanId: '',
                                        DesaId: '',
                                        KabupatenId: '',
                                    })
                                    setKecamatanData([])
                                    setDesaData([])
                                    getKabupatenByProvinsiId(value).then(
                                        (res) => setKabupatenData(res)
                                    )
                                }}
                            >
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Pilih Provinsi" />
                                </SelectTrigger>
                                <SelectContent>
                                    {provinsiData.map((p) => (
                                        <SelectItem
                                            value={p.ProvinsiId}
                                            key={p.ProvinsiId}
                                        >
                                            {p.Nama}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="kabupaten" className="text-right">
                                Kabupaten
                            </Label>
                            <Select
                                disabled={loading}
                                value={form.KabupatenId}
                                onValueChange={(value) => {
                                    setForm({
                                        ...form,
                                        KecamatanId: '',
                                        DesaId: '',
                                        KabupatenId: value,
                                    })
                                    setDesaData([])
                                    getKecamatanByKabupatenId(value).then(
                                        (res) => setKecamatanData(res)
                                    )
                                }}
                            >
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Pilih Kabupaten" />
                                </SelectTrigger>
                                <SelectContent>
                                    {kabupatenData.map((p) => (
                                        <SelectItem
                                            value={p.KabupatenId}
                                            key={p.KabupatenId}
                                        >
                                            {p.Nama}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="kecamatan" className="text-right">
                                Kecamatan
                            </Label>
                            <Select
                                disabled={loading}
                                value={form.KecamatanId}
                                onValueChange={(value) => {
                                    setForm({
                                        ...form,
                                        KecamatanId: value,
                                        DesaId: '',
                                    })
                                    getDesaByKecamatanId(value).then((res) =>
                                        setDesaData(res)
                                    )
                                }}
                            >
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Pilih Kecamatan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {kecamatanData.map((p) => (
                                        <SelectItem
                                            value={p.KecamatanId}
                                            key={p.KecamatanId}
                                        >
                                            {p.Nama}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="desa" className="text-right">
                                Desa
                            </Label>
                            <Select
                                disabled={loading}
                                value={form.DesaId}
                                onValueChange={(value) =>
                                    setForm({ ...form, DesaId: value })
                                }
                            >
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Pilih Desa" />
                                </SelectTrigger>
                                <SelectContent>
                                    {desaData.map((p) => (
                                        <SelectItem
                                            value={p.DesaId}
                                            key={p.DesaId}
                                        >
                                            {p.Nama}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="alamat"
                                className="text-sm font-medium"
                            >
                                Alamat
                            </Label>
                            <Textarea
                                disabled={loading}
                                id="alamat"
                                className="w-[200px]"
                                value={form.Alamat}
                                onChange={(val) =>
                                    setForm({
                                        ...form,
                                        Alamat: val.target.value,
                                    })
                                }
                                placeholder="Alamat Anda."
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="kode_pos" className="text-right">
                                Kode Pos
                            </Label>
                            <Input
                                id="kode_pos"
                                disabled={loading}
                                value={form.KodePos}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        KodePos: e.target.value,
                                    })
                                }
                                className="col-span-3"
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        className="mx-2  hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer"
                        variant={'default'}
                        type="button"
                        onClick={() => submitEvent()}
                    >
                        <PenIcon />
                        Simpan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
