import cron from "node-cron";
import { connectDB } from "@/lib/db";
import Attendance from "@/models/attendance";
import Member from "@/models/member";

export function startAutoAbsentJob() {
  // Runs daily at 9:05 PM IST
  cron.schedule("5 21 * * *", async () => {
    try {
      console.log("🕘 Auto-Absent Cron Started...");
      await connectDB();

      const date = new Date().toISOString().split("T")[0];

      const allMembers = await Member.find();
      const marked = await Attendance.find({ date }).select("memberId");

      const markedIds = marked.map((m) => m.memberId.toString());
      const unmarked = allMembers.filter(
        (m) => !markedIds.includes(m._id.toString())
      );

      const absentRecords = unmarked.map((m) => ({
        memberId: m._id,
        memberName: m.name,
        date,
        status: "Absent",
      }));

      if (absentRecords.length > 0) {
        for (const record of absentRecords) {
          await Attendance.updateOne(
            { memberId: record.memberId, date: record.date },
            { $setOnInsert: record },
            { upsert: true }
          );
        }
        console.log(
          `✅ Auto-marked ${absentRecords.length} members as Absent (${date})`
        );
      }
    } catch (err) {
      console.error("❌ Auto-Absent Job Failed:", err.message);
    }
  });
}
