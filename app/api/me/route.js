import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { apiCache, CACHE_TIME } from "@/lib/cache";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "not connected" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const cookieStore = cookies();
    const supabase = createServerComponentClient({
      cookies: () => cookieStore,
    });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "not connected" }, { status: 401 });
    }

    // چک کردن کش
    const cachedProfile = apiCache.get(user.id, "profile");
    if (cachedProfile) {
      return NextResponse.json(cachedProfile);
    }

    // گرفتن پروفایل از دیتابیس
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const userData = {
      id: user.id,
      email: user.email,
      ...profile,
    };

    // ذخیره در کش با TTL طولانی‌تر
    apiCache.set(user.id, userData, CACHE_TIME.MEDIUM, "profile");

    return NextResponse.json(userData, {
      headers: {
        "Cache-Control": "private, max-age=1800",
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

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "not connected" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const body = await req.json();
    const cookieStore = cookies();
    const supabase = createServerComponentClient({
      cookies: () => cookieStore,
    });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "not connected" }, { status: 401 });
    }

    const { error: updateError } = await supabase.from("profiles").upsert({
      id: user.id,
      ...body,
      updated_at: new Date().toISOString(),
    });

    if (updateError) throw updateError;

    // پاک کردن کش پروفایل
    apiCache.clear(user.id, "profile");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
