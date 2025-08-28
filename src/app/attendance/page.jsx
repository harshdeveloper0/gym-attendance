"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { Search, Calendar, CheckCircle2, XCircle, Users } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function AttendancePage() {
  const [members, setMembers] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toISOString().split("T")[0]
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/member`);
        const allMembers = res.data.data.members;
        setMembers(allMembers);

        const attRes = await axios.get(`/api/attendance?date=${selectedDate}`);
        const records = attRes.data.data.attendance;

        const attData = {};
        records.forEach((r) => {
          attData[r.memberId] = r.status;
        });

        setAttendanceMap(attData);
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchData();
  }, [selectedDate]);

  const markAttendance = async (memberId, status) => {
    try {
      setAttendanceMap((prev) => ({
        ...prev,
        [memberId]: status,
      }));

      await axios.post(`/api/attendance`, {
        memberId,
        date: selectedDate,
        status,
      });
    } catch (err) {
      console.error("Error marking attendance:", err);
    }
  };

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    
    <div className="  p-6 text-white">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <Users size={28} className="text-blue-400" /> Attendance
        </h1>

        <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
          {/* 🔍 Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 text-white pl-10 pr-3 py-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* 📅 Date Picker */}
          <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2">
            <Calendar size={18} className="text-gray-300" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            />
          </div>

          {/* 🔗 Members Page Button */}
          <Link href="/members">
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md transition">
              Go to Members
            </button>
          </Link>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
        {filteredMembers.map((member) => (
          <div
            key={member._id}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-5 shadow-lg hover:shadow-blue-500/20 transition"
          >
            {/* 👤 Member Image */}
            <div className="flex items-center gap-4 mb-4">
              <Image
                src={member.image || "/default-member.avif"} 
                alt={member.name}
                width={60}
                height={60}
                className="rounded-full border border-white/20 object-cover"
              />
              <div>
                <h2 className="text-lg font-semibold">{member.name}</h2>
                <p className="text-sm text-gray-300">{member.phone}</p>
                <p className="text-sm text-gray-400">
                  {member.membershipType || "Standard"}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => markAttendance(member._id, "Present")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  attendanceMap[member._id] === "Present"
                    ? "bg-green-600 text-white"
                    : "bg-white/10 text-green-400 hover:bg-green-500/20"
                }`}
              >
                <CheckCircle2 size={16} /> Present
              </button>

              <button
                onClick={() => markAttendance(member._id, "Absent")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  attendanceMap[member._id] === "Absent"
                    ? "bg-red-600 text-white"
                    : "bg-white/10 text-red-400 hover:bg-red-500/20"
                }`}
              >
                <XCircle size={16} /> Absent
              </button>
            </div>

            {/* Status */}
            <p className="mt-3 text-sm">
              Status:{" "}
              <span
                className={`font-semibold ${
                  attendanceMap[member._id] === "Present"
                    ? "text-green-400"
                    : attendanceMap[member._id] === "Absent"
                    ? "text-red-400"
                    : "text-yellow-400"
                }`}
              >
                {attendanceMap[member._id] || "Not Marked"}
              </span>
            </p>
          </div>
        ))}

        {filteredMembers.length === 0 && (
          <p className="text-center text-gray-400 col-span-full">
            No members found
          </p>
        )}
      </div>
    </div>
    </>
  );
}
