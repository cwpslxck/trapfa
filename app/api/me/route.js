import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// کش برای نگهداری پروفایل‌ها
const CACHE_TIME = 5 * 60 * 1000; // 5 دقیقه
const profileCache = new Map();

// تابع پاک کردن کش برای یک کاربر
const clearUserCache = (userId) => {
  profileCache.delete(userId);
};

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
    const cachedProfile = profileCache.get(user.id);
    if (cachedProfile && Date.now() - cachedProfile.timestamp < CACHE_TIME) {
      return NextResponse.json(cachedProfile.data);
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

    // ذخیره در کش
    const userData = {
      id: user.id,
      email: user.email,
      ...profile,
    };

    profileCache.set(user.id, {
      data: userData,
      timestamp: Date.now(),
    });

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// آپدیت پروفایل
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

    // آپدیت پروفایل در دیتابیس
    const { error: updateError } = await supabase.from("profiles").upsert({
      id: user.id,
      ...body,
      updated_at: new Date().toISOString(),
    });

    if (updateError) {
      throw updateError;
    }

    // پاک کردن کش کاربر
    clearUserCache(user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
