import React from "react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-6 text-center -mb-40">
        <h1 className="text-8xl font-black text-violet-500">404</h1>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">صفحه مورد نظر پیدا نشد</h2>
          <p className="text-white/60">
            صفحه‌ای که دنبالش می‌گردید وجود نداره یا جابجا شده
          </p>
        </div>
        <a
          href="/"
          className="bg-violet-500 hover:bg-violet-600 transition-colors px-6 py-3 rounded-xl inline-flex items-center gap-2"
        >
          برگشت به صفحه اصلی
        </a>
      </div>
    </div>
  );
}
