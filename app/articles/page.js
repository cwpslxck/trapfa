"use client";

import { useEffect, useState } from "react";
import LoadingPart from "@/components/LoadingPart";
import PostParts from "@/components/PostParts";
import Title from "@/components/Title";
import { useError } from "@/components/ErrorContext";

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useError();

  useEffect(() => {
    const loadPosts = async () => {
      try {
        // چک کردن کش
        const cachedData = localStorage.getItem("articles_data");
        const cachedTimestamp = localStorage.getItem("articles_timestamp");

        if (cachedData && cachedTimestamp) {
          const CACHE_TIME = 60 * 60 * 1000; // 1 ساعت
          if (Date.now() - parseInt(cachedTimestamp) < CACHE_TIME) {
            setArticles(JSON.parse(cachedData));
            setLoading(false);
            return;
          }
        }

        // اگر کش نبود یا منقضی شده بود
        const response = await fetch("/api/virgool");
        const { feed: xmlText, thumbnails } = await response.json();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        const items = xmlDoc.getElementsByTagName("item");

        const posts = Array.from(items).map((item) => {
          const link = item.getElementsByTagName("link")[0]?.textContent || "";
          return {
            title: item.getElementsByTagName("title")[0]?.textContent || "",
            link,
            description:
              item.getElementsByTagName("description")[0]?.textContent || "",
            author: item.getElementsByTagName("author")[0]?.textContent || "",
            category:
              item.getElementsByTagName("category")[0]?.textContent || "",
            pubDate: item.getElementsByTagName("pubDate")[0]?.textContent || "",
            url: link.split("/").pop() || "",
            thumbnail: thumbnails[link] || "/default-article.jpg",
          };
        });

        const processedArticles = posts.map((post) => ({
          link: post.url,
          title: post.title,
          desc: post.description.substring(0, 200) + "...",
          author: post.author,
          category: post.category,
          date: new Date(post.pubDate).toLocaleDateString("fa-IR"),
          image: post.thumbnail,
        }));

        // ذخیره در localStorage
        localStorage.setItem(
          "articles_data",
          JSON.stringify(processedArticles)
        );
        localStorage.setItem("articles_timestamp", Date.now().toString());

        setArticles(processedArticles);
      } catch (error) {
        console.error("Error loading posts:", error);
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
          {articles.length > 0 ? (
            articles.map((post, i) => (
              <PostParts
                key={i}
                url={post.link}
                title={post.title}
                desc={post.desc}
                author={post.author}
                category={post.category}
                date={post.date}
                image={post.image}
              />
            ))
          ) : (
            <p className="text-center text-gray-400 col-span-full">
              هیچ مقاله‌ای یافت نشد.
            </p>
          )}
        </div>
      )}
    </>
  );
}
