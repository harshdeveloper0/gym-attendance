"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, PlusCircle, ClipboardList } from "lucide-react";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const getMembers = async () => {
    const res = await fetch("/api/member");
    const data = await res.json();
    const allMembers = data.data.members || [];

    const sorted = allMembers.sort((a, b) =>
      b.isActive === a.isActive ? 0 : b.isActive ? 1 : -1
    );
    setMembers(sorted);
  };

  useEffect(() => {
    getMembers();
  }, []);

  const deleteMember = async (id) => {
    if (confirm("Are you sure you want to delete this member?")) {
      try {
        await fetch(`/api/member/${id}`, {
          method: "DELETE",
        });
        getMembers();
      } catch (error) {
        console.error("Failed to delete:", error);
      }
    }
  };

  const filteredMembers = members.filter((m) =>
    `${m.name} ${m.phone} ${m.note || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex justify-center items-start p-6">
      <div className="relative h-[80vh] overflow-auto bg-white/10 backdrop-blur-lg border-b border-white/20 shadow-2xl rounded-2xl px-6 py-1">

        {/* Sticky Header */}
        <div className="sticky top-0 z-20 mt-0 mb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-900/70 backdrop-blur-md p-3 rounded-lg">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            👥 Members Dashboard
          </h1>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="🔍 Search by name, phone or note"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-900/70 border border-gray-700 text-white placeholder-white/50 rounded-lg px-4 py-2 w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

            {/* Add Member */}
            <Link
              href="/add-member"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-lg shadow hover:from-blue-500 hover:to-blue-400 transition"
            >
              <PlusCircle size={18} />
              <span className="hidden sm:inline">Add Member</span>
            </Link>

            {/* Mark Attendance */}
            <Link
              href="/attendance"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-2 rounded-lg shadow hover:from-green-500 hover:to-green-400 transition"
            >
              <ClipboardList size={18} />
              <span className="hidden sm:inline">Mark Attendance</span>
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="min-w-full text-sm sm:text-base">
            <thead className="sticky top-0 bg-white/10 text-gray-200 z-10">
              <tr>
                <th className="px-5 py-3 text-left">Image</th>
                <th className="px-5 py-3 text-left">Name</th>
                <th className="px-5 py-3 text-left">Phone</th>
                <th className="px-5 py-3 text-left">Email</th>
                <th className="px-5 py-3 text-left">Fee Status</th>
                <th className="px-5 py-3 text-left">Active</th>
                <th className="px-5 py-3 text-left">Note</th>
                <th className="px-5 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((m, idx) => (
                <tr
                  key={m._id}
                  className={`${
                    idx % 2 === 0 ? "bg-white/5" : "bg-white/0"
                  } border-t border-white/10 hover:bg-white/10 transition`}
                >
                  {/* Member Image */}
                  <td className="px-5 py-3">
                    <Image
                      src={m.image || "/default-member.avif"}
                      alt={m.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover border border-white/20"
                    />
                  </td>

                  <td className="px-5 py-3 font-medium text-white">{m.name}</td>
                  <td className="px-5 py-3 text-gray-300">{m.phone}</td>
                  <td className="px-5 py-3 text-gray-300">{m.email}</td>
                  <td className="px-5 py-3">
                    {m.feeStatus === "Paid" ? (
                      <span className="text-green-400 font-medium">Paid</span>
                    ) : (
                      <span className="text-red-400 font-medium">Unpaid</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    {m.isActive ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-green-300 bg-green-600/20 rounded-full">
                        ✔ Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-red-300 bg-red-600/20 rounded-full">
                        ✖ Inactive
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-3 text-gray-300">{m.note || "-"}</td>

                  <td className="px-5 py-3 flex gap-4 items-center">
                    <Link
                      href={`/edit-member/${m._id}`}
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-1 transition"
                    >
                      <Pencil size={16} />
                      <span className="hidden sm:inline">Edit</span>
                    </Link>
                    <button
                      onClick={() => deleteMember(m._id)}
                      className="text-red-400 hover:text-red-300 flex items-center gap-1 transition"
                    >
                      <Trash2 size={16} />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredMembers.length === 0 && (
                <tr>
                  <td
                    className="px-5 py-4 text-center text-white/60"
                    colSpan="8"
                  >
                    No members found.
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
