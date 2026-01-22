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
} from '../../ui/select'
import { StatusPerkawinan } from '@/generated/prisma'
import { Button } from '../../ui/button'
import {
    BookCheck,
    ComputerIcon,
    MessageCircleQuestionIcon,
    PenLineIcon,
} from 'lucide-react'
import { Skeleton } from '../../ui/skeleton'
import {
    DaftarUlangProdiType,
} from '@/types/DaftarUlangProdi'
import {
    getEvaluasiMandiri
} from '@/services/EvaluasiMandiri/EvaluasiMandiriService'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../../ui/table'
import { Alert, AlertDescription, AlertTitle } from '../../ui/alert'
import { useRouter } from 'next/navigation'
import {
    setStatusAsessmenMandiri
} from '@/services/Status/StatusService'
import Link from 'next/link'

const EvaluasiMandiri = ({
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
    const router = useRouter()
    const [selectableMahasiswa, setSelectableMahasiswa] =
        React.useState<string>('')
    const [dataDaftarUlang, setDataDaftarUlang] =
        React.useState<DaftarUlangProdiType | null>(null)
    const [loading, setLoading] = React.useState<boolean>(false)
    const [loadingAwal, setLoadingAwal] = React.useState<boolean>(false)
    const [loadingToEvaluating, setLoadingToEvaluating] =
        React.useState<boolean>(false)

    const DISABLED_STATUSES = [
        'Penunjukan Asesor',
        'Persetujuan Penunjukan Asesor',
        'Penerbitan SK Penugasan Asesor',
        'Asessmen Oleh Asesor',
        'Rekapitulasi Asessmen',
        'Sanggahan',
        'Hasil Final Asessmen',
        'Persetujuan Hasil Final',
        'Penerbitan SK Asessmen',
        'Sinkronisasi Hasil Asessmen',
        'Selesai',
    ]

    const isFormDisabled = dataDaftarUlang ? DISABLED_STATUSES.includes(dataDaftarUlang.Status) : false

    const startEvaluating = () => {
        if (dataDaftarUlang) {
            if (dataDaftarUlang.Status === 'Asessmen Mandiri') {
                router.push('/mata-kuliah/evaluasi-mandiri/' + selectableMahasiswa)
            } else {
                setLoadingToEvaluating(true)
                if (isFormDisabled) {
                    router.push('/mata-kuliah/evaluasi-mandiri/' + selectableMahasiswa)
                } else {
                    setStatusAsessmenMandiri(dataDaftarUlang.PendaftaranId)
                        .then((res) => {
                            router.push('/mata-kuliah/evaluasi-mandiri/' + selectableMahasiswa)
                        })
                        .finally(() => {
                            setLoadingToEvaluating(false)
                        })
                }
            }
        }
    }

    React.useEffect(() => {
        setLoadingAwal(true)
        getEvaluasiMandiri(selectableMahasiswa)
            .then(async (res) => {
                await setDataDaftarUlang(res)
                setLoadingAwal(false)
            })
            .catch((res) => {
                setLoadingAwal(false)
            })
    }, [selectableMahasiswa])

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <h1 className="text-2xl">Evaluasi Mandiri</h1>
                </CardTitle>
                <CardDescription>
                    Evaluasi Mandiri diperlukan untuk memudahkan asessmen
                    menilai berdasarkan evaluasi mandiri
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
                <div>
                    {!selectableMahasiswa ? (
                        <></>
                    ) : loadingAwal || loading || dataDaftarUlang === null ? (
                        <Skeleton className="w-full h-32" />
                    ) : (
                        <>
                            <Table className="my-8">
                                <TableCaption>
                                    Informasi Program Studi
                                </TableCaption>
                                <TableBody>
                                    <TableRow>
                                        <TableHead>
                                            Nama Program Studi
                                        </TableHead>
                                        <TableCell>
                                            {dataDaftarUlang?.Nama}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>NIM</TableHead>
                                        <TableCell>
                                            {dataDaftarUlang?.Nim}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>Akreditasi</TableHead>
                                        <TableCell>
                                            {dataDaftarUlang?.Akreditasi}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>Jenjang</TableHead>
                                        <TableCell>
                                            {dataDaftarUlang?.Jenjang}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>
                                            Jenjang KKNI Dituju
                                        </TableHead>
                                        <TableCell>
                                            {dataDaftarUlang?.JenjangKkniDituju}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <h3 className="my-4">Berikut adalah Mata kuliah yang dipilih berdasarkan Perolehan SKS.</h3>
                            <Table className="my-8">
                                <TableCaption>
                                    Informasi Mata Kuliah Perolehan SKS
                                </TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            Nama Mata Kuliah
                                        </TableHead>
                                        <TableHead>
                                            SKS
                                        </TableHead>
                                        <TableHead>
                                            Capaian Pembelajaran
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        dataDaftarUlang?.MataKuliahMahasiswa.filter(mkm => mkm.Keterangan === 'Perolehan_SKS').map(mkdtemp => (
                                            <TableRow key={mkdtemp.MataKuliahMahasiswaId}>
                                                <TableHead>
                                                    {mkdtemp.MataKuliah.Nama}
                                                </TableHead>
                                                <TableCell>
                                                    {
                                                        dataDaftarUlang.MataKuliah.find(x => x.MataKuliahId === mkdtemp.MataKuliahId)?.Sks ?? 0
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        dataDaftarUlang.MataKuliah.find(x => x.MataKuliahId === mkdtemp.MataKuliahId)?.Cp ?? 0
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                            {dataDaftarUlang?.PilihMataKuliah !== 0 &&
                                (dataDaftarUlang.Status == 'Asessmen Mandiri' ||
                                    dataDaftarUlang.Status ==
                                    'Pengisian Data Diri') ? (
                                <Alert className="mb-3">
                                    <BookCheck className="h-4 w-4" />
                                    <AlertTitle>Evaluasi Mandiri</AlertTitle>
                                    <AlertDescription>
                                        Terdapat{' '}
                                        {
                                            dataDaftarUlang?.EvaluasiDiriMataKuliah
                                        }{' '}
                                        dari {dataDaftarUlang?.PilihMataKuliah}{' '}
                                        Pertanyaan Terselesaikan. Segera
                                        Selesaikan agar dapat di assessmen oleh
                                        asessor.
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <></>
                            )}
                            {dataDaftarUlang.EvaluasiDiriMataKuliah ===
                                dataDaftarUlang.PilihMataKuliah &&
                                dataDaftarUlang.EvaluasiDiriMataKuliah !==
                                0 && (
                                    <Alert className='mb-5'>
                                        <MessageCircleQuestionIcon className="h-4 w-4" />
                                        <AlertTitle>Sudah Selesai Evaluasi Mandiri</AlertTitle>
                                        <AlertDescription>
                                            Silakan Menuju ke halaman <Link href='/mata-kuliah/finalisasi'>finalisasi</Link> untuk melanjutkan ke status berikutnya
                                        </AlertDescription>
                                    </Alert>
                                )}
                            <Alert>
                                <ComputerIcon className="h-4 w-4" />
                                <AlertTitle>Pemberitahuan</AlertTitle>
                                <AlertDescription>
                                    {dataDaftarUlang.Status ==
                                        'Asessmen Mandiri' ||
                                        dataDaftarUlang.Status ==
                                        'Pengisian Data Diri'
                                        ? 'Sebelum memulai Evaluasi Mandiri. Gunakan Laptop atau Komputer untuk Pengalaman terbaik. Min: 1270x720'
                                        : dataDaftarUlang.Status ===
                                            'Penerbitan SK Asessmen'
                                            ? 'SK anda sudah terbit, silakan ke menu Sk. Rektor'
                                            : dataDaftarUlang.Status ===
                                                'Hasil Final Asessmen'
                                                ? 'Hasil Asessmen anda sudah selesai. Silakan ke menu Hasil Asessmen'
                                                : dataDaftarUlang.Status === 'Sanggahan'
                                                    ? 'Silakan ke menu sanggahan untuk melihat hasil anda dan silakan melanjutkan atau menyanggah'
                                                    : dataDaftarUlang.Status ===
                                                        'Rekapitulasi Asessmen'
                                                        ? 'Hasil Asessmen oleh Asesor sedang di Rekapitulasi. Silakan Menunggu'
                                                        : dataDaftarUlang.Status ===
                                                            'Asessmen Oleh Asesor'
                                                            ? 'Evaluasi anda sedang di Asessmen oleh Asesor'
                                                            : 'Asesor Sedang dipilih untuk menilai Mata Kuliah RPL Anda'}
                                </AlertDescription>
                            </Alert>
                            {/* {(dataDaftarUlang.Status === 'Asessmen Mandiri' ||
                                dataDaftarUlang.Status ==
                                'Pengisian Data Diri') && ( */}
                            <div className="flex flex-row items-center">
                                {(dataDaftarUlang?.PilihMataKuliah ?? 0) >
                                    0 && (
                                        <Button
                                            className="mt-5 mr-2 hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer "
                                            type="button"
                                            disabled={loadingToEvaluating}
                                            onClick={() => {
                                                startEvaluating()
                                            }}
                                        >
                                            {
                                                isFormDisabled ? "Reviewed" : dataDaftarUlang?.EvaluasiDiriMataKuliah == dataDaftarUlang?.PilihMataKuliah ? "Pengisian Lengkap" : dataDaftarUlang?.EvaluasiDiriMataKuliah > 0 ? 'Lanjutkan Pengisian' : 'Mulai Evaluasi'
                                            }
                                            <PenLineIcon />
                                        </Button>
                                    )}
                            </div>
                            {/* )} */}
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default EvaluasiMandiri