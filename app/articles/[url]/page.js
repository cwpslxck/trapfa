import BannerAds from "@/components/BannerAds";
import Comments from "@/components/Comments";
import Image from "next/image";
import Link from "next/link";
import { FaCalendar, FaPenAlt } from "react-icons/fa";

function PostsSpecific() {
  // fetch from db where {url} is folan
  return (
    <div className="px-0 md:px-16 lg:px-32 w-full flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <div className="pb-4 px-0 lg:px-8">
          <Image
            draggable="false"
            width={600}
            height={500}
            loading="lazy"
            className="w-full rounded-xl"
            alt={"Image"}
            src={"/post1.webp"}
          />
        </div>
        <div>
          <div>
            <div className="flex flex-row gap-1 font-thin opacity-70 justify-center items-center">
              <Link href={"/"}>ترپفا</Link>/
              <Link href={"/articles/"}>مقاله ها</Link>/
              <Link href={"/articles/folan"}>
                ترپفا: ما کی هستیم و هدفمون چیه؟
              </Link>
            </div>
            <h1 className="text-5xl font-extrabold text-center leading-tight">
              ترپفا: ما کی هستیم و هدفمون چیه؟
            </h1>
            <div className="px-0 lg:px-8">
              <p className="opacity-80 font-extralight pt-2">
                سشتیشمتمشت منتمشتم تمنشت ت منتمش یتشی تمنتمنشتیمشتمنتمن منیت منی
                شمنیتشمنیت م
              </p>
            </div>
          </div>
        </div>
        <div className="pt-2">
          <BannerAds />
        </div>
      </div>
      <div className="bg-stone-900 rounded-xl mt-4 p-3 max-w-3xl">
        <div id="content" className="text-lg font-light select-none">
          <h2>چی شد که ترپفا به وجود اومد؟</h2>
          <p>
            اکثر ما وقتی اسم هیپهاپولوژیست میاد یاد اون دوران طلاییش میفتیم.
            دورانی که شاهکارهایی مانند کاردی و قرص رو بیرون میداد. اکثر ما وقتی
            اسم هیپهاپولوژیست میاد یاد اون دوران طلاییش میفتیم.
          </p>
          <p>
            اکثر ما وقتی اسم هیپهاپولوژیست میاد یاد اون دوران طلاییش میفتیم.
            دورانی که شاهکارهایی مانند کاردی و قرص رو بیرون میداد. اکثر ما وقتی
            اسم هیپهاپولوژیست میاد یاد اون دوران طلاییش میفتیم.
          </p>
          <p>
            اکثر ما وقتی اسم هیپهاپولوژیست میاد یاد اون دوران طلاییش میفتیم.
            دورانی که شاهکارهایی مانند کاردی و قرص رو بیرون میداد. اکثر ما وقتی
            اسم هیپهاپولوژیست میاد یاد اون دوران طلاییش میفتیم.
          </p>
          <h2>چی شد که ترپفا به وجود اومد؟</h2>
          <p>
            اکثر ما وقتی اسم هیپهاپولوژیست میاد یاد اون دوران طلاییش میفتیم.
            دورانی که شاهکارهایی مانند کاردی و قرص رو بیرون میداد. اکثر ما وقتی
            اسم هیپهاپولوژیست میاد یاد اون دوران طلاییش میفتیم.
          </p>
          <p>
            اکثر ما وقتی اسم هیپهاپولوژیست میاد یاد اون دوران طلاییش میفتیم.
            دورانی که شاهکارهایی مانند کاردی و قرص رو بیرون میداد. اکثر ما وقتی
            اسم هیپهاپولوژیست میاد یاد اون دوران طلاییش میفتیم.
          </p>
          <p>
            اکثر ما وقتی اسم هیپهاپولوژیست میاد یاد اون دوران طلاییش میفتیم.
            دورانی که شاهکارهایی مانند کاردی و قرص رو بیرون میداد. اکثر ما وقتی
            اسم هیپهاپولوژیست میاد یاد اون دوران طلاییش میفتیم.
          </p>
          <h2>چی شد که ترپفا به وجود اومد؟</h2>
          <p>
            اکثر ما وقتی اسم هیپهاپولوژیست میاد یاد اون دوران طلاییش میفتیم.
            دورانی که شاهکارهایی مانند کاردی و قرص رو بیرون میداد. اکثر ما وقتی
            اسم هیپهاپولوژیست میاد یاد اون دوران طلاییش میفتیم.
          </p>
          <p>
            اکثر ما وقتی اسم هیپهاپولوژیست میاد یاد اون دوران طلاییش میفتیم.
            دورانی که شاهکارهایی مانند کاردی و قرص رو بیرون میداد. اکثر ما وقتی
            اسم هیپهاپولوژیست میاد یاد اون دوران طلاییش میفتیم.
          </p>
          <p>
            اکثر ما وقتی اسم هیپهاپولوژیست میاد یاد اون دوران طلاییش میفتیم.
            دورانی که شاهکارهایی مانند کاردی و قرص رو بیرون میداد. اکثر ما وقتی
            اسم هیپهاپولوژیست میاد یاد اون دوران طلاییش میفتیم.
          </p>
        </div>
        {/* <div className="w-full opacity-80 mt-5 flex justify-between">
          <p>نویسنده: cwpslxck</p>
          <p>3/1/2025</p>
        </div> */}
      </div>
      <div className="max-w-3xl">{/* <Comments /> */}</div>
    </div>
  );
}

export default PostsSpecific;
