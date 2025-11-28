'use client'
import React from 'react'
import { Label } from '@/components/ui/label'
import { BookOpenCheckIcon, ChevronDown, ChevronLeft, ChevronRight, Maximize2, Minimize2, PenLine, Send, Sparkles, Square, Timer, X } from 'lucide-react'
import { Input } from '../ui/input'
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
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
import { replaceItemAtIndex, truncateText } from '@/lib/utils'
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
import { SkorAsessmenTypes } from '@/types/AsessmentTypes'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    SkorAssesmenFormValidation,
    SkorAssesmenSchemaValidation,
} from '@/validation/RekapitulasiFormValidation'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form'
import { setSkorAsessmenFromAsesor } from '@/services/Asessment/AsessmentMahasiswaService'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { ScrollArea } from '../ui/scroll-area'
import { Textarea } from '../ui/textarea'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { ChatMessageDTO, streamChatRekapitulasi } from '@/services/Ai/AiServices'
type WindowSize = 'medium' | 'large' | 'fullscreen'

const RekapitulasiIdComponent = ({
    dataServer,
    nama
}: {
    dataServer: SkorAsessmenTypes
    nama: string
}) => {
    const [data, setData] = React.useState(dataServer)
    const [index, setIndex] = React.useState<number>(0)
    const [loading, setLoading] = React.useState<boolean>(false)
    const [openDialogTinjau, setOpenDialogTinjau] = React.useState<boolean>(false)

    const form = useForm<SkorAssesmenFormValidation>({
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

    const { control, setValue, watch } = form

    const portofolio = watch("Portofolio")
    const tulis = watch("Tulis")
    const wawancara = watch("Wawancara")
    const demo = watch("Demo")

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

            await streamChatRekapitulasi(dataServer.ProgramStudi.MataKuliahMahasiswa[index].SkorAsessmen.SkorAssesmenId, dtoMessages, (chunk) => {
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
        React.useEffect(() => {
            if (!shouldAutoScroll) return;
            const el = scrollRef.current;
            if (!el) return;
    
            el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
        }, [messagesAi, shouldAutoScroll]);
    
    // End Ai

    React.useEffect(() => {
        setIndex(0)
        form.setValue(
            'SkorAssesmenId',
            data.ProgramStudi.MataKuliahMahasiswa[0].SkorAsessmen
                .SkorAssesmenId ?? ''
        )
        form.setValue(
            'MataKuliahMahasiswaId',
            data.ProgramStudi.MataKuliahMahasiswa[0].MataKuliahMahasiswaId ?? ''
        )
        form.setValue(
            'Portofolio',
            data.ProgramStudi.MataKuliahMahasiswa[0].SkorAsessmen.Portofolio ??
                0
        )
        form.setValue(
            'Tulis',
            data.ProgramStudi.MataKuliahMahasiswa[0].SkorAsessmen.Tulis ?? 0
        )
        form.setValue(
            'Wawancara',
            data.ProgramStudi.MataKuliahMahasiswa[0].SkorAsessmen.Wawancara ?? 0
        )
        form.setValue(
            'Demo',
            data.ProgramStudi.MataKuliahMahasiswa[0].SkorAsessmen.Demo ?? 0
        )
        form.setValue(
            'Diakui',
            data.ProgramStudi.MataKuliahMahasiswa[0].SkorAsessmen.Diakui ??
                false
        )
        form.setValue(
            'SkorRataRata',
            data.ProgramStudi.MataKuliahMahasiswa[0].SkorAsessmen
                .SkorRataRata ?? 0
        )
        form.setValue(
            'NilaiHuruf',
            data.ProgramStudi.MataKuliahMahasiswa[0].SkorAsessmen.NilaiHuruf ??
                null
        )
    }, [])

    React.useEffect(() => {
        const scoresRaw = [portofolio, tulis, wawancara, demo]

        const scores = scoresRaw
            .map((s) => (typeof s === "string" ? parseInt(s) : s))
            .filter((s) => typeof s === "number" && !isNaN(s))

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

    const nextActiveItem = () => {
        if (index + 1 !== data.ProgramStudi.MataKuliahMahasiswa.length) {
            form.setValue(
                'SkorAssesmenId',
                data.ProgramStudi.MataKuliahMahasiswa[index + 1].SkorAsessmen
                    .SkorAssesmenId ?? ''
            )
            form.setValue(
                'MataKuliahMahasiswaId',
                data.ProgramStudi.MataKuliahMahasiswa[index + 1]
                    .MataKuliahMahasiswaId ?? ''
            )
            form.setValue(
                'Portofolio',
                data.ProgramStudi.MataKuliahMahasiswa[index + 1].SkorAsessmen
                    .Portofolio ?? 0
            )
            form.setValue(
                'Tulis',
                data.ProgramStudi.MataKuliahMahasiswa[index + 1].SkorAsessmen
                    .Tulis ?? 0
            )
            form.setValue(
                'Wawancara',
                data.ProgramStudi.MataKuliahMahasiswa[index + 1].SkorAsessmen
                    .Wawancara ?? 0
            )
            form.setValue(
                'Demo',
                data.ProgramStudi.MataKuliahMahasiswa[index + 1].SkorAsessmen
                    .Demo ?? 0
            )
            form.setValue(
                'Diakui',
                data.ProgramStudi.MataKuliahMahasiswa[index + 1].SkorAsessmen
                    .Diakui ?? false
            )
            form.setValue(
                'SkorRataRata',
                data.ProgramStudi.MataKuliahMahasiswa[index + 1].SkorAsessmen
                    .SkorRataRata ?? 0
            )
            form.setValue(
                'NilaiHuruf',
                data.ProgramStudi.MataKuliahMahasiswa[index + 1].SkorAsessmen
                    .NilaiHuruf ?? null
            )
            setIndex(index + 1)
        }
    }
    const beforeActiveItem = () => {
        if (index - 1 !== -1) {
            form.setValue(
                'SkorAssesmenId',
                data.ProgramStudi.MataKuliahMahasiswa[index - 1].SkorAsessmen
                    .SkorAssesmenId ?? ''
            )
            form.setValue(
                'MataKuliahMahasiswaId',
                data.ProgramStudi.MataKuliahMahasiswa[index - 1]
                    .MataKuliahMahasiswaId ?? ''
            )
            form.setValue(
                'Portofolio',
                data.ProgramStudi.MataKuliahMahasiswa[index - 1].SkorAsessmen
                    .Portofolio ?? 0
            )
            form.setValue(
                'Tulis',
                data.ProgramStudi.MataKuliahMahasiswa[index - 1].SkorAsessmen
                    .Tulis ?? 0
            )
            form.setValue(
                'Wawancara',
                data.ProgramStudi.MataKuliahMahasiswa[index - 1].SkorAsessmen
                    .Wawancara ?? 0
            )
            form.setValue(
                'Demo',
                data.ProgramStudi.MataKuliahMahasiswa[index - 1].SkorAsessmen
                    .Demo ?? 0
            )
            form.setValue(
                'Diakui',
                data.ProgramStudi.MataKuliahMahasiswa[index - 1].SkorAsessmen
                    .Diakui ?? false
            )
            form.setValue(
                'SkorRataRata',
                data.ProgramStudi.MataKuliahMahasiswa[index - 1].SkorAsessmen
                    .SkorRataRata ?? 0
            )
            form.setValue(
                'NilaiHuruf',
                data.ProgramStudi.MataKuliahMahasiswa[index - 1].SkorAsessmen
                    .NilaiHuruf ?? null
            )
            setIndex(index - 1)
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
                    const temp = data.ProgramStudi.MataKuliahMahasiswa[idx]

                    setData({
                        ...data,
                        ProgramStudi: {
                            ...data.ProgramStudi,
                            MataKuliahMahasiswa: replaceItemAtIndex(
                                data.ProgramStudi.MataKuliahMahasiswa,
                                idx,
                                {
                                    ...temp,
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
                                        Ai: res.Ai
                                    },
                                }
                            ),
                        },
                    })
                    toast('Skor Berhasil Disimpan')
                    setLoading(false)
                })
                .catch((err) => {
                    toast('Skor Gagal Disimpan; Error: ' + err)
                    setLoading(false)
                })
        }
    }

    return (
        <React.Fragment>
            <SidebarInset className="mr-[300px]">
                <div className="w-full">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <Card>
                                <CardHeader className='relative'>
                                    <CardTitle>
                                        {
                                            data.ProgramStudi
                                                .MataKuliahMahasiswa[index]
                                                .MataKuliah.Nama
                                        }
                                    </CardTitle>
                                    <CardDescription>
                                        Isi Form Skor Asessmen ini untuk
                                        finalisasi
                                    </CardDescription>
                                    <button
                                        onClick={() => setOpenAi(true)}
                                        type='button'
                                        className="absolute top-0 right-5 z-50 group"
                                        aria-label="Open AI Chat"
                                    >
                                        <div className="relative">
                                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 blur-md opacity-75 group-hover:opacity-100 animate-spin-slow"></div>
                                            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 animate-gradient">
                                                <span className="text-white font-bold text-lg">AI</span>
                                                <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-300 animate-pulse" />
                                            </div>
                                        </div>
                                    </button>
                                </CardHeader>
                                <CardContent>
                                    <div className="container mx-auto">
                                        <div className="w-full grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-3 mb-3 px-4">
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
                                                                readOnly={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value
                                                                }
                                                                onChange={(e) =>
                                                                    field.onChange(
                                                                        parseInt(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    )
                                                                }
                                                                onBlur={
                                                                    field.onBlur
                                                                }
                                                                name={
                                                                    field.name
                                                                }
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
                                                        <FormLabel>
                                                            Tulis
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value
                                                                }
                                                                onChange={(e) =>
                                                                    field.onChange(
                                                                        parseInt(
                                                                            e
                                                                                .target
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
                                                                readOnly={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value
                                                                }
                                                                onChange={(e) =>
                                                                    field.onChange(
                                                                        parseInt(
                                                                            e
                                                                                .target
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
                                                        <FormLabel>
                                                            Demo
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value
                                                                }
                                                                onChange={(e) =>
                                                                    field.onChange(
                                                                        parseInt(
                                                                            e
                                                                                .target
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
                                        </div>
                                        <Separator className="my-3" />
                                        <div className="w-full grid grid-cols-1 sm:grid-cols-1 gap-3 px-4">
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
                                                            checked={
                                                                field.value
                                                            }
                                                            disabled={loading}
                                                            onChange={(e) =>
                                                                field.onChange(
                                                                    e
                                                                )
                                                            }
                                                        />
                                                        <div className="font-semibold">
                                                            Diakui
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            Mata Kuliah ini
                                                            diakui oleh Asesor
                                                        </div>
                                                    </label>
                                                )}
                                            />
                                        </div>
                                        <Separator className="my-3" />
                                        <div className="w-full grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-3 px-4">
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
                                                                value={
                                                                    field.value
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
                                                                readOnly
                                                                value={
                                                                    field.value ??
                                                                    ''
                                                                }
                                                                onBlur={
                                                                    field.onBlur
                                                                }
                                                                name={
                                                                    field.name
                                                                }
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
                                </CardContent>
                                <CardFooter className="flex flex-row gap-3 justify-center">
                                    <Button
                                        className="mt-5 hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer "
                                        type="button"
                                        size={'lg'}
                                        disabled={loading}
                                        onClick={() => setOpenDialogTinjau(true)}
                                    >
                                        {loading ? (
                                            <>
                                                <Timer /> Loading
                                            </>
                                        ) : (
                                            <>
                                                <BookOpenCheckIcon />
                                                Tinjau Asessmen
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        className="mt-5 hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer "
                                        type="submit"
                                        size={'lg'}
                                        disabled={loading}
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
                            </Card>
                        </form>
                    </Form>
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
                            {
                                data.ProgramStudi.MataKuliahMahasiswa[index]
                                    .MataKuliah.Nama
                            }
                        </div>
                        <Label className="flex items-center gap-2 text-sm">
                            <Button
                                onClick={() => nextActiveItem()}
                                disabled={
                                    index + 1 ===
                                    data.ProgramStudi.MataKuliahMahasiswa.length
                                }
                                className="bg-transparent text-gray-800 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-600 hover:scale-105 active:scale-95"
                            >
                                <ChevronRight className="shadow-none" />
                            </Button>
                        </Label>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup className="px-0">
                        <SidebarGroupContent>
                            {data.ProgramStudi.MataKuliahMahasiswa.map(
                                (cp, index) => (
                                    <a
                                        href="#"
                                        onClick={() => {
                                            if (!loading) {
                                                setIndex(index)
                                                form.setValue(
                                                    'SkorAssesmenId',
                                                    cp.SkorAsessmen
                                                        .SkorAssesmenId ?? ''
                                                )
                                                form.setValue(
                                                    'MataKuliahMahasiswaId',
                                                    cp.MataKuliahMahasiswaId ??
                                                    ''
                                                )
                                                form.setValue(
                                                    'Portofolio',
                                                    cp.SkorAsessmen
                                                        .Portofolio ?? 0
                                                )
                                                form.setValue(
                                                    'Tulis',
                                                    cp.SkorAsessmen.Tulis ?? 0
                                                )
                                                form.setValue(
                                                    'Wawancara',
                                                    cp.SkorAsessmen.Wawancara ??
                                                    0
                                                )
                                                form.setValue(
                                                    'Demo',
                                                    cp.SkorAsessmen.Demo ?? 0
                                                )
                                                form.setValue(
                                                    'Diakui',
                                                    cp.SkorAsessmen.Diakui ??
                                                    false
                                                )
                                                form.setValue(
                                                    'SkorRataRata',
                                                    cp.SkorAsessmen
                                                        .SkorRataRata ?? 0
                                                )
                                                form.setValue(
                                                    'NilaiHuruf',
                                                    cp.SkorAsessmen
                                                        .NilaiHuruf ?? null
                                                )
                                            }
                                        }}
                                        key={cp.MataKuliahMahasiswaId}
                                        className={`${loading && 'cursor-not-allowed'
                                            } flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`}
                                    >
                                        <div className="flex w-full items-center gap-2">
                                            <span>{cp.MataKuliah.Kode}</span>{' '}
                                            <span className="ml-auto text-xs">
                                                <Badge
                                                    className={
                                                        cp.SkorAsessmen
                                                            ?.MataKuliahMahasiswaId !==
                                                            '' && !cp.SkorAsessmen.Ai
                                                            ? `bg-green-500`
                                                            : cp.SkorAsessmen
                                                                ?.MataKuliahMahasiswaId !==
                                                                '' && cp.SkorAsessmen.Ai ? `bg-orange-500` : `bg-red-500`
                                                    }
                                                >
                                                    {cp.SkorAsessmen
                                                        ?.MataKuliahMahasiswaId !==
                                                        '' && !cp.SkorAsessmen.Ai
                                                        ? `Sudah`
                                                        : cp.SkorAsessmen
                                                            ?.MataKuliahMahasiswaId !==
                                                            '' && cp.SkorAsessmen.Ai ? `Peer Review AI` : `Belum`}
                                                </Badge>
                                            </span>
                                        </div>
                                        <span className="font-medium">
                                            {truncateText(
                                                cp.MataKuliah.Nama,
                                                25
                                            )}
                                        </span>
                                    </a>
                                )
                            )}
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
            <Dialog open={openDialogTinjau} onOpenChange={setOpenDialogTinjau}>
                <DialogContent className="w-[80vw] h-[80vh] max-w-[80vw] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Peninjauan Dokumen Asessmen</DialogTitle>
                        <DialogDescription>
                            Di Jendela ini hanya menampilkan Nilai dan Justifikasi.
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className='flex-1 pr-4 overflow-hidden'>
                        <div className="grid grid-cols-1 gap-2">
                            {
                                dataServer.ProgramStudi.MataKuliahMahasiswa[index].EvaluasiDiri.map((ed, idx) => (
                                    <div className="" key={idx}>
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className='text-justify'>{ed.NamaCp}</CardTitle>
                                                <CardDescription>Profisiensi: {ed.ProfisiensiPengetahuan}</CardDescription>
                                            </CardHeader>
                                            <CardContent className='grid grid-cols-1 gap-3'>
                                                <div className="flex flex-row gap-2">
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Badge className={`${ed.Valid ? "bg-green-600" : ""} cursor-pointer`} variant={'default'}>Valid</Badge>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="max-w-sm text-sm texjus">
                                                            "AI Asessmen": {ed.Justifikasi?.Valid ?? "Justifikasi valid belum tersedia."}
                                                        </PopoverContent>
                                                    </Popover>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Badge className={`${ed.Autentik ? "bg-green-600" : ""} cursor-pointer`} variant={'default'}>Autentik</Badge>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="max-w-sm text-sm texjus">
                                                            "AI Asessmen": {ed.Justifikasi?.Autentik ?? "Justifikasi Autentik belum tersedia."}
                                                        </PopoverContent>
                                                    </Popover>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Badge className={`${ed.Terkini ? "bg-green-600" : ""} cursor-pointer`} variant={'default'}>Terkini</Badge>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="max-w-sm text-sm texjus">
                                                            "AI Asessmen": {ed.Justifikasi?.Terkini ?? "Justifikasi Terkini belum tersedia."}
                                                        </PopoverContent>
                                                    </Popover>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Badge className={`${ed.Memadai ? "bg-green-600" : ""} cursor-pointer`} variant={'default'}>Memadai</Badge>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="max-w-sm text-sm texjus">
                                                            "AI Asessmen": {ed.Justifikasi?.Memadai ?? "Justifikasi Memadai belum tersedia."}
                                                        </PopoverContent>
                                                    </Popover>

                                                </div>
                                                <div className="grid grid-cols-1 gap-3">
                                                    <Label htmlFor="asessmen">Asessmen</Label>
                                                    <Textarea readOnly id="asessmen" rows={3} defaultValue={ed.Assesmen ?? ''} />
                                                </div>
                                                <div className="grid grid-cols-1 gap-3">
                                                    <Label htmlFor="nilai">Nilai</Label>
                                                    <Input readOnly id="nilai" type='text' value={ed.Nilai} />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                ))
                            }
                        </div>
                    </ScrollArea>
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="default">
                                Tutup
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={openAi} onOpenChange={setOpenAi}>
                <DialogContent className={`${getWindowSizeClasses()} p-0 gap-0 border-0 overflow-hidden transition-all duration-300 flex flex-col`}>
                    <VisuallyHidden>
                        <DialogTitle>RPL Chatbot</DialogTitle>
                        <DialogDescription>
                            AI assistant untuk sistem RPL.
                        </DialogDescription>
                    </VisuallyHidden>
                    <div className="relative w-full h-full flex flex-1 flex-col">
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-20 blur-xl animate-spin-slow pointer-events-none"></div>
                        <div className="absolute inset-[1px] bg-background rounded-lg"></div>

                        <div className="relative z-10 flex flex-col h-full min-h-0">
                            <div className="flex items-center justify-between gap-3 p-4 border-b bg-background/50 backdrop-blur-sm">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 flex items-center justify-center animate-gradient">
                                            <span className="text-white font-bold">AI</span>
                                        </div>
                                        <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300 animate-pulse" />
                                    </div>
                                    <h2 className="text-xl font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent animate-gradient">
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
                                                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 flex items-center justify-center animate-gradient">
                                                        <Sparkles className="w-10 h-10 text-white animate-pulse" />
                                                    </div>
                                                </div>
                                                <h3 className="text-2xl font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                                                    Halo { nama }, Ada yang bisa AI bantu?
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
                                                        ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white'
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
                                                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-pink-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
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
                                        className="h-[60px] w-[60px] bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:opacity-90 transition-all hover:scale-105"
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

export default RekapitulasiIdComponent


function convertScoreToGrade(score: number): string {
    if (score >= 86 && score <= 100) return "A";
    if (score >= 76 && score <= 85) return "B";
    if (score >= 66 && score <= 75) return "C";
    if (score >= 56 && score <= 65) return "D";
    return "E"; // 0–55
}
