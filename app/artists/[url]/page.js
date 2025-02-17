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
  FaHeadphones,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import LoadingPart from "@/components/LoadingPart";

export default function ArtistDetail({ params }) {
  const { url } = use(params);
  const artist = use(getArtistByUrl(url));

  if (!artist) {
    return (
      <p className="text-center text-gray-400">آرتیست موردنظر یافت نشد.</p>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Hero Section */}
      <div className="relative h-[40vh] rounded-2xl overflow-hidden">
        <Image
          src={artist.image || "/default-avatar.jpg"}
          alt={artist.name || "آرتیست"}
          width={600}
          height={600}
          className="object-cover h-full w-full"
          loading="eager"
        />
        <div className="absolute inset-0 backdrop-blur-md bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

        {/* Artist Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="flex items-end justify-between">
            <div className="space-y-3">
              <span className="tracking-wider opacity-70 font-extralight">
                {artist.url || ""}
              </span>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl md:text-5xl font-black">
                  {artist.name || "بدون نام"}
                </h1>
                <MdVerified className="text-violet-500 size-6" />
              </div>
            </div>
            <div>
              <Image
                src={artist.image || "/default-avatar.jpg"}
                alt={artist.name || "آرتیست"}
                width={600}
                height={600}
                priority
                className="object-cover size-48 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Social Links & Streaming */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex gap-3">
          <Link
            href={artist.instagram || ""}
            target="_blank"
            className="bg-gradient-to-br from-purple-600 to-pink-600 p-4 rounded-xl hover:opacity-90 transition-all"
          >
            <FaInstagram size={24} />
          </Link>
          <Link
            href={artist.telegram || ""}
            target="_blank"
            className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl hover:opacity-90 transition-all"
          >
            <FaTelegramPlane size={24} />
          </Link>
        </div>

        <div className="flex gap-4">
          <Link
            href={artist.soundcloud || ""}
            target="_blank"
            className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:opacity-90 transition-all"
          >
            <button className="w-full h-full inline-flex justify-center items-center gap-3 font-bold py-4">
              <FaSoundcloud size={24} />
              ساندکلود
            </button>
          </Link>

          <Link
            href={artist.spotify || ""}
            target="_blank"
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:opacity-90 transition-all"
          >
            <button className="w-full h-full inline-flex justify-center items-center gap-3 font-bold py-4">
              <FaSpotify size={24} />
              اسپاتیفای
            </button>
          </Link>
        </div>
      </div>

      {/* Bio Section */}
      {artist.bio && (
        <div className="bg-stone-900 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-violet-500 rounded-full"></span>
            بیوگرافی
          </h2>
          <p className="text-stone-300 leading-relaxed whitespace-pre-wrap">
            {artist.bio}
          </p>
        </div>
      )}

      {/* Tracks Section */}
      <div>
        <Title
          title="آثار آرتیست"
          desc={`تمام آهنگ‌هایی که ${artist.name} توی اونا حضور داشته`}
        />
        <LoadingPart />
      </div>
    </div>
  );
}
