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
    MahasiswaOrganisasiProfesi,
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
    deleteMahasiswaOrganisasiProfesi,
    getMahasiswaOrganisasiProfesiByPendaftaranId,
    setMahasiswaOrganisasiProfesi,
    updateMahasiswaOrganisasiProfesi,
} from '@/services/KelengkapanDokumen/OrganisasiProfesiService'
import {
    MahasiswaOrganisasiProfesiFormValidation,
    MahasiswaOrganisasiProfesiSkemaValidation,
} from '@/validation/OrganisasiProfesiValidation'

const OrganisasiProfesi = ({
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
    const [data, setData] = React.useState<MahasiswaOrganisasiProfesi[]>([])
    const [loading, setLoading] = React.useState<boolean>(false)
    const [openDialog, setOpenDialog] = React.useState<boolean>(false)
    const [titleDialog, setTitleDialog] = React.useState<string>('')
    const form = useForm<MahasiswaOrganisasiProfesiFormValidation>({
        resolver: zodResolver(MahasiswaOrganisasiProfesiSkemaValidation),
        defaultValues: {
            PendaftaranId: '',
            MahasiswaOrganisasiProfesiId: '',
            Tahun: 2000,
            NamaOrganisasi: '',
            JenjangAnggotaJabatan: '',
        },
    })

    React.useEffect(() => {
        setLoading(true)
        getMahasiswaOrganisasiProfesiByPendaftaranId(selectableMahasiswa).then(
            (res) => {
                setData(res)
                setLoading(false)
            }
        )
        setLoading(false)
    }, [selectableMahasiswa])

    const tambahData = () => {
        form.reset()
        setTitleDialog('Tambah Data Riwayat Organisasi Profesi')
        setOpenDialog(true)
    }

    const ubahData = (e: MahasiswaOrganisasiProfesi) => {
        form.setValue('NamaOrganisasi', e.NamaOrganisasi)
        form.setValue('PendaftaranId', e.PendaftaranId)
        form.setValue(
            'MahasiswaOrganisasiProfesiId',
            e.MahasiswaOrganisasiProfesiId
        )
        form.setValue('JenjangAnggotaJabatan', e.JenjangAnggotaJabatan)
        form.setValue('Tahun', e.Tahun)
        setTitleDialog('Ubah Data Riwayat Organisasi Profesi')
        setOpenDialog(true)
    }

    const hapusData = (e: MahasiswaOrganisasiProfesi) => {
        Swal.fire({
            title: 'Ingin Hapus ' + e.NamaOrganisasi + ' ?',
            text: 'Aksi ini tidak dapat di undo',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f45f24',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMahasiswaOrganisasiProfesi(
                    e.MahasiswaOrganisasiProfesiId
                ).then(() => {
                    setData(
                        data.filter(
                            (r) =>
                                r.MahasiswaOrganisasiProfesiId !==
                                e.MahasiswaOrganisasiProfesiId
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
        dataSubmit: MahasiswaOrganisasiProfesiFormValidation
    ) => {
        setLoading(true)
        if (titleDialog === 'Tambah Data Riwayat Organisasi Profesi') {
            setMahasiswaOrganisasiProfesi({
                PendaftaranId: selectableMahasiswa,
                MahasiswaOrganisasiProfesiId:
                    dataSubmit.MahasiswaOrganisasiProfesiId,
                NamaOrganisasi: dataSubmit.NamaOrganisasi,
                Tahun: dataSubmit.Tahun,
                JenjangAnggotaJabatan: dataSubmit.JenjangAnggotaJabatan,
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
            updateMahasiswaOrganisasiProfesi({
                PendaftaranId: dataSubmit.PendaftaranId,
                MahasiswaOrganisasiProfesiId:
                    dataSubmit.MahasiswaOrganisasiProfesiId,
                NamaOrganisasi: dataSubmit.NamaOrganisasi,
                Tahun: dataSubmit.Tahun,
                JenjangAnggotaJabatan: dataSubmit.JenjangAnggotaJabatan,
                CreatedAt: null,
                UpdatedAt: null,
            }).then((res) => {
                let idx = data.findIndex(
                    (r) =>
                        r.MahasiswaOrganisasiProfesiId ==
                        dataSubmit.MahasiswaOrganisasiProfesiId
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
                    <h1 className="text-2xl">Riwayat Organisasi Profesi</h1>
                </CardTitle>
                <CardDescription>
                    Catat Riwayat Organisasi Profesi Anda
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
                                <TableRow
                                    key={row.MahasiswaOrganisasiProfesiId}
                                >
                                    <TableCell>{row.NamaOrganisasi}</TableCell>
                                    <TableCell>{row.Tahun}</TableCell>
                                    <TableCell>
                                        {row.JenjangAnggotaJabatan}
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
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <></>
                )}
            </CardContent>
            <DialogOrganisasiProfesi
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

export default OrganisasiProfesi

function DialogOrganisasiProfesi({
    openDialog,
    onSubmit,
    setOpenDialog,
    title,
    form,
    loading,
}: {
    onSubmit: (dataSubmit: MahasiswaOrganisasiProfesiFormValidation) => void
    openDialog: boolean
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
    title: string
    loading: boolean
    form: UseFormReturn<MahasiswaOrganisasiProfesiFormValidation>
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
                                    name="NamaOrganisasi"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Nama Organisasi
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    readOnly={loading}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Nama Organisasi Anda
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
                                            <FormLabel>Tahun </FormLabel>
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
                                                Masuk Organisasi Tahun ?
                                                (Contoh: 2021)
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="JenjangAnggotaJabatan"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Jenjang Anggota Jabatan
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    readOnly={loading}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Jenjang Anggota Jabatan Anda di
                                                sekolah ini
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
