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
import { MahasiswaPiagam, StatusPerkawinan } from '@/generated/prisma'
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
    KejuaraanPiagamFormValidation,
    KejuaraanPiagamSkemaValidation,
} from '@/validation/KejuaraanPiagamValidation'
import {
    deleteMahasiswaPiagam,
    getMahasiswaPiagamByPendaftaranId,
    setMahasiswaPiagam,
    updateMahasiswaPiagam,
} from '@/services/KelengkapanDokumen/KejuaraanPiagamService'

const KejuaraanPiagam = ({
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
    const [data, setData] = React.useState<MahasiswaPiagam[]>([])
    const [loading, setLoading] = React.useState<boolean>(false)
    const [loadingAwal, setLoadingAwal] = React.useState<boolean>(false)
    const [openDialog, setOpenDialog] = React.useState<boolean>(false)
    const [titleDialog, setTitleDialog] = React.useState<string>('')
    const form = useForm<KejuaraanPiagamFormValidation>({
        resolver: zodResolver(KejuaraanPiagamSkemaValidation),
        defaultValues: {
            MahasiswaPiagamId: undefined,
            PendaftaranId: '',
            Tahun: 2000,
            BentukPenghargaan: '',
            PemberiPenghargaan: '',
        },
    })

    React.useEffect(() => {
        setLoadingAwal(true)
        getMahasiswaPiagamByPendaftaranId(selectableMahasiswa)
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
        form.setValue('MahasiswaPiagamId', undefined)
        form.setValue('PendaftaranId', selectableMahasiswa)
        setTitleDialog('Tambah Data Piagam')
        setOpenDialog(true)
    }

    const ubahData = (e: MahasiswaPiagam) => {
        form.setValue('MahasiswaPiagamId', e.MahasiswaPiagamId)
        form.setValue('PendaftaranId', e.PendaftaranId)
        form.setValue('BentukPenghargaan', e.BentukPenghargaan)
        form.setValue('Tahun', e.Tahun)
        form.setValue('PemberiPenghargaan', e.PemberiPenghargaan)
        setTitleDialog('Ubah Data Piagam')
        setOpenDialog(true)
    }

    const hapusData = (e: MahasiswaPiagam) => {
        Swal.fire({
            title: 'Ingin Hapus ' + e.BentukPenghargaan + ' ?',
            text: 'Aksi ini tidak dapat di undo',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f45f24',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMahasiswaPiagam(e.MahasiswaPiagamId).then(() => {
                    setData(
                        data.filter(
                            (r) => r.MahasiswaPiagamId !== e.MahasiswaPiagamId
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

    const onSubmit = async (dataSubmit: KejuaraanPiagamFormValidation) => {
        setLoading(true)
        if (titleDialog === 'Tambah Data Piagam') {
            setMahasiswaPiagam({
                MahasiswaPiagamId: '',
                PendaftaranId: selectableMahasiswa,
                Tahun: dataSubmit.Tahun,
                BentukPenghargaan: dataSubmit.BentukPenghargaan,
                PemberiPenghargaan: dataSubmit.PemberiPenghargaan,
                CreatedAt: null,
                UpdatedAt: null,
            }).then((res) => {
                setData([...data, res])
                toast('Data Piagam Disimpan')
                setOpenDialog(false)
                form.reset()
                setLoading(false)
            })
        } else {
            updateMahasiswaPiagam({
                MahasiswaPiagamId: dataSubmit.MahasiswaPiagamId || '',
                PendaftaranId: selectableMahasiswa,
                BentukPenghargaan: dataSubmit.BentukPenghargaan,
                Tahun: dataSubmit.Tahun,
                PemberiPenghargaan: dataSubmit.PemberiPenghargaan,
                CreatedAt: null,
                UpdatedAt: null,
            }).then((res) => {
                let idx = data.findIndex(
                    (r) => r.MahasiswaPiagamId == dataSubmit.MahasiswaPiagamId
                )
                setData(replaceItemAtIndex(data, idx, res))
                toast('Data Piagam Diubah')
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
                    <h1 className="text-2xl">Piagam</h1>
                </CardTitle>
                <CardDescription>Catat Piagam Anda</CardDescription>
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
                                <TableHead>Bentuk Penghargaan</TableHead>
                                <TableHead>Pemberi Penghargaan</TableHead>
                                <TableHead>Tahun</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4}>
                                        Tidak Ada Data
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((row) => (
                                    <TableRow key={row.MahasiswaPiagamId}>
                                        <TableCell>
                                            {row.BentukPenghargaan}
                                        </TableCell>
                                        <TableCell>
                                            {row.PemberiPenghargaan}
                                        </TableCell>
                                        <TableCell>{row.Tahun}</TableCell>
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
            <DialogKejuaraanPiagam
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

export default KejuaraanPiagam

function DialogKejuaraanPiagam({
    openDialog,
    onSubmit,
    setOpenDialog,
    title,
    form,
    loading,
}: {
    onSubmit: (dataSubmit: KejuaraanPiagamFormValidation) => void
    openDialog: boolean
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
    title: string
    loading: boolean
    form: UseFormReturn<KejuaraanPiagamFormValidation>
}) {
    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className="w-full max-h-[80vh]  overflow-y-scroll">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle>{title}</DialogTitle>
                            <DialogDescription>
                                Catat Data Piagam
                            </DialogDescription>
                        </DialogHeader>
                        <div className="w-full justify-center md:justify-between">
                            <div className="grid grid-cols-1 gap-4 py-4">
                                <FormField
                                    control={form.control}
                                    name="BentukPenghargaan"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Bentuk Penghargaan
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    readOnly={loading}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Bentuk Penghargaan Anda Berupa
                                                Piagam, Sertifikat atau Lainnya
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="PemberiPenghargaan"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Pemberi Penghargaan
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    readOnly={loading}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Pemberi Penghargaan Piagam Anda
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
                                                Tahun Pemberian Piagam Anda.
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
