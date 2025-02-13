import Link from "next/link";
import Image from "next/image";
import loading from "@/public/loadings/article.jpg";

function PostParts({ url, title, desc, img }) {
  return (
    <div
      href={`/articles/${url}`}
      className="w-full bg-stone-900 hover:bg-stone-900/80 transition-opacity text-white rounded-xl shadow shadow-black/10"
    >
      <Link href={`/articles/${url}`}>
        <Image
          draggable="false"
          width={400}
          height={285}
          loading="lazy"
          className="w-full h-52 rounded-t-xl object-cover invert"
          alt={title || "Image"}
          src={img || loading}
        />
      </Link>
      <div className="h-auto flex flex-col">
        <div className="w-full h-12 p-1 flex justify-between items-end -mt-12">
          <div className="flex gap-1">
            <div className="bg-red-500/80 backdrop-blur text-white px-2 py-0.5 text-sm font-light rounded-md">
              پست ویدیویی
            </div>
          </div>
        </div>
        <div className="w-full h-auto pt-3 pb-2 px-3">
          <div className="line-clamp-3">
            <p className="font-semibold text-xl">
              <Link href={`/articles/${url}`}>{title}</Link>
            </p>
            <div className="flex flex-row justify-between items-center">
              <Link
                href={`/trapfa`}
                className="font-extralight flex items-center gap-1.5 flex-row opacity-85 hover:opacity-100"
              >
                <Image
                  alt="Media Profile"
                  src={loading}
                  className="size-7 rounded-full bg-white"
                />
                <span>ترپفا</span>
              </Link>
              <div className="text-white px-2 py-0.5 text-sm font-light rounded-md">
                21:07 25 دی 03
              </div>
            </div>
            <p className="font-extralight leading-snug opacity-80">{desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostParts;
