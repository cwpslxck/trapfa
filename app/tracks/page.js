"use client";
import React, { useEffect, useState } from "react";
import LoadingPart from "@/components/LoadingPart";
import MusicParts from "@/components/MusicParts";
import Title from "@/components/Title";

function SongsPage() {
  const [tracks, setTracks] = useState([]); // تغییر نام state به tracks
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/songs");

        if (!response.ok) {
          throw new Error("خطا در دریافت داده‌ها");
        }

        const data = await response.json();
        setTracks(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <div>
      <Title
        title={"جدیدترین ها"}
        desc={"لیستی از جدیدترین آهنگ های منتشر شده توسط آرتیست های نسل جدید"}
      />
      {loading || error ? (
        <div className="space-y-4">
          <LoadingPart />
          <LoadingPart />
          <LoadingPart />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {tracks.map((track, i) => (
            <MusicParts
              key={i}
              title={track.title}
              artistMain={track.artist_url}
              cover={track.cover} // نمایش نام هنرمند(ها)
              spotify={track.spotify}
              soundcloud={track.soundcloud}
              youtube={track.youtube}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SongsPage;
