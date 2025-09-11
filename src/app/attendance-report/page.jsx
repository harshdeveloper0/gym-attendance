"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Calendar, Users } from "lucide-react";
import Image from "next/image";

export default function AttendanceReport() {
  const [members, setMembers] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sessionFilter, setSessionFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/member`);
        const allMembers = res.data.data.members;
        setMembers(allMembers);

        if (selectedDate) {
          const attRes = await axios.get(`/api/attendance?date=${selectedDate}`);
          const records = attRes.data.data.attendance;

          const attData = {};
          records.forEach((r) => {
            attData[r.memberId] = r.status;
          });
          setAttendanceMap(attData);
        } else {
          setAttendanceMap({});
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedDate]);

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSession =
      sessionFilter === "All" || member.session === sessionFilter;

    return matchesSearch && matchesSession;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white text-lg bg-gray-900">
        Loading attendance report...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 gap-6 text-white">
      {/* Header */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-2 text-sky-400">
          <Users className="text-blue-400" /> Attendance Report
        </h1>

        <div className="flex flex-wrap gap-2 items-center">
          {/* 🔍 Search */}
          <div className="relative w-48">
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

          {/* 📅 Date Picker */}
          <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm">
            <Calendar size={16} className="text-gray-300" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer text-sm"
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate("")}
                className="ml-2 px-3 py-1 rounded-lg bg-red-600/80 hover:bg-red-700 text-white text-xs font-semibold transition-colors shadow-md"
              >
                Clear
              </button>
            )}
          </div>

          {/* 🔽 Session Filter */}
          <select
            value={sessionFilter}
            onChange={(e) => setSessionFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white px-3 py-1.5 rounded-lg text-sm cursor-pointer"
          >
            <option value="All">All Members</option>
            <option value="Morning">Morning</option>
            <option value="Evening">Evening</option>
          </select>
        </div>
      </div>

      {/* 📋 Attendance Table */}
      <div className="w-full max-w-7xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-gray-700/40">
        <div className="max-h-[400px] overflow-auto rounded-xl">
          <table className="w-full text-left min-w-[700px] border-collapse">
            <thead className="sticky top-0 bg-gray-900/70 backdrop-blur-md z-10">
              <tr className="border-b border-gray-700/50 text-gray-300 text-sm uppercase tracking-wider">
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Session</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length > 0 ? (
                filteredMembers.map((m, i) => (
             
                  
                  <tr
                    key={m._id}
                    className={`transition-colors duration-200 ${
                      i % 2 === 0 ? "" : "bg-gray-800/30"
                    } hover:bg-gray-700/50`}
                  >
                    <td className="py-3 px-4">
                      <Image
                        src={m.image || "/default-member.avif"}
                        alt={m.name}
                        width={40}
                        height={40}
                        className="rounded-full border border-white/20 object-cover"
                      />
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">
                      {m.name}
                    </td>
                    <td className="py-3 px-4 text-gray-400">{m.phone}</td>
                    <td className="py-3 px-4 text-indigo-400">{m.session}</td>
                    <td
                      className={`py-3 px-4 font-semibold ${
                        attendanceMap[m._status] === "Present"
                          ? "text-green-400"
                          : attendanceMap[m._status] === "Absent"
                          ? "text-red-400"
                          : "text-yellow-400"
                          
                      }`}
                    >
                      {attendanceMap[m._status] || "Not Marked"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="py-6 text-center text-gray-500 text-lg"
                  >
                    No members found {selectedDate && `for ${selectedDate}`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
