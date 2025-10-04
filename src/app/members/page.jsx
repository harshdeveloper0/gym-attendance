'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, PlusCircle, ClipboardList, X } from "lucide-react";
import Loader from "@/components/Loader";
import ProtectedRoute from "@/components/ProtectedRoutes";
import AdminGuard from "@/components/AdminGuard";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sessionFilter, setSessionFilter] = useState("All");
  const [counts, setCounts] = useState({ morning: 0, evening: 0, total: 0 });
  const [showHeader, setShowHeader] = useState(true);
  const [popupMember, setPopupMember] = useState(null);
  const [loading, setLoading] = useState(false);

  const getMembers = async () => {
    try {
      setLoading(true);
      let url = "/api/member?limit=0";
      if (sessionFilter !== "All") url += `&session=${sessionFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      const allMembers = data.data.members || [];
      setCounts({
        morning: allMembers.filter((m) => m.session === "Morning").length,
        evening: allMembers.filter((m) => m.session === "Evening").length,
        total: allMembers.length,
      });
      setMembers(
        allMembers.sort((a, b) =>
          b.isActive === a.isActive ? 0 : b.isActive ? 1 : -1
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMembers();
  }, [sessionFilter]);

  const deleteMember = async (id) => {
    if (confirm("Are you sure you want to delete this member?")) {
      await fetch(`/api/member/${id}`, { method: "DELETE" });
      getMembers();
      setPopupMember(null);
    }
  };

  const filteredMembers = members.filter((m) =>
    `${m.name} ${m.phone} ${m.note || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <AdminGuard>
      {/* Loader overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[9999]">
          <Loader size={60} color="#36d7b7" />
        </div>
      )}

      <div className="flex flex-col items-center sm:mt-[120px] mt-[140px] p-3 sm:p-6">
        {/* Main container */}
        <div className="w-full max-w-7xl h-[87vh] overflow-auto bg-[#323232] backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-3 sm:p-4 relative">
          {/* Header */}
          <div
            className={`top-0 z-20 mb-4 backdrop-blur-lg rounded-xl p-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between transition-opacity duration-500 ${
              showHeader ? "opacity-100" : "opacity-0"
            }`}
          >
            <h1 className="text-base sm:text-lg font-bold text-white">
              👥 Members Dashboard
            </h1>
            <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
              <input
                type="text"
                placeholder="🔍 Search by name or phone"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 sm:flex-none min-w-[150px] bg-gray-800 border border-gray-700 text-white placeholder-white/50 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={sessionFilter}
                onChange={(e) => setSessionFilter(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All</option>
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
              </select>
              <Link
                href="/add-member"
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg shadow text-sm w-full sm:w-auto justify-center"
              >
                <PlusCircle size={16} />
                Add
              </Link>
              <Link
                href="/attendance"
                className="flex items-center gap-1.5 bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg shadow text-sm w-full sm:w-auto justify-center"
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
              <span className="text-lg sm:text-xl font-bold">{counts.morning}</span>
            </div>
            <div className="bg-purple-600/20 text-white p-3 rounded-lg text-center text-sm">
              🌆 Evening <br />
              <span className="text-lg sm:text-xl font-bold">{counts.evening}</span>
            </div>
            <div className="bg-teal-600/20 text-white p-3 rounded-lg text-center text-sm">
              👥 Total <br />
              <span className="text-lg sm:text-xl font-bold">{counts.total}</span>
            </div>
          </div>

          {/* Members list */}
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {filteredMembers.map((m) => (
              <div
                key={m._id}
                className="bg-gray-800/70 border border-gray-700 rounded-lg p-3 flex flex-col gap-2 shadow hover:shadow-md transition text-sm relative"
              >
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setPopupMember(m)}
                >
                  <Image
                    src={m.image || "/default-member.avif"}
                    alt={m.name}
                    width={40}
                    height={40}
                    className="rounded-full border border-white/20 object-cover"
                  />
                  <div>
                    <h2 className="text-white font-medium text-sm break-words">{m.name}</h2>
                    <p className="text-gray-400 text-xs">{m.phone}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-300 space-y-0.5 break-words">
                  <p>Email: {m.email || "-"}</p>
                  <p>
                    Fee:{" "}
                    {m.feeStatus === "Paid" ? (
                      <span className="text-green-400">Paid</span>
                    ) : (
                      <span className="text-red-400">Unpaid</span>
                    )}
                  </p>
                  <p>Session: <span className="text-blue-300">{m.session}</span></p>
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
                <div className="flex justify-between mt-1 text-xs flex-wrap">
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

          {filteredMembers.length === 0 && (
            <p className="text-center text-white/60 mt-6 text-sm">No members found.</p>
          )}
        </div>

        {/* Popup */}
        {popupMember && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9998]">
            <div className="bg-gray-900 text-white border border-gray-700 rounded-xl p-5 w-[90%] max-w-md shadow-2xl relative">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <Image
                    src={popupMember.image || "/default-member.avif"}
                    alt={popupMember.name}
                    width={50}
                    height={50}
                    className="rounded-lg object-cover border border-white/20"
                  />
                  <div>
                    <h2 className="text-lg font-bold">{popupMember.name}</h2>
                    <p className="text-sm text-gray-300">{popupMember.phone}</p>
                  </div>
                </div>
                <button
                  className="text-white hover:text-gray-300"
                  onClick={() => setPopupMember(null)}
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <p><span className="font-semibold">Email:</span> {popupMember.email || "-"}</p>
                <p><span className="font-semibold">Session:</span> {popupMember.session}</p>
                <p>
                  <span className="font-semibold">Fee:</span>{" "}
                  {popupMember.feeStatus === "Paid" ? (
                    <span className="text-green-400">Paid</span>
                  ) : (
                    <span className="text-red-400">Unpaid</span>
                  )}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  {popupMember.isActive ? (
                    <span className="text-green-400">✔ Active</span>
                  ) : (
                    <span className="text-red-400">✖ Inactive</span>
                  )}
                </p>
                <p className="col-span-2">
                  <span className="font-semibold">Note:</span> {popupMember.note || "-"}
                </p>
              </div>

              <div className="flex justify-between">
                <Link
                  href={`/edit-member/${popupMember._id}`}
                  className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg shadow text-sm"
                >
                  <Pencil size={16} /> Edit
                </Link>
                <button
                  onClick={() => deleteMember(popupMember._id)}
                  className="flex items-center gap-1 bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg shadow text-sm"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminGuard>
  );
}
