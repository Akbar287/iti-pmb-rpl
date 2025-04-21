"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

const Events = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const eventCategories = [
    { name: "Akademik", color: "bg-blue-100 text-blue-800" },
    { name: "Budaya", color: "bg-purple-100 text-purple-800" },
    { name: "Atletik", color: "bg-green-100 text-green-800" },
    { name: "Komunitas", color: "bg-orange-100 text-orange-800" },
    { name: "Karir", color: "bg-pink-100 text-pink-800" },
  ];

  const events = [
    {
      id: 1,
      title: "Simposium Penelitian Tahunan",
      date: "15 April 2025",
      time: "09:00 - 17:00",
      location: "Auditorium Utama",
      category: "Akademik",
      description:
        "Bergabunglah dengan kami untuk simposium tahunan yang menampilkan penelitian terbaru dari mahasiswa dan fakultas di berbagai bidang.",
    },
    {
      id: 2,
      title: "Festival Budaya Internasional",
      date: "20 April 2025",
      time: "11:00 - 20:00",
      location: "Kampus Utama",
      category: "Budaya",
      description:
        "Nikmati makanan, musik, dan tarian dari seluruh dunia di festival tahunan kami yang merayakan keragaman budaya komunitas kita.",
    },
    {
      id: 3,
      title: "Konser Orkestra Universitas",
      date: "25 April 2025",
      time: "19:30",
      location: "Teater Seni",
      category: "Budaya",
      description:
        "Saksikan penampilan luar biasa dari orkestra universitas kami, menampilkan karya-karya klasik dan kontemporer.",
    },
    {
      id: 4,
      title: "Turnamen Sepak Bola Antar Fakultas",
      date: "27 April 2025",
      time: "10:00 - 16:00",
      location: "Lapangan Olahraga Utama",
      category: "Atletik",
      description:
        "Bergabunglah dengan kami untuk turnamen sepak bola tahunan antar fakultas. Tim terbaik akan bersaing untuk mendapatkan gelar juara.",
    },
  ];

  const navigateMonth = (direction: number) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const getCategoryStyle = (category: string) => {
    const categoryObj = eventCategories.find((cat) => cat.name === category);
    return categoryObj ? categoryObj.color : "bg-gray-100 text-gray-800";
  };

  return (
    <section id="events" className=" py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title mx-auto text-center">
            Kegiatan dan Event
            <span className="block mx-auto mt-2 w-24 h-1 bg-primary"></span>
          </h2>
          <p className="section-subtitle mx-auto">
            Tetap terhubung dengan kegiatan dan acara terbaru di ITI. Kami
            memiliki berbagai acara yang dirancang untuk memperkaya pengalaman
            akademis dan sosial Anda.
          </p>
        </div>

        {/* Calendar Navigation */}
        <div className="flex justify-between items-center mb-8">
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
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth(1)}
              className="rounded-full hover:text-white hover:bg-primary active:bg-primary/50"
            >
              <ChevronRight className="h-4 w-4" />
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

        {/* Events List */}
        <div className="space-y-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-100 dark:border-gray-600 hover:shadow-lg transition-shadow"
            >
              <div className="p-6 flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4 flex items-center space-x-3">
                  <div className="bg-primary/30 p-3 rounded-full">
                    <CalendarIcon className="h-6 w-6 text-primary" />
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
                  <div className="flex flex-wrap justify-between items-start mb-2">
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
                  <p className="text-sm text-gray-700 dark:text-gray-200 mb-2">
                    <span className="font-medium">Lokasi:</span>{" "}
                    {event.location}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-200 mb-4">
                    {event.description}
                  </p>
                  <Button
                    variant="outline"
                    className="text-gray-700 dark:text-gray-200 font-bold border-primary hover:bg-primary hover:text-white"
                  >
                    Cek Selengkapnya
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="group bg-primary hover:bg-primary/80 active:bg-primary/50 text-white hover:underline transition-all duration-300">
            <span className="flex items-center">
              Lihat Semua Event
              <ChevronRight className="h-4 w-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Events;
