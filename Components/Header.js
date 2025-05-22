"use client";
export default function Header() {
  return (
    <div className="flex mr-30 w-full  items-center justify-between bg-sky-400 px-6 py-3 relative ">
      <h1 className="absolute ml-10 mr-10 transform -translate-x-1/2 text-white text-xl font-semibold">
        Typing Test
      </h1>
      <div className="flex items-center gap-3 ml-auto">
        <img
          src={"/images/profile-logo.png"}
          alt="User"
          className="rounded-full w-10 h-10 object-cover border-2 border-white"
        />
        <h2 className="text-white font-medium">User </h2>
      </div>
    </div>
  );
}
