import React from 'react'
import Link from 'next/link'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
    BookOpen,
    ClipboardList,
    FileQuestion,
    FileText,
    Hammer,
    LifeBuoy,
    LogIn,
    Mail,
    PieChart,
    ShieldCheck,
    UploadCloud,
} from 'lucide-react'

const chapters = [
    {
        icon: LogIn,
        title: 'Memulai',
        description:
            'Pendaftaran akun, aktivasi, cara masuk, dan pengenalan tampilan sistem.',
    },
    {
        icon: ClipboardList,
        title: 'Pengajuan RPL',
        description:
            'Alur pengajuan dari awal sampai terbit hasil asesmen, beserta status di setiap tahap.',
    },
    {
        icon: UploadCloud,
        title: 'Kelengkapan Dokumen',
        description:
            'Daftar dokumen yang wajib diunggah, format berkas, dan ketentuan ukurannya.',
    },
    {
        icon: FileText,
        title: 'Asesmen & Ekuivalensi',
        description:
            'Cara membaca hasil asesmen, penyetaraan mata kuliah, dan pengajuan sanggahan.',
    },
    {
        icon: ShieldCheck,
        title: 'Peran & Hak Akses',
        description:
            'Perbedaan menu untuk mahasiswa, asesor, program studi, dan administrator.',
    },
    {
        icon: FileQuestion,
        title: 'Pemecahan Masalah',
        description:
            'Kendala yang sering terjadi, penyebabnya, dan langkah penanganannya.',
    },
]

const Page = () => {
    return (
        <div className="w-full">
            <Card className="w-full">
                <CardHeader className="pb-2 text-center">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10">
                        <BookOpen className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle>
                        <h1 className="text-3xl font-bold text-transparent bg-linear-to-r from-primary to-primary/60 bg-clip-text">
                            Buku Petunjuk
                        </h1>
                    </CardTitle>
                    <CardDescription className="mt-2 text-base">
                        Panduan penggunaan Sistem Informasi RPL Terpadu -
                        Institut Teknologi Indonesia
                    </CardDescription>
                    <Badge variant="outline" className="mx-auto mt-3">
                        Segera Hadir
                    </Badge>
                </CardHeader>

                <CardContent className="pt-6">
                    <div className="flex items-start gap-3 p-4 mb-8 border rounded-lg bg-primary/5 border-primary/20">
                        <Hammer className="w-5 h-5 mt-0.5 shrink-0 text-primary" />
                        <div className="text-sm">
                            <p className="font-semibold">
                                Buku petunjuk sedang disusun
                            </p>
                            <p className="mt-1 text-muted-foreground">
                                Halaman ini disiapkan lebih dulu agar tautannya
                                sudah dapat diakses. Isi panduan akan
                                dipublikasikan di halaman ini begitu selesai
                                disusun. Sementara itu, silakan gunakan kanal
                                bantuan di bawah.
                            </p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h2 className="font-semibold">Rencana Isi Panduan</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Bab-bab berikut sedang dipersiapkan.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {chapters.map((chapter, index) => (
                            <div
                                key={chapter.title}
                                className="relative p-4 border border-dashed rounded-lg bg-muted/30"
                            >
                                <div className="flex items-start gap-3">
                                    <span className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0 bg-background text-muted-foreground">
                                        <chapter.icon className="w-4 h-4" />
                                    </span>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold text-muted-foreground">
                                                Bab {index + 1}
                                            </span>
                                            <Badge
                                                variant="secondary"
                                                className="text-[10px]"
                                            >
                                                Draf
                                            </Badge>
                                        </div>
                                        <h3 className="mt-1 font-semibold">
                                            {chapter.title}
                                        </h3>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {chapter.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Separator className="my-8" />

                    <div className="p-6 border rounded-xl bg-linear-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 border-primary/20">
                        <h3 className="text-lg font-semibold">
                            Butuh Panduan Sekarang?
                        </h3>
                        <p className="mt-1 mb-4 text-sm text-muted-foreground">
                            Selagi buku petunjuk disusun, informasi berikut
                            sudah tersedia dan dapat membantu Anda.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Button asChild variant="outline">
                                <Link href="/proses-bisnis-rpl">
                                    <PieChart className="w-4 h-4" />
                                    Proses Bisnis RPL
                                </Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href="/question">
                                    <FileQuestion className="w-4 h-4" />
                                    Q&amp;A
                                </Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href="/tickets">
                                    <LifeBuoy className="w-4 h-4" />
                                    Tiket Bantuan
                                </Link>
                            </Button>
                        </div>
                        <div className="mt-4 text-sm">
                            <span className="inline-flex items-center gap-2 text-muted-foreground">
                                <Mail className="w-4 h-4" />
                                Email:
                            </span>{' '}
                            <a
                                href="mailto:rpl@iti.ac.id"
                                className="font-medium text-primary hover:underline"
                            >
                                rpl@iti.ac.id
                            </a>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Page
