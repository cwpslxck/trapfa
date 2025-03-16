"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useError } from "@/components/ErrorContext";
import { supabase } from "@/lib/supabase";
import {
  FaInstagram,
  FaArrowLeft,
  FaUserAlt,
  FaBullseye,
  FaSoundcloud,
  FaTelegramPlane,
  FaSpotify,
  FaYoutubeSquare,
  FaUserFriends,
  FaPinterestSquare,
  FaLinkedin,
} from "react-icons/fa";
import LoadingPage from "@/components/LoadingPage";
import { MdSell } from "react-icons/md";

export default function PlusSubmitPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useError();
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    role: "",
    platforms: {},
    user_id: "",
  });

  const platformConfigs = {
    خوانندگی: [
      { icon: FaInstagram, prefix: "@", name: "instagram", required: true },
      { icon: FaTelegramPlane, prefix: "@", name: "telegram" },
      {
        icon: FaYoutubeSquare,
        prefix: "youtube.com/@",
        name: "youtube",
      },
      {
        icon: FaSoundcloud,
        prefix: "soundcloud.com/",
        name: "soundcloud",
        required: true,
      },
      {
        icon: FaSpotify,
        prefix: "spotify.com/",
        name: "spotify",
      },
    ],
    آهنگسازی: [
      { icon: FaInstagram, prefix: "@", name: "instagram", required: true },
      { icon: FaTelegramPlane, prefix: "@", name: "telegram" },
      { icon: MdSell, prefix: "beatstars.com/", name: "beatstars" },
      {
        icon: FaYoutubeSquare,
        prefix: "youtube.com/@",
        name: "youtube",
      },
      {
        icon: FaSoundcloud,
        prefix: "soundcloud.com/",
        name: "soundcloud",
      },
      {
        icon: FaSpotify,
        prefix: "spotify.com/",
        name: "spotify",
      },
    ],
    "ویژوال آرتیست": [
      { icon: FaInstagram, prefix: "@", name: "instagram", required: true },
      { icon: FaTelegramPlane, prefix: "@", name: "telegram" },
      {
        icon: FaPinterestSquare,
        prefix: "pintrest.com/",
        name: "pintrest",
      },
      {
        icon: FaYoutubeSquare,
        prefix: "youtube.com/@",
        name: "youtube",
      },
    ],
    منیجمنت: [
      { icon: FaInstagram, prefix: "@", name: "instagram", required: true },
      { icon: FaTelegramPlane, prefix: "@", name: "telegram" },
      { icon: FaLinkedin, prefix: "linkedin.com/in/", name: "linkedin" },
    ],
  };

  const validateUrl = (url) => {
    // Check for length
    if (url.length < 3) {
      throw new Error("یوزرنیم باید حداقل ۳ کاراکتر باشد");
    }
    if (url.length > 18) {
      throw new Error("یوزرنیم نمیتواند بیشتر از ۱۸ کاراکتر باشد");
    }

    // Check for spaces
    if (url.includes(" ")) {
      throw new Error("یوزرنیم نمیتواند شامل فاصله باشد");
    }

    // Check for valid characters (A-Z, a-z, 0-9, _)
    const validUrlRegex = /^[A-Za-z0-9_]+$/;
    if (!validUrlRegex.test(url)) {
      throw new Error("یوزرنیم فقط میتواند شامل حروف انگلیسی، اعداد و _ باشد");
    }

    return true;
  };

  useEffect(() => {
    const checkExistingArtist = async () => {
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

        // Check if user already has an artist profile
        const { data: artistData, error: artistError } = await supabase
          .from("artists")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (artistError && artistError.code !== "PGRST116") {
          throw artistError;
        }

        if (artistData) {
          // User already has an artist profile, redirect to dashboard
          router.push("/dashboard");
          return;
        }

        // No existing profile, continue with form
        setLoading(false);
      } catch (error) {
        showError(error.message);
        setLoading(false);
      }
    };

    checkExistingArtist();
  }, []);

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

      // Check if user already has an artist profile
      const { data: artistData, error: artistError } = await supabase
        .from("artists")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (artistError && artistError.code !== "PGRST116") {
        throw artistError;
      }

      if (artistData) {
        router.push("/dashboard");
        return;
      }

      if (step === 1) {
        // Validate URL format first
        try {
          validateUrl(formData.url);
        } catch (validationError) {
          showError(validationError.message);
          setLoading(false);
          return;
        }

        // Check if URL is already taken
        const { data: existingUrl, error: urlError } = await supabase
          .from("artists")
          .select("url")
          .eq("url", formData.url)
          .single();

        if (urlError && urlError.code !== "PGRST116") {
          throw urlError;
        }

        if (existingUrl) {
          showError("این یوزرنیم قبلا انتخاب شده است");
          setLoading(false);
          return;
        }

        setStep(2);
      } else if (step === 2) {
        setStep(3);
      } else if (step === 3) {
        const { error: insertError } = await supabase.from("artists").insert({
          user_id: user.id,
          url: formData.url,
          role: formData.role,
          platforms: formData.platforms,
        });

        if (insertError) {
          throw insertError;
        }
        // Successfully inserted the artist data
        showSuccess("اکانت پلاس شما با موفقیت ثبت شد");
        router.push("/dashboard");
      }
    } catch (error) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleNextStep} className="verifyform w-full">
            <h1 className="text-xl mb-2 font-semibold tracking-wider">
              یوزرنیم
            </h1>

            <div className="bg-gradient-to-br from-green-400 to-green-400 p-[1px] rounded-xl w-full">
              <div className="bg-stone-900 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <FaUserAlt className="text-2xl text-green-400" />
                  <span className="text-sm font-medium text-gray-300">
                    یوزر نیم خودتون رو انتخاب کنید.
                  </span>
                </div>

                <div className="inputholder bg-stone-800/50 rounded-lg">
                  <span className="text-stone-400">trapfa.ir/@</span>
                  <input
                    type="text"
                    name="url"
                    autoFocus
                    value={formData.url}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        url: e.target.value,
                      }))
                    }
                    placeholder=""
                    className="bg-transparent placeholder:text-left ltr border-none outline-none flex-1"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              className="bg-green-500 hover:bg-green-500/90"
              type="submit"
              disabled={loading}
            >
              مرحله بعد
            </button>
          </form>
        );

      case 2:
        return (
          <form onSubmit={handleNextStep} className="verifyform w-full">
            <h1 className="text-xl mb-2 font-semibold tracking-wider">
              زمینه فعالیت
            </h1>

            <div className="bg-gradient-to-r from-green-400 to-green-600 p-[1px] rounded-xl w-full">
              <div className="bg-stone-900 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <FaBullseye className="text-2xl text-green-400" />
                  <span className="text-sm font-medium text-gray-300">
                    توی چه زمینه ای فعالیت میکنید؟
                  </span>
                </div>

                <div className="w-full text-gray-300 grid grid-cols-2 gap-4">
                  {["خوانندگی", "آهنگسازی", "ویژوال آرتیست", "منیجمنت"].map(
                    (role) => (
                      <div
                        key={role}
                        className={`aspect-video flex items-center justify-center p-4 rounded-lg cursor-pointer transition-colors duration-300 ${
                          formData.role === role
                            ? "bg-green-600 text-white"
                            : "bg-stone-800 text-gray-300"
                        } hover:bg-green-500 hover:text-white`}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            role: role,
                          }))
                        }
                      >
                        {role}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
            <p className="pt-2 font-light text-sm opacity-90">
              نزدیک ترین گزینه به خودتون رو انتخاب کنید.
              <br /> این انتخاب برای آسون تر کردن دسترسی شماست.
            </p>

            <button
              className="bg-green-500 hover:bg-green-500/90"
              type="submit"
              disabled={loading}
            >
              مرحله بعد
            </button>
          </form>
        );

      case 3:
        const platforms = platformConfigs[formData.role] || [];
        return (
          <form onSubmit={handleNextStep} className="verifyform w-full">
            <h1 className="text-xl mb-2 font-semibold tracking-wider">
              سوشال مدیا - {formData.role}
            </h1>

            <div className="bg-gradient-to-r from-green-400 to-green-600 p-[1px] rounded-xl w-full">
              <div className="bg-stone-900 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <FaUserFriends className="text-2xl text-green-400" />
                  <span className="text-sm font-medium text-gray-300">
                    لینک سوشال مدیاهای خودتون رو وارد کنید.
                  </span>
                </div>

                <div className="flex gap-2 flex-col">
                  {platforms.map((platform, index) => (
                    <div
                      key={platform.name}
                      className="inputholder bg-stone-800/50 rounded-lg"
                    >
                      <span className="text-stone-400 inline-flex items-center gap-1.5">
                        <platform.icon size={20} /> {platform.prefix}
                      </span>
                      <input
                        type="text"
                        name={platform.name}
                        autoFocus={index === 0}
                        value={formData.platforms[platform.name] || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            platforms: {
                              ...prev.platforms,
                              [platform.name]: e.target.value,
                            },
                          }))
                        }
                        placeholder=""
                        className="bg-transparent placeholder:text-left ltr border-none outline-none flex-1"
                        required={platform?.required || false}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              className="bg-green-500 hover:bg-green-500/90"
              type="submit"
              disabled={loading}
            >
              ثبت اکانت پلاس
            </button>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center">
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <Link
            href="/"
            className="absolute top-4 left-4 text-white/70 hover:text-white duration-300"
          >
            <FaArrowLeft size={24} />
          </Link>
          <div className="verifyformcontainer">
            <div className="lg:max-w-md select-none">{renderStepContent()}</div>
          </div>
        </>
      )}
    </div>
  );
}
