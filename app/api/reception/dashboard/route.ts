import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import Lead from "@/models/Lead";
import Invoice from "@/models/Invoice";
import Patient from "@/models/Patient";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);

    const [todayAppointments, newLeadsToday, pendingPayments, todayPatients] = await Promise.all([
      Appointment.countDocuments({ appointmentDate: { $gte: today, $lt: tomorrow } }),
      Lead.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } }),
      Invoice.countDocuments({ paymentStatus: { $in: ["pending", "partial"] } }),
      Patient.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } }),
    ]);

    return NextResponse.json({
      success: true,
      data: { todayAppointments, newLeadsToday, pendingPayments, todayPatients },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
