import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { apiCache, CACHE_TIME } from "@/lib/cache";

export const revalidate = 3600; // کش کردن برای 1 ساعت

export async function GET() {
  try {
    // چک کردن کش
    const cachedData = apiCache.get("songs_list");
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    const { data, error } = await supabase
      .from("tracks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // ذخیره در کش
    apiCache.set("songs_list", data, CACHE_TIME.MEDIUM);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("Error fetching tracks:", error);
    return NextResponse.json(
      { error: "Error fetching tracks" },
      { status: 500 }
    );
  }
}
