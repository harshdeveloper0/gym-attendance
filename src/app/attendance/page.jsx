"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Calendar,
  CheckCircle2,
  XCircle,
  Users,
} from "lucide-react";

export default function AttendancePage() {
  const [members, setMembers] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toISOString().split("T")[0]
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sessionFilter, setSessionFilter] = useState("All");
  const [fadeHeader, setFadeHeader] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);

  //Fetch Members & Attendance
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/member`);
        setMembers(res.data.data.members);

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

  //  Fade header on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > lastScroll) setFadeHeader(true);
      else setFadeHeader(false); 
      setLastScroll(scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

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

  // Filter members
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSession =
      sessionFilter === "All" || m.session === sessionFilter;
    return matchesSearch && matchesSession;
  });

  //  Stats
  const totalPresent = filteredMembers.filter(
    (m) => attendanceMap[m._id] === "Present"
  ).length;
  const totalAbsent = filteredMembers.filter(
    (m) => attendanceMap[m._id] === "Absent"
  ).length;
  const totalMarked = totalPresent + totalAbsent;
  const totalNotMarked = filteredMembers.length - totalMarked;

  return (
<<<<<<< HEAD
    <div className="flex h-[87vh] mt-[-50px] overflow-auto justify-center items-start p-4 sm:p-6">
      <div className="w-full overflow-auto max-w-7xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-4 sm:p-6">
=======
    <div className="flex mt-[-50px] h-[87vh] justify-center items-start p-4 sm:p-6">
      <div className="w-full max-w-7xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-4 sm:p-6">
>>>>>>> 233513b48fa099f38e164472855e747586364659
        {/* header */}
        <div
          className={`sticky top-0 z-20 mb-4 transition-opacity duration-300 ${
            fadeHeader ? "opacity-0" : "opacity-100"
          } bg-gray-900/80 backdrop-blur-lg rounded-xl p-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`}
        >
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <Users size={22} className="text-blue-400" /> Attendance
          </h1>

          <div className="flex flex-wrap gap-2 items-center">
            {/* Search */}
            <div className="relative w-40 sm:w-48">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white pl-9 pr-3 py-1.5 rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/*  Date Picker */}
            <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm">
              <Calendar size={16} className="text-gray-300" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-white focus:outline-none cursor-pointer text-sm"
              />
            </div>

            {/*  Session Filter */}
            <select
              value={sessionFilter}
              onChange={(e) => setSessionFilter(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white px-3 py-1.5 rounded-lg text-sm cursor-pointer"
            >
              <option value="All">All Members</option>
              <option value="Morning">Morning</option>
              <option value="Evening">Evening</option>
            </select>

            {/*  Members Page */}
            <Link
              href="/members"
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg shadow text-sm"
            >
              Members
            </Link>
          </div>
        </div>

        {/*  Attendance Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-center">
          <div className="bg-green-600/20 border border-green-500/30 p-2 rounded-lg">
            <p className="text-green-400 font-bold">{totalPresent}</p>
            <p className="text-xs text-gray-300">Present</p>
          </div>
          <div className="bg-red-600/20 border border-red-500/30 p-2 rounded-lg">
            <p className="text-red-400 font-bold">{totalAbsent}</p>
            <p className="text-xs text-gray-300">Absent</p>
          </div>
          <div className="bg-yellow-600/20 border border-yellow-500/30 p-2 rounded-lg">
            <p className="text-yellow-400 font-bold">{totalNotMarked}</p>
            <p className="text-xs text-gray-300">Not Marked</p>
          </div>
          <div className="bg-blue-600/20 border border-blue-500/30 p-2 rounded-lg">
            <p className="text-blue-400 font-bold">{filteredMembers.length}</p>
            <p className="text-xs text-gray-300">Total ({sessionFilter})</p>
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.map((member) => (
            <div
              key={member._id}
              className="bg-gray-800/70 border border-gray-700 rounded-lg p-3 shadow hover:shadow-lg transition text-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <Image
                  src={member.image || "/default-member.avif"}
                  alt={member.name}
                  width={48}
                  height={48}
                  className="rounded-full border border-white/20 object-cover"
                />
                <div>
                  <h2 className="text-white font-medium text-sm">
                    {member.name}
                  </h2>
                  <p className="text-gray-400 text-xs">{member.phone}</p>
                  <p className="text-gray-500 text-xs">
                    {member.session || "No Session"}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => markAttendance(member._id, "Present")}
                  className={`flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition ${
                    attendanceMap[member._id] === "Present"
                      ? "bg-green-600 text-white"
                      : "bg-white/10 text-green-400 hover:bg-green-500/20"
                  }`}
                >
                  <CheckCircle2 size={14} /> Present
                </button>
                <button
                  onClick={() => markAttendance(member._id, "Absent")}
                  className={`flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition ${
                    attendanceMap[member._id] === "Absent"
                      ? "bg-red-600 text-white"
                      : "bg-white/10 text-red-400 hover:bg-red-500/20"
                  }`}
                >
                  <XCircle size={14} /> Absent
                </button>
              </div>

              <p className="mt-2 text-xs text-gray-300">
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
            <p className="text-center text-gray-400 col-span-full text-sm">
              No members found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
