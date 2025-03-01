import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { apiCache, CACHE_TIME } from "@/lib/cache";

export const revalidate = 3600; // کش کردن برای 1 ساعت

export async function GET(request, { params }) {
  try {
    // چک کردن کش
    const cacheKey = `song_${params.url}`;
    const cachedData = apiCache.get(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    const { data, error } = await supabase
      .from("tracks")
      .select("*")
      .eq("url", params.url)
      .single();

    if (error) throw error;

    // ذخیره در کش
    apiCache.set(cacheKey, data, CACHE_TIME.MEDIUM);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("Error fetching track:", error);
    return NextResponse.json(
      { error: "Error fetching track" },
      { status: 500 }
    );
  }
}
