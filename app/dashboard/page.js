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
} from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
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

  if (!user || pageLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-gradient-to-br from-stone-900 to-stone-900/50 rounded-xl p-8 mb-6 shadow-lg">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-violet-500/20 p-4 rounded-xl">
              <FaUser size={32} className="text-violet-500" />
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-violet-500 to-rose-500 text-transparent bg-clip-text">
                {formData.display_name || "کاربر ترپفا"}
              </h1>
              <div className="flex items-center gap-2 text-sm opacity-70">
                <MdAlternateEmail size={14} />
                <p>{user.email}</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500/10 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500/20 transition-all"
          >
            <FaSignOutAlt />
            خروج
          </button>
        </div>

        {/* Profile Form */}
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
                !isEditing ? "بیوگرافی ثبت نشده است" : "درباره خودت بنویس..."
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
  );
}
