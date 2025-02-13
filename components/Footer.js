import Link from "next/link";
import { BsArrowUp } from "react-icons/bs";

const links = [
  {
    title: "تلگرام",
    url: "https://trxpfa.t.me",
    tick: true,
  },
  // {
  //   title: "اینستاگرام",
  //   url: "https://instagram.com/trxpfa",
  // },
  {
    title: "اکس",
    url: "https://x.com/trxpfa",
  },
  // {
  //   title: "استخدام",
  //   url: "/hire",
  // },
];

function Footer() {
  return (
    <footer className="w-full min-h-20 py-6 flex justify-center items-end mt-8 z-10">
      <div className="flex gap-6 flex-col md:flex-row justify-center items-center">
        {links.map((link, i) => (
          <Link
            target="_blank"
            key={i}
            href={link.url}
            className="inline-flex items-center gap-1"
          >
            {link.title}
            <span className="rotate-45">
              <BsArrowUp />
            </span>
          </Link>
        ))}
      </div>
    </footer>
  );
}

export default Footer;
