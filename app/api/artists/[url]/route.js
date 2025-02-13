import { NextResponse } from "next/server";
import { getArtistByUrl } from "@/lib/api";

export async function GET(request, { params }) {
  const artist = await getArtistByUrl(params.url);
  return NextResponse.json(artist || []);
}
