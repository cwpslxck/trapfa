"use client";
import React, { useEffect, useState } from "react";
import LoadingPart from "@/components/LoadingPart";
import MusicParts from "@/components/MusicParts";
import Title from "@/components/Title";

function SongsPage() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cachedData = localStorage.getItem("cachedTracks");
        const cachedTimestamp = localStorage.getItem("cachedTimestamp");

        if (cachedData && cachedTimestamp) {
          const currentTime = new Date().getTime();
          const cacheDuration = 15 * 60 * 1000; // 5 minutes in milliseconds

          if (currentTime - parseInt(cachedTimestamp) < cacheDuration) {
            setTracks(JSON.parse(cachedData));
            setLoading(false);
            return;
          }
        }

        const response = await fetch("/api/songs");

        if (!response.ok) {
          throw new Error("خطا در دریافت داده‌ها");
        }

        const data = await response.json();
        setTracks(data);
        localStorage.setItem("cachedTracks", JSON.stringify(data));
        localStorage.setItem(
          "cachedTimestamp",
          new Date().getTime().toString()
        );
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 15 * 60 * 1000); // Fetch new data every 5 minutes

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div>
      <Title
        title={"جدیدترین ها"}
        desc={"لیستی از جدیدترین آهنگ های منتشر شده توسط آرتیست های نسل جدید"}
      />
      {loading || error ? (
        <LoadingPart />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {tracks.map((track, i) => (
            <MusicParts
              key={i}
              title={track.title}
              artistMain={track.artist_url}
              cover={track.cover}
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
