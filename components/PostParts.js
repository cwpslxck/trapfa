import Link from "next/link";
import Image from "next/image";
import { FaCalendar, FaUser } from "react-icons/fa";

export default function PostParts({ url, title, desc, author, date, image }) {
  return (
    <Link href={`/posts/${url}`} className="block bg-stone-950 h-full group">
      <div className="flex flex-col h-full">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />
        </div>

        <div className="flex-1 p-5">
          <h2 className="text-xl font-bold mb-3 text-white/90 line-clamp-2 group-hover:text-white transition-colors">
            {title}
          </h2>

          <p
            className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-4"
            dangerouslySetInnerHTML={{ __html: desc }}
          ></p>

          <div className="mt-auto pt-4 border-t border-stone-800/50">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <FaUser className="w-3 h-3" />
                <span>{author}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCalendar className="w-3 h-3" />
                <span>{date}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
