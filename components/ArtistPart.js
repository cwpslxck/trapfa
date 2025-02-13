import React from "react";
import Image from "next/image";
import Link from "next/link";
import loading from "@/public/loadings/artist.jpg";

function ArtistPart({ image, artistName, role, url }) {
  return (
    <Link
      href={`/artists/${url}`}
      className="w-full rounded-xl relative cursor-pointer block"
      id={url}
    >
      <Image
        draggable="false"
        priority
        width={300}
        height={300}
        className="rounded-xl w-full h-full object-cover bg-stone-900"
        src={image || loading}
        alt="Artist Image"
      />
      {/* {fire ? (
      <div className="absolute top-4 right-2 text-violet-500 animate-bounce">
        <FaFire className="size-8" />
      </div>
      ) : (
        <span></span>
      )} */}
      <div className="p-1.5 absolute inset-0 h-full w-full bg-gradient-to-b from-black/0 via-black/10 to-black/50 hover:from-black/10 hover:via-black/20 hover:to-black/50 transition-all">
        <div className="flex flex-col justify-between items-center h-full w-full">
          {role ? (
            <div className="py-0.5 px-2 text-sm rounded-full bg-white/10 backdrop-blur-lg">
              {role}
            </div>
          ) : (
            <div></div>
          )}
          <h2 className="font-bold leading-snug text-xl uppercase tracking-wide">
            {artistName}
          </h2>
        </div>
      </div>
    </Link>
  );
}

export default ArtistPart;
