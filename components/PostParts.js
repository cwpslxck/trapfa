import Link from "next/link";
import Image from "next/image";
import loading from "@/public/loadings/article.jpg";

function PostParts({ url, title, desc, author, category, date, image }) {
  return (
    <div className="w-full bg-stone-900 hover:bg-stone-900/80 transition-opacity text-white rounded-xl shadow shadow-black/10">
      <Link href={`/articles/${url}`}>
        <Image
          draggable="false"
          width={400}
          height={285}
          loading="lazy"
          className="w-full aspect-[16/9] rounded-t-xl object-cover"
          alt={title || "Image"}
          src={image || loading}
        />
      </Link>
      <div className="p-4">
        <div className="flex items-center justify-between mt-4">
          <div className="bg-violet-500/80 backdrop-blur text-white px-2 py-0.5 text-sm font-light rounded-md">
            {category}
          </div>
          <div className="text-white/70 text-sm">{date}</div>
        </div>
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="font-extralight leading-snug opacity-80 mb-4">{desc}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              alt="نویسنده"
              src={loading}
              width={28}
              height={28}
              className="rounded-full bg-white"
            />
            <span className="text-sm opacity-70">{author}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostParts;
