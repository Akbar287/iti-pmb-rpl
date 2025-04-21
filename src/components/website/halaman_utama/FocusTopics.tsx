"use client";
import {
  Microscope,
  Globe,
  Brain,
  HeartPulse,
  Scale,
  Atom,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FocusTopics = () => {
  const focusAreas = [
    {
      icon: <Microscope className="h-16 w-16 text-primary" />,
      title: "Inovasi & Penemuan",
      description:
        "Mendorong inovasi dan penemuan baru dalam sains, teknologi, dan seni.",
      links: [
        { text: "Pusat Material Advanced", url: "#" },
        { text: "Inisiatif Komputasi Kuantum", url: "#" },
        { text: "Penelitian Biotechnology", url: "#" },
      ],
    },
    {
      icon: <Globe className="h-16 w-16 text-primary" />,
      title: "Tantangan Global",
      description:
        "Menjawab tantangan global seperti perubahan iklim, kesehatan masyarakat, dan ketidakadilan sosial.",
      links: [
        { text: "Solusi Perubahan Iklim", url: "#" },
        { text: "Tujuan Pembangunan Berkelanjutan", url: "#" },
        { text: "Pusat Kebijakan International", url: "#" },
      ],
    },
    {
      icon: <Brain className="h-16 w-16 text-primary" />,
      title: "Kognisi & Perilaku",
      description:
        "Meneliti cara kerja pikiran manusia dan dampaknya terhadap perilaku dan masyarakat.",
      links: [
        { text: "Cognitive Science Department", url: "#" },
        { text: "AI Ethics Laboratory", url: "#" },
        { text: "Neuroscience Research Group", url: "#" },
      ],
    },
    {
      icon: <HeartPulse className="h-16 w-16 text-primary" />,
      title: "Kesehatan & Kesejahteraan",
      description:
        "Meningkatkan kesehatan dan kesejahteraan individu dan komunitas melalui penelitian dan inovasi.",
      links: [
        { text: "Medical Research Institute", url: "#" },
        { text: "Global Health Initiative", url: "#" },
        { text: "Precision Medicine Center", url: "#" },
      ],
    },
    {
      icon: <Scale className="h-16 w-16 text-primary" />,
      title: "Sosial & Kebijakan",
      description:
        "Meneliti isu-isu sosial dan kebijakan untuk menciptakan masyarakat yang lebih adil dan berkelanjutan.",
      links: [
        { text: "Public Policy Institute", url: "#" },
        { text: "Social Justice Research", url: "#" },
        { text: "Economic Policy Center", url: "#" },
      ],
    },
    {
      icon: <Atom className="h-16 w-16 text-primary" />,
      title: "Matematika & Teori",
      description:
        "Meneliti konsep-konsep matematika dan teori-teori yang mendasari ilmu pengetahuan.",
      links: [
        { text: "Mathematics Research Institute", url: "#" },
        { text: "Center for Philosophical Studies", url: "#" },
        { text: "Theoretical Physics Laboratory", url: "#" },
      ],
    },
  ];

  return (
    <section id="focus" className="container-padding container mx-auto">
      <div className="text-center mb-16">
        <h2 className="section-title mx-auto text-center">
          Bidang Fokus Penelitian
          <span className="block mx-auto mt-2 w-24 h-1 bg-primary"></span>
        </h2>
        <p className="section-subtitle mx-auto">
          Jelajahi berbagai bidang fokus penelitian yang mencakup inovasi,
          tantangan global, kesehatan, dan banyak lagi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {focusAreas.map((area, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-6">{area.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-primary">
                {area.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-200 mb-6">
                {area.description}
              </p>
              <div className="w-full space-y-2">
                {area.links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    className="group flex items-center justify-between p-3 rounded-md text-gray-700 dark:text-gray-200 hover:bg-primary/20 transition-colors"
                  >
                    <span className="group-hover:underline transition-all duration-300">
                      {link.text}
                    </span>
                    <ChevronRight className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="my-16 text-center">
        <Button className="group bg-primary hover:bg-primary/80 active:bg-primary/50 text-white  hover:underline transition-all duration-300">
          <span className="flex items-center">
            Jelajahi Semua Bidang Penelitian
            <ChevronRight className="h-4 w-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Button>
      </div>
    </section>
  );
};

export default FocusTopics;
