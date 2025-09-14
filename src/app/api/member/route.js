import { connectDB } from "@/lib/db";
import Member from "@/models/member";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { 
      name, 
      phone, 
      email, 
      address, 
      emergencyContact, 
      feeStatus = "Pending", 
      imageBase64, 
      note,
      session = "Morning"
    } = body;

    if (!name || !phone) {
      return NextResponse.json({ success: false, message: "Name and phone are required" }, { status: 400 });
    }

    const existing = await Member.findOne({ phone });
    if (existing) {
      return NextResponse.json({ success: false, message: "Phone already exists" }, { status: 400 });
    }

    let imageUrl = "";
    if (imageBase64) {
      const uploaded = await cloudinary.uploader.upload(imageBase64, {
        folder: "aarogya/members",
        transformation: [{ width: 400, height: 400, crop: "fill" }],
      });
      imageUrl = uploaded.secure_url;
    }

    const newMember = await Member.create({
      name,
      phone,
      email,
      address,
      emergencyContact,
      feeStatus,
      image: imageUrl,
      note,
      session
    });

    return NextResponse.json({
      success: true,
      message: "Member created",
      data: newMember
    }, { status: 201 });

  } catch (err) {
    console.error("POST Error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit"))
    const search = searchParams.get("search") || "";
    const feeStatus = searchParams.get("feeStatus") || "";
    const active = searchParams.get("isActive");
    const session = searchParams.get("session") || "";

    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { note: { $regex: search, $options: "i" } }
      ];
    }

    if (feeStatus) query.feeStatus = feeStatus;
    if (active !== null && active !== "") query.isActive = active === "true";
    if (session) query.session = session;

    const skip = (page - 1) * limit;
    const cursor = Member.find(query).sort({ createdAt: -1 });

    const members = limit === 0 
      ? await cursor // no limit
      : await cursor.skip(skip).limit(limit);

    const total = await Member.countDocuments(query);

    return NextResponse.json({
      success: true,
      message: "Members fetched",
      data: {
        members,
        pagination: {
          currentPage: page,
          totalPages: limit === 0 ? 1 : Math.ceil(total / limit),
          totalMembers: total,
          hasNextPage: limit === 0 ? false : page * limit < total,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (err) {
    console.error("GET Error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
