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
import { StatusPerkawinan } from '@/generated/prisma'
import { Button } from '../ui/button'
import { PenIcon, TimerIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '../ui/input'
import { useForm } from 'react-hook-form'
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
import { Skeleton } from '../ui/skeleton'
import {
    InformasiKependudukanFormValidation,
    InformasiKependudukanSkemaValidation,
} from '@/validation/InformasiKependudukanValidation'
import {
    getInformasiKependudukanByPendaftaranId,
    updateInformasiKependudukan,
} from '@/services/KelengkapanDokumen/InformasiKependudukanService'

const InformasiKependudukan = ({
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
    const [selectableMahasiswa, setSelectableMahasiswa] =
        React.useState<string>('')
    const [loading, setLoading] = React.useState<boolean>(false)
    const [loadingAwal, setLoadingAwal] = React.useState<boolean>(false)
    const [openDialog, setOpenDialog] = React.useState<boolean>(false)
    const [titleDialog, setTitleDialog] = React.useState<string>('')
    const form = useForm<InformasiKependudukanFormValidation>({
        resolver: zodResolver(InformasiKependudukanSkemaValidation),
        defaultValues: {
            PendaftaranId: selectableMahasiswa,
            InformasiKependudukanId: undefined,
            NoKk: '',
            NoNik: '',
            Suku: '',
        },
    })

    React.useEffect(() => {
        setLoadingAwal(true)
        getInformasiKependudukanByPendaftaranId(selectableMahasiswa)
            .then((res) => {
                form.setValue('PendaftaranId', res.PendaftaranId)
                form.setValue(
                    'InformasiKependudukanId',
                    res.InformasiKependudukanId
                )
                form.setValue('NoKk', res.NoKk)
                form.setValue('NoNik', res.NoNik)
                form.setValue('Suku', res.Suku)
                setLoadingAwal(false)
            })
            .catch((err) => {
                toast('Terjadi Error: ' + err)
                setLoadingAwal(false)
            })
    }, [selectableMahasiswa])

    const onSubmit = async (
        dataSubmit: InformasiKependudukanFormValidation
    ) => {
        setLoading(true)
        updateInformasiKependudukan({
            PendaftaranId: selectableMahasiswa,
            InformasiKependudukanId: dataSubmit.InformasiKependudukanId ?? '',
            NoKk: dataSubmit.NoKk || '',
            NoNik: dataSubmit.NoNik || '',
            Suku: dataSubmit.Suku || '',
            CreatedAt: null,
            UpdatedAt: null,
        })
            .then((res) => {
                toast('Data Kependudukan Diubah')
                setLoading(false)
            })
            .catch((err) => {
                toast('Error: ' + err)
                setLoading(false)
            })
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <h1 className="text-2xl">Informasi Kependudukan</h1>
                </CardTitle>
                <CardDescription>
                    Catat Informasi Kependudukan Anda
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

                {!selectableMahasiswa ? (
                    <></>
                ) : loadingAwal ? (
                    <Skeleton className="w-full mt-2 h-56" />
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="w-full justify-center md:justify-between">
                                <div className="grid grid-cols-1 gap-4 py-4">
                                    <FormField
                                        control={form.control}
                                        name="NoNik"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nomor NIK</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        readOnly={loading}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Nomor NIK atau Nomor KTP.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="NoKk"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Nomor Kartu Keluarga
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        readOnly={loading}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Nomor Kartu Keluarga
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="Suku"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Suku</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="Suku Anda"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Suku Anda (contoh: Betawi,
                                                    Jawa, Indonesia)
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <Button
                                className="mx-2  hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer"
                                variant={'default'}
                                disabled={loading}
                                type="submit"
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
                        </form>
                    </Form>
                )}
            </CardContent>
        </Card>
    )
}

export default InformasiKependudukan
