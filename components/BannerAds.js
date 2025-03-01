import Link from "next/link";
import React from "react";

export default function BannerAds() {
  return (
    <Link
      target="_blank"
      href={`https://trapfabot.t.me?start=${encodeURIComponent(
        "متن پیام کاربر"
      )}`}
      className="from-stone-900/90 via-stone-900/70 to-stone-900/80 bg-gradient-to-l hover:bg-gradient-to-r text-center w-full flex flex-col justify-center items-center gap-2 rounded-xl p-6 my-4 select-none"
    >
      <h2 className="text-3xl lg:text-4xl font-semibold shadow-white/20">
        محل تبلیغ برند شما
      </h2>
      <h2>برای رزرو تبلیغات بهمون پیام بدید.</h2>
    </Link>
  );
}
