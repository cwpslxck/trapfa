"use client";
import Title from "@/components/Title";
import { getArtistByUrl } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  FaInstagram,
  FaSoundcloud,
  FaSpotify,
  FaTelegramPlane,
} from "react-icons/fa";

export default async function ArtistDetail({ params }) {
  const artist = await getArtistByUrl(params.url);

  const [current, setCurrent] = useState(0);

  return (
    <div className="">
      {/* Artist Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-8">
        <div className="w-full md:w-1/3 aspect-square relative rounded-lg overflow-hidden">
          <Image
            src={artist.image}
            alt={artist.url}
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
                  {artist.name}
                </h1>
                <h2 className="text-xl opacity-70">{artist.url}</h2>
              </div>
              {artist.role ? (
                <div>
                  <p>{artist.role}</p>
                </div>
              ) : (
                <span></span>
              )}
            </div>
            <div>
              <div className="flex items-start h-full gap-3 pt-3">
                <Link href={artist.instagram || ""} target="_blank">
                  <FaInstagram size={24} opacity={80} className="opacity-80" />
                </Link>
                <Link href={artist.telegram || ""} target="_blank">
                  <FaTelegramPlane size={24} className="opacity-80" />
                </Link>
              </div>
            </div>
          </div>
          <p className="text-gray-300 mt-2 mb-6 text-right leading-relaxed">
            {artist.bio}
          </p>
          {/* Music Platform buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href={artist.FaSoundcloud || ""}
              target="_blank"
              className="w-full flex items-center justify-center gap-2 text-lg bg-orange-600 rounded-md"
            >
              <button className="inline-flex justify-center items-center gap-3 font-bold py-3">
                ساندکلود
                <FaSoundcloud className="size-5" />
              </button>
            </Link>
            <Link
              href={artist.spotify || ""}
              target="_blank"
              className="w-full flex items-center justify-center gap-2 text-lg bg-green-600 rounded-md"
            >
              <button className="inline-flex justify-center items-center gap-3 font-bold py-3">
                اسپاتیفای
                <FaSpotify className="size-5" />
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div>
        {/* اطلاعات رو از tracks_artists_roles بگیر */}
        {/* آیدی ترک رو توی لوکال استوریج بگرد اگه بود */}
        {/* پرینت کن اطلاعاتشو */}
        {/* اگه نبود ریکوئست بزن به دیتابیس جدول ترک */}
        {/* فاینالی هروفت اطلاعات رو گرفتی ست لودینگ رو فالز کن */}
        <Title
          title={"آثار آرتیست"}
          desc={"تمام آهنگ هایی که این آرتیست نقشی توی شکل گیریشون داشته."}
        />
        <div className="overflow-x-hidden w-full min-h-12 bg-fuchsia-500">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {/* <div className="w-full h-full text-center">
            <Image
            loading="lazy"
            alt="Music Cover"
            src={loading}
            height={140}
            width={140}
            className="w-full h-auto rounded-lg bg-white mb-2"
            />
            <p>Test esm ahang</p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
