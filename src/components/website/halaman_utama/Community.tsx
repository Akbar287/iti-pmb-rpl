"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { QuoteIcon, X } from "lucide-react";

const Community = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<{
    id: number;
    src: string;
    alt: string;
    caption: string;
  } | null>(null);

  const photos = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      alt: "Mahasiswa belajar di perpustakaan",
      caption:
        "Perpustakaan kami adalah tempat yang tenang untuk belajar dan penelitian",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      alt: "Mahasiswa merayakan kelulusan",
      caption:
        "Perayaan kelulusan adalah momen yang penuh kebahagiaan dan pencapaian",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      alt: "Mahasiswa dalam seminar kecil",
      caption: "Diskusi seminar kecil mendorong kolaborasi dan inovasi",
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      alt: "Kampus dengan arsitektur bersejarah",
      caption:
        "Kampus kami memiliki arsitektur yang indah dan bersejarah, menciptakan suasana belajar yang unik",
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
      alt: "Mahasiswa berolahraga di lapangan",
      caption:
        "Kesehatan dan kebugaran adalah bagian penting dari kehidupan mahasiswa kami",
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
      alt: "Mahasiswa dari berbagai budaya",
      caption:
        "Kehidupan kampus kami kaya akan keragaman budaya, menciptakan lingkungan yang inklusif dan mendukung",
    },
  ];

  const testimonials = [
    {
      quote:
        "Waktu saya di ITI adalah pengalaman yang mengubah hidup. Saya tidak hanya belajar dari para ahli di bidang saya, tetapi juga bertemu dengan teman seumur hidup dari seluruh dunia.",
      name: "Akbar Alamsyah",
      position: "Arsitektur, 2019",
      image: "https://randomuser.me/api/portraits/women/45.jpg",
    },
    {
      quote:
        "ITI memberikan saya kesempatan untuk mengeksplorasi minat saya di luar kurikulum akademis. Saya terlibat dalam berbagai organisasi mahasiswa yang memperkaya pengalaman saya.",
      name: "Diana Putri",
      position: "Teknik Elektro, 2020",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      quote:
        "Penelitian yang dilakukan di ITI sangat inovatif dan berdampak. Saya merasa terhormat dapat berkontribusi pada proyek yang memiliki potensi untuk mengubah dunia.",
      name: "Maulana Hakiem",
      position: "Teknik Informatika, 2021",
      image: "https://randomuser.me/api/portraits/women/64.jpg",
    },
  ];

  return (
    <section id="community" className="container-padding container mx-auto">
      <div className="text-center mb-16">
        <h2 className="section-title mx-auto text-center">
          Kenalan dengan Komunitas
          <span className="block mx-auto mt-2 w-24 h-1 bg-primary"></span>
        </h2>
        <p className="section-subtitle mx-auto">
          Anda dapat menemukan lingkungan yang mendukung dan mendorong
          pertumbuhan pribadi dan akademis.
        </p>
      </div>

      {/* Photo Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative overflow-hidden rounded-lg cursor-pointer group"
            onClick={() => setSelectedPhoto(photo)}
          >
            <img
              src={photo.src}
              alt={photo.alt}
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
              <p className="text-white p-4 text-sm">{photo.caption}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Photo Dialog */}
      <Dialog
        open={!!selectedPhoto}
        onOpenChange={(open) => !open && setSelectedPhoto(null)}
      >
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-transparent border-none">
          <div className="relative">
            <img
              src={selectedPhoto?.src}
              alt={selectedPhoto?.alt}
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
            <DialogClose className="absolute top-2 right-2 bg-black/50 rounded-full p-1 text-white hover:bg-black/70">
              <X className="h-6 w-6" />
            </DialogClose>
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 text-white">
              <p className="text-lg">{selectedPhoto?.caption}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="mt-20">
        <h3 className="text-2xl font-bold text-center mb-12">
          Apa Kata Mereka ?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border-t-4 border-primary"
            >
              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <QuoteIcon className="w-10 h-10 text-primary/60" />
                </div>
                <p className="italic mb-6 flex-grow">{testimonial.quote}</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <p className="font-bold text-gray-700 dark:text-gray-200">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-200">
                      {testimonial.position}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Community;
