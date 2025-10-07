import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Attendance from "@/models/attendance";
import Member from "@/models/member";

export async function POST(req) {
  try {
    await connectDB();

    const { date } = await req.json();
    if (!date) {
      return NextResponse.json(
        { success: false, message: "Date is required" },
        { status: 400 }
      );
    }

    const allMembers = await Member.find();
    const marked = await Attendance.find({ date }).select("memberId");

    const markedIds = marked.map((m) => m.memberId.toString());
    const unmarked = allMembers.filter(
      (m) => !markedIds.includes(m._id.toString())
    );

    if (unmarked.length === 0) {
      return NextResponse.json({
        success: true,
        message: "All members already marked for this date",
      });
    }

    const absentRecords = unmarked.map((m) => ({
      memberId: m._id,
      memberName: m.name,
      date,
      status: "Absent",
    }));

    for (const record of absentRecords) {
      await Attendance.updateOne(
        { memberId: record.memberId, date: record.date },
        { $setOnInsert: record },
        { upsert: true }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${absentRecords.length} members auto-marked as Absent for ${date}`,
    });
  } catch (error) {
    if (error.code === 11000) {
      console.warn("Duplicate attendance detected, skipping...");
      return NextResponse.json({
        success: true,
        message: "Some duplicates skipped (already marked).",
      });
    }
    console.error("Auto-Absent Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to auto-mark absent" },
      { status: 500 }
    );
  }
}
