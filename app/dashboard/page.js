"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoadingPage from "@/components/LoadingPage";
import { useError } from "@/components/ErrorContext";
import {
  FaUserEdit,
  FaSignOutAlt,
  FaUser,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaMusic,
  FaPen,
  FaUsers,
  FaHeart,
  FaPenAlt,
  FaTelegramPlane,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { BiSolidQuoteAltLeft } from "react-icons/bi";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    display_name: "",
    city: "",
    birth_date: "",
    bio: "",
  });
  const { showSuccess, showError } = useError();
  const router = useRouter();

  useEffect(() => {
    // چک کردن localStorage
    const cachedUser = localStorage.getItem("cached_user");
    const lastCheck = localStorage.getItem("last_auth_check");
    const now = Date.now();

    if (!cachedUser || !lastCheck) {
      router.push("/auth");
      return;
    }

    // اگر کمتر از 1 ساعت از آخرین چک گذشته و کاربر در حافظه هست
    if (now - parseInt(lastCheck) < 3600000) {
      const userData = JSON.parse(cachedUser);
      setUser(userData);

      // دریافت اطلاعات پروفایل از localStorage
      const cachedProfile = localStorage.getItem("cached_profile");
      if (cachedProfile) {
        setFormData(JSON.parse(cachedProfile));
      }

      setPageLoading(false);
      return;
    }

    // در غیر این صورت از سرور چک می‌کنیم
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profile) {
        // ذخیره پروفایل در localStorage
        localStorage.setItem(
          "cached_profile",
          JSON.stringify({
            display_name: profile.display_name || "",
            city: profile.city || "",
            birth_date: profile.birth_date || "",
            bio: profile.bio || "",
          })
        );

        setFormData({
          display_name: profile.display_name || "",
          city: profile.city || "",
          birth_date: profile.birth_date || "",
          bio: profile.bio || "",
        });
      }

      // ذخیره اطلاعات کاربر در localStorage
      localStorage.setItem("cached_user", JSON.stringify(user));
      localStorage.setItem("last_auth_check", Date.now().toString());

      setUser(user);
      setPageLoading(false);
    } catch (error) {
      showError("خطا در بررسی وضعیت کاربر");
      router.push("/auth");
    }
  };

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
      // پاک کردن تمام اطلاعات کاربر از localStorage
      localStorage.removeItem("cached_user");
      localStorage.removeItem("last_auth_check");
      localStorage.removeItem("cached_profile");

      showSuccess("با موفقیت از حساب کاربری خارج شدید");
      router.push("/");
    } catch (error) {
      showError("خطا در خروج از حساب کاربری");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const { error } = await supabase.from("profiles").upsert({
        user_id: user.id,
        ...formData,
        updated_at: new Date(),
      });

      if (error) throw error;

      showSuccess("اطلاعات پروفایل با موفقیت بروزرسانی شد");
      setIsEditing(false);
    } catch (error) {
      showError("خطا در بروزرسانی پروفایل");
    }
  }

  const quickLinks = [
    {
      title: "چنل تلگرام",
      icon: <FaTelegramPlane className="text-blue-500" />,
      link: "/tracks",
      desc: "اولین نفر از تغییرات جدید باخبر بشید!",
    },
    {
      title: "جدیدترین ها",
      icon: <FaMusic className="text-emerald-500" />,
      link: "/tracks",
      desc: "مشاهده آهنگ های جدید",
    },
    {
      title: "آرتیست ها",
      icon: <FaUsers className="text-red-500" />,
      link: "/artists",
      desc: "لیست کاملی از آرتیست ها",
    },
    {
      title: "مقاله ها",
      icon: <FaPen className="text-violet-500" />,
      link: "/articles",
      desc: "مقالات جدید منتشر شده",
    },
  ];

  if (!user || pageLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-[60vh] py-8">
      {/* Profile Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-violet-500/20 p-4 rounded-xl">
            <MdDashboard className="text-violet-500 size-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">داشبورد</h1>
            <p className="text-white/60 text-sm">مدیریت حساب کاربری</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500/10 text-red-500 px-4 py-2 rounded-xl hover:bg-red-500/20 transition-all"
        >
          <FaSignOutAlt />
          <span className="text-sm">خروج</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Artist Profile Section */}
          <div className="bg-gradient-to-br from-violet-500/20 to-violet-500/5 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-bold">آرتیست پروفایل</h2>
                <p className="text-sm text-white/60">
                  اگر به هر نحوی توی تولید آثار رپفارسی فعالیتی دارید آرتیست
                  پروفایل خودتونو فعال کنید!
                </p>
              </div>
              <Link
                href="/dashboard/artist"
                className="flex items-center gap-2 bg-violet-500 hover:bg-violet-600 px-6 py-3 rounded-xl transition-all text-sm"
              >
                <FaPenAlt />
                مشاهده فرم
              </Link>
            </div>
          </div>
          {/*  */}
          <div className="bg-stone-900/50 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FaUser className="text-violet-500" />
              اطلاعات پروفایل
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6 border-0 p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-stone-800/50 p-4 rounded-xl">
                  <label className="flex items-center gap-2 text-sm opacity-70 mb-2">
                    <FaUser className="text-violet-500" />
                    نام نمایشی
                  </label>
                  <input
                    type="text"
                    value={formData.display_name}
                    onChange={(e) =>
                      setFormData({ ...formData, display_name: e.target.value })
                    }
                    disabled={!isEditing}
                    className={`bg-stone-800 ${!isEditing ? "opacity-70" : ""}`}
                  />
                </div>
                <div className="bg-stone-800/50 p-4 rounded-xl">
                  <label className="flex items-center gap-2 text-sm opacity-70 mb-2">
                    <FaMapMarkerAlt className="text-emerald-500" />
                    شهر
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    disabled={!isEditing}
                    className={`bg-stone-800 ${!isEditing ? "opacity-70" : ""}`}
                  />
                </div>
                <div className="bg-stone-800/50 p-4 rounded-xl">
                  <label className="flex items-center gap-2 text-sm opacity-70 mb-2">
                    <FaBirthdayCake className="text-rose-500" />
                    تاریخ تولد
                  </label>
                  <input
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) =>
                      setFormData({ ...formData, birth_date: e.target.value })
                    }
                    disabled={!isEditing}
                    className={`bg-stone-800 ${!isEditing ? "opacity-70" : ""}`}
                  />
                </div>
              </div>

              <div className="bg-stone-800/50 p-4 rounded-xl">
                <label className="flex items-center gap-2 text-sm opacity-70 mb-2">
                  <BiSolidQuoteAltLeft className="text-blue-500" />
                  بیوگرافی
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  disabled={!isEditing}
                  placeholder={
                    !isEditing
                      ? "بیوگرافی ثبت نشده است"
                      : "درباره خودت بنویس..."
                  }
                  className={`w-full h-32 resize-none bg-stone-800 focus:outline outline-violet-400 ${
                    !isEditing ? "opacity-70" : ""
                  }`}
                />
              </div>

              {isEditing ? (
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-violet-500 hover:bg-violet-600 px-6 py-3 rounded-xl transition-all"
                  >
                    <FaUserEdit />
                    ذخیره تغییرات
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 bg-stone-800 hover:bg-stone-700 px-6 py-3 rounded-xl transition-all"
                  >
                    انصراف
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-stone-800 hover:bg-stone-700 px-6 py-3 rounded-xl transition-all"
                >
                  <FaUserEdit />
                  ویرایش پروفایل
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <div className="bg-stone-900/50 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6">دسترسی سریع</h2>
            <div className="grid gap-4">
              {quickLinks.map((item) => (
                <Link
                  key={item.title}
                  href={item.link}
                  className="flex items-center gap-4 p-4 rounded-xl bg-black/50 hover:bg-black transition-all group"
                >
                  <div className="bg-white/5 p-3 rounded-lg group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-white/60">{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-stone-900/50 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6">آمار کلی</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/50 p-4 rounded-xl">
                <div className="text-2xl font-bold text-violet-500">0</div>
                <div className="text-sm text-white/60">پلی‌لیست</div>
              </div>
              <div className="bg-black/50 p-4 rounded-xl">
                <div className="text-2xl font-bold text-emerald-500">0</div>
                <div className="text-sm text-white/60">نظر</div>
              </div>
              <div className="bg-black/50 p-4 rounded-xl">
                <div className="text-2xl font-bold text-blue-500">0</div>
                <div className="text-sm text-white/60">لایک</div>
              </div>
              <div className="bg-black/50 p-4 rounded-xl">
                <div className="text-2xl font-bold text-red-500">0</div>
                <div className="text-sm text-white/60">ذخیره</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
