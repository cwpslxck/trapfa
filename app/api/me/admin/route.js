import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({
      cookies: () => cookieStore,
    });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    // چک کردن سطح دسترسی از جدول profiles با همان نشست
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("admin")
      .eq("id", user.id)
      .single();

    if (profileError) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    // اگر ادمین نبود
    if (!profile.admin || profile.admin === 0) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    return NextResponse.json({ admin: profile.admin });
  } catch (error) {
    console.error("Admin check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
