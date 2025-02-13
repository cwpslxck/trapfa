"use client";
import ArtistPart from "@/components/ArtistPart";
import BannerAds from "@/components/BannerAds";
import LoadingPart from "@/components/LoadingPart";
import Title from "@/components/Title";
import { useEffect, useState } from "react";

export default function ArtistsPage() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cachedData = localStorage.getItem("cachedArtists");
        const cachedTimestamp = localStorage.getItem("cachedArtistsTimestamp");

        if (cachedData && cachedTimestamp) {
          const currentTime = new Date().getTime();
          const cacheDuration = 15 * 60 * 1000; // 15 دقیقه کش

          if (currentTime - parseInt(cachedTimestamp) < cacheDuration) {
            const parsedData = JSON.parse(cachedData);
            if (Array.isArray(parsedData)) {
              setArtists(parsedData);
            }
            setLoading(false);
            return;
          }
        }

        const response = await fetch("/api/artists");

        if (!response.ok) {
          throw new Error("خطا در دریافت داده‌ها");
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setArtists(data);
          localStorage.setItem("cachedArtists", JSON.stringify(data));
          localStorage.setItem(
            "cachedArtistsTimestamp",
            new Date().getTime().toString()
          );
        } else {
          throw new Error("داده‌های دریافتی نامعتبر هستند.");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 15 * 60 * 1000); // هر 15 دقیقه یکبار دیتا رو بروز کن

    return () => clearInterval(interval); // پاک کردن تایمر هنگام خروج از صفحه
  }, []);

  return (
    <div>
      <Title
        title={"هنرمندان"}
        desc={
          "لیستی از افراد فعال توی نسل جدید موسیقی رپ فارسی از جمله پرودوسرها، کاورآرتیست‌ها و..."
        }
      />
      <BannerAds />
      {loading ? (
        <LoadingPart />
      ) : error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {artists.length > 0 ? (
            artists.map((artist) => (
              <ArtistPart
                key={artist.id}
                url={artist.url}
                artistName={artist.name}
                image={artist.image || "/default-avatar.jpg"}
                role={artist.role}
              />
            ))
          ) : (
            <p className="text-center text-gray-400 col-span-full">
              هیچ هنرمندی یافت نشد.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
