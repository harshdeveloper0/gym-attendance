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

    // 🔍 member find karo
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
      memberName: member.name, // 👈 naam bhi save ho rha hai
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



// GET /api/attendance
// export async function GET(request) {
//   try {
//     await connectDB();
//     const { searchParams } = new URL(request.url);
//     const date = searchParams.get("date");

//     if (!date) {
//       return NextResponse.json(
//         { success: false, message: "Date is required" },
//         { status: 400 }
//       );
//     }
//     const members = await Member.find().select("name phone image");
//     const attendanceRecords = await Attendance.find({ date });
//     const attendanceMap = {};
//     attendanceRecords.forEach((record) => {
//       attendanceMap[record.memberId.toString()] = record;
//     });

//     const result = members.map((member) => {
//       const att = attendanceMap[member._id.toString()];
//       return {
//         memberId: member._id,
//         name: member.name,
//         phone: member.phone,
//         image: member.image || null,
//         status: att ? att.status : "Not Marked",
//         checkInTime: att ? att.checkInTime : null,
//         checkOutTime: att ? att.checkOutTime : null,
//         notes: att ? att.notes : null,
//       };
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Attendance fetched successfully",
//       data: {
//         date,
//         attendance: result,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching attendance:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to fetch attendance",
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }


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




