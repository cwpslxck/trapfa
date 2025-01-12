import React from "react";

function Error({ error, success }) {
  return (
    <div className="fixed flex justify-center md:w-[450px] md:top-10 top-0 right-0 p-6 text-white w-full z-[999999]">
      {error && (
        <div className="bg-red-500 w-full h-full py-4 text-center rounded-xl">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-500 w-full h-full py-4 text-center rounded-xl">
          {success}
        </div>
      )}
    </div>
  );
}

export default Error;
