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
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import {
    AlertCircle,
    BookOpen,
    CheckCircle2,
    FileText,
    Scale,
    Shield,
    UserCheck,
} from 'lucide-react'

const sections = [
    {
        id: 'persetujuan',
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        title: 'Persetujuan Penggunaan',
        content: `Dengan mengakses dan menggunakan Sistem Informasi RPL Terpadu Institut Teknologi Indonesia (ITI), Anda menyatakan telah membaca, memahami, dan menyetujui untuk terikat dengan syarat dan ketentuan ini.

Jika Anda tidak menyetujui salah satu atau seluruh syarat dan ketentuan ini, mohon untuk tidak menggunakan layanan kami. Penggunaan layanan ini menandakan penerimaan Anda terhadap semua ketentuan yang berlaku.`,
    },
    {
        id: 'definisi',
        icon: <BookOpen className="h-5 w-5 text-blue-500" />,
        title: 'Definisi',
        content: `Dalam Syarat dan Ketentuan ini, yang dimaksud dengan:

• RPL (Rekognisi Pembelajaran Lampau): adalah proses pengakuan terhadap capaian pembelajaran seseorang yang diperoleh dari pengalaman kerja, pendidikan non-formal, atau pengalaman hidup lainnya.

• Sistem: adalah Sistem Informasi RPL Terpadu yang dikembangkan dan dikelola oleh Institut Teknologi Indonesia.

• Pengguna: adalah setiap individu yang mengakses dan menggunakan Sistem, termasuk namun tidak terbatas pada mahasiswa, calon mahasiswa, dosen, asesor, dan staf administrasi.

• Akun: adalah identitas digital yang digunakan untuk mengakses Sistem.

• Konten: adalah semua informasi, data, dokumen, dan materi yang diunggah atau disampaikan melalui Sistem.`,
    },
    {
        id: 'penggunaan',
        icon: <UserCheck className="h-5 w-5 text-purple-500" />,
        title: 'Hak dan Kewajiban Pengguna',
        content: `**Hak Pengguna:**
• Mengakses fitur Sistem sesuai dengan peran yang diberikan
• Mendapatkan informasi yang jelas tentang proses RPL
• Mengajukan keluhan atau pertanyaan melalui sistem tiket bantuan
• Mendapatkan perlindungan atas data pribadi

**Kewajiban Pengguna:**
• Menjaga kerahasiaan akun dan kata sandi
• Memberikan informasi yang benar, akurat, dan lengkap
• Tidak menyalahgunakan Sistem untuk tujuan yang melanggar hukum
• Menghormati hak kekayaan intelektual
• Tidak mengunggah konten yang bersifat SARA, pornografi, atau konten ilegal lainnya
• Segera melaporkan jika terjadi penyalahgunaan akun`,
    },
    {
        id: 'dokumen',
        icon: <FileText className="h-5 w-5 text-orange-500" />,
        title: 'Dokumen dan Verifikasi',
        content: `**Ketentuan Dokumen:**
• Semua dokumen yang diunggah harus asli dan dapat diverifikasi
• Format dokumen yang diterima: PDF, DOC, DOCX dengan ukuran maksimal 10MB
• Dokumen harus jelas, dapat dibaca, dan tidak rusak
• Pengguna bertanggung jawab penuh atas keaslian dokumen

**Proses Verifikasi:**
• Tim asesor berhak melakukan verifikasi terhadap semua dokumen
• Institut berhak meminta dokumen tambahan jika diperlukan
• Pemalsuan dokumen akan berakibat diskualifikasi dan tindakan hukum
• Hasil verifikasi bersifat final dan mengikat`,
    },
    {
        id: 'layanan',
        icon: <Shield className="h-5 w-5 text-cyan-500" />,
        title: 'Ketersediaan Layanan',
        content: `• Sistem beroperasi 24 jam sehari, 7 hari seminggu, dengan pengecualian waktu pemeliharaan terjadwal
• Kami tidak menjamin bahwa Sistem akan selalu tersedia tanpa gangguan
• Pemeliharaan sistem akan diinformasikan sebelumnya melalui pengumuman di Sistem
• Kami berhak untuk menghentikan sementara atau permanen layanan dengan pemberitahuan yang wajar
• Kami tidak bertanggung jawab atas kerugian yang timbul akibat gangguan teknis di luar kendali kami`,
    },
    {
        id: 'hukum',
        icon: <Scale className="h-5 w-5 text-red-500" />,
        title: 'Hukum yang Berlaku',
        content: `• Syarat dan Ketentuan ini diatur dan ditafsirkan sesuai dengan hukum Republik Indonesia
• Setiap perselisihan yang timbul akan diselesaikan secara musyawarah terlebih dahulu
• Jika musyawarah tidak mencapai kesepakatan, perselisihan akan diselesaikan melalui Pengadilan Negeri yang berwenang
• Dengan menggunakan Sistem ini, Anda tunduk pada yurisdiksi pengadilan Indonesia`,
    },
    {
        id: 'perubahan',
        icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
        title: 'Perubahan Syarat dan Ketentuan',
        content: `• Institut berhak mengubah Syarat dan Ketentuan ini sewaktu-waktu tanpa pemberitahuan sebelumnya
• Perubahan akan efektif segera setelah dipublikasikan di Sistem
• Pengguna disarankan untuk memeriksa halaman ini secara berkala
• Penggunaan Sistem setelah perubahan menandakan persetujuan terhadap ketentuan yang diperbarui
• Versi terbaru akan selalu tersedia di halaman ini dengan tanggal pembaruan terakhir`,
    },
]

export default function SyaratKetentuanPage() {
    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
            <Card className="mt-12 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl border-0">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Syarat dan Ketentuan
                        </h1>
                    </CardTitle>
                    <CardDescription className="text-base mt-2">
                        Sistem Informasi RPL Terpadu - Institut Teknologi Indonesia
                    </CardDescription>
                    <Badge variant="outline" className="mt-3 mx-auto">
                        Terakhir diperbarui: Januari 2026
                    </Badge>
                </CardHeader>
                <CardContent className="pt-6">
                    {/* Introduction */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                            Harap baca syarat dan ketentuan ini dengan seksama sebelum menggunakan
                            layanan kami. Dokumen ini menjelaskan hak dan kewajiban Anda sebagai
                            pengguna Sistem Informasi RPL Terpadu.
                        </p>
                    </div>

                    {/* Accordion Sections */}
                    <Accordion type="single" collapsible className="w-full space-y-3">
                        {sections.map((section, index) => (
                            <AccordionItem
                                key={section.id}
                                value={section.id}
                                className="border rounded-lg px-4 bg-white dark:bg-gray-800/50 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <AccordionTrigger className="hover:no-underline py-4">
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-sm font-semibold">
                                            {index + 1}
                                        </span>
                                        {section.icon}
                                        <span className="font-semibold text-left">
                                            {section.title}
                                        </span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-4 pt-2">
                                    <div className="pl-11 text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                                        {section.content.split('\n').map((line, i) => {
                                            if (line.startsWith('**') && line.endsWith('**')) {
                                                return (
                                                    <p key={i} className="font-semibold text-gray-800 dark:text-gray-200 mt-3 mb-2">
                                                        {line.replace(/\*\*/g, '')}
                                                    </p>
                                                )
                                            }
                                            if (line.startsWith('•')) {
                                                return (
                                                    <p key={i} className="ml-2 mb-1">
                                                        {line}
                                                    </p>
                                                )
                                            }
                                            return <p key={i} className="mb-2">{line}</p>
                                        })}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    {/* Contact Section */}
                    <div className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 rounded-xl border border-primary/20">
                        <h3 className="font-semibold text-lg mb-2">Ada Pertanyaan?</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                            Jika Anda memiliki pertanyaan mengenai Syarat dan Ketentuan ini,
                            silakan hubungi kami melalui:
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm">
                            <div>
                                <span className="text-muted-foreground">Email:</span>{' '}
                                <a href="mailto:rpl@iti.ac.id" className="text-primary hover:underline font-medium">
                                    rpl@iti.ac.id
                                </a>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
