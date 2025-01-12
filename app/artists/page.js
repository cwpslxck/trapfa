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
        const response = await fetch("/api/artists");
        if (!response.ok) {
          throw new Error("خطا در دریافت داده‌ها");
        }
        const data = await response.json();
        setArtists(data);
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
        title={"هنرمندان"}
        desc={
          "لیستی از افراد فعال توی نسل جدید موسیقی رپ فارسی از جمله پرودوسرها، کاورآرتیست ها و..."
        }
      />
      <BannerAds />
      {loading || error ? (
        <div className="space-y-4">
          <LoadingPart />
          <LoadingPart />
          <LoadingPart />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {artists.map((artist) => (
            <ArtistPart
              key={artist.id}
              url={artist.url}
              artistName={artist.name}
              image={artist.image}
              role={artist.role}
            />
          ))}
        </div>
      )}
    </div>
  );
}
