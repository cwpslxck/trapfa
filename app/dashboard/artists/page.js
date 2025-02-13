import AddArtist from "@/components/AddArtist";
import React from "react";

function page() {
  return (
    <div className="flex justify-center flex-col md:flex-row items-center gap-2">
      <div className="max-w-sm">
        <AddArtist />
      </div>
    </div>
  );
}

export default page;
