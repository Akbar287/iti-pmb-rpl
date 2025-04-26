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
import { Pesantren, StatusPerkawinan } from '@/generated/prisma'
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
    PesantrenFormValidation,
    PesantrenSkemaValidation,
} from '@/validation/PesantrenValidation'
import {
    deletePesantren,
    getPesantrenByPendaftaranId,
    setPesantren,
    updatePesantren,
} from '@/services/KelengkapanDokumen/Pesantren'

const PesantrenComponent = ({
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
    const [data, setData] = React.useState<Pesantren[]>([])
    const [loading, setLoading] = React.useState<boolean>(false)
    const [loadingAwal, setLoadingAwal] = React.useState<boolean>(false)
    const [openDialog, setOpenDialog] = React.useState<boolean>(false)
    const [titleDialog, setTitleDialog] = React.useState<string>('')
    const form = useForm<PesantrenFormValidation>({
        resolver: zodResolver(PesantrenSkemaValidation),
        defaultValues: {
            PendaftaranId: selectableMahasiswa,
            PesantrenId: undefined,
            NamaPesantren: '',
            LamaPesantren: '',
        },
    })

    React.useEffect(() => {
        setLoadingAwal(true)
        getPesantrenByPendaftaranId(selectableMahasiswa).then((res) => {
            setData(res)
            setLoadingAwal(false)
        })
        setLoadingAwal(false)
    }, [selectableMahasiswa])

    const tambahData = () => {
        form.reset()
        setTitleDialog('Tambah Data Pesantren')
        setOpenDialog(true)
    }

    const ubahData = (e: Pesantren) => {
        form.setValue('PendaftaranId', e.PendaftaranId)
        form.setValue('PesantrenId', e.PesantrenId)
        form.setValue('NamaPesantren', e.NamaPesantren)
        form.setValue('LamaPesantren', e.LamaPesantren)
        setTitleDialog('Ubah Data Pesantren')
        setOpenDialog(true)
    }

    const hapusData = (e: Pesantren) => {
        Swal.fire({
            title: 'Ingin Hapus ' + e.NamaPesantren + ' ?',
            text: 'Aksi ini tidak dapat di undo',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f45f24',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!',
        }).then((result) => {
            if (result.isConfirmed) {
                deletePesantren(e.PesantrenId).then(() => {
                    setData(data.filter((r) => r.PesantrenId !== e.PesantrenId))
                    Swal.fire({
                        title: 'Terhapus!',
                        text: 'Data sudah dihapus.',
                        icon: 'success',
                    })
                })
            }
        })
    }

    const onSubmit = async (dataSubmit: PesantrenFormValidation) => {
        setLoading(true)
        if (titleDialog === 'Tambah Data Pesantren') {
            setPesantren({
                PendaftaranId: selectableMahasiswa,
                PesantrenId: dataSubmit.PesantrenId || '',
                NamaPesantren: dataSubmit.NamaPesantren,
                LamaPesantren: dataSubmit.LamaPesantren,
                CreatedAt: null,
                UpdatedAt: null,
            }).then((res) => {
                setData([...data, res])
                toast('Data Pesantren Disimpan')
                setOpenDialog(false)
                form.reset()
                setLoading(false)
            })
        } else {
            updatePesantren({
                PendaftaranId: selectableMahasiswa,
                PesantrenId: dataSubmit.PesantrenId || '',
                NamaPesantren: dataSubmit.NamaPesantren,
                LamaPesantren: dataSubmit.LamaPesantren,
                CreatedAt: null,
                UpdatedAt: null,
            }).then((res) => {
                let idx = data.findIndex(
                    (r) => r.PesantrenId == dataSubmit.PesantrenId
                )
                setData(replaceItemAtIndex(data, idx, res))
                toast('Data Pesantren Diubah')
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
                    <h1 className="text-2xl">Pesantren</h1>
                </CardTitle>
                <CardDescription>Catat Data Pesantren Anda</CardDescription>
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
                            Buat Baru
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
                                <TableHead>Nama Pesantren</TableHead>
                                <TableHead>Lama Pesantren</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3}>
                                        Tidak Ada Data
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((row) => (
                                    <TableRow key={row.PesantrenId}>
                                        <TableCell>
                                            {row.NamaPesantren}
                                        </TableCell>
                                        <TableCell>
                                            {row.LamaPesantren}
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
            <DialogPesantren
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

export default PesantrenComponent

function DialogPesantren({
    openDialog,
    onSubmit,
    setOpenDialog,
    title,
    form,
    loading,
}: {
    onSubmit: (dataSubmit: PesantrenFormValidation) => void
    openDialog: boolean
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
    title: string
    loading: boolean
    form: UseFormReturn<PesantrenFormValidation>
}) {
    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className="w-full max-h-[80vh]  overflow-y-scroll">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle>{title}</DialogTitle>
                            <DialogDescription>
                                Catat Data Pesantren Anda
                            </DialogDescription>
                        </DialogHeader>
                        <div className="w-full justify-center md:justify-between">
                            <div className="grid grid-cols-1 gap-4 py-4">
                                <FormField
                                    control={form.control}
                                    name="NamaPesantren"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Nama Pesantren
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    readOnly={loading}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Nama Pesantren Anda
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="LamaPesantren"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Berapa Lama ?</FormLabel>
                                            <FormControl>
                                                <Input
                                                    readOnly={loading}
                                                    value={field.value ?? ''}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Berapa Lama anda di pesantren ?
                                                (contoh: 1 Tahun, 2 Bulan)
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
