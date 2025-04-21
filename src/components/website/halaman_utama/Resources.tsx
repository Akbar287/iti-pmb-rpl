"use client";
import {
  FileText,
  BookOpen,
  Video,
  Download,
  Calendar,
  Link,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Resources = () => {
  const resourceCategories = [
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Publikasi Penelitian",
      description:
        "Akses jurnal, artikel, dan publikasi penelitian terbaru dari ITI.",
      resources: [
        { title: "Penelitian Annual 2025", link: "#", type: "PDF" },
        { title: "Jurnal Sains ITI", link: "#", type: "Link" },
        { title: "Basis Data Publikasi", link: "#", type: "Database" },
      ],
    },
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: "Sumber Daya Perpustakaan",
      description:
        "Jelajahi koleksi buku, jurnal, dan sumber daya lainnya yang tersedia di perpustakaan kami.",
      resources: [
        { title: "Cari Katalog", link: "#", type: "Tool" },
        { title: "Koleksi Manuscript", link: "#", type: "Archive" },
        { title: "Koleksi E-Book", link: "#", type: "Database" },
      ],
    },
    {
      icon: <Video className="h-8 w-8 text-primary" />,
      title: "Multimedia & Video",
      description:
        "Tonton kuliah, seminar, dan video lainnya yang menampilkan pemikir terkemuka di bidangnya.",
      resources: [
        { title: "Seri Pembelajaran", link: "#", type: "Video" },
        { title: "Podcast ITI", link: "#", type: "Audio" },
        { title: "Tur Virtual ITI", link: "#", type: "Interactive" },
      ],
    },
    {
      icon: <Download className="h-8 w-8 text-primary" />,
      title: "Sumber Daya Akademik",
      description:
        "Temukan informasi penting tentang program akademik, kurikulum, dan kebijakan universitas.",
      resources: [
        { title: "Kalendar Akademik 2024-2025", link: "#", type: "PDF" },
        { title: "Buku Catatan Mahasiswa", link: "#", type: "PDF" },
        { title: "Informasi Beasiswa", link: "#", type: "Link" },
      ],
    },
    {
      icon: <Calendar className="h-8 w-8 text-primary" />,
      title: "Webinar & Acara",
      description:
        "Ikuti acara mendatang dan akses rekaman dari webinar dan konferensi sebelumnya.",
      resources: [
        { title: "Jadwal Webinar", link: "#", type: "Calendar" },
        { title: "Archive Acara", link: "#", type: "Archive" },
        { title: "Bahan Softfile Konferensi", link: "#", type: "ZIP" },
      ],
    },
    {
      icon: <Link className="h-8 w-8 text-primary" />,
      title: "Jaringan Mitra Penelitian",
      description:
        "Jelajahi kolaborasi dan kemitraan dengan institusi dan organisasi lain di seluruh dunia.",
      resources: [
        { title: "Jaringan Peneliti Partner", link: "#", type: "Link" },
        { title: "Program Pertukaran Global", link: "#", type: "Link" },
        { title: "Portal Kolaborasi Industri", link: "#", type: "Portal" },
      ],
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return <FileText className="h-4 w-4" />;
      case "Video":
        return <Video className="h-4 w-4" />;
      case "Link":
        return <Link className="h-4 w-4" />;
      case "Archive":
        return <BookOpen className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <section id="resources" className=" py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title mx-auto text-center">
            Resources
            <span className="block mx-auto mt-2 w-24 h-1 bg-primary"></span>
          </h2>
          <p className="section-subtitle mx-auto">
            Temukan publikasi, multimedia, dan informasi penting lainnya yang
            dapat membantu Anda dalam perjalanan akademis Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resourceCategories.map((category, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-600 rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  {category.icon}
                  <h3 className="text-xl font-bold ml-3 text-primary">
                    {category.title}
                  </h3>
                </div>
                <p className="text-gray-700 dark:text-gray-200 mb-6">
                  {category.description}
                </p>

                <div className="space-y-3">
                  {category.resources.map((resource, i) => (
                    <a
                      key={i}
                      href={resource.link}
                      className="flex items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="text-gray-700 dark:text-gray-200 mr-3">
                        {getTypeIcon(resource.type)}
                      </span>
                      <span className="flex-grow">{resource.title}</span>
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                        {resource.type}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-6 text-center">
            Cari Sumber Daya
            <span className="block mx-auto mt-2 w-16 h-1 bg-primary"></span>
          </h3>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Masukan Kata Kunci ... "
              className="flex-grow rounded-md border-gray-300 focus:border-primary ring-gray-300 focus:ring focus:ring-primary/20 focus:ring-opacity-50 transition-all duration-100 py-3 px-4"
            />
            <Button className="bg-primary h-full hover:bg-gray-700 font-bold text-white py-3">
              <Search className="" />
              Cari
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resources;
