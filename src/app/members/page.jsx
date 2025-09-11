"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, PlusCircle, ClipboardList } from "lucide-react";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sessionFilter, setSessionFilter] = useState("All");
  const [counts, setCounts] = useState({ morning: 0, evening: 0, total: 0 });

  const getMembers = async () => {
    let url = "/api/member";
    if (sessionFilter !== "All") url += `?session=${sessionFilter}`;
    const res = await fetch(url);
    const data = await res.json();
    const allMembers = data.data.members || [];

    // always fetch all for counts
    try {
      const resAll = await fetch("/api/member");
      const dataAll = await resAll.json();
      const allData = dataAll.data.members || [];

      setCounts({
        morning: allData.filter((m) => m.session === "Morning").length,
        evening: allData.filter((m) => m.session === "Evening").length,
        total: allData.length,
      });
    } catch (err) {
      console.error("Count fetch failed", err);
    }

    // sort active first
    setMembers(
      allMembers.sort((a, b) =>
        b.isActive === a.isActive ? 0 : b.isActive ? 1 : -1
      )
    );
  };

  useEffect(() => {
    getMembers();
  }, [sessionFilter]);

  const deleteMember = async (id) => {
    if (confirm("Are you sure you want to delete this member?")) {
      await fetch(`/api/member/${id}`, { method: "DELETE" });
      getMembers();
    }
  };

  const filteredMembers = members.filter((m) =>
    `${m.name} ${m.phone} ${m.note || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex justify-center items-start p-6">
      <div className="w-full max-w-7xl h-[80vh] overflow-auto bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-4">
        
        {/* Header Section */}
        <div className="sticky top-0 z-20 mb-4 bg-gray-900/80 backdrop-blur-lg rounded-xl p-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-lg font-bold text-white">👥 Members Dashboard</h1>

          <div className="flex flex-wrap gap-2 items-center">
            {/* Search */}
            <input
              type="text"
              placeholder="🔍 Search by name or phone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white placeholder-white/50 rounded-lg px-3 py-1.5 w-52 focus:ring-2 focus:ring-blue-500 text-sm"
            />

            {/* Session Filter */}
            <select
              value={sessionFilter}
              onChange={(e) => setSessionFilter(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="All">All Sessions</option>
              <option value="Morning">Morning</option>
              <option value="Evening">Evening</option>
            </select>

            {/* Add Member */}
            <Link
              href="/add-member"
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg shadow text-sm"
            >
              <PlusCircle size={16} />
              Add
            </Link>

            {/* Attendance */}
            <Link
              href="/attendance"
              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg shadow text-sm"
            >
              <ClipboardList size={16} />
              Attendance
            </Link>
          </div>
        </div>

        {/* Counts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="bg-blue-600/20 text-white p-3 rounded-lg text-center text-sm">
            🌅 Morning <br />
            <span className="text-xl font-bold">{counts.morning}</span>
          </div>
          <div className="bg-purple-600/20 text-white p-3 rounded-lg text-center text-sm">
            🌆 Evening <br />
            <span className="text-xl font-bold">{counts.evening}</span>
          </div>
          <div className="bg-teal-600/20 text-white p-3 rounded-lg text-center text-sm">
            👥 Total <br />
            <span className="text-xl font-bold">{counts.total}</span>
          </div>
        </div>

        {/* Members List - Card view */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.map((m) => (
            <div
              key={m._id}
              className="bg-gray-800/70 border border-gray-700 rounded-lg p-3 flex flex-col gap-2 shadow hover:shadow-md transition text-sm"
            >
              <div className="flex items-center gap-2">
                <Image
                  src={m.image || "/default-member.avif"}
                  alt={m.name}
                  width={40}
                  height={40}
                  className="rounded-full border border-white/20 object-cover"
                />
                <div>
                  <h2 className="text-white font-medium text-sm">{m.name}</h2>
                  <p className="text-gray-400 text-xs">{m.phone}</p>
                </div>
              </div>

              <div className="text-xs text-gray-300 space-y-0.5">
                <p>Email: {m.email || "-"}</p>
                <p>
                  Fee:{" "}
                  {m.feeStatus === "Paid" ? (
                    <span className="text-green-400">Paid</span>
                  ) : (
                    <span className="text-red-400">Unpaid</span>
                  )}
                </p>
                <p>
                  Session: <span className="text-blue-300">{m.session}</span>
                </p>
                <p>
                  Status:{" "}
                  {m.isActive ? (
                    <span className="text-green-400">✔ Active</span>
                  ) : (
                    <span className="text-red-400">✖ Inactive</span>
                  )}
                </p>
                <p>Note: {m.note || "-"}</p>
              </div>

              <div className="flex justify-end gap-2 mt-1 text-xs">
                <Link
                  href={`/edit-member/${m._id}`}
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <Pencil size={14} /> Edit
                </Link>
                <button
                  onClick={() => deleteMember(m._id)}
                  className="text-red-400 hover:text-red-300 flex items-center gap-1"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Members */}
        {filteredMembers.length === 0 && (
          <p className="text-center text-white/60 mt-6 text-sm">
            No members found.
          </p>
        )}
      </div>
    </div>
  );
}
