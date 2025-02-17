"use client";
import "dotenv/config";

function UploadSongForm() {
  const coverImage = null;
  return (
    <form>
      <h2>افزودن آهنگ جدید</h2>

      <input required type="text" name="cover" placeholder="لینک کاور" />
      <input required type="text" name="title" placeholder="تایتل آهنگ" />
      <input required type="text" name="artistMain" placeholder="آرتیست" />
      <input type="text" name="soundcloud" placeholder="لینک ساندکلود" />
      <div className="inline-flex gap-2">
        <input type="text" name="spotify" placeholder="لینک اسپاتیفای" />
        <input type="text" name="youtube" placeholder="لینک یوتیوب" />
      </div>
      <button type="submit">ثبت اطلاعات</button>
    </form>
  );
}

export default UploadSongForm;
