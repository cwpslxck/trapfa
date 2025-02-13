"use client";
import { use } from "react";
import Title from "@/components/Title";
import { getArtistByUrl } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import {
  FaInstagram,
  FaSoundcloud,
  FaSpotify,
  FaTelegramPlane,
} from "react-icons/fa";
import LoadingPart from "@/components/LoadingPart";

export default function ArtistDetail({ params }) {
  const { url } = use(params); // 👈 حالا params یک Promise هست و باید از use() استفاده کنیم
  const artist = use(getArtistByUrl(url)); // 👈 گرفتن اطلاعات آرتیست به روش جدید

  if (!artist) {
    return (
      <p className="text-center text-gray-400">آرتیست موردنظر یافت نشد.</p>
    );
  }

  return (
    <div className="">
      {/* Artist Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-8">
        <div className="w-full md:w-1/3 aspect-square relative rounded-lg overflow-hidden">
          <Image
            src={artist.image || "/default-avatar.jpg"}
            alt={artist.name || "آرتیست"}
            width={200}
            height={200}
            draggable="false"
            className="object-cover h-full w-full bg-stone-900"
            priority
            loading="eager"
          />
        </div>
        <div className="w-full flex flex-col h-full justify-between">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <div className="inline-flex items-center gap-3">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  {artist.name || "بدون نام"}
                </h1>
                <h2 className="text-xl opacity-70">{artist.url}</h2>
              </div>
              {artist.role && <p>{artist.role}</p>}
            </div>
            <div className="flex items-start h-full gap-3 pt-3">
              {artist.instagram && (
                <Link href={artist.instagram} target="_blank">
                  <FaInstagram size={24} className="opacity-80" />
                </Link>
              )}
              {artist.telegram && (
                <Link href={artist.telegram} target="_blank">
                  <FaTelegramPlane size={24} className="opacity-80" />
                </Link>
              )}
            </div>
          </div>
          {/* <p className="text-gray-300 mt-2 mb-6 text-right leading-relaxed">
            {artist.bio || "بیوگرافی ثبت نشده است."}
          </p> */}
          {/* Music Platform buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {artist.soundcloud && (
              <Link
                href={artist.soundcloud}
                target="_blank"
                className="w-full flex items-center justify-center gap-2 text-lg bg-orange-600 rounded-md"
              >
                <button className="inline-flex justify-center items-center gap-3 font-bold py-3">
                  ساندکلود
                  <FaSoundcloud className="size-5" />
                </button>
              </Link>
            )}
            {artist.spotify && (
              <Link
                href={artist.spotify}
                target="_blank"
                className="w-full flex items-center justify-center gap-2 text-lg bg-green-600 rounded-md"
              >
                <button className="inline-flex justify-center items-center gap-3 font-bold py-3">
                  اسپاتیفای
                  <FaSpotify className="size-5" />
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
      <div>
        <Title
          title={"آثار آرتیست"}
          desc={`تمام آهنگ‌هایی که ${artist.name} توی اونا حضور داشته.`}
        />
        <LoadingPart />
      </div>
    </div>
  );
}
