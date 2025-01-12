import Link from "next/link";
import React from "react";
import { VscLoading } from "react-icons/vsc";

function LoadingPage() {
  return (
    <div className="bg-black h-screen w-full inset-0 absolute flex flex-col gap-2 justify-center items-center z-50">
      <div className="animate-spin">
        <VscLoading className="size-16" />
      </div>
      <div className="text-center fixed bottom-0 mb-10 loadinghide">
        <p>لودینگ بیش از حد طول کشید؟</p>
        <Link href={"/"}>
          <span>بازگشت به خانه</span>
        </Link>
      </div>
    </div>
  );
}

export default LoadingPage;
