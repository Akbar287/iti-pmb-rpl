"use client";
import { useState, useEffect, useRef } from "react";
import { Search, X, ChevronRight, SunIcon, MoonIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Logo from "@/assets/images/Logo-ITI-oke-1.png";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

const Navbar = () => {
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentBackground, setCurrentBackground] = useState(
    "https://images.unsplash.com/photo-1587163689171-57b3c321bad2?q=80&w=2070&auto=format&fit=crop"
  );
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [animateMenu, setAnimateMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  useEffect(() => {
    if (menuOpen) {
      const timer = setTimeout(() => {
        setAnimateMenu(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setAnimateMenu(false);
    }
  }, [menuOpen]);
  const navStructure = [
    {
      title: "Tentang",
      key: "about",
      backgroundImage:
        "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?q=80&w=1074&auto=format&fit=crop",
      submenu: [
        {
          title: "Visi dan Misi",
          href: "#about",
          key: "mission",
          backgroundImage:
            "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1170&auto=format&fit=crop",
          childMenu: [
            {
              title: "Sejarah ITI",
              href: "#",
              image:
                "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?q=80&w=1074&auto=format&fit=crop",
              description:
                "Pelajari sejarah dan perkembangan Institut Teknologi Indonesia.",
            },
            {
              title: "Nilai Kami",
              href: "#",
              image:
                "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1170&auto=format&fit=crop",
              description:
                "Jelajahi nilai-nilai yang membentuk budaya dan etika kami.",
            },
          ],
        },
        {
          title: "Kepemimpinan",
          href: "#",
          key: "leadership",
          backgroundImage:
            "https://images.unsplash.com/photo-1590650153855-d9e808231d41?q=80&w=1170&auto=format&fit=crop",
          childMenu: [
            {
              title: "Fakultas",
              href: "#",
              image:
                "https://images.unsplash.com/photo-1590650153855-d9e808231d41?q=80&w=1170&auto=format&fit=crop",
              description: "Kenali fakultas dan departemen kami yang beragam.",
            },
          ],
        },
        {
          title: "Sejarah",
          href: "#",
          key: "history",
          backgroundImage:
            "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1132&auto=format&fit=crop",
          childMenu: [
            {
              title: "Garis Waktu",
              href: "#",
              image:
                "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1132&auto=format&fit=crop",
              description:
                "Jelajahi garis waktu sejarah ITI dan pencapaian pentingnya.",
            },
          ],
        },
      ],
    },
    {
      title: "Akademik",
      key: "academics",
      backgroundImage:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1170&auto=format&fit=crop",
      submenu: [
        {
          title: "Sarjana",
          href: "#",
          key: "undergraduate",
          backgroundImage:
            "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1170&auto=format&fit=crop",
          childMenu: [
            {
              title: "Program Sutudi",
              href: "#",
              image:
                "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1170&auto=format&fit=crop",
              description:
                "Jelajahi program studi sarjana kami yang beragam dan inovatif.",
            },
          ],
        },
        {
          title: "Pasca Sarjana",
          href: "#",
          key: "graduate",
          backgroundImage:
            "https://images.unsplash.com/photo-1627556704302-624286467c65?q=80&w=1170&auto=format&fit=crop",
          childMenu: [
            {
              title: "Program Studi Pascasarjana",
              href: "#",
              image:
                "https://images.unsplash.com/photo-1627556704302-624286467c65?q=80&w=1170&auto=format&fit=crop",
              description:
                "Jelajahi program studi pascasarjana kami yang dirancang untuk mempersiapkan Anda menghadapi tantangan masa depan.",
            },
          ],
        },
        {
          title: "Penelitian",
          href: "#",
          key: "research",
          backgroundImage:
            "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1170&auto=format&fit=crop",
          childMenu: [
            {
              title: "Pusat Penelitian",
              href: "#focus",
              image:
                "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1170&auto=format&fit=crop",
              description:
                "Pelajari pusat penelitian kami yang berfokus pada inovasi dan teknologi.",
            },
          ],
        },
      ],
    },
    {
      title: "Komunitas",
      key: "community",
      backgroundImage:
        "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1170&auto=format&fit=crop",
      submenu: [
        {
          title: "Mahasiswa",
          href: "#community",
          key: "student-life",
          backgroundImage:
            "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1170&auto=format&fit=crop",
          childMenu: [
            {
              title: "Aktivitas Mahasiswa",
              href: "#",
              image:
                "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1170&auto=format&fit=crop",
              description:
                "Jelajahi berbagai aktivitas dan organisasi mahasiswa di ITI.",
            },
          ],
        },
        {
          title: "Alumni",
          href: "#",
          key: "alumni",
          backgroundImage:
            "https://images.unsplash.com/photo-1660795670724-0dfa88fc1dda?q=80&w=1074&auto=format&fit=crop",
          childMenu: [
            {
              title: "Jaringan Alumni",
              href: "#",
              image:
                "https://images.unsplash.com/photo-1660795670724-0dfa88fc1dda?q=80&w=1074&auto=format&fit=crop",
              description:
                "Terhubung dengan alumni kami dan jelajahi jaringan profesional yang luas.",
            },
          ],
        },
      ],
    },
    {
      title: "Berita & Acara",
      key: "news-events",
      backgroundImage:
        "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1170&auto=format&fit=crop",
      submenu: [
        {
          title: "Berita Kampus",
          href: "#news",
          key: "university-news",
          backgroundImage:
            "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1170&auto=format&fit=crop",
          childMenu: [
            {
              title: "Berita Terbaru",
              href: "#news",
              image:
                "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1170&auto=format&fit=crop",
              description:
                "Dapatkan informasi terbaru tentang acara dan berita terkini di kampus.",
            },
          ],
        },
        {
          title: "Kegiatan",
          href: "#events",
          key: "events-calendar",
          backgroundImage:
            "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=1170&auto=format&fit=crop",
          childMenu: [
            {
              title: "Kegiatan Akademik",
              href: "#events",
              image:
                "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=1170&auto=format&fit=crop",
              description:
                "Ikuti kegiatan akademik dan seminar yang diadakan di kampus.",
            },
          ],
        },
      ],
    },
    {
      title: "Resources",
      key: "resources",
      backgroundImage:
        "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1170&auto=format&fit=crop",
      submenu: [
        {
          title: "Perpustakaan",
          href: "#resources",
          key: "library",
          backgroundImage:
            "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1170&auto=format&fit=crop",
          childMenu: [
            {
              title: "Koleksi Digital",
              href: "#resources",
              image:
                "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1170&auto=format&fit=crop",
              description:
                "Akses koleksi digital kami, termasuk jurnal, buku, dan artikel.",
            },
          ],
        },
        {
          title: "Karir",
          href: "#",
          key: "career",
          backgroundImage:
            "https://images.unsplash.com/photo-1577412647305-991150c7d163?q=80&w=1170&auto=format&fit=crop",
          childMenu: [
            {
              title: "Pengembangan Karir",
              href: "#",
              image:
                "https://images.unsplash.com/photo-1577412647305-991150c7d163?q=80&w=1170&auto=format&fit=crop",
              description:
                "Jelajahi sumber daya pengembangan karir kami, termasuk pelatihan dan bimbingan.",
            },
          ],
        },
      ],
    },
  ];

  // Toggle search form
  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  // Update background when menu changes
  const handleMenuChange = (menuKey: string | null) => {
    setActiveMenu(menuKey);

    if (menuKey) {
      const menu = navStructure.find((item) => item.key === menuKey);
      if (menu?.backgroundImage) {
        setCurrentBackground(menu.backgroundImage);
      }
    }

    // Reset submenu when main menu changes
    setActiveSubmenu(null);
  };

  // Update background when submenu changes
  const handleSubmenuChange = (submenuKey: string | null) => {
    setActiveSubmenu(submenuKey);

    if (submenuKey && activeMenu) {
      const menu = navStructure.find((item) => item.key === activeMenu);
      const submenu = menu?.submenu.find((item) => item.key === submenuKey);

      if (submenu?.backgroundImage) {
        setCurrentBackground(submenu.backgroundImage);
      }
    }
  };

  // Toggle menu state
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (!menuOpen && !activeMenu && navStructure.length > 0) {
      handleMenuChange(navStructure[0].key);
    }
  };

  // Close menu
  const closeMenu = () => {
    setMenuOpen(false);
    setActiveMenu(null);
    setActiveSubmenu(null);
  };

  // Get child menu item for display in side panel
  const [activeChildItem, setActiveChildItem] = useState<any | null>(null);

  // Mobile menu item component
  const MobileMenuItem = ({ item }: { item: any }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="py-2">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center justify-between">
            <a
              href={item.submenu ? "#" : item.href}
              className="font-medium text-primary"
            >
              {item.title}
            </a>
            {item.submenu && (
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="p-1">
                  <ChevronRight
                    className={`h-4 w-4 transition-transform ${
                      isOpen ? "rotate-90" : ""
                    }`}
                  />
                </Button>
              </CollapsibleTrigger>
            )}
          </div>

          {item.submenu && (
            <CollapsibleContent className="ml-4 mt-2">
              {item.submenu.map((subItem: any, subIndex: number) => (
                <div key={subIndex} className="py-2">
                  <Collapsible>
                    <div className="flex items-center justify-between">
                      <a href={subItem.href} className="text-gray-700">
                        {subItem.title}
                      </a>
                      {subItem.childMenu && (
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="p-1">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </CollapsibleTrigger>
                      )}
                    </div>

                    {subItem.childMenu && (
                      <CollapsibleContent className="ml-4 mt-1">
                        {subItem.childMenu.map(
                          (childItem: any, childIndex: number) => (
                            <a
                              key={childIndex}
                              href={childItem.href}
                              className="block py-2 text-gray-700"
                            >
                              {childItem.title}
                            </a>
                          )
                        )}
                      </CollapsibleContent>
                    )}
                  </Collapsible>
                </div>
              ))}
            </CollapsibleContent>
          )}
        </Collapsible>
      </div>
    );
  };

  return (
    <>
      {/* Fixed Navigation Bar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-gray-50/95 dark:bg-gray-800 shadow-md py-2"
            : "bg-gray-700/30 py-4"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <a
              href="/"
              className="flex items-center transition-transform duration-300 hover:scale-105"
            >
              <Image
                src={Logo}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAIKUExURQAAAOd4F6JXFslqF8ZpF5xVF8JnF8RoF5RRFsNnF5dTF+d4F+d4F+d4F+d4F+d4F+d4F+d4F+d4F+d4F/+GEel5F+h4F+l5F4ZKFs1uHNhyGsxuHH5HF/+GCMdvIsark8aslsRvJf+FBel5FtV0INR1Iul4Fuh4Fud4F+d4F+d4F+d4F+d4F+d4F+d4F+d4F+d4F+d4F+h4Fuh4Fud4F+d4F+p5FtV0INR1Iup4Fv+PAMRuI8mumMmwmsRvJf+HAk4wFstuHNZwGNZwGMxuHG9AF/+ODel5F+h5F+h5F+l5F/+IEOd4F+d4F+d4F+h4F9lzGsKwoNrIuN/Mvd3Lu9vJueHVyrq8vpOVlpiam8LDxMTFxpmam5SVlre5u+LYztZ0H+PWyoaHiAwMDENDQykpKQ0NDYCAgeTZz9R1IdV0H+LVyo2Oj3V1dY2NjT8/P4qKind3d4iJiuTYzuh4FuDTyLGys7Ozs3NzcxMTExISEm9vb7S0tK+vsOHWzN/Sx8HCw8PDw39/fwYGBgUFBXp6esTExL/AweHVy+HUyKusra6urrGxsXR0dLCwsKipqeLWzIuMjVtbW8DAwN3d3dzc3MHBwV5eXoaHh+TXzIaIigECAzAxMnFyc3JzdDEyM4CChOXa0YZ0ZCMRASYUBJuJeZ+NfScVBSIQAIFwYNRuFdhyGeh5F////5uxOosAAABOdFJOUwAAAAAAAAAAAAAAB42OBn74f/mABn/5gAZ/+YAGBn/5+YAGf/n5gPmMhPX3iwR19nx29vh9BXb2+H0Edvb4fQUEdvb4fQUEdvb4fQWDiXvAvLMAAAABYktHRK0gYsIdAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH6QQHDA0PucPkKwAAAURJREFUGNNjYAADRkZuHl5uRkYGJMDIyMcvICDIhywKFBMU8vMTEkYSZWIWERXzBwIxcREWVqg6ZglJqQAwkJKWYWGE6JWVkw8MCg4JCQ4NVFBUApkANE9ZJSw8IjIqOiY2Ll5VDWQu0A71hMSk5JTU1JS09IxMdaBtDNz8Qv5Z2Tm5efn5BYVFxZklQoLcDBoCfv5ZpWXlFZVV1TW1dZklfgI8DJpaQMH6hsam5pbWtvYOoKC2DoOunr5/VmdXd09ub19f/4TMEgEDPgZGXUOjhOyJkyZPmTpt+oziTGMTU6DtjLpm5jNnzZ4zd9782QsWWliaQhxqZW2zaPGSpcuWr1hpa2cP8T4jm4Oj06pVq1evWuXs4soODRIOTjd3jzX+/ms8vbzZuRBBp2uo7+cnYGKKGqC6eloCBqboQa/r4wsPYgAP5FJyLkQtQgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNS0wNC0wN1QxMjoxMzoxMSswMDowMO6zX3EAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjUtMDQtMDdUMTI6MTM6MTErMDA6MDCf7ufNAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDI1LTA0LTA3VDEyOjEzOjE1KzAwOjAwPLTiAQAAAABJRU5ErkJggg=="
                alt="ITI Logo"
                width={50}
                height={50}
                className="mr-2"
              />
              <span
                className={`font-sans font-bold text-2xl ${
                  isScrolled ? "text-primary" : "text-gray-100"
                }`}
              >
                <span className="block md:hidden">ITI</span>
                <span className="hidden md:block">
                  Institut Teknologi Indonesia
                </span>
              </span>
            </a>

            <div className="hidden lg:flex items-center space-x-6">
              <button
                onClick={toggleSearch}
                className={`${
                  isScrolled ? "text-gray-800" : "text-white"
                } hover:text-primary focus:outline-none transition-all duration-300 transform hover:scale-110`}
                aria-label="Search"
              >
                {showSearch ? (
                  <X className="h-5 w-5 animate-in fade-in duration-300" />
                ) : (
                  <Search className="h-5 w-5 animate-in fade-in duration-300" />
                )}
              </button>

              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105"
                onClick={toggleMenu}
              >
                Menu
              </Button>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105"
                onClick={() => router.push("/login")}
              >
                Login
              </Button>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105"
                onClick={() => setTheme(theme == "dark" ? "light" : "dark")}
              >
                {theme == "dark" ? <MoonIcon /> : <SunIcon />}
              </Button>
            </div>

            <div className="flex lg:hidden items-center space-x-4">
              <button
                onClick={toggleSearch}
                className={`${
                  isScrolled ? "text-gray-800" : "text-white"
                } hover:text-primary focus:outline-none transition-all duration-300 transform hover:scale-110`}
                aria-label="Search"
              >
                {showSearch ? (
                  <X className="h-5 w-5 animate-in fade-in duration-300" />
                ) : (
                  <Search className="h-5 w-5 animate-in fade-in duration-300" />
                )}
              </button>

              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105"
                  >
                    Menu
                  </Button>
                </SheetTrigger>
                <SheetContent className="h-[85vh] animate-in slide-in-right duration-300">
                  <div className="px-6 py-6 h-full overflow-auto">
                    <h3 className="text-xl font-playfair font-bold mb-6 text-primary animate-in fade-in duration-300 delay-100">
                      Menu
                    </h3>
                    <div className="space-y-1">
                      {navStructure.map((item, index) => (
                        <MobileMenuItem key={index} item={item} />
                      ))}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105"
                onClick={() => router.push("/login")}
              >
                Login
              </Button>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105"
                onClick={() => setTheme(theme == "dark" ? "light" : "dark")}
              >
                {theme == "dark" ? <MoonIcon /> : <SunIcon />}
              </Button>
            </div>
          </div>

          {showSearch && (
            <div className="absolute left-0 right-0 mt-2 px-4 transition-all duration-300 ease-in-out animate-in fade-in">
              <div
                className={`bg-white shadow-lg rounded-md p-4 transform transition-all duration-300 ${
                  showSearch
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-4 opacity-0"
                }`}
              >
                <form className="flex items-center">
                  <Input
                    ref={searchInputRef}
                    type="search"
                    placeholder="Cari Kampus ITI..."
                    className="flex-grow border-0 focus-visible:ring-0 focus-visible:ring-offset-0 animate-in fade-in duration-300"
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    className="text-gray-700 hover:text-primary hover:bg-transparent transition-colors duration-200"
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-gray-700 hover:text-primary hover:bg-transparent transition-colors duration-200"
                    onClick={toggleSearch}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </nav>

      {menuOpen && (
        <div
          className={`fixed inset-0 z-60 h-screen w-screen flex flex-col ${
            animateMenu ? "opacity-100" : "opacity-0"
          } transition-opacity duration-500`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out"
            style={{ backgroundImage: `url(${currentBackground})` }}
          >
            <div className="absolute inset-0 bg-black/60" />
          </div>

          <button
            onClick={closeMenu}
            className="absolute top-6 right-6 text-white hover:text-primary z-50 transition-all duration-300 transform hover:rotate-90"
            aria-label="Close Menu"
          >
            <X className="h-8 w-8" />
          </button>

          <div className="container mx-auto px-4 py-24 relative z-10 flex flex-1 overflow-hidden">
            <div className="grid grid-cols-12 gap-6 h-full">
              <div
                className={`col-span-2 border-r border-white/20 pr-6 ${
                  animateMenu
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-10 opacity-0"
                } transition-all duration-500 delay-100 transform`}
              >
                <h3 className="text-3xl  font-bold mb-10 text-white animate-in fade-in duration-300 delay-200">
                  Menu
                </h3>
                <ul className="space-y-6">
                  {navStructure.map((item, index) => (
                    <li
                      key={index}
                      style={{ animationDelay: `${150 + index * 50}ms` }}
                      className="animate-in fade-in slide-in-from-left duration-300"
                    >
                      <button
                        onClick={() =>
                          handleMenuChange(
                            item.key === activeMenu ? null : item.key
                          )
                        }
                        className={cn(
                          "text-left w-full py-2 text-lg font-medium relative hover:text-primary transition-colors group",
                          activeMenu === item.key
                            ? "text-primary"
                            : "text-white"
                        )}
                      >
                        {item.title}
                        <span
                          className={cn(
                            "absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300",
                            activeMenu === item.key
                              ? "w-full"
                              : "w-0 group-hover:w-full"
                          )}
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className={`col-span-2 border-r border-white/20 pr-6 ${
                  animateMenu
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-10 opacity-0"
                } transition-all duration-500 delay-200 transform`}
              >
                {activeMenu && (
                  <>
                    <h3 className="text-lg font-playfair font-medium mb-6 text-white animate-in fade-in duration-300">
                      {
                        navStructure.find((item) => item.key === activeMenu)
                          ?.title
                      }
                    </h3>
                    <ul className="space-y-4">
                      {navStructure
                        .find((item) => item.key === activeMenu)
                        ?.submenu.map((subItem, index) => (
                          <li
                            key={index}
                            style={{ animationDelay: `${200 + index * 50}ms` }}
                            className="animate-in fade-in slide-in-from-left duration-300"
                          >
                            <button
                              onClick={() =>
                                handleSubmenuChange(
                                  subItem.key === activeSubmenu
                                    ? null
                                    : subItem.key
                                )
                              }
                              className={cn(
                                "text-left w-full py-1 relative hover:text-primary transition-colors group",
                                activeSubmenu === subItem.key
                                  ? "text-primary"
                                  : "text-white"
                              )}
                            >
                              {subItem.title}
                              <span
                                className={cn(
                                  "absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300",
                                  activeSubmenu === subItem.key
                                    ? "w-full"
                                    : "w-0 group-hover:w-full"
                                )}
                              />
                            </button>
                          </li>
                        ))}
                    </ul>
                  </>
                )}
              </div>

              {/* Third column: Child menu */}
              <div
                className={`col-span-8 ${
                  animateMenu
                    ? "translate-x-0 opacity-100"
                    : "translate-x-10 opacity-0"
                } transition-all duration-500 delay-300 transform`}
              >
                <div className="grid grid-cols-12 gap-6 h-full">
                  {/* Child menu items */}
                  <div className="col-span-4">
                    {activeSubmenu && activeMenu && (
                      <>
                        <h3 className="text-lg font-playfair font-medium mb-6 text-white animate-in fade-in duration-300">
                          {
                            navStructure
                              .find((item) => item.key === activeMenu)
                              ?.submenu.find(
                                (subItem) => subItem.key === activeSubmenu
                              )?.title
                          }
                        </h3>
                        <ul className="space-y-3">
                          {navStructure
                            .find((item) => item.key === activeMenu)
                            ?.submenu.find(
                              (subItem) => subItem.key === activeSubmenu
                            )
                            ?.childMenu.map((childItem, index) => (
                              <li
                                key={index}
                                style={{
                                  animationDelay: `${250 + index * 50}ms`,
                                }}
                                className="animate-in fade-in slide-in-from-left duration-300"
                              >
                                <a
                                  href={childItem.href}
                                  className="block py-1 relative text-white hover:text-primary transition-colors group"
                                  onMouseEnter={() =>
                                    setActiveChildItem(childItem)
                                  }
                                >
                                  {childItem.title}
                                  <span className="absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 w-0 group-hover:w-full" />
                                </a>
                              </li>
                            ))}
                        </ul>
                      </>
                    )}
                  </div>

                  <div className="col-span-8">
                    {activeChildItem ? (
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 h-full transition-all duration-500 animate-in fade-in scale-in">
                        <div className="flex flex-col h-full">
                          <div className="h-48 overflow-hidden rounded-lg mb-4">
                            <img
                              src={activeChildItem.image}
                              alt={activeChildItem.title}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                          </div>
                          <h4 className="text-xl font-medium text-primary mb-3 animate-in fade-in duration-300">
                            {activeChildItem.title}
                          </h4>
                          <p className="text-white/90 animate-in fade-in duration-300 delay-100">
                            {activeChildItem.description}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 h-full animate-in fade-in scale-in duration-500">
                        <h4 className="font-medium text-primary mb-4">
                          Quick Links
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <a
                            href="#"
                            className="text-white hover:text-primary hover:underline group relative transition-colors duration-200"
                          >
                            Faculty Directory
                            <span className="absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 w-0 group-hover:w-full" />
                          </a>
                          <a
                            href="#"
                            className="text-white hover:text-primary hover:underline group relative transition-colors duration-200"
                          >
                            Academic Calendar
                            <span className="absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 w-0 group-hover:w-full" />
                          </a>
                          <a
                            href="#"
                            className="text-white hover:text-primary hover:underline group relative transition-colors duration-200"
                          >
                            Campus Map
                            <span className="absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 w-0 group-hover:w-full" />
                          </a>
                          <a
                            href="#"
                            className="text-white hover:text-primary hover:underline group relative transition-colors duration-200"
                          >
                            Library Services
                            <span className="absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 w-0 group-hover:w-full" />
                          </a>
                          <a
                            href="#"
                            className="text-white hover:text-primary hover:underline group relative transition-colors duration-200"
                          >
                            Research Centers
                            <span className="absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 w-0 group-hover:w-full" />
                          </a>
                          <a
                            href="#"
                            className="text-white hover:text-primary hover:underline group relative transition-colors duration-200"
                          >
                            Student Services
                            <span className="absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 w-0 group-hover:w-full" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
