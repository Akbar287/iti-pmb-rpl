"use client";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const News = () => {
  const newsArticles = [
    {
      id: 1,
      title:
        "Peneliti ITI Mengembangkan Metode Penyimpanan Energi Revolusioner",
      date: "2 April 2025",
      category: "Penelitian",
      excerpt:
        "Tim peneliti dari ITI telah berhasil mengembangkan metode penyimpanan energi baru yang dapat meningkatkan efisiensi energi terbarukan hingga 50%. Penemuan ini diharapkan dapat mengurangi ketergantungan pada bahan bakar fosil.",
      image:
        "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    },
    {
      id: 2,
      title:
        "Institut Menjalin Kemitraan Internasional untuk Penanganan Perubahan Iklim",
      date: "28 Maret 2025",
      category: "Berita Kampus",
      excerpt:
        "Institut Teknologi Indonesia (ITI) telah menjalin kemitraan dengan beberapa universitas terkemuka di dunia untuk melakukan penelitian bersama dalam bidang perubahan iklim. Kerjasama ini bertujuan untuk mengembangkan solusi inovatif dalam menghadapi tantangan lingkungan global.",
      image:
        "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    },
    {
      id: 3,
      title: "Alumni ITI Menerima Penghargaan Nobel dalam Fisika",
      date: "22 Maret 2025",
      category: "Alumni",
      excerpt:
        "Alumni ITI, Dr. Rina Sari, telah menerima penghargaan Nobel dalam bidang fisika atas penelitiannya yang inovatif dalam teknologi kuantum. Penghargaan ini merupakan pengakuan atas kontribusinya yang signifikan terhadap ilmu pengetahuan.",
      image:
        "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    },
  ];

  const featuredStory = {
    title: "ITI menegaskan 40 Tahun Sejarah Pendidikan dan Penelitian",
    excerpt:
      "Tahun ini menandai 40 tahun berdirinya Institut Teknologi Indonesia (ITI). Dalam perjalanan panjang ini, ITI telah berkomitmen untuk memberikan pendidikan berkualitas tinggi dan melakukan penelitian inovatif yang berdampak pada masyarakat.",
    image:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  };

  return (
    <section id="news" className="container-padding container mx-auto">
      <div className="text-center mb-16">
        <h2 className="section-title mx-auto text-center">
          Berita
          <span className="block mx-auto mt-2 w-24 h-1 bg-primary"></span>
        </h2>
        <p className="section-subtitle mx-auto">
          Tetap terhubung dengan berita terbaru dari ITI. Kami memiliki berbagai
          berita yang dirancang untuk memperkaya pengalaman akademis dan sosial
          Anda.
        </p>
      </div>

      <div className="mb-16">
        <div className="relative rounded-lg overflow-hidden">
          <img
            src={featuredStory.image}
            alt="Featured story"
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
            <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full md:w-3/4">
              <span className="bg-primary text-white/80 text-xs font-bold px-2.5 py-1 rounded mb-4 inline-block">
                BERITA UTAMA
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                {featuredStory.title}
              </h3>
              <p className="text-white/90 mb-4 hidden md:block">
                {featuredStory.excerpt}
              </p>
              <Button className="group bg-white hover:bg-gray-100 text-primary hover:underline transition-all duration-300">
                <span className="flex items-center">
                  Baca Selengkapnya
                  <ChevronRight className="h-4 w-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {newsArticles.map((article) => (
          <div
            key={article.id}
            className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          >
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-700 dark:text-gray-200 text-sm font-medium">
                  {article.category}
                </span>
                <span className="text-gray-700 dark:text-gray-200 text-sm">
                  {article.date}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 line-clamp-2 text-gray-700 dark:text-gray-200">
                {article.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-200 mb-4 line-clamp-3">
                {article.excerpt}
              </p>
              <Button
                variant={"link"}
                className="group hover:underline text-gray-800 dark:text-gray-200 transition-all duration-300"
              >
                <span className="flex items-center">
                  Baca Selengkapnya
                  <ChevronRight className="h-4 w-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Button className="group bg-primary hover:bg-primary/80 active:bg-primary/50 text-white hover:underline transition-all duration-300">
          <span className="flex items-center">
            Baca Selengkapnya
            <ChevronRight className="h-4 w-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Button>
      </div>
    </section>
  );
};

export default News;
