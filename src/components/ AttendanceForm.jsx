"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function AttendanceForm() {
  const [form, setForm] = useState({
    memberId: "",
    date: "",
    status: "Present",
    checkInTime: "",
    checkOutTime: "",
    notes: "",
    markedBy: "admin",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      toast.success("✅ Attendance marked!");
      setForm({
        memberId: "",
        date: "",
        status: "Present",
        checkInTime: "",
        checkOutTime: "",
        notes: "",
        markedBy: "admin",
      });
    } else {
      toast.error("❌ " + data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
      <div className="grid grid-cols-2 gap-4">
        <input name="memberId" placeholder="Member ID" className="input" value={form.memberId} onChange={handleChange} required />
        <input type="date" name="date" className="input" value={form.date} onChange={handleChange} required />
        <select name="status" className="input" value={form.status} onChange={handleChange}>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>
        <input type="time" name="checkInTime" className="input" value={form.checkInTime} onChange={handleChange} />
        <input type="time" name="checkOutTime" className="input" value={form.checkOutTime} onChange={handleChange} />
      </div>
      <textarea name="notes" placeholder="Notes (optional)" className="input w-full" value={form.notes} onChange={handleChange}></textarea>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        ✅ Mark Attendance
      </button>
    </form>
  );
}
