import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import TherapySession from "@/models/TherapySession";
import Patient from "@/models/Patient";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const therapistId = (session.user as any).id;
    await dbConnect();

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
    const weekStart = new Date(today); weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    const [todaySessions, activePatients, weekCompleted] = await Promise.all([
      TherapySession.countDocuments({ therapist: therapistId, date: { $gte: today, $lt: tomorrow } }),
      Patient.countDocuments({ assignedTherapist: therapistId, isActive: true }),
      TherapySession.countDocuments({ therapist: therapistId, date: { $gte: weekStart, $lt: tomorrow }, status: "completed" }),
    ]);

    return NextResponse.json({ success: true, data: { todaySessions, activePatients, weekCompleted } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
