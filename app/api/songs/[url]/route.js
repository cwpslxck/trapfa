import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const revalidate = 3600; // کش کردن برای 1 ساعت

export async function GET(request, { params }) {
  try {
    const { data, error } = await supabase
      .from("tracks")
      .select("*")
      .eq("url", params.url)
      .single();

    if (error) throw error;

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
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
