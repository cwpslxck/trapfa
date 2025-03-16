"use client";
import { createContext, useContext, useState, useEffect } from "react";
import {
  MdErrorOutline,
  MdCheckCircleOutline,
  MdWifiOff,
} from "react-icons/md";

const ErrorContext = createContext();

export function ErrorProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // چک کردن وضعیت اتصال در لود اولیه
    setIsOffline(!navigator.onLine);

    // لیسنرها برای تغییر وضعیت اتصال
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  const showError = (message) => {
    setMessages((prev) => [...prev, { type: "error", text: message }]);
    setTimeout(() => {
      setMessages((prev) => prev.slice(1));
    }, 3000);
  };

  const showSuccess = (message) => {
    setMessages((prev) => [...prev, { type: "success", text: message }]);
    setTimeout(() => {
      setMessages((prev) => prev.slice(1));
    }, 3000);
  };

  return (
    <ErrorContext.Provider value={{ showError, showSuccess }}>
      {children}
      <Toast messages={messages} isOffline={isOffline} />
    </ErrorContext.Provider>
  );
}

export function useError() {
  return useContext(ErrorContext);
}

function Toast({ messages, isOffline }) {
  return (
    <div className="fixed right-0 top-0 flex flex-col gap-2 z-[100] max-w-full w-auto lg:max-w-sm p-5">
      {/* نمایش وضعیت آفلاین */}
      {isOffline && (
        <div className="w-auto border-white/50 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-lg shadow-lg inline-flex gap-1.5 items-center border">
          <MdWifiOff size={16} />
          اتصالت به اینترنت قطع شده!
        </div>
      )}

      {/* نمایش سایر پیام‌ها */}
      {messages.slice(-4).map((message, index) => (
        <div
          key={index}
          className={`w-auto border backdrop-blur-md text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-1000 opacity-100 inline-flex gap-1.5 items-center
            ${
              message.type === "error"
                ? "border-red-600/80 bg-red-600/20"
                : "border-green-600/80 bg-green-600/20"
            }`}
        >
          <div>
            {message.type === "error" ? (
              <MdErrorOutline size={16} />
            ) : (
              <MdCheckCircleOutline size={16} />
            )}
          </div>
          {message.text}
        </div>
      ))}
    </div>
  );
}
