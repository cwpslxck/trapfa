import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { apiCache, CACHE_TIME } from "@/lib/cache";

export async function GET() {
  try {
    const cachedData = apiCache.get("artists_list");
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    const { data: artists, error } = await supabase
      .from("artists")
      .select("url, role, user_id, avatar_url");

    const { data: profiles, error: error1 } = await supabase
      .from("profiles")
      .select("id, display_name");

    if (error || error1) throw error;

    // Transform data by matching artists with their profiles
    const transformedData = artists.map((artist) => {
      const profile = profiles.find((p) => p.id === artist.user_id);
      return {
        url: artist.url,
        role: artist.role,
        display_name: profile?.display_name,
        avatar_url: artists?.avatar_url,
      };
    });

    // Cache the transformed data
    apiCache.set("artists_list", transformedData, CACHE_TIME.VERY_LONG);

    return NextResponse.json(transformedData, {
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
