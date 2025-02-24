"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import LoadingPart from "@/components/LoadingPart";
import { useError } from "@/components/ErrorContext";
import BannerAds from "@/components/BannerAds";
import Image from "next/image";
import Link from "next/link";
import { FaCalendar, FaUser, FaHome, FaBookOpen } from "react-icons/fa";

export default function PostPage() {
  const { url } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showError } = useError();

  useEffect(() => {
    const loadPost = async () => {
      try {
        const response = await fetch(`/api/posts`);
        const { feed: xmlText } = await response.json();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        const items = xmlDoc.getElementsByTagName("item");

        const foundPost = Array.from(items).find((item) => {
          const link = item.getElementsByTagName("link")[0]?.textContent || "";
          return link.includes(url) || link.split("/").pop() === url;
        });

        if (foundPost) {
          const mediaContent =
            foundPost.getElementsByTagName("media:content")[0];
          const imageUrl =
            mediaContent?.getAttribute("url") || "/default-article.jpg";

          setPost({
            title:
              foundPost.getElementsByTagName("title")[0]?.textContent || "",
            content:
              foundPost.getElementsByTagName("description")[0]?.textContent ||
              "",
            author:
              foundPost.getElementsByTagName("author")[0]?.textContent ||
              "ترپفا",
            date: new Date(
              foundPost.getElementsByTagName("pubDate")[0]?.textContent || ""
            ).toLocaleDateString("fa-IR"),
            image: imageUrl,
          });
        } else {
          throw new Error("پست یافت نشد");
        }
      } catch (error) {
        console.error("خطا در بارگذاری پست:", error);
        showError("خطا در دریافت پست");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [url]);

  if (loading) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <LoadingPart />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="w-full min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-gray-400">پست موردنظر یافت نشد.</p>
        <Link
          href="/posts"
          className="flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors"
        >
          <FaBookOpen className="w-4 h-4" />
          بازگشت به لیست مقاله‌ها
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center min-h-screen">
      <div className="w-full max-w-4xl py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-3 text-sm text-gray-400 mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <FaHome className="w-4 h-4" />
            <span>خانه</span>
          </Link>
          <span>/</span>
          <Link href="/posts" className="hover:text-white transition-colors">
            مقاله‌ها
          </Link>
          <span>/</span>
          <span className="text-gray-500 truncate">{post.title}</span>
        </nav>

        {/* Hero Section */}
        <div className="relative w-full aspect-video mb-8 rounded-2xl overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/60" />
        </div>

        {/* Post Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-gray-400">
            <div className="flex items-center gap-2">
              <FaUser className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendar className="w-4 h-4" />
              <span>{post.date}</span>
            </div>
          </div>
        </div>

        {/* Banner Ads */}
        <div className="my-8">
          <BannerAds />
        </div>

        {/* Post Content */}
        <article dangerouslySetInnerHTML={{ __html: post.content }}></article>

        {/* Post Footer */}
        <div className="mt-12 pt-8 border-t border-stone-800">
          <div className="flex flex-wrap justify-between items-center gap-4 text-gray-400">
            <div className="flex items-center gap-2">
              <FaUser className="w-4 h-4" />
              <span>نویسنده: {post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendar className="w-4 h-4" />
              <span>تاریخ انتشار: {post.date}</span>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-12">
          <div className="text-center bg-stone-950/50 backdrop-blur-sm rounded-xl p-8 border border-stone-800">
            <p className="text-gray-400">بخش نظرات به زودی اضافه خواهد شد</p>
          </div>
        </div>
      </div>
    </div>
  );
}
