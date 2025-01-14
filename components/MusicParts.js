import Image from "next/image";
import Link from "next/link";
import loading from "@/public/loadings/track.jpg";

function MusicParts({
  spotify,
  soundcloud,
  youtube,
  title,
  cover,
  artistMain,
}) {
  return (
    <Link
      target="_blank"
      href={soundcloud || spotify || youtube || ""}
      className="bg-stone-900 hover:bg-stone-900/80 transition-colors w-full h-16 rounded-md p-2"
    >
      <div className="flex justify-between items-center h-full w-full">
        <div className="h-full w-full flex flex-row-reverse justify-start items-center">
          <Image
            draggable="false"
            width={100}
            height={100}
            loading="lazy"
            alt={title || "Music Cover"}
            src={cover || loading}
            className="h-full w-auto bg-stone-800 rounded"
          />
          <div className="px-2 pt-1 flex -space-y-1 justify-centr items-end flex-col">
            <span className="text-lg tracking-wider font-extrabold">
              {title}
            </span>
            <span
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = [`/artists/${artistMain}`];
            }}
              className="opacity-70 hover:opacity-80 transition-all font-extralight text-sm"
              >
              {artistMain}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default MusicParts;
