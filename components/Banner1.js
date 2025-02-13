import Link from "next/link";
import "dotenv/config";

function Banner1({ className, url, desc, title }) {
  return (
    <Link
      target="_blank"
      href={url || ""}
      className={`${className} bg-gradient-to-l min-h-32 hover:bg-gradient-to-r text-center w-full flex flex-col justify-center items-center gap-2 rounded-xl p-6`}
    >
      <h2 className="text-2xl font-semibold">{title}</h2>
      <h2>{desc}</h2>
    </Link>
  );
}

export default Banner1;
