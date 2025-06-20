'use client'

import { SanggahanAsessmenTypes } from '@/types/AsessmentTypes'
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '../ui/button'
import {
    ChevronRight,
    InfoIcon,
    MinusIcon,
    PenIcon,
    PenLine,
    PlusIcon,
    Timer,
    WrenchIcon,
} from 'lucide-react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table'
import { Separator } from '../ui/separator'
import { Input } from '../ui/input'
import { replaceItemAtIndex } from '@/lib/utils'
import { Badge } from '../ui/badge'
import { Checkbox } from '../ui/checkbox'
import Swal from 'sweetalert2'
import { setSanggahanFromMahasiswa } from '@/services/Asessment/SanggahanService'
import { setStatusHasilFinalAsessmen } from '@/services/Status/StatusService'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { Role } from '@/generated/prisma'
import { Label } from '../ui/label'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '../ui/sheet'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form'
import { useForm, UseFormReturn } from 'react-hook-form'
import {
    SkorAssesmenFormValidation,
    SkorAssesmenSchemaValidation,
} from '@/validation/RekapitulasiFormValidation'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { setSkorAsessmenFromAsesor } from '@/services/Asessment/AsessmentMahasiswaService'

const SanggahanIdComponent = ({
    dataServer,
}: {
    dataServer: SanggahanAsessmenTypes
}) => {
    const [role, setRole] = React.useState<Role | null>(null)
    const [yakin, setYakin] = React.useState<boolean>(false)
    React.useEffect(() => {
        if (role === null) {
            setLoading(true)
            const r = localStorage.getItem('pmb.iti.role')
            if (r) {
                setRole(JSON.parse(r))
                setLoading(false)
            }
            setLoading(false)
        }
    }, [])
    const [openDialog, setOpenDialog] = React.useState<boolean>(false)
    const [data, setData] = React.useState(dataServer)
    const [loading, setLoading] = React.useState<boolean>(false)
    const [form, setForm] = React.useState<{
        SanggahanAssesmenId: string
        PendaftaranId: string
        ProsesBanding: boolean
        DiskusiBanding: boolean
        CreatedAt: Date | null
        UpdatedAt: Date | null
        SanggahanAssesmenMk: {
            SanggahanAssesmenMkId: string
            SanggahanAssesmenId: string
            MataKuliahMahasiswaId: string
            Keterangan: string | null
            CreatedAt: Date | null
            UpdatedAt: Date | null
        }[]
        SanggahanAssesmenPihak: {
            SanggahanAssesmenPihakId: string
            SanggahanAssesmenId: string
            NamaPihak: string
            JabatanPihak: string | null
            InstansiPihak: string | null
            CreatedAt: Date | null
            UpdatedAt: Date | null
        }[]
    }>(dataServer.SanggahanAssesmen)

    const formPerbaikan = useForm<SkorAssesmenFormValidation>({
        resolver: zodResolver(SkorAssesmenSchemaValidation),
        defaultValues: {
            SkorAssesmenId: '',
            MataKuliahMahasiswaId: '',
            Portofolio: 0,
            Tulis: 0,
            Wawancara: 0,
            Demo: 0,
            Diakui: false,
            SkorRataRata: 0,
            NilaiHuruf: null,
        },
    })

    const continueToFinal = () => {
        Swal.fire({
            title: 'Lanjutkan ke Proses Final ?',
            text:
                'Lanjutkan  ' +
                data.Nama +
                ' ke Proses Hasil Final. Aksi ini tidak dapat di undo',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f45f24',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Lanjutkan!',
            cancelButtonText: 'Batalkan',
        }).then((result) => {
            if (result.isConfirmed) {
                setStatusHasilFinalAsessmen(data.PendaftaranId).then(() => {
                    Swal.fire({
                        title: 'Berhasil!',
                        text:
                            'Asessmen ' +
                            data.Nama +
                            ' dilanjutkan ke Proses Hasil Final Asessmen.',
                        icon: 'success',
                    })
                })
            }
        })
    }

    const save = () => {
        Swal.fire({
            title: 'Anda Yakin ?',
            text: 'Anda Ingin Melanjutkan Sanggahan ke Asesor Anda ? Aksi ini tidak dapat di undo',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f45f24',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Lanjutkan!',
            cancelButtonText: 'Batalkan',
        }).then((result) => {
            if (result.isConfirmed) {
                setLoading(true)
                setSanggahanFromMahasiswa({
                    ...form,
                    PendaftaranId: data.PendaftaranId,
                })
                    .then((res) => {
                        setForm(res)
                        setData({ ...data, SanggahanAssesmen: res })
                        setLoading(false)
                        Swal.fire({
                            title: 'Berhasil!',
                            text:
                                'Asessmen ' +
                                data.Nama +
                                ' di sanggah. Asesor akan merespon sanggahan anda',
                            icon: 'success',
                        })
                    })
                    .catch((err) => setLoading(false))
            }
        })
        setSanggahanFromMahasiswa
    }

    const fixMk = (mkmId: string) => {
        const temp = data.ProgramStudi.MataKuliahMahasiswa.find(
            (x) => x.MataKuliahMahasiswaId === mkmId
        )

        if (temp) {
            const skor = temp.SkorAsessmen
            formPerbaikan.setValue('SkorAssesmenId', skor.SkorAssesmenId ?? '')
            formPerbaikan.setValue(
                'MataKuliahMahasiswaId',
                skor.MataKuliahMahasiswaId ?? ''
            )
            formPerbaikan.setValue('Portofolio', skor.Portofolio ?? 0)
            formPerbaikan.setValue('Tulis', skor.Tulis ?? 0)
            formPerbaikan.setValue('Wawancara', skor.Wawancara ?? 0)
            formPerbaikan.setValue('Demo', skor.Demo ?? 0)
            formPerbaikan.setValue('Diakui', skor.Diakui ?? false)
            formPerbaikan.setValue('SkorRataRata', skor.SkorRataRata ?? 0)
            formPerbaikan.setValue('NilaiHuruf', skor.NilaiHuruf ?? '')
            setOpenDialog(true)
        }
    }

    const onSubmit = (dataSend: SkorAssesmenFormValidation) => {
        if (dataSend.MataKuliahMahasiswaId === '') {
            toast('Silakan Pilih Mata Kuliah Terlebih Dahulu')
        } else {
            setLoading(true)
            setSkorAsessmenFromAsesor(
                dataSend.SkorAssesmenId,
                dataSend.MataKuliahMahasiswaId,
                dataSend.Portofolio,
                dataSend.Tulis,
                dataSend.Wawancara,
                dataSend.Demo,
                dataSend.Diakui,
                dataSend.SkorRataRata,
                dataSend.NilaiHuruf
            )
                .then((res) => {
                    let idx = data.ProgramStudi.MataKuliahMahasiswa.findIndex(
                        (d) =>
                            d.MataKuliahMahasiswaId ===
                            dataSend.MataKuliahMahasiswaId
                    )

                    setData({
                        ...data,
                        ProgramStudi: {
                            ...data.ProgramStudi,
                            MataKuliahMahasiswa: replaceItemAtIndex(
                                data.ProgramStudi.MataKuliahMahasiswa,
                                idx,
                                {
                                    ...data.ProgramStudi.MataKuliahMahasiswa[
                                        idx
                                    ],
                                    SkorAsessmen: {
                                        SkorAssesmenId: res.SkorAssesmenId,
                                        MataKuliahMahasiswaId:
                                            res.MataKuliahMahasiswaId,
                                        Portofolio: res.Portofolio,
                                        Tulis: res.Tulis,
                                        Wawancara: res.Wawancara,
                                        Demo: res.Demo,
                                        Diakui: res.Diakui,
                                        SkorRataRata: res.SkorRataRata,
                                        NilaiHuruf: res.NilaiHuruf,
                                    },
                                }
                            ),
                        },
                    })
                    toast('Skor Berhasil Diubah')
                    setLoading(false)
                    setOpenDialog(false)
                })
                .catch((err) => {
                    toast('Skor Gagal Disimpan; Error: ' + err)
                    setLoading(false)
                })
        }
    }

    return (
        <div className="grid grid-cols-1 gap-5">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Nilai Skor Asessmen Anda</CardTitle>
                    <CardDescription>
                        Ini adalah nilai skor anda. lakukan sanggahan jika ada
                        yang dirasa kurang.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-2">
                        <Table>
                            <TableCaption>Informasi Pendaftaran</TableCaption>
                            <TableBody>
                                <TableRow>
                                    <TableHead>Kode Pendaftaran</TableHead>
                                    <TableCell>{data.KodePendaftar}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>No. Ujian</TableHead>
                                    <TableCell>{data.NoUjian}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Periode</TableHead>
                                    <TableCell>{data.Periode}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <Table>
                            <TableCaption>Program Studi</TableCaption>
                            <TableBody>
                                <TableRow>
                                    <TableHead>Nama</TableHead>
                                    <TableCell>
                                        {data.ProgramStudi.Nama}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Jenjang</TableHead>
                                    <TableCell>
                                        {data.ProgramStudi.Jenjang}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Akreditasi</TableHead>
                                    <TableCell>
                                        {data.ProgramStudi.Akreditasi}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            {role?.Name.match('Asesor') ? (
                <Alert>
                    <InfoIcon />
                    <AlertTitle>Sanggahan Mahasiswa</AlertTitle>
                    <AlertDescription>
                        Mahasiswa Menyanggah MK yang dipilih. Silakan untuk
                        mempelajari ulang dan/atau menghubungi mahasiswa jika
                        ada pertanyaan Alasan Menyanggah lebih lanjut
                    </AlertDescription>
                </Alert>
            ) : data.SanggahanAssesmen.SanggahanAssesmenId !== '' ? (
                <Alert>
                    <InfoIcon />
                    <AlertTitle>Sanggahan Diterima</AlertTitle>
                    <AlertDescription>
                        Sanggahan Anda sedang dipelajari oleh Asesor.
                    </AlertDescription>
                </Alert>
            ) : (
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Tidak Ada Sanggahan ? </CardTitle>
                        <CardDescription>
                            Hasil Final saya sudah sesuai dan bisa dilanjutkan
                            ke proses final
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <Button
                            className="mt-5 hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer "
                            type="button"
                            size={'sm'}
                            disabled={
                                loading ||
                                data.SanggahanAssesmen.SanggahanAssesmenId !==
                                    ''
                            }
                            onClick={() => continueToFinal()}
                        >
                            {loading ? (
                                <>
                                    <Timer /> Loading
                                </>
                            ) : (
                                <>
                                    Lanjutkan Ke Hasil Final
                                    <ChevronRight />
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            )}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Form Sanggahan</CardTitle>
                    <CardDescription>
                        Isi Form jika ada yang ingin disanggah
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-1 gap-2">
                        <Table>
                            <TableCaption>Informasi Pendaftaran</TableCaption>
                            <TableBody>
                                <TableRow>
                                    <TableHead>Nama Pemohon</TableHead>
                                    <TableCell>{data.Nama}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>No. Hp</TableHead>
                                    <TableCell>{data.NomorHp}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Tanggal Asessmen</TableHead>
                                    <TableCell>
                                        {data.TanggalAsessmen.toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <Separator className="my-3" />
                        <div className="grid grid-cols-1 gap-3">
                            <h1 className="font-bold">
                                Silakan Dipilih antara Ya / Tidak
                            </h1>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <label
                                className={`border overflow-hidden rounded-xl my-2 p-4 shadow-sm cursor-pointer transition-all
                                            ${
                                                form.ProsesBanding
                                                    ? 'border-primary/50 bg-primary/20 dark:bg-gray-800 dark:border-gray-300 dark:text-gray-100'
                                                    : 'hover:shadow-md'
                                            }
                                            ${
                                                loading
                                                    ? 'opacity-50 cursor-not-allowed'
                                                    : ''
                                            }`}
                            >
                                <input
                                    type="checkbox"
                                    className="mr-2 hidden"
                                    checked={form.ProsesBanding}
                                    disabled={
                                        loading ||
                                        data.SanggahanAssesmen
                                            .SanggahanAssesmenId !== ''
                                    }
                                    onChange={(e) => {
                                        setForm({
                                            ...form,
                                            ProsesBanding: !form.ProsesBanding,
                                        })
                                    }}
                                />
                                <div className="font-semibold">
                                    Proses Banding
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Saya telah Mengetahui Proses Banding
                                </div>
                            </label>
                            <label
                                className={`border overflow-hidden rounded-xl my-2 p-4 shadow-sm cursor-pointer transition-all
                                            ${
                                                form.DiskusiBanding
                                                    ? 'border-primary/50 bg-primary/20 dark:bg-gray-800 dark:border-gray-300 dark:text-gray-100'
                                                    : 'hover:shadow-md'
                                            }
                                            ${
                                                loading
                                                    ? 'opacity-50 cursor-not-allowed'
                                                    : ''
                                            }`}
                            >
                                <input
                                    type="checkbox"
                                    className="mr-2 hidden"
                                    checked={form.DiskusiBanding}
                                    disabled={
                                        loading ||
                                        data.SanggahanAssesmen
                                            .SanggahanAssesmenId !== ''
                                    }
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            DiskusiBanding:
                                                !form.DiskusiBanding,
                                        })
                                    }
                                />
                                <div className="font-semibold">Diskusi</div>
                                <div className="text-sm text-muted-foreground">
                                    Saya Telah berdiskusi Banding bersama Asesor
                                </div>
                            </label>
                        </div>
                        <Separator className="my-3" />
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col">
                                <h1 className="font-bold">Pihak Lain</h1>
                                <p className="font-mono text-sm dark:text-gray-400 text-gray-600">
                                    Apakah anda melibatkan pihak lain dalam
                                    menyanggah hasil asessmen ?
                                </p>
                            </div>
                            {role?.Name === 'Mahasiswa' && (
                                <div className="flex justify-end w-full">
                                    <Button
                                        className="mr-2 hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer "
                                        size={'sm'}
                                        disabled={
                                            loading ||
                                            data.SanggahanAssesmen
                                                .SanggahanAssesmenId !== ''
                                        }
                                        onClick={() =>
                                            setForm({
                                                ...form,
                                                SanggahanAssesmenPihak: [
                                                    ...form.SanggahanAssesmenPihak,
                                                    {
                                                        SanggahanAssesmenPihakId:
                                                            '',
                                                        SanggahanAssesmenId:
                                                            new Date()
                                                                .getTime()
                                                                .toString() +
                                                            Math.random() *
                                                                100000,
                                                        NamaPihak: '',
                                                        JabatanPihak: null,
                                                        InstansiPihak: null,
                                                        CreatedAt: null,
                                                        UpdatedAt: null,
                                                    },
                                                ],
                                            })
                                        }
                                    >
                                        <PlusIcon />
                                    </Button>
                                    <Button
                                        className="hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer "
                                        size={'sm'}
                                        disabled={
                                            loading ||
                                            data.SanggahanAssesmen
                                                .SanggahanAssesmenId !== ''
                                        }
                                        onClick={() => {
                                            if (
                                                form.SanggahanAssesmenPihak
                                                    .length !== 0
                                            ) {
                                                setForm({
                                                    ...form,
                                                    SanggahanAssesmenPihak:
                                                        form.SanggahanAssesmenPihak.slice(
                                                            0,
                                                            -1
                                                        ),
                                                })
                                            }
                                        }}
                                    >
                                        <MinusIcon />
                                    </Button>
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {form.SanggahanAssesmenPihak.length === 0 ? (
                                <h1 className="font-bold text-center my-3">
                                    Tidak Ada Pihak Lain
                                </h1>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Jabatan</TableHead>
                                        <TableHead>Instansi</TableHead>
                                    </TableHeader>
                                    <TableBody>
                                        {form.SanggahanAssesmenPihak.map(
                                            (sap, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        <Input
                                                            className=""
                                                            disabled={
                                                                loading ||
                                                                data
                                                                    .SanggahanAssesmen
                                                                    .SanggahanAssesmenId !==
                                                                    ''
                                                            }
                                                            value={
                                                                sap.NamaPihak
                                                            }
                                                            onChange={(e) =>
                                                                setForm({
                                                                    ...form,
                                                                    SanggahanAssesmenPihak:
                                                                        replaceItemAtIndex(
                                                                            form.SanggahanAssesmenPihak,
                                                                            index,
                                                                            {
                                                                                ...form
                                                                                    .SanggahanAssesmenPihak[
                                                                                    index
                                                                                ],
                                                                                NamaPihak:
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                            }
                                                                        ),
                                                                })
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            className=""
                                                            disabled={
                                                                loading ||
                                                                data
                                                                    .SanggahanAssesmen
                                                                    .SanggahanAssesmenId !==
                                                                    ''
                                                            }
                                                            value={
                                                                sap.JabatanPihak ??
                                                                ''
                                                            }
                                                            onChange={(e) =>
                                                                setForm({
                                                                    ...form,
                                                                    SanggahanAssesmenPihak:
                                                                        replaceItemAtIndex(
                                                                            form.SanggahanAssesmenPihak,
                                                                            index,
                                                                            {
                                                                                ...form
                                                                                    .SanggahanAssesmenPihak[
                                                                                    index
                                                                                ],
                                                                                JabatanPihak:
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                            }
                                                                        ),
                                                                })
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            className=""
                                                            disabled={
                                                                loading ||
                                                                data
                                                                    .SanggahanAssesmen
                                                                    .SanggahanAssesmenId !==
                                                                    ''
                                                            }
                                                            value={
                                                                sap.InstansiPihak ??
                                                                ''
                                                            }
                                                            onChange={(e) =>
                                                                setForm({
                                                                    ...form,
                                                                    SanggahanAssesmenPihak:
                                                                        replaceItemAtIndex(
                                                                            form.SanggahanAssesmenPihak,
                                                                            index,
                                                                            {
                                                                                ...form
                                                                                    .SanggahanAssesmenPihak[
                                                                                    index
                                                                                ],
                                                                                InstansiPihak:
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                            }
                                                                        ),
                                                                })
                                                            }
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        )}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                        <Separator className="my-3" />
                        <div className="grid grid-cols-1 gap-3">
                            <Table>
                                <TableCaption>
                                    {role?.Name.match('Asesor')
                                        ? 'Mata Kuliah Yang Disanggah'
                                        : 'Mata Kuliah RPL Mahasiswa'}
                                </TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead rowSpan={2}>
                                            <div className={'text-center'}>
                                                Kode Kuliah
                                            </div>
                                        </TableHead>
                                        <TableHead rowSpan={2}>
                                            <div className={'text-center'}>
                                                Mata Kuliah
                                            </div>
                                        </TableHead>
                                        <TableHead colSpan={4}>
                                            <div className={'text-center'}>
                                                Skor
                                            </div>
                                        </TableHead>
                                        <TableHead rowSpan={2}>
                                            <div className={'text-center'}>
                                                Diakui
                                            </div>
                                        </TableHead>
                                        <TableHead rowSpan={2}>
                                            <div className={'text-center'}>
                                                Skor Rata-rata
                                            </div>
                                        </TableHead>
                                        <TableHead rowSpan={2}>
                                            <div className={'text-center'}>
                                                Nilai Huruf
                                            </div>
                                        </TableHead>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>Portfolio</TableHead>
                                        <TableHead>Tulis</TableHead>
                                        <TableHead>Wawancara</TableHead>
                                        <TableHead>Demo</TableHead>
                                        <TableHead>
                                            {role?.Name.match('Asesor')
                                                ? 'Perbaiki'
                                                : 'Sanggah'}
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.SanggahanAssesmen.SanggahanAssesmenMk.map(
                                        (mkm) => {
                                            const temp =
                                                data.ProgramStudi.MataKuliahMahasiswa.find(
                                                    (x) =>
                                                        x.MataKuliahMahasiswaId ===
                                                        mkm.MataKuliahMahasiswaId
                                                )
                                            return (
                                                <TableRow
                                                    key={
                                                        mkm.MataKuliahMahasiswaId
                                                    }
                                                >
                                                    <TableCell>
                                                        {temp?.MataKuliah.Kode}
                                                    </TableCell>
                                                    <TableCell>
                                                        {temp?.MataKuliah.Nama}
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            temp?.SkorAsessmen
                                                                .Portofolio
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            temp?.SkorAsessmen
                                                                .Tulis
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            temp?.SkorAsessmen
                                                                .Wawancara
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            temp?.SkorAsessmen
                                                                .Demo
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {temp?.SkorAsessmen
                                                            .Diakui ? (
                                                            <Badge
                                                                variant={
                                                                    'default'
                                                                }
                                                            >
                                                                Ya
                                                            </Badge>
                                                        ) : (
                                                            <Badge
                                                                variant={
                                                                    'destructive'
                                                                }
                                                            >
                                                                Tidak
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            temp?.SkorAsessmen
                                                                .SkorRataRata
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            temp?.SkorAsessmen
                                                                .NilaiHuruf
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {role?.Name.match(
                                                            'Asesor'
                                                        ) ? (
                                                            <Button
                                                                className="mt-3 hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer "
                                                                type="button"
                                                                size={'sm'}
                                                                disabled={
                                                                    loading
                                                                }
                                                                onClick={() =>
                                                                    fixMk(
                                                                        mkm.MataKuliahMahasiswaId
                                                                    )
                                                                }
                                                            >
                                                                {loading ? (
                                                                    <>
                                                                        <Timer />{' '}
                                                                        Loading
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <WrenchIcon />
                                                                        Perbaiki
                                                                    </>
                                                                )}
                                                            </Button>
                                                        ) : (
                                                            <Checkbox
                                                                disabled={
                                                                    loading ||
                                                                    data
                                                                        .SanggahanAssesmen
                                                                        .SanggahanAssesmenId !==
                                                                        ''
                                                                }
                                                                id={
                                                                    temp
                                                                        ?.MataKuliah
                                                                        .Kode
                                                                }
                                                                checked={form.SanggahanAssesmenMk.some(
                                                                    (x) =>
                                                                        x.MataKuliahMahasiswaId ===
                                                                        mkm.MataKuliahMahasiswaId
                                                                )}
                                                                onCheckedChange={(
                                                                    checked
                                                                ) => {
                                                                    if (
                                                                        checked
                                                                    ) {
                                                                        setForm(
                                                                            {
                                                                                ...form,
                                                                                SanggahanAssesmenMk:
                                                                                    [
                                                                                        ...form.SanggahanAssesmenMk,
                                                                                        {
                                                                                            SanggahanAssesmenMkId:
                                                                                                '',
                                                                                            SanggahanAssesmenId:
                                                                                                '',
                                                                                            MataKuliahMahasiswaId:
                                                                                                mkm.MataKuliahMahasiswaId,
                                                                                            Keterangan:
                                                                                                mkm.Keterangan,
                                                                                            CreatedAt:
                                                                                                new Date(),
                                                                                            UpdatedAt:
                                                                                                new Date(),
                                                                                        },
                                                                                    ],
                                                                            }
                                                                        )
                                                                    } else {
                                                                        setForm(
                                                                            {
                                                                                ...form,
                                                                                SanggahanAssesmenMk:
                                                                                    form.SanggahanAssesmenMk.filter(
                                                                                        (
                                                                                            x
                                                                                        ) =>
                                                                                            x.MataKuliahMahasiswaId !==
                                                                                            mkm.MataKuliahMahasiswaId
                                                                                    ),
                                                                            }
                                                                        )
                                                                    }
                                                                }}
                                                            />
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        }
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </CardContent>
                {data.SanggahanAssesmen.SanggahanAssesmenId === '' && (
                    <CardFooter className="flex-col gap-2">
                        <Button
                            className="mt-5 hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer "
                            size={'lg'}
                            disabled={
                                loading ||
                                data.SanggahanAssesmen.SanggahanAssesmenId !==
                                    ''
                            }
                            onClick={() => save()}
                        >
                            {loading ? (
                                <>
                                    <Timer /> Loading
                                </>
                            ) : (
                                <>
                                    <PenLine />
                                    Simpan
                                </>
                            )}
                        </Button>
                    </CardFooter>
                )}
            </Card>
            {role?.Name.match('Asesor') && (
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Sanggahan Selesai ?</CardTitle>
                        <CardDescription>
                            Ketika sudah tidak ada sanggahan maka dapat
                            dilanjutkan ke proses final dan siap di buat kan SK.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <div className="flex items-start gap-3">
                            <Checkbox
                                disabled={loading}
                                id="yakin"
                                checked={yakin}
                                onCheckedChange={(checked) =>
                                    setYakin(checked ? true : false)
                                }
                            />
                            <div className="grid gap-2">
                                <Label htmlFor="yakin">Pernyataan</Label>
                                <p className="text-muted-foreground text-sm">
                                    Saya Yakin bahwa semua MK ini sudah sesuai
                                    dengan data dan fakta yang diberikan
                                </p>
                            </div>
                        </div>
                        <Button
                            className="mt-3 hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer "
                            type="button"
                            size={'sm'}
                            disabled={loading || !yakin}
                            onClick={() => continueToFinal()}
                        >
                            {loading ? (
                                <>
                                    <Timer /> Loading
                                </>
                            ) : (
                                <>
                                    Lanjutkan Ke Hasil Final
                                    <ChevronRight />
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            )}
            <SheetManageData
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                onSubmit={onSubmit}
                loading={loading}
                form={formPerbaikan}
            />
        </div>
    )
}

export default SanggahanIdComponent

export function SheetManageData({
    openDialog,
    setOpenDialog,
    onSubmit,
    loading,
    form,
}: {
    openDialog: boolean
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
    loading: boolean
    onSubmit: (data: SkorAssesmenFormValidation) => void
    form: UseFormReturn<SkorAssesmenFormValidation>
}) {
    return (
        <div className="grid grid-cols-2 gap-2">
            <Sheet open={openDialog} onOpenChange={setOpenDialog}>
                <SheetContent
                    side="right"
                    className="w-screen h-screen max-w-full overflow-scroll"
                >
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <SheetHeader>
                                <SheetTitle>Perbaikan</SheetTitle>
                                <SheetDescription>
                                    Perbaiki Nilai Mahasiswa
                                </SheetDescription>
                            </SheetHeader>
                            <div className="w-full grid grid-cols-1 gap-3 px-4">
                                <div className="container mx-auto">
                                    <div className="grid grid-cols-1 gap-3">
                                        <FormField
                                            control={form.control}
                                            name="Portofolio"
                                            disabled={loading}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Portofolio
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            readOnly={loading}
                                                            value={field.value}
                                                            onChange={(e) =>
                                                                field.onChange(
                                                                    parseInt(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                )
                                                            }
                                                            onBlur={
                                                                field.onBlur
                                                            }
                                                            name={field.name}
                                                            ref={field.ref}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Portofolio
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            disabled={loading}
                                            name="Tulis"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Tulis</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            readOnly={loading}
                                                            value={field.value}
                                                            onChange={(e) =>
                                                                field.onChange(
                                                                    parseInt(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                )
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Tulis
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="Wawancara"
                                            disabled={loading}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Wawancara
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            readOnly={loading}
                                                            value={field.value}
                                                            onChange={(e) =>
                                                                field.onChange(
                                                                    parseInt(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                )
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Wawancara
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="Demo"
                                            disabled={loading}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Demo</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            readOnly={loading}
                                                            value={field.value}
                                                            onChange={(e) =>
                                                                field.onChange(
                                                                    parseInt(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                )
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Demo
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="Diakui"
                                            disabled={loading}
                                            render={({ field }) => (
                                                <label
                                                    className={`border overflow-hidden rounded-xl my-2 p-4 shadow-sm cursor-pointer transition-all
                                                                                        ${
                                                                                            field.value
                                                                                                ? 'border-primary/50 bg-primary/20 dark:bg-gray-800 dark:border-gray-300 dark:text-gray-100'
                                                                                                : 'hover:shadow-md'
                                                                                        }
                                                                                        ${
                                                                                            loading
                                                                                                ? 'opacity-50 cursor-not-allowed'
                                                                                                : ''
                                                                                        }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="mr-2 hidden"
                                                        checked={field.value}
                                                        disabled={loading}
                                                        onChange={(e) =>
                                                            field.onChange(e)
                                                        }
                                                    />
                                                    <div className="font-semibold">
                                                        Diakui
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Mata Kuliah ini diakui
                                                        oleh Asesor
                                                    </div>
                                                </label>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            disabled={loading}
                                            name="SkorRataRata"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Skor Rata-Rata
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            readOnly={loading}
                                                            value={field.value}
                                                            onChange={(e) =>
                                                                field.onChange(
                                                                    parseInt(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                )
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        SkorRataRata
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="NilaiHuruf"
                                            disabled={loading}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Nilai Huruf
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            readOnly={loading}
                                                            value={
                                                                field.value ??
                                                                ''
                                                            }
                                                            onChange={
                                                                field.onChange
                                                            }
                                                            onBlur={
                                                                field.onBlur
                                                            }
                                                            name={field.name}
                                                            ref={field.ref}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        NilaiHuruf
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                            <SheetFooter>
                                <Button type="submit" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Timer />
                                            Loading
                                        </>
                                    ) : (
                                        <>
                                            <PenIcon /> Simpan
                                        </>
                                    )}
                                </Button>
                            </SheetFooter>
                        </form>
                    </Form>
                </SheetContent>
            </Sheet>
        </div>
    )
}
