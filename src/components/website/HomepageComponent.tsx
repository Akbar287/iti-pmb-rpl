'use client'

import { University } from '@/generated/prisma'
import {
    getHomepageId,
    updateHomepage,
} from '@/services/Website/HomepageService'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
    Card,
    CardContent,
    CardDescription,
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
import { Skeleton } from '../ui/skeleton'
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
import {
    SettingMainPageFormValidation,
    SettingMainPageSkemaValidasi,
} from '../../validation/WebsiteFormValidation'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { PenIcon } from 'lucide-react'

const HomepageComponent = ({ university }: { university: University[] }) => {
    const [selectable, setSelectable] = React.useState<University | null>(null)
    const [loadingSubmit, setLoadingSubmit] = React.useState(false)
    const [loading, setLoading] = React.useState<boolean>(false)

    async function urlToFile(url: string, filename = 'existing-image') {
        const res = await fetch(url, { cache: 'no-store' })
        const blob = await res.blob()
        const ext = blob.type.split('/')[1] || 'png'
        return new File([blob], `${filename}.${ext}`, { type: blob.type })
    }

    React.useEffect(() => {
        if (selectable) {
            setLoading(true)
            getHomepageId(selectable.UniversityId)
                .then(async (res) => {
                    urlToFile(
                        process.env.NEXT_PUBLIC_API_BASE_URL +
                            '/api/img?_t=_m&_id=' +
                            res.SettingMainPageId,
                        'main-bg'
                    )
                        .then((bg) => form.setValue('BackgroundFileUtama', bg))
                        .catch((err) =>
                            toast('Tidak bisa ambil Gambar Background')
                        )
                    urlToFile(
                        process.env.NEXT_PUBLIC_API_BASE_URL +
                            '/api/img?_t=_s&_id=' +
                            res.SettingMainPageId,
                        'selayang-bg'
                    )
                        .then((bg) =>
                            form.setValue('SelayangPandangBackgroundFile', bg)
                        )
                        .catch((err) =>
                            toast('Tidak bisa ambil Gambar Selayang')
                        )
                    form.setValue('SettingMainPageId', res.SettingMainPageId)
                    form.setValue('TextMainPage1', res.TextMainPage1)
                    form.setValue('TextMainPage2', res.TextMainPage2)
                    form.setValue('TextMainPage3', res.TextMainPage3)
                    form.setValue(
                        'SelayangPandangText',
                        res.SelayangPandangText
                    )
                    form.setValue(
                        'SelayangPandangDeskripsi',
                        res.SelayangPandangDeskripsi
                    )
                    form.setValue('WhyText', res.WhyText)
                    form.setValue('WhyDeskripsi', res.WhyDeskripsi)
                    form.setValue('CommunityText', res.CommunityText)
                    form.setValue('CommunityDeskripsi', res.CommunityDeskripsi)
                    form.setValue('KegiatanText', res.KegiatanText)
                    form.setValue('KegiatanDeskripsi', res.KegiatanDeskripsi)
                    form.setValue('BeritaText', res.BeritaText)
                    form.setValue('BeritaDeskripsi', res.BeritaDeskripsi)
                    form.setValue('TestomoniText', res.TestomoniText)
                    form.setValue('TestomoniDeskripsi', res.TestomoniDeskripsi)
                    setLoading(false)
                })
                .catch((err) => {
                    toast('Kendala mendapatkan informasi')
                    setLoading(false)
                })
        }
    }, [selectable])

    const form = useForm<SettingMainPageFormValidation>({
        resolver: zodResolver(SettingMainPageSkemaValidasi),
        defaultValues: {
            BackgroundFileUtama: null,
            SelayangPandangBackgroundFile: null,
            UniversityId: '',
            SettingMainPageId: '',
            TextMainPage1: '',
            TextMainPage2: '',
            TextMainPage3: '',
            SelayangPandangText: '',
            SelayangPandangDeskripsi: '',
            WhyText: '',
            WhyDeskripsi: '',
            CommunityText: '',
            CommunityDeskripsi: '',
            KegiatanText: '',
            KegiatanDeskripsi: '',
            BeritaText: '',
            BeritaDeskripsi: '',
            TestomoniText: '',
            TestomoniDeskripsi: '',
        },
    })

    const onSubmit = async (data: SettingMainPageFormValidation) => {
        if (data.BackgroundFileUtama && data.SelayangPandangBackgroundFile) {
            setLoadingSubmit(true)
            await updateHomepage(
                data.BackgroundFileUtama,
                data.SelayangPandangBackgroundFile,
                data
            )
                .then((res) => {
                    toast('Data Sudah disimpan')
                    setLoadingSubmit(false)
                })
                .catch((err) => {
                    toast('Error: ' + err)
                    setLoadingSubmit(false)
                })
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <h1 className="text-2xl">Pilih Universitas</h1>
                </CardTitle>
                <CardDescription>
                    Silakan anda pilih universitas
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="w-full my-2">
                    <Select
                        value={selectable?.UniversityId}
                        disabled={loading || loadingSubmit}
                        onValueChange={(e) => {
                            let temp = university.find(
                                (x) => x.UniversityId === e
                            )
                            if (temp) {
                                setSelectable(temp)
                                form.setValue('UniversityId', e)
                            }
                        }}
                    >
                        <SelectTrigger className="w-1/2">
                            <SelectValue placeholder="Pilih Universitas" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Pilih Universitas</SelectLabel>
                                {university.map((m) => (
                                    <SelectItem
                                        key={m.UniversityId}
                                        value={m.UniversityId}
                                    >
                                        {m.Nama}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {selectable && loading ? (
                    <Skeleton />
                ) : selectable && form ? (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="flex flex-col mt-5">
                                <div className="container mx-auto">
                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="TextMainPage1"
                                            disabled={loading || loadingSubmit}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nama</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            readOnly={loading}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Teks Pertama di Halaman
                                                        Utama
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="TextMainPage2"
                                            disabled={loading || loadingSubmit}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Teks Kedua
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            readOnly={loading}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Teks Kedua di Halaman
                                                        Utama
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            disabled={loading || loadingSubmit}
                                            name="TextMainPage3"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Teks Ketiga
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            readOnly={loading}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Teks Ketiga di Halaman
                                                        Utama
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            disabled={loading || loadingSubmit}
                                            name="SelayangPandangText"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Teks Selayang Pandang
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            readOnly={loading}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Teks Selayang Pandang di
                                                        Halaman Utama
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="SelayangPandangDeskripsi"
                                            disabled={loading || loadingSubmit}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Selayang Pandang
                                                        Deskripsi
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            disabled={loading}
                                                            {...field}
                                                            placeholder="Selayang Pandang Deskripsi."
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Selayang Pandang
                                                        Deskripsi
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            disabled={loading || loadingSubmit}
                                            name="WhyText"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Teks Kelebihan
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            readOnly={loading}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Teks Kelebihan di
                                                        Halaman Utama
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            disabled={loading || loadingSubmit}
                                            name="WhyDeskripsi"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Kelebihan Deskripsi
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            disabled={loading}
                                                            {...field}
                                                            placeholder="Kelebihan Deskripsi."
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Kelebihan Deskripsi
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            disabled={loading || loadingSubmit}
                                            name="CommunityText"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Teks Komunitas
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            readOnly={loading}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Teks Komunitas di
                                                        Halaman Utama
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            disabled={loading || loadingSubmit}
                                            name="CommunityDeskripsi"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Komunitas Deskripsi
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            disabled={loading}
                                                            {...field}
                                                            placeholder="Komunitas Deskripsi."
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Komunitas Deskripsi
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                        <FormField
                                            disabled={loading || loadingSubmit}
                                            control={form.control}
                                            name="KegiatanText"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Teks Kegiatan
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            readOnly={loading}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Teks Kegiatan di Halaman
                                                        Utama
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="KegiatanDeskripsi"
                                            disabled={loading || loadingSubmit}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Kegiatan Deskripsi
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            disabled={loading}
                                                            {...field}
                                                            placeholder="Kegiatan Deskripsi."
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Kegiatan Deskripsi
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            disabled={loading || loadingSubmit}
                                            name="BeritaText"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Teks Berita
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            readOnly={loading}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Teks Berita di Halaman
                                                        Utama
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            disabled={loading || loadingSubmit}
                                            name="BeritaDeskripsi"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Berita Deskripsi
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            disabled={loading}
                                                            {...field}
                                                            placeholder="Berita Deskripsi."
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Berita Deskripsi
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mt-5">
                                        <FormField
                                            control={form.control}
                                            name="BackgroundFileUtama"
                                            disabled={loading || loadingSubmit}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Background File Utama
                                                    </FormLabel>
                                                    <FormControl>
                                                        <div className="grid w-full max-w-sm items-center gap-3">
                                                            <Input
                                                                id="picture"
                                                                disabled={
                                                                    loading ||
                                                                    loadingSubmit
                                                                }
                                                                type="file"
                                                                onChange={(e) =>
                                                                    field.onChange(
                                                                        e.target
                                                                            .files?.[0]
                                                                    )
                                                                }
                                                            />
                                                            {form.watch(
                                                                'BackgroundFileUtama'
                                                            ) &&
                                                                form.watch(
                                                                    'BackgroundFileUtama'
                                                                ) instanceof
                                                                    File && (
                                                                    <img
                                                                        src={URL.createObjectURL(
                                                                            form.watch(
                                                                                'BackgroundFileUtama'
                                                                            ) as File
                                                                        )}
                                                                        alt="Preview"
                                                                        className="mt-2 rounded-md border"
                                                                        style={{
                                                                            maxWidth: 200,
                                                                        }}
                                                                    />
                                                                )}
                                                        </div>
                                                    </FormControl>
                                                    <FormDescription>
                                                        Background File Utama
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            disabled={loading || loadingSubmit}
                                            name="SelayangPandangBackgroundFile"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Selayang Pandang
                                                        Background File
                                                    </FormLabel>
                                                    <FormControl>
                                                        <div className="grid w-full max-w-sm items-center gap-3">
                                                            <Input
                                                                id="picture"
                                                                type="file"
                                                                disabled={
                                                                    loading ||
                                                                    loadingSubmit
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    field.onChange(
                                                                        e.target
                                                                            .files?.[0]
                                                                    )
                                                                }}
                                                            />
                                                            {form.watch(
                                                                'SelayangPandangBackgroundFile'
                                                            ) &&
                                                                form.watch(
                                                                    'SelayangPandangBackgroundFile'
                                                                ) instanceof
                                                                    File && (
                                                                    <img
                                                                        src={URL.createObjectURL(
                                                                            form.watch(
                                                                                'SelayangPandangBackgroundFile'
                                                                            ) as File
                                                                        )}
                                                                        alt="Preview"
                                                                        className="mt-2 rounded-md border"
                                                                        style={{
                                                                            maxWidth: 200,
                                                                        }}
                                                                    />
                                                                )}
                                                        </div>
                                                    </FormControl>
                                                    <FormDescription>
                                                        SelayangPandangBackgroundFile
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="mt-8 text-center flex justify-center">
                                        <Button
                                            className="mx-2 w-52 transition-all duration-100 cursor-pointer hover:scale-110 active:scale-90"
                                            variant={'default'}
                                            type="submit"
                                            disabled={loading || loadingSubmit}
                                        >
                                            <PenIcon />
                                            Simpan
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Form>
                ) : (
                    <></>
                )}
            </CardContent>
        </Card>
    )
}

export default HomepageComponent
