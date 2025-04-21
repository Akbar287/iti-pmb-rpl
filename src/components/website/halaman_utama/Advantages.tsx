"use client";
import {
  GraduationCap,
  Globe,
  Users,
  BookOpen,
  Trophy,
  Lightbulb,
} from "lucide-react";

const Advantages = () => {
  const advantages = [
    {
      icon: <GraduationCap className="h-10 w-10 text-primary" />,
      title: "World-Class Education",
      description:
        "Taught by leaders in their fields, our curriculum combines theoretical knowledge with practical experience and critical thinking.",
    },
    {
      icon: <Globe className="h-10 w-10 text-primary" />,
      title: "Global Perspective",
      description:
        "Our diverse community of students and faculty from over 150 countries brings global perspectives and cultural awareness.",
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Collegiate System",
      description:
        "Our 31 colleges provide supportive, inclusive communities where students live, study, and socialize together.",
    },
    {
      icon: <BookOpen className="h-10 w-10 text-primary" />,
      title: "Research Excellence",
      description:
        "Engage with cutting-edge research and innovation across disciplines, with opportunities for student involvement at all levels.",
    },
    {
      icon: <Trophy className="h-10 w-10 text-primary" />,
      title: "Career Success",
      description:
        "Our graduates are highly sought after by employers worldwide, with a global network of over 200,000 alumni in leadership positions.",
    },
    {
      icon: <Lightbulb className="h-10 w-10 text-primary" />,
      title: "Tradition of Innovation",
      description:
        "From the discovery of DNA's structure to advancements in artificial intelligence, we've led breakthroughs that change the world.",
    },
  ];

  return (
    <section className=" py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title mx-auto text-center">
            Kenapa harus memilih ITI ?
            <span className="block mx-auto mt-2 w-24 h-1 bg-primary"></span>
          </h2>
          <p className="section-subtitle mx-auto">
            ITI adalah lembaga pendidikan tinggi yang terkemuka di dunia, dengan
            tradisi panjang dalam memberikan pendidikan berkualitas tinggi dan
            penelitian inovatif.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advantages.map((advantage, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="mb-6">{advantage.icon}</div>
              <h3 className="text-xl font-bold mb-4 text-primary">
                {advantage.title}
              </h3>
              <p className="text-gray-800 dark:text-gray-200">
                {advantage.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Advantages;
