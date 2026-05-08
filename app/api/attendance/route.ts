import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Attendance from "@/models/Attendance";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    const userId = searchParams.get("userId");

    await dbConnect();
    
    const query: any = {};
    
    if (userId) {
      query.user = userId;
    }
    
    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const attendanceRecords = await Attendance.find(query)
      .populate("user", "name role")
      .sort({ date: -1 });

    return NextResponse.json({ success: true, data: attendanceRecords });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await dbConnect();

    // Standardize date to midnight UTC to prevent time zone mismatch in query
    const recordDate = new Date(body.date);
    recordDate.setUTCHours(0, 0, 0, 0);

    // Check if record exists for this user and date
    const existingRecord = await Attendance.findOne({
      user: body.user,
      date: recordDate,
    });

    let attendance;
    if (existingRecord) {
      // Update existing
      attendance = await Attendance.findByIdAndUpdate(
        existingRecord._id,
        { ...body, date: recordDate },
        { new: true, runValidators: true }
      );
    } else {
      // Create new
      attendance = await Attendance.create({ ...body, date: recordDate });
    }

    return NextResponse.json({ success: true, data: attendance });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
