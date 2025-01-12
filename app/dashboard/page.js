import Link from "next/link";

const DashboardPage = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Link
        href={"/dashboard/songs"}
        className="w-full flex py-16 justify-center items-center bg-stone-900 hover:bg-stone-900/80 rounded-xl"
      >
        آهنگ
      </Link>
      <Link
        href={"/dashboard/artists"}
        className="w-full py-16 flex justify-center items-center bg-stone-900 hover:bg-stone-900/80 rounded-xl"
      >
        آرتیست
      </Link>
    </div>
  );
};

export default DashboardPage;
