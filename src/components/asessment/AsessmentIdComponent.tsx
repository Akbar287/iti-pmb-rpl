'use client'
import React from 'react'
import { Label } from '@/components/ui/label'
import {
    AlertCircleIcon,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ListIcon,
    Maximize2,
    Minimize2,
    PenLine,
    Send,
    Sparkles,
    Square,
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
import { toast } from 'sonner'
import { AsessmenAsesorTypes } from '@/types/AsessmentTypes'
import { Textarea } from '../ui/textarea'
import { Input } from '../ui/input'
import { setAsessmentMahasiswaFromAsesor } from '@/services/Asessment/AsessmentMahasiswaService'
import { Skeleton } from '../ui/skeleton'
import { getFileBlobByNamafile } from '@/services/UploadDokumenService'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { ScrollArea } from '../ui/scroll-area'
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { ChatMessageDTO, streamChat } from '@/services/Ai/AiServices'

type WindowSize = 'medium' | 'large' | 'fullscreen'

const AsessmentIdComponent = ({
    dataServer, nama
}: {
    dataServer: AsessmenAsesorTypes,
    nama: string
}) => {
    const [data, setData] = React.useState(dataServer)
    const [dataPdf, setDataPdf] = React.useState<{
        BuktiFormId: string
        PendaftaranId: string
        JenisDokumenId: string
        NamaFile: string
        NamaDokumen: string
        CreatedAt: Date | null
        UpdatedAt: Date | null
    } | null>(null)
    const [openDialogPdfPreview, setOpenDialogPdfPreview] =
        React.useState<boolean>(false)


    const [pdfPreview, setPdfPreview] = React.useState<string | null>(null)
    const [index, setIndex] = React.useState<number>(0)
    const [activeCapaian, setActiveCapaian] = React.useState<string | null>(
        data[index].CapaianPembelajaran.length === 0
            ? null
            : data[index].CapaianPembelajaran[0].CapaianPembelajaranId || null
    )
    const [form, setForm] = React.useState<{
        HasilAssesmenId: string
        EvaluasiDiriId: string
        Valid: boolean
        Autentik: boolean
        Terkini: boolean
        Memadai: boolean
        Assesmen: string
        Nilai: number
        TanggalAssesmen: Date
    }>({
        HasilAssesmenId:
            data[index].CapaianPembelajaran.length === 0
                ? ''
                : data[index].CapaianPembelajaran[0].EvaluasiDiri !== null
                    ? data[index].CapaianPembelajaran[0].EvaluasiDiri.HasilAsessment
                        .HasilAssesmenId
                    : '',
        EvaluasiDiriId:
            data[index].CapaianPembelajaran.length === 0
                ? ''
                : data[index].CapaianPembelajaran[0].EvaluasiDiri !== null
                    ? data[index].CapaianPembelajaran[0].EvaluasiDiri.EvaluasiDiriId
                    : '',
        Valid:
            data[index].CapaianPembelajaran.length === 0
                ? false
                : data[index].CapaianPembelajaran[0].EvaluasiDiri !== null
                    ? data[index].CapaianPembelajaran[0].EvaluasiDiri.HasilAsessment
                        .Valid
                    : false,
        Autentik:
            data[index].CapaianPembelajaran.length === 0
                ? false
                : data[index].CapaianPembelajaran[0].EvaluasiDiri !== null
                    ? data[index].CapaianPembelajaran[0].EvaluasiDiri.HasilAsessment
                        .Autentik
                    : false,
        Terkini:
            data[index].CapaianPembelajaran.length === 0
                ? false
                : data[index].CapaianPembelajaran[0].EvaluasiDiri !== null
                    ? data[index].CapaianPembelajaran[0].EvaluasiDiri.HasilAsessment
                        .Terkini
                    : false,
        Memadai:
            data[index].CapaianPembelajaran.length === 0
                ? false
                : data[index].CapaianPembelajaran[0].EvaluasiDiri !== null
                    ? data[index].CapaianPembelajaran[0].EvaluasiDiri.HasilAsessment
                        .Memadai
                    : false,
        Assesmen:
            data[index].CapaianPembelajaran.length === 0
                ? ''
                : data[index].CapaianPembelajaran[0].EvaluasiDiri !== null
                    ? data[index].CapaianPembelajaran[0].EvaluasiDiri.HasilAsessment
                        .Assesmen
                    : '',
        Nilai:
            data[index].CapaianPembelajaran.length === 0
                ? 0
                : data[index].CapaianPembelajaran[0].EvaluasiDiri !== null
                    ? data[index].CapaianPembelajaran[0].EvaluasiDiri.HasilAsessment
                        .Nilai
                    : 0,
        TanggalAssesmen:
            data[index].CapaianPembelajaran.length === 0
                ? new Date()
                : data[index].CapaianPembelajaran[0].EvaluasiDiri !== null
                    ? data[index].CapaianPembelajaran[0].EvaluasiDiri.HasilAsessment
                        .TanggalAssesmen
                    : new Date(),
    })
    const setFormDefault = () => {
        setForm({
            EvaluasiDiriId:
                data[index].CapaianPembelajaran.length === 0
                    ? ''
                    : data[index].CapaianPembelajaran[0].EvaluasiDiri !== null
                        ? data[index].CapaianPembelajaran[0].EvaluasiDiri
                            .EvaluasiDiriId
                        : '',
            HasilAssesmenId:
                data[index].CapaianPembelajaran.length === 0
                    ? ''
                    : data[index].CapaianPembelajaran[0].EvaluasiDiri !== null
                        ? data[index].CapaianPembelajaran[0].EvaluasiDiri
                            .HasilAsessment.HasilAssesmenId
                        : '',
            Valid:
                data[index].CapaianPembelajaran.length === 0
                    ? false
                    : data[index].CapaianPembelajaran[0].EvaluasiDiri !== null
                        ? data[index].CapaianPembelajaran[0].EvaluasiDiri
                            .HasilAsessment.Valid
                        : false,
            Autentik:
                data[index].CapaianPembelajaran.length === 0
                    ? false
                    : data[index].CapaianPembelajaran[0].EvaluasiDiri !== null
                        ? data[index].CapaianPembelajaran[0].EvaluasiDiri
                            .HasilAsessment.Autentik
                        : false,
            Terkini:
                data[index].CapaianPembelajaran.length === 0
                    ? false
                    : data[index].CapaianPembelajaran[0].EvaluasiDiri !== null
                        ? data[index].CapaianPembelajaran[0].EvaluasiDiri
                            .HasilAsessment.Terkini
                        : false,
            Memadai:
                data[index].CapaianPembelajaran.length === 0
                    ? false
                    : data[index].CapaianPembelajaran[0].EvaluasiDiri !== null
                        ? data[index].CapaianPembelajaran[0].EvaluasiDiri
                            .HasilAsessment.Memadai
                        : false,
            Assesmen:
                data[index].CapaianPembelajaran.length === 0
                    ? ''
                    : data[index].CapaianPembelajaran[0].EvaluasiDiri !== null
                        ? data[index].CapaianPembelajaran[0].EvaluasiDiri
                            .HasilAsessment.Assesmen
                        : '',
            Nilai:
                data[index].CapaianPembelajaran.length === 0
                    ? 0
                    : data[index].CapaianPembelajaran[0].EvaluasiDiri !== null
                        ? data[index].CapaianPembelajaran[0].EvaluasiDiri
                            .HasilAsessment.Nilai
                        : 0,
            TanggalAssesmen:
                data[index].CapaianPembelajaran.length === 0
                    ? new Date()
                    : data[index].CapaianPembelajaran[0].EvaluasiDiri !== null
                        ? data[index].CapaianPembelajaran[0].EvaluasiDiri
                            .HasilAsessment.TanggalAssesmen
                        : new Date(),
        })
    }
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
            setFormDefault()
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
            setFormDefault()
        }
    }
    const saveEval = () => {
        if (activeCapaian) {
            setLoading(true)
            setAsessmentMahasiswaFromAsesor(
                form.HasilAssesmenId,
                form.EvaluasiDiriId,
                form.Valid,
                form.Autentik,
                form.Terkini,
                form.Memadai,
                form.Assesmen,
                form.Nilai,
                form.TanggalAssesmen
            )
                .then((res) => {
                    let idx = data[index].CapaianPembelajaran.findIndex(
                        (cp) => cp.CapaianPembelajaranId === activeCapaian
                    )
                    let temp = replaceItemAtIndex(
                        data[index].CapaianPembelajaran,
                        idx,
                        {
                            ...data[index].CapaianPembelajaran[idx],
                            EvaluasiDiri: {
                                ...data[index].CapaianPembelajaran[idx]
                                    .EvaluasiDiri,
                                EvaluasiDiriId:
                                    data[index].CapaianPembelajaran[idx]
                                        .EvaluasiDiri?.EvaluasiDiriId ?? '',
                                MataKuliahMahasiswaId:
                                    data[index].CapaianPembelajaran[idx]
                                        .EvaluasiDiri?.MataKuliahMahasiswaId ??
                                    '',
                                ProfiensiPengetahuan:
                                    data[index].CapaianPembelajaran[idx]
                                        .EvaluasiDiri?.ProfiensiPengetahuan ??
                                    ProfiensiPengetahuan.TIDAK_PERNAH,
                                TanggalPengesahan:
                                    data[index].CapaianPembelajaran[idx]
                                        .EvaluasiDiri?.TanggalPengesahan ??
                                    new Date(),
                                CreatedAt:
                                    data[index].CapaianPembelajaran[idx]
                                        .EvaluasiDiri?.CreatedAt ?? new Date(),
                                UpdatedAt:
                                    data[index].CapaianPembelajaran[idx]
                                        .EvaluasiDiri?.UpdatedAt ?? new Date(),
                                BuktiForm:
                                    data[index].CapaianPembelajaran[idx]
                                        .EvaluasiDiri?.BuktiForm ?? [],
                                HasilAsessment: {
                                    HasilAssesmenId: res.HasilAssesmenId,
                                    Valid: res.Valid,
                                    Autentik: res.Autentik,
                                    Terkini: res.Terkini,
                                    Memadai: res.Memadai,
                                    Assesmen: res.Assesmen,
                                    Nilai: res.Nilai,
                                    TanggalAssesmen: res.TanggalAssesmen,
                                    Ai: res.Ai
                                },
                                HasilAsessmentAi: {
                                    Valid: data[index].CapaianPembelajaran[idx]
                                        .EvaluasiDiri?.HasilAsessmentAi?.Valid ?? '',
                                    Autentik: data[index].CapaianPembelajaran[idx]
                                        .EvaluasiDiri?.HasilAsessmentAi?.Autentik ?? '',
                                    Terkini: data[index].CapaianPembelajaran[idx]
                                        .EvaluasiDiri?.HasilAsessmentAi?.Terkini ?? '',
                                    Memadai: data[index].CapaianPembelajaran[idx]
                                        .EvaluasiDiri?.HasilAsessmentAi?.Memadai ?? '',
                                    Assesmen: data[index].CapaianPembelajaran[idx]
                                        .EvaluasiDiri?.HasilAsessmentAi?.Assesmen ?? '',
                                    Nilai: data[index].CapaianPembelajaran[idx]
                                        .EvaluasiDiri?.HasilAsessmentAi?.Nilai ?? '',
                                }
                            },
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
    const openDokumen = async (dok: {
        BuktiFormId: string
        PendaftaranId: string
        JenisDokumenId: string
        NamaFile: string
        NamaDokumen: string
        CreatedAt: Date | null
        UpdatedAt: Date | null
    }) => {
        const res = await getFileBlobByNamafile(dok.NamaFile)
        setDataPdf(dok)
        setPdfPreview(res)
        setOpenDialogPdfPreview(true)
    }

    // AI
    const scrollRef = React.useRef<HTMLDivElement | null>(null);
    const [shouldAutoScroll, setShouldAutoScroll] = React.useState(true);
    const [showScrollDown, setShowScrollDown] = React.useState(false);

    const [openAi, setOpenAi] = React.useState<boolean>(false)
    const [messagesAi, setMessagesAi] = React.useState<{
        id: string
        role: 'user' | 'assistant'
        content: string
        timestamp: Date
    }[]>([])
    const [inputAi, setInputAi] = React.useState<string>('')
    const [windowSize, setWindowSize] = React.useState<WindowSize>('large')
    const [isLoadingAi, setIsLoadingAi] = React.useState<boolean>(false)
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
        }
    }
    const handleSubmit = async () => {
        if (!inputAi.trim() || isLoadingAi) return

        const now = new Date()
        const userMessage = {
            id: now.getTime().toString(),
            role: 'user' as const,
            content: inputAi.trim(),
            timestamp: now,
        }

        const historyWithUser = [...messagesAi, userMessage]

        setMessagesAi(historyWithUser)
        setInputAi('')
        setIsLoadingAi(true)

        const assistantId = (now.getTime() + 1).toString()
        const assistantMessage = {
            id: assistantId,
            role: 'assistant' as const,
            content: '',
            timestamp: new Date(),
        }

        setMessagesAi((prev) => [...prev, assistantMessage])

        try {
            const dtoMessages: ChatMessageDTO[] = historyWithUser.map((m) => ({
                role: m.role,
                content: m.content,
            }))

            await streamChat(form.HasilAssesmenId, dtoMessages, (chunk) => {
                setMessagesAi((prev) =>
                    prev.map((msg) =>
                        msg.id === assistantId
                            ? { ...msg, content: msg.content + chunk.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1") }
                            : msg,
                    ),
                )
            })
        } catch (err) {
            console.error('Chat error', err)
            setMessagesAi((prev) =>
                prev.map((msg) =>
                    msg.id === assistantId
                        ? {
                            ...msg,
                            content:
                                msg.content ||
                                'Maaf, terjadi kesalahan saat memproses permintaan Anda.',
                        }
                        : msg,
                ),
            )
        } finally {
            setIsLoadingAi(false)
        }
    }
    const toggleWindowSize = () => {
        const sizes: WindowSize[] = ['medium', 'large', 'fullscreen']
        const currentIndex = sizes.indexOf(windowSize)
        const nextIndex = (currentIndex + 1) % sizes.length
        setWindowSize(sizes[nextIndex])
    }
    const getWindowSizeClasses = () => {
        switch (windowSize) {
            case 'medium':
                return 'max-w-2xl max-h-[600px] w-full h-[70vh]'
            case 'large':
                return 'max-w-5xl  max-h-[700px] w-full h-[80vh]'
            case 'fullscreen':
                return 'max-w-[85vw] max-h-[85vh] w-full h-full md:max-w-full md:max-h-full md:w-screen md:h-screen sm:max-w-full sm:max-h-full sm:w-screen sm:h-screen p-0 gap-0 border-0 overflow-hidden'
            default:
                return 'max-w-5xl max-h-[700px] w-full h-[70vh]'
        }
    }
    const handleScroll = () => {
        const el = scrollRef.current;
        if (!el) return;

        const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
        const isAtBottom = distanceFromBottom < 60;

        setShouldAutoScroll(isAtBottom);
        setShowScrollDown(!isAtBottom);
    };
    const handleScrollToBottom = () => {
        const el = scrollRef.current;
        if (!el) return;

        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
        setShouldAutoScroll(true);
        setShowScrollDown(false);
    };
    // End Ai

    React.useEffect(() => {
        if (!shouldAutoScroll) return;
        const el = scrollRef.current;
        if (!el) return;

        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }, [messagesAi, shouldAutoScroll]);

    return (
        <React.Fragment>
            <SidebarInset className="mr-[300px] bg-transparent">
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
                                )?.EvaluasiDiri?.HasilAsessment
                                    .HasilAssesmenId !== '' ? (
                                    <Badge variant={'default'}>Selesai</Badge>
                                ) : (
                                    ''
                                )}
                            </CardTitle>
                            <CardDescription>
                                Profisiensi Pengetahuan Calon Mahasiswa
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
                                <form className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4">
                                    <label
                                        className={`flex cursor-pointer flex-col rounded-2xl border p-4 shadow transition-all hover:shadow-md ${data[
                                            index
                                        ].CapaianPembelajaran.find(
                                            (cp) =>
                                                cp.CapaianPembelajaranId ===
                                                activeCapaian
                                        )?.EvaluasiDiri
                                            ?.ProfiensiPengetahuan ===
                                            ProfiensiPengetahuan.TIDAK_PERNAH
                                            ? 'border-primary/50 bg-primary/20 dark:bg-gray-600 dark:border-gray-300 dark:text-gray-100'
                                            : 'border-gray-300'
                                            }`}
                                    >
                                        <div className="text-lg text-center font-medium">
                                            Tidak Pernah
                                        </div>
                                    </label>
                                    <label
                                        className={`flex cursor-pointer flex-col rounded-2xl border p-4 shadow transition-all hover:shadow-md ${data[
                                            index
                                        ].CapaianPembelajaran.find(
                                            (cp) =>
                                                cp.CapaianPembelajaranId ===
                                                activeCapaian
                                        )?.EvaluasiDiri
                                            ?.ProfiensiPengetahuan ===
                                            ProfiensiPengetahuan.BAIK
                                            ? 'border-primary/50 bg-primary/20 dark:bg-gray-600 dark:border-gray-300 dark:text-gray-100'
                                            : 'border-gray-300'
                                            }`}
                                    >
                                        <div className="text-lg text-center font-medium">
                                            Baik
                                        </div>
                                    </label>
                                    <label
                                        className={`flex cursor-pointer flex-col rounded-2xl border p-4 shadow transition-all hover:shadow-md ${data[
                                            index
                                        ].CapaianPembelajaran.find(
                                            (cp) =>
                                                cp.CapaianPembelajaranId ===
                                                activeCapaian
                                        )?.EvaluasiDiri
                                            ?.ProfiensiPengetahuan ===
                                            ProfiensiPengetahuan.SANGAT_BAIK
                                            ? 'border-primary/50 bg-primary/20 dark:bg-gray-600 dark:border-gray-300 dark:text-gray-100'
                                            : 'border-gray-300'
                                            }`}
                                    >
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
                            <CardTitle>Dokumen Pendukung</CardTitle>
                            <CardDescription>
                                Dokumen yang di unggah oleh Calon Mahasiswa
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="w-full flex justify-center items-center">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 lg:gap-2">
                                {data[index].CapaianPembelajaran.find(
                                    (cp) =>
                                        cp.CapaianPembelajaranId ===
                                        activeCapaian
                                ) === undefined ? (
                                    <h1>
                                        Silakan anda pilih Capaian Pembelajaran
                                    </h1>
                                ) : data[index].CapaianPembelajaran.find(
                                    (cp) =>
                                        cp.CapaianPembelajaranId ===
                                        activeCapaian
                                )?.EvaluasiDiri?.BuktiForm.length === 0 ? (
                                    <h1>
                                        Calon Mahasiswa Tidak Upload Dokumen
                                        Apapun
                                    </h1>
                                ) : (
                                    data[index].CapaianPembelajaran.find(
                                        (cp) =>
                                            cp.CapaianPembelajaranId ===
                                            activeCapaian
                                    )
                                        ?.EvaluasiDiri?.BuktiForm.sort(
                                            (a, b) =>
                                                a.NomorDokumen - b.NomorDokumen
                                        )
                                        .map((dokumen) => (
                                            <div
                                                onClick={() =>
                                                    openDokumen({
                                                        BuktiFormId:
                                                            dokumen.BuktiFormId,
                                                        PendaftaranId:
                                                            dokumen.PendaftaranId,
                                                        JenisDokumenId:
                                                            dokumen.JenisDokumenId,
                                                        NamaFile:
                                                            dokumen.NamaFile,
                                                        NamaDokumen:
                                                            dokumen.NamaDokumen,
                                                        CreatedAt: new Date(),
                                                        UpdatedAt: new Date(),
                                                    })
                                                }
                                                key={dokumen.BuktiFormId}
                                                className={`border overflow-hidden rounded-xl p-4 shadow-sm cursor-pointer transition-all border-primary/50 bg-primary/20 dark:bg-gray-800 dark:border-gray-300 dark:text-gray-100 hover:scale-105 duration-150`}
                                            >
                                                <div className="font-semibold">
                                                    {dokumen.Jenis}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    Nomor:{' '}
                                                    {dokumen.NomorDokumen}
                                                </div>
                                            </div>
                                        ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="my-3">
                        <CardHeader className='relative'>
                            <CardTitle>Formulir Asessmen Asesor</CardTitle>
                            <CardDescription>
                                Silakan Isi Form Untuk Asessmen Capaian
                                Pembelajaran ini.
                            </CardDescription>
                            <button
                                onClick={() => setOpenAi(true)}
                                className="absolute top-0 right-5 z-50 group"
                                aria-label="Open AI Chat"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 rounded-full bg-linear-to-r from-pink-500 via-purple-500 to-cyan-500 blur-md opacity-75 group-hover:opacity-100 animate-spin-slow"></div>
                                    <div className="relative w-12 h-12 rounded-xl bg-linear-to-r from-pink-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 animate-gradient">
                                        <span className="text-white font-bold text-lg">AI</span>
                                        <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-300 animate-pulse" />
                                    </div>
                                </div>
                            </button>
                        </CardHeader>
                        <CardContent className="w-full ">
                            <div className="grid grid-cols-1 gap-3">
                                <Alert variant="destructive">
                                    <AlertCircleIcon />
                                    <AlertTitle>Form ini diisi oleh AI Asessmen</AlertTitle>
                                    <AlertDescription>
                                        <p>AI bisa membuat kesalahan, Asesor mohon untuk cek kembali hasil penilaian.</p>
                                        <ul className="list-inside list-disc text-sm">
                                            <li>Cek Dokumen Bukti Dukung</li>
                                            <li>Pastikan Capaian Pembelajaran sesuai</li>
                                            <li>Verifikasi kembali hasil penilaian AI</li>
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                                <Textarea
                                    value={form.Assesmen}
                                    onChange={(val) =>
                                        setForm({
                                            ...form,
                                            Assesmen: val.target.value,
                                        })
                                    }
                                    placeholder="Isi Penilaian Anda."
                                />
                            </div>
                            <Separator className="my-3" />
                            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-3">
                                <label
                                    className={`relative border overflow-hidden rounded-xl my-2 p-4 shadow-sm cursor-pointer transition-all
        ${form.Valid
                                            ? 'border-primary/50 bg-primary/20 dark:bg-gray-800 dark:border-gray-300 dark:text-gray-100'
                                            : 'hover:shadow-md'
                                        }
        ${loading ? 'opacity-50 cursor-not-allowed' : ''}
    `}
                                >

                                    <input
                                        type="checkbox"
                                        className="mr-2 hidden"
                                        checked={form.Valid}
                                        disabled={loading}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                Valid: !form.Valid,
                                            })
                                        }
                                    />

                                    <div className="font-semibold">Valid</div>
                                    <div className="text-sm text-muted-foreground">
                                        Hubungan antara Syarat bukti dari MK dengan bukti dasar penilaian.
                                    </div>
                                </label>

                                <label
                                    className={`border overflow-hidden rounded-xl my-2 p-4 shadow-sm cursor-pointer transition-all
                        ${form.Autentik
                                            ? 'border-primary/50 bg-primary/20 dark:bg-gray-800 dark:border-gray-300 dark:text-gray-100'
                                            : 'hover:shadow-md'
                                        }
                        ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <input
                                        type="checkbox"
                                        className="mr-2 hidden"
                                        checked={form.Autentik}
                                        disabled={loading}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                Autentik: form.Autentik
                                                    ? false
                                                    : true,
                                            })
                                        }
                                    />
                                    <div className="font-semibold">
                                        Autentik
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Dapat Dibuktikan Karya Sendiri.
                                    </div>
                                </label>
                                <label
                                    className={`border overflow-hidden rounded-xl my-2 p-4 shadow-sm cursor-pointer transition-all
                        ${form.Terkini
                                            ? 'border-primary/50 bg-primary/20 dark:bg-gray-800 dark:border-gray-300 dark:text-gray-100'
                                            : 'hover:shadow-md'
                                        }
                        ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <input
                                        type="checkbox"
                                        className="mr-2 hidden"
                                        checked={form.Terkini}
                                        disabled={loading}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                Terkini: form.Terkini
                                                    ? false
                                                    : true,
                                            })
                                        }
                                    />
                                    <div className="font-semibold">Terkini</div>
                                    <div className="text-sm text-muted-foreground">
                                        Pengetahuan dan keterampilan kandidat
                                        saat ini.
                                    </div>
                                </label>
                                <label
                                    className={`border overflow-hidden rounded-xl my-2 p-4 shadow-sm cursor-pointer transition-all
                        ${form.Memadai
                                            ? 'border-primary/50 bg-primary/20 dark:bg-gray-800 dark:border-gray-300 dark:text-gray-100'
                                            : 'hover:shadow-md'
                                        }
                        ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <input
                                        type="checkbox"
                                        className="mr-2 hidden"
                                        checked={form.Memadai}
                                        disabled={loading}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                Memadai: form.Memadai
                                                    ? false
                                                    : true,
                                            })
                                        }
                                    />
                                    <div className="font-semibold">Memadai</div>
                                    <div className="text-sm text-muted-foreground">
                                        Mendemonstrasikan kompetensi selama
                                        periode waktu tertentu.
                                    </div>
                                </label>
                            </div>
                            <Separator className="my-3" />
                            <div className="grid grid-cols-1 sm:grid-cols-1 gap-5">
                                <Input
                                    type="number"
                                    placeholder="Nilai Anda (Skala: 0-100)"
                                    className="my-2 h-20"
                                    min={0}
                                    max={100}
                                    value={form.Nilai}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            Nilai:
                                                parseInt(e.target.value, 10) >
                                                    100
                                                    ? 100
                                                    : parseInt(
                                                        e.target.value,
                                                        10
                                                    ) < 0
                                                        ? 0
                                                        : parseInt(
                                                            e.target.value,
                                                            10
                                                        ),
                                        })
                                    }
                                />
                            </div>
                            <div className="w-full flex justify-center items-center">
                                <Button
                                    className="mt-5 hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer "
                                    type="button"
                                    size={'lg'}
                                    disabled={
                                        (!activeCapaian && !index) || loading
                                    }
                                    onClick={() => saveEval()}
                                >
                                    {loading ? (
                                        <>
                                            <Timer /> Loading
                                        </>
                                    ) : (
                                        <>
                                            <PenLine />
                                            Reviewed
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </SidebarInset>
            <Sidebar
                side="right"
                variant="inset"
                collapsible="none"
                className="fixed right-0 top-16 z-10 h-[calc(100vh-4rem)] w-[300px] bg-white/40 backdrop-blur-2xl border-l border-white/50 shadow-sm shadow-black/5 dark:bg-slate-950/40 dark:border-white/10 overflow-y-auto"
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
                                                EvaluasiDiriId:
                                                    cp.EvaluasiDiri
                                                        ?.EvaluasiDiriId ?? '',
                                                HasilAssesmenId:
                                                    cp.EvaluasiDiri
                                                        ?.HasilAsessment
                                                        .HasilAssesmenId ?? '',
                                                Valid:
                                                    cp.EvaluasiDiri
                                                        ?.HasilAsessment
                                                        .Valid ?? false,
                                                Autentik:
                                                    cp.EvaluasiDiri
                                                        ?.HasilAsessment
                                                        .Autentik ?? false,
                                                Terkini:
                                                    cp.EvaluasiDiri
                                                        ?.HasilAsessment
                                                        .Terkini ?? false,
                                                Memadai:
                                                    cp.EvaluasiDiri
                                                        ?.HasilAsessment
                                                        .Memadai ?? false,
                                                Assesmen:
                                                    cp.EvaluasiDiri
                                                        ?.HasilAsessment
                                                        .Assesmen ?? '',
                                                Nilai:
                                                    cp.EvaluasiDiri
                                                        ?.HasilAsessment
                                                        .Nilai ?? 0,
                                                TanggalAssesmen:
                                                    cp.EvaluasiDiri
                                                        ?.HasilAsessment
                                                        .TanggalAssesmen ??
                                                    new Date(),
                                            })
                                        }
                                    }}
                                    key={cp.CapaianPembelajaranId}
                                    className={`${loading && 'cursor-not-allowed'
                                        } flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`}
                                >
                                    <div className="flex w-full items-center gap-2">
                                        <span>Urutan #{cp.Urutan}</span>{' '}
                                        <span className="ml-auto text-xs">
                                            <Badge
                                                className={
                                                    !cp.EvaluasiDiri
                                                        ?.HasilAsessment
                                                        .Ai
                                                        ? `bg-green-600`
                                                        : `bg-yellow-600`
                                                }
                                            >
                                                {!cp.EvaluasiDiri?.HasilAsessment
                                                    .Ai
                                                    ? `Reviewed`
                                                    : `Peer Review AI`}
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
            <DialogPreviewDokumen
                data={dataPdf}
                setData={setDataPdf}
                openDialog={openDialogPdfPreview}
                setOpenDialog={setOpenDialogPdfPreview}
                pdfPreview={pdfPreview}
                setPdfPreview={setPdfPreview}
            />
            <Dialog open={openAi} onOpenChange={setOpenAi}>
                <DialogContent className={`${getWindowSizeClasses()} p-0 gap-0 border-0 overflow-hidden transition-all duration-300 flex flex-col`}>
                    <VisuallyHidden>
                        <DialogTitle>RPL Chatbot</DialogTitle>
                        <DialogDescription>
                            AI assistant untuk sistem RPL.
                        </DialogDescription>
                    </VisuallyHidden>
                    <div className="relative w-full h-full flex flex-1 flex-col">
                        <div className="absolute inset-0 rounded-lg bg-linear-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-20 blur-xl animate-spin-slow pointer-events-none"></div>
                        <div className="absolute inset-px bg-background rounded-lg"></div>

                        <div className="relative z-10 flex flex-col h-full min-h-0">
                            <div className="flex items-center justify-between gap-3 p-4 border-b bg-background/50 backdrop-blur-sm">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-linear-to-r from-pink-500 via-purple-500 to-cyan-500 flex items-center justify-center animate-gradient">
                                            <span className="text-white font-bold">AI</span>
                                        </div>
                                        <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300 animate-pulse" />
                                    </div>
                                    <h2 className="text-xl font-semibold bg-linear-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent animate-gradient">
                                        AI Asessment
                                    </h2>
                                </div>

                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-full hover:bg-secondary"
                                        onClick={toggleWindowSize}
                                        title={`Switch to ${windowSize === 'medium' ? 'large' : windowSize === 'large' ? 'fullscreen' : 'medium'} size`}
                                    >
                                        {windowSize === 'fullscreen' ? (
                                            <Minimize2 className="h-4 w-4" />
                                        ) : windowSize === 'large' ? (
                                            <Maximize2 className="h-4 w-4" />
                                        ) : (
                                            <Square className="h-4 w-4" />
                                        )}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-full hover:bg-secondary"
                                        onClick={() => setOpenAi(false)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <ScrollArea className="flex-1 p-6 overflow-y-auto" >
                                <div className='h-full max-h-[90vh]' ref={scrollRef} onScroll={handleScroll}>
                                    <div className="space-y-4 pb-10">
                                        {messagesAi.length === 0 && (
                                            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center space-y-4">
                                                <div className="relative">
                                                    <div className="w-20 h-20 rounded-full bg-linear-to-r from-pink-500 via-purple-500 to-cyan-500 flex items-center justify-center animate-gradient">
                                                        <Sparkles className="w-10 h-10 text-white animate-pulse" />
                                                    </div>
                                                </div>
                                                <h3 className="text-2xl font-semibold bg-linear-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                                                    Halo {nama}, Ada yang bisa AI bantu?
                                                </h3>
                                                <p className="text-muted-foreground max-w-md">
                                                    Tanyakan apa saja kepada AI Asessmen. Saya siap membantu Anda!
                                                </p>
                                            </div>
                                        )}

                                        {messagesAi.map((message) => (
                                            <div
                                                key={message.id}
                                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                                            >
                                                <div
                                                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === 'user'
                                                        ? 'bg-linear-to-r from-pink-500 via-purple-500 to-cyan-500 text-white'
                                                        : 'bg-secondary text-secondary-foreground'
                                                        }`}
                                                >
                                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                                </div>
                                            </div>
                                        ))}

                                        {isLoadingAi && (
                                            <div className="flex justify-start animate-fade-in">
                                                <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-secondary">
                                                    <div className="flex gap-1">
                                                        <span className="w-2 h-2 rounded-full bg-linear-to-r from-pink-500 to-purple-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                                        <span className="w-2 h-2 rounded-full bg-linear-to-r from-purple-500 to-cyan-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                                        <span className="w-2 h-2 rounded-full bg-linear-to-r from-cyan-500 to-pink-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {showScrollDown && (
                                        <button
                                            type="button"
                                            onClick={handleScrollToBottom}
                                            className="absolute right-4 bottom-4 flex items-center gap-1 rounded-full bg-background/95 border shadow-md px-3 py-1.5 text-xs text-muted-foreground hover:bg-background hover:text-foreground transition"
                                        >
                                            <ChevronDown className="w-4 h-4" />
                                            <span>Scroll ke bawah</span>
                                        </button>
                                    )}
                                </div>
                            </ScrollArea>

                            <div className="p-6 border-t">
                                <div className="flex gap-2">
                                    <Textarea
                                        value={inputAi}
                                        onChange={(e) => setInputAi(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Ketik pesan Anda..."
                                        className="min-h-[60px] resize-none focus-visible:ring-2 focus-visible:ring-purple-500 transition-all"
                                        disabled={isLoadingAi}
                                    />
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={!inputAi.trim() || isLoadingAi}
                                        size="icon"
                                        className="h-[60px] w-[60px] bg-linear-to-r from-pink-500 via-purple-500 to-cyan-500 hover:opacity-90 transition-all hover:scale-105"
                                    >
                                        <Send className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    )
}

export default AsessmentIdComponent

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
    data: AsessmenAsesorTypes
    index: number
    setIndex: React.Dispatch<React.SetStateAction<number>>
    setActiveCapaian: React.Dispatch<React.SetStateAction<string | null>>
    setForm: React.Dispatch<
        React.SetStateAction<{
            HasilAssesmenId: string
            EvaluasiDiriId: string
            Valid: boolean
            Autentik: boolean
            Terkini: boolean
            Memadai: boolean
            Assesmen: string
            Nilai: number
            TanggalAssesmen: Date
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

function DialogPreviewDokumen({
    data,
    setData,
    openDialog,
    setOpenDialog,
    pdfPreview,
    setPdfPreview,
}: {
    data: {
        BuktiFormId: string
        PendaftaranId: string
        JenisDokumenId: string
        NamaFile: string
        NamaDokumen: string
        CreatedAt: Date | null
        UpdatedAt: Date | null
    } | null
    setData: React.Dispatch<
        React.SetStateAction<{
            BuktiFormId: string
            PendaftaranId: string
            JenisDokumenId: string
            NamaFile: string
            NamaDokumen: string
            CreatedAt: Date | null
            UpdatedAt: Date | null
        } | null>
    >
    openDialog: boolean
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
    pdfPreview: string | null
    setPdfPreview: React.Dispatch<React.SetStateAction<string | null>>
}) {
    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent
                className="w-full max-h-[80vh]  overflow-y-scroll"
                onEscapeKeyDown={(event) => event.preventDefault()}
                onPointerDownOutside={(event) => event.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>
                        Preview Dokumen {data?.NamaDokumen}
                    </DialogTitle>
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
                            setData(null)
                            setPdfPreview(null)
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
