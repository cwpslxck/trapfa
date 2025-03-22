"use client";

import { useState } from "react";
import { useError } from "@/components/ErrorContext";
import { supabase } from "@/lib/supabase";
import {
  FaInstagram,
  FaUserAlt,
  FaBullseye,
  FaSoundcloud,
  FaTelegramPlane,
  FaSpotify,
  FaYoutubeSquare,
  FaUserFriends,
  FaPinterestSquare,
  FaLinkedin,
} from "react-icons/fa";
import { MdSell } from "react-icons/md";

export default function AdminSettings() {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useError();
  const [formData, setFormData] = useState({
    url: "",
    role: "",
    platforms: {},
    avatar_url: "",
  });

  const platformConfigs = {
    خوانندگی: [
      { icon: FaInstagram, prefix: "@", name: "instagram", required: true },
      { icon: FaTelegramPlane, prefix: "@", name: "telegram" },
      {
        icon: FaSoundcloud,
        prefix: "soundcloud.com/",
        name: "soundcloud",
        required: true,
      },
    ],
    آهنگسازی: [
      { icon: FaInstagram, prefix: "@", name: "instagram", required: true },
      { icon: FaTelegramPlane, prefix: "@", name: "telegram" },
      {
        icon: FaSoundcloud,
        prefix: "soundcloud.com/",
        name: "soundcloud",
      },
    ],
    "ویژوال آرتیست": [
      { icon: FaInstagram, prefix: "@", name: "instagram", required: true },
      { icon: FaTelegramPlane, prefix: "@", name: "telegram" },
    ],
    منیجمنت: [
      { icon: FaInstagram, prefix: "@", name: "instagram", required: true },
      { icon: FaTelegramPlane, prefix: "@", name: "telegram" },
    ],
  };

  const validateUrl = (url) => {
    // Check for length
    if (url.length < 3) {
      throw new Error("یوزرنیم باید حداقل ۳ کاراکتر باشد");
    }
    if (url.length > 18) {
      throw new Error("یوزرنیم نمیتواند بیشتر از ۱۸ کاراکتر باشد");
    }

    // Check for spaces
    if (url.includes(" ")) {
      throw new Error("یوزرنیم نمیتواند شامل فاصله باشد");
    }

    // Check for valid characters (A-Z, a-z, 0-9, _)
    const validUrlRegex = /^[A-Za-z0-9_]+$/;
    if (!validUrlRegex.test(url)) {
      throw new Error("یوزرنیم فقط میتواند شامل حروف انگلیسی، اعداد و _ باشد");
    }

    return true;
  };

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("artistsimages")
      .upload(fileName, imageFile);

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("artistsimages").getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate URL format first
      try {
        validateUrl(formData.url);
      } catch (validationError) {
        showError(validationError.message);
        setLoading(false);
        return;
      }

      // Upload image if selected
      let avatarUrl = formData.avatar_url;
      if (imageFile) {
        avatarUrl = await uploadImage();
      }

      // Check if URL is already taken
      const { data: existingUrl, error: urlError } = await supabase
        .from("artists")
        .select("url")
        .eq("url", formData.url)
        .single();

      if (urlError && urlError.code !== "PGRST116") {
        throw urlError;
      }

      if (existingUrl) {
        showError("این یوزرنیم قبلا انتخاب شده است");
        setLoading(false);
        return;
      }

      // Insert the artist data
      const { error: insertError } = await supabase.from("artists").insert({
        url: formData.url,
        role: formData.role,
        platforms: formData.platforms,
        avatar_url: avatarUrl,
      });

      if (insertError) {
        throw insertError;
      }

      // Successfully inserted the artist data
      showSuccess("آرتیست با موفقیت اضافه شد");

      // Reset form and image preview
      setFormData({
        url: "",
        role: "",
        platforms: {},
        avatar_url: "",
      });
      setImagePreview(null);
      setImageFile(null);
    } catch (error) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const platforms = formData.role ? platformConfigs[formData.role] || [] : [];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">افزودن آرتیست جدید</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* URL Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">یوزرنیم</label>
          <div className="inputholder bg-stone-800/50 rounded-lg">
            <span className="text-stone-400">trapfa.ir/@</span>
            <input
              type="text"
              name="url"
              value={formData.url}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  url: e.target.value,
                }))
              }
              placeholder="username"
              className="bg-transparent placeholder:text-left ltr border-none outline-none flex-1"
              required
            />
          </div>
        </div>

        {/* Avatar Upload Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">تصویر پروفایل</label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 bg-stone-800/50 rounded-lg border-none outline-none"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Role Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">زمینه فعالیت</label>
          <div className="w-full text-gray-300 grid grid-cols-2 gap-4">
            {["خوانندگی", "آهنگسازی", "ویژوال آرتیست", "منیجمنت"].map(
              (role) => (
                <div
                  key={role}
                  className={`aspect-video flex items-center justify-center p-4 rounded-lg cursor-pointer transition-colors duration-300 ${
                    formData.role === role
                      ? "bg-green-600 text-white"
                      : "bg-stone-800 text-gray-300"
                  } hover:bg-green-500 hover:text-white`}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      role: role,
                      // Reset platforms when role changes
                      platforms: {},
                    }))
                  }
                >
                  {role}
                </div>
              )
            )}
          </div>
        </div>

        {/* Platform Fields - Only show if role is selected */}
        {formData.role && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">{formData.role}</label>
            <div className="flex gap-2 flex-col">
              {platforms.map((platform) => (
                <div
                  key={platform.name}
                  className="inputholder bg-stone-800/50 rounded-lg"
                >
                  <span className="text-stone-400 inline-flex items-center gap-1.5">
                    <platform.icon size={20} /> {platform.prefix}
                  </span>
                  <input
                    type="text"
                    name={platform.name}
                    value={formData.platforms[platform.name] || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        platforms: {
                          ...prev.platforms,
                          [platform.name]: e.target.value,
                        },
                      }))
                    }
                    placeholder=""
                    className="bg-transparent placeholder:text-left ltr border-none outline-none flex-1"
                    required={platform?.required || false}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          className="w-full bg-green-500 hover:bg-green-500/90 py-2 px-4 rounded-lg text-white font-medium"
          type="submit"
          disabled={loading}
        >
          {loading ? "در حال ثبت..." : "افزودن آرتیست"}
        </button>
      </form>
    </div>
  );
}
