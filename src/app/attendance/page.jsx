"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import Loader from "@/components/Loader";
import { Search, Calendar, CheckCircle2, Users } from "lucide-react";
import AdminGuard from "@/components/AdminGuard";

export default function AttendancePage() {
  const [members, setMembers] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sessionFilter, setSessionFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // Fetch members & existing attendance
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const memberRes = await axios.get(`/api/member`);
        const allMembers = memberRes.data.data.members;

        const attRes = await axios.get(`/api/attendance?date=${selectedDate}`);
        const records =
          attRes.data.data?.attendance || attRes.data.attendance || [];

        const defaultMap = {};
        allMembers.forEach((m) => {
          defaultMap[m._id] = "Absent";
        });

        records.forEach((r) => {
          defaultMap[r.memberId] = r.status;
        });

        setMembers(allMembers);
        setAttendanceMap(defaultMap);
      } catch (err) {
        console.error("Error fetching attendance:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedDate]);

  //  Mark Attendance
  const markAttendance = async (memberId, status) => {
    try {
      setAttendanceMap((prev) => ({ ...prev, [memberId]: status }));
      await axios.post(`/api/attendance`, {
        memberId,
        date: selectedDate,
        status,
      });
    } catch (err) {
      console.error("Error marking attendance:", err);
    }
  };

  //  Filters
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSession =
      sessionFilter === "All" || m.session === sessionFilter;
    return matchesSearch && matchesSession;
  });

  //  Counts
  const totalPresent = Object.values(attendanceMap).filter(
    (s) => s === "Present"
  ).length;
  const totalAbsent = Object.values(attendanceMap).filter(
    (s) => s === "Absent"
  ).length;
  const totalMembers = members.length;

  //  Handle Remaining Absent (Fixed)
  const handleAutoAbsent = async () => {
    try {
      const res = await fetch("/api/attendance/auto-absent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selectedDate }), // ✅ FIX — Send selected date
      });

      const data = await res.json();
      alert(data.message);

      // ✅ Optional: refresh attendance state after marking absents
      const attRes = await axios.get(`/api/attendance?date=${selectedDate}`);
      const records =
        attRes.data.data?.attendance || attRes.data.attendance || [];
      const updatedMap = { ...attendanceMap };
      records.forEach((r) => {
        updatedMap[r.memberId] = r.status;
      });
      setAttendanceMap(updatedMap);
    } catch (err) {
      console.error("Manual auto-absent error:", err);
      alert("Failed to mark absents manually");
    }
  };

  return (
    <AdminGuard>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[9999]">
          <Loader size={60} color="#36d7b7" />
        </div>
      )}

      <div className="flex h-[88vh] mt-[130px] overflow-auto justify-center items-start p-6">
        <div className="w-full max-w-7xl bg-[#1c1c1c] border border-white/10 rounded-2xl p-6 shadow-2xl">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
            <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
              <Users size={24} className="text-blue-500" /> Attendance Dashboard
            </h1>

            <div className="flex flex-wrap gap-3 items-center">
              {/* Search */}
              <div className="relative w-44 sm:w-56">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white pl-9 pr-3 py-2 rounded-lg placeholder-gray-400 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Date Picker */}
              <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white">
                <Calendar size={16} className="text-gray-300" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent focus:outline-none cursor-pointer text-sm"
                />
              </div>

              {/* Session Filter */}
              <select
                value={sessionFilter}
                onChange={(e) => setSessionFilter(e.target.value)}
                className="bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="All">All Sessions</option>
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
              </select>

              {/*  FIXED: Mark Remaining Absent Button */}
              <button
                onClick={handleAutoAbsent}
                className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-blue-500/20 transition"
              >
                Mark Remaining Absent
              </button>

              {/* Members Button */}
              <Link
                href="/members"
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm shadow transition"
              >
                Manage Members
              </Link>
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-600/10 border border-green-500/20 p-4 rounded-xl text-center hover:scale-105 transition-transform duration-200">
              <p className="text-green-400 font-bold text-xl">{totalPresent}</p>
              <p className="text-xs text-gray-300">Present</p>
            </div>
            <div className="bg-red-600/10 border border-red-500/20 p-4 rounded-xl text-center hover:scale-105 transition-transform duration-200">
              <p className="text-red-400 font-bold text-xl">{totalAbsent}</p>
              <p className="text-xs text-gray-300">Absent</p>
            </div>
            <div className="bg-blue-600/10 border border-blue-500/20 p-4 rounded-xl text-center hover:scale-105 transition-transform duration-200">
              <p className="text-blue-400 font-bold text-xl">{totalMembers}</p>
              <p className="text-xs text-gray-300">Total Members</p>
            </div>
          </div>

          {/* Member Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredMembers.map((member) => (
              <div
                key={member._id}
                className="bg-gray-900/70 border border-gray-800 rounded-xl p-4 shadow-lg hover:shadow-blue-500/10 transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Image
                    src={member.image || "/default-member.avif"}
                    alt={member.name}
                    width={50}
                    height={50}
                    className="rounded-full border border-gray-700 object-cover"
                  />
                  <div>
                    <h2 className="text-white font-medium text-sm">
                      {member.name}
                    </h2>
                    <p className="text-gray-400 text-xs">{member.phone}</p>
                    <p className="text-gray-500 text-xs italic">
                      {member.session || "No Session"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => markAttendance(member._id, "Present")}
                    className={`flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                      attendanceMap[member._id] === "Present"
                        ? "bg-green-600 text-white"
                        : "bg-white/10 text-green-400 hover:bg-green-500/20"
                    }`}
                  >
                    <CheckCircle2 size={14} /> Present
                  </button>
                </div>

                <p className="mt-2 text-xs text-gray-300">
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      attendanceMap[member._id] === "Present"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {attendanceMap[member._id]}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
