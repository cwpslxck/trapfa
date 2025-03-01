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
  const [loading, setLoading] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);
  const { showError, showSuccess } = useError();
  const router = useRouter();

  useEffect(() => {
    // چک کردن localStorage
    const cachedUser = localStorage.getItem("cached_user");
    const lastCheck = localStorage.getItem("last_auth_check");
    const now = Date.now();

    // اگر کمتر از 1 ساعت از آخرین چک گذشته و کاربر در حافظه هست
    if (
      cachedUser &&
      lastCheck &&
      now - parseInt(lastCheck) < 60 * 60 * 1000 // 1 ساعت
    ) {
      router.push("/dashboard");
      return;
    }

    // در غیر این صورت از سرور چک می‌کنیم
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        router.push("/dashboard");
        return;
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  async function handleAuth(event) {
    event.preventDefault();
    setLoadingButton(true);

    try {
      if (!email || !password) {
        throw new Error("ایمیل یا رمز عبور اشتباه است.");
      }

      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({ email, password });

      if (loginData?.user) {
        showSuccess("با موفقیت وارد شدید!");
        router.push("/dashboard");
      } else {
        const { data: signUpData, error: signUpError } =
          await supabase.auth.signUp({ email, password });

        if (signUpError) {
          if (signUpError.message.includes("already registered")) {
            throw new Error("ایمیل یا رمز عبور اشتباه است.");
          } else if (signUpError.message.includes("at least 6 characters")) {
            throw new Error("رمز عبور باید حداقل ۶ کاراکتر باشد.");
          } else {
            throw signUpError;
          }
        } else if (signUpData?.user) {
          showSuccess("ثبت‌نام با موفقیت انجام شد!");
          router.push("/verify");
        }
      }
    } catch (error) {
      showError(error.message);
    } finally {
      setLoadingButton(false);
    }
  }

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="h-screen z-30 absolute w-full inset-0 px-4 lg:px-0 bg-black flex justify-start gap-10 items-center flex-col-reverse lg:flex-row">
      <div className="w-full h-full flex justify-center items-center mx-auto max-w-[360px]">
        <form onSubmit={handleAuth}>
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
          <button type="submit" disabled={loadingButton}>
            {loadingButton ? (
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
