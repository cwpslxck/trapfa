import { NextResponse } from "next/server";
import { getAllArtists } from "@/lib/api";

export async function GET(request) {
  const artists = await getAllArtists();
  return NextResponse.json(artists || []);
}
