import Title from "@/components/Title";
import Link from "next/link";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function PlusPage() {
  const features = [
    { text: "دسترسی به آهنگ‌های اختصاصی", included: true },
    { text: "مقالات ویژه", included: true },
    { text: "پشتیبانی 24/7", included: true },
    { text: "بدون تبلیغات", included: true },
    { text: "دسترسی به نسخه رایگان", included: false },
  ];

  return (
    <div>
      <Title
        title={"ترپفا پلاس"}
        desc={
          "با خرید ترپفا پلاس، بصورت رسمی عضو ویژه کامل ترین پلتفرم کامیونیتی موسیقی فارسی بپیوندید!"
        }
      />

      <div className="max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          <div className="bg-stone-900 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">ویژگی‌ها</h2>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  {feature.included ? (
                    <FaCheckCircle className="text-green-500" />
                  ) : (
                    <FaTimesCircle className="text-red-500" />
                  )}
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-stone-900 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">خرید اشتراک</h2>
            <p className="text-lg mb-6">
              با خرید اشتراک ویژه، از تمامی امکانات و محتوای اختصاصی بهره‌مند
              شوید.
            </p>
            <Link
              href={"/plus/submit"}
              className="block w-full text-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-3 rounded-lg transition-all"
            >
              خرید اشتراک
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
