"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    articles: 0,
    artists: 0,
    pendingVerifications: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // اینجا آمار را از دیتابیس دریافت کنید
      // مثال:
      const { count: usersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact" });

      setStats((prev) => ({ ...prev, users: usersCount }));
    } catch (error) {
      console.error("خطا در دریافت آمار:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">داشبورد مدیریت</h1>
    </div>
  );
}
