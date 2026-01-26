'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { use } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
    ArrowLeft,
    Calendar,
    Clock,
    Share2,
    Bookmark,
    Heart,
    Eye,
    Sparkles,
    User,
    Tag,
    ChevronRight,
    Newspaper,
    Copy,
    Check,
} from 'lucide-react'
import { toast } from 'sonner'
import { BeritaDetail } from '@/types/BeritaTypes'
import { getBeritaById } from '@/services/BeritaServices'

export default function BeritaDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const [berita, setBerita] = useState<BeritaDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [copied, setCopied] = useState(false)
    const [liked, setLiked] = useState(false)
    const [bookmarked, setBookmarked] = useState(false)

    useEffect(() => {
        async function fetchBerita() {
            setLoading(true)
            try {
                const data = await getBeritaById(id)
                setBerita(data)
            } catch (error) {
                toast.error('Gagal memuat detail berita')
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchBerita()
        }
    }, [id])

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
    }

    const formatTime = (date: Date | string) => {
        return new Date(date).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const handleShare = async () => {
        const url = window.location.href
        if (navigator.share) {
            try {
                await navigator.share({
                    title: berita?.Title,
                    text: berita?.Deskripsi.substring(0, 100),
                    url,
                })
            } catch (err) {
                copyToClipboard(url)
            }
        } else {
            copyToClipboard(url)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        toast.success('Link berhasil disalin!')
        setTimeout(() => setCopied(false), 2000)
    }

    const handleLike = () => {
        setLiked(!liked)
        toast.success(liked ? 'Batal menyukai' : 'Berita disukai!')
    }

    const handleBookmark = () => {
        setBookmarked(!bookmarked)
        toast.success(bookmarked ? 'Batal menyimpan' : 'Berita disimpan!')
    }

    const getImageUrl = () => {
        if (berita?.Gambar) {
            return `data:image/jpeg;base64,${berita.Gambar}`
        }
        return `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/img?_t=_b&_id=${id}`
    }

    if (loading) {
        return (
            <div className="min-h-screen container mx-auto px-4 md:px-8 mt-24 mb-10">
                <Skeleton className="h-8 w-32 mb-6" />
                <Skeleton className="h-[400px] w-full rounded-2xl mb-8" />
                <div className="max-w-4xl mx-auto space-y-4">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-40 w-full" />
                </div>
            </div>
        )
    }

    if (!berita) {
        return (
            <div className="min-h-screen container mx-auto px-4 md:px-8 mt-24 mb-10">
                <Card className="py-16 text-center border-dashed border-2">
                    <CardContent>
                        <Newspaper className="h-20 w-20 mx-auto text-gray-300 dark:text-gray-600 mb-6" />
                        <h2 className="text-2xl font-bold text-gray-500 dark:text-gray-400 mb-2">
                            Berita Tidak Ditemukan
                        </h2>
                        <p className="text-gray-400 dark:text-gray-500 mb-6">
                            Berita yang Anda cari tidak tersedia atau telah dihapus
                        </p>
                        <Button onClick={() => router.push('/berita')} className="bg-primary">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali ke Daftar Berita
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen container mx-auto px-4 md:px-8 mt-24 mb-10">
            {/* Back Button */}
            <Button
                variant="ghost"
                onClick={() => router.push('/berita')}
                className="mb-6 hover:bg-primary/10 group"
            >
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                Kembali
            </Button>

            {/* Hero Image */}
            <div className="relative overflow-hidden rounded-3xl mb-8 shadow-2xl group">
                <div className="aspect-21/9 w-full">
                    <img
                        src={getImageUrl()}
                        alt={berita.Title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200'
                        }}
                    />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                {/* Badges */}
                <div className="absolute top-6 left-6 flex gap-3">
                    <Badge className={`${berita.KategoriBerita.Color || 'bg-primary text-white'} shadow-lg backdrop-blur-sm text-sm px-4 py-1`}>
                        <Tag className="h-3 w-3 mr-1" />
                        {berita.KategoriBerita.Nama}
                    </Badge>
                    {berita.Populer && (
                        <Badge className="bg-amber-500 text-white shadow-lg animate-pulse">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Populer
                        </Badge>
                    )}
                </div>

                {/* Title on Image */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-lg">
                        {berita.Title}
                    </h1>
                </div>
            </div>

            {/* Content Container */}
            <div className="max-w-4xl mx-auto">
                {/* Meta Info Card */}
                <Card className="mb-8 border-0 shadow-lg bg-linear-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            {/* Date & Time */}
                            <div className="flex flex-wrap items-center gap-6">
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Calendar className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Tanggal</p>
                                        <p className="font-semibold">{formatDate(berita.Waktu)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <Clock className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Waktu</p>
                                        <p className="font-semibold">{formatTime(berita.Waktu)} WIB</p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleLike}
                                    className={`rounded-full transition-all duration-300 ${liked ? 'bg-red-50 border-red-200 text-red-500' : 'hover:bg-red-50 hover:border-red-200 hover:text-red-500'}`}
                                >
                                    <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleBookmark}
                                    className={`rounded-full transition-all duration-300 ${bookmarked ? 'bg-amber-50 border-amber-200 text-amber-500' : 'hover:bg-amber-50 hover:border-amber-200 hover:text-amber-500'}`}
                                >
                                    <Bookmark className={`h-5 w-5 ${bookmarked ? 'fill-current' : ''}`} />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleShare}
                                    className="rounded-full hover:bg-primary/10 hover:border-primary hover:text-primary transition-all duration-300"
                                >
                                    {copied ? <Check className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Article Content */}
                <Card className="mb-8 border-0 shadow-lg overflow-hidden">
                    <CardContent className="p-8 md:p-12">
                        <article className="prose prose-lg dark:prose-invert max-w-none">
                            <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
                                {berita.Deskripsi}
                            </div>
                        </article>
                    </CardContent>
                </Card>

                {/* Footer Actions */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={() => router.push('/berita')}
                        className="w-full sm:w-auto group hover:bg-primary hover:text-white transition-all duration-300"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                        Lihat Berita Lainnya
                    </Button>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={handleShare}
                            className="group hover:bg-primary hover:text-white transition-all duration-300"
                        >
                            <Share2 className="h-4 w-4 mr-2" />
                            Bagikan
                        </Button>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="relative mt-12 py-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-white dark:bg-gray-900 px-4 text-sm text-gray-500">
                            ✨ Terima kasih telah membaca ✨
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
