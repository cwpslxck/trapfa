import Link from "next/link";
import Image from "next/image";
import loading from "@/public/loadings/article.jpg";

function PostParts({ url, title, desc, author, date, image }) {
  return (
    <div className="w-full bg-stone-900 hover:bg-stone-900/80 duration-200 cursor-pointer text-white rounded-xl shadow shadow-black/10">
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
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              alt="نویسنده"
              src={loading}
              width={28}
              height={28}
              className="rounded-full aspect-square bg-white"
            />
            <span className="opacity-95">{author}</span>
          </div>
          <div className="text-white/95">{date}</div>
        </div>
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="font-extralight line-clamp-3 leading-snug opacity-80">
          {desc}
        </p>
      </div>
    </div>
  );
}

export default PostParts;
