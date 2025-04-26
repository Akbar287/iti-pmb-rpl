'use client'
import { MahasiswaRiwayatPekerjaan, StatusPerkawinan } from '@/generated/prisma'
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
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table'
import { Button } from '../ui/button'
import {
    CalendarIcon,
    PenIcon,
    PlusCircle,
    TimerIcon,
    Trash2,
} from 'lucide-react'
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
import { Textarea } from '../ui/textarea'
import { cn, replaceItemAtIndex } from '@/lib/utils'
import { Skeleton } from '../ui/skeleton'
import { useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    MahasiswaRiwayatPekerjaanFormValidation,
    MahasiswaRiwayatPekerjaanSkemaValidation,
} from '@/validation/PekerjaanMahasiswaValidation'
import {
    deleteMahasiswaRiwayatPekerjaan,
    getMahasiswaRiwayatPekerjaanByPendaftaranId,
    setMahasiswaRiwayatPekerjaan,
    updateMahasiswaRiwayatPekerjaan,
} from '@/services/KelengkapanDokumen/RiwayatPekerjaanService'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { format } from 'date-fns'
import { Calendar } from '../ui/calendar'
import { Checkbox } from '../ui/checkbox'

const RiwayatPekerjaanMahasiswa = ({
    dataMahasiswa,
}: {
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
    const [data, setData] = React.useState<MahasiswaRiwayatPekerjaan[]>([])
    const [loading, setLoading] = React.useState<boolean>(false)
    const [loadingAwal, setLoadingAwal] = React.useState<boolean>(false)
    const [openDialog, setOpenDialog] = React.useState<boolean>(false)
    const [titleDialog, setTitleDialog] = React.useState<string>('')
    const [masihLatihan, setMasihLatihan] = React.useState(false)
    const form = useForm<MahasiswaRiwayatPekerjaanFormValidation>({
        resolver: zodResolver(MahasiswaRiwayatPekerjaanSkemaValidation),
        defaultValues: {
            MahasiswaRiwayatPekerjaanId: '',
            PendaftaranId: '',
            Nama: '',
            PosisiJabatan: '',
            Alamat: '',
            UraianTugas: '',
            MulaiBekerja: new Date(),
            SelesaiBekerja: new Date(),
        },
    })

    React.useEffect(() => {
        setLoadingAwal(true)
        getMahasiswaRiwayatPekerjaanByPendaftaranId(selectableMahasiswa)
            .then((res) => {
                setData(res)
                setLoadingAwal(false)
            })
            .catch((err) => {
                setLoadingAwal(false)
            })
    }, [selectableMahasiswa])

    const tambahData = () => {
        form.reset()
        setTitleDialog('Tambah Data Riwayat Pekerjaan')
        setOpenDialog(true)
    }

    const ubahData = (e: MahasiswaRiwayatPekerjaan) => {
        form.setValue(
            'MahasiswaRiwayatPekerjaanId',
            e.MahasiswaRiwayatPekerjaanId
        )
        form.setValue('PendaftaranId', e.PendaftaranId)
        form.setValue('Nama', e.Nama)
        form.setValue('PosisiJabatan', e.PosisiJabatan)
        form.setValue('Alamat', e.Alamat)
        form.setValue('UraianTugas', e.UraianTugas)
        form.setValue('MulaiBekerja', new Date(e.MulaiBekerja))
        form.setValue(
            'SelesaiBekerja',
            e.SelesaiBekerja === null ? undefined : new Date(e.SelesaiBekerja)
        )
        if (e.SelesaiBekerja === null) {
            setMasihLatihan(true)
        } else {
            setMasihLatihan(false)
        }
        setTitleDialog('Ubah Data Riwayat Pekerjaan')
        setOpenDialog(true)
    }

    const hapusData = (e: MahasiswaRiwayatPekerjaan) => {
        Swal.fire({
            title: 'Ingin Hapus ' + e.Nama + ' ?',
            text: 'Aksi ini tidak dapat di undo',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f45f24',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMahasiswaRiwayatPekerjaan(
                    e.MahasiswaRiwayatPekerjaanId
                ).then(() => {
                    setData(
                        data.filter(
                            (r) =>
                                r.MahasiswaRiwayatPekerjaanId !==
                                e.MahasiswaRiwayatPekerjaanId
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

    const onSubmit = async (
        dataSubmit: MahasiswaRiwayatPekerjaanFormValidation
    ) => {
        setLoading(true)
        if (titleDialog === 'Tambah Data Riwayat Pekerjaan') {
            setMahasiswaRiwayatPekerjaan({
                MahasiswaRiwayatPekerjaanId: '',
                PendaftaranId: selectableMahasiswa,
                Nama: dataSubmit.Nama,
                PosisiJabatan: dataSubmit.PosisiJabatan,
                Alamat: dataSubmit.Alamat ?? '',
                UraianTugas: dataSubmit.UraianTugas ?? '',
                MulaiBekerja: dataSubmit.MulaiBekerja,
                SelesaiBekerja: dataSubmit.SelesaiBekerja ?? null,
                CreatedAt: null,
                UpdatedAt: null,
            }).then((res) => {
                setData([...data, res])
                toast('Data Riwayat Organisasi Profesi Disimpan')
                setOpenDialog(false)
                form.reset()
                setLoading(false)
            })
        } else {
            updateMahasiswaRiwayatPekerjaan({
                MahasiswaRiwayatPekerjaanId:
                    dataSubmit.MahasiswaRiwayatPekerjaanId ?? '',
                PendaftaranId: selectableMahasiswa,
                Nama: dataSubmit.Nama,
                PosisiJabatan: dataSubmit.PosisiJabatan,
                Alamat: dataSubmit.Alamat ?? '',
                UraianTugas: dataSubmit.UraianTugas ?? '',
                MulaiBekerja: dataSubmit.MulaiBekerja,
                SelesaiBekerja: dataSubmit.SelesaiBekerja ?? null,
                CreatedAt: null,
                UpdatedAt: null,
            }).then((res) => {
                let idx = data.findIndex(
                    (r) =>
                        r.MahasiswaRiwayatPekerjaanId ==
                        dataSubmit.MahasiswaRiwayatPekerjaanId
                )
                setData(replaceItemAtIndex(data, idx, res))
                toast('Data Riwayat Organisasi Profesi Diubah')
                setLoading(false)
                form.reset()
                setOpenDialog(false)
            })
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <h1 className="text-2xl">Riwayat Pekerjaan</h1>
                </CardTitle>
                <CardDescription>
                    Tambahkan Riwayat Pekerjaan anda sebelum masuk ITI
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
                    {selectableMahasiswa ? (
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
                    <Skeleton className="w-full mt-2 h-56" />
                ) : (
                    <Table className="mt-5">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama</TableHead>
                                <TableHead>Posisi</TableHead>
                                <TableHead>Alamat</TableHead>
                                <TableHead>Uraian Tugas</TableHead>
                                <TableHead>Mulai Bekerja</TableHead>
                                <TableHead>Selesai Bekerja</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7}>
                                        Tidak Ada Data
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((row) => (
                                    <TableRow
                                        key={row.MahasiswaRiwayatPekerjaanId}
                                    >
                                        <TableCell>{row.Nama}</TableCell>
                                        <TableCell>
                                            {row.PosisiJabatan}
                                        </TableCell>
                                        <TableCell>{row.Alamat}</TableCell>
                                        <TableCell>{row.UraianTugas}</TableCell>
                                        <TableCell>
                                            {row.MulaiBekerja === null
                                                ? 'N/A'
                                                : new Date(
                                                      row.MulaiBekerja
                                                  ).toLocaleDateString(
                                                      'id-ID',
                                                      {
                                                          day: '2-digit',
                                                          month: 'long',
                                                          year: 'numeric',
                                                      }
                                                  )}
                                        </TableCell>
                                        <TableCell>
                                            {row.SelesaiBekerja === null
                                                ? 'N/A'
                                                : new Date(
                                                      row.SelesaiBekerja
                                                  ).toLocaleDateString(
                                                      'id-ID',
                                                      {
                                                          day: '2-digit',
                                                          month: 'long',
                                                          year: 'numeric',
                                                      }
                                                  )}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                className="mx-2  hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer "
                                                type="button"
                                                onClick={() => ubahData(row)}
                                            >
                                                <PenIcon />
                                                Ubah
                                            </Button>
                                            <Button
                                                className="mx-2  hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer "
                                                variant={'destructive'}
                                                type="button"
                                                onClick={() => hapusData(row)}
                                            >
                                                <Trash2 />
                                                Hapus
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                )}
                <DialogRiwayatPekerjaanMahasiswa
                    openDialog={openDialog}
                    onSubmit={onSubmit}
                    setOpenDialog={setOpenDialog}
                    title={titleDialog}
                    form={form}
                    loading={loading}
                    masihLatihan={masihLatihan}
                    setMasihLatihan={setMasihLatihan}
                />
            </CardContent>
        </Card>
    )
}

export default RiwayatPekerjaanMahasiswa

function DialogRiwayatPekerjaanMahasiswa({
    openDialog,
    onSubmit,
    setOpenDialog,
    title,
    form,
    loading,
    masihLatihan,
    setMasihLatihan,
}: {
    onSubmit: (dataSubmit: MahasiswaRiwayatPekerjaanFormValidation) => void
    openDialog: boolean
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
    title: string
    loading: boolean
    form: UseFormReturn<MahasiswaRiwayatPekerjaanFormValidation>
    masihLatihan: boolean
    setMasihLatihan: React.Dispatch<React.SetStateAction<boolean>>
}) {
    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className="w-full max-h-[80vh]  overflow-y-scroll">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle>{title}</DialogTitle>
                            <DialogDescription>
                                Catat Data Pelatihan Profesional Sebelumnya
                            </DialogDescription>
                        </DialogHeader>
                        <div className="w-full justify-center md:justify-between">
                            <div className="grid grid-cols-1 gap-4 py-4">
                                <FormField
                                    control={form.control}
                                    name="Nama"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nama</FormLabel>
                                            <FormControl>
                                                <Input
                                                    readOnly={loading}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Nama Tempat Bekerja Anda
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="PosisiJabatan"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Posisi atau Jabatan
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    readOnly={loading}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Posisi jabatan anda
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
                                            <FormLabel>Alamat</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    disabled={loading}
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    placeholder="Alamat Tempat Anda Bekerja Anda."
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Masukan Alamat Tempat Anda
                                                Bekerja
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="UraianTugas"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Uraian Tugas</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    disabled={loading}
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    placeholder="Uraian Tugas di tempat kerja Anda."
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Masukan Uraian Tugas di tempat
                                                kerja Anda Bekerja
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="MulaiBekerja"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mulai Bekerja</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={'outline'}
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
                                                            field.value ??
                                                            undefined
                                                        }
                                                        onSelect={
                                                            field.onChange
                                                        }
                                                        disabled={(date) =>
                                                            date > new Date() ||
                                                            date <
                                                                new Date(
                                                                    '1900-01-01'
                                                                )
                                                        }
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormDescription>
                                                Mulai Bekerja Anda
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="SelesaiBekerja"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Selesai Bekerja
                                            </FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={'outline'}
                                                            className={cn(
                                                                'w-[240px] pl-3 text-left font-normal',
                                                                !field.value &&
                                                                    'text-muted-foreground'
                                                            )}
                                                            disabled={
                                                                loading ||
                                                                masihLatihan
                                                            }
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
                                                            field.value ??
                                                            undefined
                                                        }
                                                        onSelect={
                                                            field.onChange
                                                        }
                                                        disabled={(date) =>
                                                            date > new Date() ||
                                                            date <
                                                                new Date(
                                                                    '1900-01-01'
                                                                )
                                                        }
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormDescription>
                                                Selesai Bekerja Anda
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="items-top flex space-x-2">
                                    <Checkbox
                                        id="masih_latihan"
                                        checked={masihLatihan}
                                        onCheckedChange={(checked) => {
                                            setMasihLatihan(checked === true)
                                            if (checked === true) {
                                                form.setValue(
                                                    'SelesaiBekerja',
                                                    undefined
                                                )
                                            } else {
                                                form.setValue(
                                                    'SelesaiBekerja',
                                                    new Date()
                                                )
                                            }
                                        }}
                                    />
                                    <div className="grid gap-1.5 leading-none">
                                        <label
                                            htmlFor="masih_latihan"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Saya Masih Ikut Pelatihan
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                className="mx-2  hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer"
                                variant={'default'}
                                disabled={loading}
                                type="submit"
                            >
                                {loading ? (
                                    <>
                                        <TimerIcon />
                                        Loading
                                    </>
                                ) : (
                                    <>
                                        <PenIcon />
                                        Simpan
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
