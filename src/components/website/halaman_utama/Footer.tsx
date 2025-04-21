"use client";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import Logo from "@/assets/images/Logo-ITI-oke-1.png";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  const quickLinks = [
    { text: "About", url: "#about" },
    { text: "Admissions", url: "#" },
    { text: "Academics", url: "#" },
    { text: "Research", url: "#focus" },
    { text: "Campus Life", url: "#community" },
    { text: "Alumni", url: "#" },
  ];

  const resources = [
    { text: "Library", url: "#resources" },
    { text: "Academic Calendar", url: "#" },
    { text: "Career Services", url: "#" },
    { text: "IT Services", url: "#" },
    { text: "Accessibility", url: "#" },
    { text: "Maps & Directions", url: "#" },
  ];

  const connect = [
    { text: "News & Events", url: "#news" },
    { text: "Support", url: "#" },
    { text: "Visit Campus", url: "#" },
    { text: "Employment", url: "#" },
    { text: "Emergency Info", url: "#" },
    { text: "Contact Us", url: "#" },
  ];

  const socialLinks = [
    {
      icon: <Facebook className="h-5 w-5" />,
      url: "https://www.facebook.com/iti.1984/",
      label: "Facebook",
    },
    {
      icon: <Twitter className="h-5 w-5" />,
      url: "https://twitter.com/KampusITI",
      label: "Twitter",
    },
    {
      icon: <Instagram className="h-5 w-5" />,
      url: "https://www.instagram.com/institutteknologiindonesia/?hl=en",
      label: "Instagram",
    },
    {
      icon: <Youtube className="h-5 w-5" />,
      url: "https://www.youtube.com/channel/UC18TQsvYOiraNeWLvx1AIcg",
      label: "YouTube",
    },
    {
      icon: <Linkedin className="h-5 w-5" />,
      url: "https://www.linkedin.com/groups/4035662/",
      label: "LinkedIn",
    },
  ];

  return (
    <footer className="bg-gray-800 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Top section with logo and newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5  border-white/20 pb-12">
          <div>
            <div className="mb-6">
              <a href="#" className="flex items-center">
                <Image
                  src={Logo}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAIKUExURQAAAOd4F6JXFslqF8ZpF5xVF8JnF8RoF5RRFsNnF5dTF+d4F+d4F+d4F+d4F+d4F+d4F+d4F+d4F+d4F/+GEel5F+h4F+l5F4ZKFs1uHNhyGsxuHH5HF/+GCMdvIsark8aslsRvJf+FBel5FtV0INR1Iul4Fuh4Fud4F+d4F+d4F+d4F+d4F+d4F+d4F+d4F+d4F+d4F+h4Fuh4Fud4F+d4F+p5FtV0INR1Iup4Fv+PAMRuI8mumMmwmsRvJf+HAk4wFstuHNZwGNZwGMxuHG9AF/+ODel5F+h5F+h5F+l5F/+IEOd4F+d4F+d4F+h4F9lzGsKwoNrIuN/Mvd3Lu9vJueHVyrq8vpOVlpiam8LDxMTFxpmam5SVlre5u+LYztZ0H+PWyoaHiAwMDENDQykpKQ0NDYCAgeTZz9R1IdV0H+LVyo2Oj3V1dY2NjT8/P4qKind3d4iJiuTYzuh4FuDTyLGys7Ozs3NzcxMTExISEm9vb7S0tK+vsOHWzN/Sx8HCw8PDw39/fwYGBgUFBXp6esTExL/AweHVy+HUyKusra6urrGxsXR0dLCwsKipqeLWzIuMjVtbW8DAwN3d3dzc3MHBwV5eXoaHh+TXzIaIigECAzAxMnFyc3JzdDEyM4CChOXa0YZ0ZCMRASYUBJuJeZ+NfScVBSIQAIFwYNRuFdhyGeh5F////5uxOosAAABOdFJOUwAAAAAAAAAAAAAAB42OBn74f/mABn/5gAZ/+YAGBn/5+YAGf/n5gPmMhPX3iwR19nx29vh9BXb2+H0Edvb4fQUEdvb4fQUEdvb4fQWDiXvAvLMAAAABYktHRK0gYsIdAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH6QQHDA0PucPkKwAAAURJREFUGNNjYAADRkZuHl5uRkYGJMDIyMcvICDIhywKFBMU8vMTEkYSZWIWERXzBwIxcREWVqg6ZglJqQAwkJKWYWGE6JWVkw8MCg4JCQ4NVFBUApkANE9ZJSw8IjIqOiY2Ll5VDWQu0A71hMSk5JTU1JS09IxMdaBtDNz8Qv5Z2Tm5efn5BYVFxZklQoLcDBoCfv5ZpWXlFZVV1TW1dZklfgI8DJpaQMH6hsam5pbWtvYOoKC2DoOunr5/VmdXd09ub19f/4TMEgEDPgZGXUOjhOyJkyZPmTpt+oziTGMTU6DtjLpm5jNnzZ4zd9782QsWWliaQhxqZW2zaPGSpcuWr1hpa2cP8T4jm4Oj06pVq1evWuXs4soODRIOTjd3jzX+/ms8vbzZuRBBp2uo7+cnYGKKGqC6eloCBqboQa/r4wsPYgAP5FJyLkQtQgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNS0wNC0wN1QxMjoxMzoxMSswMDowMO6zX3EAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjUtMDQtMDdUMTI6MTM6MTErMDA6MDCf7ufNAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDI1LTA0LTA3VDEyOjEzOjE1KzAwOjAwPLTiAQAAAABJRU5ErkJggg=="
                  alt="ITI Logo"
                  className="h-10 w-auto mr-3 text-primary"
                  priority
                />
                <span className="text-xl font-bold text-primary">
                  Institut Teknologi Indonesia
                </span>
              </a>
            </div>
            <p className="text-white/80 mb-8 max-w-md text-justify">
              Suatu cita-cita dan harapan untuk menciptakan para insinyur yang
              handal, yang mampu bersaing secara nasional maupun internasional
              dengan kualifikasi unggulan dan bermoral tinggi kebangsaan.
            </p>
          </div>
          <div className="flex">
            <Separator
              orientation="vertical"
              className="hidden md:block mr-6 h-auto bg-white/20"
            />
            <div className="flex flex-col items-start w-full md:items-center ">
              <h3 className="text-lg font-bold mb-4 text-primary">
                Ikuti Kami
              </h3>
              <div className="grid grid-cols-6 md:grid-cols-3 gap-4">
                {socialLinks.map((link, i) => (
                  <a
                    key={i}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={link.url}
                    aria-label={link.label}
                    className="bg-white/10 hover:bg-primary hover:text-white p-3 rounded-full transition-all duration-100"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="flex">
            <Separator
              orientation="vertical"
              className="hidden md:block mr-6 h-auto bg-white/20"
            />
            <div>
              <h3 className="text-lg font-bold mb-4 text-primary">
                Contact Us
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MapPin
                    className="h-5 w-5 shrink-0 grow-0 mr-3 mt-0.5 text-primary"
                    strokeWidth={2}
                  />
                  <span className="text-white/80">
                    Jl. Raya Puspiptek, Setu, Kecamatan Setu, Kota Tangerang
                    Selatan 15314
                  </span>
                </li>

                <li className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-primary" />
                  <a
                    href="tel:+6281360090013"
                    className="text-white/80 hover:text-primary transition-colors"
                  >
                    +62 81360090013
                  </a>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-primary" />
                  <a
                    href="mailto:info@iti.ac.id"
                    className="text-white/80 hover:text-primary transition-colors"
                  >
                    info@iti.ac.id
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-lg font-bold mb-4 text-primary">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.url}
                    className="text-white/80 hover:text-primary transition-colors"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-primary">Resources</h3>
            <ul className="space-y-2">
              {resources.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.url}
                    className="text-white/80 hover:text-primary transition-colors"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-primary">Connect</h3>
            <ul className="space-y-2">
              {connect.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.url}
                    className="text-white/80 hover:text-primary transition-colors"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-primary">Connect</h3>
            <ul className="space-y-2">
              {connect.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.url}
                    className="text-white/80 hover:text-primary transition-colors"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div> */}

        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center text-white/60 text-sm">
          <div className="mb-4 md:mb-0 text-center">
            &copy; {new Date().getFullYear()} Institut Teknologi Indonesia. All
            rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Use
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
