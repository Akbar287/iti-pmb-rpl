'use client'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { JenisKegiatan } from '@/generated/prisma'
import { convertKegiatan } from '@/lib/utils'
import { SettingKegiatanTypes } from '@/types/WebsiteTypes'
import {
    CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Clock,
    MapPin,
    Tag,
    Sparkles,
    PartyPopper,
    Users,
    X,
} from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

type OutputItem = {
    id: string
    title: string
    date: string
    time: string
    location: string
    category: string
    description: string
}

const Events = ({
    SettingMainPageId,
    jenisKegiatan,
}: {
    jenisKegiatan: JenisKegiatan[] | null
    SettingMainPageId: string | null
}) => {
    const [currentMonth, setCurrentMonth] = React.useState(
        new Date().getMonth()
    )
    const [currentYear, setCurrentYear] = React.useState(
        new Date().getFullYear()
    )
    const [events, setEvents] = React.useState<OutputItem[]>([])
    const [selectedEvent, setSelectedEvent] = React.useState<OutputItem | null>(null)
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)

    const months = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember',
    ]

    const eventCategories = jenisKegiatan
        ? jenisKegiatan.map((x) => ({
            name: x.Nama,
            color: x.Color,
        }))
        : [
            { name: 'Akademik', color: 'bg-blue-100 text-blue-800' },
            { name: 'Budaya', color: 'bg-purple-100 text-purple-800' },
            { name: 'Atletik', color: 'bg-green-100 text-green-800' },
            { name: 'Komunitas', color: 'bg-orange-100 text-orange-800' },
            { name: 'Karir', color: 'bg-pink-100 text-pink-800' },
        ]

    React.useEffect(() => {
        async function getAllData() {
            await fetch(
                process.env.NEXT_PUBLIC_API_BASE_URL +
                '/api/img?_t=_k&_cm=' +
                currentMonth +
                '&_cy=' +
                currentYear
            )
                .then(async (res) => {
                    const response: SettingKegiatanTypes[] = await res.json()
                    setEvents(convertKegiatan(response))
                })
                .catch((err) => {
                    toast('Ada Masalah pada jaringan')
                })
        }
        getAllData()
    }, [currentMonth, currentYear])

    const navigateMonth = (direction: number) => {
        let newMonth = currentMonth + direction
        let newYear = currentYear

        if (newMonth > 11) {
            newMonth = 0
            newYear += 1
        } else if (newMonth < 0) {
            newMonth = 11
            newYear -= 1
        }

        setCurrentMonth(newMonth)
        setCurrentYear(newYear)
    }

    const getCategoryStyle = (category: string) => {
        const categoryObj = eventCategories.find((cat) => cat.name === category)
        return categoryObj ? categoryObj.color : 'bg-gray-100 text-gray-800'
    }

    const getCategoryGradient = (category: string) => {
        const gradients: Record<string, string> = {
            'Akademik': 'from-blue-500 to-indigo-600',
            'Budaya': 'from-purple-500 to-pink-600',
            'Atletik': 'from-green-500 to-emerald-600',
            'Komunitas': 'from-orange-500 to-amber-600',
            'Karir': 'from-pink-500 to-rose-600',
        }
        return gradients[category] || 'from-primary to-primary/80'
    }

    const getCategoryIcon = (category: string) => {
        const icons: Record<string, React.ReactNode> = {
            'Akademik': <Sparkles className="h-6 w-6" />,
            'Budaya': <PartyPopper className="h-6 w-6" />,
            'Atletik': <Users className="h-6 w-6" />,
            'Komunitas': <Users className="h-6 w-6" />,
            'Karir': <Sparkles className="h-6 w-6" />,
        }
        return icons[category] || <CalendarIcon className="h-6 w-6" />
    }

    const openEventDetail = (event: OutputItem) => {
        setSelectedEvent(event)
        setIsDialogOpen(true)
    }

    return (
        <>
            <section id="events" className="px-4 py-20 ">
                <div className="container mx-auto">
                    <div className="mb-16 text-center">
                        <h2 className="mx-auto text-center section-title">
                            Kegiatan dan Event
                            <span className="block w-24 h-1 mx-auto mt-2 bg-primary"></span>
                        </h2>
                        <p className="mx-auto section-subtitle">
                            Tetap terhubung dengan kegiatan dan acara terbaru di
                            ITI. Kami memiliki berbagai acara yang dirancang untuk
                            memperkaya pengalaman akademis dan sosial Anda.
                        </p>
                    </div>

                    {/* Calendar Navigation */}
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold">
                            {months[currentMonth]} {currentYear}
                        </h3>
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => navigateMonth(-1)}
                                className="rounded-full hover:text-white hover:bg-primary active:bg-primary/50"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => navigateMonth(1)}
                                className="rounded-full hover:text-white hover:bg-primary active:bg-primary/50"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Event Categories */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {eventCategories.map((category, index) => (
                            <span
                                key={index}
                                className={`${category.color} text-xs font-medium px-2.5 py-0.5 rounded`}
                            >
                                {category.name}
                            </span>
                        ))}
                    </div>

                    <div className="space-y-6">
                        {events.length === 0 ? (
                            <div className="flex justify-center items-center">
                                <h2 className="font-bold text-4xl text-primary mt-5">
                                    Tidak Ada Event
                                </h2>
                            </div>
                        ) : (
                            events.map((event) => (
                                <div
                                    key={event.id}
                                    className="overflow-hidden transition-shadow bg-white border border-gray-100 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-600 hover:shadow-lg"
                                >
                                    <div className="flex flex-col gap-6 p-6 md:flex-row">
                                        <div className="flex items-center space-x-3 md:w-1/4">
                                            <div className="p-3 rounded-full bg-primary/30">
                                                <CalendarIcon className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-700 dark:text-gray-200">
                                                    {event.date}
                                                </p>
                                                <p className="text-sm text-gray-700 dark:text-gray-200">
                                                    {event.time}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="md:w-3/4">
                                            <div className="flex flex-wrap items-start justify-between mb-2">
                                                <h4 className="text-xl font-bold text-primary">
                                                    {event.title}
                                                </h4>
                                                <span
                                                    className={`${getCategoryStyle(
                                                        event.category
                                                    )} text-xs font-medium px-2.5 py-0.5 rounded`}
                                                >
                                                    {event.category}
                                                </span>
                                            </div>
                                            <p className="mb-2 text-sm text-gray-700 dark:text-gray-200">
                                                <span className="font-medium">
                                                    Lokasi:
                                                </span>{' '}
                                                {event.location}
                                            </p>
                                            <p className="mb-4 text-sm text-gray-700 dark:text-gray-200">
                                                {event.description}
                                            </p>
                                            <Button
                                                variant="outline"
                                                className="font-bold text-gray-700 dark:text-gray-200 border-primary hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105"
                                                onClick={() => openEventDetail(event)}
                                            >
                                                Cek Selengkapnya
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Event Detail Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-0 shadow-2xl">
                    {selectedEvent && (
                        <>
                            {/* Gradient Header */}
                            <div className={`relative bg-linear-to-r ${getCategoryGradient(selectedEvent.category)} p-6 pb-12`}>
                                {/* Animated Background Shapes */}
                                <div className="absolute inset-0 overflow-hidden">
                                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse" />
                                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse delay-150" />
                                    <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white/5 rounded-full blur-xl animate-bounce" />
                                </div>

                                {/* Category Icon */}
                                <div className="relative flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg animate-bounce">
                                        <div className="text-white">
                                            {getCategoryIcon(selectedEvent.category)}
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 text-sm font-semibold text-white bg-white/20 backdrop-blur-sm rounded-full">
                                        {selectedEvent.category}
                                    </span>
                                </div>

                                {/* Title */}
                                <DialogHeader className="relative">
                                    <DialogTitle className="text-2xl md:text-3xl font-bold text-white leading-tight">
                                        {selectedEvent.title}
                                    </DialogTitle>
                                </DialogHeader>
                            </div>

                            {/* Content */}
                            <div className="relative -mt-6">
                                <div className="bg-white dark:bg-gray-900 rounded-t-3xl p-6 space-y-5">
                                    {/* Info Cards */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Date Card */}
                                        <div className="group p-4 bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800 transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-linear-to-br from-amber-400 to-orange-500 rounded-lg shadow-md group-hover:animate-pulse">
                                                    <CalendarIcon className="h-5 w-5 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Tanggal</p>
                                                    <p className="font-bold text-gray-800 dark:text-gray-200">{selectedEvent.date}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Time Card */}
                                        <div className="group p-4 bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-linear-to-br from-blue-400 to-indigo-500 rounded-lg shadow-md group-hover:animate-pulse">
                                                    <Clock className="h-5 w-5 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Waktu</p>
                                                    <p className="font-bold text-gray-800 dark:text-gray-200">{selectedEvent.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location Card */}
                                    <div className="group p-4 bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800 transform hover:scale-[1.02] transition-all duration-300 hover:shadow-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-linear-to-br from-emerald-400 to-teal-500 rounded-lg shadow-md group-hover:animate-bounce">
                                                <MapPin className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Lokasi</p>
                                                <p className="font-bold text-gray-800 dark:text-gray-200">{selectedEvent.location}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                            <Tag className="h-4 w-4" />
                                            <span className="text-sm font-semibold">Deskripsi</span>
                                        </div>
                                        <DialogDescription className="text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                                            {selectedEvent.description}
                                        </DialogDescription>
                                    </div>

                                    {/* Action Button */}
                                    <div className="pt-2">
                                        <Button
                                            onClick={() => setIsDialogOpen(false)}
                                            className={`w-full bg-linear-to-r ${getCategoryGradient(selectedEvent.category)} hover:opacity-90 text-white font-bold py-3 rounded-xl shadow-lg transform hover:scale-[1.02] transition-all duration-300`}
                                        >
                                            <span className="flex items-center justify-center gap-2">
                                                <Sparkles className="h-5 w-5 animate-pulse" />
                                                Tutup
                                            </span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Events
