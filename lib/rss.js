export async function fetchBlogPosts() {
  try {
    const response = await fetch("/api/blogix");
    const text = await response.text();

    // پارس کردن XML به JSON
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "text/xml");
    const items = xmlDoc.querySelectorAll("item");

    return Array.from(items).map((item) => {
      // گرفتن محتوای کامل پست
      const content = item.querySelector("description")?.textContent || "";

      // گرفتن تصویر از تگ media:content
      let image =
        item.querySelector("media\\:content, content")?.getAttribute("url") || // روش اول: تگ media:content
        content.match(/<img[^>]+src=["']([^"']+)["']/)?.[1] || // روش دوم: تگ img
        "/loadings/article.jpg"; // تصویر پیش‌فرض

      // اطمینان از اینکه URL تصویر کامل است
      if (image && !image.startsWith("http")) {
        image = image.startsWith("/")
          ? `https://trxpfa.blogix.ir${image}`
          : `https://trxpfa.blogix.ir/${image}`;
      }

      // حذف HTML تگ‌ها از توضیحات
      const plainDescription = content
        .replace(/<[^>]+>/g, "") // حذف تمام تگ‌های HTML
        .replace(/&nbsp;/g, " ") // تبدیل فاصله‌های HTML به فاصله معمولی
        .replace(/\s+/g, " ") // حذف فاصله‌های اضافی
        .trim();

      return {
        title: item.querySelector("title")?.textContent || "",
        link: item.querySelector("link")?.textContent || "",
        description: plainDescription,
        pubDate: item.querySelector("pubDate")?.textContent || "",
        image: image,
      };
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}
