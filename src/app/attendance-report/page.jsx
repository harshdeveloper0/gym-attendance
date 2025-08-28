"use client";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";

export default function AttendancePage() {
  const [attendance, setAttendance] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await fetch("/api/attendance");
        const data = await res.json();
        if (data.success) {
          setAttendance(data.attendance);
          setFilteredData(data.attendance);
        } else {
          setAttendance([]);
          setFilteredData([]);
        }
      } catch (error) {
        console.error("Error fetching attendance:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  useEffect(() => {
    if (!filterDate) {
      setFilteredData(attendance);
    } else {
      setFilteredData(attendance.filter((a) => a.date === filterDate));
    }
  }, [filterDate, attendance]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white text-lg bg-gray-900">
        Loading attendance...
      </div>
    );
  }

  const total = filteredData.length;
  const presentCount = filteredData.filter(
    (a) => a.status === "Present"
  ).length;
  const percent = total > 0 ? ((presentCount / total) * 100).toFixed(1) : 0;

  return (
    <>
    
      <div className="  flex flex-col items-center p-6 gap-6 text-white">
        
        <div className="w-full flex justify-center items-center gap-6 mb-8">
          <div className="flex flex-col items-start gap-4">
            <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-sky-500 to-indigo-500 drop-shadow-lg">
              Attendance Report
            </h1>
            <div className="w-full max-w-lg bg-white/10 backdrop-blur-md p-4 rounded-xl border border-gray-700/50 shadow-lg flex items-center gap-3">
              <label className="text-gray-300 font-medium whitespace-nowrap">Filter by Date:</label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-teal-400 border border-gray-600/50 transition-colors"
              />
              {filterDate && (
                <button
                  onClick={() => setFilterDate("")}
                  className="ml-2 px-4 py-2 rounded-lg bg-red-600/80 hover:bg-red-700 text-white text-sm font-semibold transition-colors shadow-md"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Summary Card */}
          {filterDate && (
            <div className="w-full max-w-md bg-white/10  backdrop-blur-xl p-6 rounded-2xl border border-gray-700/50 shadow-xl text-center flex-shrink-0">
              <p className="text-2xl font-semibold text-white mb-3">
                {filterDate} Attendance
              </p>
              <div className="flex justify-around items-center gap-6 text-xl">
                <div className="flex flex-col items-center">
                  <p className="text-green-400 font-bold text-3xl">{presentCount}</p>
                  <p className="text-gray-400 text-sm">Present</p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-red-400 font-bold text-3xl">{total - presentCount}</p>
                  <p className="text-gray-400 text-sm">Absent</p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sky-300 font-bold text-3xl">{percent}%</p>
                  <p className="text-gray-400 text-sm">Present</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Attendance Table */}
        <div className="w-full max-w-7xl bg-white\10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border ">
          <div className="max-h-[400px] overflow-auto rounded-xl">
            <table className="w-full text-left text-white min-w-[700px] border-collapse">
              <thead className="sticky top-0 bg-gray-900/70 backdrop-blur-md z-10">
                <tr className="border-b border-gray-700/50 text-gray-300 text-sm uppercase tracking-wider">
                  <th className="py-4 px-6">Member Name</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((a, i) => (
                    <tr
                      key={a._id}
                      className={`transition-colors duration-200 ${
                        i % 2 === 0 ? "" : "bg-transparent"
                      } hover:bg-gray-700/50`}
                    >
                      <td className="py-4 px-6 font-medium text-white">{a.memberName}</td>
                      <td className="py-4 px-6 text-gray-300">{a.date}</td>
                      <td
                        className={`py-4 px-6 font-semibold ${
                          a.status === "Present"
                            ? "text-emerald-400"
                            : "text-rose-400"
                        }`}
                      >
                        {a.status}
                      </td>
                      <td className="py-4 px-6 text-gray-400">
                        {a.notes || "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-gray-500 text-lg">
                      No attendance found {filterDate && `for ${filterDate}`}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}