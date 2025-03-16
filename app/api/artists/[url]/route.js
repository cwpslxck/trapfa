import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { apiCache, CACHE_TIME } from "@/lib/cache";

export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  try {
    const cacheKey = `artist_${params.url}`;
    const cachedData = apiCache.get(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    const { data: artist, error } = await supabase
      .from("artists")
      .select("*")
      .eq("url", params.url)
      .single();

    if (error) {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url")
      .eq("id", artist.user_id)
      .single();

    if (profileError) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const transformedData = {
      ...artist,
      display_name: profile.display_name,
      avatar_url: profile.avatar_url,
    };

    // Cache the transformed data
    apiCache.set(cacheKey, transformedData, CACHE_TIME.VERY_LONG);

    return NextResponse.json(transformedData, {
      headers: {
        "Cache-Control":
          "public, s-maxage=86400, stale-while-revalidate=172800",
      },
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
