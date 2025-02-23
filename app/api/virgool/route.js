import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const supabase = createServerComponentClient({ cookies });

    // دریافت RSS
    const response = await fetch("https://virgool.io/trapfa/feed", {
      next: { revalidate: 1 * 60 * 60 }, // کش کردن برای 1 ساعت
    });
    const xmlText = await response.text();

    // دریافت تامبنیل‌ها از دیتابیس با کش 1 ساعته
    const { data: thumbnails } = await supabase
      .from("article_thumbnails")
      .select("article_url, thumbnail_url")
      .order("created_at", { ascending: false })
      .limit(50)
      .cache(3600); // کش برای 1 ساعت

    // تبدیل به آبجکت برای دسترسی راحت‌تر
    const thumbnailMap = Object.fromEntries(
      thumbnails?.map((t) => [t.article_url, t.thumbnail_url]) || []
    );

    return new NextResponse(
      JSON.stringify({
        feed: xmlText,
        thumbnails: thumbnailMap,
        timestamp: Date.now(), // برای کنترل اعتبار کش
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching RSS:", error);
    return new NextResponse("Error fetching RSS feed", { status: 500 });
  }
}
