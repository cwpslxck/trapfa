"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useError } from "@/components/ErrorContext";
import LoadingPage from "@/components/LoadingPage";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);
  const { showError, showSuccess } = useError();
  const router = useRouter();

  useEffect(() => {
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
        // Fetch user profile after successful login
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name, avatar_url")
          .eq("id", loginData.user.id)
          .single();

        if (profile) {
          localStorage.setItem(
            "userProfile",
            JSON.stringify({
              display_name: profile.display_name,
              avatar_url: profile.avatar_url,
            })
          );
        }

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
    <div className="h-screen z-[90] absolute w-full inset-0 px-4 lg:px-0 bg-black flex justify-center gap-10 items-center">
      <Link
        href="/"
        className="absolute top-4 left-4 text-white/70 hover:text-white duration-300"
      >
        <FaArrowLeft size={24} />
      </Link>
      <form
        onSubmit={handleAuth}
        className="w-full h-auto flex justify-center mx-auto max-w-[360px]"
      >
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

        <a className="opacity-70 w-full hover:opacity-100 duration-300 text-xs text-center">
          ورود شما به معنای پذیرش قوانین ترپفا است.
        </a>
      </form>
    </div>
  );
}
