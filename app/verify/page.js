"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useError } from "@/components/ErrorContext";
import { supabase } from "@/lib/supabase";
import {
  FaInstagram,
  FaCopy,
  FaCheck,
  FaUser,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaExclamationTriangle,
} from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import LoadingPage from "@/components/LoadingPage";

export default function VerifyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useError();
  const [verificationCode, setVerificationCode] = useState("");
  const [formData, setFormData] = useState({
    instagramId: "",
    displayName: "",
    birthDate: "",
    city: "",
    screenshot: null,
  });
  const [copied, setCopied] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    checkPreviousRequests();
  }, []);

  const checkPreviousRequests = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) {
        router.push("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("verification_requests")
        .select("status")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const lastRequest = data[0];
        if (lastRequest.status === "pending") {
          setHasPendingRequest(true);
          setShowConfirmDialog(true);
          setLoading(false);
          return;
        } else if (lastRequest.status === "approved") {
          showError("حساب شما قبلاً تایید شده است");
          router.push("/dashboard");
          return;
        }
      }

      setLoading(false);
      generateVerificationCode();
    } catch (error) {
      router.push("/dashboard");
    }
  };

  const handleDeletePreviousRequest = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase
        .from("verification_requests")
        .delete()
        .eq("user_id", user.id)
        .eq("status", "pending");

      if (error) throw error;

      setHasPendingRequest(false);
      setShowConfirmDialog(false);
      generateVerificationCode();
    } catch (error) {
      showError("خطا در حذف درخواست قبلی");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const generateVerificationCode = () => {
    const code =
      "TRXP" +
      Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");
    setVerificationCode(code);
    return code;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        // 5MB
        showError("حجم فایل نباید بیشتر از 5 مگابایت باشد");
        return;
      }
      setFormData((prev) => ({ ...prev, screenshot: file }));
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(verificationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNextStep = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) {
        router.push("/auth");
        return;
      }

      if (step === 1) {
        if (!formData.instagramId) {
          throw new Error("لطفا آیدی اینستاگرام خود را وارد کنید");
        }

        // ذخیره آیدی اینستاگرام و کد تایید
        const code = generateVerificationCode();
        const { error } = await supabase.from("verification_requests").insert({
          user_id: user.id,
          instagram_id: formData.instagramId,
          verification_code: code,
          status: "pending",
        });

        if (error) throw error;
        setStep(2);
      } else if (step === 2) {
        setStep(3);
      } else if (step === 3) {
        if (!formData.screenshot) {
          throw new Error("لطفا اسکرین‌شات را آپلود کنید");
        }

        // آپلود عکس در storage
        const fileExt = formData.screenshot.name.split(".").pop();
        const fileName = `${user.id}_${Date.now()}.${fileExt}`;
        const filePath = `verification-screenshots/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("screenshots")
          .upload(filePath, formData.screenshot, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) throw uploadError;

        // دریافت URL عمومی فایل
        const {
          data: { publicUrl },
        } = supabase.storage.from("screenshots").getPublicUrl(filePath);

        // آپدیت رکورد با لینک اسکرین‌شات
        const { error: updateError } = await supabase
          .from("verification_requests")
          .update({
            screenshot_url: publicUrl,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id)
          .eq("verification_code", verificationCode);

        if (updateError) throw updateError;

        setStep(4); // حالا میریم سراغ اطلاعات شخصی
      } else if (step === 4) {
        if (!formData.displayName) {
          throw new Error("لطفا نام نمایشی خود را وارد کنید");
        }
        setStep(5);
      } else if (step === 5) {
        if (!formData.birthDate) {
          throw new Error("لطفا تاریخ تولد خود را وارد کنید");
        }
        setStep(6);
      } else if (step === 6) {
        if (!formData.city) {
          throw new Error("لطفا شهر محل سکونت خود را وارد کنید");
        }

        // ذخیره همه اطلاعات در جدول profiles
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: user.id,
          display_name: formData.displayName,
          birth_date: formData.birthDate,
          city: formData.city,
          updated_at: new Date().toISOString(),
        });

        if (profileError) throw profileError;

        showSuccess("اطلاعات شما با موفقیت ثبت شد");
        router.push("/dashboard");
      }
    } catch (error) {
      showError(error.message);
    } finally {
      window.location.reload();
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleNextStep} className="verifyform w-full">
            <h1 className="text-xl mb-2 font-semibold tracking-wider">
              اینستاگرام
            </h1>

            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-[1px] rounded-xl w-full">
              <div className="bg-stone-900 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <FaInstagram className="text-2xl text-pink-500" />
                  <span className="text-sm font-medium text-gray-300">
                    آیدی اینستاگرام خودتو وارد کن
                  </span>
                </div>

                <div className="inputholder bg-stone-800/50 rounded-lg">
                  <span className="text-stone-400">@</span>
                  <input
                    type="text"
                    name="instagramId"
                    value={formData.instagramId}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        instagramId: e.target.value,
                      }))
                    }
                    placeholder="trxpfa :مثال"
                    className="bg-transparent border-none outline-none flex-1"
                    required
                  />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading}>
              مرحله بعد
            </button>
          </form>
        );

      case 2:
        return (
          <form onSubmit={handleNextStep} className="verifyform w-full">
            <h1 className="text-xl mb-2 font-semibold tracking-wider">
              تایید هویت اینستاگرام
            </h1>
            <p className="my-3 text-sm leading-relaxed">
              برای اطمینان ازینکه کسی با پروفایل یک شخص دیگه ثبتنام نکنه ما
              مجبوریم که مراحل احراز هویت رو انجام بدیم.
              <br />
              <br />
              1. لطفا کد زیر رو کپی کنید
              <br />
              2. کد رو توی بیو اینستاگرام خودتون قرار بدید
              <br />
              3. از صفحه پروفایل اینستاگرام خودتون اسکرین‌شات بگیرید
            </p>

            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-[1px] rounded-xl w-full">
              <div className="bg-stone-900 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <FaInstagram className="text-2xl text-pink-500" />
                  <span className="text-sm font-medium text-gray-300">
                    کد تایید اینستاگرام
                  </span>
                </div>

                <div className="flex justify-center items-center gap-3">
                  <div className="bg-stone-800/50 h-12 text-lg w-1/2 font-mono text-violet-400 flex-1 p-2.5 rounded-lg flex justify-center items-center">
                    {verificationCode || (
                      <span className="animate-spin">
                        <AiOutlineLoading3Quarters />
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="bg-gradient-to-r w-1/2 from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 
                        text-white px-4 py-2.5 h-12 rounded-lg flex items-center gap-2 transition-all duration-200 mt-0"
                  >
                    {copied ? (
                      <FaCheck className="text-sm" />
                    ) : (
                      <FaCopy className="text-sm" />
                    )}
                    <span className="text-sm font-medium">
                      {copied ? "کپی شد" : "کپی کد"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading}>
              مرحله بعد
            </button>
          </form>
        );

      case 3:
        return (
          <form onSubmit={handleNextStep} className="verifyform w-full">
            <h1 className="text-xl mb-2 font-semibold tracking-wider">
              اسکرین‌شات رو آپلود کنید!
            </h1>
            <p className="my-3 text-sm">
              مطمئن بشید که کد ترپفا توی اسکرین‌شات معلوم باشه
              <br />
              اسکرین شات هایی که با موبایل نباشن قبول نمیشن.
            </p>
            <p className="mb-3 text-sm">
              اگه به هر دلیلی به مشکل خوردید به پشتیبانی پیام بدید.
            </p>

            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-[1px] rounded-xl w-full">
              <div className="bg-stone-800 rounded-xl p-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full"
                  required
                />
              </div>
            </div>

            <p className="text-sm">
              راستی الان میتونی کد رو از تو بیو پاک کنی:)
            </p>
            <button type="submit" disabled={loading}>
              ارسال و تکمیل ثبت‌نام
            </button>
          </form>
        );

      case 4:
        return (
          <form onSubmit={handleNextStep} className="verifyform w-full">
            <h1 className="text-xl mb-2 font-semibold tracking-wider">
              نام نمایشی
            </h1>

            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-[1px] rounded-xl w-full">
              <div className="bg-stone-900 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <FaUser className="text-2xl text-purple-500" />
                  <span className="text-sm font-medium text-gray-300">
                    دوست داری بقیه تو رو با چه اسمی صدا کنن؟
                  </span>
                </div>

                <div className="inputholder bg-stone-800/50 rounded-lg">
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        displayName: e.target.value,
                      }))
                    }
                    placeholder="مثلا: علی"
                    className="bg-transparent border-none outline-none flex-1"
                    required
                  />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading}>
              مرحله بعد
            </button>
          </form>
        );

      case 5:
        return (
          <form onSubmit={handleNextStep} className="verifyform w-full">
            <h1 className="text-xl mb-2 font-semibold tracking-wider">
              تاریخ تولد
            </h1>

            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-[1px] rounded-xl w-full">
              <div className="bg-stone-900 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <FaBirthdayCake className="text-2xl text-rose-500" />
                  <span className="text-sm font-medium text-gray-300">
                    تاریخ تولدت رو وارد کن
                  </span>
                </div>

                <div className="inputholder bg-stone-800/50 rounded-lg">
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        birthDate: e.target.value,
                      }))
                    }
                    className="bg-transparent border-none outline-none flex-1"
                    required
                  />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading}>
              مرحله بعد
            </button>
          </form>
        );

      case 6:
        return (
          <form onSubmit={handleNextStep} className="verifyform w-full">
            <h1 className="text-xl mb-2 font-semibold tracking-wider">
              شهر محل سکونت
            </h1>

            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-[1px] rounded-xl w-full">
              <div className="bg-stone-900 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <FaMapMarkerAlt className="text-2xl text-emerald-500" />
                  <span className="text-sm font-medium text-gray-300">
                    کجا زندگی می‌کنی؟
                  </span>
                </div>

                <div className="inputholder bg-stone-800/50 rounded-lg">
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        city: e.target.value,
                      }))
                    }
                    placeholder="مثلا: تهران"
                    className="bg-transparent border-none outline-none flex-1"
                    required
                  />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading}>
              مرحله بعد
            </button>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      {loading ? (
        <LoadingPage />
      ) : showConfirmDialog ? (
        <div className="w-full max-w-md space-y-8 bg-stone-900/50 p-8 rounded-2xl text-center">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-[1px] rounded-xl w-full">
            <div className="bg-stone-900 rounded-xl p-6">
              <FaExclamationTriangle className="text-5xl mx-auto mb-4 text-yellow-500" />
              <h1 className="text-xl font-semibold mb-4">
                درخواست قبلی شما در حال بررسی است
              </h1>
              <p className="text-sm text-gray-400 mb-6">
                آیا مطمئن هستید که می‌خواهید درخواست جدید ثبت کنید؟
                <br />
                این کار باعث حذف درخواست قبلی شما می‌شود.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleDeletePreviousRequest}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all"
                  disabled={loading}
                >
                  بله، درخواست جدید
                </button>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="flex-1 bg-stone-800 text-white px-6 py-3 rounded-xl hover:bg-stone-700 transition-all"
                >
                  انصراف
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="verifyformcontainer">
          <div className="lg:max-w-md">{renderStepContent()}</div>
        </div>
      )}
    </div>
  );
}
