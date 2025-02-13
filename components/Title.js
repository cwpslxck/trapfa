import React from "react";

function Title({ title, desc }) {
  return (
    <div className="flex justify-center w-full">
      <div className="py-6 w-full max-w-2xl text-center">
        <p className="font-semibold text-2xl lg:text-3xl">{title}</p>
        <p className="font-extralight">{desc}</p>
      </div>
    </div>
  );
}

export default Title;
