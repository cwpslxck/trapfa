"use client";
import { use, useEffect, useState } from "react";
import Title from "@/components/Title";
import Image from "next/image";
import Link from "next/link";
import {
  FaInstagram,
  FaSoundcloud,
  FaSpotify,
  FaTelegramPlane,
} from "react-icons/fa";
import LoadingPart from "@/components/LoadingPart";
import { useError } from "@/components/ErrorContext";

export default function ArtistDetail({ params }) {
  const { url } = use(params);
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showError } = useError();

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await fetch(`/api/artists/${url}`);
        if (!response.ok) throw new Error("Failed to fetch artist");

        const data = await response.json();
        setArtist(data);
      } catch (error) {
        console.error("Error fetching artist:", error);
        showError("خطا در دریافت اطلاعات هنرمند");
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [url]);

  if (loading) {
    return <LoadingPart />;
  }

  if (!artist) {
    return (
      <p className="text-center text-gray-400">آرتیست موردنظر یافت نشد.</p>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-2">
        <Link
          href="/x"
          className="flex items-center gap-2 py-2 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 transition-all group w-fit"
        >
          <span className="font-medium">بازگشت به لیست هنرمندان</span>
        </Link>
      </div>
      {/* Hero Section */}
      <div className="relative h-[40vh] rounded-2xl overflow-hidden">
        <Image
          src={artist.avatar_url || "/default-avatar.jpg"}
          alt={artist.display_name || "آرتیست"}
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
                  {artist.display_name || "بدون نام"}
                </h1>
                {/* badges goes here */}
              </div>
            </div>
            <div>
              <Image
                src={artist.avatar_url || "/default-avatar.jpg"}
                alt={artist.display_name || "آرتیست"}
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
          {artist.instagram && (
            <Link
              href={artist.instagram}
              target="_blank"
              className="bg-gradient-to-br from-purple-600 to-pink-600 p-4 rounded-xl hover:opacity-90 transition-all"
            >
              <FaInstagram size={24} />
            </Link>
          )}
          {artist.telegram && (
            <Link
              href={artist.telegram}
              target="_blank"
              className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl hover:opacity-90 transition-all"
            >
              <FaTelegramPlane size={24} />
            </Link>
          )}
        </div>

        <div className="flex gap-4">
          {artist.soundcloud && (
            <Link
              href={artist.soundcloud}
              target="_blank"
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:opacity-90 transition-all"
            >
              <button className="w-full h-full inline-flex justify-center items-center gap-3 font-bold py-4">
                <FaSoundcloud size={24} />
                ساندکلود
              </button>
            </Link>
          )}

          {artist.spotify && (
            <Link
              href={artist.spotify}
              target="_blank"
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:opacity-90 transition-all"
            >
              <button className="w-full h-full inline-flex justify-center items-center gap-3 font-bold py-4">
                <FaSpotify size={24} />
                اسپاتیفای
              </button>
            </Link>
          )}
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
          desc={`تمام آهنگ‌هایی که ${artist.display_name} توی اونا حضور داشته`}
        />
        <LoadingPart />
      </div>
    </div>
  );
}
