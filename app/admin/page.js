"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import LoadingPage from "@/components/LoadingPage";
import {
  BiBarChartAlt2,
  BiUser,
  BiMusic,
  BiFile,
  BiBell,
  BiTrendingUp,
  BiTime,
  BiExit,
} from "react-icons/bi";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user, profile } = useAuth();

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        if (!user) {
          router.push("/auth");
          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        const response = await fetch("/api/me/admin", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Unauthorized");
        }

        setLoading(false);
      } catch (error) {
        console.error("Admin access error:", error);
        router.push("/dashboard");
      }
    };

    checkAdminAccess();
  }, [user]);

  if (loading) {
    return <LoadingPage />;
  }

  const stats = [
    {
      title: "کاربران فعال",
      value: "۱,۲۳۴",
      change: "+۱۲.۵%",
      trend: "up",
      icon: BiUser,
      color: "purple",
    },
    {
      title: "موزیک‌ها",
      value: "۳,۴۵۶",
      change: "+۲۳.۱%",
      trend: "up",
      icon: BiMusic,
      color: "pink",
    },
    {
      title: "مقالات",
      value: "۱۲۳",
      change: "+۵.۴%",
      trend: "up",
      icon: BiFile,
      color: "emerald",
    },
    {
      title: "درخواست‌ها",
      value: "۴۵",
      change: "-۲.۳%",
      trend: "down",
      icon: BiBell,
      color: "amber",
    },
  ];

  const recentActivities = [
    { text: "کاربر جدید ثبت نام کرد", time: "۵ دقیقه پیش", type: "user" },
    { text: "درخواست جدید ثبت شد", time: "۱۵ دقیقه پیش", type: "request" },
    { text: "مقاله جدید منتشر شد", time: "۱ ساعت پیش", type: "article" },
    { text: "موزیک جدید آپلود شد", time: "۲ ساعت پیش", type: "music" },
  ];

  return (
    <div>
      {/* Top Navigation */}
      <nav className="border-b border-stone-800 bg-black/50 backdrop-blur-xl">
      <span className="hidden text-yellow-500 bg-yellow-500"></span>
        <div className="mx-auto py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-500">
              <BiBarChartAlt2 className="h-8 w-8" />
              <h1 className="text-xl font-bold">پنل مدیریت ترپفا</h1>
            </div>
            <div className="flex items-center gap-1">
              {/* <button className="p-2 hover:bg-stone-800 rounded-lg">
                <BiBell className="size-6" />
              </button> */}
              <button
                onClick={() => {
                  router.push("/dashboard");
                }}
                className="p-2 hover:bg-stone-800 rounded-lg"
              >
                <BiExit className="size-6 text-red-600" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto py-4">
        {/* Welcome Section */}
        {/* <div className="mb-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-8 border border-stone-800/50 backdrop-blur">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            سلام، {profile?.display_name}
          </h2>
          <p className="mt-2 text-stone-400">
            در ۲۴ ساعت گذشته ۱۲۳ کاربر جدید به ترپفا پیوستند.
          </p>
        </div> */}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group bg-stone-900/50 backdrop-blur border border-stone-800 rounded-xl p-4 hover:bg-stone-900/70 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 bg-${stat.color || "purple"}-500/10 rounded-lg`}>
                    <Icon className={`h-6 w-6 text-${stat.color}-500`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-xl font-bold tracking-tight">
                        {stat.value}
                      </h3>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-md ${
                          stat.trend === "up"
                            ? "bg-green-500/5 text-green-500"
                            : "bg-red-500/5 text-red-500"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-stone-400">
                      {stat.title}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Section */}
          <div className="lg:col-span-2 bg-stone-900/50 backdrop-blur border border-stone-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BiTrendingUp className="h-5 w-5 text-purple-500" />
                آمار بازدید
              </h3>
              <select className="bg-stone-800 border-none rounded-lg text-sm p-2">
                <option>۷ روز گذشته</option>
                <option>۳۰ روز گذشته</option>
                <option>۱ سال گذشته</option>
              </select>
            </div>
            <div className="h-[300px] flex items-center justify-center text-stone-600">
              نمودار اینجا قرار می‌گیرد
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-stone-900/50 backdrop-blur border border-stone-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
              <BiTime className="h-5 w-5 text-purple-500" />
              فعالیت‌های اخیر
            </h3>
            <div className="space-y-1">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-stone-800/50"
                >
                  <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.text}</p>
                    <span className="text-xs text-stone-500">
                      {activity.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {["افزودن موزیک", "مدیریت کاربران", "مقاله جدید", "گزارش‌ها"].map(
            (action, index) => (
              <button
                key={index}
                className="p-4 bg-stone-900/50 backdrop-blur border border-stone-800 rounded-xl hover:bg-stone-800 transition text-right"
              >
                {action}
              </button>
            )
          )}
        </div>
      </main>
    </div>
  );
}
