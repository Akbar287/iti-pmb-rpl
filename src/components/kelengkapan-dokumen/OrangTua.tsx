'use client'
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { NumericFormat } from 'react-number-format'
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
    JenisOrtu,
    OrangTua as OrangTuaType,
    StatusPerkawinan,
} from '@/generated/prisma'
import { Button } from '../ui/button'
import { PenIcon, PlusCircle, TimerIcon, Trash2 } from 'lucide-react'
import Swal from 'sweetalert2'
import { toast } from 'sonner'
import { replaceItemAtIndex } from '@/lib/utils'
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
    OrangTuaFormValidation,
    OrangTuaSkemaValidation,
} from '@/validation/OrangTuaValidation'
import {
    deleteOrangTua,
    getOrangTuaByPendaftaranId,
    setOrangTua,
    updateOrangTua,
} from '@/services/KelengkapanDokumen/OrangTuaService'

const OrangTua = ({
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
    const [data, setData] = React.useState<OrangTuaType[]>([])
    const [loading, setLoading] = React.useState<boolean>(false)
    const [loadingAwal, setLoadingAwal] = React.useState<boolean>(false)
    const [openDialog, setOpenDialog] = React.useState<boolean>(false)
    const [titleDialog, setTitleDialog] = React.useState<string>('')
    const form = useForm<OrangTuaFormValidation>({
        resolver: zodResolver(OrangTuaSkemaValidation),
        defaultValues: {
            PendaftaranId: '',
            Nama: '',
            Pekerjaan: '',
            JenisOrtu: JenisOrtu.AYAH,
            Penghasilan: '',
            Email: '',
            NomorHp: '',
        },
    })

    React.useEffect(() => {
        setLoadingAwal(true)
        getOrangTuaByPendaftaranId(selectableMahasiswa)
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
        setTitleDialog('Tambah Data Orang Tua')
        setOpenDialog(true)
    }

    const ubahData = (e: OrangTuaType) => {
        form.setValue('Nama', e.Nama)
        form.setValue('PendaftaranId', e.PendaftaranId)
        form.setValue('OrangTuaId', e.OrangTuaId)
        form.setValue('Email', e.Email)
        form.setValue('JenisOrtu', e.JenisOrtu)
        form.setValue('NomorHp', e.NomorHp)
        form.setValue('Pekerjaan', e.Pekerjaan || '')
        form.setValue('Penghasilan', String(e.Penghasilan))
        setTitleDialog('Ubah Data Orang Tua')
        setOpenDialog(true)
    }

    const hapusData = (e: OrangTuaType) => {
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
                deleteOrangTua(e.OrangTuaId).then(() => {
                    setData(data.filter((r) => r.OrangTuaId !== e.OrangTuaId))
                    Swal.fire({
                        title: 'Terhapus!',
                        text: 'Data sudah dihapus.',
                        icon: 'success',
                    })
                })
            }
        })
    }

    const onSubmit = async (dataSubmit: OrangTuaFormValidation) => {
        setLoading(true)
        if (titleDialog === 'Tambah Data Orang Tua') {
            setOrangTua({
                PendaftaranId: selectableMahasiswa,
                OrangTuaId: '',
                Nama: dataSubmit.Nama,
                Pekerjaan:
                    dataSubmit.Pekerjaan === undefined
                        ? null
                        : dataSubmit.Pekerjaan,
                JenisOrtu: dataSubmit.JenisOrtu as JenisOrtu,
                NomorHp: dataSubmit.NomorHp,
                Penghasilan: Number(dataSubmit.Penghasilan),
                Email: dataSubmit.Email,
                CreatedAt: null,
                UpdatedAt: null,
            }).then((res) => {
                setData([...data, res])
                toast('Data Orang Tua Disimpan')
                setOpenDialog(false)
                form.reset()
                setLoading(false)
            })
        } else {
            updateOrangTua({
                PendaftaranId: selectableMahasiswa,
                OrangTuaId: dataSubmit.OrangTuaId ?? '',
                Nama: dataSubmit.Nama,
                Pekerjaan:
                    dataSubmit.Pekerjaan === undefined
                        ? null
                        : dataSubmit.Pekerjaan,
                JenisOrtu: dataSubmit.JenisOrtu as JenisOrtu,
                NomorHp: dataSubmit.NomorHp,
                Penghasilan: Number(dataSubmit.Penghasilan),
                Email: dataSubmit.Email,
                CreatedAt: null,
                UpdatedAt: null,
            }).then((res) => {
                let idx = data.findIndex(
                    (r) => r.OrangTuaId == dataSubmit.OrangTuaId
                )
                setData(replaceItemAtIndex(data, idx, res))
                toast('Data Orang Tua Diubah')
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
                    <h1 className="text-2xl">Orang Tua Mahasiswa</h1>
                </CardTitle>
                <CardDescription>Catat Orang Tua Anda</CardDescription>
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
                                <TableHead>Nama</TableHead>
                                <TableHead>Jenis Ortu</TableHead>
                                <TableHead>Pekerjaan</TableHead>
                                <TableHead>Penghasilan</TableHead>
                                <TableHead>Nomor HP</TableHead>
                                <TableHead>Email</TableHead>
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
                                    <TableRow key={row.OrangTuaId}>
                                        <TableCell>{row.Nama}</TableCell>
                                        <TableCell>{row.JenisOrtu}</TableCell>
                                        <TableCell>{row.Pekerjaan}</TableCell>
                                        <TableCell>{row.Penghasilan}</TableCell>
                                        <TableCell>{row.NomorHp}</TableCell>
                                        <TableCell>{row.Email}</TableCell>
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
            <DialogOrangTua
                openDialog={openDialog}
                onSubmit={onSubmit}
                setOpenDialog={setOpenDialog}
                title={titleDialog}
                form={form}
                loading={loading}
            />
        </Card>
    )
}

export default OrangTua

function DialogOrangTua({
    openDialog,
    onSubmit,
    setOpenDialog,
    title,
    form,
    loading,
}: {
    onSubmit: (dataSubmit: OrangTuaFormValidation) => void
    openDialog: boolean
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
    title: string
    loading: boolean
    form: UseFormReturn<OrangTuaFormValidation>
}) {
    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className="w-full max-h-[80vh]  overflow-y-scroll">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle>{title}</DialogTitle>
                            <DialogDescription>
                                Catat Data Organisasi Profesi Sebelumnya
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
                                                Nama Orang Tua Anda
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="JenisOrtu"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Jenis Orang Tua{' '}
                                            </FormLabel>
                                            <FormControl>
                                                <Select
                                                    disabled={loading}
                                                    value={field.value ?? ''}
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Pilih Jenis Orang Tua" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>
                                                                Orang Tua
                                                            </SelectLabel>
                                                            <SelectItem
                                                                value={
                                                                    JenisOrtu.AYAH
                                                                }
                                                            >
                                                                AYAH
                                                            </SelectItem>
                                                            <SelectItem
                                                                value={
                                                                    JenisOrtu.IBU
                                                                }
                                                            >
                                                                IBU
                                                            </SelectItem>
                                                            <SelectItem
                                                                value={
                                                                    JenisOrtu.KAKEK
                                                                }
                                                            >
                                                                KAKEK
                                                            </SelectItem>
                                                            <SelectItem
                                                                value={
                                                                    JenisOrtu.NENEK
                                                                }
                                                            >
                                                                NENEK
                                                            </SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormDescription>
                                                Jenis Orang Tua ?
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="Pekerjaan"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Pekerjaan</FormLabel>
                                            <FormControl>
                                                <Input
                                                    readOnly={loading}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Pekerjaan Orang Tua Anda
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="Penghasilan"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Penghasilan</FormLabel>
                                            <FormControl>
                                                <NumericFormat
                                                    thousandSeparator=","
                                                    decimalSeparator="."
                                                    decimalScale={2}
                                                    fixedDecimalScale
                                                    allowNegative={false}
                                                    prefix="Rp "
                                                    className="input col-span-3 w-full rounded-md border px-3 py-2 text-sm shadow-sm"
                                                    value={field.value}
                                                    onValueChange={(values) => {
                                                        form.setValue(
                                                            'Penghasilan',
                                                            String(
                                                                values.floatValue ??
                                                                    0
                                                            )
                                                        )
                                                    }}
                                                    disabled={loading}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Penghasilan Orang Tua Anda
                                                (contoh: Rp 1,000.00)
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="Email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    readOnly={loading}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Email Orang Tua Anda
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="NomorHp"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nomor HP</FormLabel>
                                            <FormControl>
                                                <Input
                                                    readOnly={loading}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Nomor HP Orang Tua Anda
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
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
