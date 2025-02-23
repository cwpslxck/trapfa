"use client";
import { useState } from "react";
import { useError } from "@/components/ErrorContext";
import { useAuth } from "@/contexts/AuthContext";

export default function ArticleThumbnailManager() {
  const [formData, setFormData] = useState({
    article_url: "",
    thumbnail_url: "",
  });
  const { showSuccess, showError } = useError();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!user) {
        showError("لطفا ابتدا وارد حساب کاربری خود شوید");
        return;
      }

      const response = await fetch("/api/articles/thumbnails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save thumbnail");

      showSuccess("تامبنیل با موفقیت ذخیره شد");
      setFormData({ article_url: "", thumbnail_url: "" });
    } catch (error) {
      console.error("Error:", error);
      showError("خطا در ذخیره تامبنیل");
    }
  };

  return (
    <div className="bg-stone-900 p-6 rounded-xl">
      <h2 className="text-xl font-bold mb-4">مدیریت تامبنیل مقالات</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">لینک مقاله</label>
          <input
            type="url"
            value={formData.article_url}
            onChange={(e) =>
              setFormData({ ...formData, article_url: e.target.value })
            }
            className="w-full px-3 py-2 bg-stone-800 rounded-lg"
            placeholder="https://virgool.io/trapfa/..."
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">لینک تامبنیل</label>
          <input
            type="url"
            value={formData.thumbnail_url}
            onChange={(e) =>
              setFormData({ ...formData, thumbnail_url: e.target.value })
            }
            className="w-full px-3 py-2 bg-stone-800 rounded-lg"
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded-lg transition-colors"
        >
          ذخیره تامبنیل
        </button>
      </form>
    </div>
  );
}
