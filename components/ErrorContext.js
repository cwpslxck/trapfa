"use client";
import { createContext, useContext, useState } from "react";
import { MdErrorOutline, MdCheckCircleOutline } from "react-icons/md";

const ErrorContext = createContext();

export function ErrorProvider({ children }) {
  const [messages, setMessages] = useState([]);

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
      <Toast messages={messages} />
    </ErrorContext.Provider>
  );
}

export function useError() {
  return useContext(ErrorContext);
}

function Toast({ messages }) {
  return (
    <div className="fixed right-0 top-5 flex flex-col gap-2 z-50 w-full lg:max-w-sm px-5">
      {messages.slice(-4).map((message, index) => (
        <div
          key={index}
          className={`border backdrop-blur-md text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-1000 opacity-100 inline-flex gap-1.5 items-center
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
