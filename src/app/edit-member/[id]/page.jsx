"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import AdminGuard from "@/components/AdminGuard";

export default function EditMemberPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    feeStatus: "Pending",
    isActive: true,
    image: "",
    note: "",
    session: "Morning",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await fetch(`/api/member`);
        const data = await res.json();
        const found = data.data.members.find((m) => m._id === id);

        if (found) {
          setForm({
            name: found.name,
            phone: found.phone,
            email: found.email || "",
            feeStatus: found.feeStatus,
            isActive: found.isActive,
            image: found.image || "",
            note: found.note || "",
            session: found.session || "Morning",
          });
        } else {
          toast.error("Member not found");
          router.push("/members");
        }

        setLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to fetch member");
      }
    };

    fetchMember();
  }, [id, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/member/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Member updated successfully");
        router.push("/members");
      } else {
        toast.error(result.message || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Something went wrong!");
    }
  };

  if (loading)
    return (
      <div className="p-6 text-center text-lg text-white">Loading...</div>
    );

  return (
    <div className=" flex items-center justify-center mt-[-50px] backdrop-blur-lg border-b border-white/20 shadow-2xl rounded-2xl  p-6">
      <AdminGuard>
      <div className="w-full  max-w-lg h-[80vh] overflow-auto bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-8 text-white">

        {/* Profile Image Preview */}
        <div className="flex flex-col items-center mb-6">
          <Image
            src={form.image || "/default-member.avif"}
            alt="Member"
            width={80}
            height={80}
            className="rounded-full object-cover border border-white/30 shadow-lg"
          />
          <p className="text-xs text-white/60 mt-2">
            Profile Picture Preview
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input
              type="text"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://example.com/photo.jpg"
              className="w-full px-3 py-2 rounded-lg text-sm bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Session */}
          <div>
            <label className="block text-sm font-medium mb-1">Session</label>
            <select
              value={form.session}
              onChange={(e) => setForm({ ...form, session: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="Morning">🌅 Morning</option>
              <option value="Evening">🌙 Evening</option>
            </select>
          </div>

          {/* Fee Status */}
          <div>
            <label className="block text-sm font-medium mb-1">Fee Status</label>
            <select
              value={form.feeStatus}
              onChange={(e) => setForm({ ...form, feeStatus: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="Pending">⏳ Pending</option>
              <option value="Paid">✅ Paid</option>
              <option value="Advance Paid">💰 Advance Paid</option>
            </select>
          </div>

          {/* Active Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="h-4 w-4 text-green-500 bg-white/10 border-white/30 focus:ring-green-500"
            />
            <label className="text-sm">Active Member</label>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="Enter additional notes here..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg text-sm bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 text-sm"
            >
              💾 Update
            </button>
            <Link
              href="/members"
              className="flex-1 text-center bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 text-sm"
            >
              ↩️ Back
            </Link>
          </div>
        </form>
      </div>
      </AdminGuard>
    </div>
  );
}
