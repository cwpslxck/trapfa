import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://trxpfa.blogix.ir/rss", {
      next: { revalidate: 3600 }, // کش کردن برای 1 ساعت
    });

    const text = await response.text();
    return new NextResponse(text, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error) {
    console.error("Error fetching RSS:", error);
    return new NextResponse("Error fetching RSS feed", { status: 500 });
  }
}
