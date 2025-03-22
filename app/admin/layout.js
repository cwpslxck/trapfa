"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LoadingPage from "@/components/LoadingPage";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  MdDashboard,
  MdMenu,
  MdClose,
  MdPerson,
  MdSettings,
  MdBarChart,
  MdContentPaste,
  MdLogout,
  MdVerifiedUser,
  MdRequestQuote,
  MdRequestPage,
  MdVerified,
} from "react-icons/md";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function AdminLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [storedProfile, setStoredProfile] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile } = useAuth();

  useEffect(() => {
    const getUserLocalData = async () => {
      try {
        const profileData = JSON.parse(localStorage.getItem("userProfile"));
        setStoredProfile(profileData);
        setLoading(false);
      } catch (error) {
        console.error("Error loading profile from localStorage:", error);
      }
    };
    const checkAdminAccess = async () => {
      try {
        if (!user) {
          router.push("/auth");
          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        const response = await fetch("/api/me/admin", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Unauthorized");
        }

        setLoading(false);
      } catch (error) {
        console.error("Admin access error:", error);
        router.push("/dashboard");
      }
    };

    getUserLocalData();
    checkAdminAccess();
  }, [user]);

  if (loading) {
    return <LoadingPage />;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Remove this line
  // const storedProfile = JSON.parse(localStorage.getItem("userProfile"));

  const menuItems = [
    { name: "داشبورد", icon: <MdDashboard />, href: "/admin" },
    { name: "کاربران", icon: <MdPerson />, href: "/admin/users" },
    { name: "مقاله ها", icon: <MdContentPaste />, href: "/admin/posts" },
    {
      name: "وریفای",
      icon: <MdVerified />,
      href: "/admin/verify",
    },
    { name: "تنظیمات", icon: <MdSettings />, href: "/admin/settings" },
  ];

  return (
    <div className="flex min-h-screen fixed inset-0 bg-black z-[100]">
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 right-0 w-64 bg-zinc-950 border-l border-zinc-800/50 transform ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } lg:translate-x-0 transition-all duration-300 ease-in-out z-[120]`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-zinc-800/50">
            <div className="flex items-center justify-start gap-3">
              <button
                className="p-2 rounded-lg bg-purple-600/10 lg:hidden"
                onClick={closeSidebar}
              >
                <MdClose className="text-2xl text-purple-500" />
              </button>
              <div className="p-2 rounded-lg bg-purple-600/10 hidden lg:block">
                <MdDashboard className="text-2xl text-purple-500" />
              </div>
              <h2 className="text-xl font-bold text-white">ترپفا ادمین</h2>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {menuItems.map((item, index) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin" // Exact match for dashboard
                    : pathname.startsWith(`${item.href}/`) ||
                      pathname === item.href;

                return (
                  <li key={index}>
                    <Link
                      href={item.href}
                      onClick={closeSidebar}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                        isActive
                          ? "bg-purple-600/10 text-purple-500"
                          : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.name}</span>
                      {isActive && (
                        <div className="w-1 h-8 bg-purple-500 rounded-full absolute right-0" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-zinc-800/50">
            <div className="p-4 rounded-lg bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <Image
                  alt="Avatar"
                  src={storedProfile?.avatar_url || "/default-avatar.jpg"}
                  width={50}
                  height={50}
                  className="w-10 h-10 object-cover rounded-full"
                />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {storedProfile?.display_name || ""}
                  </p>
                  <p className="text-xs text-zinc-400 truncate">
                    {user?.email || ""}
                  </p>
                </div>
                <Link
                  href={"/dashboard"}
                  className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/50"
                >
                  <MdLogout />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:mr-64 overflow-y-auto h-screen">
        {/* Header */}
        <header className="sticky top-0 right-0 left-0 z-[90] bg-black/50 backdrop-blur-lg border-b border-zinc-800/50">
          <div className="px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/50"
                onClick={toggleSidebar}
              >
                <MdMenu className="text-2xl" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">پنل مدیریت</h1>
                <p className="text-sm text-zinc-400">مدیریت محتوای ترپفا</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="px-4 ">
          <div className="">{children}</div>
        </main>
      </div>
    </div>
  );
}
