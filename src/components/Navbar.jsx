"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Home,
  Users,
  UserPlus,
  ClipboardList,
  Receipt,
} from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/", icon: <Home size={18} /> },
    { label: "Members", href: "/members", icon: <Users size={18} /> },
    { label: "Add Member", href: "/add-member", icon: <UserPlus size={18} /> },
    {
      label: "Attendance Report",
      href: "/attendance-report",
      icon: <Receipt size={18} />,
    },
    {
      label: "Mark Attendance",
      href: "/attendance",
      icon: <ClipboardList size={18} />,
    },
  ];

  return (
    <>
      <nav className="w-full bg-white/10 backdrop-blur-lg border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="p-0.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 shadow-md">
              <Image
                src="/logo.jpeg"
                height={37}
                width={37}
                alt="logo"
                className="rounded-md"
              />
            </div>
            <Link
              href="/"
              className="text-xl text-white tracking-wide bg-clip-text font-bold"
            >
              Aarogya Fitness
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative flex items-center gap-2 text-sm font-medium hover:text-pink-300 transition"
              >
                {link.icon}
                {link.label}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-pink-400 to-purple-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden px-6 pb-4 text-white bg-white/10 backdrop-blur-xl border-t border-white/20 animate-slideDown">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 py-3 border-b border-white/10 text-sm hover:text-pink-300 transition"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <div className="h-16"></div>

      <style jsx>{`
        @keyframes slideDown {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
