"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  ClipboardList,
  Dumbbell,
  ClipboardCheck,
  Boxes,
} from "lucide-react";

const Herosection = () => {
  return (
    <section className="bg-gradient-to-r from-black via-gray-900 to-black text-white min-h-[95vh] mt-[110px] flex flex-col md:flex-row items-center justify-between px-10 md:px-20">
      {/* Left Section */}
      <div className="flex flex-col gap-6 max-w-xl">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
          Welcome to <span className="text-yellow-400">Aarogya Fitness</span>
        </h1>

        <p className="text-gray-300 text-lg leading-relaxed">
          The all-in-one gym management platform. Track attendance, manage
          members, handle inventory, and grow your fitness business — all in one
          place.
        </p>

        <div className="flex flex-wrap gap-4 mt-4">
          {/* Add Member */}
          <Link
            href="/add-member"
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-5 py-3 rounded-xl transition-all duration-300 shadow-md"
          >
            <UserPlus size={20} /> Add Member
          </Link>

          {/* View Members */}
          <Link
            href="/members"
            className="flex items-center gap-2 border border-yellow-400 hover:bg-yellow-400 hover:text-black font-semibold px-5 py-3 rounded-xl transition-all duration-300"
          >
            <Users size={20} /> View Members
          </Link>

          {/* Attendance Report */}
          <Link
            href="/attendance-report"
            className="flex items-center gap-2 border border-yellow-400 hover:bg-yellow-400 hover:text-black font-semibold px-5 py-3 rounded-xl transition-all duration-300"
          >
            <ClipboardList size={20} /> Attendance Report
          </Link>

          {/* Mark Attendance */}
          <Link
            href="/mark-attendance"
            className="flex items-center gap-2 border border-yellow-400 hover:bg-yellow-400 hover:text-black font-semibold px-5 py-3 rounded-xl transition-all duration-300"
          >
            <ClipboardCheck size={20} /> Mark Attendance
          </Link>

          {/* Inventory Management */}
          <Link
            href="/inventory"
            className="flex items-center gap-2 border border-yellow-400 hover:bg-yellow-400 hover:text-black font-semibold px-5 py-3 rounded-xl transition-all duration-300"
          >
            <Boxes size={20} /> Inventory Management
          </Link>
        </div>
      </div>

      {/* Right Section */}
      <div className="mt-10 md:mt-0 flex justify-center">
        <Dumbbell
          size={220}
          className="text-yellow-400 opacity-90 drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]"
        />
      </div>
    </section>
  );
};

export default Herosection;
