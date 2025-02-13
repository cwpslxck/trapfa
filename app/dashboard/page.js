"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoadingPage from "@/components/LoadingPage";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        router.push("/auth");
      } else {
        setUser(data.user);
        setPageLoading(false);
      }
    }
    getUser();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (!user || pageLoading) {
    return <LoadingPage />;
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">داشبورد</h1>
        <p className="mb-2">ایمیل: {user.email}</p>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white p-2 rounded"
        >
          خروج
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href={"/dashboard/songs"}
          className="w-full flex py-16 justify-center items-center bg-stone-900 hover:bg-stone-900/80 rounded-xl"
        >
          آهنگ
        </Link>
        <Link
          href={"/dashboard/artists"}
          className="w-full py-16 flex justify-center items-center bg-stone-900 hover:bg-stone-900/80 rounded-xl"
        >
          آرتیست
        </Link>
      </div>
    </>
  );
}
