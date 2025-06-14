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
import { KeteranganMataKuliah, StatusPerkawinan } from '@/generated/prisma'
import { Button } from '../ui/button'
import {
    ArrowRightIcon,
    BookCheck,
    ComputerIcon,
    PenIcon,
    PenLineIcon,
    TimerIcon,
    X,
} from 'lucide-react'
import { toast } from 'sonner'
import { Skeleton } from '../ui/skeleton'
import {
    CreateMataKuliahMahasiswaTypes,
    DaftarUlangProdiType,
} from '@/types/DaftarUlangProdi'
import {
    getEvaluasiMandiri,
    setMataKuliahMahasiswa,
} from '@/services/EvaluasiMandiri/EvaluasiMandiriService'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableRow,
} from '../ui/table'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog'
import { Checkbox } from '../ui/checkbox'
import { replaceItemAtIndex } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import {
    setStatusAsessmenMandiri,
    setStatusPenunjukanAsesor,
} from '@/services/Status/StatusService'
import Swal from 'sweetalert2'

const EvaluasiMandiri = ({
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
    const router = useRouter()
    const [selectableMahasiswa, setSelectableMahasiswa] =
        React.useState<string>('')
    const [dataDaftarUlang, setDataDaftarUlang] =
        React.useState<DaftarUlangProdiType | null>(null)
    const [form, setForm] = React.useState<CreateMataKuliahMahasiswaTypes>([])
    const [loading, setLoading] = React.useState<boolean>(false)
    const [loadingAwal, setLoadingAwal] = React.useState<boolean>(false)
    const [openDialog, setOpenDialog] = React.useState<boolean>(false)

    const startEvaluating = () => {
        if (dataDaftarUlang) {
            if (dataDaftarUlang.Status === 'Asessmen Mandiri') {
                router.push('/evaluasi-mandiri/' + selectableMahasiswa)
            } else {
                setStatusAsessmenMandiri(dataDaftarUlang.PendaftaranId).then(
                    (res) => {
                        router.push('/evaluasi-mandiri/' + selectableMahasiswa)
                    }
                )
            }
        }
    }

    const updateMataKuliahMahasiswa = () => {
        setLoading(true)
        setMataKuliahMahasiswa(selectableMahasiswa, form)
            .then((res) => {
                setDataDaftarUlang(
                    dataDaftarUlang
                        ? {
                              ...dataDaftarUlang,
                              MataKuliahMahasiswa: res,
                              PilihMataKuliah: res.length,
                          }
                        : null
                )
                toast('Data Mata Kuliah sudah disimpan')
                setLoading(false)
                setOpenDialog(false)
            })
            .catch((err) => {
                toast('Terjadi Kesalahan')
                setLoading(false)
            })
    }

    React.useEffect(() => {
        setLoadingAwal(true)
        getEvaluasiMandiri(selectableMahasiswa)
            .then(async (res) => {
                await setDataDaftarUlang(res)
                setLoadingAwal(false)
            })
            .catch((res) => {
                setLoadingAwal(false)
            })
    }, [selectableMahasiswa])

    const continueToAsesor = () => {
        Swal.fire({
            title: 'Lanjutkan ke Asesor ?',
            text: 'Pastikan anda yakin terhadap penilaian evaluasi mandiri anda. Lampiran di Upload Dokumen jangan sampai salah.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#f45f24',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Lanjutkan Ke Asesor!',
        }).then((result) => {
            if (result.isConfirmed) {
                if (dataDaftarUlang) {
                    setStatusPenunjukanAsesor(
                        dataDaftarUlang.PendaftaranId
                    ).then(() => {
                        Swal.fire({
                            title: 'Berhasil!',
                            text: 'Asesor akan ditunjuk untuk menilai Mata Kuliah RPL anda.',
                            icon: 'success',
                        })
                    })
                } else {
                    Swal.fire({
                        title: 'Gagal!',
                        text: 'Anda perlu memilih Nomor Ujian di kolom form.',
                        icon: 'error',
                    })
                }
            }
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <h1 className="text-2xl">Evaluasi Mandiri</h1>
                </CardTitle>
                <CardDescription>
                    Evaluasi Mandiri diperlukan untuk memudahkan asessmen
                    menilai berdasarkan evaluasi mandiri
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
                    {!selectableMahasiswa ? (
                        <></>
                    ) : loadingAwal || loading || dataDaftarUlang === null ? (
                        <Skeleton className="w-full h-32" />
                    ) : (
                        <>
                            <Table className="my-8">
                                <TableCaption>
                                    Informasi Program Studi
                                </TableCaption>
                                <TableBody>
                                    <TableRow>
                                        <TableHead>
                                            Nama Program Studi
                                        </TableHead>
                                        <TableCell>
                                            {dataDaftarUlang?.Nama}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>NIM</TableHead>
                                        <TableCell>
                                            {dataDaftarUlang?.Nim}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>Akreditasi</TableHead>
                                        <TableCell>
                                            {dataDaftarUlang?.Akreditasi}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>Jenjang</TableHead>
                                        <TableCell>
                                            {dataDaftarUlang?.Jenjang}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>
                                            Jenjang KKNI Dituju
                                        </TableHead>
                                        <TableCell>
                                            {dataDaftarUlang?.JenjangKkniDituju}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            {dataDaftarUlang?.PilihMataKuliah !== 0 ? (
                                <Alert className="mb-3">
                                    <BookCheck className="h-4 w-4" />
                                    <AlertTitle>Evaluasi Mandiri</AlertTitle>
                                    <AlertDescription>
                                        Terdapat{' '}
                                        {
                                            dataDaftarUlang?.EvaluasiDiriMataKuliah
                                        }{' '}
                                        dari {dataDaftarUlang?.PilihMataKuliah}{' '}
                                        Terselesaikan. Segera Selesaikan agar
                                        dapat di assessmen oleh asessor.
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <></>
                            )}
                            <Alert>
                                <ComputerIcon className="h-4 w-4" />
                                <AlertTitle>Pemberitahuan</AlertTitle>
                                <AlertDescription>
                                    Sebelum memulai Evaluasi Mandiri. Gunakan
                                    Laptop atau Komputer untuk Pengalaman
                                    terbaik. Min: 1270x720
                                </AlertDescription>
                            </Alert>
                            <div className="flex flex-row items-center">
                                <Button
                                    className="mt-5 mr-2 hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer "
                                    type="button"
                                    onClick={() => {
                                        let temp =
                                            dataDaftarUlang?.MataKuliahMahasiswa.map(
                                                (r) => ({
                                                    MataKuliahId:
                                                        r.MataKuliahId,
                                                    Keterangan: r.Keterangan,
                                                })
                                            )
                                        setForm(
                                            (temp || []).filter(
                                                (item) =>
                                                    item.Keterangan !== null
                                            ) as {
                                                MataKuliahId: string
                                                Keterangan: KeteranganMataKuliah
                                            }[]
                                        )
                                        setOpenDialog(true)
                                    }}
                                >
                                    <BookCheck />
                                    Pilih Mata Kuliah RPL
                                </Button>
                                {(dataDaftarUlang?.PilihMataKuliah ?? 0) >
                                    0 && (
                                    <Button
                                        className="mt-5 mr-2 hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer "
                                        type="button"
                                        onClick={() => {
                                            startEvaluating()
                                        }}
                                    >
                                        Mulai Evaluasi
                                        <PenLineIcon />
                                    </Button>
                                )}
                                {dataDaftarUlang.Status ===
                                    'Asessmen Mandiri' &&
                                    dataDaftarUlang.EvaluasiDiriMataKuliah ===
                                        dataDaftarUlang.PilihMataKuliah && (
                                        <Button
                                            className="mt-5 hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer "
                                            type="button"
                                            onClick={() => continueToAsesor()}
                                        >
                                            Lanjutkan Ke Asesor
                                            <ArrowRightIcon />
                                        </Button>
                                    )}
                            </div>
                        </>
                    )}
                </div>
            </CardContent>
            <DialogMataKuliahMahasiswa
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                form={form}
                loading={loading}
                dataDaftarUlang={dataDaftarUlang}
                setForm={setForm}
                updateMataKuliahMahasiswa={updateMataKuliahMahasiswa}
            />
        </Card>
    )
}

export default EvaluasiMandiri

function DialogMataKuliahMahasiswa({
    openDialog,
    setOpenDialog,
    form,
    loading,
    dataDaftarUlang,
    setForm,
    updateMataKuliahMahasiswa,
}: {
    openDialog: boolean
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
    loading: boolean
    form: CreateMataKuliahMahasiswaTypes
    dataDaftarUlang: DaftarUlangProdiType | null
    setForm: React.Dispatch<
        React.SetStateAction<CreateMataKuliahMahasiswaTypes>
    >
    updateMataKuliahMahasiswa: () => void
}) {
    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className="w-full max-h-[80vh]  overflow-y-scroll">
                <DialogHeader>
                    <DialogTitle>Pilih Mata Kuliah yang di RPL</DialogTitle>
                    <DialogDescription>
                        Catat Mata Kuliah yang ingin di RPL kan
                    </DialogDescription>
                </DialogHeader>
                <div className="w-full justify-center md:justify-between">
                    <div className="grid grid-cols-1 gap-4 py-4">
                        {dataDaftarUlang == null ? (
                            <Skeleton className="w-full h-32" />
                        ) : (
                            dataDaftarUlang.MataKuliah.map((mk) => (
                                <div key={mk.MataKuliahId}>
                                    <div className="items-top flex space-x-2">
                                        <Checkbox
                                            disabled={loading}
                                            id={mk.MataKuliahId}
                                            checked={form.some(
                                                (item) =>
                                                    item.MataKuliahId ===
                                                    mk.MataKuliahId
                                            )}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setForm([
                                                        ...form,
                                                        {
                                                            MataKuliahId:
                                                                mk.MataKuliahId,
                                                            Keterangan:
                                                                KeteranganMataKuliah.Transfer_SKS,
                                                        },
                                                    ])
                                                } else {
                                                    setForm(
                                                        form.filter(
                                                            (f) =>
                                                                f.MataKuliahId !==
                                                                mk.MataKuliahId
                                                        )
                                                    )
                                                }
                                            }}
                                        />
                                        <div className="grid gap-1.5 leading-none">
                                            <label
                                                htmlFor={mk.MataKuliahId}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                {mk.Nama}
                                            </label>
                                            <p className="text-sm text-muted-foreground">
                                                Kode ({mk.Kode})
                                                {mk.Sks &&
                                                    ' - SKS (' + mk.Sks + ')'}
                                                {mk.Semester &&
                                                    ' - Smt (' +
                                                        mk.Semester +
                                                        ')'}
                                            </p>
                                        </div>
                                    </div>
                                    {form.some(
                                        (item) =>
                                            item.MataKuliahId ===
                                            mk.MataKuliahId
                                    ) && (
                                        <div className="space-x-2 my-2">
                                            <Select
                                                disabled={loading}
                                                value={
                                                    form.find(
                                                        (item) =>
                                                            item.MataKuliahId ===
                                                            mk.MataKuliahId
                                                    )?.Keterangan ?? ''
                                                }
                                                onValueChange={(value) => {
                                                    setForm(
                                                        replaceItemAtIndex(
                                                            form,
                                                            form.findIndex(
                                                                (f) =>
                                                                    f.MataKuliahId ===
                                                                    mk.MataKuliahId
                                                            ),
                                                            {
                                                                MataKuliahId:
                                                                    mk.MataKuliahId,
                                                                Keterangan:
                                                                    value as KeteranganMataKuliah,
                                                            }
                                                        )
                                                    )
                                                }}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Pilih Status SKS" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>
                                                            Pilih Status SKS
                                                        </SelectLabel>
                                                        <SelectItem
                                                            value={
                                                                KeteranganMataKuliah.Transfer_SKS
                                                            }
                                                        >
                                                            Transfer SKS
                                                        </SelectItem>
                                                        <SelectItem
                                                            value={
                                                                KeteranganMataKuliah.Perolehan_SKS
                                                            }
                                                        >
                                                            Perolehan SKS
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <DialogFooter className="flex items-center">
                    <Button
                        className="mx-2  hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer"
                        variant={'destructive'}
                        disabled={loading}
                        type="button"
                        onClick={() => {
                            setOpenDialog(false)
                            setForm([])
                        }}
                    >
                        <X className="w-4 h-4" />
                        Tutup
                    </Button>
                    <Button
                        className="mx-2  hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer"
                        variant={'default'}
                        disabled={loading}
                        type="button"
                        onClick={() => updateMataKuliahMahasiswa()}
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
            </DialogContent>
        </Dialog>
    )
}
