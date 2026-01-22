'use client'
import { Button } from '@/components/ui/button'
import { StatusPerkawinan } from '@/generated/prisma'
import { getEvaluasiMandiri } from '@/services/EvaluasiMandiri/EvaluasiMandiriService'
import { setStatusPenunjukanAsesor } from '@/services/Status/StatusService'
import { DaftarUlangProdiType } from '@/types/DaftarUlangProdi'
import { ArrowRightIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import Swal from 'sweetalert2'
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
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle2Icon, InfoIcon } from 'lucide-react'
import Link from 'next/link'

export default function FinalisasiMataKuliah({
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
    const [selectableMahasiswa, setSelectableMahasiswa] =
        React.useState<string>('')
    const [dataDaftarUlang, setDataDaftarUlang] =
        React.useState<DaftarUlangProdiType | null>(null)
    const [loading, setLoading] = React.useState<boolean>(false)
    const [loadingAwal, setLoadingAwal] = React.useState<boolean>(false)

    React.useEffect(() => {
        if (!selectableMahasiswa) return

        setLoadingAwal(true)
        getEvaluasiMandiri(selectableMahasiswa)
            .then(async (res) => {
                setDataDaftarUlang(res)
                setLoadingAwal(false)
                console.log(res)
            })
            .catch((res) => {
                setLoadingAwal(false)
            })
    }, [selectableMahasiswa])

    const continueToAsesor = () => {
        Swal.fire({
            title: 'Lanjutkan ke Asesor ?',
            text: 'Pastikan anda yakin terhadap penilaian evaluasi mandiri anda. Lampiran di Upload Dokumen jangan sampai salah.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#f45f24',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Lanjutkan Ke Asesor!',
        }).then((result) => {
            if (result.isConfirmed) {
                setLoading(true)
                if (dataDaftarUlang) {
                    setStatusPenunjukanAsesor(
                        dataDaftarUlang.PendaftaranId
                    ).then(() => {
                        setDataDaftarUlang({
                            ...dataDaftarUlang,
                            Status: 'Penunjukan Asesor',
                        })
                        Swal.fire({
                            title: 'Berhasil!',
                            text: 'Asesor akan ditunjuk untuk menilai Mata Kuliah RPL anda.',
                            icon: 'success',
                        })
                        setLoading(false)
                    })
                } else {
                    setLoading(false)
                    Swal.fire({
                        title: 'Gagal!',
                        text: 'Anda perlu memilih Nomor Ujian di kolom form.',
                        icon: 'error',
                    })
                }
            }
        })
    }

    const canProceed = dataDaftarUlang &&
        dataDaftarUlang.EvaluasiDiriMataKuliah === dataDaftarUlang.PilihMataKuliah &&
        dataDaftarUlang.EvaluasiDiriMataKuliah !== 0 && dataDaftarUlang.Status === 'Asessmen Mandiri'

    const getStatusMessage = (status: string) => {
        switch (status) {
            case 'Penerbitan SK Asessmen':
                return 'SK anda sudah terbit, silakan ke menu Sk. Rektor'
            case 'Hasil Final Asessmen':
                return 'Hasil Asessmen anda sudah selesai. Silakan ke menu Hasil Asessmen'
            case 'Sanggahan':
                return 'Silakan ke menu sanggahan untuk melihat hasil anda dan silakan melanjutkan atau menyanggah'
            case 'Rekapitulasi Asessmen':
                return 'Hasil Asessmen oleh Asesor sedang di Rekapitulasi. Silakan Menunggu'
            case 'Asessmen Oleh Asesor':
                return 'Evaluasi anda sedang di Asessmen oleh Asesor'
            case 'Penunjukan Asesor':
                return 'Asesor Sedang dipilih untuk menilai Mata Kuliah RPL Anda'
            case 'Asessmen Mandiri':
            case 'Pengisian Data Diri':
                return 'Silakan selesaikan evaluasi mandiri terlebih dahulu'
            default:
                return 'Status tidak diketahui'
        }
    }

    const getStatusAlertStyle = (status: string) => {
        switch (status) {
            case 'Penerbitan SK Asessmen':
            case 'Hasil Final Asessmen':
                return 'border-green-500 bg-green-50 dark:bg-green-950'
            case 'Sanggahan':
                return 'border-orange-500 bg-orange-50 dark:bg-orange-950'
            case 'Rekapitulasi Asessmen':
            case 'Asessmen Oleh Asesor':
            case 'Penunjukan Asesor':
                return 'border-blue-500 bg-blue-50 dark:bg-blue-950'
            default:
                return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950'
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <h1 className="text-2xl">Finalisasi Mata Kuliah</h1>
                </CardTitle>
                <CardDescription>
                    Finalisasi pilihan mata kuliah dan lanjutkan ke proses asessmen oleh asesor
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
                            <p>Silakan pilih nomor ujian terlebih dahulu.</p>
                        </div>
                    ) : loadingAwal ? (
                        <Skeleton className="w-full h-32" />
                    ) : dataDaftarUlang === null ? (
                        <Alert>
                            <InfoIcon className="h-4 w-4" />
                            <AlertTitle>Info</AlertTitle>
                            <AlertDescription>
                                Data tidak ditemukan untuk pendaftaran ini.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <div className="space-y-4">
                            {/* Status Info */}
                            <Alert>
                                <InfoIcon className="h-4 w-4" />
                                <AlertTitle>Status Saat Ini: {dataDaftarUlang.Status}</AlertTitle>
                                <AlertDescription>
                                    Anda telah menyelesaikan {dataDaftarUlang.EvaluasiDiriMataKuliah} dari {dataDaftarUlang.PilihMataKuliah} evaluasi mandiri mata kuliah.
                                </AlertDescription>
                            </Alert>

                            {canProceed ? (
                                <>
                                    <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                                        <CheckCircle2Icon className="h-4 w-4 text-green-600" />
                                        <AlertTitle className="text-green-700 dark:text-green-400">Evaluasi Mandiri Selesai!</AlertTitle>
                                        <AlertDescription className="text-green-600 dark:text-green-300">
                                            Anda telah menyelesaikan semua evaluasi mandiri. Silakan lanjutkan ke proses penunjukan asesor.
                                        </AlertDescription>
                                    </Alert>
                                    <Button
                                        className="mt-5 hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer"
                                        type="button"
                                        disabled={loading}
                                        onClick={() => continueToAsesor()}
                                    >
                                        Lanjutkan Ke Asesor
                                        <ArrowRightIcon className="ml-2" />
                                    </Button>
                                </>
                            ) : (
                                <Alert className={getStatusAlertStyle(dataDaftarUlang.Status)}>
                                    <InfoIcon className="h-4 w-4" />
                                    <AlertTitle>Keterangan Status</AlertTitle>
                                    <AlertDescription>
                                        {getStatusMessage(dataDaftarUlang.Status)}
                                        {(dataDaftarUlang.Status === 'Asessmen Mandiri' || dataDaftarUlang.Status === 'Pengisian Data Diri') && (
                                            <>
                                                {'. '}Silakan kembali ke halaman <Link href="/mata-kuliah/evaluasi-mandiri" className="underline font-medium">Evaluasi Mandiri</Link>.
                                            </>
                                        )}
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
