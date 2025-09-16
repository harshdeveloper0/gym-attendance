"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

export default function AddMember() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    feeStatus: "Pending",
    imageBase64: "",
    note: "",
    session: "Morning",
  });

  const [preview, setPreview] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, imageBase64: reader.result });
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/member", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (data.success) {
      toast.success("Member added successfully");
      router.push("/members");
    } else {
      toast.error(data.message || "Failed to add member");
    }
  };

  return (
    <div className="flex items-center justify-center mt-[-50px] backdrop-blur-lg border-b border-white/20 shadow-2xl rounded-2xl p-6">
      <div className="w-full bg-[#323232] max-w-lg h-[80vh] overflow-auto  backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-8 text-white">
        {/* Title and Back Link */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">➕ Add New Member</h2>
          <Link
            href="/members"
            className="text-blue-300 hover:text-white text-sm flex items-center gap-1"
          >
            <ArrowLeft size={16} /> Back
          </Link>
        </div>

        {/* Profile Preview */}
        <div className="flex flex-col items-center mb-6">
          <Image
            src={preview || "/default-member.avif"}
            alt="Preview"
            width={80}
            height={80}
            className="rounded-full object-cover border border-white/30 shadow-lg"
          />
          <p className="text-xs text-white/60 mt-2">Profile Picture Preview</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Profile Image
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/30 rounded-lg cursor-pointer hover:bg-white/20 transition">
                <Upload size={18} />
                <span>Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
              className="w-full px-3 py-2 rounded-lg text-sm bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
              className="w-full px-3 py-2 rounded-lg text-sm bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email (optional)"
              className="w-full px-3 py-2 rounded-lg text-sm bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Session */}
          <div>
            <label className="block text-sm font-medium mb-1">Session</label>
            <select
              name="session"
              value={form.session}
              onChange={handleChange}
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
              name="feeStatus"
              value={form.feeStatus}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg text-sm bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="Pending">⏳ Pending</option>
              <option value="Paid">✅ Paid</option>
              <option value="Advance Paid">💰 Advance Paid</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
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
              ➕ Add Member
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
    </div>
  );
}
