import LoadingPart from "@/components/LoadingPart";
import PostParts from "@/components/PostParts";
import Title from "@/components/Title";
import "dotenv/config";

const loading = false;
const articles = [
  {
    link: "helo",
    title: "ما کی هستیم و قراره چیکار کنیم؟",
    desc: "دستمو نگیر چون دستم روله من منمن نم تسمنت منیتب نمست نمیت بنمسیبت نمسب نسیتب منتبمنس منسبت نمبت سنمبت سمنبتمسینبمسن بتسیمنتمنبتسمنیبت یسمنتسمنیتیسبمنتبسنمتسبینمبسی",
  },
  {
    link: "helo",
    title: "شروع اسم نداره از کجا بود؟",
    desc: "دستمو نگیر چون دستم روله من منمن نم تسمنت منیتب نمست نمیت بنمسیبت نمسب نسیتب منتبمنس منسبت نمبت سنمبت سمنبتمسینبمسن بتسیمنتمنبتسمنیبت یسمنتسمنیتیسبمنتبسنمتسبینمبسی",
  },
  {
    link: "helo",
    title: "مزایای جامعه سازی با دیدگاه پوبون",
    desc: "دستمو نگیر چون دستم روله من منمن نم تسمنت منیتب نمست نمیت بنمسیبت نمسب نسیتب منتبمنس منسبت نمبت سنمبت سمنبتمسینبمسن بتسیمنتمنبتسمنیبت یسمنتسمنیتیسبمنتبسنمتسبینمبسی",
  },
];

export default function ArticlesPage() {
  const loading = false;
  return (
    <>
      <Title
        title={"مقاله ها"}
        desc={"لیستی از مقاله های منتشر شده از ترپفا"}
      />
      {loading ? (
        <LoadingPart />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((p, i) => (
            <PostParts
              key={i}
              url={p.link}
              title={p.title}
              desc={p.desc}
              img={p.image}
              min={p.min}
            />
          ))}
        </div>
      )}
    </>
  );
}
