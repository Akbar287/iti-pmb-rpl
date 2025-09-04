'use client'
import { SettingWhy } from '@/generated/prisma'
import {
    GraduationCap,
    Globe,
    Users,
    BookOpen,
    Trophy,
    Lightbulb,
} from 'lucide-react'

const Advantages = ({
    data,
    text,
}: {
    text: {
        WhyText: string
        WhyDeskripsi: string
    } | null
    data: SettingWhy[] | null
}) => {
    const advantages = data
        ? data.map((x) => ({
              icon: x.Icon,
              title: x.Title,
              description: x.Subtitle,
          }))
        : [
              {
                  icon: <GraduationCap className="w-10 h-10 text-primary" />,
                  title: 'World-Class Education',
                  description:
                      'Taught by leaders in their fields, our curriculum combines theoretical knowledge with practical experience and critical thinking.',
              },
              {
                  icon: <Globe className="w-10 h-10 text-primary" />,
                  title: 'Global Perspective',
                  description:
                      'Our diverse community of students and faculty from over 150 countries brings global perspectives and cultural awareness.',
              },
              {
                  icon: <Users className="w-10 h-10 text-primary" />,
                  title: 'Collegiate System',
                  description:
                      'Our 31 colleges provide supportive, inclusive communities where students live, study, and socialize together.',
              },
              {
                  icon: <BookOpen className="w-10 h-10 text-primary" />,
                  title: 'Research Excellence',
                  description:
                      'Engage with cutting-edge research and innovation across disciplines, with opportunities for student involvement at all levels.',
              },
              {
                  icon: <Trophy className="w-10 h-10 text-primary" />,
                  title: 'Career Success',
                  description:
                      'Our graduates are highly sought after by employers worldwide, with a global network of over 200,000 alumni in leadership positions.',
              },
              {
                  icon: <Lightbulb className="w-10 h-10 text-primary" />,
                  title: 'Tradition of Innovation',
                  description:
                      "From the discovery of DNA's structure to advancements in artificial intelligence, we've led breakthroughs that change the world.",
              },
          ]

    return (
        <section className="px-4 py-20 ">
            <div className="container mx-auto">
                <div className="mb-16 text-center">
                    <h2 className="mx-auto text-center section-title">
                        {text ? text.WhyText : 'Kenapa harus memilih ITI ?'}
                        <span className="block w-24 h-1 mx-auto mt-2 bg-primary"></span>
                    </h2>
                    <p className="mx-auto section-subtitle">
                        {text
                            ? text.WhyDeskripsi
                            : 'ITI adalah lembaga pendidikan tinggi yang terkemuka di dunia, dengan tradisi panjang dalam memberikan pendidikan berkualitas tinggi dan penelitian inovatif.'}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {advantages.map((advantage, index) => {
                        const svg =
                            typeof advantage.icon === 'string'
                                ? atob(advantage.icon.split(',')[1])
                                : null
                        return (
                            <div
                                key={index}
                                className="p-8 transition-all duration-300 bg-white rounded-lg shadow-md dark:bg-gray-800 hover:shadow-xl hover:-translate-y-1"
                            >
                                <div className="mb-6">
                                    {data ? (
                                        svg ? (
                                            <div
                                                className="w-5 h-5 text-primary"
                                                dangerouslySetInnerHTML={{
                                                    __html: svg,
                                                }}
                                            />
                                        ) : (
                                            advantage.icon
                                        )
                                    ) : (
                                        advantage.icon
                                    )}
                                </div>
                                <h3 className="mb-4 text-xl font-bold text-primary">
                                    {advantage.title}
                                </h3>
                                <p className="text-gray-800 dark:text-gray-200">
                                    {advantage.description}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default Advantages
