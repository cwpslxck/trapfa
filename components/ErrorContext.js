"use client";
import { createContext, useContext, useState } from "react";
import { MdErrorOutline } from "react-icons/md";

const ErrorContext = createContext();

export function ErrorProvider({ children }) {
  const [errors, setErrors] = useState([]);

  const showError = (message) => {
    setErrors((prevErrors) => [...prevErrors, message]);
    setTimeout(() => {
      setErrors((prevErrors) => prevErrors.slice(1));
    }, 3000);
  };

  return (
    <ErrorContext.Provider value={{ showError }}>
      {children}
      <ErrorToast errors={errors} />
    </ErrorContext.Provider>
  );
}

export function useError() {
  return useContext(ErrorContext);
}

function ErrorToast({ errors }) {
  return (
    <div className="fixed right-0 top-5 flex flex-col gap-2 z-50 w-full lg:max-w-sm px-5">
      {errors.slice(-4).map((error, index) => (
        <div
          key={index}
          className="border-red-600/80 border  bg-red-600/20 backdrop-blur-md text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-1000 opacity-100 inline-flex gap-1.5 items-center"
        >
          <div>
            <MdErrorOutline size={16} />
          </div>
          {error}
        </div>
      ))}
    </div>
  );
}
