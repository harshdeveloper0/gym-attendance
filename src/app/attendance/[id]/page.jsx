"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function MemberAttendancePage() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toISOString().split("T")[0]
  );
  const [status, setStatus] = useState("");

  // Fetch member + attendance
  useEffect(() => {
    const fetchData = async () => {
      try {
        const memberRes = await axios.get(`/api/member/${id}`);
        setMember(memberRes.data.data);

        const attRes = await axios.get(`/api/attendance?memberId=${id}`);
        setAttendanceRecords(attRes.data.data.attendance);

        // Check today's attendance
        const todayAtt = attRes.data.data.attendance.find(
          (a) => a.date === selectedDate
        );
        if (todayAtt) setStatus(todayAtt.status);
      } catch (err) {
        console.error("Error:", err);
      }
    };
    if (id) fetchData();
  }, [id, selectedDate]);

  const markAttendance = async (newStatus) => {
    try {
      setStatus(newStatus);

      await axios.post(`/api/attendance`, {
        memberId: id,
        date: selectedDate,
        status: newStatus,
      });

      // Refresh records
      const attRes = await axios.get(`/api/attendance?memberId=${id}`);
      setAttendanceRecords(attRes.data.data.attendance);
    } catch (err) {
      console.error("Error marking attendance:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-6 text-white">
      {member ? (
        <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-xl">
          {/* Member Info */}
          <h1 className="text-2xl font-bold mb-2">{member.name}</h1>
          <p className="text-sm text-gray-300">📞 {member.phone}</p>
          <p className="text-sm text-gray-300">💳 {member.membershipType}</p>

          {/* Mark Attendance */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Mark Attendance</h2>
            <div className="flex gap-2">
              <button
                onClick={() => markAttendance("Present")}
                className={`px-3 py-1 rounded-lg ${
                  status === "Present" ? "bg-green-500" : "bg-white/20"
                }`}
              >
                Present
              </button>
              <button
                onClick={() => markAttendance("Absent")}
                className={`px-3 py-1 rounded-lg ${
                  status === "Absent" ? "bg-red-500" : "bg-white/20"
                }`}
              >
                Absent
              </button>
              <button
                onClick={() => markAttendance("Leave")}
                className={`px-3 py-1 rounded-lg ${
                  status === "Leave" ? "bg-yellow-500" : "bg-white/20"
                }`}
              >
                Leave
              </button>
            </div>
            <p className="mt-2 text-sm text-yellow-400">
              Today ({selectedDate}): {status || "Not Marked"}
            </p>
          </div>

          {/* Attendance History */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-3">Attendance History</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-white/10 border-b border-white/20">
                  <tr>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map((rec) => (
                    <tr
                      key={rec._id}
                      className="border-t border-white/10 hover:bg-white/5"
                    >
                      <td className="px-4 py-2">{rec.date}</td>
                      <td
                        className={`px-4 py-2 ${
                          rec.status === "Present"
                            ? "text-green-400"
                            : rec.status === "Absent"
                            ? "text-red-400"
                            : "text-yellow-400"
                        }`}
                      >
                        {rec.status}
                      </td>
                    </tr>
                  ))}
                  {attendanceRecords.length === 0 && (
                    <tr>
                      <td
                        colSpan="2"
                        className="px-4 py-2 text-center text-gray-400"
                      >
                        No attendance records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
