"use client";
import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function AddArtist() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    role: "",
    url: "",
    soundcloud: "",
    spotify: "",
    instagram: "",
    telegram: "",
  });

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      alert("لطفاً یک عکس آپلود کنید.");
      return;
    }

    try {
      // آپلود عکس به استوریج Supabase
      console.log("آپلود عکس شروع شد...");
      const imageUrl = await uploadImageToSupabase(file, formData.url);
      if (!imageUrl) {
        alert("خطا در آپلود عکس.");
        return;
      }
      console.log("عکس با موفقیت آپلود شد:", imageUrl);

      // ارسال اطلاعات به جدول artists
      console.log("ارسال اطلاعات به جدول شروع شد...");
      const artistData = { ...formData, image: imageUrl };
      const result = await addArtistToSupabase(artistData);

      alert("هنرمند با موفقیت اضافه شد!");
      setFormData({
        name: "",
        bio: "",
        role: "",
        url: "",
        soundcloud: "",
        spotify: "",
        instagram: "",
        telegram: "",
      });
      setFile(null);
      setPreview(null);
    } catch (error) {
      console.error("Error:", error);
      alert("خطا در اضافه کردن هنرمند. err2");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>افزودن آرتیست</h2>

      <div className="border-2 border-dashed border-gray-500 p-4 rounded-xl flex justify-center items-center flex-col">
        {preview ? (
          <Image
            width={200}
            height={200}
            src={preview}
            alt="Preview Artist Image"
            className="rounded-lg"
          />
        ) : (
          <input type="file" onChange={handleFileChange} />
        )}
      </div>

      <input
        required
        type="text"
        name="name"
        placeholder="نام آرتیست به فارسی"
        value={formData.name}
        onChange={handleInputChange}
      />
      <input
        required
        type="text"
        name="url"
        placeholder="نام آرتیست به انگلیسی (بدون فاصله)"
        value={formData.url}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="role"
        placeholder="نقش آرتیست (مثال: کاور آرتیست)"
        value={formData.role}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="bio"
        placeholder="بیوگرافی آرتیست"
        value={formData.bio}
        onChange={handleInputChange}
      />
      <input
        type="url"
        name="ig"
        placeholder="لینک اینستاگرام آرتیست"
        value={formData.instagram}
        onChange={handleInputChange}
      />
      <input
        type="url"
        name="tel"
        placeholder="لینک چنل تلگرام آرتیست"
        value={formData.telegram}
        onChange={handleInputChange}
      />
      <input
        type="url"
        name="sc"
        placeholder="لینک ساندکلود آرتیست"
        value={formData.soundcloud}
        onChange={handleInputChange}
      />
      <input
        type="url"
        name="spoti"
        placeholder="لینک اسپاتیفای آرتیست"
        value={formData.spotify}
        onChange={handleInputChange}
      />
      <button type="submit" className="bg-violet-500">
        افزودن آرتیست
      </button>
    </form>
  );
}

export default AddArtist;

// تابع برای آپلود عکس به استوریج Supabase
async function uploadImageToSupabase(file, url) {
  const fileName = `${url}-artistsimages`; // اسم فایل رندوم
  const { data, error } = await supabase.storage
    .from("artistsimages") // نام باکت در استوریج Supabase
    .upload(fileName, file);

  if (error) {
    console.error("Error uploading image:", error.message);
    return null;
  }

  // دریافت لینک عمومی عکس
  const { data: publicUrl } = supabase.storage
    .from("artistsimages")
    .getPublicUrl(fileName);

  return publicUrl.publicUrl;
}

// تابع برای اضافه کردن هنرمند به جدول artists
async function addArtistToSupabase(artistData) {
  const { data, error } = await supabase.from("artists").insert([artistData]);

  if (error) {
    console.error("Error adding artist:", error.message);
    return null;
  }

  console.log("هنرمند با موفقیت اضافه شد:", data);
  return data;
}
