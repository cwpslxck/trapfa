import { NextResponse } from "next/server";

export async function GET() {
  try {
    const rssResponse = await fetch("https://trxpfa.blogix.ir/rss", {
      next: { revalidate: 2 },
    });

    if (!rssResponse.ok) {
      throw new Error(`خطا در دریافت RSS: ${rssResponse.status}`);
    }

    const xmlText = await rssResponse.text();

    return new NextResponse(
      JSON.stringify({
        feed: xmlText,
        timestamp: Date.now(),
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      }
    );
  } catch (error) {
    console.error("خطای سرور:", error);
    return new NextResponse(
      JSON.stringify({
        error: "خطا در دریافت اطلاعات",
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
