"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaUsers,
  FaNewspaper,
  FaMusic,
  FaCheckCircle,
  FaCog,
} from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";

// تعریف دسترسی‌های هر رول
const roleAccess = {
  0: [], // کاربر عادی
  1: ["verifications"], // مدیر درخواست‌ها
  2: ["users"], // مدیر کاربران
  3: ["articles", "artists"], // ویرایشگر محتوا
  4: ["users", "articles", "artists", "verifications"], // ادمین
  5: ["users", "articles", "artists", "verifications", "settings"], //خدااا
};

const menuItems = [
  {
    title: "داشبورد",
    icon: <FaHome />,
    href: "/admin",
    access: [1, 2, 3, 4, 5], // همه سطوح ادمین
  },
  {
    title: "کاربران",
    icon: <FaUsers />,
    href: "/admin/users",
    access: [2, 4, 5], // مدیر کاربران و بالاتر
  },
  {
    title: "مقالات",
    icon: <FaNewspaper />,
    href: "/admin/articles",
    access: [3, 4, 5], // ویرایشگر محتوا و بالاتر
  },
  {
    title: "هنرمندان",
    icon: <FaMusic />,
    href: "/admin/artists",
    access: [3, 4, 5], // ویرایشگر محتوا و بالاتر
  },
  {
    title: "درخواست‌های تایید",
    icon: <FaCheckCircle />,
    href: "/admin/verifications",
    access: [1, 4, 5], // مدیر درخواست‌ها و بالاتر
  },
  {
    title: "تنظیمات",
    icon: <FaCog />,
    href: "/admin/settings",
    access: [5], // فقط سوپر ادمین
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { profile } = useAuth();
  const userRole = profile?.admin || 0;

  // فیلتر کردن آیتم‌های منو براساس دسترسی کاربر
  const filteredMenuItems = menuItems.filter((item) =>
    item.access.includes(userRole)
  );

  return (
    <aside className="w-64 bg-stone-900 border-l border-stone-800 rounded-xl">
      <div className="p-6">
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          پنل مدیریت
        </h1>
        <p className="text-sm text-stone-400 mt-1">
          {userRole === 5
            ? "سوپر ادمین"
            : userRole === 4
            ? "ادمین"
            : userRole === 3
            ? "ویرایشگر محتوا"
            : userRole === 2
            ? "مدیر کاربران"
            : userRole === 1
            ? "مدیر درخواست‌ها"
            : "کاربر"}
        </p>
      </div>
      <nav className="mt-6">
        {filteredMenuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 text-sm ${
                isActive
                  ? "bg-stone-800 text-white border-r-2 border-purple-500"
                  : "text-stone-400 hover:bg-stone-800/50"
              }`}
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
