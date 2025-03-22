"use client";

import { useError } from "@/components/ErrorContext";
import LoadingPage from "@/components/LoadingPage";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaBirthdayCake,
  FaCheck,
  FaMapMarkerAlt,
  FaMusic,
  FaPen,
  FaSignOutAlt,
  FaTimes,
  FaUser,
  FaUserEdit,
  FaUsers,
} from "react-icons/fa";
import { MdSettings } from "react-icons/md";

const ProfileAvatar = ({ profile, className }) => {
  return (
    <Image
      src={profile?.avatar_url || "/default-avatar.jpg"}
      alt={profile?.display_name || "User Avatar"}
      width={400}
      height={400}
      draggable={false}
      className={`rounded-full bg-black aspect-square object-cover ${className}`}
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
          handleSignOut();
          return;
        }

        const response = await fetch("/api/me", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const userData = await response.json();
        // Update localStorage with fresh profile data
        localStorage.setItem(
          "userProfile",
          JSON.stringify({
            display_name: userData.display_name,
            avatar_url: userData.avatar_url,
          })
        );

        setProfile(userData);
        setEditedProfile(userData);
      } catch (error) {
        showError("خطا در دریافت اطلاعات کاربری");
      } finally {
        setPageLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      localStorage.removeItem("userProfile");
      if (error) throw error;
      router.push("/");
    } catch (error) {
      showError("خطا در خروج از حساب کاربری");
    } finally {
      setLoading(false);
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

      const updatedProfile = { ...editedProfile, avatar_url: avatarUrl };

      // Update localStorage with new profile data
      localStorage.setItem(
        "userProfile",
        JSON.stringify({
          display_name: updatedProfile.display_name,
          avatar_url: updatedProfile.avatar_url,
        })
      );

      setProfile(updatedProfile);
      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
      showSuccess("اطلاعات با موفقیت بروزرسانی شد");

      // Remove page reload since we're handling state updates
      // window.location.reload();
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-stone-800/80 to-stone-900/80 backdrop-blur rounded-2xl p-8 w-full shadow-xl">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {profile?.display_name || "پروفایل"}
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
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="w-32 h-32 mx-auto mb-4">
                    <ProfileAvatar profile={profile} className="w-32 h-32" />
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
          <Link
            href={"/plus"}
            className="select-none bg-gradient-to-br from-violet-500/70 h-32 to-violet-600/80 p-8 rounded-2xl flex justify-between items-center"
          >
            <p className="text-6xl font-bold">ترپفا پلاس</p>
            <FaMusic size={70} />
          </Link>
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
    </div>
  );
}
