import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import CheckInLog from "@/models/CheckInLog";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    await dbConnect();

    let query: any = {};
    if (start && end) {
      query.timestamp = { $gte: new Date(start), $lte: new Date(end) };
    }

    const logs = await CheckInLog.find(query).populate("patient", "firstName lastName patientId").sort({ timestamp: -1 });

    return NextResponse.json({ success: true, data: logs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { patientId, action } = body;

    await dbConnect();

    const log = await CheckInLog.create({
      patient: patientId,
      action,
      staff: (session.user as any).id,
    });

    return NextResponse.json({ success: true, data: log });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
