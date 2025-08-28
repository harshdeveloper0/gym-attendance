"use client";

import { useEffect, useState } from "react";

export default function AttendanceTable() {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchAttendance = async (pageNum = 1) => {
    setLoading(true);
    const res = await fetch(`/api/attendance?page=${pageNum}&limit=5`);
    const data = await res.json();
    if (data.success) {
      setRecords(data.data.attendance);
      setPagination(data.data.pagination);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAttendance(page);
  }, [page]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">📅 Recent Attendance</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Member</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Check-In</th>
                <th className="border p-2">Check-Out</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec) => (
                <tr key={rec._id}>
                  <td className="border p-2">{rec.member?.name} ({rec.member?.phone})</td>
                  <td className="border p-2">{rec.date}</td>
                  <td className="border p-2">{rec.status}</td>
                  <td className="border p-2">{rec.checkInTime || "-"}</td>
                  <td className="border p-2">{rec.checkOutTime || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between mt-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={!pagination.hasPrevPage}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              ⬅ Prev
            </button>
            <p className="text-sm">
              Page {pagination.currentPage} of {pagination.totalPages}
            </p>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={!pagination.hasNextPage}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next ➡
            </button>
          </div>
        </>
      )}
    </div>
  );
}
