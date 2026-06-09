'use client'

import { SanggahanAsessmenTypes } from '@/types/AsessmentTypes'
import React from 'react'
import { safeStorage } from '@/lib/safe-storage'
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
    MessageCircleQuestionIcon,
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
import { convertScoreToGrade, replaceItemAtIndex } from '@/lib/utils'
import { Badge } from '../ui/badge'
import { Checkbox } from '../ui/checkbox'
import Swal from '@/lib/swal'
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
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { ScrollArea } from '../ui/scroll-area'
import { TranskripNilaiType } from '@/types/EkuivalenCheck'
import { EkuivalenCheckSanggahanFormValidation, EkuivalenCheckSanggahanSchemaValidation } from '@/validation/EkuivalenCheckSanggahanValidation'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
import { createOrUpdateEkuivalenCheck } from '@/services/EkuivalenCheck/EkuivalenCheckServices'

const SanggahanIdComponent = ({
    dataServer,
    stats,
    transkripNilaiServer
}: {
    dataServer: SanggahanAsessmenTypes
    stats: { StatusMahasiswaAssesmentId: string; NamaStatus: string }
    transkripNilaiServer: TranskripNilaiType[]
}) => {
    const [statusServer, setStatusServer] = React.useState<{ StatusMahasiswaAssesmentId: string; NamaStatus: string }>({ StatusMahasiswaAssesmentId: stats.StatusMahasiswaAssesmentId, NamaStatus: stats.NamaStatus })
    const [role, setRole] = React.useState<Role | null>(null)
    const [yakin, setYakin] = React.useState<boolean>(false)
    React.useEffect(() => {
        if (role === null) {
            setLoading(true)
            const r = safeStorage.getItem('pmb.iti.role')
            if (r) {
                setRole(JSON.parse(r))
                setLoading(false)
            }
            setLoading(false)
        }
    }, [])
    const [openDialog, setOpenDialog] = React.useState<boolean>(false)
    const [openDialogQuestion, setOpenDialogQuestion] = React.useState<boolean>(false)
    const [data, setData] = React.useState(dataServer)
    const [jenisRpl, setJenisRpl] = React.useState<string>('')
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

    const formEkuivalen = useForm<EkuivalenCheckSanggahanFormValidation>({
        resolver: zodResolver(EkuivalenCheckSanggahanSchemaValidation),
        defaultValues: {
            TranskripNilaiIdSebelum: '',
            MataKuliahMahasiswaIdSebelum: '',
            TranskripNilaiIdSetelah: '',
            MataKuliahMahasiswaIdSetelah: '',
            NilaiAsessment: '',
            Diakui: false,
        },
    })


    const { control, setValue, watch } = formPerbaikan

    const portofolio = watch("Portofolio")
    const tulis = watch("Tulis")
    const wawancara = watch("Wawancara")
    const demo = watch("Demo")

    React.useEffect(() => {
        const scoresRaw = [portofolio, tulis, wawancara, demo]

        const scores = scoresRaw
            .map((s) => (typeof s === "string" ? parseInt(s) : s))
            .filter((s) => typeof s === "number" && !isNaN(s) && s !== 0)

        if (scores.length === 0) {
            setValue("SkorRataRata", 0, { shouldDirty: true })
            setValue("NilaiHuruf", "E", { shouldDirty: true })
            return
        }

        const sum = scores.reduce((acc, cur) => acc + cur, 0)
        let avg = Math.round(sum / scores.length)

        if (avg < 0) avg = 0
        if (avg > 100) avg = 100

        setValue("SkorRataRata", avg, { shouldDirty: true })
        setValue("NilaiHuruf", convertScoreToGrade(avg), { shouldDirty: true })

    }, [portofolio, tulis, wawancara, demo, setValue])

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
                    setStatusServer({ StatusMahasiswaAssesmentId: '3b610de5-9c8b-4f98-8214-29e1d954d40f', NamaStatus: 'Hasil Final Asessmen' })
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
            setJenisRpl(temp.Keterangan)
            if (temp.Keterangan == 'Transfer_SKS') {
                const skor = temp.TranskripNilai
                formEkuivalen.setValue('MataKuliahMahasiswaIdSebelum', temp.MataKuliahMahasiswaId)
                formEkuivalen.setValue('MataKuliahMahasiswaIdSetelah', temp.MataKuliahMahasiswaId)
                formEkuivalen.setValue('TranskripNilaiIdSebelum', skor.TranskripNilaiId)
                formEkuivalen.setValue('TranskripNilaiIdSetelah', skor.TranskripNilaiId)
                formEkuivalen.setValue('Diakui', skor.Diakui ?? false)
                formEkuivalen.setValue('NilaiAsessment', skor.NilaiAsessmen ?? '')

            }
            if (temp.Keterangan == 'Perolehan_SKS') {
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
            }
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

    const onSubmitEkuivalen = async (dataSend: EkuivalenCheckSanggahanFormValidation) => {
        await createOrUpdateEkuivalenCheck({
            TranskripNilaiIdSebelum: dataSend.TranskripNilaiIdSebelum,
            MataKuliahMahasiswaIdSebelum: dataSend.MataKuliahMahasiswaIdSebelum,
            TranskripNilaiIdSetelah: dataSend.TranskripNilaiIdSetelah,
            MataKuliahMahasiswaIdSetelah: dataSend.MataKuliahMahasiswaIdSetelah,
            NilaiAsessment: dataSend.NilaiAsessment,
            Diakui: dataSend.Diakui,
        }).then(res => {

            let idx = data.ProgramStudi.MataKuliahMahasiswa.findIndex(
                (d) =>
                    d.MataKuliahMahasiswaId ===
                    dataSend.MataKuliahMahasiswaIdSetelah
            )

            let dataOld = data.ProgramStudi.MataKuliahMahasiswa.find(
                (d) =>
                    d.MataKuliahMahasiswaId ===
                    dataSend.MataKuliahMahasiswaIdSetelah
            )

            let tn = transkripNilaiServer.find(x => x.TranskripNilaiId === dataSend.TranskripNilaiIdSetelah);

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
                            TranskripNilai: {
                                NilaiAsessmen: dataSend.NilaiAsessment,
                                Diakui: dataSend.Diakui,
                                TranskripNilaiId: dataSend.TranskripNilaiIdSetelah,
                                PendaftaranId: data.PendaftaranId,
                                KodeMataKuliah: tn ? tn.KodeMataKuliah : '',
                                NamaMataKuliah: tn ? tn.KodeMataKuliah : '',
                                Sks: tn ? tn.Sks : 0,
                                Nilai: tn ? tn.Nilai : '',
                                CreatedAt: dataOld ? dataOld.TranskripNilai.CreatedAt : new Date(),
                                UpdatedAt: new Date()
                            },
                        }
                    ),
                },
            })
            toast('Ekuivalen Berhasil Disimpan')
            setLoading(false)
            setOpenDialog(false)
        }).catch(err => console.error("Error: " + err))
    }

    return (
        <div className="grid grid-cols-1 gap-5">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Informasi</CardTitle>
                    <CardDescription>
                        Informasi mengenai Pendaftaran dan Program Studi
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
                        {statusServer.NamaStatus === 'Sanggahan' ? 'Mahasiswa Menyanggah MK yang dipilih. Silakan untuk mempelajari ulang dan/atau menghubungi mahasiswa jika ada pertanyaan Alasan Menyanggah lebih lanjut' : 'Sanggahan sudah ditandai Selesai dan diterukan ke proses Hasil Final Asessmen'}

                    </AlertDescription>
                </Alert>
            ) : data.SanggahanAssesmen.SanggahanAssesmenId !== '' ? (
                <Alert>
                    <InfoIcon />
                    <AlertTitle>{statusServer.NamaStatus === 'Sanggahan' ? 'Sanggahan Diterima' : 'Sanggahan Selesai'} </AlertTitle>
                    <AlertDescription>
                        {
                            statusServer.NamaStatus === 'Sanggahan' ? 'Sanggahan Anda sedang dipelajari oleh Asesor.' : 'Sanggahan Anda sudah ditandai Selesai dan dilanjutkan ke Proses Hasil Final Asessmen'
                        }

                    </AlertDescription>
                </Alert>
            ) : statusServer.NamaStatus === 'Sanggahan' ? (
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
            ) : <></>}
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
                                        {new Date(data.TanggalAsessmen).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <Separator className="my-3" />
                        {role?.Name.match('Mahasiswa') && (
                            <div className="grid grid-cols-1 gap-3">
                                <h1 className="font-bold">
                                    Silakan Dipilih antara Ya / Tidak
                                </h1>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <label
                                className={`border overflow-hidden rounded-xl my-2 p-4 shadow-sm cursor-pointer transition-all
                                            ${form.ProsesBanding
                                        ? 'border-primary/50 bg-primary/20 dark:bg-gray-800 dark:border-gray-300 dark:text-gray-100'
                                        : 'hover:shadow-md'
                                    }
                                            ${loading
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
                                            .SanggahanAssesmenId !== '' ||
                                        !role?.Name.match('Mahasiswa')
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
                                            ${form.DiskusiBanding
                                        ? 'border-primary/50 bg-primary/20 dark:bg-gray-800 dark:border-gray-300 dark:text-gray-100'
                                        : 'hover:shadow-md'
                                    }
                                            ${loading
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
                                            .SanggahanAssesmenId !== '' ||
                                        !role?.Name.match('Mahasiswa')
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
                                    {
                                        role?.Name === 'Mahasiswa' ? 'Apakah anda melibatkan pihak lain dalam menyanggah hasil asessmen ?' : 'Mahasiswa menyertakan Pihak Lain dalam menyanggah hasil asessmen'
                                    }
                                </p>
                            </div>
                            {role?.Name === 'Mahasiswa' ? (
                                <div className="flex justify-end w-full">
                                    <Button
                                        className="mr-2 hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer "
                                        size={'sm'}
                                        disabled={
                                            loading
                                        }
                                        onClick={() => setOpenDialogQuestion(true)}
                                    >
                                        <MessageCircleQuestionIcon />
                                    </Button>
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
                            ) : (
                                <div className="flex justify-end w-full">
                                    <Button
                                        className="mr-2 hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer "
                                        size={'sm'}
                                        disabled={
                                            loading
                                        }
                                        onClick={() => setOpenDialogQuestion(true)}
                                    >
                                        <MessageCircleQuestionIcon />
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
                                        <TableRow>
                                            <TableHead>Nama</TableHead>
                                            <TableHead>Jabatan</TableHead>
                                            <TableHead>Instansi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {form.SanggahanAssesmenPihak.map(
                                            (sap, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        <Input
                                                            className=""
                                                            readOnly={
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
                                                            readOnly={
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
                                                            readOnly={
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
                                                Skor Rata-rata
                                            </div>
                                        </TableHead>
                                        <TableHead rowSpan={2}>
                                            <div className={'text-center'}>
                                                Diakui
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
                                        {
                                            statusServer.NamaStatus === 'Sanggahan' && (
                                                <TableHead rowSpan={2}>
                                                    {role?.Name.match('Asesor')
                                                        ? 'Perbaiki'
                                                        : 'Sanggah'}
                                                </TableHead>
                                            )
                                        }
                                    </TableRow>
                                </TableHeader>
                                {role?.Name.match('Mahasiswa') ? (
                                    <TableBody>
                                        {data.ProgramStudi.MataKuliahMahasiswa.map(
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
                                                            {
                                                                temp?.MataKuliah
                                                                    .Kode
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                temp?.MataKuliah
                                                                    .Nama
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                temp?.Keterangan === 'Transfer_SKS' ? '-' : temp
                                                                    ?.SkorAsessmen
                                                                    .Portofolio
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                temp?.Keterangan === 'Transfer_SKS' ? '-' : temp
                                                                    ?.SkorAsessmen
                                                                    .Tulis
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                temp?.Keterangan === 'Transfer_SKS' ? '-' : temp
                                                                    ?.SkorAsessmen
                                                                    .Wawancara
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                temp?.Keterangan === 'Transfer_SKS' ? '-' : temp
                                                                    ?.SkorAsessmen
                                                                    .Demo
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                temp?.Keterangan === 'Transfer_SKS' ? '-' : temp
                                                                    ?.SkorAsessmen
                                                                    .SkorRataRata
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {((temp?.Keterangan === 'Transfer_SKS') ? temp.TranskripNilai.Diakui : temp?.SkorAsessmen
                                                                .Diakui) ? (
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
                                                                temp?.Keterangan === 'Transfer_SKS' ? temp.TranskripNilai.NilaiAsessmen : temp
                                                                    ?.SkorAsessmen
                                                                    .NilaiHuruf
                                                            }
                                                        </TableCell>
                                                        {
                                                            statusServer.NamaStatus === 'Sanggahan' && (
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
                                                            )
                                                        }
                                                    </TableRow>
                                                )
                                            }
                                        )}
                                    </TableBody>
                                ) : role?.Name.match('Asesor') ? (
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
                                                            {
                                                                temp?.MataKuliah
                                                                    .Kode
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                temp?.MataKuliah
                                                                    .Nama
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                temp?.Keterangan === 'Transfer_SKS' ? '-' : temp
                                                                    ?.SkorAsessmen
                                                                    .Portofolio
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                temp?.Keterangan === 'Transfer_SKS' ? '-' : temp
                                                                    ?.SkorAsessmen
                                                                    .Tulis
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                temp?.Keterangan === 'Transfer_SKS' ? '-' : temp
                                                                    ?.SkorAsessmen
                                                                    .Wawancara
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                temp?.Keterangan === 'Transfer_SKS' ? '-' : temp
                                                                    ?.SkorAsessmen
                                                                    .Demo
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                temp?.Keterangan === 'Transfer_SKS' ? '-' : temp
                                                                    ?.SkorAsessmen
                                                                    .SkorRataRata
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {((temp?.Keterangan === 'Transfer_SKS') ? temp.TranskripNilai.Diakui : temp?.SkorAsessmen
                                                                .Diakui) ? (
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
                                                                temp?.Keterangan === 'Transfer_SKS' ? temp.TranskripNilai.NilaiAsessmen : temp
                                                                    ?.SkorAsessmen
                                                                    .NilaiHuruf
                                                            }
                                                        </TableCell>
                                                        {
                                                            statusServer.NamaStatus === 'Sanggahan' && (
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
                                                            )
                                                        }
                                                    </TableRow>
                                                )
                                            }
                                        )}
                                    </TableBody>
                                ) : (
                                    <></>
                                )}
                            </Table>
                        </div>
                    </div>
                </CardContent>
                {data.SanggahanAssesmen.SanggahanAssesmenId === '' && statusServer.NamaStatus === 'Sanggahan' &&
                    role?.Name === 'Mahasiswa' ? (
                    <CardFooter className="flex-col gap-2">
                        <Button
                            className="mt-5 hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer "
                            size={'lg'}
                            disabled={
                                loading ||
                                data.SanggahanAssesmen
                                    .SanggahanAssesmenId !== ''
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
                ) : <></>}
            </Card>
            {role?.Name.match('Asesor') && statusServer.NamaStatus === 'Sanggahan' ? (
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
            ) : role?.Name.match('Asesor') ? (<Card className="w-full">
                <CardHeader>
                    <CardTitle>Sanggahan Selesai</CardTitle>
                    <CardDescription>
                        Status sudah diteruskan ke Hasil Final Asessmen
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <p>Sanggahan sudah Diselesaikan</p>
                </CardContent>
            </Card>) : <></>}
            <SheetManageData
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                onSubmit={onSubmit}
                loading={loading}
                form={formPerbaikan}
                jenisRpl={jenisRpl}
                formEkuivalen={formEkuivalen}
                onSubmitEkuivalen={onSubmitEkuivalen}
                transkripNilaiServer={transkripNilaiServer}
            />
            <Dialog open={openDialogQuestion} onOpenChange={setOpenDialogQuestion}>
                <DialogContent className="w-[80vw] h-[80vh] max-w-[80vw] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Panduan</DialogTitle>
                        <DialogDescription>
                            Panduan Menyertakan Pihak Lain untuk Mendukung Sanggahan Asessmen
                        </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="flex-1 pr-4 overflow-hidden">
                        <div className="grid grid-cols-1 items-start gap-4 text-sm leading-relaxed">

                            <div className="space-y-2">
                                <h3 className="font-semibold">Pihak yang Disarankan untuk Mendukung Sanggahan</h3>
                                <p>
                                    Seseorang yang dapat Anda sertakan untuk mendukung sanggahan asesmen sebaiknya berasal
                                    dari pihak yang dapat memberikan verifikasi objektif terhadap pengalaman, kompetensi,
                                    atau bukti yang Anda ajukan, seperti:
                                </p>

                                <ul className="list-disc ml-6 space-y-1">
                                    <li>Dosen pembimbing tempat Anda menempuh pendidikan sebelumnya</li>
                                    <li>Manajer di tempat Anda bekerja</li>
                                    <li>Atasan langsung yang mengetahui kinerja dan tugas Anda</li>
                                    <li>Rekan kerja yang pernah berkolaborasi dalam proyek relevan</li>
                                    <li>Instruktur atau pelatih profesional yang pernah membimbing Anda</li>
                                    <li>Pihak institusi atau lembaga pelatihan yang mengeluarkan sertifikat Anda</li>
                                    <li>Tokoh profesional yang dapat mengonfirmasi kompetensi atau pengalaman Anda</li>
                                </ul>
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-semibold">Kriteria Individu yang Anda Sertakan</h3>
                                <p>
                                    Pastikan individu yang Anda sertakan memenuhi kriteria berikut agar keterangannya dapat
                                    dijadikan pertimbangan oleh asesor:
                                </p>

                                <ul className="list-disc ml-6 space-y-1">
                                    <li>Memiliki hubungan profesional yang jelas dengan Anda</li>
                                    <li>Dapat memberikan penjelasan objektif mengenai kompetensi yang Anda sanggah</li>
                                    <li>Memahami konteks pekerjaan atau pembelajaran Anda</li>
                                    <li>Mampu memberikan verifikasi tertulis atau lisan jika diminta oleh asesor</li>
                                </ul>
                            </div>

                        </div>
                    </ScrollArea>

                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button type="button" variant="default">
                                Tutup
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
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
    jenisRpl,
    formEkuivalen,
    onSubmitEkuivalen,
    transkripNilaiServer
}: {
    openDialog: boolean
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
    loading: boolean
    onSubmit: (data: SkorAssesmenFormValidation) => void
    form: UseFormReturn<SkorAssesmenFormValidation>
    jenisRpl: string,
    formEkuivalen: UseFormReturn<EkuivalenCheckSanggahanFormValidation>
    onSubmitEkuivalen: (data: EkuivalenCheckSanggahanFormValidation) => void
    transkripNilaiServer: TranskripNilaiType[]
}) {
    return (
        <div className="grid grid-cols-2 gap-2">
            <Sheet open={openDialog} onOpenChange={setOpenDialog}>
                <SheetContent
                    side="right"
                    className="w-screen h-screen max-w-full overflow-scroll"
                >
                    {jenisRpl === 'Perolehan_SKS' ? (
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
                                                                                        ${field.value
                                                                ? 'border-primary/50 bg-primary/20 dark:bg-gray-800 dark:border-gray-300 dark:text-gray-100'
                                                                : 'hover:shadow-md'
                                                            }
                                                                                        ${loading
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
                                                                readOnly
                                                                value={field.value}
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
                                                                readOnly
                                                                value={
                                                                    field.value ??
                                                                    ''
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
                    ) : jenisRpl === 'Transfer_SKS' ? (
                        <Form {...formEkuivalen}>
                            <form onSubmit={formEkuivalen.handleSubmit(onSubmitEkuivalen)}>
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
                                                control={formEkuivalen.control}
                                                name="TranskripNilaiIdSetelah"
                                                disabled={loading}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Mata Kuliah PT. Asal
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                value={field.value}
                                                                onValueChange={(e) => field.onChange(e)}
                                                                disabled={loading}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Mata Kuliah Transkrip Nilai" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectGroup>
                                                                        <SelectLabel>Mata Kuliah PT. Asal</SelectLabel>
                                                                        {
                                                                            transkripNilaiServer.map((item) => (
                                                                                <SelectItem key={item.TranskripNilaiId} value={item.TranskripNilaiId}>
                                                                                    ({item.KodeMataKuliah}) {item.NamaMataKuliah} - ({item.Sks} SKS - {item.Nilai})
                                                                                </SelectItem>
                                                                            ))
                                                                        }
                                                                    </SelectGroup>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Mata Kuliah PT. Asal yang dikonversi ke Mata Kuliah PT. Tujuan
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={formEkuivalen.control}
                                                name="NilaiAsessment"
                                                disabled={loading}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Nilai
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                value={field.value}
                                                                onValueChange={(e) => field.onChange(e)}
                                                                disabled={loading}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih nilai assessment" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectGroup>
                                                                        <SelectLabel>Nilai</SelectLabel>
                                                                        <SelectItem value="A">A</SelectItem>
                                                                        <SelectItem value="A-">A-</SelectItem>
                                                                        <SelectItem value="B+">B+</SelectItem>
                                                                        <SelectItem value="B">B</SelectItem>
                                                                        <SelectItem value="B-">B-</SelectItem>
                                                                        <SelectItem value="C+">C+</SelectItem>
                                                                        <SelectItem value="C">C</SelectItem>
                                                                        <SelectItem value="C-">C-</SelectItem>
                                                                        <SelectItem value="D">D</SelectItem>
                                                                        <SelectItem value="E">E</SelectItem>
                                                                    </SelectGroup>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Nilai
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={formEkuivalen.control}
                                                name="Diakui"
                                                disabled={loading}
                                                render={({ field }) => (
                                                    <label
                                                        className={`border overflow-hidden rounded-xl my-2 p-4 shadow-sm cursor-pointer transition-all
                                                                                        ${field.value
                                                                ? 'border-primary/50 bg-primary/20 dark:bg-gray-800 dark:border-gray-300 dark:text-gray-100'
                                                                : 'hover:shadow-md'
                                                            }
                                                                                        ${loading
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
                                        </div>
                                    </div>
                                </div>
                                <SheetFooter>
                                    <Button className='hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer' type="submit" disabled={loading}>
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
                    ) : (<div></div>)}
                </SheetContent>
            </Sheet>
        </div>
    )
}
