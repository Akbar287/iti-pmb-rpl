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
import { Button } from '../ui/button'
import {
    AlertCircle,
    FileWarning,
    PenIcon,
    PlusCircle,
    ScanEye,
    TimerIcon,
    Trash2,
    X,
} from 'lucide-react'
import Swal from 'sweetalert2'
import { toast } from 'sonner'
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
    BuktiFormFormValidation,
    BuktiFormSkemaValidation,
} from '@/validation/BuktiFormValidation'
import { BuktiFormTypes } from '@/types/BuktiFormUploadDokumenTypes'
import { JenisDokumen, StatusPerkawinan } from '@/generated/prisma'
import {
    deleteFile,
    getFileBlobByNamafile,
    getFileByPendaftaranId,
    setFile,
} from '@/services/UploadDokumenService'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'

const UploadDokumen = ({
    dataMahasiswa,
    jenisDokumenServer,
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
    jenisDokumenServer: JenisDokumen[]
}) => {
    const [selectableMahasiswa, setSelectableMahasiswa] =
        React.useState<string>('')
    const [data, setData] = React.useState<BuktiFormTypes[]>([])
    const [previewTemp, setPreviewTemp] = React.useState<BuktiFormTypes | null>(
        null
    )
    const [jenisDokumen, setJenisDokumen] =
        React.useState<JenisDokumen[]>(jenisDokumenServer)
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
    const [loading, setLoading] = React.useState<boolean>(false)
    const [loadingAwal, setLoadingAwal] = React.useState<boolean>(false)
    const [openDialog, setOpenDialog] = React.useState<boolean>(false)
    const [openDialogDownload, setOpenDialogDownload] =
        React.useState<boolean>(false)
    const [pdfPreviewUrl, setPdfPreviewUrl] = React.useState<string | null>(
        null
    )
    const form = useForm<BuktiFormFormValidation>({
        resolver: zodResolver(BuktiFormSkemaValidation),
        defaultValues: {
            BuktiFormId: undefined,
            JenisDokumenId: '',
            NamaFile: undefined,
        },
    })

    React.useEffect(() => {
        setLoadingAwal(true)
        getFileByPendaftaranId(selectableMahasiswa)
            .then((res) => {
                setData(res.data)
                setLoadingAwal(false)
            })
            .catch((res) => {
                setLoadingAwal(false)
            })
    }, [selectableMahasiswa])

    const tambahData = () => {
        form.reset()
        setJenisDokumen(
            jenisDokumen.filter(
                (jd) =>
                    !data.some((bf) => bf.JenisDokumenId === jd.JenisDokumenId)
            )
        )
        setPreviewTemp(null)
        setErrorMessage(null)
        setPdfPreviewUrl(null)
        form.setValue('BuktiFormId', undefined)
        setOpenDialog(true)
    }

    const hapusData = (e: BuktiFormTypes) => {
        Swal.fire({
            title: 'Ingin Hapus ' + e.NamaDokumen + ' ?',
            text: 'Aksi ini tidak dapat di undo',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f45f24',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteFile(e.BuktiFormId).then(() => {
                    setData(data.filter((r) => r.BuktiFormId !== e.BuktiFormId))
                    Swal.fire({
                        title: 'Terhapus!',
                        text: 'Data sudah dihapus.',
                        icon: 'success',
                    })
                })
            }
        })
    }

    const preview = async (e: BuktiFormTypes) => {
        setPreviewTemp(e)
        setOpenDialogDownload(true)
        const res = await getFileBlobByNamafile(e.NamaFile)
        setPdfPreviewUrl(res)
    }

    const onSubmit = async (dataSubmit: BuktiFormFormValidation) => {
        if (dataSubmit.NamaFile !== undefined) {
            setLoading(true)
            setFile(
                dataSubmit.NamaFile,
                dataSubmit.JenisDokumenId,
                selectableMahasiswa
            )
                .then(async (res) => {
                    const temp: {
                        status: string
                        message: string
                        data: string | BuktiFormTypes
                    } = await res.json()

                    if (temp.status === 'error') {
                        setErrorMessage(temp.message)
                        toast('Error: ' + temp.message)
                    } else {
                        if (typeof temp.data !== 'string') {
                            setData([...data, temp.data])
                        }
                        toast('Data Form Disimpan')
                        setOpenDialog(false)
                        form.reset()
                    }
                    setLoading(false)
                })
                .catch((err) => {
                    setLoading(false)
                })
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <h1 className="text-2xl">Upload Dokumen</h1>
                </CardTitle>
                <CardDescription>
                    Tambahkan Dokumen anda untuk keperluan Asessmen
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
                                <TableHead>Urutan</TableHead>
                                <TableHead>Jenis Dokumen</TableHead>
                                <TableHead>Nama Dokumen</TableHead>
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
                                    <TableRow key={row.BuktiFormId}>
                                        <TableCell>
                                            {row.NomorDokumen}
                                        </TableCell>
                                        <TableCell>{row.Jenis}</TableCell>
                                        <TableCell>{row.NamaDokumen}</TableCell>
                                        <TableCell>
                                            <Button
                                                className="mx-2  hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer "
                                                type="button"
                                                onClick={() => preview(row)}
                                            >
                                                <ScanEye />
                                                Lihat
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
                <DialogUploadDokumen
                    openDialog={openDialog}
                    onSubmit={onSubmit}
                    setOpenDialog={setOpenDialog}
                    form={form}
                    loading={loading}
                    pdfPreviewUrl={pdfPreviewUrl}
                    setPdfPreviewUrl={setPdfPreviewUrl}
                    jenisDokumen={jenisDokumen}
                    errorMessage={errorMessage}
                />
                <DialogPreviewDokumen
                    data={previewTemp}
                    pdfPreview={pdfPreviewUrl}
                    openDialog={openDialogDownload}
                    setOpenDialog={setOpenDialogDownload}
                />
            </CardContent>
        </Card>
    )
}

export default UploadDokumen

function DialogPreviewDokumen({
    data,
    openDialog,
    pdfPreview,
    setOpenDialog,
}: {
    data: BuktiFormTypes | null
    pdfPreview: string | null
    openDialog: boolean
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
}) {
    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className="w-full max-h-[80vh]  overflow-y-scroll">
                <DialogHeader>
                    <DialogTitle>Preview Dokumen {data?.Jenis}</DialogTitle>
                    <DialogDescription>
                        Preview Jenis Dokumen {data?.NamaDokumen}
                    </DialogDescription>
                </DialogHeader>
                {pdfPreview === null ? (
                    <Skeleton className="w-full h-32" />
                ) : (
                    <iframe
                        src={pdfPreview || ''}
                        title="PDF Preview"
                        width="100%"
                        height="500px"
                        className="border rounded"
                    ></iframe>
                )}
                <DialogFooter>
                    <Button
                        className="mx-2  hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer"
                        variant={'destructive'}
                        onClick={() => {
                            setOpenDialog(false)
                        }}
                        type="button"
                    >
                        <X />
                        Tutup
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function DialogUploadDokumen({
    openDialog,
    onSubmit,
    setOpenDialog,
    form,
    loading,
    pdfPreviewUrl,
    setPdfPreviewUrl,
    jenisDokumen,
    errorMessage,
}: {
    onSubmit: (dataSubmit: BuktiFormFormValidation) => void
    openDialog: boolean
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
    loading: boolean
    form: UseFormReturn<BuktiFormFormValidation>
    pdfPreviewUrl: string | null
    setPdfPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>
    jenisDokumen: JenisDokumen[]
    errorMessage: string | null
}) {
    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className="w-full max-h-[80vh]  overflow-y-scroll">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle>Unggah Dokumen Anda</DialogTitle>
                            <DialogDescription>
                                Unggah Dokumen Anda
                            </DialogDescription>
                        </DialogHeader>
                        <div className="w-full justify-center md:justify-between">
                            <Alert className="w-full mt-3" variant={'default'}>
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>
                                    Memiliki Banyak File di Satu Jenis Dokumen ?
                                </AlertTitle>
                                <AlertDescription>
                                    Gabungkan beberapa file sejenis ke dalam
                                    satu PDF, lalu pilih jenis dokumennya
                                </AlertDescription>
                            </Alert>
                            {errorMessage && (
                                <Alert
                                    className="w-full mt-3"
                                    variant={'destructive'}
                                >
                                    <FileWarning className="h-4 w-4" />
                                    <AlertTitle>Terdapat Error</AlertTitle>
                                    <AlertDescription>
                                        {errorMessage}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="grid grid-cols-1 gap-4 py-4">
                                <FormField
                                    control={form.control}
                                    name="JenisDokumenId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Pilih Jenis Dokumen
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
                                                        <SelectValue placeholder="Pilih Jenis Dokumen" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>
                                                                Jenis Dokumen
                                                            </SelectLabel>
                                                            {jenisDokumen.map(
                                                                (jd) => (
                                                                    <SelectItem
                                                                        key={
                                                                            jd.JenisDokumenId
                                                                        }
                                                                        value={
                                                                            jd.JenisDokumenId
                                                                        }
                                                                    >
                                                                        {jd.NomorDokumen +
                                                                            ' - ' +
                                                                            jd.Jenis}
                                                                    </SelectItem>
                                                                )
                                                            )}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormDescription>
                                                Jenis Dokumen
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="NamaFile"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Unggah Dokumen Anda
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    accept="application/pdf"
                                                    onChange={(e) => {
                                                        const file =
                                                            e.target.files?.[0]
                                                        if (file) {
                                                            form.setValue(
                                                                'NamaFile',
                                                                file
                                                            )
                                                            setPdfPreviewUrl(
                                                                URL.createObjectURL(
                                                                    file
                                                                )
                                                            )
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Upload File Anda
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {pdfPreviewUrl && (
                                    <iframe
                                        src={pdfPreviewUrl || ''}
                                        title="PDF Preview"
                                        width="100%"
                                        height="500px"
                                        className="border rounded"
                                    ></iframe>
                                )}
                            </div>
                        </div>
                        <DialogFooter className="mt-3">
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
