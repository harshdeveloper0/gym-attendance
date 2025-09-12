"use client";
import { useRouter } from "next/navigation";
import { Users, ClipboardList } from "lucide-react";

export default function Home() {
  const router = useRouter();

  const buttons = [
    { label: "Members", icon: <Users className="w-5 h-5" />, path: "/members" },
    { label: "Attendance", icon: <ClipboardList className="w-5 h-5" />, path: "/attendance" },
  ];

  return (
    <div className="min-h-[80vh] p-5 flex items-center justify-center ">
      <div className="p-10 rounded-3xl bg-white/10 shadow-2xl border border-white/20 backdrop-blur-xl">
        <h1 className="text-3xl font-bold text-white text-center mb-8 drop-shadow-lg">
          Attendance Management System
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {buttons.map((btn, index) => (
            <button
              key={index}
              onClick={() => router.push(btn.path)}
              className="flex items-center justify-center gap-3 px-6 py-4 text-lg font-semibold text-white bg-white/10 hover:bg-white/20 rounded-2xl border border-white/20 shadow-lg transition-all duration-300"
            >
              {btn.icon} {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
