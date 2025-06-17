'use client'
import React from 'react'
import { Label } from '@/components/ui/label'
import { ChevronLeft, ChevronRight, PenLine, Timer } from 'lucide-react'
import { Input } from '../ui/input'
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

const RekapitulasiIdComponent = ({
    dataServer,
}: {
    dataServer: SkorAsessmenTypes
}) => {
    const [data, setData] = React.useState(dataServer)
    const [index, setIndex] = React.useState<number>(0)
    const [loading, setLoading] = React.useState<boolean>(false)

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
    const nextActiveItem = () => {
        if (index + 1 !== data.ProgramStudi.MataKuliahMahasiswa.length) {
            setIndex(index + 1)
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
        }
    }
    const beforeActiveItem = () => {
        if (index - 1 !== -1) {
            setIndex(index - 1)
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
                                <CardHeader>
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
                                                                readOnly={
                                                                    loading
                                                                }
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
                                <CardFooter className="flex flex-col">
                                    <Button
                                        className="mt-5 hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer "
                                        type="submit"
                                        size={'lg'}
                                        disabled={loading}
                                        onClick={() => {}}
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
                                        className={`${
                                            loading && 'cursor-not-allowed'
                                        } flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`}
                                    >
                                        <div className="flex w-full items-center gap-2">
                                            <span>{cp.MataKuliah.Kode}</span>{' '}
                                            <span className="ml-auto text-xs">
                                                <Badge
                                                    className={
                                                        cp.SkorAsessmen
                                                            ?.MataKuliahMahasiswaId !==
                                                        ''
                                                            ? `bg-green-500`
                                                            : `bg-red-500`
                                                    }
                                                >
                                                    {cp.SkorAsessmen
                                                        ?.MataKuliahMahasiswaId !==
                                                    ''
                                                        ? `Sudah`
                                                        : `Belum`}
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
        </React.Fragment>
    )
}

export default RekapitulasiIdComponent
