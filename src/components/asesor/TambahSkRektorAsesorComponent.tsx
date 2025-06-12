'use client'
import React from 'react'
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
    getAsesorMahasiswaPagination,
    setSkRektorAsesor,
} from '@/services/Asesor/SkRektor'
import { Input } from '../ui/input'
import { Checkbox } from '../ui/checkbox'
import { Button } from '../ui/button'
import { ChevronLeft, ChevronRight, PenIcon } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '../ui/select'
import { useRouter } from 'next/navigation'
const TambahSkRektorAsesorComponent = () => {
    const router = useRouter()
    const [loading, setLoading] = React.useState<boolean>(false)
    const [asesorSelected, setAsesorSelected] = React.useState<
        ResponseAsesorMahasiswa[]
    >([])
    const [search, setSearch] = React.useState<string>('')
    const [paginationState, setPaginationState] = React.useState<{
        page: number
        limit: number
        totalElement: number
        totalPage: number
        isFirst: boolean
        isLast: boolean
        hasNext: boolean
        hasPrevious: boolean
    }>({
        page: 1,
        limit: 5,
        totalElement: 0,
        totalPage: 0,
        isFirst: false,
        isLast: false,
        hasNext: false,
        hasPrevious: false,
    })
    const form = useForm<SkRektorSkemaValidasiTipe>({
        resolver: zodResolver(SkRektorSkemaValidasi),
        defaultValues: {
            data: new File([], ''),
            NamaSk: '',
            TahunSk: '',
            NomorSk: '',
            ArrayRelation: [],
        },
    })
    const [pdfPreview, setPdfPreview] = React.useState<string | null>(null)

    React.useEffect(() => {
        setLoading(true)
        getAsesorMahasiswaPagination(
            paginationState.page,
            paginationState.limit,
            search
        )
            .then((res) => {
                setAsesorSelected(res.data)
                setLoading(false)
                setPaginationState({
                    page: res.page,
                    limit: res.limit,
                    totalElement: res.totalElement,
                    totalPage: res.totalPage,
                    isFirst: res.isFirst,
                    isLast: res.isLast,
                    hasNext: res.hasNext,
                    hasPrevious: res.hasPrevious,
                })
            })
            .catch((err) => {
                setLoading(false)
            })
    }, [paginationState.page, paginationState.limit, search])
    const onSubmit = async (data: SkRektorSkemaValidasiTipe) => {
        setLoading(true)

        await setSkRektorAsesor(
            data.data,
            data.NamaSk,
            data.TahunSk,
            data.NomorSk,
            data.ArrayRelation
        )
            .then((res) => {
                toast('Data SK Asesor Mahasiswa berhasil disimpan')
                setLoading(false)
                if (pdfPreview) URL.revokeObjectURL(pdfPreview)
                setPdfPreview(null)
                router.push('/asesor/sk-rektor')
            })
            .catch((err) => {
                toast('Data SK Asesor Mahasiswa gagal disimpan. Error: ' + err)
                setLoading(false)
            })
    }

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 gap-2 mb-3">
                {pdfPreview && (
                    <iframe
                        src={pdfPreview || ''}
                        title="PDF Preview"
                        width="100%"
                        height="500px"
                        className="border rounded"
                    ></iframe>
                )}
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-1 md:gap-3">
                        <FormField
                            control={form.control}
                            name="TahunSk"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tahun SK</FormLabel>
                                    <FormControl>
                                        <Input readOnly={loading} {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Tahun Surat Keterangan
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
                                        <Input readOnly={loading} {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Nama Surat Keterangan
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
                                        <Input readOnly={loading} {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Nomor Surat Keterangan
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
                                    <FormLabel>Unggah SK Disini</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept="application/pdf"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                if (file) {
                                                    field.onChange(file)
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
                                        Upload SK (PDF)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1">
                        <div className="flex items-center py-4">
                            {/* <Input
                                placeholder="Cari Data ..."
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                className="max-w-sm"
                            /> */}
                            <h1 className="text-2xl font-bold mb-4">Relasi</h1>
                            <div className="w-full justify-end flex">
                                <Select
                                    value={String(paginationState.limit)}
                                    onValueChange={(value) =>
                                        setPaginationState({
                                            ...paginationState,
                                            limit: Number(value),
                                        })
                                    }
                                >
                                    <SelectTrigger className="w-[100px]">
                                        <SelectValue placeholder="Pilih Limit Data" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>
                                                Pilih Limit Data
                                            </SelectLabel>
                                            {[5, 10, 20, 50, 75, 100].map(
                                                (l, idx) => (
                                                    <SelectItem
                                                        value={String(l)}
                                                        key={idx}
                                                    >
                                                        {l}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama Asesor</TableHead>
                                    <TableHead>Nama Mahasiswa</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {asesorSelected.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3}>
                                            <div className="my-2 flex w-full justify-center">
                                                Tidak Ada Relasi
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    asesorSelected.map((y) => (
                                        <TableRow className="my-2" key={y.AIM}>
                                            <TableCell>{y.NA}</TableCell>
                                            <TableCell>{y.NM}</TableCell>
                                            <TableCell>
                                                <Checkbox
                                                    disabled={loading}
                                                    id={y.AIM}
                                                    checked={(
                                                        form.watch(
                                                            'ArrayRelation'
                                                        ) || []
                                                    ).some(
                                                        (item) => item === y.AIM
                                                    )}
                                                    onCheckedChange={(
                                                        checked
                                                    ) => {
                                                        if (checked) {
                                                            form.setValue(
                                                                'ArrayRelation',
                                                                [
                                                                    ...(form.watch(
                                                                        'ArrayRelation'
                                                                    ) || []),
                                                                    y.AIM,
                                                                ]
                                                            )
                                                        } else {
                                                            form.setValue(
                                                                'ArrayRelation',
                                                                (
                                                                    form.watch(
                                                                        'ArrayRelation'
                                                                    ) || []
                                                                ).filter(
                                                                    (f) =>
                                                                        f !==
                                                                        y.AIM
                                                                )
                                                            )
                                                        }
                                                    }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                        <div className="flex items-center justify-end space-x-2 py-4">
                            <div className="flex-1 text-sm text-muted-foreground">
                                Menampilkan{' '}
                                {paginationState.page * paginationState.limit -
                                    paginationState.limit +
                                    1}{' '}
                                -{' '}
                                {paginationState.totalElement <
                                paginationState.page * paginationState.limit
                                    ? paginationState.totalElement
                                    : paginationState.page *
                                      paginationState.limit}{' '}
                                dari {paginationState.totalElement} Data.
                            </div>
                            <div className="flex items-center space-x-2 mt-4">
                                <Button
                                    variant="outline"
                                    type="button"
                                    size="sm"
                                    onClick={() => {
                                        setPaginationState({
                                            ...paginationState,
                                            page: paginationState.page - 1,
                                        })
                                    }}
                                    disabled={!paginationState.hasPrevious}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>

                                {Array.from(
                                    { length: paginationState.totalPage },
                                    (_, i) => i + 1
                                ).map((p) => (
                                    <Button
                                        key={p}
                                        type="button"
                                        variant={
                                            p === paginationState.page
                                                ? 'default'
                                                : 'outline'
                                        }
                                        size="sm"
                                        onClick={() => {
                                            if (paginationState.page !== p) {
                                                setPaginationState({
                                                    ...paginationState,
                                                    page: p,
                                                })
                                            }
                                        }}
                                    >
                                        {p}
                                    </Button>
                                ))}

                                <Button
                                    variant="outline"
                                    size="sm"
                                    type="button"
                                    onClick={() => {
                                        setPaginationState({
                                            ...paginationState,
                                            page: paginationState.page + 1,
                                        })
                                    }}
                                    disabled={!paginationState.hasNext}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center w-full">
                        <Button
                            type="submit"
                            className="hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer w-2/3 md:w-1/2"
                        >
                            <PenIcon /> Tambah
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default TambahSkRektorAsesorComponent
