import { connectDB } from "@/lib/db";
import Attendance from "@/models/attendance";
import mongoose from "mongoose"; // ✅ Required import
import { NextResponse } from "next/server";

// GET /api/attendance/[id] - Get attendance by ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid attendance ID',
      }, { status: 400 });
    }

    const attendance = await Attendance.findById(id)
      .populate('memberId', 'name phone membershipType email');

    if (!attendance) {
      return NextResponse.json({
        success: false,
        message: 'Attendance record not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Attendance record fetched successfully',
      data: { attendance },
    });

  } catch (error) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch attendance record',
      error: error.message,
    }, { status: 500 });
  }
}

// PUT /api/attendance/[id] - Update attendance
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const body = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid attendance ID',
      }, { status: 400 });
    }

    const attendance = await Attendance.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).populate('memberId', 'name phone membershipType');

    if (!attendance) {
      return NextResponse.json({
        success: false,
        message: 'Attendance record not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Attendance record updated successfully',
      data: { attendance },
    });

  } catch (error) {
    console.error('Error updating attendance:', error);

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to update attendance record',
      error: error.message,
    }, { status: 500 });
  }
}

// DELETE /api/attendance/[id] - Delete attendance
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid attendance ID',
      }, { status: 400 });
    }

    const attendance = await Attendance.findByIdAndDelete(id);

    if (!attendance) {
      return NextResponse.json({
        success: false,
        message: 'Attendance record not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Attendance record deleted successfully',
      data: { attendance },
    });

  } catch (error) {
    console.error('Error deleting attendance:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete attendance record',
      error: error.message,
    }, { status: 500 });
  }
}
