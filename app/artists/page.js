"use client";
import ArtistPart from "@/components/ArtistPart";
import BannerAds from "@/components/BannerAds";
import LoadingPart from "@/components/LoadingPart";
import Title from "@/components/Title";
import { useEffect, useState } from "react";
import { useError } from "@/components/ErrorContext";

export default function ArtistsPage() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useError();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/artists");
        if (!response.ok) throw new Error("خطا در دریافت داده‌ها");
        const data = await response.json();
        setArtists(data);
      } catch (error) {
        showError("خطا در دریافت لیست هنرمندان");
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
          "لیستی از افراد فعال توی نسل جدید موسیقی رپ فارسی از جمله پرودوسرها، کاورآرتیست‌ها و..."
        }
      />
      <BannerAds />
      {loading ? (
        <LoadingPart />
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
