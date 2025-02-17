"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters, AiOutlineInstagram } from "react-icons/ai";

export default function VerifyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nickname: "",
    birthDate: "",
    city: "",
  });

  const handleInstagramAuth = async () => {
    setLoading(true);
    // اینجا لاجیک اتصال به اینستاگرام قرار می‌گیرد
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();

    if (step === 4) {
      // در مرحله آخر
      setLoading(true);
      // اینجا می‌تونید اطلاعات رو ذخیره کنید
      // await saveUserData(formData);
      router.push("/dashboard");
    } else {
      setStep(step + 1);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="w-full flex flex-col items-center">
            <h1 className="text-xl mb-2 font-semibold tracking-wider">
              احراز هویت
            </h1>
            <p className="my-3 text-sm text-center">
              برای ادامه لطفاً حساب اینستاگرام خود را متصل کنید.
            </p>
            <button
              onClick={handleInstagramAuth}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <span className="animate-spin">
                  <AiOutlineLoading3Quarters />
                </span>
              ) : (
                <>
                  <AiOutlineInstagram className="text-xl" />
                  اتصال به اینستاگرام
                </>
              )}
            </button>
          </div>
        );

      case 2:
        return (
          <form onSubmit={handleNextStep} className="w-full">
            <h1 className="text-xl mb-2 font-semibold tracking-wider">
              نام مستعار
            </h1>
            <p className="my-3 text-sm">
              دوست دارید شما را با چه نامی صدا کنیم؟
            </p>
            <input
              type="text"
              name="nickname"
              placeholder="نام مستعار"
              value={formData.nickname}
              onChange={handleInputChange}
              autoFocus
              required
            />
            <button type="submit">ادامه</button>
          </form>
        );

      case 3:
        return (
          <form onSubmit={handleNextStep} className="w-full">
            <h1 className="text-xl mb-2 font-semibold tracking-wider">
              تاریخ تولد
            </h1>
            <p className="my-3 text-sm">تاریخ تولد خود را وارد کنید</p>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
              required
            />
            <button type="submit">ادامه</button>
          </form>
        );

      case 4:
        return (
          <form onSubmit={handleNextStep} className="w-full">
            <h1 className="text-xl mb-2 font-semibold tracking-wider">
              شهر محل سکونت
            </h1>
            <p className="my-3 text-sm">در کدام شهر زندگی می‌کنید؟</p>
            <input
              type="text"
              name="city"
              placeholder="نام شهر"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
            <button type="submit">تکمیل ثبت‌نام</button>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen z-30 absolute w-full inset-0 px-4 lg:px-0 bg-black flex justify-start gap-10 items-center flex-col-reverse lg:flex-row">
      <div className="w-full h-full flex justify-center items-center mx-auto max-w-[360px]">
        {renderStepContent()}
      </div>
    </div>
  );
}
