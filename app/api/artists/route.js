import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { apiCache, CACHE_TIME } from "@/lib/cache";

export async function GET() {
  try {
    // چک کردن کش
    const cachedData = apiCache.get("artists_list");
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    const { data, error } = await supabase
      .from("artists")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // ذخیره در کش با TTL طولانی‌تر
    apiCache.set("artists_list", data, CACHE_TIME.VERY_LONG);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control":
          "public, s-maxage=86400, stale-while-revalidate=172800",
      },
    });
  } catch (error) {
    console.error("Error fetching artists:", error);
    return NextResponse.json(
      { error: "Error fetching artists" },
      { status: 500 }
    );
  }
}
