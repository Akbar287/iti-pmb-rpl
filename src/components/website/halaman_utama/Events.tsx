'use client'
import { Button } from '@/components/ui/button'
import { JenisKegiatan } from '@/generated/prisma'
import { convertKegiatan } from '@/lib/utils'
import { SettingKegiatanTypes } from '@/types/WebsiteTypes'
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
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

    return (
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
                                            className="font-bold text-gray-700 dark:text-gray-200 border-primary hover:bg-primary hover:text-white"
                                        >
                                            Cek Selengkapnya
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-12 text-center">
                    <Button className="text-white transition-all duration-300 group bg-primary hover:bg-primary/80 active:bg-primary/50 hover:underline">
                        <span className="flex items-center">
                            Lihat Semua Event
                            <ChevronRight className="w-4 h-4 ml-1 transition-transform duration-300 transform group-hover:translate-x-1" />
                        </span>
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default Events
