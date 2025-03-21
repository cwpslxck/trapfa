import Link from "next/link";
import { MdElectricBolt } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Right Side */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/" className="font-black text-xl">
              مجله ترپفا
            </Link>
            <p className="text-sm text-white/50">
              پوشش اخبار و اتفاقات نسل جدید موسیقی رپ فارسی
            </p>
          </div>

          {/* Left Side */}
          <div className="flex items-center gap-6">
            <Link
              href="/hire"
              className="text-sm text-white/70 hover:text-white"
            >
              استخدام
            </Link>
            <Link
              href="/contact"
              className="text-sm text-white/70 hover:text-white"
            >
              تماس با ما
            </Link>
            <a
              href="https://trxpfa.t.me"
              target="_blank"
              className="flex items-center gap-1 bg-violet-500/10 text-violet-500 px-4 py-2 rounded-lg hover:bg-violet-500/20 transition-colors"
            >
              <span className="font-medium">چنل تلگرام</span>
              <MdElectricBolt className="animate-spin" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
