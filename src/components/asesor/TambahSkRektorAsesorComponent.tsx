'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
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
import {
    SkRektorSkemaValidasi,
    SkRektorSkemaValidasiTipe,
} from '@/validation/SkRektorAsesorValidation'
import {
    getAsesorTanpaSk,
    getFileBlobByNamafile,
    setSkRektorAsesor,
} from '@/services/Asesor/SkRektor'
import { ResponseAsesorTanpaSk } from '@/types/PenunjukanAsesor'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { MultiSelect } from '../ui/multi-select'
import { LockIcon, PenIcon, TimerIcon } from 'lucide-react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../ui/card'

type AsesorTerpilih = {
    AsesorId: string
    NamaAsesor: string
    NamaTipeAsesor: string
    Email: string
}

const TambahSkRektorAsesorComponent = ({
    dataServer,
}: {
    dataServer: {
        SkRektorId: string
        NamaSk: string
        TahunSk: string
        NomorSk: string
        NamaFile: string
        NamaDokumen: string
        Disetujui: boolean
        Catatan: string
        Asesor: AsesorTerpilih[]
    }
}) => {
    const router = useRouter()
    const [loading, setLoading] = React.useState<boolean>(false)
    const [pdfPreview, setPdfPreview] = React.useState<string | null>(null)
    const [asesorTersedia, setAsesorTersedia] = React.useState<
        ResponseAsesorTanpaSk[]
    >([])
    const [asesorTerpilih, setAsesorTerpilih] = React.useState<string[]>(
        dataServer.Asesor.map((x) => x.AsesorId)
    )

    const terkunci = dataServer.Disetujui

    const form = useForm<SkRektorSkemaValidasiTipe>({
        resolver: zodResolver(SkRektorSkemaValidasi),
        defaultValues: {
            data: undefined,
            NamaSk: dataServer.NamaSk,
            TahunSk: dataServer.TahunSk,
            NomorSk: dataServer.NomorSk,
        },
    })

    React.useEffect(() => {
        if (dataServer.NamaFile) {
            getFileBlobByNamafile(dataServer.NamaFile)
                .then((res) => setPdfPreview(res))
                .catch(() => undefined)
        }
        getAsesorTanpaSk()
            .then((res) => setAsesorTersedia(res))
            .catch(() =>
                toast.error('Gagal memuat daftar asesor yang belum ber-SK')
            )
    }, [])

    // Asesor yang sudah tercakup SK ini tetap dapat dipilih ketika mengubah SK.
    const opsiAsesor = React.useMemo(() => {
        const map = new Map<string, { value: string; label: string }>()
        dataServer.Asesor.forEach((a) =>
            map.set(a.AsesorId, {
                value: a.AsesorId,
                label: `${a.NamaAsesor} — ${a.NamaTipeAsesor}`,
            })
        )
        asesorTersedia.forEach((a) =>
            map.set(a.AsesorId, {
                value: a.AsesorId,
                label: `${a.NamaAsesor} — ${a.NamaTipeAsesor}`,
            })
        )
        return Array.from(map.values())
    }, [asesorTersedia, dataServer.Asesor])

    const onSubmit = async (data: SkRektorSkemaValidasiTipe) => {
        if (asesorTerpilih.length === 0) {
            toast.error('Pilih minimal satu asesor yang dicakup SK ini')
            return
        }
        if (!dataServer.SkRektorId && !data.data) {
            toast.error('Berkas SK wajib diunggah')
            return
        }

        setLoading(true)
        try {
            const res = await setSkRektorAsesor(
                data.data,
                data.NamaSk,
                data.TahunSk,
                data.NomorSk,
                asesorTerpilih,
                dataServer.SkRektorId
            )
            toast.success(
                'SK Penugasan Asesor tersimpan dan menunggu persetujuan Wakil Rektor'
            )
            router.push('/asesor/sk-rektor')
            router.refresh()
            return res
        } catch (err) {
            toast.error(
                err instanceof Error
                    ? err.message
                    : 'SK Penugasan Asesor gagal disimpan'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full">
            {terkunci && (
                <Alert className="mb-4">
                    <LockIcon className="w-4 h-4" />
                    <AlertTitle>SK sudah disetujui</AlertTitle>
                    <AlertDescription>
                        SK ini sudah disetujui Wakil Rektor sehingga tidak dapat
                        diubah lagi. Terbitkan SK baru bila ada perubahan
                        penugasan asesor.
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 gap-2 mb-3">
                {pdfPreview && (
                    <iframe
                        src={pdfPreview}
                        title="PDF Preview"
                        width="100%"
                        height="500px"
                        className="border rounded"
                    ></iframe>
                )}
            </div>

            {dataServer.Asesor.length > 0 && (
                <div className="grid grid-cols-1 mt-5">
                    <Card>
                        <CardHeader>
                            <CardTitle>Asesor yang Dicakup SK Ini</CardTitle>
                            <CardDescription>
                                SK penugasan berlaku kontinu selama asesor
                                bertugas.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama Asesor</TableHead>
                                        <TableHead>Tipe</TableHead>
                                        <TableHead>Email</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {dataServer.Asesor.map((a) => (
                                        <TableRow key={a.AsesorId}>
                                            <TableCell>{a.NamaAsesor}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {a.NamaTipeAsesor}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{a.Email}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            )}

            <div className="grid grid-cols-1 mt-5">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Form SK Penugasan Asesor</CardTitle>
                                <CardDescription>
                                    SK diterbitkan saat asesor didaftarkan, lalu
                                    diajukan ke Wakil Rektor untuk disetujui.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-1 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="TahunSk"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tahun SK</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        readOnly={
                                                            loading || terkunci
                                                        }
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Tahun Surat Keputusan
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="NamaSk"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nama SK</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        readOnly={
                                                            loading || terkunci
                                                        }
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Nama Surat Keputusan
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="NomorSk"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nomor SK</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        readOnly={
                                                            loading || terkunci
                                                        }
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Nomor Surat Keputusan
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="data"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Unggah SK Disini
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="file"
                                                        accept="application/pdf"
                                                        disabled={
                                                            loading || terkunci
                                                        }
                                                        onChange={(e) => {
                                                            const file =
                                                                e.target
                                                                    .files?.[0]
                                                            if (file) {
                                                                field.onChange(
                                                                    file
                                                                )
                                                                setPdfPreview(
                                                                    URL.createObjectURL(
                                                                        file
                                                                    )
                                                                )
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    {dataServer.SkRektorId
                                                        ? 'Kosongkan bila tidak mengganti berkas'
                                                        : 'Upload SK (PDF)'}
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="md:col-span-2">
                                        <FormLabel>
                                            Asesor yang Dicakup SK
                                        </FormLabel>
                                        <div className="mt-2">
                                            <MultiSelect
                                                options={opsiAsesor}
                                                selected={asesorTerpilih}
                                                onChange={setAsesorTerpilih}
                                                placeholder="Pilih asesor"
                                                className={
                                                    loading || terkunci
                                                        ? 'pointer-events-none opacity-50'
                                                        : ''
                                                }
                                            />
                                        </div>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Daftar berisi asesor yang belum
                                            tercakup SK penugasan mana pun.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-center w-full mt-5">
                                    <Button
                                        disabled={loading || terkunci}
                                        type="submit"
                                        className="w-2/3 transition-all duration-100 cursor-pointer hover:scale-110 active:scale-90 md:w-1/2"
                                    >
                                        {loading ? (
                                            <React.Fragment>
                                                <TimerIcon /> Loading
                                            </React.Fragment>
                                        ) : (
                                            <React.Fragment>
                                                <PenIcon /> Simpan
                                            </React.Fragment>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default TambahSkRektorAsesorComponent
