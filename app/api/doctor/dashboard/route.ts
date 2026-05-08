import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import Patient from "@/models/Patient";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const doctorId = (session.user as any).id;
    await dbConnect();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    const [todayAppointments, activeIPPatients, weekAppointments, recentAppointments] = await Promise.all([
      Appointment.countDocuments({ doctor: doctorId, appointmentDate: { $gte: today, $lt: tomorrow } }),
      Patient.countDocuments({ assignedDoctor: doctorId, admissionType: "IP", isActive: true }),
      Appointment.countDocuments({ doctor: doctorId, appointmentDate: { $gte: weekStart, $lt: tomorrow }, status: "completed" }),
      Appointment.find({ doctor: doctorId, appointmentDate: { $gte: today, $lt: tomorrow } })
        .populate("patient", "firstName lastName patientId phone")
        .sort({ appointmentDate: 1 })
        .limit(10)
        .lean(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        todayAppointments,
        activeIPPatients,
        weekCompleted: weekAppointments,
        recentAppointments,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
