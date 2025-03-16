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
    <>
      <Title
        title={"افراد"}
        desc={
          "لیستی از افراد فعال در کامیونیتی از جمله: خواننده ها، بیت میکر ها، میکس من ها، گرافیک آرتیست ها و..."
        }
      />
      {loading ? (
        <LoadingPart />
      ) : artists.length > 0 ? (
        artists.map((artist, index) => (
          <div
            key={index}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
          >
            <ArtistPart
              url={artist.url}
              artistName={artist.display_name}
              image={artist.avatar_url}
              role={artist.role}
            />
          </div>
        ))
      ) : (
        <p className="text-center text-gray-400 col-span-full">
          هیچ فردی یافت نشد.
        </p>
      )}
    </>
  );
}
