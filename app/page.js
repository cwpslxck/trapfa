import BannerAds from "@/components/BannerAds";
import Link from "next/link";
import { FaHeadphones, FaUsers, FaNewspaper, FaPlay } from "react-icons/fa";
import { MdWavingHand } from "react-icons/md";
import { HiSparkles } from "react-icons/hi";
import { BiLogIn } from "react-icons/bi";

function Home() {
  const sections = [
    {
      title: "آهنگ‌ها",
      desc: "جدیدترین آهنگ‌های منتشر شده",
      link: "/play",
      icon: <FaHeadphones className="text-4xl mb-4 text-violet-500" />,
      gradient: "from-violet-500/20 to-transparent",
    },
    {
      title: "هنرمندان",
      desc: "لیست کامل آرتیست‌های نسل جدید",
      link: "/x",
      icon: <FaUsers className="text-4xl mb-4 text-emerald-500" />,
      gradient: "from-emerald-500/20 to-transparent",
    },
    {
      title: "مقاله‌ها",
      desc: "آخرین مقالات منتشر شده",
      link: "/posts",
      icon: <FaNewspaper className="text-4xl mb-4 text-rose-500" />,
      gradient: "from-rose-500/20 to-transparent",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Hero Section */}
      <div className="flex text-center items-center flex-col gap-8 p-8 md:p-12 lg:p-16">
        <div className="space-y-6 flex flex-col justify-center items-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black">
            <span className="text-white">مجله موسیقی</span>{" "}
            <span className="text-violet-500">ترپفا</span>
          </h1>

          <p className="text-lg md:text-xl text-stone-400 leading-relaxed">
            پوشش اخبار و اتفاقات نسل جدید موسیقی رپ فارسی. همراه با جدیدترین
            آهنگ‌ها، مقالات و اخبار هنرمندان.
          </p>
        </div>
      </div>

      <BannerAds />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section, i) => (
          <Link
            key={i}
            href={section.link}
            className="group bg-stone-900 hover:bg-stone-800 transition-all rounded-xl p-6"
          >
            {section.icon}
            <h2 className="text-2xl font-bold mb-2">{section.title}</h2>
            <p className="text-stone-400">{section.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
