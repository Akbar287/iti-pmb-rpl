'use client'
import { Button } from '@/components/ui/button'
import Prasasti from '@/assets/images/ITI-Prasasti-scaled-600x400.jpg'
import { ChevronRight } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { SettingNumber } from '@/generated/prisma'

const About = ({
    data,
    text,
}: {
    text: {
        SettingMainPageId: string
        SelayangPandangText: string
        SelayangPandangDeskripsi: string
    } | null
    data: SettingNumber[] | null
}) => {
    const stats = data
        ? data.map((x) => ({
            number: x.Angka.toString(),
            label: x.Title,
            description: x.Subtitle,
        }))
        : [
            {
                number: '1983',
                label: 'Didirikan',
                description:
                    'Lebih dari 40 tahun berkomitmen pada pendidikan teknik',
            },
            {
                number: '22,000+',
                label: 'Mahasiswa',
                description:
                    'Mendapatkan pendidikan teknik berkualitas tinggi',
            },
            {
                number: '10',
                label: 'Program Studi',
                description: 'Menyediakan pendidikan teknik yang beragam',
            },
            {
                number: '1,000+',
                label: 'Jurnal Ilmiah',
                description:
                    'Menyebarkan pengetahuan dan inovasi di seluruh dunia',
            },
            {
                number: '2',
                label: 'Jalur Masuk RPL',
                description:
                    'Menyediakan akses pendidikan Rekognisi Pembelajaran Lampau',
            },
            {
                number: '30+',
                label: 'Dosen dan Tenaga Pendidik',
                description: 'Menyediakan pendidikan berkualitas tinggi',
            },
        ]

    return (
        <section
            id="about"
            className="container-padding mt-5 container mx-auto"
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="section-title">
                        {text
                            ? text.SelayangPandangText
                            : 'Selayang Pandang ITI'}
                    </h2>
                    <p className="text-lg text-justify mb-3">
                        {text
                            ? text.SelayangPandangDeskripsi
                            : `Institut Teknologi Indonesia (ITI) didirikan atas
                        prakarsa Almarhum Prof. B.J Habibie untuk melengkapi
                        Kawasan Puspiptek dengan fasilitas pendidikan. Pendirian
                        ITI dilatarbelakangi oleh kebutuhan insinyur di
                        Indonesia, mendorong Persatuan Insinyur Indonesia (PII)
                        tahun 1983 untuk mendirikan perguruan tinggi teknik.
                        Melalui pendidikan teknik, ITI telah menghasilkan SDM
                        unggul di bidang ilmu pengetahuan dan teknologi (Iptek)
                        dan SDM technopreneur yang menciptakan peluang masa
                        depan yang lebih baik. Ini semua merupakan proses
                        pendidikan teknik ITI yang menerus ditingkatkan kualitas
                        dan layanan, mengikuti dinamika perkembangan Iptek dan
                        kebutuhan pendidikan tinggi teknik.`}
                    </p>
                    <Button onClick={() => window.open('https://iti.ac.id/sejarah/', '_blank', 'noopener,noreferrer')} className="group bg-primary hover:bg-primary/80 active:bg-primary/50 text-white hover:underline transition-all duration-300">
                        <span className="flex items-center">
                            Pelajari Lebih lanjut
                            <ChevronRight className="h-4 w-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                    </Button>
                </div>

                <div className="relative">
                    <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary opacity-50 rounded-tl-2xl z-0"></div>
                    <img
                        src={
                            text
                                ? process.env.NEXT_PUBLIC_API_BASE_URL +
                                '/api/img?_t=_s&_id=' +
                                text.SettingMainPageId
                                : typeof Prasasti === 'string'
                                    ? Prasasti
                                    : Prasasti.src
                        }
                        alt="Prasasti ITI Habibie"
                        className="rounded-lg shadow-xl relative z-10 w-full"
                        width={192}
                        height={192}
                    />
                </div>
            </div>

            <div className="mt-12">
                <Separator
                    className="mb-12 border-2 border-primary"
                    orientation="horizontal"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className={`${stats.length - 1 === index
                                ? ''
                                : 'sm:border-0 border-b'
                                }  p-4 border-gray-600`}
                        >
                            <div className="flex flex-col items-center text-center">
                                <span className="text-5xl font-bold mb-2 grad-text">
                                    {stat.number}
                                </span>
                                <h4 className="text-xl font-bold mb-3 text-primary">
                                    {stat.label}
                                </h4>
                                <p className="text-gray-800 dark:text-gray-200">
                                    {stat.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default About
