import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import TherapySession from "@/models/TherapySession";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const therapistId = searchParams.get("therapistId") || (session.user as any).id;

    await dbConnect();
    const sessions = await TherapySession.find({ therapist: therapistId })
      .populate("patient", "firstName lastName patientId phone")
      .sort({ date: -1 });

    return NextResponse.json({ success: true, data: sessions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    await dbConnect();
    const ts = await TherapySession.create({ ...body, therapist: (session.user as any).id });
    return NextResponse.json({ success: true, data: ts }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
