import Image from "next/image";

function NotFound() {
  return (
    <div className="fixed left-0 right-0 top-0 bottom-0 flex items-center -z-10">
      <div className="w-full flex flex-col gap-4 justify-center items-center">
        <Image src={""} alt="Not Found Image" />
        <p className="text-5xl text-center font-black">
          صفحه موردنظر در دسترس نیست!
        </p>
      </div>
    </div>
  );
}

export default NotFound;
