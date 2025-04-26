'use client'
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
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
    MahasiswaPelatihanProfessional,
    StatusPerkawinan,
} from '@/generated/prisma'
import { Button } from '../ui/button'
import {
    CalendarIcon,
    PenIcon,
    PlusCircle,
    TimerIcon,
    Trash2,
} from 'lucide-react'
import Swal from 'sweetalert2'
import { toast } from 'sonner'
import { cn, replaceItemAtIndex } from '@/lib/utils'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog'
import { Input } from '../ui/input'
import { useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table'
import { Skeleton } from '../ui/skeleton'
import {
    deleteMahasiswaPelatihanProfessional,
    getMahasiswaPelatihanProfessionalByPendaftaranId,
    setMahasiswaPelatihanProfessional,
    updateMahasiswaPelatihanProfessional,
} from '@/services/KelengkapanDokumen/PelatihanProfesionalService'
import {
    PelatihanProfesionalFormValidation,
    PelatihanProfesionalSkemaValidation,
} from '@/validation/PelatihanProfesionalValidation'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { format } from 'date-fns'
import { Calendar } from '../ui/calendar'
import { Checkbox } from '../ui/checkbox'

const PelatihanProfesional = ({
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
    const [data, setData] = React.useState<MahasiswaPelatihanProfessional[]>([])
    const [loading, setLoading] = React.useState<boolean>(false)
    const [loadingAwal, setLoadingAwal] = React.useState<boolean>(false)
    const [openDialog, setOpenDialog] = React.useState<boolean>(false)
    const [titleDialog, setTitleDialog] = React.useState<string>('')
    const form = useForm<PelatihanProfesionalFormValidation>({
        resolver: zodResolver(PelatihanProfesionalSkemaValidation),
        defaultValues: {
            MahasiswaPelatihanProfessionalId: '',
            PendaftaranId: '',
            NamaPelatihan: '',
            Penyelenggara: '',
            Mulai: new Date(),
            Selesai: new Date(),
        },
    })

    const [masihLatihan, setMasihLatihan] = React.useState(false)

    React.useEffect(() => {
        setLoadingAwal(true)
        getMahasiswaPelatihanProfessionalByPendaftaranId(selectableMahasiswa)
            .then((res) => {
                setData(res)
                setLoadingAwal(false)
            })
            .catch((res) => {
                setLoadingAwal(false)
            })
    }, [selectableMahasiswa])

    const tambahData = () => {
        form.reset()
        setMasihLatihan(false)
        form.setValue('PendaftaranId', selectableMahasiswa)
        setTitleDialog('Tambah Data Pelatihan Professional')
        form.setValue('MahasiswaPelatihanProfessionalId', undefined)
        setOpenDialog(true)
    }

    const ubahData = (e: MahasiswaPelatihanProfessional) => {
        form.setValue(
            'MahasiswaPelatihanProfessionalId',
            e.MahasiswaPelatihanProfessionalId
        )
        setMasihLatihan(e.Selesai === null ? true : false)
        form.setValue('PendaftaranId', e.PendaftaranId)
        form.setValue('NamaPelatihan', e.NamaPelatihan)
        form.setValue('Penyelenggara', e.Penyelenggara)
        form.setValue('Mulai', new Date(e.Mulai))
        form.setValue(
            'Selesai',
            e.Selesai === null ? undefined : new Date(e.Selesai)
        )
        if (e.Selesai === null) {
            setMasihLatihan(true)
        } else {
            setMasihLatihan(false)
        }
        setTitleDialog('Ubah Data Pelatihan Professional')
        setOpenDialog(true)
    }

    const hapusData = (e: MahasiswaPelatihanProfessional) => {
        Swal.fire({
            title: 'Ingin Hapus ' + e.NamaPelatihan + ' ?',
            text: 'Aksi ini tidak dapat di undo',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f45f24',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMahasiswaPelatihanProfessional(
                    e.MahasiswaPelatihanProfessionalId
                ).then(() => {
                    setData(
                        data.filter(
                            (r) =>
                                r.MahasiswaPelatihanProfessionalId !==
                                e.MahasiswaPelatihanProfessionalId
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

    const onSubmit = async (dataSubmit: PelatihanProfesionalFormValidation) => {
        setLoading(true)
        if (titleDialog === 'Tambah Data Pelatihan Professional') {
            setMahasiswaPelatihanProfessional({
                PendaftaranId: selectableMahasiswa,
                MahasiswaPelatihanProfessionalId:
                    dataSubmit.MahasiswaPelatihanProfessionalId ?? '',
                NamaPelatihan: dataSubmit.NamaPelatihan,
                Penyelenggara: dataSubmit.Penyelenggara,
                Mulai: dataSubmit.Mulai,
                Selesai: masihLatihan ? null : dataSubmit.Selesai ?? null,
                CreatedAt: null,
                UpdatedAt: null,
            }).then((res) => {
                setData([...data, res])
                toast('Data Pelatihan Professional Disimpan')
                setOpenDialog(false)
                form.reset()
                setLoading(false)
            })
        } else {
            updateMahasiswaPelatihanProfessional({
                PendaftaranId: selectableMahasiswa,
                MahasiswaPelatihanProfessionalId:
                    dataSubmit.MahasiswaPelatihanProfessionalId ?? '',
                NamaPelatihan: dataSubmit.NamaPelatihan,
                Penyelenggara: dataSubmit.Penyelenggara,
                Mulai: dataSubmit.Mulai,
                Selesai: masihLatihan ? null : dataSubmit.Selesai ?? null,
                CreatedAt: null,
                UpdatedAt: null,
            }).then((res) => {
                let idx = data.findIndex(
                    (r) =>
                        r.MahasiswaPelatihanProfessionalId ==
                        dataSubmit.MahasiswaPelatihanProfessionalId
                )
                setData(replaceItemAtIndex(data, idx, res))
                toast('Data Pelatihan Professional Diubah')
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
                    <h1 className="text-2xl">
                        Mahasiswa Pelatihan Professional
                    </h1>
                </CardTitle>
                <CardDescription>
                    Catat Pelatihan Professional Anda
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
                    {selectableMahasiswa && (
                        <Button
                            className="mt-8 hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer "
                            type="button"
                            onClick={() => tambahData()}
                        >
                            <PlusCircle />
                            Buat Data Baru
                        </Button>
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
                                <TableHead>NamaPelatihan</TableHead>
                                <TableHead>Penyelenggara Ortu</TableHead>
                                <TableHead>Mulai</TableHead>
                                <TableHead>Selesai</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        Tidak Ada Data
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((row) => (
                                    <TableRow
                                        key={
                                            row.MahasiswaPelatihanProfessionalId
                                        }
                                    >
                                        <TableCell>
                                            {row.NamaPelatihan}
                                        </TableCell>
                                        <TableCell>
                                            {row.Penyelenggara}
                                        </TableCell>
                                        <TableCell>
                                            {row.Mulai === null
                                                ? 'N/A'
                                                : new Date(
                                                      row.Mulai
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
                                            {row.Selesai === null
                                                ? 'N/A'
                                                : new Date(
                                                      row.Selesai
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
            </CardContent>
            <DialogPelatihanProfesional
                openDialog={openDialog}
                onSubmit={onSubmit}
                setOpenDialog={setOpenDialog}
                title={titleDialog}
                form={form}
                loading={loading}
                masihLatihan={masihLatihan}
                setMasihLatihan={setMasihLatihan}
            />
        </Card>
    )
}

export default PelatihanProfesional

function DialogPelatihanProfesional({
    openDialog,
    onSubmit,
    setOpenDialog,
    title,
    form,
    loading,
    masihLatihan,
    setMasihLatihan,
}: {
    onSubmit: (dataSubmit: PelatihanProfesionalFormValidation) => void
    openDialog: boolean
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
    title: string
    loading: boolean
    form: UseFormReturn<PelatihanProfesionalFormValidation>
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
                                    name="NamaPelatihan"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Nama Pelatihan
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    readOnly={loading}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Nama Pelatihan Anda
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="Penyelenggara"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Penyelenggara</FormLabel>
                                            <FormControl>
                                                <Input
                                                    readOnly={loading}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Penyelenggara
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="Mulai"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Mulai Pelatihan
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
                                                        selected={field.value}
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
                                                Mulai Pelatihan Anda
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="Selesai"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Selesai Pelatihan
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
                                                        selected={field.value}
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
                                                Selesai Pelatihan Anda
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
                                            form.setValue('Selesai', undefined)
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
