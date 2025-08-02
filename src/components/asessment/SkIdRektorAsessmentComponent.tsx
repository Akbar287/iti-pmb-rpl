'use client'
import React from 'react'
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../ui/card'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableRow,
} from '../ui/table'
import { Badge } from '../ui/badge'
import { ResponseFinalAsessmenAsesorDetailType } from '@/types/FinalAsessmen'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    SkRektorAsessmenSkemaValidasi,
    SkRektorAsessmenSkemaValidasiTipe,
} from '@/validation/SkAsessmenValidation'
import {
    getFileSkAsessmenBlobByNamafile,
    setFile,
} from '@/services/Asessment/SkRektorAsessmenService'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { PenIcon } from 'lucide-react'
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
import { setStatusPenerbitanSKAsessmen } from '@/services/Status/StatusService'
import { formatDateToIndonesian } from '@/lib/utils'

const SkIdRektorAsessmentComponent = ({
    dataServer,
    fileSkRektor,
}: {
    dataServer: ResponseFinalAsessmenAsesorDetailType
    fileSkRektor: {
        SkRektor: {
            CreatedAt: Date | null
            UpdatedAt: Date | null
            SkRektorId: string
            TipeSkRektorId: string
            NamaSk: string
            TahunSk: number
            NomorSk: string
            NamaFile: string
            NamaDokumen: string
        }
    } | null
}) => {
    const [role, setRole] = React.useState<{
        GuardName: string
        Icon: string
        Name: string
        RoleId: string
    } | null>(null)
    const [loading, setLoading] = React.useState<boolean>(false)
    const form = useForm<SkRektorAsessmenSkemaValidasiTipe>({
        resolver: zodResolver(SkRektorAsessmenSkemaValidasi),
        defaultValues: {
            data: new File([], ''),
            NamaSk: '',
            TahunSk: '',
            NomorSk: '',
        },
    })
    const [pdfPreview, setPdfPreview] = React.useState<string | null>(null)
    React.useEffect(() => {
        if (!role) {
            const rolelogin = localStorage.getItem('pmb.iti.role')
            if (rolelogin) {
                let temp = JSON.parse(rolelogin)
                setRole(temp)
            }
        }
        if (fileSkRektor) {
            getFileSkAsessmenBlobByNamafile(fileSkRektor.SkRektor.NamaFile)
                .then((res) => {
                    setPdfPreview(res)
                    form.setValue('NamaSk', fileSkRektor.SkRektor.NamaSk)
                    form.setValue(
                        'TahunSk',
                        String(fileSkRektor.SkRektor.TahunSk)
                    )
                    form.setValue('NomorSk', fileSkRektor.SkRektor.NomorSk)
                })
                .catch((err) => {})
        }
    }, [])
    const onSubmit = async (data: SkRektorAsessmenSkemaValidasiTipe) => {
        setLoading(true)

        await setFile(
            data.data,
            dataServer.PendaftaranId,
            data.NamaSk,
            data.TahunSk,
            data.NomorSk
        )
            .then((res) => {
                setStatusPenerbitanSKAsessmen(dataServer.PendaftaranId).then(
                    (res) => {
                        toast('Data SK Asesor Mahasiswa berhasil disimpan')
                        setLoading(false)
                    }
                )
                setLoading(false)
            })
            .catch((err) => {
                toast('Data SK Asesor Mahasiswa gagal disimpan. Error: ' + err)
                setLoading(false)
            })
    }

    return (
        <div className="grid grid-cols-1 gap-3">
            <div className="">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Informasi Pendaftaran Mahasiswa</CardTitle>
                        <CardDescription>
                            Informasi Umum mengenai Jalur Masuk Pendaftaran
                            Mahasiswa
                        </CardDescription>
                        <CardAction></CardAction>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-3">
                            <Table>
                                <TableCaption>Informasi Profil</TableCaption>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Nama</TableCell>
                                        <TableCell>{dataServer.Nama}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Tempat Lahir</TableCell>
                                        <TableCell>
                                            {dataServer.TempatLahir}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Tanggal Lahir</TableCell>
                                        <TableCell>
                                            {dataServer.TanggalLahir
                                                ? formatDateToIndonesian(
                                                      dataServer.TanggalLahir.toString()
                                                  )
                                                : '-'}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Email</TableCell>
                                        <TableCell>
                                            {dataServer.Email}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Agama</TableCell>
                                        <TableCell>
                                            {dataServer.Agama}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Nomor HP</TableCell>
                                        <TableCell>
                                            {dataServer.NomorHp}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <Table>
                                <TableCaption>Asesor</TableCaption>
                                <TableBody>
                                    {dataServer.AssesorMahasiswa.map((am) => (
                                        <React.Fragment key={am.Urutan}>
                                            <TableRow>
                                                <TableCell>
                                                    Nama Asesor {am.Urutan}
                                                </TableCell>
                                                <TableCell>{am.Nama}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Urutan</TableCell>
                                                <TableCell>
                                                    {am.Urutan}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    Konfirmasi
                                                </TableCell>
                                                <TableCell>
                                                    {am.Confirmation ? (
                                                        <Badge
                                                            variant={'default'}
                                                        >
                                                            Ya
                                                        </Badge>
                                                    ) : (
                                                        <Badge
                                                            variant={'default'}
                                                        >
                                                            Tidak
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        </React.Fragment>
                                    ))}
                                </TableBody>
                            </Table>
                            <Table>
                                <TableCaption>Jalur Masuk</TableCaption>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Jalur Masuk</TableCell>
                                        <TableCell>
                                            {dataServer.JalurPendaftaran}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Kode Pendaftaran</TableCell>
                                        <TableCell>
                                            {dataServer.KodePendaftar}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>No. Ujian</TableCell>
                                        <TableCell>
                                            {dataServer.NoUjian}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>NIM</TableCell>
                                        <TableCell>{dataServer.Nim}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Gelombang</TableCell>
                                        <TableCell>
                                            {dataServer.Gelombang}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <Table>
                                <TableCaption>
                                    Informasi Program Studi
                                </TableCaption>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            Nama Program Studi
                                        </TableCell>
                                        <TableCell>
                                            {dataServer.ProgramStudi.Nama}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Jenjang</TableCell>
                                        <TableCell>
                                            {dataServer.ProgramStudi.Jenjang}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Akreditasi</TableCell>
                                        <TableCell>
                                            {dataServer.ProgramStudi.Akreditasi}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Sistem Kuliah</TableCell>
                                        <TableCell>
                                            {dataServer.SistemKuliah}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Periode</TableCell>
                                        <TableCell>
                                            {dataServer.Periode}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
            {pdfPreview && (
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Dokumen SK</CardTitle>
                            <CardDescription>
                                Dokumen Surat Keputusan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-2 mb-3">
                                <iframe
                                    src={pdfPreview || ''}
                                    title="PDF Preview"
                                    width="100%"
                                    height="500px"
                                    className="border rounded"
                                ></iframe>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
            {role?.Name.match('Akademik') && (
                <div>
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Surat Keputusan</CardTitle>
                            <CardDescription>
                                Surat Keputusan Asessmen Mahasiswa
                            </CardDescription>
                            <CardAction></CardAction>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-1 md:gap-3">
                                        <FormField
                                            control={form.control}
                                            name="TahunSk"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Tahun SK
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            readOnly={loading}
                                                            {...field}
                                                        />
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
                                                    <FormLabel>
                                                        Nama SK
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            readOnly={loading}
                                                            {...field}
                                                        />
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
                                                    <FormLabel>
                                                        Nomor SK
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            readOnly={loading}
                                                            {...field}
                                                        />
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
                                                    <FormLabel>
                                                        Unggah SK Disini
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="file"
                                                            accept="application/pdf"
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
                                                        Upload SK (PDF)
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="flex justify-center w-full my-5">
                                        <Button
                                            type="submit"
                                            className="hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer w-2/3 md:w-1/2"
                                        >
                                            <PenIcon /> Simpan
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}

export default SkIdRektorAsessmentComponent
