'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
    ArrowLeft,
    ArrowRight,
    BookOpen,
    CheckCircle2,
    ClipboardCheck,
    FileCheck2,
    FileText,
    GitCompare,
    GraduationCap,
    Info,
    ListChecks,
    Scale,
    Shield,
    Target,
    XCircle,
} from 'lucide-react'

const Page = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pendaftaranId = searchParams.get('id') || ''

    const handleStartAssessment = () => {
        if (pendaftaranId) {
            router.push(`/asessment/asessmen-mahasiswa/ekuivalent-check/${pendaftaranId}`)
        }
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            {/* Back Button */}
            <Button
                variant="ghost"
                className="mb-4 hover:bg-muted"
                onClick={() => router.push('/asessment/asessmen-mahasiswa')}
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Daftar Mahasiswa
            </Button>

            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-blue-500 to-purple-600 mb-4">
                    <Scale className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold mb-2 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Petunjuk Asessmen Transfer SKS
                </h1>
                <p className="text-muted-foreground text-lg">
                    Panduan lengkap untuk melakukan penilaian ekuivalensi mata kuliah
                </p>
            </div>

            {/* Alert Info */}
            <Alert className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950/20">
                <Info className="h-5 w-5 text-blue-600" />
                <AlertTitle className="text-blue-800 dark:text-blue-200">Informasi Penting</AlertTitle>
                <AlertDescription className="text-blue-700 dark:text-blue-300">
                    Pastikan Anda telah membaca dan memahami seluruh petunjuk sebelum memulai proses asesmen Transfer SKS.
                    Keputusan Anda akan mempengaruhi pengakuan kredit akademik mahasiswa.
                </AlertDescription>
            </Alert>

            {/* Pengertian */}
            <Card className="mb-6 border-l-4 border-l-purple-500">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-purple-500" />
                        Apa itu Transfer SKS?
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                    <p className="mb-3">
                        <strong className="text-foreground">Transfer SKS</strong> adalah proses pengakuan kredit akademik
                        dari mata kuliah yang telah ditempuh mahasiswa di perguruan tinggi sebelumnya.
                        Sebagai asesor, Anda bertugas menilai kesetaraan (ekuivalensi) antara mata kuliah
                        yang telah ditempuh dengan mata kuliah di program studi tujuan.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            <GraduationCap className="w-3 h-3 mr-1" /> Pengakuan Akademik
                        </Badge>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            <GitCompare className="w-3 h-3 mr-1" /> Ekuivalensi Mata Kuliah
                        </Badge>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Validasi Transkrip
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Langkah-langkah */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ListChecks className="w-5 h-5 text-green-500" />
                        Langkah-langkah Asesmen
                    </CardTitle>
                    <CardDescription>
                        Ikuti langkah-langkah berikut untuk melakukan penilaian ekuivalensi
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex gap-4 items-start">
                            <div className="shrink-0 w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                                1
                            </div>
                            <div className="flex-1 pt-1">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-blue-500" />
                                    Periksa Dokumen Transkrip
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Lihat dan verifikasi dokumen transkrip nilai yang diupload oleh mahasiswa.
                                    Pastikan dokumen asli dan dapat dibaca dengan jelas.
                                </p>
                            </div>
                        </div>

                        <Separator />

                        <div className="flex gap-4 items-start">
                            <div className="shrink-0 w-10 h-10 rounded-full bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold shadow-md">
                                2
                            </div>
                            <div className="flex-1 pt-1">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <Target className="w-4 h-4 text-green-500" />
                                    Pilih Mata Kuliah Tujuan
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Dari sidebar, pilih mata kuliah yang akan dinilai ekuivalensinya.
                                    Setiap mata kuliah ditampilkan dengan informasi SKS dan capaian pembelajaran.
                                </p>
                            </div>
                        </div>

                        <Separator />

                        <div className="flex gap-4 items-start">
                            <div className="shrink-0 w-10 h-10 rounded-full bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold shadow-md">
                                3
                            </div>
                            <div className="flex-1 pt-1">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <GitCompare className="w-4 h-4 text-orange-500" />
                                    Cocokkan dengan Transkrip
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Pilih mata kuliah dari transkrip nilai mahasiswa yang dianggap setara
                                    dengan mata kuliah tujuan. Perhatikan kesesuaian SKS dan konten pembelajaran.
                                </p>
                            </div>
                        </div>

                        <Separator />

                        <div className="flex gap-4 items-start">
                            <div className="shrink-0 w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                                4
                            </div>
                            <div className="flex-1 pt-1">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <ClipboardCheck className="w-4 h-4 text-purple-500" />
                                    Berikan Penilaian
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Tentukan nilai asesmen (A, B, C, dll) dan centang jika diakui sebagai Transfer SKS.
                                    Klik tombol "Simpan" untuk menyimpan penilaian.
                                </p>
                            </div>
                        </div>

                        <Separator />

                        <div className="flex gap-4 items-start">
                            <div className="shrink-0 w-10 h-10 rounded-full bg-linear-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-md">
                                5
                            </div>
                            <div className="flex-1 pt-1">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <FileCheck2 className="w-4 h-4 text-teal-500" />
                                    Ulangi untuk Semua Mata Kuliah
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Lanjutkan ke mata kuliah berikutnya menggunakan tombol navigasi atau pilih
                                    dari sidebar. Pastikan semua mata kuliah sudah dinilai.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                            <CheckCircle2 className="w-5 h-5" />
                            Kriteria Diakui
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                            <span className="text-sm">SKS setara atau lebih besar</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                            <span className="text-sm">Konten pembelajaran relevan</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                            <span className="text-sm">Nilai memenuhi standar minimal</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                            <span className="text-sm">Capaian pembelajaran tercakup</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                            <XCircle className="w-5 h-5" />
                            Kriteria Tidak Diakui
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex items-start gap-2">
                            <XCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                            <span className="text-sm">SKS jauh lebih kecil</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <XCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                            <span className="text-sm">Konten tidak relevan</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <XCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                            <span className="text-sm">Nilai di bawah standar</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <XCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                            <span className="text-sm">Dokumen tidak valid/meragukan</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Alert className="mb-8 border-amber-200 bg-amber-50 dark:bg-amber-950/20">
                <Shield className="h-5 w-5 text-amber-600" />
                <AlertTitle className="text-amber-800 dark:text-amber-200">Catatan Penting</AlertTitle>
                <AlertDescription className="text-amber-700 dark:text-amber-300">
                    <ul className="list-disc list-inside space-y-1 mt-2">
                        <li>Keputusan asesmen bersifat final dan akan mempengaruhi akademik mahasiswa</li>
                        <li>Pastikan penilaian objektif berdasarkan bukti dokumen yang ada</li>
                        <li>Jika ragu, konsultasikan dengan Ketua Program Studi</li>
                        <li>Anda dapat mengubah penilaian dengan menghapus dan mengisi ulang</li>
                    </ul>
                </AlertDescription>
            </Alert>

            {pendaftaranId ? (
                <div className="text-center">
                    <Button
                        size="lg"
                        className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                        onClick={handleStartAssessment}
                    >
                        Mulai Asesmen Transfer SKS
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    <p className="text-sm text-muted-foreground mt-3">
                        Anda akan diarahkan ke halaman penilaian ekuivalensi
                    </p>
                </div>
            ) : (
                <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <AlertTitle className="text-red-800 dark:text-red-200">ID Pendaftaran Tidak Ditemukan</AlertTitle>
                    <AlertDescription className="text-red-700 dark:text-red-300">
                        Silakan akses halaman ini melalui menu Asessmen Mahasiswa dan pilih mahasiswa yang akan dinilai.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    )
}

export default Page
