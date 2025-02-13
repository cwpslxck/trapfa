import Link from "next/link";
import { FaUserAlt } from "react-icons/fa";
import { MdElectricBolt } from "react-icons/md";

function Header() {
  const items = [
    {
      title: "مقاله‌ها",
      link: "articles",
    },
    {
      title: "هنرمندان",
      link: "artists",
    },
    {
      title: "آهنگ‌ها",
      link: "tracks",
    },
  ];
  return (
    <>
      <header className="w-full h-20 flex justify-between items-center px-6 md:px-16 lg:px-24">
        <div className="inline-flex gap-6 items-center">
          <Link
            className="font-black text-2xl items-center inline-flex gap-2"
            href="/"
          >
            مجله ترپفا
          </Link>
          <ul className="inline-flex gap-6 items-center">
            {/* add hidden 4 mobile view */}
            {items.map((item, i) => (
              <li key={i}>
                <Link href={`/${item.link}`}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden bg-white/10 rounded-xl px-20">search box</div>
        <div className="inline-flex items-center gap-4">
          <a
            target="_blank"
            className="items-center gap-0.5 text-violet-500 hidden md:inline-flex"
            href="https://trxpfa.t.me"
          >
            <span className="font-bold text-base">چنل تلگرام</span>
            <MdElectricBolt className="animate-spin" />
          </a>
          <Link
            href={"/auth"}
            className="size-10 text-xl rounded-lg transition-all bg-transparent hover:bg-stone-900 flex justify-center items-center"
          >
            <FaUserAlt />
          </Link>
        </div>
      </header>
    </>
  );
}

export default Header;
