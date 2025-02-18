import Header from "@/components/Header";
import "./globals.css";
import { Rubik } from "next/font/google";
import Footer from "@/components/Footer";
import { ErrorProvider } from "@/components/ErrorContext";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata = {
  title: "Trapfa | ترپفا",
  description: "Persian New-Gen Music Magazine",
};

const font = Rubik({ subsets: ["arabic"], display: "swap" });

export default function RootLayout({ children }) {
  return (
    <>
      <html lang="fa" className={font.className} dir="rtl">
        <head>
          <meta name="theme-color" content="#ec69e7" />
        </head>
        <body className="w-full flex justify-center">
          <AuthProvider>
            <div className="max-w-7xl w-full min-h-screen overflow-x-hidden flex flex-col justify-between">
              <div>
                <Header />
                <main className="px-6 lg:px-0">
                  <ErrorProvider>{children}</ErrorProvider>
                </main>
              </div>
              <Footer />
            </div>
          </AuthProvider>
        </body>
      </html>
    </>
  );
}
