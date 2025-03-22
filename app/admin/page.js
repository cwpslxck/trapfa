"use client";

import {
  BiBarChartAlt2,
  BiMusic,
  BiFile,
  BiTrendingUp,
  BiTime,
  BiExit,
  BiRefresh,
} from "react-icons/bi";
import { FaUserAlt, FaUserPlus } from "react-icons/fa";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [statsData, setStatsData] = useState({
    users: "...",
    plus: "...",
    articles: "1",
    tracks: "...",
  });
  const supabase = createClientComponentClient();

  const fetchStats = async () => {
    try {
      // Fetch all users
      const { data: users } = await supabase.from("profiles").select("*");

      // Fetch artists
      const { data: artists } = await supabase.from("artists").select("*");

      // Fetch tracks
      const { data: tracks } = await supabase.from("tracks").select("*");

      const newStats = {
        users: users?.length || 0,
        plus: artists?.length || 0,
        articles: 1,
        tracks: tracks?.length || 0,
      };

      // Store in localStorage with timestamp
      localStorage.setItem(
        "adminStats",
        JSON.stringify({
          data: newStats,
          timestamp: new Date().getTime(),
        })
      );

      setStatsData(newStats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const refreshStats = async () => {
    fetchStats();
    window.location.reload();
  };

  useEffect(() => {
    const cached = localStorage.getItem("adminStats");
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const isExpired = new Date().getTime() - timestamp > 24 * 60 * 60 * 1000;

      if (!isExpired) {
        setStatsData(data);
        return;
      }
    }
    fetchStats();
  }, []);

  const stats = [
    {
      title: "همه کاربران",
      value: statsData.users,
      icon: FaUserAlt,
    },
    {
      title: "اشتراک پلاس",
      value: statsData.plus,
      icon: FaUserPlus,
    },
    {
      title: "مقالات",
      value: statsData.articles,
      icon: BiFile,
    },
    {
      title: "آهنگها",
      value: statsData.tracks,
      icon: BiMusic,
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
      <main className="container mx-auto py-4 space-y-4">
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-stone-900/50 backdrop-blur border border-stone-800 rounded-xl p-4 hover:bg-stone-900/70 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-xl font-bold tracking-tight">
                        {stat.value}
                      </h3>
                    </div>
                    <p className="text-sm font-medium text-stone-400">
                      {stat.title}
                    </p>
                  </div>
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Icon className="h-6 w-6 text-purple-500" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
      </main>
    </div>
  );
}
