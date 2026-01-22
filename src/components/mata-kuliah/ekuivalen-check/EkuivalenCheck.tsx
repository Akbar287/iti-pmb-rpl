'use client'
import { StatusPerkawinan } from '@/generated/prisma'
import { getEkuivalenCheckForMahasiswa } from '@/services/EkuivalenCheck/EkuivalenCheckServices'
import { EkuivalenCheckType } from '@/types/EkuivalenCheck'
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
} from '@/components/ui/select'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { BookOpenIcon, FileTextIcon, FileWarning, MessageCircleQuestionIcon } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function EkuivalenCheck({
    dataMahasiswa
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
}) {
    const [loading, setLoading] = React.useState(false)
    const [selectableMahasiswa, setSelectableMahasiswa] = React.useState<string>('')
    const [mataKuliahMahasiswa, setMataKuliahMahasiswa] = React.useState<EkuivalenCheckType['MataKuliahMahasiswa']>([])
    const [transkripNilai, setTranskripNilai] = React.useState<EkuivalenCheckType['TranskripNilai']>([])

    React.useEffect(() => {
        if (!selectableMahasiswa) return

        const fetchData = async () => {
            setLoading(true)
            try {
                const response = await getEkuivalenCheckForMahasiswa(selectableMahasiswa)
                setMataKuliahMahasiswa(response.MataKuliahMahasiswa)
                setTranskripNilai(response.TranskripNilai)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [selectableMahasiswa])

    const getStatusBadge = (status: string | null) => {
        switch (status) {
            case 'DRAFT':
                return <Badge className="bg-gray-500">DRAFT</Badge>
            case 'EVALUASI_MANDIRI':
                return <Badge className="bg-blue-500">EVALUASI_MANDIRI</Badge>
            case 'DALAM_ASESSMEN':
                return <Badge className="bg-purple-500">DALAM_ASESSMEN</Badge>
            case 'DISANGGAH':
                return <Badge className="bg-yellow-500">DISANGGAH</Badge>
            case 'PERLU_DIREVISI':
                return <Badge className="bg-red-500">PERLU_DIREVISI</Badge>
            case 'SELESAI':
                return <Badge className="bg-green-500">SELESAI</Badge>
            default:
                return <Badge className="bg-gray-500">-</Badge>
        }
    }

    const getKeteranganBadge = (keterangan: string | null) => {
        switch (keterangan) {
            case 'Perolehan_SKS':
                return <Badge className="bg-blue-500">Perolehan SKS</Badge>
            case 'Transfer_SKS':
                return <Badge className="bg-purple-500">Transfer SKS</Badge>
            default:
                return <Badge className="bg-gray-500">-</Badge>
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <h1 className="text-2xl">Ekuivalen Check</h1>
                </CardTitle>
                <CardDescription>
                    Pengecekan ekuivalensi mata kuliah yang dipilih mahasiswa dengan transkrip nilai
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Selector NoUjian */}
                <div className="my-2 w-full">
                    <h2 className="mb-2 font-medium">Silakan Pilih Nomor Ujian</h2>
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
                                        {m.Pendaftaran[0].NoUjian} - {m.Pendaftaran[0].Periode}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Content Area */}
                <div className="mt-6">
                    {!selectableMahasiswa ? (
                        <div className="text-center py-8 text-gray-500">
                            <p>Silakan pilih nomor ujian terlebih dahulu untuk melihat data.</p>
                        </div>
                    ) : loading ? (
                        <div className="space-y-4">
                            <Skeleton className="w-full h-32" />
                            <Skeleton className="w-full h-32" />
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Tabel Mata Kuliah Mahasiswa */}
                            <div>
                                <Alert className='mb-5'>
                                    <FileWarning className="h-4 w-4" />
                                    <AlertTitle>Perhatian!</AlertTitle>
                                    <AlertDescription>
                                        Mata kuliah yang di TRANSFER SKS akan muncul dibawah ini beserta transkrip nilai yang anda upload ke sistem. Pencocokan Mata kuliah PT asal dengan Mata kuliah yang dipilih akan di nilai oleh Penilai (Asesor).
                                    </AlertDescription>
                                </Alert>
                                <div className="flex items-center gap-2 mb-4">
                                    <BookOpenIcon className="h-5 w-5 text-primary" />
                                    <h3 className="text-lg font-semibold">Mata Kuliah yang Dipilih Mahasiswa</h3>
                                </div>
                                {mataKuliahMahasiswa.length === 0 ? (
                                    <div className="text-center py-4 text-gray-500 border rounded-md">
                                        <p>Belum ada mata kuliah yang dipilih.</p>
                                    </div>
                                ) : (
                                    <Table>
                                        <TableCaption>
                                            Daftar mata kuliah yang dipilih untuk RPL
                                        </TableCaption>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-12">No</TableHead>
                                                <TableHead>Nama Mata Kuliah</TableHead>
                                                <TableHead>Program Studi</TableHead>
                                                <TableHead className="text-center">SKS</TableHead>
                                                <TableHead className="text-center">Semester</TableHead>
                                                <TableHead className="text-center">RPL</TableHead>
                                                <TableHead className="text-center">Status</TableHead>
                                                <TableHead className="text-center">Keterangan</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {mataKuliahMahasiswa.map((item, index) => (
                                                <TableRow key={item.MataKuliahMahasiswaId}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell className="font-medium">
                                                        {item.MataKuliah.Nama}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.MataKuliah.NamaProgramStudi}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {item.MataKuliah.Sks}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {item.MataKuliah.Semester ?? '-'}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {item.Rpl ? (
                                                            <Badge className="bg-green-500">Ya</Badge>
                                                        ) : (
                                                            <Badge className="bg-gray-400">Tidak</Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {getStatusBadge(item.StatusMataKuliahMahasiswa)}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {getKeteranganBadge(item.Keterangan)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </div>

                            {/* Tabel Transkrip Nilai */}
                            <div>
                                <Alert className='mb-5'>
                                    <MessageCircleQuestionIcon className="h-4 w-4" />
                                    <AlertTitle>Pertanyaan!</AlertTitle>
                                    <AlertDescription>
                                        Jika ada mata kuliah yang belum terdeteksi di transkrip nilai, Silakan unggah ulang dokumen transkrip nilai anda di menu Upload Dokumen. Jika memang tidak bisa juga, jangan khawatir, penilai akan mengecek file transkrip nilai anda.
                                    </AlertDescription>
                                </Alert>
                                <div className="flex items-center gap-2 mb-4">
                                    <FileTextIcon className="h-5 w-5 text-primary" />
                                    <h3 className="text-lg font-semibold">Transkrip Nilai PT Asal</h3>
                                </div>
                                {transkripNilai.length === 0 ? (
                                    <div className="text-center py-4 text-gray-500 border rounded-md">
                                        <p>Belum ada data transkrip nilai.</p>
                                    </div>
                                ) : (
                                    <Table>
                                        <TableCaption>
                                            Daftar transkrip nilai dari dokumen yang diunggah
                                        </TableCaption>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-12">No</TableHead>
                                                <TableHead>Kode Mata Kuliah</TableHead>
                                                <TableHead>Nama Mata Kuliah</TableHead>
                                                <TableHead className="text-center">SKS</TableHead>
                                                <TableHead className="text-center">Nilai</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {transkripNilai.map((item, index) => (
                                                <TableRow key={item.TranskripNilaiId}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell className="font-mono">
                                                        {item.KodeMataKuliah}
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {item.NamaMataKuliah}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {item.Sks}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge className={
                                                            item.Nilai === 'A' ? 'bg-green-500' :
                                                                item.Nilai === 'B' ? 'bg-blue-500' :
                                                                    item.Nilai === 'C' ? 'bg-yellow-500' :
                                                                        item.Nilai === 'D' ? 'bg-orange-500' :
                                                                            'bg-red-500'
                                                        }>
                                                            {item.Nilai}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
