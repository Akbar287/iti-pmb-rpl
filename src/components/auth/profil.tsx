'use client'
import { ProfilInterface } from '@/types/ProfilTypes'
import {
    UserCreateFormValidation,
    UserCreateSkemaValidation,
} from '@/validation/ProfilValidation'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { CalendarIcon, Lock, SaveAll, Timer, User2 } from 'lucide-react'
import { format } from 'date-fns'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { cn } from '@/lib/utils'
import { Calendar } from '../ui/calendar'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../ui/card'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '../ui/select'
import {
    Country,
    Desa,
    Kabupaten,
    Kecamatan,
    Provinsi,
} from '@/generated/prisma'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import {
    getDesaByKecamatanId,
    getKabupatenByProvinsiId,
    getKecamatanByKabupatenId,
    getProvinsiByCountryId,
} from '@/services/AreaServices'
import { updatePassword, updateProfilService } from '@/services/ProfileService'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog'

interface IProfil {
    data: ProfilInterface | null
    provinsiDataServer: Provinsi[]
    kabupatenDataServer: Kabupaten[]
    kecamatanDataServer: Kecamatan[]
    desaDataServer: Desa[]
    countryDataServer: Country[]
}

const Profil = ({
    data,
    countryDataServer,
    provinsiDataServer,
    kabupatenDataServer,
    kecamatanDataServer,
    desaDataServer,
}: IProfil) => {
    const { update } = useSession()

    const [countryData, setCountryData] =
        React.useState<Country[]>(countryDataServer)
    const [provinsiData, setProvinsiData] =
        React.useState<Provinsi[]>(provinsiDataServer)
    const [profilePicture, setProfilePicture] = React.useState<string | null>(
        null
    )
    const [openDialogPassword, setOpenDialogPassword] =
        React.useState<boolean>(false)
    const [formPassword, setFormPassword] = React.useState<{
        password_lama: string
        password_baru: string
    }>({
        password_lama: '',
        password_baru: '',
    })
    const [imageFile, setImageFile] = React.useState<File | null>(null)
    const [kabupatenData, setKabupatenData] =
        React.useState<Kabupaten[]>(kabupatenDataServer)
    const [kecamatanData, setKecamatanData] =
        React.useState<Kecamatan[]>(kecamatanDataServer)
    const [desaData, setDesaData] = React.useState<Desa[]>(desaDataServer)
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
    const [loading, setLoading] = React.useState<boolean>(false)
    const form = useForm<UserCreateFormValidation>({
        resolver: zodResolver(UserCreateSkemaValidation),
        defaultValues: {
            CountryId:
                data?.Alamat?.Desa.Kecamatan.Kabupaten.Provinsi.Country
                    .CountryId,
            ProvinsiId:
                data?.Alamat?.Desa.Kecamatan.Kabupaten.Provinsi.ProvinsiId,
            KabupatenId: data?.Alamat?.Desa.Kecamatan.Kabupaten.KabupatenId,
            KecamatanId: data?.Alamat?.Desa.Kecamatan.KecamatanId,
            DesaId: data?.Alamat?.Desa.DesaId,
            Alamat: data?.Alamat?.Alamat,
            KodePos: data?.Alamat?.KodePos,
            Nama: data?.Nama,
            Email: data?.Email,
            Username:
                data?.Userlogin !== undefined
                    ? data?.Userlogin[0].Username
                    : '',
            TempatLahir: data?.TempatLahir ?? undefined,
            TanggalLahir: data?.TanggalLahir ?? new Date(),
            JenisKelamin: data?.JenisKelamin,
            PendidikanTerakhir: data?.PendidikanTerakhir,
            Avatar: data?.Avatar ?? '',
            Agama: data?.Agama ?? '',
            Telepon: data?.Telepon ?? '',
            NomorWa: data?.NomorWa ?? '',
            NomorHp: data?.NomorHp ?? '',
        },
    })
    const onSubmit = async (data: UserCreateFormValidation) => {
        setLoading(true)
        await updateProfilService(data)
        toast('Profil berhasil diubah')
        setLoading(false)
    }

    const submitUpdatePassword = async () => {
        setLoading(true)
        const res = await updatePassword(formPassword)
        console.log(res)
        setOpenDialogPassword(false)
        setFormPassword({
            password_baru: '',
            password_lama: '',
        })
        toast(res.message)
        setLoading(false)
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            setProfilePicture(URL.createObjectURL(file))
        }
    }

    const handleUpload = async () => {
        if (!imageFile) return
        setLoading(true)
        const formData = new FormData()
        formData.append('avatar', imageFile)

        try {
            const res = await fetch('/api/protected/avatar', {
                method: 'POST',
                body: formData,
            })

            if (!res.ok) throw new Error('Upload failed')

            await res.json()
            await update()
            setImageFile(null)
            setProfilePicture(null)
            toast('Upload Gambar Berhasil')
        } catch (err) {
            console.error(err)
            toast('Terdapat Kesalahan saat upload')
        } finally {
            setLoading(false)
            toast('Upload Gambar Berhasil')
        }
    }

    return (
        <div className="w-full">
            <Card className="w-full mb-2">
                <CardHeader>
                    <CardTitle>Gambar Profil</CardTitle>
                    <CardDescription>
                        Silakan Ubah Gambar Profil anda.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center w-full">
                        <Image
                            src={
                                profilePicture !== null
                                    ? profilePicture
                                    : '/api/protected/avatar?avatar=' +
                                      (data !== null
                                          ? data.Avatar
                                          : 'default.png')
                            }
                            alt={data !== null ? data.Nama : 'Gambar Profil'}
                            className="aspect-square"
                            width={'150'}
                            height={'150'}
                            placeholder="blur"
                            blurDataURL="iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAMAAAC67D+PAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAB4UExUReHr/9/p/eLs/uLs/+Ls/6u5/XuN/HyO/OLs/+Hr/+Ls/+Dq/9Ld/7TB/oaX/Nbh/4qb/HqN/ODq/t/p/dTf/Y2e/HqM/I6f/Njj/93n/N7o/MDM/JSk/MDN/OHr/t7o/cLO/au5/LLA/MPQ/oKU/HyO/Ku5/f///+YXLFcAAAAJdFJOU/39/f79/v7+/A3xRCEAAAABYktHRCctD6gjAAAACXBIWXMAAAsSAAALEgHS3X78AAAAB3RJTUUH6QQVBjcc71NhTgAAAF1JREFUCNclykcSgCAQRNEx6yDJgAkVEbn/ER3Lv+h6i4aGQqQBoGFty34yLgRnH1EqrZVEgK4fRmOmmbgs62btftChP93l/eXOBPAO5nlMuFPASCLHDPKirKiyqF860Qao+6qD4QAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNS0wNC0yMVQwNjo1NToyMyswMDowMJB/OL0AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjUtMDQtMjFUMDY6NTU6MjMrMDA6MDDhIoABAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDI1LTA0LTIxVDA2OjU1OjI4KzAwOjAwtDD1JAAAAABJRU5ErkJggg=="
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <div className="flex justify-center w-full">
                        {profilePicture !== null ? (
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    type="button"
                                    disabled={loading}
                                    variant={'destructive'}
                                    onClick={() => {
                                        setImageFile(null)
                                        setProfilePicture(null)
                                    }}
                                    className="mr-2 hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer "
                                >
                                    {loading ? <Timer /> : <SaveAll />}
                                    {loading ? 'Loading' : 'Batalkan'}
                                </Button>
                                <Button
                                    type="button"
                                    disabled={loading}
                                    onClick={() => handleUpload()}
                                    variant={'default'}
                                    className="mr-2 hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer "
                                >
                                    {loading ? <Timer /> : <SaveAll />}
                                    {loading ? 'Loading' : 'Upload'}
                                </Button>
                            </div>
                        ) : (
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="picture">Picture</Label>
                                <Input
                                    id="picture"
                                    onChange={(e) => handleImageChange(e)}
                                    type="file"
                                />
                            </div>
                        )}
                        {/* <Button
                            type="button"
                            disabled={loading}
                            className="mr-2  hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer "
                        >
                            {loading ? <Timer /> : <SaveAll />}
                            {loading ? 'Loading' : 'Unggah Gambar'}
                        </Button> */}
                    </div>
                </CardFooter>
            </Card>
            <div className="w-full items-center justify-between">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle>Data Profil</CardTitle>
                                <CardDescription>
                                    Silakan Ubah Data Profil anda.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col">
                                    {errorMessage && (
                                        <Alert
                                            variant="destructive"
                                            className="bg-transparent border-red-500 "
                                        >
                                            <User2 className="h-4 w-4" />
                                            <AlertTitle className="font-semibold text-red-500">
                                                Kesalahan
                                            </AlertTitle>
                                            <AlertDescription className="text-red-500">
                                                {errorMessage}
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                    <div className="container mx-auto">
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                            <FormField
                                                control={form.control}
                                                name="Nama"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Nama
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Nama Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="Username"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Username
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Username anda.
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="Email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Email
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Email aktif anda.
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="TempatLahir"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Tempat Lahir
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Masukan Kota Tempat
                                                            Lahir Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="TanggalLahir"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-col">
                                                        <FormLabel>
                                                            Tanggal Lahir
                                                        </FormLabel>
                                                        <Popover>
                                                            <PopoverTrigger
                                                                asChild
                                                            >
                                                                <FormControl>
                                                                    <Button
                                                                        variant={
                                                                            'outline'
                                                                        }
                                                                        className={cn(
                                                                            'w-[240px] pl-3 text-left font-normal',
                                                                            !field.value &&
                                                                                'text-muted-foreground'
                                                                        )}
                                                                    >
                                                                        {field.value instanceof
                                                                        Date ? (
                                                                            format(
                                                                                field.value,
                                                                                'PPP'
                                                                            )
                                                                        ) : (
                                                                            <span>
                                                                                Pilih
                                                                                Tanggal
                                                                            </span>
                                                                        )}
                                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent
                                                                className="w-auto p-0"
                                                                align="start"
                                                            >
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={
                                                                        field.value
                                                                    }
                                                                    onSelect={
                                                                        field.onChange
                                                                    }
                                                                    disabled={(
                                                                        date
                                                                    ) =>
                                                                        date >
                                                                            new Date() ||
                                                                        date <
                                                                            new Date(
                                                                                '1900-01-01'
                                                                            )
                                                                    }
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                        <FormDescription>
                                                            Tanggal Lahir kamu
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="JenisKelamin"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Jenis Kelamin
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                disabled={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value ??
                                                                    ''
                                                                }
                                                                onValueChange={
                                                                    field.onChange
                                                                }
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Jenis Kelamin" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectGroup>
                                                                        <SelectLabel>
                                                                            Jenis
                                                                            Kelamin
                                                                        </SelectLabel>
                                                                        <SelectItem value="PRIA">
                                                                            PRIA
                                                                        </SelectItem>
                                                                        <SelectItem value="WANITA">
                                                                            WANITA
                                                                        </SelectItem>
                                                                    </SelectGroup>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Pilih Jenis Kelamin
                                                            Anda.
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="PendidikanTerakhir"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Pendidikan Terakhir
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                disabled={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value
                                                                }
                                                                onValueChange={
                                                                    field.onChange
                                                                }
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Jenis Kelamin" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectGroup>
                                                                        <SelectLabel>
                                                                            Pendidikan
                                                                            Terakhir
                                                                        </SelectLabel>
                                                                        <SelectItem value="TIDAK_TAMAT_SD">
                                                                            TIDAK
                                                                            TAMAT
                                                                            SD
                                                                        </SelectItem>
                                                                        <SelectItem value="SD">
                                                                            SD
                                                                        </SelectItem>
                                                                        <SelectItem value="SMP">
                                                                            SMP
                                                                        </SelectItem>
                                                                        <SelectItem value="SMA">
                                                                            SMA
                                                                        </SelectItem>
                                                                        <SelectItem value="D3">
                                                                            D3
                                                                        </SelectItem>
                                                                        <SelectItem value="S1">
                                                                            S1
                                                                        </SelectItem>
                                                                        <SelectItem value="S2">
                                                                            S2
                                                                        </SelectItem>
                                                                        <SelectItem value="S3">
                                                                            S3
                                                                        </SelectItem>
                                                                    </SelectGroup>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Pendidikan Terakhir
                                                            Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="Agama"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Agama
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                disabled={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value
                                                                }
                                                                onValueChange={
                                                                    field.onChange
                                                                }
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Agama" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectGroup>
                                                                        <SelectLabel>
                                                                            Agama
                                                                        </SelectLabel>
                                                                        <SelectItem value="Islam">
                                                                            Islam
                                                                        </SelectItem>
                                                                        <SelectItem value="Kristen">
                                                                            Kristen
                                                                        </SelectItem>
                                                                        <SelectItem value="Hindu">
                                                                            Hindu
                                                                        </SelectItem>
                                                                        <SelectItem value="Budha">
                                                                            Budha
                                                                        </SelectItem>
                                                                        <SelectItem value="Konghucu">
                                                                            Konghucu
                                                                        </SelectItem>
                                                                        <SelectItem value="Lainnya">
                                                                            Lainnya
                                                                        </SelectItem>
                                                                        <SelectItem value="Tidak Punya">
                                                                            Tidak
                                                                            Punya
                                                                        </SelectItem>
                                                                    </SelectGroup>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Pilih Agama Anda.
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="Telepon"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Telepon
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Nomor Telepon Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="NomorHp"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Nomor HP
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Nomor HP Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="NomorWa"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Nomor WhatsApp
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Nomor WhatsApp Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="CountryId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Negara
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                disabled={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value ??
                                                                    ''
                                                                }
                                                                onValueChange={(
                                                                    value
                                                                ) => {
                                                                    setKabupatenData(
                                                                        []
                                                                    )
                                                                    setKecamatanData(
                                                                        []
                                                                    )
                                                                    setDesaData(
                                                                        []
                                                                    )
                                                                    field.onChange(
                                                                        value
                                                                    )
                                                                    form.setValue(
                                                                        'ProvinsiId',
                                                                        ''
                                                                    )
                                                                    form.setValue(
                                                                        'KabupatenId',
                                                                        ''
                                                                    )
                                                                    form.setValue(
                                                                        'KecamatanId',
                                                                        ''
                                                                    )
                                                                    form.setValue(
                                                                        'DesaId',
                                                                        ''
                                                                    )
                                                                    getProvinsiByCountryId(
                                                                        form.watch(
                                                                            'CountryId'
                                                                        ) || ''
                                                                    ).then(
                                                                        (res) =>
                                                                            setProvinsiData(
                                                                                res
                                                                            )
                                                                    )
                                                                }}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Negara" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {countryData.map(
                                                                        (c) => (
                                                                            <SelectItem
                                                                                value={
                                                                                    c.CountryId
                                                                                }
                                                                                key={
                                                                                    c.CountryId
                                                                                }
                                                                            >
                                                                                {
                                                                                    c.Nama
                                                                                }
                                                                            </SelectItem>
                                                                        )
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Pilih Negara Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="ProvinsiId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Provinsi
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                disabled={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value ??
                                                                    ''
                                                                }
                                                                onValueChange={(
                                                                    value
                                                                ) => {
                                                                    field.onChange(
                                                                        value
                                                                    )
                                                                    setKecamatanData(
                                                                        []
                                                                    )
                                                                    setDesaData(
                                                                        []
                                                                    )
                                                                    form.setValue(
                                                                        'KabupatenId',
                                                                        ''
                                                                    )
                                                                    form.setValue(
                                                                        'KecamatanId',
                                                                        ''
                                                                    )
                                                                    form.setValue(
                                                                        'DesaId',
                                                                        ''
                                                                    )
                                                                    getKabupatenByProvinsiId(
                                                                        form.watch(
                                                                            'ProvinsiId'
                                                                        ) || ''
                                                                    ).then(
                                                                        (res) =>
                                                                            setKabupatenData(
                                                                                res
                                                                            )
                                                                    )
                                                                }}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Provinsi" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {provinsiData.map(
                                                                        (p) => (
                                                                            <SelectItem
                                                                                value={
                                                                                    p.ProvinsiId
                                                                                }
                                                                                key={
                                                                                    p.ProvinsiId
                                                                                }
                                                                            >
                                                                                {
                                                                                    p.Nama
                                                                                }
                                                                            </SelectItem>
                                                                        )
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Pilih Provinsi Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="KabupatenId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Kabupaten
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                disabled={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value ??
                                                                    ''
                                                                }
                                                                onValueChange={(
                                                                    value
                                                                ) => {
                                                                    field.onChange(
                                                                        value
                                                                    )
                                                                    setDesaData(
                                                                        []
                                                                    )
                                                                    form.setValue(
                                                                        'KecamatanId',
                                                                        ''
                                                                    )
                                                                    form.setValue(
                                                                        'DesaId',
                                                                        ''
                                                                    )
                                                                    getKecamatanByKabupatenId(
                                                                        form.watch(
                                                                            'KabupatenId'
                                                                        ) || ''
                                                                    ).then(
                                                                        (res) =>
                                                                            setKecamatanData(
                                                                                res
                                                                            )
                                                                    )
                                                                }}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Kabupaten" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {kabupatenData.map(
                                                                        (p) => (
                                                                            <SelectItem
                                                                                value={
                                                                                    p.KabupatenId
                                                                                }
                                                                                key={
                                                                                    p.KabupatenId
                                                                                }
                                                                            >
                                                                                {
                                                                                    p.Nama
                                                                                }
                                                                            </SelectItem>
                                                                        )
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Pilih Kabupaten Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="KecamatanId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Kecamatan
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                disabled={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value ??
                                                                    ''
                                                                }
                                                                onValueChange={(
                                                                    value
                                                                ) => {
                                                                    field.onChange(
                                                                        value
                                                                    )
                                                                    form.setValue(
                                                                        'DesaId',
                                                                        ''
                                                                    )
                                                                    getDesaByKecamatanId(
                                                                        form.watch(
                                                                            'KecamatanId'
                                                                        ) || ''
                                                                    ).then(
                                                                        (res) =>
                                                                            setDesaData(
                                                                                res
                                                                            )
                                                                    )
                                                                }}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Kecamatan" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {kecamatanData.map(
                                                                        (p) => (
                                                                            <SelectItem
                                                                                value={
                                                                                    p.KecamatanId
                                                                                }
                                                                                key={
                                                                                    p.KecamatanId
                                                                                }
                                                                            >
                                                                                {
                                                                                    p.Nama
                                                                                }
                                                                            </SelectItem>
                                                                        )
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Pilih Kecamatan Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="DesaId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Desa
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                disabled={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value ??
                                                                    ''
                                                                }
                                                                onValueChange={
                                                                    field.onChange
                                                                }
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Desa" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {desaData.map(
                                                                        (p) => (
                                                                            <SelectItem
                                                                                value={
                                                                                    p.DesaId
                                                                                }
                                                                                key={
                                                                                    p.DesaId
                                                                                }
                                                                            >
                                                                                {
                                                                                    p.Nama
                                                                                }
                                                                            </SelectItem>
                                                                        )
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Pilih Desa Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="Alamat"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Alamat
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                disabled={
                                                                    loading
                                                                }
                                                                {...field}
                                                                placeholder="Alamat Anda."
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Masukan Alamat
                                                            Lengkap Rumah Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="KodePos"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Kode Pos
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Kode Pos Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="mr-2  hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer "
                                >
                                    {loading ? <Timer /> : <SaveAll />}
                                    {loading ? 'Loading' : 'Simpan Data'}
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => setOpenDialogPassword(true)}
                                    disabled={loading}
                                    className="mx-2  hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer "
                                >
                                    {loading ? <Timer /> : <Lock />}
                                    Ubah Password
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </Form>
            </div>
            <Dialog
                open={openDialogPassword}
                onOpenChange={setOpenDialogPassword}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Ubah Password</DialogTitle>
                        <DialogDescription>
                            Anda Perlu memasukan Password Lama
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="password_lama"
                                className="text-right"
                            >
                                Password Lama
                            </Label>
                            <Input
                                value={formPassword.password_lama}
                                onChange={(e) =>
                                    setFormPassword({
                                        ...formPassword,
                                        password_lama: e.target.value,
                                    })
                                }
                                id="password_lama"
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="password_baru"
                                className="text-right"
                            >
                                Password Baru
                            </Label>
                            <Input
                                value={formPassword.password_baru}
                                onChange={(e) =>
                                    setFormPassword({
                                        ...formPassword,
                                        password_baru: e.target.value,
                                    })
                                }
                                id="password_baru"
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            className="mx-2  hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer "
                            variant={'destructive'}
                            type="button"
                            onClick={() => setOpenDialogPassword(false)}
                        >
                            Tutup
                        </Button>
                        <Button
                            className="mx-2  hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer "
                            type="button"
                            onClick={() => submitUpdatePassword()}
                        >
                            Simpan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Profil
