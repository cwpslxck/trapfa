"use client";
import React, { useEffect, useState } from "react";
import LoadingPart from "@/components/LoadingPart";
import MusicParts from "@/components/MusicParts";
import Title from "@/components/Title";
import { useError } from "@/components/ErrorContext";

function SongsPage() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useError();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/songs");
        if (!response.ok) throw new Error("خطا در دریافت داده‌ها");
        const data = await response.json();
        setTracks(data);
      } catch (error) {
        showError("خطا در دریافت آهنگ‌ها");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Title
        title={"آهنگ‌ها"}
        desc={`لیستی از آهنگ‌های منتشر شده با همکاری افراد کامیونیتی`}
      />

      {loading ? (
        <LoadingPart />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tracks.length > 0 ? (
            tracks.map((track) => (
              <MusicParts
                key={track.id}
                url={track.url}
                title={track.title}
                artist={track.artist}
                image={track.image}
                date={track.release_date}
              />
            ))
          ) : (
            <p className="text-center text-gray-400 col-span-full">
              هیچ آهنگی یافت نشد.
            </p>
          )}
        </div>
      )}
    </>
  );
}

export default SongsPage;
