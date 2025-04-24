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
import { MahasiswaPendidikan, StatusPerkawinan } from '@/generated/prisma'
import { Button } from '../ui/button'
import { PenIcon, PlusCircle, TimerIcon, Trash2 } from 'lucide-react'
import Swal from 'sweetalert2'
import {
    deleteMahasiswaPendidikan,
    getMahasiswaPendidikanByPendaftaranId,
    setMahasiswaPendidikan,
    updateMahasiswaPendidikan,
} from '@/services/KelengkapanDokumen/PendidikanMahasiswaService'
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
import {
    MahasiswaPendidikanFormValidation,
    MahasiswaPendidikanSkemaValidation,
} from '@/validation/PendidikanMahasiswaValidation'
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
const PendidikanMahasiswa = ({
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
    const [data, setData] = React.useState<MahasiswaPendidikan[]>([])
    const [loading, setLoading] = React.useState<boolean>(false)
    const [openDialog, setOpenDialog] = React.useState<boolean>(false)
    const [titleDialog, setTitleDialog] = React.useState<string>('')
    const form = useForm<MahasiswaPendidikanFormValidation>({
        resolver: zodResolver(MahasiswaPendidikanSkemaValidation),
        defaultValues: {
            PendaftaranId: selectableMahasiswa,
            MahasiswaPendidikanId: '',
            NamaSekolah: '',
            TahunLulus: 2000,
            Jurusan: '',
        },
    })

    React.useEffect(() => {
        setLoading(true)
        getMahasiswaPendidikanByPendaftaranId(selectableMahasiswa).then(
            (res) => {
                setData(res)
                setLoading(false)
            }
        )
        setLoading(false)
    }, [selectableMahasiswa])

    const tambahData = () => {
        form.reset()
        setTitleDialog('Tambah Data Riwayat Pendidikan')
        setOpenDialog(true)
    }

    const ubahData = (e: MahasiswaPendidikan) => {
        form.setValue('NamaSekolah', e.NamaSekolah)
        form.setValue('PendaftaranId', e.PendaftaranId)
        form.setValue('MahasiswaPendidikanId', e.MahasiswaPendidikanId)
        form.setValue('TahunLulus', e.TahunLulus)
        form.setValue('Jurusan', e.Jurusan)
        setTitleDialog('Ubah Data Riwayat Pendidikan')
        setOpenDialog(true)
    }

    const hapusData = (e: MahasiswaPendidikan) => {
        Swal.fire({
            title: 'Ingin Hapus ' + e.NamaSekolah + ' ?',
            text: 'Aksi ini tidak dapat di undo',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f45f24',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMahasiswaPendidikan(e.MahasiswaPendidikanId).then(() => {
                    setData(
                        data.filter(
                            (r) =>
                                r.MahasiswaPendidikanId !==
                                e.MahasiswaPendidikanId
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

    const onSubmit = async (dataSubmit: MahasiswaPendidikanFormValidation) => {
        setLoading(true)
        if (titleDialog === 'Tambah Data Riwayat Pendidikan') {
            setMahasiswaPendidikan({
                PendaftaranId: selectableMahasiswa,
                MahasiswaPendidikanId: dataSubmit.MahasiswaPendidikanId,
                NamaSekolah: dataSubmit.NamaSekolah,
                TahunLulus: dataSubmit.TahunLulus,
                Jurusan: dataSubmit.Jurusan,
                CreatedAt: null,
                UpdatedAt: null,
            }).then((res) => {
                setData([...data, res])
                toast('Data Riwayat Pendidikan Disimpan')
                setOpenDialog(false)
                form.reset()
                setLoading(false)
            })
        } else {
            updateMahasiswaPendidikan({
                PendaftaranId: dataSubmit.PendaftaranId,
                MahasiswaPendidikanId: dataSubmit.MahasiswaPendidikanId,
                NamaSekolah: dataSubmit.NamaSekolah,
                TahunLulus: dataSubmit.TahunLulus,
                Jurusan: dataSubmit.Jurusan,
                CreatedAt: null,
                UpdatedAt: null,
            }).then((res) => {
                let idx = data.findIndex(
                    (r) =>
                        r.MahasiswaPendidikanId ==
                        dataSubmit.MahasiswaPendidikanId
                )
                setData(replaceItemAtIndex(data, idx, res))
                toast('Data Riwayat Pendidikan Diubah')
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
                    <h1 className="text-2xl">Riwayat Pendidikan</h1>
                </CardTitle>
                <CardDescription>Catat Riwayat Pendidikan Anda</CardDescription>
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

                {selectableMahasiswa && data.length === 0 && loading ? (
                    <Skeleton />
                ) : selectableMahasiswa && data.length === 0 ? (
                    <h1>tidak ada Data</h1>
                ) : data.length > 0 && selectableMahasiswa ? (
                    <Table className="mt-5">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama Sekolah</TableHead>
                                <TableHead>Tahun Lulus</TableHead>
                                <TableHead>Jurusan</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow key={row.MahasiswaPendidikanId}>
                                    <TableCell>{row.NamaSekolah}</TableCell>
                                    <TableCell>{row.TahunLulus}</TableCell>
                                    <TableCell>{row.Jurusan}</TableCell>
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
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <></>
                )}
            </CardContent>
            <DialogMahasiswaPendidikan
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

export default PendidikanMahasiswa

function DialogMahasiswaPendidikan({
    openDialog,
    onSubmit,
    setOpenDialog,
    title,
    form,
    loading,
}: {
    onSubmit: (dataSubmit: MahasiswaPendidikanFormValidation) => void
    openDialog: boolean
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
    title: string
    loading: boolean
    form: UseFormReturn<MahasiswaPendidikanFormValidation>
}) {
    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className="w-full max-h-[80vh]  overflow-y-scroll">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle>{title}</DialogTitle>
                            <DialogDescription>
                                Catat Data Institusi Sebelumnya
                            </DialogDescription>
                        </DialogHeader>
                        <div className="w-full justify-center md:justify-between">
                            <div className="grid grid-cols-1 gap-4 py-4">
                                <FormField
                                    control={form.control}
                                    name="NamaSekolah"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nama Sekolah</FormLabel>
                                            <FormControl>
                                                <Input
                                                    readOnly={loading}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Nama Sekolah Anda
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="TahunLulus"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tahun Lulus</FormLabel>
                                            <FormControl>
                                                <Input
                                                    readOnly={loading}
                                                    value={field.value ?? ''}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            Number(
                                                                e.target.value
                                                            )
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Tahun Lulus Anda. (Contoh: 2021)
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="Jurusan"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Jurusan</FormLabel>
                                            <FormControl>
                                                <Input
                                                    readOnly={loading}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Jurusan Anda di sekolah ini
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
