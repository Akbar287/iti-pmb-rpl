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
    Award,
    BookMarked,
    BrainCircuit,
    CheckCircle2,
    ClipboardCheck,
    ClipboardList,
    Eye,
    FileCheck2,
    FileSearch,
    FileText,
    GraduationCap,
    Info,
    Lightbulb,
    ListChecks,
    Shield,
    Sparkles,
    Target,
    XCircle,
} from 'lucide-react'

const Page = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pendaftaranId = searchParams.get('id') || ''

    const handleStartAssessment = () => {
        if (pendaftaranId) {
            router.push(`/asessment/asessmen-mahasiswa/asessmen-check/${pendaftaranId}`)
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
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-emerald-500 to-teal-600 mb-4">
                    <Award className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold mb-2 bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Petunjuk Asessmen Perolehan SKS
                </h1>
                <p className="text-muted-foreground text-lg">
                    Panduan lengkap untuk melakukan penilaian berbasis bukti portofolio
                </p>
            </div>

            {/* Alert Info */}
            <Alert className="mb-6 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20">
                <Info className="h-5 w-5 text-emerald-600" />
                <AlertTitle className="text-emerald-800 dark:text-emerald-200">Informasi Penting</AlertTitle>
                <AlertDescription className="text-emerald-700 dark:text-emerald-300">
                    Asesmen ini berbasis evaluasi mandiri mahasiswa. Anda akan menilai kesesuaian antara
                    bukti portofolio yang dikumpulkan dengan capaian pembelajaran setiap mata kuliah.
                </AlertDescription>
            </Alert>

            {/* Pengertian */}
            <Card className="mb-6 border-l-4 border-l-teal-500">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookMarked className="w-5 h-5 text-teal-500" />
                        Apa itu Perolehan SKS?
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                    <p className="mb-3">
                        <strong className="text-foreground">Perolehan SKS</strong> adalah proses pengakuan
                        kompetensi mahasiswa berdasarkan pengalaman dan pembelajaran yang telah diperoleh
                        di luar pendidikan formal. Sebagai asesor, Anda bertugas memvalidasi bukti-bukti
                        yang dikumpulkan mahasiswa dan menilai kesesuaiannya dengan capaian pembelajaran.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                        <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
                            <GraduationCap className="w-3 h-3 mr-1" /> Recognition of Prior Learning
                        </Badge>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            <FileCheck2 className="w-3 h-3 mr-1" /> Validasi Bukti
                        </Badge>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <Award className="w-3 h-3 mr-1" /> Penilaian Kompetensi
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Kriteria VATM */}
            <Card className="mb-6 border-2 border-dashed border-teal-300">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        Kriteria Penilaian VATM
                    </CardTitle>
                    <CardDescription>
                        Empat kriteria utama dalam menilai bukti portofolio
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Valid */}
                        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                                    V
                                </div>
                                <h4 className="font-semibold text-blue-700 dark:text-blue-300">Valid</h4>
                            </div>
                            <p className="text-sm text-blue-600 dark:text-blue-400">
                                Bukti relevan dan sesuai dengan capaian pembelajaran yang diklaim
                            </p>
                        </div>

                        {/* Autentik */}
                        <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                                    A
                                </div>
                                <h4 className="font-semibold text-purple-700 dark:text-purple-300">Autentik</h4>
                            </div>
                            <p className="text-sm text-purple-600 dark:text-purple-400">
                                Bukti asli milik mahasiswa, bukan hasil plagiat atau manipulasi
                            </p>
                        </div>

                        {/* Terkini */}
                        <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                                    T
                                </div>
                                <h4 className="font-semibold text-orange-700 dark:text-orange-300">Terkini</h4>
                            </div>
                            <p className="text-sm text-orange-600 dark:text-orange-400">
                                Bukti masih relevan dengan perkembangan ilmu dan teknologi saat ini
                            </p>
                        </div>

                        {/* Memadai */}
                        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                                    M
                                </div>
                                <h4 className="font-semibold text-green-700 dark:text-green-300">Memadai</h4>
                            </div>
                            <p className="text-sm text-green-600 dark:text-green-400">
                                Bukti cukup untuk membuktikan penguasaan capaian pembelajaran
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Langkah-langkah */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ListChecks className="w-5 h-5 text-emerald-500" />
                        Langkah-langkah Asesmen
                    </CardTitle>
                    <CardDescription>
                        Ikuti langkah-langkah berikut untuk melakukan penilaian
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Step 1 */}
                        <div className="flex gap-4 items-start">
                            <div className="shrink-0 w-10 h-10 rounded-full bg-linear-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold shadow-md">
                                1
                            </div>
                            <div className="flex-1 pt-1">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <Target className="w-4 h-4 text-emerald-500" />
                                    Pilih Mata Kuliah dan Capaian Pembelajaran
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Dari sidebar, pilih mata kuliah dan capaian pembelajaran yang akan dinilai.
                                    Setiap capaian memiliki evaluasi mandiri dari mahasiswa.
                                </p>
                            </div>
                        </div>

                        <Separator />

                        {/* Step 2 */}
                        <div className="flex gap-4 items-start">
                            <div className="shrink-0 w-10 h-10 rounded-full bg-linear-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-md">
                                2
                            </div>
                            <div className="flex-1 pt-1">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <Eye className="w-4 h-4 text-teal-500" />
                                    Lihat Profiensi dan Bukti Mahasiswa
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Periksa tingkat profiensi yang diklaim mahasiswa dan bukti-bukti
                                    dokumen yang dilampirkan untuk mendukung klaim tersebut.
                                </p>
                            </div>
                        </div>

                        <Separator />

                        {/* Step 3 */}
                        <div className="flex gap-4 items-start">
                            <div className="shrink-0 w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                                3
                            </div>
                            <div className="flex-1 pt-1">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <FileSearch className="w-4 h-4 text-blue-500" />
                                    Verifikasi Dokumen Bukti
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Klik untuk melihat setiap dokumen bukti. Periksa keaslian,
                                    relevansi, dan kecukupan bukti tersebut.
                                </p>
                            </div>
                        </div>

                        <Separator />

                        {/* Step 4 */}
                        <div className="flex gap-4 items-start">
                            <div className="shrink-0 w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                                4
                            </div>
                            <div className="flex-1 pt-1">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <ClipboardCheck className="w-4 h-4 text-purple-500" />
                                    Centang Kriteria VATM
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Centang kriteria Valid, Autentik, Terkini, dan Memadai sesuai
                                    hasil verifikasi. Anda juga dapat menggunakan bantuan AI.
                                </p>
                            </div>
                        </div>

                        <Separator />

                        {/* Step 5 */}
                        <div className="flex gap-4 items-start">
                            <div className="shrink-0 w-10 h-10 rounded-full bg-linear-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold shadow-md">
                                5
                            </div>
                            <div className="flex-1 pt-1">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <ClipboardList className="w-4 h-4 text-amber-500" />
                                    Berikan Nilai dan Komentar
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Tentukan keputusan asesmen (K = Kompeten / BK = Belum Kompeten)
                                    dan berikan nilai serta komentar jika diperlukan.
                                </p>
                            </div>
                        </div>

                        <Separator />

                        {/* Step 6 */}
                        <div className="flex gap-4 items-start">
                            <div className="shrink-0 w-10 h-10 rounded-full bg-linear-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white font-bold shadow-md">
                                6
                            </div>
                            <div className="flex-1 pt-1">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <FileCheck2 className="w-4 h-4 text-rose-500" />
                                    Simpan dan Lanjutkan
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Klik tombol simpan dan lanjutkan ke capaian pembelajaran berikutnya.
                                    Pastikan semua capaian sudah dinilai.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tips Asesmen */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Tips Kompeten */}
                <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                            <CheckCircle2 className="w-5 h-5" />
                            Indikator Kompeten (K)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                            <span className="text-sm">Semua kriteria VATM terpenuhi</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                            <span className="text-sm">Bukti menunjukkan penguasaan kompetensi</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                            <span className="text-sm">Profiensi sesuai dengan bukti</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                            <span className="text-sm">Dokumen dapat diverifikasi</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Tips Belum Kompeten */}
                <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                            <XCircle className="w-5 h-5" />
                            Indikator Belum Kompeten (BK)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex items-start gap-2">
                            <XCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                            <span className="text-sm">Kriteria VATM tidak lengkap</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <XCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                            <span className="text-sm">Bukti tidak relevan/tidak cukup</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <XCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                            <span className="text-sm">Klaim profiensi tidak didukung bukti</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <XCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                            <span className="text-sm">Dokumen meragukan/tidak asli</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Fitur AI */}
            <Card className="mb-6 border-violet-200 bg-linear-to-r from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-violet-700 dark:text-violet-300">
                        <BrainCircuit className="w-5 h-5" />
                        Fitur Bantuan AI
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-violet-700 dark:text-violet-300">
                    <p className="text-sm mb-3">
                        Sistem menyediakan fitur bantuan AI yang dapat membantu menganalisis bukti dokumen
                        dan memberikan rekomendasi penilaian. Namun, keputusan akhir tetap ada di tangan Anda sebagai asesor.
                    </p>
                    <div className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        <span className="text-sm font-medium">Gunakan AI sebagai referensi, bukan pengganti penilaian Anda</span>
                    </div>
                </CardContent>
            </Card>

            {/* Catatan Penting */}
            <Alert className="mb-8 border-amber-200 bg-amber-50 dark:bg-amber-950/20">
                <Shield className="h-5 w-5 text-amber-600" />
                <AlertTitle className="text-amber-800 dark:text-amber-200">Catatan Penting</AlertTitle>
                <AlertDescription className="text-amber-700 dark:text-amber-300">
                    <ul className="list-disc list-inside space-y-1 mt-2">
                        <li>Keputusan asesmen bersifat final dan mempengaruhi akademik mahasiswa</li>
                        <li>Nilai berdasarkan objektifitas dan bukti yang ada</li>
                        <li>Jika ragu, konsultasikan dengan Ketua Program Studi</li>
                        <li>Pastikan semua capaian pembelajaran sudah dinilai sebelum melanjutkan</li>
                    </ul>
                </AlertDescription>
            </Alert>

            {/* Tombol Mulai */}
            {pendaftaranId ? (
                <div className="text-center">
                    <Button
                        size="lg"
                        className="bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                        onClick={handleStartAssessment}
                    >
                        Mulai Asesmen Perolehan SKS
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    <p className="text-sm text-muted-foreground mt-3">
                        Anda akan diarahkan ke halaman penilaian kompetensi
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
