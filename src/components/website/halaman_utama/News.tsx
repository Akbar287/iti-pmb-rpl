'use client'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'

const News = ({
    data,
    text,
}: {
    text: {
        BeritaText: string
        BeritaDeskripsi: string
    } | null
    data:
        | {
              SettingBeritaId: string
              SettingMainPageId: string
              Title: string
              Deskripsi: string
              KategoriBerita: {
                  Nama: string
              }
              Populer: boolean
              Waktu: Date
          }[]
        | null
}) => {
    const newsArticles = data
        ? data
              .filter((y) => !y.Populer)
              .map((x) => ({
                  id: x.SettingBeritaId,
                  title: x.Title,
                  date: new Date(x.Waktu).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                  }),
                  category: x.KategoriBerita.Nama,
                  excerpt:
                      x.Deskripsi.length > 100
                          ? x.Deskripsi.substring(0, 100) + '...'
                          : x.Deskripsi,
                  image:
                      process.env.NEXT_PUBLIC_API_BASE_URL +
                      `/api/img?_t=_b&_id=${x.SettingBeritaId}`,
              }))
        : [
              {
                  id: 1,
                  title: 'Peneliti ITI Mengembangkan Metode Penyimpanan Energi Revolusioner',
                  date: '2 April 2025',
                  category: 'Penelitian',
                  excerpt:
                      'Tim peneliti dari ITI telah berhasil mengembangkan metode penyimpanan energi baru yang dapat meningkatkan efisiensi energi terbarukan hingga 50%. Penemuan ini diharapkan dapat mengurangi ketergantungan pada bahan bakar fosil.',
                  image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
              },
              {
                  id: 2,
                  title: 'Institut Menjalin Kemitraan Internasional untuk Penanganan Perubahan Iklim',
                  date: '28 Maret 2025',
                  category: 'Berita Kampus',
                  excerpt:
                      'Institut Teknologi Indonesia (ITI) telah menjalin kemitraan dengan beberapa universitas terkemuka di dunia untuk melakukan penelitian bersama dalam bidang perubahan iklim. Kerjasama ini bertujuan untuk mengembangkan solusi inovatif dalam menghadapi tantangan lingkungan global.',
                  image: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
              },
              {
                  id: 3,
                  title: 'Alumni ITI Menerima Penghargaan Nobel dalam Fisika',
                  date: '22 Maret 2025',
                  category: 'Alumni',
                  excerpt:
                      'Alumni ITI, Dr. Rina Sari, telah menerima penghargaan Nobel dalam bidang fisika atas penelitiannya yang inovatif dalam teknologi kuantum. Penghargaan ini merupakan pengakuan atas kontribusinya yang signifikan terhadap ilmu pengetahuan.',
                  image: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
              },
          ]

    const featuredStory = data
        ? data.find((y) => y.Populer) !== null
            ? {
                  title: data.find((y) => y.Populer)?.Title || '',
                  excerpt:
                      data.find((y) => y.Populer) &&
                      data.find((y) => y.Populer)!.Deskripsi &&
                      data.find((y) => y.Populer)!.Deskripsi.length > 100
                          ? data
                                .find((y) => y.Populer)
                                ?.Deskripsi.substring(0, 100) + '...'
                          : data.find((y) => y.Populer)?.Deskripsi,
                  image:
                      process.env.NEXT_PUBLIC_API_BASE_URL +
                      `/api/img?_t=_b&_id=${
                          data.find((y) => y.Populer)?.SettingBeritaId
                      }`,
              }
            : {
                  title: 'ITI menegaskan 40 Tahun Sejarah Pendidikan dan Penelitian',
                  excerpt:
                      'Tahun ini menandai 40 tahun berdirinya Institut Teknologi Indonesia (ITI). Dalam perjalanan panjang ini, ITI telah berkomitmen untuk memberikan pendidikan berkualitas tinggi dan melakukan penelitian inovatif yang berdampak pada masyarakat.',
                  image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
              }
        : {
              title: 'ITI menegaskan 40 Tahun Sejarah Pendidikan dan Penelitian',
              excerpt:
                  'Tahun ini menandai 40 tahun berdirinya Institut Teknologi Indonesia (ITI). Dalam perjalanan panjang ini, ITI telah berkomitmen untuk memberikan pendidikan berkualitas tinggi dan melakukan penelitian inovatif yang berdampak pada masyarakat.',
              image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
          }

    return (
        <section id="news" className="container mx-auto container-padding">
            <div className="mb-16 text-center">
                <h2 className="mx-auto text-center section-title">
                    {text ? text.BeritaText : 'Berita'}
                    <span className="block w-24 h-1 mx-auto mt-2 bg-primary"></span>
                </h2>
                <p className="mx-auto section-subtitle">
                    {text
                        ? text.BeritaDeskripsi
                        : 'Tetap terhubung dengan berita terbaru dari ITI. Kami memiliki berbagai berita yang dirancang untuk memperkaya pengalaman akademis dan sosial Anda.'}
                </p>
            </div>

            <div className="mb-16">
                <div className="relative overflow-hidden rounded-lg">
                    <img
                        src={featuredStory.image}
                        alt="Featured story"
                        className="object-cover w-full h-96"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 md:w-3/4">
                            <span className="bg-primary text-white/80 text-xs font-bold px-2.5 py-1 rounded mb-4 inline-block">
                                BERITA UTAMA
                            </span>
                            <h3 className="mb-3 text-2xl font-bold text-white md:text-3xl">
                                {featuredStory.title}
                            </h3>
                            <p className="hidden mb-4 text-white/90 md:block">
                                {featuredStory.excerpt}
                            </p>
                            <Button className="transition-all duration-300 bg-white group hover:bg-gray-100 text-primary hover:underline">
                                <span className="flex items-center">
                                    Baca Selengkapnya
                                    <ChevronRight className="w-4 h-4 ml-1 transition-transform duration-300 transform group-hover:translate-x-1" />
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 mb-12 md:grid-cols-3">
                {newsArticles.map((article) => (
                    <div
                        key={article.id}
                        className="overflow-hidden transition-shadow bg-white rounded-lg shadow-md dark:bg-gray-800 hover:shadow-lg"
                    >
                        <img
                            src={article.image}
                            alt={article.title}
                            className="object-cover w-full h-48"
                        />
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                    {article.category}
                                </span>
                                <span className="text-sm text-gray-700 dark:text-gray-200">
                                    {article.date}
                                </span>
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-gray-700 line-clamp-2 dark:text-gray-200">
                                {article.title}
                            </h3>
                            <p className="mb-4 text-gray-700 dark:text-gray-200 line-clamp-3">
                                {article.excerpt}
                            </p>
                            <Button
                                variant={'link'}
                                className="text-gray-800 transition-all duration-300 group hover:underline dark:text-gray-200"
                            >
                                <span className="flex items-center">
                                    Baca Selengkapnya
                                    <ChevronRight className="w-4 h-4 ml-1 transition-transform duration-300 transform group-hover:translate-x-1" />
                                </span>
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center">
                <Button className="text-white transition-all duration-300 group bg-primary hover:bg-primary/80 active:bg-primary/50 hover:underline">
                    <span className="flex items-center">
                        Baca Selengkapnya
                        <ChevronRight className="w-4 h-4 ml-1 transition-transform duration-300 transform group-hover:translate-x-1" />
                    </span>
                </Button>
            </div>
        </section>
    )
}

export default News
