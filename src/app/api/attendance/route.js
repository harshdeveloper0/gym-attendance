import { connectDB } from "@/lib/db";
import Attendance from "@/models/attendance";
import Member from "@/models/member";
import { NextResponse } from "next/server";
import { startAutoAbsentJob } from "@/lib/autoAbsentJob";

//corn job
if (!global.autoAbsentJobStarted) {
  startAutoAbsentJob();
  global.autoAbsentJobStarted = true;
  console.log("🚀 Auto-Absent Cron Scheduler Started");
}

// POST
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { memberId, date, status, notes } = body;

    if (!memberId || !date || !status) {
      return NextResponse.json(
        { success: false, message: "Member ID, date, and status are required" },
        { status: 400 }
      );
    }

    const member = await Member.findById(memberId).select("name");
    if (!member) {
      return NextResponse.json(
        { success: false, message: "Member not found" },
        { status: 404 }
      );
    }

    const existing = await Attendance.findOne({ memberId, date });

    let attendance;
    if (existing) {
      existing.status = status;
      existing.notes = notes || existing.notes;
      await existing.save();
      attendance = existing;
    } else {
      attendance = await Attendance.create({
        memberId,
        memberName: member.name,
        date,
        status,
        notes: notes || "",
      });
    }

    return NextResponse.json(
      { success: true, message: "Attendance saved", data: attendance },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error marking attendance:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}


// Get API
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    const filter = date ? { date } : {};

    const attendance = await Attendance.find(filter)
      .populate("memberId", "name session phone image")
      .lean();

    const formatted = attendance.map((record) => ({
      ...record,
      session: record.memberId?.session || "N/A",
      memberName: record.memberId?.name || record.memberName,
      phoneNumber: record.memberId?.phone || "",
      profilePhoto: record.memberId?.image || "",
    }));

    return NextResponse.json({ success: true, attendance: formatted });
  } catch (error) {
    console.error("GET /api/attendance error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}


