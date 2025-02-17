"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useError } from "@/components/ErrorContext";

export default function RequestArtist() {
  const [formData, setFormData] = useState({
    artist_name: "",
    artist_url: "",
    instagram: "",
    telegram: "",
    soundcloud: "",
    spotify: "",
  });
  const { showSuccess, showError } = useError();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        showError("لطفا ابتدا وارد حساب کاربری خود شوید");
        return;
      }

      const { error } = await supabase.from("artist_requests").insert({
        user_id: user.id,
        artist_name: formData.artist_name,
        artist_url: formData.artist_url,
        social_links: {
          instagram: formData.instagram,
          telegram: formData.telegram,
          soundcloud: formData.soundcloud,
          spotify: formData.spotify,
        },
      });

      if (error) throw error;

      showSuccess("درخواست شما با موفقیت ثبت شد و در حال بررسی است.");
      showSuccess("ادامه مراحل از راه های ارتباطی به شم اطلاع داده میشود.");
      setFormData({
        artist_name: "",
        artist_url: "",
        instagram: "",
        telegram: "",
        soundcloud: "",
        spotify: "",
      });
    } catch (error) {
      showError("خطا در ثبت درخواست");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">درخواست ثبت آرتیست</h2>
      <input
        required
        type="text"
        className="rtl"
        placeholder="نام هنری به فارسی"
        value={formData.artist_name}
        onChange={(e) =>
          setFormData({ ...formData, artist_name: e.target.value })
        }
      />
      <div className="inputholder">
        <span className="text-stone-500">Trapfa.ir/artists/</span>
        <input
          type="text"
          placeholder="نام هنری به انگلیسی"
          value={formData.artist_url}
          onChange={(e) =>
            setFormData({ ...formData, artist_url: e.target.value })
          }
        />
      </div>
      <p>نکته: نام فارسی شما باید دقیقا مشابه نام انگلیسی شما باشد.</p>
      <p>مثال: Hiphopologist - هیپهاپولوژیست</p>
      <div className="inputholder">
        <span className="text-stone-500">@</span>
        <input
          type="text"
          placeholder="آیدی اینستاگرام"
          value={formData.instagram}
          required
          onChange={(e) =>
            setFormData({ ...formData, instagram: e.target.value })
          }
        />
      </div>
      <div className="inputholder">
        <span className="text-stone-500">@</span>
        <input
          type="text"
          placeholder="آیدی چنل تلگرام (اختیاری - برای پیگیری بهتر کارهای جدید)"
          value={formData.telegram}
          onChange={(e) =>
            setFormData({ ...formData, telegram: e.target.value })
          }
        />
      </div>
      <input
        type="url"
        placeholder="لینک پروفایل ساندکلود"
        value={formData.soundcloud}
        onChange={(e) =>
          setFormData({ ...formData, soundcloud: e.target.value })
        }
      />
      <input
        type="url"
        placeholder="لینک پروفایل اسپاتیفای"
        value={formData.spotify}
        onChange={(e) => setFormData({ ...formData, spotify: e.target.value })}
      />
      <button type="submit">ارسال درخواست</button>
    </form>
  );
}
