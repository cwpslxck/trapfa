"use client";

import { useEffect, useState } from "react";
import LoadingPart from "@/components/LoadingPart";
import PostParts from "@/components/PostParts";
import Title from "@/components/Title";
import { fetchBlogPosts } from "@/lib/rss";
import { useError } from "@/components/ErrorContext";

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useError();

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const posts = await fetchBlogPosts();
        setArticles(
          posts.map((post) => ({
            link: post.link.split("/").pop(), // گرفتن آخرین بخش URL
            title: post.title,
            desc:
              post.description.replace(/<[^>]*>/g, "").substring(0, 200) +
              "...", // حذف HTML تگ‌ها
            image: post.image,
            date: new Date(post.pubDate).toLocaleDateString("fa-IR"),
          }))
        );
      } catch (error) {
        showError("خطا در دریافت مقالات");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  return (
    <>
      <Title
        title={"مقاله‌ها"}
        desc={"لیستی از مقاله‌های منتشر شده از ترپفا"}
      />
      {loading ? (
        <LoadingPart />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((post, i) => (
            <PostParts
              key={i}
              url={post.link}
              title={post.title}
              desc={post.desc}
              img={post.image}
              date={post.date}
            />
          ))}
        </div>
      )}
    </>
  );
}
