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
    MahasiswaKonferensi,
    StatusKeikutsertaan,
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
    KonferensiFormValidation,
    KonferensiSkemaValidation,
} from '@/validation/KonferensiValidation'
import {
    deleteMahasiswaKonferensi,
    getMahasiswaKonferensiByPendaftaranId,
    setMahasiswaKonferensi,
    updateMahasiswaKonferensi,
} from '@/services/KelengkapanDokumen/KonferensiSeminarService'

const Konferensi = ({
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
    const [data, setData] = React.useState<MahasiswaKonferensi[]>([])
    const [loading, setLoading] = React.useState<boolean>(false)
    const [loadingAwal, setLoadingAwal] = React.useState<boolean>(false)
    const [openDialog, setOpenDialog] = React.useState<boolean>(false)
    const [titleDialog, setTitleDialog] = React.useState<string>('')
    const form = useForm<KonferensiFormValidation>({
        resolver: zodResolver(KonferensiSkemaValidation),
        defaultValues: {
            MahasiswaKonferensiId: '',
            PendaftaranId: '',
            Tahun: 2000,
            JudulSeminar: '',
            Penyelenggara: '',
            StatusKeikutsertaan: undefined,
        },
    })

    React.useEffect(() => {
        setLoadingAwal(true)
        getMahasiswaKonferensiByPendaftaranId(selectableMahasiswa)
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
        form.setValue('MahasiswaKonferensiId', undefined)
        form.setValue('PendaftaranId', selectableMahasiswa)
        setTitleDialog('Tambah Data Konferensi')
        setOpenDialog(true)
    }

    const ubahData = (e: MahasiswaKonferensi) => {
        form.setValue('MahasiswaKonferensiId', e.MahasiswaKonferensiId)
        form.setValue('PendaftaranId', e.PendaftaranId)
        form.setValue('Tahun', e.Tahun)
        form.setValue('JudulSeminar', e.JudulSeminar)
        form.setValue('Penyelenggara', e.Penyelenggara)
        form.setValue('StatusKeikutsertaan', e.StatusKeikutsertaan)
        setTitleDialog('Ubah Data Konferensi')
        setOpenDialog(true)
    }

    const hapusData = (e: MahasiswaKonferensi) => {
        Swal.fire({
            title: 'Ingin Hapus ' + e.JudulSeminar + ' ?',
            text: 'Aksi ini tidak dapat di undo',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f45f24',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMahasiswaKonferensi(e.MahasiswaKonferensiId).then(() => {
                    setData(
                        data.filter(
                            (r) =>
                                r.MahasiswaKonferensiId !==
                                e.MahasiswaKonferensiId
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

    const onSubmit = async (dataSubmit: KonferensiFormValidation) => {
        setLoading(true)
        if (titleDialog === 'Tambah Data Konferensi') {
            setMahasiswaKonferensi({
                MahasiswaKonferensiId: dataSubmit.MahasiswaKonferensiId ?? '',
                PendaftaranId: dataSubmit.PendaftaranId,
                Tahun: dataSubmit.Tahun,
                JudulSeminar: dataSubmit.JudulSeminar,
                Penyelenggara: dataSubmit.Penyelenggara,
                StatusKeikutsertaan:
                    dataSubmit.StatusKeikutsertaan ?? 'Peserta',
                CreatedAt: null,
                UpdatedAt: null,
            }).then((res) => {
                setData([...data, res])
                toast('Data Konferensi Disimpan')
                setOpenDialog(false)
                form.reset()
                setLoading(false)
            })
        } else {
            updateMahasiswaKonferensi({
                PendaftaranId: selectableMahasiswa,
                MahasiswaKonferensiId: dataSubmit.MahasiswaKonferensiId ?? '',
                Tahun: dataSubmit.Tahun,
                JudulSeminar: dataSubmit.JudulSeminar,
                Penyelenggara: dataSubmit.Penyelenggara,
                StatusKeikutsertaan:
                    dataSubmit.StatusKeikutsertaan ?? 'Peserta',
                CreatedAt: null,
                UpdatedAt: null,
            }).then((res) => {
                let idx = data.findIndex(
                    (r) =>
                        r.MahasiswaKonferensiId ==
                        dataSubmit.MahasiswaKonferensiId
                )
                setData(replaceItemAtIndex(data, idx, res))
                toast('Data Konferensi Diubah')
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
                    <h1 className="text-2xl">Konferensi</h1>
                </CardTitle>
                <CardDescription>Catat Konferensi Anda</CardDescription>
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
                                <TableHead>Tahun</TableHead>
                                <TableHead>Judul Seminar</TableHead>
                                <TableHead>Penyelenggara</TableHead>
                                <TableHead>Status Keikutsertaan</TableHead>
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
                                    <TableRow key={row.MahasiswaKonferensiId}>
                                        <TableCell>{row.Tahun}</TableCell>
                                        <TableCell>
                                            {row.JudulSeminar}
                                        </TableCell>
                                        <TableCell>
                                            {row.Penyelenggara}
                                        </TableCell>
                                        <TableCell>
                                            {row.StatusKeikutsertaan}
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

export default Konferensi

function DialogOrangTua({
    openDialog,
    onSubmit,
    setOpenDialog,
    title,
    form,
    loading,
}: {
    onSubmit: (dataSubmit: KonferensiFormValidation) => void
    openDialog: boolean
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
    title: string
    loading: boolean
    form: UseFormReturn<KonferensiFormValidation>
}) {
    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className="w-full max-h-[80vh]  overflow-y-scroll">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle>{title}</DialogTitle>
                            <DialogDescription>
                                Catat Data Konferensi
                            </DialogDescription>
                        </DialogHeader>
                        <div className="w-full justify-center md:justify-between">
                            <div className="grid grid-cols-1 gap-4 py-4">
                                <FormField
                                    control={form.control}
                                    name="JudulSeminar"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Judul Seminar</FormLabel>
                                            <FormControl>
                                                <Input
                                                    readOnly={loading}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Judul Seminar Anda
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="StatusKeikutsertaan"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Status Keikutsertaan
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
                                                        <SelectValue placeholder="Pilih Status Keikutsertaan" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>
                                                                Status
                                                                Keikutsertaan
                                                            </SelectLabel>
                                                            <SelectItem
                                                                value={
                                                                    StatusKeikutsertaan.Panitia
                                                                }
                                                            >
                                                                Panitia
                                                            </SelectItem>
                                                            <SelectItem
                                                                value={
                                                                    StatusKeikutsertaan.Pembicara
                                                                }
                                                            >
                                                                Pembicara
                                                            </SelectItem>
                                                            <SelectItem
                                                                value={
                                                                    StatusKeikutsertaan.Peserta
                                                                }
                                                            >
                                                                Peserta
                                                            </SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormDescription>
                                                Status Keikutsertaan
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
                                                Penyelenggara Seminar Anda
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="Tahun"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tahun</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Contoh: 2023"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Tahun seminar atau konferensi
                                                Anda.
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
