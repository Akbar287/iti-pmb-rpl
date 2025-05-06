'use client'
import React from 'react'
import { Label } from '@/components/ui/label'
import {
    ChevronLeft,
    ChevronRight,
    InfoIcon,
    ListIcon,
    PenLine,
    Timer,
    X,
} from 'lucide-react'
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarInset,
} from '@/components/ui/sidebar'
import { Button } from '../ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog'
import { MataKuliahMahasiswaCapaianPembelajaranTypes } from '@/types/DaftarUlangProdi'
import { Badge } from '../ui/badge'
import { replaceItemAtIndex, truncateText } from '@/lib/utils'
import { ProfiensiPengetahuan } from '@/generated/prisma'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../ui/card'
import { Separator } from '../ui/separator'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { toast } from 'sonner'
import { setEvaluasiDiri } from '@/services/EvaluasiMandiri/EvaluasiDiriService'

const EvaluasiMandiriId = ({
    dataServer,
    buktiFormServer,
}: {
    dataServer: MataKuliahMahasiswaCapaianPembelajaranTypes
    buktiFormServer: {
        JenisDokumen: {
            Jenis: string
            NomorDokumen: number
            JenisDokumenId: string
        }
        BuktiFormId: string
        NamaFile: string
        NamaDokumen: string
    }[]
}) => {
    const [data, setData] = React.useState(dataServer)
    const [index, setIndex] = React.useState<number>(0)
    const [activeCapaian, setActiveCapaian] = React.useState<string | null>(
        data[index].CapaianPembelajaran.length === 0
            ? null
            : data[index].CapaianPembelajaran[0].CapaianPembelajaranId || null
    )
    const [form, setForm] = React.useState<{
        ProfiensiPengetahuan: ProfiensiPengetahuan
        BuktiForm: string[]
    }>({
        ProfiensiPengetahuan:
            data[index].CapaianPembelajaran.length === 0
                ? ProfiensiPengetahuan.TIDAK_PERNAH
                : data[index].CapaianPembelajaran[0].EvaluasiDiri !== null
                ? data[index].CapaianPembelajaran[0].EvaluasiDiri
                      .ProfiensiPengetahuan
                : ProfiensiPengetahuan.TIDAK_PERNAH,
        BuktiForm:
            data[index].CapaianPembelajaran.length === 0
                ? []
                : data[index].CapaianPembelajaran[0].EvaluasiDiri !== null
                ? data[index].CapaianPembelajaran[0].EvaluasiDiri.BuktiForm.map(
                      (bf) => String(bf.BuktiFormId)
                  )
                : [],
    })
    const [loading, setLoading] = React.useState<boolean>(false)
    const [openDialog, setOpenDialog] = React.useState<boolean>(false)

    const nextActiveItem = () => {
        if (index + 1 !== data.length) {
            setIndex(index + 1)
            setActiveCapaian(
                data[index + 1].CapaianPembelajaran.length === 0
                    ? null
                    : data[index + 1].CapaianPembelajaran[0]
                          .CapaianPembelajaranId || null
            )
            setForm({
                ProfiensiPengetahuan: ProfiensiPengetahuan.TIDAK_PERNAH,
                BuktiForm: [],
            })
        }
    }
    const beforeActiveItem = () => {
        if (index - 1 !== -1) {
            setIndex(index - 1)
            setActiveCapaian(
                data[index - 1].CapaianPembelajaran.length === 0
                    ? null
                    : data[index - 1].CapaianPembelajaran[0]
                          .CapaianPembelajaranId || null
            )
            setForm({
                ProfiensiPengetahuan: ProfiensiPengetahuan.TIDAK_PERNAH,
                BuktiForm: [],
            })
        }
    }
    const saveEval = () => {
        if (activeCapaian) {
            setLoading(true)
            setEvaluasiDiri({
                PendaftaranId: data[index].PendaftaranId,
                CapaianPembelajaranId: activeCapaian,
                MataKuliahMahasiswaId: data[index].MataKuliahMahasiswaId,
                ProfiensiPengetahuan: form.ProfiensiPengetahuan,
                TanggalPengesahan: null,
                BuktiForm: form.BuktiForm,
            })
                .then((res) => {
                    const EvaluasiDiri = res

                    let idx = data[index].CapaianPembelajaran.findIndex(
                        (cp) => cp.CapaianPembelajaranId === activeCapaian
                    )
                    let temp = replaceItemAtIndex(
                        data[index].CapaianPembelajaran,
                        idx,
                        {
                            ...data[index].CapaianPembelajaran[idx],
                            EvaluasiDiri: EvaluasiDiri,
                        }
                    )

                    setData(
                        replaceItemAtIndex(data, index, {
                            ...data[index],
                            CapaianPembelajaran: temp,
                        })
                    )
                    toast('Berhasil Menyimpan Evaluasi Diri.')
                    setLoading(false)
                })
                .catch((err) => {
                    setLoading(false)
                    toast('Terjadi Kesalahan. Mohon cek Koneksi Internet Anda')
                })
        }
    }

    return (
        <React.Fragment>
            <SidebarInset className="mr-[300px]">
                <div className="w-full">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {data[index].CapaianPembelajaran.find(
                                    (cp) =>
                                        cp.CapaianPembelajaranId ===
                                        activeCapaian
                                ) !== undefined
                                    ? 'Urutan #' +
                                      data[index].CapaianPembelajaran.find(
                                          (cp) =>
                                              cp.CapaianPembelajaranId ===
                                              activeCapaian
                                      )?.Urutan +
                                      ' '
                                    : 'Silakan Pilih Capaian Pembelajaran '}

                                {data[index].CapaianPembelajaran.find(
                                    (cp) =>
                                        cp.CapaianPembelajaranId ===
                                        activeCapaian
                                )?.EvaluasiDiri !== null ? (
                                    <Badge variant={'default'}>Selesai</Badge>
                                ) : (
                                    ''
                                )}
                            </CardTitle>
                            <CardDescription>
                                Silakan Pilih Profisiensi Pengetahuan Anda dalam
                                menilai
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="w-full my-2 border border-gray-300 px-4 py-2 overflow-hidden text-lg rounded-lg">
                                {data[index].CapaianPembelajaran.find(
                                    (cp) =>
                                        cp.CapaianPembelajaranId ===
                                        activeCapaian
                                ) !== undefined
                                    ? data[index].CapaianPembelajaran.find(
                                          (cp) =>
                                              cp.CapaianPembelajaranId ===
                                              activeCapaian
                                      )?.Nama
                                    : 'Capaian Pembelajaran akan muncul disini'}
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col">
                            {data[index].CapaianPembelajaran.find(
                                (cp) =>
                                    cp.CapaianPembelajaranId === activeCapaian
                            ) === undefined ? (
                                <></>
                            ) : (
                                <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <label
                                        className={`flex cursor-pointer flex-col rounded-2xl border p-4 shadow transition-all hover:shadow-md ${
                                            form.ProfiensiPengetahuan ===
                                            ProfiensiPengetahuan.TIDAK_PERNAH
                                                ? 'border-primary/50 bg-primary/20 dark:bg-gray-800 dark:border-gray-300 dark:text-gray-100'
                                                : 'border-gray-300'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="cardOption"
                                            disabled={loading}
                                            value={
                                                ProfiensiPengetahuan.TIDAK_PERNAH
                                            }
                                            checked={
                                                form.ProfiensiPengetahuan ===
                                                ProfiensiPengetahuan.TIDAK_PERNAH
                                            }
                                            onChange={() =>
                                                setForm({
                                                    ...form,
                                                    ProfiensiPengetahuan:
                                                        ProfiensiPengetahuan.TIDAK_PERNAH,
                                                })
                                            }
                                            className="peer hidden"
                                        />
                                        <div className="text-lg text-center font-medium">
                                            Tidak Pernah
                                        </div>
                                    </label>
                                    <label
                                        className={`flex cursor-pointer flex-col rounded-2xl border p-4 shadow transition-all hover:shadow-md ${
                                            form.ProfiensiPengetahuan ===
                                            ProfiensiPengetahuan.BAIK
                                                ? 'border-primary/50 bg-primary/20 dark:bg-gray-800 dark:border-gray-300 dark:text-gray-100'
                                                : 'border-gray-300'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="cardOption"
                                            value={ProfiensiPengetahuan.BAIK}
                                            disabled={loading}
                                            checked={
                                                form.ProfiensiPengetahuan ===
                                                ProfiensiPengetahuan.BAIK
                                            }
                                            onChange={() =>
                                                setForm({
                                                    ...form,
                                                    ProfiensiPengetahuan:
                                                        ProfiensiPengetahuan.BAIK,
                                                })
                                            }
                                            className="peer hidden"
                                        />
                                        <div className="text-lg text-center font-medium">
                                            Baik
                                        </div>
                                    </label>
                                    <label
                                        className={`flex cursor-pointer flex-col rounded-2xl border p-4 shadow transition-all hover:shadow-md ${
                                            form.ProfiensiPengetahuan ===
                                            ProfiensiPengetahuan.SANGAT_BAIK
                                                ? 'border-primary/50 bg-primary/20 dark:bg-gray-800 dark:border-gray-300 dark:text-gray-100'
                                                : 'border-gray-300'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="cardOption"
                                            disabled={loading}
                                            value={
                                                ProfiensiPengetahuan.SANGAT_BAIK
                                            }
                                            checked={
                                                form.ProfiensiPengetahuan ===
                                                ProfiensiPengetahuan.SANGAT_BAIK
                                            }
                                            onChange={() =>
                                                setForm({
                                                    ...form,
                                                    ProfiensiPengetahuan:
                                                        ProfiensiPengetahuan.SANGAT_BAIK,
                                                })
                                            }
                                            className="peer hidden"
                                        />
                                        <div className="text-lg text-center font-medium">
                                            Sangat Baik
                                        </div>
                                    </label>
                                </form>
                            )}
                        </CardFooter>
                    </Card>
                    <Card className="my-3">
                        <CardHeader>
                            <CardTitle>Bukti Dokumen</CardTitle>
                            <CardDescription>
                                Bukti Dokumen mendukung pernyataan anda sehingga
                                asesor confidence dalam menilai (Max: 3 Dokumen)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {data[index].CapaianPembelajaran.find(
                                (cp) =>
                                    cp.CapaianPembelajaranId === activeCapaian
                            ) === undefined ? (
                                <h1>Silakan anda pilih Capaian Pembelajaran</h1>
                            ) : buktiFormServer.length === 0 ? (
                                <h1>
                                    Anda Belum Upload Dokumen Apapun. Silakan ke
                                    Menu Upload Dokumen
                                </h1>
                            ) : (
                                <form className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {buktiFormServer
                                        .slice(0, 30)
                                        .map((dokumen) => {
                                            const isChecked =
                                                form.BuktiForm.includes(
                                                    dokumen.BuktiFormId
                                                )
                                            const isDisabled =
                                                !isChecked &&
                                                form.BuktiForm.length >= 15

                                            return (
                                                <label
                                                    key={dokumen.BuktiFormId}
                                                    className={`border overflow-hidden rounded-xl p-4 shadow-sm cursor-pointer transition-all
            ${
                isChecked
                    ? 'border-primary/50 bg-primary/20 dark:bg-gray-800 dark:border-gray-300 dark:text-gray-100'
                    : 'hover:shadow-md'
            }
            ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="mr-2"
                                                        checked={isChecked}
                                                        disabled={
                                                            isDisabled ||
                                                            loading
                                                        }
                                                        onChange={() =>
                                                            setForm({
                                                                ...form,
                                                                BuktiForm:
                                                                    form.BuktiForm.includes(
                                                                        dokumen.BuktiFormId
                                                                    )
                                                                        ? form.BuktiForm.filter(
                                                                              (
                                                                                  bf
                                                                              ) =>
                                                                                  bf !==
                                                                                  dokumen.BuktiFormId
                                                                          )
                                                                        : form
                                                                              .BuktiForm
                                                                              .length <
                                                                          3
                                                                        ? [
                                                                              ...form.BuktiForm,
                                                                              dokumen.BuktiFormId,
                                                                          ]
                                                                        : form.BuktiForm,
                                                            })
                                                        }
                                                    />
                                                    <div className="font-semibold">
                                                        {
                                                            dokumen.JenisDokumen
                                                                .Jenis
                                                        }
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Nomor:{' '}
                                                        {
                                                            dokumen.JenisDokumen
                                                                .NomorDokumen
                                                        }
                                                    </div>
                                                </label>
                                            )
                                        })}
                                    <div className="col-span-full text-sm text-gray-500 mt-2">
                                        Dipilih: {form.BuktiForm.length} / 3
                                    </div>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                    <Card className="my-3">
                        <CardHeader>
                            <CardTitle>Simpan Hasil Evaluasi Anda</CardTitle>
                            <CardDescription>
                                Simpan Hasil Evaluasi Mandiri
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="w-full flex justify-center items-center">
                            <Button
                                className="mt-5 hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer "
                                type="button"
                                size={'lg'}
                                disabled={(!activeCapaian && !index) || loading}
                                onClick={() => saveEval()}
                            >
                                {loading ? (
                                    <>
                                        <Timer /> Loading
                                    </>
                                ) : (
                                    <>
                                        <PenLine />
                                        Simpan{' '}
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                    <Separator className="my-2" />
                    <Alert>
                        <InfoIcon className="h-4 w-4" />
                        <AlertTitle>Cara Pengisian</AlertTitle>
                        <AlertDescription>
                            Silakan Pilih 3 Opsi (Tidak Pernah, Baik dan Sangat
                            Baik) untuk menentukan posisi pengetahuan anda
                            terhadap pertanyaan yang tetera
                        </AlertDescription>
                    </Alert>
                </div>
            </SidebarInset>
            <Sidebar
                side="right"
                variant="inset"
                collapsible="none"
                className="fixed right-0 top-0  h-screen w-[300px] bg-background border-l overflow-y-auto"
            >
                <SidebarHeader className="gap-3.5 border-b p-4">
                    <div className="flex w-full items-center justify-between">
                        <Label className="flex items-center gap-2 text-sm">
                            <Button
                                onClick={() => beforeActiveItem()}
                                disabled={index - 1 === -1}
                                className="bg-transparent text-gray-800 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-600 hover:scale-105 active:scale-95"
                            >
                                <ChevronLeft className="shadow-none" />
                            </Button>
                        </Label>
                        <div className="text-base font-medium text-foreground">
                            {data[index].Nama}
                        </div>
                        <Label className="flex items-center gap-2 text-sm">
                            <Button
                                onClick={() => nextActiveItem()}
                                disabled={index + 1 === data.length}
                                className="bg-transparent text-gray-800 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-600 hover:scale-105 active:scale-95"
                            >
                                <ChevronRight className="shadow-none" />
                            </Button>
                        </Label>
                    </div>
                    <Button
                        className="mt-5 bg-gray-100 text-gray-800 dark:text-gray-300 dark:bg-gray-600 hover:scale-105 active:scale-95 transition-all duration-100 cursor-pointer "
                        type="button"
                        onClick={() => setOpenDialog(true)}
                    >
                        <ListIcon /> Lihat Semua Mata Kuliah
                    </Button>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup className="px-0">
                        <SidebarGroupContent>
                            {data[index].CapaianPembelajaran.sort(
                                (a, b) => a.Urutan - b.Urutan
                            ).map((cp) => (
                                <a
                                    href="#"
                                    onClick={() => {
                                        if (!loading) {
                                            setActiveCapaian(
                                                cp.CapaianPembelajaranId
                                            )
                                            setForm({
                                                ProfiensiPengetahuan:
                                                    cp.EvaluasiDiri
                                                        ?.ProfiensiPengetahuan ||
                                                    ProfiensiPengetahuan.TIDAK_PERNAH,
                                                BuktiForm:
                                                    cp.EvaluasiDiri?.BuktiForm?.map(
                                                        (bf) =>
                                                            String(
                                                                bf.BuktiFormId
                                                            )
                                                    ) || [],
                                            })
                                        }
                                    }}
                                    key={cp.CapaianPembelajaranId}
                                    className={`${
                                        loading && 'cursor-not-allowed'
                                    } flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`}
                                >
                                    <div className="flex w-full items-center gap-2">
                                        <span>Urutan #{cp.Urutan}</span>{' '}
                                        <span className="ml-auto text-xs">
                                            <Badge
                                                className={
                                                    cp.EvaluasiDiri !== null
                                                        ? `bg-green-500`
                                                        : `bg-red-500`
                                                }
                                            >
                                                {cp.EvaluasiDiri !== null
                                                    ? `Sudah`
                                                    : `Belum`}
                                            </Badge>
                                        </span>
                                    </div>
                                    <span className="font-medium">
                                        {truncateText(cp.Nama, 25)}
                                    </span>
                                </a>
                            ))}
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
            <DialogMataKuliahMahasiswaRpl
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                loading={loading}
                data={data}
                index={index}
                setIndex={setIndex}
                setActiveCapaian={setActiveCapaian}
                setForm={setForm}
            />
        </React.Fragment>
    )
}

export default EvaluasiMandiriId

function DialogMataKuliahMahasiswaRpl({
    openDialog,
    setOpenDialog,
    loading,
    data,
    index,
    setActiveCapaian,
    setIndex,
    setForm,
}: {
    openDialog: boolean
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
    loading: boolean
    data: MataKuliahMahasiswaCapaianPembelajaranTypes
    index: number
    setIndex: React.Dispatch<React.SetStateAction<number>>
    setActiveCapaian: React.Dispatch<React.SetStateAction<string | null>>
    setForm: React.Dispatch<
        React.SetStateAction<{
            ProfiensiPengetahuan: ProfiensiPengetahuan
            BuktiForm: string[]
        }>
    >
}) {
    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className="w-full max-h-[80vh] overflow-y-scroll">
                <DialogHeader>
                    <DialogTitle>Mata Kuliah RPL</DialogTitle>
                    <DialogDescription>
                        Berikut ini Mata Kuliah yang dipilih untuk RPL
                    </DialogDescription>
                </DialogHeader>
                <div className="w-full justify-center md:justify-between">
                    <div className="grid grid-cols-1 gap-4 py-4">
                        <SidebarGroup className="px-0">
                            <SidebarGroupContent>
                                {data.map((d) => (
                                    <a
                                        href="#"
                                        onClick={() => {
                                            let idx = data.findIndex(
                                                (dat) =>
                                                    dat.MataKuliahId ==
                                                    d.MataKuliahId
                                            )
                                            if (index != idx) {
                                                setIndex(idx)
                                                setActiveCapaian(
                                                    data[idx]
                                                        .CapaianPembelajaran
                                                        .length === 0
                                                        ? null
                                                        : data[idx]
                                                              .CapaianPembelajaran[0]
                                                              .CapaianPembelajaranId ||
                                                              null
                                                )
                                                setForm({
                                                    ProfiensiPengetahuan:
                                                        ProfiensiPengetahuan.TIDAK_PERNAH,
                                                    BuktiForm: [],
                                                })
                                            }
                                            setOpenDialog(false)
                                        }}
                                        key={d.MataKuliahMahasiswaId}
                                        className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                    >
                                        <div className="flex w-full items-center gap-2">
                                            <span>
                                                {truncateText(d.Nama, 35)}
                                            </span>{' '}
                                            {d.Rpl && <Badge>RPL</Badge>}
                                            <span className="ml-auto text-xs">
                                                {d.Kode}
                                            </span>
                                        </div>
                                        <span className="font-medium">
                                            {d.CapaianPembelajaran.length}{' '}
                                            {' Capaian'}
                                        </span>
                                        <span className="line-clamp-2 w-[260px] whitespace-break-spaces text-xs">
                                            {d.Sks} SKS
                                        </span>
                                    </a>
                                ))}
                            </SidebarGroupContent>
                        </SidebarGroup>
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
                        }}
                    >
                        <X className="w-4 h-4" />
                        Tutup
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
