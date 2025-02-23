"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { FaSignOutAlt, FaBell, FaUserAlt } from "react-icons/fa";

export default function Header() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <header className="bg-stone-900 border-b border-stone-800 h-16 rounded-xl">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-medium">پنل مدیریت ترپفا</h2>
        </div>

        <div className="flex items-center gap-2">
          {/* <button className="p-2 text-stone-400 hover:text-white transition-colors">
            <FaBell className="size-5" />
          </button> */}
          <button
            onClick={() => router.push("/dashboard")}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            <FaSignOutAlt className="size-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
