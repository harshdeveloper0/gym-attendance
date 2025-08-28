"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload } from "lucide-react";

export default function AddMember() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    feeStatus: "Pending",
    imageBase64: "",
    note: "",
  });
  const [preview, setPreview] = useState(null);

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
      alert("Member added");
      router.push("/members");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="flex items-center justify-center p-10">
      <div className="w-full max-w-xl backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-6 text-white">
          <h2 className="text-2xl sm:text-3xl font-bold">Add New Member</h2>
          <Link
            href="/members"
            className="flex items-center gap-2 text-blue-300 hover:text-white text-sm sm:text-base"
          >
            <ArrowLeft size={18} />
            Back to Members
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-white">
          <div>
            <label className="block mb-1 text-sm font-medium">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
              className="w-full p-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
              className="w-full p-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email (optional)"
              className="w-full p-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Fee Status */}
          <div>
            <label className="block mb-1 text-sm font-medium">Fee Status</label>
            <select
              name="feeStatus"
              value={form.feeStatus}
              onChange={handleChange}
              className="w-full p-2 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option className="bg-black text-white">Pending</option>
              <option className="bg-black text-white">Paid</option>
              <option className="bg-black text-white">Advance Paid</option>
            </select>
          </div>

          {/* ✅ Note field */}
          <div>
            <label className="block mb-1 text-sm font-medium">Note</label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="Enter note (optional)"
              rows={3}
              className="w-full p-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Profile Image */}
          <div>
            <label className="block mb-1 text-sm font-medium">
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
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-16 h-16 rounded-full object-cover border border-white/30"
                />
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#746555] hover:bg-[#42392f] text-white font-semibold py-2 rounded-xl transition-all"
          >
            Add Member
          </button>
        </form>
      </div>
    </div>
  );
}
