import { getArtistByUrl } from "@/lib/api";
import Image from "next/image";
import loading from "@/public/loadings/artist.jpg";

export default async function ArtistDetail({ params }) {
  const artist = await getArtistByUrl(params.url);

  return (
    <div>
      <Image
        draggable="false"
        priority
        width={300}
        height={300}
        className="rounded-xl w-1/3 h-full object-cover bg-stone-900"
        src={artist.image || loading}
        alt="Artist Image"
      />
      <p>{artist.name}</p>
      <p>{artist.role}</p>
      <p>{artist.bio}</p>
    </div>
  );
}
