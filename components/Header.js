"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaUser } from "react-icons/fa";
import { MdElectricBolt } from "react-icons/md";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMenuOpen(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [pathname]);

  const items = [
    {
      title: "مقاله‌ها",
      link: "articles",
    },
    {
      title: "هنرمندان",
      link: "artists",
    },
    // {
    //   title: "آهنگ‌ها",
    //   link: "tracks",
    // },
  ];

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="sticky py-2 top-0 z-50 backdrop-blur-lg bg-black/70">
        <nav className="flex items-center justify-between h-16 px-4">
          {/* Menu & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <RiMenu3Line size={24} />
            </button>
            <Link href="/" className="font-black text-2xl tracking-wide">
              مجله ترپفا
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {items.map((item) => (
              <Link
                key={item.link}
                href={`/${item.link}`}
                className={`relative py-5 text-sm font-medium transition-colors hover:text-violet-500`}
              >
                {item.title}
              </Link>
            ))}
          </div>

          {/* Auth & Telegram */}
          <div className="flex items-center gap-4">
            <a
              href="https://t.me/trxpfa"
              target="_blank"
              className="hidden md:flex items-center gap-1 text-violet-500"
            >
              <span className="font-medium">چنل تلگرام</span>
              <MdElectricBolt className="animate-spin" />
            </a>
            {user && profile ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-3 py-1.5 px-3 rounded-full bg-stone-900 hover:bg-stone-800 transition-all group"
              >
                <div className="w-7 h-7 rounded-full overflow-hidden bg-stone-800">
                  <Image
                    src={profile.avatar_url || "/default-avatar.jpg"}
                    alt={profile.display_name}
                    width={28}
                    height={28}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </div>
                <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                  {profile.display_name}
                </span>
              </Link>
            ) : (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-600 transition-all"
              >
                <FaUser className="text-lg" />
                <span className="font-medium">حساب کاربری</span>
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${
          isMenuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

        {/* Content */}
        <div className="relative h-full flex flex-col">
          {/* Close Button */}
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-3 right-4 p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <RiCloseLine size={24} />
          </button>

          {/* Menu Items */}
          <div className="flex-1 flex flex-col justify-center items-center gap-8 px-6">
            {items.map((item) => (
              <button
                key={item.link}
                onClick={() => handleNavigation(`/${item.link}`)}
                className="group relative text-2xl font-medium transition-colors hover:text-violet-500"
              >
                {item.title}
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-violet-500 transition-all group-hover:w-full" />
              </button>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="p-6 border-t border-white/10">
            <a
              href="https://t.me/trxpfa"
              target="_blank"
              className="flex items-center justify-center gap-2 bg-violet-500/10 text-violet-500 p-4 rounded-xl hover:bg-violet-500/20 transition-colors"
            >
              <span className="font-medium">چنل تلگرام</span>
              <MdElectricBolt className="animate-spin" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
