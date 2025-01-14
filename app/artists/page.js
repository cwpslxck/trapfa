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
          const cacheDuration = 15 * 60 * 1000; //

          if (currentTime - parseInt(cachedTimestamp) < cacheDuration) {
            setArtists(JSON.parse(cachedData));
            setLoading(false);
            return;
          }
        }

        const response = await fetch("/api/artists");

        if (!response.ok) {
          throw new Error("خطا در دریافت داده‌ها");
        }

        const data = await response.json();
        setArtists(data);
        localStorage.setItem("cachedArtists", JSON.stringify(data));
        localStorage.setItem(
          "cachedArtistsTimestamp",
          new Date().getTime().toString()
        );
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 15 * 60 * 1000); // Fetch new data every 15 minutes

    return () => clearInterval(interval); // Cleanup interval on component unmount
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
        <LoadingPart />
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
