import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // دریافت RSS
    const rssResponse = await fetch("https://virgool.io/trapfa/feed", {
      next: { revalidate: 2 }, // کش کردن برای 1 ساعت
    });

    if (!rssResponse.ok) {
      throw new Error(`Failed to fetch RSS: ${rssResponse.status}`);
    }

    const xmlText = await rssResponse.text();

    // دریافت تامبنیل‌ها
    try {
      const supabase = createServerComponentClient({ cookies });
      const { data: thumbnails, error: thumbnailError } = await supabase
        .from("article_thumbnails")
        .select("article_url, thumbnail_url")
        .order("created_at", { ascending: false })
        .limit(50);

      if (thumbnailError) {
        console.error("Thumbnail fetch error:", thumbnailError);
        // اگر خطای تامبنیل داشتیم، با تامبنیل خالی ادامه میدیم
        return new NextResponse(
          JSON.stringify({
            feed: xmlText,
            thumbnails: {},
            timestamp: Date.now(),
          }),
          {
            headers: {
              "Content-Type": "application/json",
              "Cache-Control":
                "public, s-maxage=3600, stale-while-revalidate=7200",
            },
          }
        );
      }

      // تبدیل به آبجکت
      const thumbnailMap = Object.fromEntries(
        thumbnails?.map((t) => [t.article_url, t.thumbnail_url]) || []
      );

      return new NextResponse(
        JSON.stringify({
          feed: xmlText,
          thumbnails: thumbnailMap,
          timestamp: Date.now(),
        }),
        {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control":
              "public, s-maxage=3600, stale-while-revalidate=7200",
          },
        }
      );
    } catch (dbError) {
      console.error("Database error:", dbError);
      // در صورت خطای دیتابیس، فقط RSS رو برمیگردونیم
      return new NextResponse(
        JSON.stringify({
          feed: xmlText,
          thumbnails: {},
          timestamp: Date.now(),
        }),
        {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control":
              "public, s-maxage=3600, stale-while-revalidate=7200",
          },
        }
      );
    }
  } catch (error) {
    console.error("Server error:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Error fetching data",
        details: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
