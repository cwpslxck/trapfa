import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const getSupabaseClient = () => {
  const cookieStore = cookies();
  return createServerComponentClient({ cookies: () => cookieStore });
};

const getUserFromToken = async (token) => {
  const supabase = getSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);
  if (error || !user) {
    throw new Error("Unauthorized");
  }
  return user;
};

export async function GET(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    const supabase = getSupabaseClient();

    // Check if user has a verification request
    const { data: verificationData } = await supabase
      .from("verification_requests")
      .select("status")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1);

    // If no verification request exists or last request was rejected, user needs to verify
    if (
      !verificationData?.length ||
      verificationData[0].status === "rejected"
    ) {
      return NextResponse.json(
        { error: "Verification required", needsVerification: true },
        { status: 403 }
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      // Create a default profile if one doesn't exist
      const { data: newProfile, error: createError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          display_name: user.email.split("@")[0],
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) {
        console.error("Error creating profile:", createError);
        return NextResponse.json(
          { error: "Failed to create profile" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        id: user.id,
        email: user.email,
        ...newProfile,
      });
    }

    return NextResponse.json({ id: user.id, email: user.email, ...profile });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}

export async function POST(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    const body = await req.json();
    const supabase = getSupabaseClient();

    const { error: updateError } = await supabase.from("profiles").upsert({
      id: user.id,
      ...body,
      updated_at: new Date().toISOString(),
    });

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}
