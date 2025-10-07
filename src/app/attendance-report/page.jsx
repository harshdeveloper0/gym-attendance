"use client";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import AdminGuard from "@/components/AdminGuard";

export default function AttendanceDashboard() {
  const [attendance, setAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sessionFilter, setSessionFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/attendance");
        const data = await res.json();
        console.log("Raw attendance data:", data);

        if (data.success) {
          setAttendance(data.attendance);
        }
      } catch (err) {
        console.error("Failed to fetch attendance:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter logic (includes date, search, and session)
  const filtered = attendance.filter((a) => {
    const matchesDate = selectedDate ? a.date === selectedDate : true;
    const matchesSearch = searchTerm
      ? a.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.phoneNumber && a.phoneNumber.includes(searchTerm))
      : true;
    const matchesSession =
      sessionFilter === "All" ||
      (a.session && a.session.toLowerCase() === sessionFilter.toLowerCase());
    return matchesDate && matchesSearch && matchesSession;
  });

  const presentCount = filtered.filter((a) => a.status === "Present").length;
  const absentCount = filtered.filter((a) => a.status === "Absent").length;

  return (
    <AdminGuard>
      {loading && <Loader />}
      <div className="h-[90vh] mt-[120px] text-white p-4">
        <div className="mx-auto max-w-7xl space-y-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
            Attendance Report
          </h1>

          {/* Filters and Stats */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-grow">
              {/* Date Filter */}
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 rounded-lg bg-[#353535] border border-gray-700 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />

              {/* Search Filter */}
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 rounded-lg bg-[#353535] border border-gray-700 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />

              {/*  Session Filter */}
              <select
                value={sessionFilter}
                onChange={(e) => setSessionFilter(e.target.value)}
                className="px-4 py-2 rounded-lg bg-[#353535] border border-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="All">All Sessions</option>
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
              </select>
            </div>

            {/* Present/Absent Summary */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#353535] shadow-md text-center">
                <h2 className="text-sm font-semibold text-teal-200">Present</h2>
                <p className="text-sm font-bold text-green-400">
                  {presentCount}
                </p>
              </div>
              <div className="p-2 rounded-xl bg-[#353535] shadow-md text-center">
                <h2 className="text-sm font-semibold text-teal-200">Absent</h2>
                <p className="text-sm font-bold text-red-400">
                  {absentCount}
                </p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#353535] sm:h-[69vh] h-[50vh] rounded-xl shadow-md overflow-auto">
            {!loading && filtered.length === 0 ? (
              <p className="text-center py-10 text-gray-400">
                No attendance records found
              </p>
            ) : (
              !loading && (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead className="bg-gray-700 text-gray-300">
                      <tr>
                        <th className="p-4 font-medium">Photo</th>
                        <th className="p-4 font-medium">Member Name</th>
                        <th className="p-4 font-medium">Session</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium">Date</th>
                        <th className="p-4 font-medium">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {filtered.map((a) => (
                        <tr
                          key={a._id}
                          className="hover:bg-gray-700 transition-colors duration-200"
                        >
                          <td className="p-4">
                            <img
                              src={a.profilePhoto || "/logo.jpeg"}
                              alt={a.memberName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          </td>
                          <td className="p-4 font-medium text-gray-200">
                            {a.memberName}
                          </td>
                          <td className="p-4 text-gray-400">
                            {a.session || "N/A"}
                          </td>
                          <td
                            className={`p-4 font-semibold ${
                              a.status === "Present"
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {a.status}
                          </td>
                          <td className="p-4 text-gray-400">{a.date}</td>
                          <td className="p-4 text-gray-400">
                            {a.notes || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
