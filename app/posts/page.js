"use client";

import { useEffect, useState } from "react";
import LoadingPart from "@/components/LoadingPart";
import PostParts from "@/components/PostParts";
import Title from "@/components/Title";
import { useError } from "@/components/ErrorContext";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useError();

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        const { feed: xmlText } = await response.json();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        const items = xmlDoc.getElementsByTagName("item");

        const postsData = Array.from(items).map((item) => {
          const link = item.getElementsByTagName("link")[0]?.textContent || "";
          const mediaContent = item.getElementsByTagName("media:content")[0];
          const imageUrl =
            mediaContent?.getAttribute("url") || "/default-article.jpg";

          return {
            id: link.split("/").pop() || "",
            title: item.getElementsByTagName("title")[0]?.textContent || "",
            description:
              item.getElementsByTagName("description")[0]?.textContent || "",
            author:
              item.getElementsByTagName("author")[0]?.textContent || "ترپفا",
            pubDate: item.getElementsByTagName("pubDate")[0]?.textContent || "",
            image: imageUrl,
          };
        });

        setPosts(postsData);
      } catch (error) {
        console.error("خطا در دریافت پست‌ها:", error);
        showError("خطا در دریافت پست‌ها");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Title title="مقاله‌ها" desc="آخرین مطالب منتشر شده در ترپفا" />

      {loading ? (
        <LoadingPart />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-stone-900/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-stone-800"
              >
                <PostParts
                  url={post.id}
                  title={post.title}
                  desc={post.description}
                  author={post.author}
                  date={new Date(post.pubDate).toLocaleDateString("fa-IR")}
                  image={post.image}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400 text-lg">هیچ پستی یافت نشد.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
