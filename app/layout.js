import Header from "@/components/Header";
import "./globals.css";
import { Vazirmatn } from "next/font/google";
import localFont from "next/font/local";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Trapfa | ترپفا",
  description: "Persian New-Gen Music Magazine",
};

const font1 = Vazirmatn({ subsets: ["arabic"] });
const font = localFont({ src: "../assets/font.ttf" });

export default function RootLayout({ children }) {
  return (
    <>
      <html lang="fa" className={font.className}>
        <body className="w-full flex justify-center">
          <div className="max-w-7xl flex flex-col justify-between w-full min-h-screen overflow-x-hidden">
            <div>
              <Header />
              <main className="px-6 md:px-12 lg:px-16">{children}</main>
            </div>
            <Footer />
          </div>
        </body>
      </html>
    </>
  );
}
