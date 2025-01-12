import { NextResponse } from "next/server";
import { getAllTracks } from "@/lib/api";

export async function GET(request) {
  const tracks = await getAllTracks();
  return NextResponse.json(tracks);
}
