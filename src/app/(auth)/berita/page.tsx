'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Badge } from '@/components/ui/badge'
import {
    ChevronLeft,
    ChevronRight,
    Search,
    Calendar,
    Clock,
    ArrowUpDown,
    Newspaper,
    Sparkles,
    Eye,
    TrendingUp,
    Filter,
} from 'lucide-react'
import { toast } from 'sonner'
import { Pagination } from '@/types/Pagination'
import { BeritaListItem, BeritaFormatted } from '@/types/BeritaTypes'
import { getBeritaList, formatBeritaForDisplay } from '@/services/BeritaServices'

export default function BeritaPage() {
    const router = useRouter()
    const [beritaList, setBeritaList] = useState<BeritaFormatted[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [searchDebounce, setSearchDebounce] = useState('')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 9,
        totalElement: 0,
        totalPage: 0,
        isFirst: true,
        isLast: true,
        hasNext: false,
        hasPrevious: false,
    })

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchDebounce(search)
            setPagination(prev => ({ ...prev, page: 1 }))
        }, 500)
        return () => clearTimeout(timer)
    }, [search])

    // Fetch data
    useEffect(() => {
        async function fetchBerita() {
            setLoading(true)
            try {
                const response = await getBeritaList({
                    page: pagination.page,
                    limit: pagination.limit,
                    search: searchDebounce,
                    sort: sortOrder,
                    sortBy: 'Waktu',
                })

                const formatted = response.data.map(formatBeritaForDisplay)
                setBeritaList(formatted)
                setPagination({
                    page: response.page,
                    limit: response.limit,
                    totalElement: response.totalElement,
                    totalPage: response.totalPage,
                    isFirst: response.isFirst,
                    isLast: response.isLast,
                    hasNext: response.hasNext,
                    hasPrevious: response.hasPrevious,
                })
            } catch (error) {
                toast.error('Gagal memuat berita')
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        fetchBerita()
    }, [pagination.page, pagination.limit, searchDebounce, sortOrder])

    const handlePageChange = (newPage: number) => {
        setPagination(prev => ({ ...prev, page: newPage }))
    }

    const handleLimitChange = (value: string) => {
        setPagination(prev => ({ ...prev, limit: Number(value), page: 1 }))
    }

    const handleSortChange = (value: string) => {
        setSortOrder(value as 'asc' | 'desc')
        setPagination(prev => ({ ...prev, page: 1 }))
    }

    const navigateToDetail = (id: string) => {
        router.push(`/berita/${id}`)
    }

    return (
        <div className="min-h-screen container mx-auto px-4 md:px-8 mt-24 mb-10">
            {/* Hero Header */}
            <div className="relative overflow-hidden bg-linear-to-br from-primary via-primary/90 to-primary/70 text-white py-12 px-6 mb-8 rounded-2xl">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-150" />
                    <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-bounce delay-300" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                            <Newspaper className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold">Berita & Artikel</h1>
                            <p className="text-white/80 mt-1">Informasi terkini seputar kampus dan akademik</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-6 mt-6">
                        <div className="flex items-center gap-2 text-white/90">
                            <TrendingUp className="h-5 w-5" />
                            <span className="text-sm">{pagination.totalElement} Artikel</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Controls */}
            <Card className="mb-8 border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        {/* Search */}
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Cari berita..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20"
                            />
                        </div>

                        <div className="flex gap-3 w-full md:w-auto">
                            {/* Sort Order */}
                            <Select value={sortOrder} onValueChange={handleSortChange}>
                                <SelectTrigger className="w-[160px] bg-white dark:bg-gray-900">
                                    <ArrowUpDown className="h-4 w-4 mr-2 text-gray-400" />
                                    <SelectValue placeholder="Urutkan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Urutan</SelectLabel>
                                        <SelectItem value="desc">Terbaru</SelectItem>
                                        <SelectItem value="asc">Terlama</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            {/* Limit */}
                            <Select value={String(pagination.limit)} onValueChange={handleLimitChange}>
                                <SelectTrigger className="w-[120px] bg-white dark:bg-gray-900">
                                    <Filter className="h-4 w-4 mr-2 text-gray-400" />
                                    <SelectValue placeholder="Limit" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Per Halaman</SelectLabel>
                                        {[6, 9, 12, 18, 24].map((l) => (
                                            <SelectItem key={l} value={String(l)}>
                                                {l} item
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Content */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: pagination.limit }).map((_, i) => (
                        <Card key={i} className="overflow-hidden">
                            <Skeleton className="h-48 w-full" />
                            <CardContent className="p-4 space-y-3">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-6 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : beritaList.length === 0 ? (
                <Card className="py-16 text-center border-dashed border-2">
                    <CardContent>
                        <Newspaper className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400">
                            Tidak Ada Berita
                        </h3>
                        <p className="text-gray-400 dark:text-gray-500 mt-2">
                            {search ? 'Coba kata kunci pencarian lain' : 'Belum ada berita yang tersedia'}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {beritaList.map((berita, index) => (
                        <Card
                            key={berita.id}
                            className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white dark:bg-gray-800 cursor-pointer"
                            onClick={() => navigateToDetail(berita.id)}
                            style={{
                                animationDelay: `${index * 100}ms`,
                            }}
                        >
                            {/* Image Container */}
                            <div className="relative h-52 overflow-hidden">
                                <img
                                    src={berita.imageUrl}
                                    alt={berita.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800'
                                    }}
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Category Badge */}
                                <div className="absolute top-4 left-4">
                                    <Badge
                                        className={`${berita.categoryColor || 'bg-primary text-white'} shadow-lg backdrop-blur-sm`}
                                    >
                                        {berita.category}
                                    </Badge>
                                </div>

                                {/* Popular Badge */}
                                {berita.isPopular && (
                                    <div className="absolute top-4 right-4">
                                        <Badge className="bg-amber-500 text-white shadow-lg animate-pulse">
                                            <Sparkles className="h-3 w-3 mr-1" />
                                            Populer
                                        </Badge>
                                    </div>
                                )}

                                {/* View Button on Hover */}
                                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                                    <Button
                                        size="sm"
                                        className="bg-white/90 text-gray-800 hover:bg-white shadow-lg"
                                    >
                                        <Eye className="h-4 w-4 mr-1" />
                                        Baca
                                    </Button>
                                </div>
                            </div>

                            {/* Content */}
                            <CardContent className="p-5">
                                {/* Date */}
                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>{berita.dateFormatted}</span>
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                                    {berita.title}
                                </h3>

                                {/* Excerpt */}
                                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                                    {berita.excerpt}
                                </p>

                                {/* Read More Link */}
                                <div className="mt-4 flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all duration-300">
                                    <span>Baca Selengkapnya</span>
                                    <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {!loading && beritaList.length > 0 && (
                <Card className="mt-8 border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <CardContent className="py-4">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            {/* Info */}
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Menampilkan{' '}
                                <span className="font-semibold text-gray-700 dark:text-gray-200">
                                    {pagination.totalElement > 0
                                        ? (pagination.page - 1) * pagination.limit + 1
                                        : 0}
                                </span>
                                {' '}-{' '}
                                <span className="font-semibold text-gray-700 dark:text-gray-200">
                                    {Math.min(pagination.page * pagination.limit, pagination.totalElement)}
                                </span>
                                {' '}dari{' '}
                                <span className="font-semibold text-gray-700 dark:text-gray-200">
                                    {pagination.totalElement}
                                </span>
                                {' '}berita
                            </p>

                            {/* Page Controls */}
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={!pagination.hasPrevious}
                                    className="hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>

                                {/* Page Numbers */}
                                <div className="flex items-center gap-1">
                                    {(() => {
                                        const pages = []
                                        const { page, totalPage } = pagination
                                        const maxVisible = 5

                                        let start = Math.max(1, page - Math.floor(maxVisible / 2))
                                        const end = Math.min(totalPage, start + maxVisible - 1)

                                        if (end - start + 1 < maxVisible) {
                                            start = Math.max(1, end - maxVisible + 1)
                                        }

                                        if (start > 1) {
                                            pages.push(
                                                <Button
                                                    key={1}
                                                    variant={page === 1 ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => handlePageChange(1)}
                                                    className={page === 1 ? 'bg-primary' : ''}
                                                >
                                                    1
                                                </Button>
                                            )
                                            if (start > 2) {
                                                pages.push(<span key="start-ellipsis" className="px-2">...</span>)
                                            }
                                        }

                                        for (let i = start; i <= end; i++) {
                                            if (i === 1 && start > 1) continue
                                            if (i === totalPage && end < totalPage) continue

                                            pages.push(
                                                <Button
                                                    key={i}
                                                    variant={page === i ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => handlePageChange(i)}
                                                    className={page === i ? 'bg-primary' : ''}
                                                >
                                                    {i}
                                                </Button>
                                            )
                                        }

                                        if (end < totalPage) {
                                            if (end < totalPage - 1) {
                                                pages.push(<span key="end-ellipsis" className="px-2">...</span>)
                                            }
                                            pages.push(
                                                <Button
                                                    key={totalPage}
                                                    variant={page === totalPage ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => handlePageChange(totalPage)}
                                                    className={page === totalPage ? 'bg-primary' : ''}
                                                >
                                                    {totalPage}
                                                </Button>
                                            )
                                        }

                                        return pages
                                    })()}
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={!pagination.hasNext}
                                    className="hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
