import { connectDB } from "@/lib/db";
import Attendance from "@/models/attendance";
import Member from "@/models/member"; 
import { NextResponse } from "next/server";



// POST /api/attendance
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { memberId, date, status, checkInTime, checkOutTime, notes, markedBy } = body;

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

    // 👇 Attendance create karo with memberName
    const attendance = await Attendance.create({
      memberId,
      memberName: member.name,
      date,
      status,
      checkInTime,
      checkOutTime,
      notes: notes || "",
      markedBy: markedBy || "admin",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Attendance marked successfully",
        data: { attendance },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error marking attendance:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to mark attendance",
        error: error.message,
      },
      { status: 500 }
    );
  }
}






export async function GET(req) {
  try {
    await connectDB();
    const attendance = await Attendance.find();
    return NextResponse.json({ success: true, attendance });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}




