'use client'

import React, { useState, useEffect } from 'react'
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
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
    Cookie,
    Shield,
    Settings,
    BarChart3,
    Target,
    Clock,
    Globe,
    Lock,
    CheckCircle2,
    Info,
    Sparkles,
    Save,
} from 'lucide-react'

// Cookie utility functions
const COOKIE_CONSENT_NAME = 'iti_cookie_consent'
const COOKIE_EXPIRY_DAYS = 365

interface CookiePreferences {
    essential: boolean
    functional: boolean
    analytics: boolean
    marketing: boolean
}

const defaultPreferences: CookiePreferences = {
    essential: true,
    functional: false,
    analytics: false,
    marketing: false,
}

function setCookie(name: string, value: string, days: number) {
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`
}

function getCookie(name: string): string | null {
    const nameEQ = name + '='
    const cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i]
        while (cookie.charAt(0) === ' ') cookie = cookie.substring(1)
        if (cookie.indexOf(nameEQ) === 0) {
            return decodeURIComponent(cookie.substring(nameEQ.length))
        }
    }
    return null
}

function deleteCookie(name: string) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}

const cookieTypes = [
    {
        id: 'essential',
        icon: <Shield className="h-5 w-5" />,
        title: 'Cookie Esensial',
        description: 'Diperlukan untuk fungsi dasar website',
        color: 'from-emerald-500 to-teal-500',
        bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
        borderColor: 'border-emerald-200 dark:border-emerald-800',
        iconBg: 'bg-emerald-100 dark:bg-emerald-800',
        required: true,
        content: `Cookie esensial sangat penting untuk menjalankan website kami. Tanpa cookie ini, layanan yang Anda minta tidak dapat disediakan.

Fungsi yang menggunakan cookie esensial:
• Autentikasi pengguna dan manajemen sesi login
• Keamanan akun dan perlindungan dari serangan CSRF
• Mengingat preferensi bahasa dan pengaturan aksesibilitas
• Memproses formulir pendaftaran dan submission data
• Load balancing untuk memastikan website berjalan lancar

Cookie ini tidak dapat dinonaktifkan karena website tidak akan berfungsi dengan benar tanpanya.`,
    },
    {
        id: 'functional',
        icon: <Settings className="h-5 w-5" />,
        title: 'Cookie Fungsional',
        description: 'Meningkatkan pengalaman pengguna',
        color: 'from-blue-500 to-indigo-500',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-blue-200 dark:border-blue-800',
        iconBg: 'bg-blue-100 dark:bg-blue-800',
        required: false,
        content: `Cookie fungsional memungkinkan website menyediakan fitur dan personalisasi yang lebih baik.

Kegunaan cookie fungsional:
• Mengingat preferensi tampilan (mode gelap/terang)
• Menyimpan pengaturan notifikasi yang Anda pilih
• Mengingat pilihan formulir untuk kemudahan pengisian
• Menyediakan fitur chat support yang personal
• Mengaktifkan fitur berbagi ke media sosial`,
    },
    {
        id: 'analytics',
        icon: <BarChart3 className="h-5 w-5" />,
        title: 'Cookie Analitik',
        description: 'Membantu kami memahami penggunaan website',
        color: 'from-purple-500 to-pink-500',
        bgColor: 'bg-purple-50 dark:bg-purple-900/20',
        borderColor: 'border-purple-200 dark:border-purple-800',
        iconBg: 'bg-purple-100 dark:bg-purple-800',
        required: false,
        content: `Cookie analitik membantu kami memahami bagaimana pengunjung berinteraksi dengan website.

Data yang dikumpulkan meliputi:
• Jumlah pengunjung dan halaman yang dikunjungi
• Durasi kunjungan dan bounce rate
• Sumber traffic (dari mana pengunjung berasal)
• Perangkat dan browser yang digunakan
• Fitur yang paling sering digunakan

Semua data dikumpulkan secara anonim dan hanya digunakan untuk meningkatkan layanan kami.`,
    },
    {
        id: 'marketing',
        icon: <Target className="h-5 w-5" />,
        title: 'Cookie Pemasaran',
        description: 'Digunakan untuk iklan yang relevan',
        color: 'from-orange-500 to-red-500',
        bgColor: 'bg-orange-50 dark:bg-orange-900/20',
        borderColor: 'border-orange-200 dark:border-orange-800',
        iconBg: 'bg-orange-100 dark:bg-orange-800',
        required: false,
        content: `Cookie pemasaran digunakan untuk melacak pengunjung di seluruh website untuk menampilkan iklan yang relevan.

Bagaimana cookie ini bekerja:
• Melacak kunjungan Anda ke website lain
• Membangun profil minat berdasarkan aktivitas browsing
• Menampilkan iklan program studi yang mungkin Anda minati
• Mengukur efektivitas kampanye promosi kami
• Membatasi berapa kali Anda melihat iklan yang sama

Anda dapat menonaktifkan cookie ini tanpa mempengaruhi fungsi utama website.`,
    },
]

const cookieInfo = [
    {
        id: 'what-is-cookie',
        icon: <Cookie className="h-5 w-5 text-amber-500" />,
        title: 'Apa itu Cookie?',
        content: `Cookie adalah file teks kecil yang disimpan di perangkat Anda (komputer, tablet, atau smartphone) ketika Anda mengunjungi website. Cookie membantu website mengingat informasi tentang kunjungan Anda, seperti preferensi bahasa dan pengaturan lainnya.

Cookie dibuat oleh server website dan dikirim ke browser Anda, yang kemudian menyimpannya di folder khusus di perangkat Anda. Setiap kali Anda mengunjungi website yang sama, browser akan mengirim cookie kembali ke server.`,
    },
    {
        id: 'cookie-duration',
        icon: <Clock className="h-5 w-5 text-cyan-500" />,
        title: 'Berapa Lama Cookie Disimpan?',
        content: `Durasi penyimpanan cookie berbeda-beda:

• Session Cookies: Dihapus otomatis saat Anda menutup browser. Digunakan untuk menjaga sesi login Anda.

• Persistent Cookies: Tetap tersimpan di perangkat untuk jangka waktu tertentu (biasanya 30 hari hingga 2 tahun) atau sampai Anda menghapusnya secara manual.

Cookie kami umumnya memiliki periode retensi:
- Cookie sesi: sampai browser ditutup
- Cookie preferensi: 1 tahun
- Cookie analitik: 2 tahun
- Cookie pemasaran: 90 hari`,
    },
    {
        id: 'third-party',
        icon: <Globe className="h-5 w-5 text-green-500" />,
        title: 'Cookie Pihak Ketiga',
        content: `Selain cookie kami sendiri (first-party cookies), website kami juga menggunakan cookie dari layanan pihak ketiga:

• Google Analytics: Untuk menganalisis traffic dan perilaku pengguna
• YouTube: Jika Anda menonton video yang disematkan di website kami
• Google reCAPTCHA: Untuk perlindungan dari spam dan bot
• Social Media: Jika Anda menggunakan tombol share ke media sosial

Anda dapat mengunjungi website pihak ketiga tersebut untuk mempelajari lebih lanjut tentang kebijakan cookie mereka.`,
    },
    {
        id: 'manage-cookies',
        icon: <Settings className="h-5 w-5 text-indigo-500" />,
        title: 'Cara Mengelola Cookie',
        content: `Anda memiliki kontrol penuh atas cookie di perangkat Anda:

Melalui Browser:
• Chrome: Settings → Privacy and Security → Cookies
• Firefox: Settings → Privacy & Security → Cookies
• Safari: Preferences → Privacy → Cookies
• Edge: Settings → Privacy → Cookies

Melalui Website Kami:
• Gunakan panel preferensi cookie di atas untuk mengatur jenis cookie yang Anda izinkan

Catatan: Menonaktifkan cookie tertentu mungkin mempengaruhi fungsi website dan pengalaman pengguna Anda.`,
    },
    {
        id: 'data-protection',
        icon: <Lock className="h-5 w-5 text-red-500" />,
        title: 'Perlindungan Data',
        content: `Kami berkomitmen melindungi data yang dikumpulkan melalui cookie:

• Enkripsi: Data sensitif dalam cookie dienkripsi
• Akses Terbatas: Hanya personel yang berwenang yang dapat mengakses data
• Tidak Dijual: Data cookie tidak pernah dijual ke pihak ketiga
• Kepatuhan: Kami mematuhi UU PDP dan regulasi perlindungan data lainnya

Untuk informasi lebih lanjut tentang bagaimana kami melindungi data Anda, silakan baca Kebijakan Privasi kami.`,
    },
]

export default function CookiePolicyPage() {
    const [cookiePreferences, setCookiePreferences] = useState<CookiePreferences>(defaultPreferences)
    const [isLoaded, setIsLoaded] = useState(false)
    const [hasChanges, setHasChanges] = useState(false)

    // Load preferences from cookie on mount
    useEffect(() => {
        const savedConsent = getCookie(COOKIE_CONSENT_NAME)
        if (savedConsent) {
            try {
                const parsed = JSON.parse(savedConsent) as CookiePreferences
                setCookiePreferences({
                    essential: true, // Always true
                    functional: parsed.functional ?? false,
                    analytics: parsed.analytics ?? false,
                    marketing: parsed.marketing ?? false,
                })
            } catch {
                setCookiePreferences(defaultPreferences)
            }
        }
        setIsLoaded(true)
    }, [])

    const handleToggle = (cookieId: string) => {
        if (cookieId === 'essential') return // Cannot toggle essential cookies
        setCookiePreferences(prev => ({
            ...prev,
            [cookieId]: !prev[cookieId as keyof typeof prev],
        }))
        setHasChanges(true)
    }

    const savePreferences = () => {
        setCookie(COOKIE_CONSENT_NAME, JSON.stringify(cookiePreferences), COOKIE_EXPIRY_DAYS)
        setHasChanges(false)
        toast.success('Preferensi cookie berhasil disimpan!', {
            description: 'Pengaturan Anda akan berlaku selama 1 tahun.',
            icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
        })
    }

    const acceptAll = () => {
        const allAccepted: CookiePreferences = {
            essential: true,
            functional: true,
            analytics: true,
            marketing: true,
        }
        setCookiePreferences(allAccepted)
        setCookie(COOKIE_CONSENT_NAME, JSON.stringify(allAccepted), COOKIE_EXPIRY_DAYS)
        setHasChanges(false)
        toast.success('Semua cookie diterima!', {
            description: 'Terima kasih atas kepercayaan Anda.',
            icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
        })
    }

    const rejectAll = () => {
        const onlyEssential: CookiePreferences = {
            essential: true,
            functional: false,
            analytics: false,
            marketing: false,
        }
        setCookiePreferences(onlyEssential)
        setCookie(COOKIE_CONSENT_NAME, JSON.stringify(onlyEssential), COOKIE_EXPIRY_DAYS)
        setHasChanges(false)
        toast.info('Cookie opsional ditolak', {
            description: 'Hanya cookie esensial yang aktif.',
            icon: <Shield className="h-5 w-5 text-blue-500" />,
        })
    }

    if (!isLoaded) {
        return (
            <div className="w-full max-w-4xl mx-auto px-4 py-8">
                <div className="mt-12 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
            {/* Hero Section with Animation */}
            <div className="relative mt-12 mb-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-orange-400/20 to-yellow-400/20 blur-3xl animate-pulse" />
                <Card className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-900/30 dark:via-orange-900/30 dark:to-yellow-900/30 border-amber-200/50 dark:border-amber-700/50 shadow-2xl">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg transform hover:scale-110 transition-all duration-300 hover:rotate-6">
                            <Cookie className="h-10 w-10 text-white animate-bounce" />
                        </div>
                        <CardTitle>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent animate-gradient">
                                Kebijakan Cookie
                            </h1>
                        </CardTitle>
                        <CardDescription className="text-lg mt-2 text-amber-700 dark:text-amber-300">
                            Sistem Informasi RPL Terpadu - Institut Teknologi Indonesia
                        </CardDescription>
                        <div className="flex justify-center gap-2 mt-4">
                            <Badge variant="outline" className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-800 dark:to-orange-800 border-amber-300 dark:border-amber-600">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Terakhir diperbarui: Januari 2026
                            </Badge>
                        </div>
                    </CardHeader>
                </Card>
            </div>

            {/* Introduction Card */}
            <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800 transform hover:scale-[1.02] transition-all duration-300">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl shadow-lg">
                            <Info className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-blue-800 dark:text-blue-200 mb-2 text-lg">
                                Tentang Penggunaan Cookie
                            </p>
                            <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                                Website kami menggunakan cookie dan teknologi serupa untuk meningkatkan pengalaman Anda,
                                menganalisis traffic, dan menyediakan fitur yang Anda minta. Halaman ini menjelaskan
                                jenis cookie yang kami gunakan dan bagaimana Anda dapat mengelolanya.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Cookie Preferences Panel */}
            <Card className="mb-8 overflow-hidden">
                <div className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 p-1">
                    <CardHeader className="bg-white dark:bg-gray-900 rounded-t-lg">
                        <CardTitle className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-violet-400 to-purple-500 rounded-lg">
                                <Settings className="h-5 w-5 text-white animate-spin-slow" />
                            </div>
                            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                                Preferensi Cookie Anda
                            </span>
                            {hasChanges && (
                                <Badge className="bg-amber-500 text-white animate-pulse">
                                    Belum disimpan
                                </Badge>
                            )}
                        </CardTitle>
                        <CardDescription>
                            Kelola persetujuan cookie Anda. Preferensi akan disimpan selama 1 tahun.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="bg-white dark:bg-gray-900 rounded-b-lg pt-2 pb-6">
                        <div className="space-y-4">
                            {cookieTypes.map((cookie, index) => (
                                <div
                                    key={cookie.id}
                                    className={`p-4 rounded-xl ${cookie.bgColor} ${cookie.borderColor} border-2 transform hover:scale-[1.01] transition-all duration-300 hover:shadow-md`}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg bg-gradient-to-br ${cookie.color} shadow-md`}>
                                                <div className="text-white">
                                                    {cookie.icon}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold">{cookie.title}</span>
                                                    {cookie.required && (
                                                        <Badge className="bg-emerald-500 text-white text-xs">
                                                            Wajib
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {cookie.description}
                                                </p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={cookiePreferences[cookie.id as keyof typeof cookiePreferences]}
                                            onCheckedChange={() => handleToggle(cookie.id)}
                                            disabled={cookie.required}
                                            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-emerald-400 data-[state=checked]:to-green-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 mt-6 justify-center">
                            <Button
                                onClick={acceptAll}
                                className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg transform hover:scale-105 transition-all duration-300"
                            >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Terima Semua
                            </Button>
                            <Button
                                onClick={rejectAll}
                                variant="outline"
                                className="border-2 hover:bg-gray-100 dark:hover:bg-gray-800 transform hover:scale-105 transition-all duration-300"
                            >
                                Tolak Opsional
                            </Button>
                            <Button
                                onClick={savePreferences}
                                variant="secondary"
                                className={`bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 hover:from-violet-200 hover:to-purple-200 transform hover:scale-105 transition-all duration-300 ${hasChanges ? 'ring-2 ring-amber-500 ring-offset-2' : ''}`}
                            >
                                <Save className="h-4 w-4 mr-2" />
                                Simpan Preferensi
                            </Button>
                        </div>
                    </CardContent>
                </div>
            </Card>

            {/* Cookie Types Detail */}
            <Card className="mb-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl border-0">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg">
                            <Cookie className="h-5 w-5 text-white" />
                        </div>
                        <span>Detail Jenis Cookie</span>
                    </CardTitle>
                    <CardDescription>
                        Pelajari lebih lanjut tentang setiap jenis cookie yang kami gunakan
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full space-y-3">
                        {cookieTypes.map((cookie, index) => (
                            <AccordionItem
                                key={cookie.id}
                                value={cookie.id}
                                className={`border-2 rounded-xl px-4 ${cookie.bgColor} ${cookie.borderColor} shadow-sm hover:shadow-lg transition-all duration-300`}
                            >
                                <AccordionTrigger className="hover:no-underline py-4">
                                    <div className="flex items-center gap-3">
                                        <span className={`flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br ${cookie.color} text-white text-sm font-semibold shadow-md`}>
                                            {index + 1}
                                        </span>
                                        <div className={`p-1.5 rounded-lg ${cookie.iconBg}`}>
                                            {cookie.icon}
                                        </div>
                                        <span className="font-semibold text-left">
                                            {cookie.title}
                                        </span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-4 pt-2">
                                    <div className="pl-12 text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                                        {cookie.content.split('\n').map((line, i) => {
                                            if (line.startsWith('•')) {
                                                return (
                                                    <p key={i} className="ml-2 mb-1 flex items-start gap-2">
                                                        <span className="text-primary">•</span>
                                                        <span>{line.substring(2)}</span>
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
                </CardContent>
            </Card>

            {/* Information Sections */}
            <Card className="mb-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl border-0">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg">
                            <Info className="h-5 w-5 text-white" />
                        </div>
                        <span>Informasi Tambahan</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full space-y-3">
                        {cookieInfo.map((info, index) => (
                            <AccordionItem
                                key={info.id}
                                value={info.id}
                                className="border rounded-xl px-4 bg-white dark:bg-gray-800/50 shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <AccordionTrigger className="hover:no-underline py-4">
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-white text-sm font-semibold shadow-md">
                                            {index + 1}
                                        </span>
                                        {info.icon}
                                        <span className="font-semibold text-left">
                                            {info.title}
                                        </span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-4 pt-2">
                                    <div className="pl-12 text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                                        {info.content.split('\n').map((line, i) => {
                                            if (line.includes(':') && line.startsWith('•')) {
                                                const [label, ...rest] = line.substring(2).split(':')
                                                return (
                                                    <p key={i} className="ml-2 mb-1">
                                                        • <span className="font-medium text-primary">{label}:</span>{rest.join(':')}
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
                                            if (line.startsWith('-')) {
                                                return (
                                                    <p key={i} className="ml-4 mb-1 text-muted-foreground">
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
                </CardContent>
            </Card>

            {/* Contact Section */}
            <div className="relative overflow-hidden rounded-2xl mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 animate-gradient" />
                <Card className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-primary/20">
                    <CardContent className="p-6">
                        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            Pertanyaan tentang Cookie?
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                            Jika Anda memiliki pertanyaan tentang penggunaan cookie atau kebijakan ini,
                            silakan hubungi kami:
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-purple-500/10 px-4 py-2 rounded-full">
                                <span className="text-muted-foreground">Email:</span>
                                <a href="mailto:pdsi@iti.ac.id" className="text-primary hover:underline font-medium">
                                    pdsi@iti.ac.id
                                </a>
                            </div>
                            <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-4 py-2 rounded-full">
                                <span className="text-muted-foreground">Telepon:</span>
                                <span className="font-medium">(+62) 81360090013</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Legal Notice */}
            <div className="text-center text-xs text-muted-foreground pb-8">
                <p>
                    Kebijakan Cookie ini merupakan bagian dari{' '}
                    <a href="/kebijakan-privasi" className="text-primary hover:underline">
                        Kebijakan Privasi
                    </a>{' '}
                    kami dan tunduk pada Undang-Undang No. 27 Tahun 2022 tentang Perlindungan Data Pribadi.
                </p>
            </div>

            {/* Custom CSS for animations */}
            <style jsx global>{`
                @keyframes gradient {
                    0%, 100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }
                
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 3s ease infinite;
                }
                
                .animate-spin-slow {
                    animation: spin 3s linear infinite;
                }
            `}</style>
        </div>
    )
}
