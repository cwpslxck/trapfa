import Link from "next/link";
import Image from "next/image";
import cover from "@/public/loadings/article.jpg";

function PostParts({ url, title, desc, img, min }) {
  return (
    <Link
      href={`/articles/${url}`}
      className="w-full bg-stone-900 hover:bg-stone-900/80 rounded-xl"
    >
      <Image
        draggable="false"
        width={400}
        height={285}
        loading="lazy"
        className="w-full h-auto rounded-t-xl object-cover hover:brightness-90"
        alt={title || "Image"}
        src={img || cover}
      />
      <div className="h-auto -mt-12 flex flex-col">
        <div className="w-full h-12 z-20 p-1 flex justify-between items-end">
          <div className="flex gap-1">
            <div className="bg-black px-2 py-0.5 text-sm font-light rounded-md">
              زمان مطالعه: {min || "پنج"} دقیقه
            </div>
          </div>
          {/* <div className="flex gap-1">
            <div className="bg-red-500 px-2 py-0.5 text-sm font-light rounded-md">
              پست ویدیویی
            </div>
          </div> */}
        </div>
        <div className="w-full h-auto pt-3 pb-2 px-3">
          <div className="line-clamp-3">
            <p className="font-semibold text-xl">
              {/* <span className="text-violet-400 font-thin tracking-tighter">
                <span>ترپفا</span>
                <span>: </span>
              </span> */}
              {title}
            </p>
            <p className="font-thin leading-snug opacity-80">{desc}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PostParts;
