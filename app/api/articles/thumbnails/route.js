import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const supabase = createServerComponentClient({ cookies });
    const { article_url, thumbnail_url } = await req.json();

    const { data, error } = await supabase
      .from("article_thumbnails")
      .upsert({ article_url, thumbnail_url }, { onConflict: "article_url" });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving thumbnail:", error);
    return NextResponse.json(
      { error: "Failed to save thumbnail" },
      { status: 500 }
    );
  }
}
