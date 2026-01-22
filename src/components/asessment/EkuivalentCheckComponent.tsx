'use client'
import { EkuivalenCheckAsessmenType } from '@/types/EkuivalenCheck'
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../ui/card'
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarInset,
} from '@/components/ui/sidebar'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Label } from '../ui/label'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '../ui/select'
import { Checkbox } from '../ui/checkbox'
import { Separator } from '../ui/separator'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import {
    ChevronLeft,
    ChevronRight,
    FileTextIcon,
    InfoIcon,
    ListIcon,
    PenLine,
    ScanEye,
    Timer,
    Trash2,
    X,
} from 'lucide-react'
import { toast } from 'sonner'
import { createOrUpdateEkuivalenCheck, deleteEkuivalenCheck } from '@/services/EkuivalenCheck/EkuivalenCheckServices'
import { truncateText, replaceItemAtIndex } from '@/lib/utils'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table'
import { BuktiFormTypes } from '@/types/BuktiFormUploadDokumenTypes'
import { getFileBlobByNamafile } from '@/services/UploadDokumenService'
import { Skeleton } from '../ui/skeleton'

export default function EkuivalentCheckComponent({
    nama,
    dataServer
}: {
    nama: string,
    dataServer: EkuivalenCheckAsessmenType
}) {
    const [data, setData] = React.useState(dataServer.MataKuliahMahasiswa)
    const [index, setIndex] = React.useState<number>(0)
    const [loading, setLoading] = React.useState<boolean>(false)
    const [openDialog, setOpenDialog] = React.useState<boolean>(false)
    const [previewTemp, setPreviewTemp] = React.useState<EkuivalenCheckAsessmenType['BuktiFormEvaluasiDiri'] | null>(
        null
    )
    const [openDialogFile, setOpenDialogFile] = React.useState<boolean>(false)
    const [pdfPreviewUrl, setPdfPreviewUrl] = React.useState<string | null>(null)

    // Form state for current mata kuliah
    const [form, setForm] = React.useState<{
        TranskripNilaiId: string
        NilaiAsessment: string
        Diakui: boolean
    }>({
        TranskripNilaiId: data[index]?.TranskripNilai?.TranskripNilaiId || '',
        NilaiAsessment: data[index]?.TranskripNilai?.NilaiAsessment || '',
        Diakui: data[index]?.TranskripNilai?.Diakui || false,
    })

    // State untuk menyimpan ID sebelumnya (untuk update/replace)
    const [previousIds, setPreviousIds] = React.useState<{
        TranskripNilaiIdSebelum: string
        MataKuliahMahasiswaIdSebelum: string
    }>({
        TranskripNilaiIdSebelum: data[index]?.TranskripNilai?.TranskripNilaiId || '',
        MataKuliahMahasiswaIdSebelum: data[index]?.MataKuliahMahasiswaId || '',
    })

    const currentMataKuliah = data[index]
    const hasExistingRelation = currentMataKuliah?.TranskripNilai?.TranskripNilaiId !== ''

    const nextActiveItem = () => {
        if (index + 1 < data.length) {
            const nextIndex = index + 1
            setIndex(nextIndex)
            setForm({
                TranskripNilaiId: data[nextIndex]?.TranskripNilai?.TranskripNilaiId || '',
                NilaiAsessment: data[nextIndex]?.TranskripNilai?.NilaiAsessment || '',
                Diakui: data[nextIndex]?.TranskripNilai?.Diakui || false,
            })
            // Update previousIds untuk mata kuliah berikutnya
            setPreviousIds({
                TranskripNilaiIdSebelum: data[nextIndex]?.TranskripNilai?.TranskripNilaiId || '',
                MataKuliahMahasiswaIdSebelum: data[nextIndex]?.MataKuliahMahasiswaId || '',
            })
        }
    }

    const beforeActiveItem = () => {
        if (index - 1 >= 0) {
            const prevIndex = index - 1
            setIndex(prevIndex)
            setForm({
                TranskripNilaiId: data[prevIndex]?.TranskripNilai?.TranskripNilaiId || '',
                NilaiAsessment: data[prevIndex]?.TranskripNilai?.NilaiAsessment || '',
                Diakui: data[prevIndex]?.TranskripNilai?.Diakui || false,
            })
            // Update previousIds untuk mata kuliah sebelumnya
            setPreviousIds({
                TranskripNilaiIdSebelum: data[prevIndex]?.TranskripNilai?.TranskripNilaiId || '',
                MataKuliahMahasiswaIdSebelum: data[prevIndex]?.MataKuliahMahasiswaId || '',
            })
        }
    }

    const preview = async (e: EkuivalenCheckAsessmenType['BuktiFormEvaluasiDiri']) => {
        setPreviewTemp(e)
        setOpenDialogFile(true)
        const res = await getFileBlobByNamafile(e.NamaFile)
        setPdfPreviewUrl(res)
    }

    const saveEkuivalenCheck = async () => {
        if (!form.TranskripNilaiId) {
            toast.error('Silakan pilih mata kuliah dari transkrip nilai')
            return
        }
        if (!form.NilaiAsessment) {
            toast.error('Silakan masukkan nilai assessment')
            return
        }

        setLoading(true)
        try {
            await createOrUpdateEkuivalenCheck({
                TranskripNilaiIdSebelum: previousIds.TranskripNilaiIdSebelum,
                MataKuliahMahasiswaIdSebelum: previousIds.MataKuliahMahasiswaIdSebelum,
                TranskripNilaiIdSetelah: form.TranskripNilaiId,
                MataKuliahMahasiswaIdSetelah: currentMataKuliah.MataKuliahMahasiswaId,
                NilaiAsessment: form.NilaiAsessment,
                Diakui: form.Diakui,
            })

            // Update local state
            const selectedTranskrip = dataServer.TranskripNilai.find(
                t => t.TranskripNilaiId === form.TranskripNilaiId
            )
            if (selectedTranskrip) {
                const updatedMataKuliah = {
                    ...currentMataKuliah,
                    TranskripNilai: {
                        ...selectedTranskrip,
                        NilaiAsessment: form.NilaiAsessment,
                        Diakui: form.Diakui,
                    }
                }
                setData(replaceItemAtIndex(data, index, updatedMataKuliah))
            }

            // Update previousIds setelah berhasil simpan
            setPreviousIds({
                TranskripNilaiIdSebelum: form.TranskripNilaiId,
                MataKuliahMahasiswaIdSebelum: currentMataKuliah.MataKuliahMahasiswaId,
            })

            toast.success('Berhasil menyimpan ekuivalensi')
        } catch (error) {
            toast.error('Terjadi kesalahan saat menyimpan')
        } finally {
            setLoading(false)
        }
    }

    const deleteEkuivalenCheckHandler = async () => {
        if (!hasExistingRelation) {
            toast.error('Tidak ada data ekuivalensi untuk dihapus')
            return
        }

        setLoading(true)
        try {
            await deleteEkuivalenCheck(
                currentMataKuliah.TranskripNilai.TranskripNilaiId,
                currentMataKuliah.MataKuliahMahasiswaId
            )

            // Reset local state
            const updatedMataKuliah = {
                ...currentMataKuliah,
                TranskripNilai: {
                    NilaiAsessment: '',
                    Diakui: false,
                    TranskripNilaiId: '',
                    PendaftaranId: '',
                    KodeMataKuliah: '',
                    NamaMataKuliah: '',
                    Sks: 0,
                    Nilai: '',
                    CreatedAt: new Date(),
                    UpdatedAt: new Date(),
                }
            }
            setData(replaceItemAtIndex(data, index, updatedMataKuliah))
            setForm({
                TranskripNilaiId: '',
                NilaiAsessment: '',
                Diakui: false,
            })

            // Reset previousIds setelah delete
            setPreviousIds({
                TranskripNilaiIdSebelum: '',
                MataKuliahMahasiswaIdSebelum: currentMataKuliah.MataKuliahMahasiswaId,
            })

            toast.success('Berhasil menghapus ekuivalensi')
        } catch (error) {
            toast.error('Terjadi kesalahan saat menghapus')
        } finally {
            setLoading(false)
        }
    }

    const selectMataKuliah = (idx: number) => {
        setIndex(idx)
        setForm({
            TranskripNilaiId: data[idx]?.TranskripNilai?.TranskripNilaiId || '',
            NilaiAsessment: data[idx]?.TranskripNilai?.NilaiAsessment || '',
            Diakui: data[idx]?.TranskripNilai?.Diakui || false,
        })
        // Update previousIds ketika memilih mata kuliah
        setPreviousIds({
            TranskripNilaiIdSebelum: data[idx]?.TranskripNilai?.TranskripNilaiId || '',
            MataKuliahMahasiswaIdSebelum: data[idx]?.MataKuliahMahasiswaId || '',
        })
    }

    if (data.length === 0) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Ekuivalensi Transfer SKS</CardTitle>
                    <CardDescription>
                        Tidak ada mata kuliah Transfer SKS yang perlu diasesmen
                    </CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <React.Fragment>
            <SidebarInset className="mr-[350px]">
                <div className="w-full space-y-4">
                    {/* Info Asesor */}
                    <Alert>
                        <InfoIcon className="h-4 w-4" />
                        <AlertTitle>Asesor: {nama}</AlertTitle>
                        <AlertDescription>
                            Lakukan penilaian ekuivalensi untuk mata kuliah Transfer SKS dengan membandingkan mata kuliah yang dipilih mahasiswa dengan transkrip nilai dari perguruan tinggi sebelumnya.
                        </AlertDescription>
                    </Alert>

                    {/* Bukti Dokumen */}
                    {dataServer.BuktiFormEvaluasiDiri.BuktiFormId && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileTextIcon className="h-5 w-5" />
                                    Bukti Dokumen Transkrip
                                </CardTitle>
                                <CardDescription>
                                    {dataServer.BuktiFormEvaluasiDiri.JenisDokumen.Jenis}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    className="mx-2  hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer "
                                    type="button"
                                    onClick={() => preview(dataServer.BuktiFormEvaluasiDiri)}
                                >
                                    <ScanEye />
                                    Lihat
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Current Mata Kuliah Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Mata Kuliah Tujuan</span>
                                {hasExistingRelation ? (
                                    <Badge variant="default" className="bg-green-500">Sudah Diisi</Badge>
                                ) : (
                                    <Badge variant="secondary">Belum Diisi</Badge>
                                )}
                            </CardTitle>
                            <CardDescription>
                                Mata kuliah yang dipilih mahasiswa untuk Transfer SKS
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Nama</span>
                                    <span className="font-medium">{currentMataKuliah?.MataKuliah.Nama}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Program Studi</span>
                                    <span>{currentMataKuliah?.MataKuliah.NamaProgramStudi}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">SKS</span>
                                    <span>{currentMataKuliah?.MataKuliah.Sks} SKS</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Semester</span>
                                    <span>{currentMataKuliah?.MataKuliah.Semester || '-'}</span>
                                </div>
                                {currentMataKuliah?.MataKuliah.CapaianPembelajaran.length > 0 && (
                                    <div className="mt-4">
                                        <span className="text-muted-foreground text-sm">Capaian Pembelajaran:</span>
                                        <ul className="list-disc list-inside mt-1 text-sm">
                                            {currentMataKuliah.MataKuliah.CapaianPembelajaran.map((cp) => (
                                                <li key={cp.CapaianPembelajaranId}>
                                                    {cp.Nama}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Separator />

                    {/* Form Ekuivalensi */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Penilaian Ekuivalensi</CardTitle>
                            <CardDescription>
                                Pilih mata kuliah dari transkrip nilai yang setara dan berikan penilaian
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Select Transkrip Nilai */}
                            <div className="space-y-2">
                                <Label htmlFor="transkripNilai">Mata Kuliah dari Transkrip Nilai</Label>
                                <Select
                                    value={form.TranskripNilaiId}
                                    onValueChange={(value) => setForm({ ...form, TranskripNilaiId: value })}
                                    disabled={loading}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih mata kuliah dari transkrip" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Transkrip Nilai Mahasiswa</SelectLabel>
                                            {dataServer.TranskripNilai.map((tn) => (
                                                <SelectItem key={tn.TranskripNilaiId} value={tn.TranskripNilaiId}>
                                                    {tn.KodeMataKuliah} - {tn.NamaMataKuliah} ({tn.Sks} SKS, Nilai: {tn.Nilai})
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Nilai Assessment */}
                            <div className="space-y-2">
                                <Label htmlFor="nilaiAsessment">Nilai Assessment</Label>
                                <Select
                                    value={form.NilaiAsessment}
                                    onValueChange={(value) => setForm({ ...form, NilaiAsessment: value })}
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
                            </div>

                            {/* Diakui Checkbox */}
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="diakui"
                                    checked={form.Diakui}
                                    onCheckedChange={(checked) =>
                                        setForm({ ...form, Diakui: checked as boolean })
                                    }
                                    disabled={loading}
                                />
                                <Label htmlFor="diakui" className="cursor-pointer">
                                    Diakui sebagai Transfer SKS
                                </Label>
                            </div>

                            {/* Selected Transkrip Preview */}
                            {form.TranskripNilaiId && (
                                <Card className="bg-muted/50">
                                    <CardHeader className="py-3">
                                        <CardTitle className="text-sm">Preview Mata Kuliah Terpilih</CardTitle>
                                    </CardHeader>
                                    <CardContent className="py-2">
                                        {(() => {
                                            const selected = dataServer.TranskripNilai.find(
                                                t => t.TranskripNilaiId === form.TranskripNilaiId
                                            )
                                            if (!selected) return null
                                            return (
                                                <div className="text-sm space-y-1">
                                                    <div><strong>Kode:</strong> {selected.KodeMataKuliah}</div>
                                                    <div><strong>Nama:</strong> {selected.NamaMataKuliah}</div>
                                                    <div><strong>SKS:</strong> {selected.Sks}</div>
                                                    <div><strong>Nilai Asli:</strong> {selected.Nilai}</div>
                                                </div>
                                            )
                                        })()}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-4">
                                <Button
                                    className="flex-1 hover:scale-105 active:scale-95 transition-all duration-100"
                                    onClick={saveEkuivalenCheck}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Timer className="mr-2 h-4 w-4" /> Loading
                                        </>
                                    ) : (
                                        <>
                                            <PenLine className="mr-2 h-4 w-4" /> Simpan
                                        </>
                                    )}
                                </Button>
                                {hasExistingRelation && (
                                    <Button
                                        variant="destructive"
                                        className="hover:scale-105 active:scale-95 transition-all duration-100"
                                        onClick={deleteEkuivalenCheckHandler}
                                        disabled={loading}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Transkrip Nilai Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Daftar Transkrip Nilai Mahasiswa</CardTitle>
                            <CardDescription>
                                Referensi transkrip nilai dari perguruan tinggi sebelumnya
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Kode</TableHead>
                                        <TableHead>Nama Mata Kuliah</TableHead>
                                        <TableHead className="text-center">SKS</TableHead>
                                        <TableHead className="text-center">Nilai</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {dataServer.TranskripNilai.map((tn) => (
                                        <TableRow
                                            key={tn.TranskripNilaiId}
                                            className={form.TranskripNilaiId === tn.TranskripNilaiId ? 'bg-primary/10' : ''}
                                        >
                                            <TableCell className="font-mono">{tn.KodeMataKuliah}</TableCell>
                                            <TableCell>{tn.NamaMataKuliah}</TableCell>
                                            <TableCell className="text-center">{tn.Sks}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="outline">{tn.Nilai}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </SidebarInset>

            {/* Sidebar - Mata Kuliah List */}
            <Sidebar
                side="right"
                variant="inset"
                collapsible="none"
                className="fixed right-0 top-0 h-screen w-[350px] bg-background border-l overflow-y-auto"
            >
                <SidebarHeader className="gap-3.5 border-b p-4">
                    <div className="flex w-full items-center justify-between">
                        <Label className="flex items-center gap-2 text-sm">
                            <Button
                                onClick={beforeActiveItem}
                                disabled={index === 0}
                                className="bg-transparent text-gray-800 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-600 hover:scale-105 active:scale-95"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                        </Label>
                        <div className="text-base font-medium text-foreground text-center">
                            {index + 1} / {data.length}
                        </div>
                        <Label className="flex items-center gap-2 text-sm">
                            <Button
                                onClick={nextActiveItem}
                                disabled={index === data.length - 1}
                                className="bg-transparent text-gray-800 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-600 hover:scale-105 active:scale-95"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </Label>
                    </div>
                    <Button
                        className="mt-2 bg-gray-100 text-gray-800 dark:text-gray-300 dark:bg-gray-600 hover:scale-105 active:scale-95 transition-all duration-100"
                        type="button"
                        onClick={() => setOpenDialog(true)}
                    >
                        <ListIcon className="mr-2 h-4 w-4" /> Lihat Semua Mata Kuliah
                    </Button>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup className="px-0">
                        <SidebarGroupContent>
                            {data.map((mk, idx) => (
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        if (!loading) {
                                            selectMataKuliah(idx)
                                        }
                                    }}
                                    key={mk.MataKuliahMahasiswaId}
                                    className={`${loading && 'cursor-not-allowed'} ${idx === index && 'bg-primary/10'} flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`}
                                >
                                    <div className="flex w-full items-center gap-2">
                                        <span className="font-medium">{truncateText(mk.MataKuliah.Nama, 25)}</span>
                                        <span className="ml-auto">
                                            <Badge
                                                className={
                                                    mk.TranskripNilai?.TranskripNilaiId
                                                        ? 'bg-green-500'
                                                        : 'bg-red-500'
                                                }
                                            >
                                                {mk.TranskripNilai?.TranskripNilaiId ? 'Sudah' : 'Belum'}
                                            </Badge>
                                        </span>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {mk.MataKuliah.Sks} SKS - Semester {mk.MataKuliah.Semester || '-'}
                                    </div>
                                    {mk.TranskripNilai?.TranskripNilaiId && (
                                        <div className="text-xs">
                                            → {mk.TranskripNilai.NamaMataKuliah} ({mk.TranskripNilai.NilaiAsessment})
                                            {mk.TranskripNilai.Diakui && <Badge className="ml-1 bg-blue-500 text-xs">Diakui</Badge>}
                                        </div>
                                    )}
                                </a>
                            ))}
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>

            <Dialog open={openDialogFile} onOpenChange={setOpenDialogFile}>
                <DialogContent className="w-full max-h-[80vh]  overflow-y-scroll">
                    <DialogHeader>
                        <DialogTitle>Preview Dokumen {previewTemp?.NamaDokumen}</DialogTitle>
                        <DialogDescription>
                            Preview Jenis Dokumen {previewTemp?.NamaDokumen}
                        </DialogDescription>
                    </DialogHeader>
                    {pdfPreviewUrl === null ? (
                        <Skeleton className="w-full h-32" />
                    ) : (
                        <iframe
                            src={pdfPreviewUrl || ''}
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
                                setOpenDialogFile(false)
                            }}
                            type="button"
                        >
                            <X />
                            Tutup
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog - All Mata Kuliah */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Daftar Mata Kuliah Transfer SKS</DialogTitle>
                        <DialogDescription>
                            Pilih mata kuliah untuk melakukan penilaian ekuivalensi
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                        {data.map((mk, idx) => (
                            <div
                                key={mk.MataKuliahMahasiswaId}
                                className={`p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${idx === index ? 'border-primary bg-primary/5' : ''}`}
                                onClick={() => {
                                    selectMataKuliah(idx)
                                    setOpenDialog(false)
                                }}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="font-medium">{mk.MataKuliah.Nama}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {mk.MataKuliah.Sks} SKS - {mk.MataKuliah.NamaProgramStudi}
                                        </div>
                                    </div>
                                    <Badge
                                        className={
                                            mk.TranskripNilai?.TranskripNilaiId
                                                ? 'bg-green-500'
                                                : 'bg-red-500'
                                        }
                                    >
                                        {mk.TranskripNilai?.TranskripNilaiId ? 'Sudah Diisi' : 'Belum Diisi'}
                                    </Badge>
                                </div>
                                {mk.TranskripNilai?.TranskripNilaiId && (
                                    <div className="mt-2 text-sm text-muted-foreground">
                                        Ekuivalen dengan: {mk.TranskripNilai.NamaMataKuliah} (Nilai: {mk.TranskripNilai.NilaiAsessment})
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button variant="destructive" onClick={() => setOpenDialog(false)}>
                            <X className="mr-2 h-4 w-4" /> Tutup
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    )
}
