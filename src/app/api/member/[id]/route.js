import { connectDB } from "@/lib/db";
import Member from "@/models/member";
import { NextResponse } from "next/server";

await connectDB();

export async function PUT(request, { params }) {
  try {
    const memberId = params.id;
    const body = await request.json();

    const updatedMember = await Member.findByIdAndUpdate(memberId, body, {
      new: true,
    });

    if (!updatedMember) {
      return NextResponse.json({ message: "Member not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Member updated successfully",
      member: updatedMember,
      success:true,
    });
  } catch (error) {
    return NextResponse.json({ message: "Error updating member", error }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const memberId = params.id;

    const deletedMember = await Member.findByIdAndDelete(memberId);

    if (!deletedMember) {
      return NextResponse.json({ message: "Member not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Member deleted successfully",
      member: deletedMember,
      success:true,
    });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting member", error }, { status: 500 });
  }
}
