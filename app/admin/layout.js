"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import LoadingPage from "@/components/LoadingPage";

export default function AdminLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push("/auth");
        return;
      }

      // بررسی دسترسی ادمین
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("admin")
        .eq("id", user.id)
        .single();

      if (profileError || profile?.admin == 0) {
        router.push("/dashboard");
        return;
      }

      setLoading(false);
    } catch (error) {
      router.push("/auth");
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="flex bg-stone-950 gap-2">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden gap-2">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto min-h-[60vh] rounded-xl">
          {children}
        </main>
      </div>
    </div>
  );
}
