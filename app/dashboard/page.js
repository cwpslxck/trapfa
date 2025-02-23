"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoadingPage from "@/components/LoadingPage";
import { useError } from "@/components/ErrorContext";
import {
  FaUserEdit,
  FaUserShield,
  FaArrowLeft,
  FaSignOutAlt,
  FaUser,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaMusic,
  FaPen,
  FaUsers,
  FaStar,
  FaInstagram,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import Image from "next/image";
import { MdSettings } from "react-icons/md";
import { useAuth } from "@/contexts/AuthContext";
import ArticleThumbnailManager from "@/components/ArticleThumbnailManager";

const ProfileAvatar = ({ profile, className }) => {
  return (
    <Image
      src={profile?.avatar_url || "/default-avatar.jpg"}
      alt={profile?.display_name || "User Avatar"}
      width={128}
      height={128}
      draggable={false}
      className={`rounded-full object-cover ${className}`}
    />
  );
};

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const router = useRouter();
  const { showError, showSuccess } = useError();
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          router.push("/");
          return;
        }

        // چک کردن localStorage
        const cachedData = localStorage.getItem("profile");
        const cachedTimestamp = localStorage.getItem("profile_timestamp");

        // اگر کش معتبر بود، از اون استفاده کن
        if (cachedData && cachedTimestamp) {
          const CACHE_TIME = 5 * 60 * 1000; // 5 دقیقه
          if (Date.now() - parseInt(cachedTimestamp) < CACHE_TIME) {
            setProfile(JSON.parse(cachedData));
            setEditedProfile(JSON.parse(cachedData));
            setPageLoading(false);
            return;
          }
        }

        // اگر کش نبود یا منقضی شده بود، درخواست جدید بفرست
        const response = await fetch("/api/me", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const userData = await response.json();

        // ذخیره در localStorage
        localStorage.setItem("profile", JSON.stringify(userData));
        localStorage.setItem("profile_timestamp", Date.now().toString());

        setProfile(userData);
        setEditedProfile(userData);
      } catch (error) {
        console.error("Error:", error);
        showError("خطا در دریافت اطلاعات پروفایل");
        router.push("/auth");
      } finally {
        setPageLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      router.push("/auth");
    } catch (error) {
      showError("خطا در خروج از حساب کاربری");
    }
  };

  const handleEdit = () => {
    setEditedProfile(profile);
    setIsEditing(true);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      // آپدیت editedProfile
      setEditedProfile((prev) => ({
        ...prev,
        avatar_url: URL.createObjectURL(file),
      }));
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      let avatarUrl = profile.avatar_url;

      if (avatarFile) {
        // آپلود آواتار جدید
        const fileExt = avatarFile.name.split(".").pop();
        const fileName = `${editedProfile.id}_${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatarFile);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(filePath);

        avatarUrl = publicUrl;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      // آپدیت پروفایل از طریق API
      const response = await fetch("/api/me", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          display_name: editedProfile.display_name,
          birth_date: editedProfile.birth_date,
          city: editedProfile.city,
          avatar_url: avatarUrl,
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      // پاک کردن کش
      localStorage.removeItem("profile");
      localStorage.removeItem("profile_timestamp");

      // بروزرسانی state
      setProfile({ ...editedProfile, avatar_url: avatarUrl });
      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
      showSuccess("اطلاعات با موفقیت بروزرسانی شد");
      // ریفرش کردن صفحه
      window.location.reload();
    } catch (error) {
      showError("خطا در بروزرسانی اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(null);
  };

  if (pageLoading) {
    return <LoadingPage />;
  }

  // اگر پروفایل نداشت
  if (!profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8 bg-stone-900/50 p-8 rounded-2xl text-center">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-[1px] rounded-xl w-full">
            <div className="bg-stone-900 rounded-xl p-6">
              <FaUser className="text-5xl mx-auto mb-4 text-purple-500" />
              <h1 className="text-xl font-semibold mb-2">
                پروفایل شما کامل نیست!
              </h1>
              <p className="text-sm text-gray-400 mb-6">
                برای استفاده از امکانات ترپفا، لطفا پروفایل خود را تکمیل کنید.
                <br />
                این فرآیند کمتر از 2 دقیقه طول می‌کشد.
              </p>
              <Link
                href="/verify"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl inline-flex items-center gap-2 hover:from-purple-500 hover:to-pink-500 transition-all"
              >
                <FaUserEdit />
                تکمیل پروفایل
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const quickLinks = [
    {
      title: "آهنگ‌های من",
      desc: "لیست آهنگ‌های منتشر شده",
      link: "/dashboard/songs",
      icon: <FaMusic className="text-xl text-violet-500" />,
    },
    {
      title: "مقاله‌های من",
      desc: "لیست مقالات منتشر شده",
      link: "/dashboard/articles",
      icon: <FaPen className="text-xl text-emerald-500" />,
    },
    {
      title: "آرتیست‌ها",
      desc: "مدیریت آرتیست‌ها",
      link: "/dashboard/artists",
      icon: <FaUsers className="text-xl text-blue-500" />,
    },
  ];

  return (
    <div className="py-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* Profile Section */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-stone-800/80 to-stone-900/80 backdrop-blur rounded-2xl p-8 w-full shadow-xl">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  پروفایل
                </h2>
                <p className="text-sm text-stone-400 mt-1">
                  مدیریت اطلاعات شخصی
                </p>
              </div>
              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 transition-all duration-300"
                      title="ذخیره تغییرات"
                    >
                      <FaCheck className="text-lg text-emerald-400" />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="p-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 transition-all duration-300"
                      title="انصراف"
                    >
                      <FaTimes className="text-lg text-red-400" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleEdit}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                      title="ویرایش پروفایل"
                    >
                      <FaUserEdit className="text-lg text-purple-400" />
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                      title="خروج از حساب"
                    >
                      <FaSignOutAlt className="text-lg text-red-400" />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {isEditing ? (
                <div className="flex flex-col gap-4">
                  {/* Avatar Upload Section */}
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <Image
                      src={
                        avatarPreview ||
                        editedProfile.avatar_url ||
                        "/default-avatar.jpg"
                      }
                      alt="User Avatar"
                      width={128}
                      height={128}
                      className="rounded-full bg-stone-800 object-cover w-32 h-32"
                    />
                    <label className="absolute bottom-0 right-0 bg-violet-500 p-2 rounded-full cursor-pointer hover:bg-violet-600 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                      <FaPen size={14} />
                    </label>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-black/20 hover:bg-black/30 transition-all duration-300">
                    <div className="bg-purple-500/10 p-3 rounded-xl">
                      <FaUser className="text-xl text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-stone-400 mb-1">
                        نام نمایشی
                      </div>
                      <input
                        type="text"
                        value={editedProfile.display_name}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile,
                            display_name: e.target.value,
                          })
                        }
                        className="rtl w-full bg-black/30 rounded-lg px-3 py-1.5 outline-none focus:ring-2 ring-purple-500/50"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-black/20 hover:bg-black/30 transition-all duration-300">
                    <div className="bg-rose-500/10 p-3 rounded-xl">
                      <FaBirthdayCake className="text-xl text-rose-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-stone-400 mb-1">
                        تاریخ تولد
                      </div>
                      <input
                        type="date"
                        value={editedProfile.birth_date}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile,
                            birth_date: e.target.value,
                          })
                        }
                        className="w-full bg-black/30 rounded-lg px-3 py-1.5 outline-none focus:ring-2 ring-rose-500/50"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-black/20 hover:bg-black/30 transition-all duration-300">
                    <div className="bg-emerald-500/10 p-3 rounded-xl">
                      <FaMapMarkerAlt className="text-xl text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-stone-400 mb-1">شهر</div>
                      <input
                        type="text"
                        value={editedProfile.city}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile,
                            city: e.target.value,
                          })
                        }
                        className="rtl w-full bg-black/30 rounded-lg px-3 py-1.5 outline-none focus:ring-2 ring-emerald-500/50"
                      />
                    </div>
                  </div>

                  {profile?.instagram_id && (
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-black/20 hover:bg-black/30 transition-all duration-300">
                      <div className="bg-pink-500/10 p-3 rounded-xl">
                        <FaInstagram className="text-xl text-pink-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-stone-400 mb-1">
                          اینستاگرام
                        </div>
                        <div className="font-medium ltr">
                          @{editedProfile?.instagram_id || "درحال بررسی"}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="w-32 h-32 mx-auto mb-4">
                    <ProfileAvatar profile={profile} className="w-32 h-32" />
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-black/20 hover:bg-black/30 transition-all duration-300">
                    <div className="bg-purple-500/10 p-3 rounded-xl">
                      <FaUser className="text-xl text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-stone-400 mb-1">
                        نام نمایشی
                      </div>
                      <div className="font-medium">
                        {profile?.display_name || "درحال بررسی"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-black/20 hover:bg-black/30 transition-all duration-300">
                    <div className="bg-rose-500/10 p-3 rounded-xl">
                      <FaBirthdayCake className="text-xl text-rose-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-stone-400 mb-1">
                        تاریخ تولد
                      </div>
                      <div className="font-medium">
                        {profile?.birth_date
                          ? new Date(profile.birth_date).toLocaleDateString(
                              "fa-IR"
                            )
                          : "درحال بررسی"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-black/20 hover:bg-black/30 transition-all duration-300">
                    <div className="bg-emerald-500/10 p-3 rounded-xl">
                      <FaMapMarkerAlt className="text-xl text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-stone-400 mb-1">شهر</div>
                      <div className="font-medium">
                        {profile?.city || "درحال بررسی"}
                      </div>
                    </div>
                  </div>

                  {profile?.instagram_id && (
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-black/20 hover:bg-black/30 transition-all duration-300">
                      <div className="bg-pink-500/10 p-3 rounded-xl">
                        <FaInstagram className="text-xl text-pink-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-stone-400 mb-1">
                          اینستاگرام
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Admin Panel */}
                  {profile?.admin !== 0 && (
                    <button
                      onClick={() => router.push("/admin")}
                      className="flex items-center gap-4 p-4 rounded-xl bg-violet-800/20 hover:bg-violet-800/30 transition-all duration-300"
                    >
                      <div className="bg-violet-500/10 p-3 rounded-xl">
                        <MdSettings className="text-xl text-pink-400 animate-spin" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-start">ادمین پنل</div>
                      </div>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Links & Stats */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gradient-to-br from-stone-800/80 to-stone-900/80 backdrop-blur rounded-2xl p-8 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="bg-amber-500/10 p-4 rounded-xl">
                <FaStar className="text-2xl text-amber-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">
                  حساب هنرمندی خود را بسازید!
                </h2>
                <p className="text-stone-400 text-sm leading-relaxed mb-4">
                  آیا شما یک هنرمند هستید؟ با ساخت حساب هنرمندی، می‌توانید آثار
                  خود را به اشتراک بگذارید و با طرفداران خود در ارتباط باشید.
                </p>
                <Link
                  href="/artist/register"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
                >
                  <span>ساخت حساب هنرمندی</span>
                  <FaArrowLeft className="text-sm" />
                </Link>
              </div>
            </div>
          </div>
          {/* Quick Links */}
          <div className="bg-gradient-to-br from-stone-800/80 to-stone-900/80 backdrop-blur rounded-2xl p-8 shadow-xl">
            <div className="mb-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                دسترسی سریع
              </h2>
              <p className="text-sm text-stone-400 mt-1">لینک‌های پرکاربرد</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {quickLinks.map((item) => (
                <Link
                  key={item.title}
                  href={item.link}
                  className="flex items-center gap-4 p-5 rounded-xl bg-black/20 hover:bg-black/30 transition-all duration-300 group"
                >
                  <div className="bg-white/5 p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">{item.title}</h3>
                    <p className="text-sm text-stone-400">{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* نمایش مدیریت تامبنیل برای ادمین‌ها */}
      {profile?.role === "admin" && (
        <div className="mt-8">
          <ArticleThumbnailManager />
        </div>
      )}
    </div>
  );
}
