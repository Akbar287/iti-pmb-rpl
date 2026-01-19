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
    Database,
    Eye,
    FileCheck,
    Lock,
    RefreshCcw,
    Server,
    Shield,
    ShieldCheck,
    Trash2,
    UserCog,
} from 'lucide-react'

const sections = [
    {
        id: 'pengumpulan',
        icon: <Database className="h-5 w-5 text-blue-500" />,
        title: 'Data yang Dikumpulkan',
        content: `Kami mengumpulkan data pribadi yang diperlukan untuk proses Rekognisi Pembelajaran Lampau (RPL), meliputi:

• Data Identitas: Nama lengkap, NIK, tempat dan tanggal lahir, jenis kelamin, alamat, nomor telepon, dan email

• Data Pendidikan: Riwayat pendidikan formal, ijazah, transkrip nilai, sertifikat kompetensi

• Data Pekerjaan: Riwayat pengalaman kerja, surat keterangan kerja, portofolio, dan dokumen pendukung lainnya

• Data Akun: Username, kata sandi (terenkripsi), log aktivitas, dan preferensi pengguna

• Data Teknis: Alamat IP, jenis perangkat, browser, dan cookies untuk keperluan keamanan sistem`,
    },
    {
        id: 'dasar-hukum',
        icon: <FileCheck className="h-5 w-5 text-green-500" />,
        title: 'Dasar Hukum Pemrosesan',
        content: `Pemrosesan data pribadi Anda didasarkan pada:

• Undang-Undang Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP)

• Peraturan Pemerintah terkait penyelenggaraan pendidikan tinggi

• Persetujuan yang Anda berikan saat mendaftar dan menggunakan Sistem

• Kepentingan sah dalam menyelenggarakan layanan pendidikan yang berkualitas

• Kewajiban hukum yang harus dipenuhi oleh Institut sebagai penyelenggara pendidikan`,
    },
    {
        id: 'tujuan',
        icon: <Eye className="h-5 w-5 text-purple-500" />,
        title: 'Tujuan Penggunaan Data',
        content: `Data pribadi Anda digunakan untuk:

• Memproses dan mengevaluasi pengajuan RPL Anda

• Melakukan verifikasi identitas dan keaslian dokumen

• Menghubungi Anda terkait proses asesmen dan hasilnya

• Menyediakan layanan dukungan melalui sistem tiket bantuan

• Meningkatkan kualitas layanan dan pengalaman pengguna

• Memenuhi kewajiban pelaporan kepada Kementerian Pendidikan

• Keperluan audit akademik dan akreditasi institusi

• Penelitian dan pengembangan sistem pendidikan (data dianonimkan)`,
    },
    {
        id: 'penyimpanan',
        icon: <Server className="h-5 w-5 text-orange-500" />,
        title: 'Penyimpanan dan Keamanan Data',
        content: `Kami berkomitmen melindungi data Anda dengan:

• Enkripsi: Semua data sensitif dienkripsi saat transit dan saat disimpan menggunakan standar industri (AES-256, TLS 1.3)

• Akses Terbatas: Hanya personel yang berwenang yang dapat mengakses data pribadi, dengan sistem otentikasi berlapis

• Monitoring: Sistem dipantau 24/7 untuk mendeteksi dan mencegah akses tidak sah

• Backup: Data dicadangkan secara berkala dengan enkripsi terpisah

• Lokasi Server: Data disimpan di server yang berlokasi di Indonesia

• Masa Retensi: Data disimpan selama diperlukan untuk tujuan akademik dan sesuai ketentuan arsip perguruan tinggi (minimal 10 tahun setelah kelulusan)`,
    },
    {
        id: 'pembagian',
        icon: <RefreshCcw className="h-5 w-5 text-cyan-500" />,
        title: 'Pembagian Data kepada Pihak Ketiga',
        content: `Data Anda dapat dibagikan kepada:

• Asesor dan Dosen: Untuk keperluan evaluasi dan penilaian RPL

• Kementerian Pendidikan: Sebagai kewajiban pelaporan institusi pendidikan

• Lembaga Akreditasi: Dalam rangka proses akreditasi program studi

• Mitra Akademik: Dengan persetujuan Anda, untuk keperluan kerjasama pendidikan

Kami TIDAK akan menjual, menyewakan, atau membagikan data pribadi Anda kepada pihak ketiga untuk tujuan komersial tanpa persetujuan eksplisit dari Anda.`,
    },
    {
        id: 'hak-pengguna',
        icon: <UserCog className="h-5 w-5 text-indigo-500" />,
        title: 'Hak-Hak Anda sebagai Subjek Data',
        content: `Sesuai UU PDP, Anda memiliki hak:

• Hak Akses: Meminta salinan data pribadi yang kami simpan tentang Anda

• Hak Koreksi: Meminta pembetulan data yang tidak akurat atau tidak lengkap

• Hak Penghapusan: Meminta penghapusan data dalam kondisi tertentu yang diatur undang-undang

• Hak Pembatasan: Meminta pembatasan pemrosesan data Anda

• Hak Portabilitas: Menerima data Anda dalam format yang dapat dibaca mesin

• Hak Keberatan: Menolak pemrosesan data untuk tujuan tertentu

• Hak Penarikan Persetujuan: Menarik persetujuan yang sebelumnya diberikan

Untuk menggunakan hak-hak tersebut, silakan hubungi kami melalui kontak yang tersedia.`,
    },
    {
        id: 'cookies',
        icon: <Lock className="h-5 w-5 text-yellow-500" />,
        title: 'Cookies dan Teknologi Pelacakan',
        content: `Sistem kami menggunakan cookies untuk:

• Cookies Esensial: Diperlukan untuk fungsi dasar sistem seperti otentikasi dan keamanan

• Cookies Preferensi: Menyimpan pengaturan dan preferensi Anda

• Cookies Analitik: Membantu kami memahami cara pengguna berinteraksi dengan sistem

Anda dapat mengatur preferensi cookies melalui pengaturan browser. Namun, menonaktifkan cookies esensial dapat mempengaruhi fungsi sistem.`,
    },
    {
        id: 'insiden',
        icon: <ShieldCheck className="h-5 w-5 text-red-500" />,
        title: 'Penanganan Insiden Keamanan',
        content: `Jika terjadi pelanggaran data yang berdampak pada data pribadi Anda:

• Kami akan memberitahu Anda dalam waktu 72 jam setelah mengetahui insiden

• Pemberitahuan akan mencakup jenis data yang terdampak dan langkah mitigasi

• Kami akan melaporkan kepada otoritas yang berwenang sesuai ketentuan UU PDP

• Tim kami akan mengambil langkah segera untuk membatasi dampak dan mencegah kejadian serupa`,
    },
    {
        id: 'perubahan',
        icon: <Trash2 className="h-5 w-5 text-gray-500" />,
        title: 'Perubahan Kebijakan Privasi',
        content: `• Kami dapat memperbarui Kebijakan Privasi ini sewaktu-waktu

• Perubahan signifikan akan diberitahukan melalui email atau notifikasi di Sistem

• Tanggal pembaruan terakhir akan tercantum di halaman ini

• Penggunaan Sistem setelah perubahan dianggap sebagai persetujuan terhadap kebijakan yang diperbarui`,
    },
]

export default function KebijakanPrivasiPage() {
    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
            <Card className="mt-12 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl border-0">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Shield className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Kebijakan Privasi
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
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <ShieldCheck className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-green-800 dark:text-green-200 mb-1">
                                    Komitmen Perlindungan Data Pribadi
                                </p>
                                <p className="text-sm text-green-700 dark:text-green-300">
                                    Institut Teknologi Indonesia berkomitmen melindungi privasi dan data pribadi Anda
                                    sesuai dengan Undang-Undang Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP).
                                    Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi data Anda.
                                </p>
                            </div>
                        </div>
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
                                            if (line.includes(':') && line.startsWith('•')) {
                                                const [label, ...rest] = line.substring(2).split(':')
                                                return (
                                                    <p key={i} className="ml-2 mb-1">
                                                        • <span className="font-medium">{label}:</span>{rest.join(':')}
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
                        <h3 className="font-semibold text-lg mb-2">Kontak Petugas Perlindungan Data</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                            Jika Anda memiliki pertanyaan tentang pemrosesan data pribadi atau ingin menggunakan hak-hak Anda,
                            silakan hubungi:
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm">
                            <div>
                                <span className="text-muted-foreground">Email:</span>{' '}
                                <a href="mailto:pdsi@iti.ac.id" className="text-primary hover:underline font-medium">
                                    pdsi@iti.ac.id
                                </a>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Telepon:</span>{' '}
                                <span className="font-medium">(+62) 81360090013</span>
                            </div>
                        </div>
                    </div>

                    {/* Legal Notice */}
                    <div className="mt-4 text-xs text-center text-muted-foreground">
                        Kebijakan ini tunduk pada Undang-Undang No. 27 Tahun 2022 tentang Perlindungan Data Pribadi
                        dan peraturan pelaksanaannya.
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
