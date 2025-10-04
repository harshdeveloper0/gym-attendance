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
  LogIn,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

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
      <nav className="w-full mb-[-135px] z-[100] relative bg-white/10 backdrop-blur-lg border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center text-white">
          {/* Logo */}
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative flex items-center gap-2 text-sm font-medium hover:text-pink-300 transition group"
              >
                {link.icon}
                {link.label}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-pink-400 to-purple-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}

            {session ? (
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 text-sm font-medium bg-white/10 px-3 py-2 rounded-md border border-white/20 hover:bg-white/20 transition"
              >
                <LogOut size={16} /> Logout
              </button>
            ) : (
              <button
                onClick={() => signIn("github")}
                className="flex items-center gap-2 text-sm font-medium bg-gradient-to-r from-gray-500 to-gray-600 px-3 py-2 rounded-md hover:opacity-80 transition"
              >
                <LogIn size={16} /> Login
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* ✅ Mobile Menu with Gray Background */}
        {isOpen && (
          <div className="absolute top-full left-0 w-full px-6 pb-4 text-white bg-gray-900/90 backdrop-blur-xl border-t border-white/10 animate-slideDown z-[200]">
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

            {session ? (
              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-2 justify-center py-3 mt-3 rounded-md bg-white/10 border border-white/20 hover:bg-white/20 transition"
              >
                <LogOut size={16} /> Logout
              </button>
            ) : (
              <button
                onClick={() => signIn("github")}
                className="w-full flex items-center gap-2 justify-center py-3 mt-3 rounded-md bg-gradient-to-r from-gray-500 to-gray-700 hover:opacity-80 transition"
              >
                <LogIn size={16} /> Login
              </button>
            )}
          </div>
        )}
      </nav>

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
