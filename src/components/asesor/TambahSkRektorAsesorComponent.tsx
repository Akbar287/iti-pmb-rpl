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
    TableRow,
} from '../ui/table'
import {
    SkRektorSkemaValidasi,
    SkRektorSkemaValidasiTipe,
} from '@/validation/SkRektorAsesorValidation'
import {
    getFileBlobByNamafile,
    setSkRektorAsesor,
} from '@/services/Asesor/SkRektor'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { PenIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { setStatusAsessmenOlehAsesor } from '@/services/Status/StatusService'

const TambahSkRektorAsesorComponent = ({ status, dataServer }: {
    status: { NamaStatus: string; Urutan: number; Aktif: boolean }[]
    dataServer: {
        PendaftaranId: string;
        NamaProgramStudi: string;
        NamaMahasiswa: string
        NamaAsesorPertama: string;
        NamaAsesorKedua: string;
        NamaFile: string;
        NamaDokumen: string;
        SkRektorId: string;
        NamaSk: string;
        TahunSk: string;
        NomorSk: string;
        Catatan: string
    }
}) => {

    const [loading, setLoading] = React.useState<boolean>(false)
    const form = useForm<SkRektorSkemaValidasiTipe>({
        resolver: zodResolver(SkRektorSkemaValidasi),
        defaultValues: {
            data: undefined,
            NamaSk: dataServer.NamaSk,
            TahunSk: dataServer.TahunSk,
            NomorSk: dataServer.NomorSk,
        },
    })
    const [pdfPreview, setPdfPreview] = React.useState<string | null>(null)

    const onSubmit = async (data: SkRektorSkemaValidasiTipe) => {
        setLoading(true)

        if (data.data) {
            await setSkRektorAsesor(
                data.data,
                data.NamaSk,
                data.TahunSk,
                data.NomorSk,
                dataServer?.PendaftaranId ?? ''
            )
                .then(async (res) => {
                    toast('Data SK Asesor Mahasiswa berhasil disimpan')
                    let r = status.find(x => x.NamaStatus == 'Penerbitan SK Penugasan Asesor')
                    if (r) {
                        if (r.Aktif) {
                            console.log('Hai')
                            await setStatusAsessmenOlehAsesor(dataServer?.PendaftaranId ?? '')
                        }
                    }
                })
                .catch((err) => {
                    toast('Data SK Asesor Mahasiswa gagal disimpan. Error: ' + err)
                }).finally(() => {
                    setLoading(false)
                })
        }
    }

    React.useEffect(() => {
        if (dataServer) getFileBlobByNamafile(dataServer.NamaFile).then(res => {
            setPdfPreview(res)
        }).catch(err => { })
    }, [])

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

            <div className="grid grid-cols-1 mt-5">
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Asesor</CardTitle>
                        <CardDescription>Informasi mengenai Mahasiswa dan Asesor</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableHead>Nama Mahasiswa</TableHead>
                                    <TableCell>{dataServer.NamaMahasiswa ?? ''}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Program Studi</TableHead>
                                    <TableCell>{dataServer.NamaProgramStudi ?? ''}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Nama Asesor Pertama</TableHead>
                                    <TableCell>{dataServer.NamaAsesorPertama}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Nama Asesor Kedua</TableHead>
                                    <TableCell>{dataServer.NamaAsesorKedua}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <div className="grid grid-cols-1 mt-5">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Form Upload SK</CardTitle>
                                <CardDescription>Informasi mengenai Mahasiswa dan Asesor</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-5'>
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
                                <div className="flex justify-center w-full mt-5">
                                    <Button
                                        disabled={loading}
                                        type="submit"
                                        className="hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer w-2/3 md:w-1/2"
                                    >
                                        <PenIcon /> Simpan
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
