"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useError } from "@/components/ErrorContext";
import LoadingPage from "@/components/LoadingPage";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const { showError } = useError();
  const router = useRouter();

  // چک کردن وضعیت کاربر هنگام لود شدن صفحه
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        router.push("/dashboard");
      } else {
        setPageLoading(false);
      }
    };
    checkUser();
  }, []);

  async function handleAuth(event) {
    event.preventDefault(); // جلوگیری از رفرش فرم

    if (!email || !password) {
      showError("ایمیل و رمز عبور را وارد کنید!");
      return;
    }

    setLoading(true);

    // سعی می‌کنیم لاگین کنیم
    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({ email, password });

    if (loginData?.user) {
      router.push("/dashboard");
    } else {
      // اگر لاگین ناموفق بود، ثبت‌نام انجام بده
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({ email, password });

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          showError("این ایمیل قبلاً ثبت شده است، لطفاً لاگین کنید!");
        } else {
          showError(signUpError.message);
        }
      } else {
        showError("ثبت‌نام موفق! لطفاً ایمیل خود را چک کنید.");
        router.push("/dashboard");
      }
    }

    setLoading(false);
  }

  if (pageLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="h-screen z-30 absolute w-full inset-0 px-4 lg:px-0 bg-black flex justify-start gap-10 items-center flex-col-reverse lg:flex-row">
      <div className="w-full h-full flex justify-center items-center mx-auto max-w-[360px]">
        <form onSubmit={handleAuth}>
          {" "}
          {/* اضافه کردن onSubmit */}
          <h1 className="text-xl mb-2 font-semibold tracking-wider">
            ورود | ثبت‌نام
          </h1>
          <p className="my-3 text-sm">
            سلام!
            <br />
            برای ادامه ایمیل و پسورد خود را وارد کنید.
          </p>
          <input
            type="email"
            placeholder="ایمیل"
            autoFocus
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="رمز عبور"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? (
              <span className="animate-spin">
                <AiOutlineLoading3Quarters />
              </span>
            ) : (
              "ادامه"
            )}
          </button>
          <a className="opacity-70 hover:opacity-100 duration-300 text-xs text-center">
            ورود شما به معنای پذیرش قوانین حریم‌خصوصی ترپفا است.
          </a>
        </form>
      </div>
    </div>
  );
}
