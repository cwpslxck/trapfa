import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const revalidate = 3600; // کش کردن برای 1 ساعت

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("artists")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
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
