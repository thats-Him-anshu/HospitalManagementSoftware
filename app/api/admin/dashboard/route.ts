import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import Lead from "@/models/Lead";
import Admission from "@/models/Admission";
import Invoice from "@/models/Invoice";
import Expense from "@/models/Expense";
import Patient from "@/models/Patient";
import User from "@/models/User";
import Attendance from "@/models/Attendance";
import ActivityLog from "@/models/ActivityLog";
import TreatmentPlan from "@/models/TreatmentPlan";
import TherapySession from "@/models/TherapySession";
import PharmacySale from "@/models/PharmacySale";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as Record<string, string>).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // === ROW 1: Stat Cards ===
    const [bookingsToday, activeIP, activeOP, pendingLeads] = await Promise.all([
      Appointment.countDocuments({ appointmentDate: { $gte: startOfToday, $lte: endOfToday } }),
      Admission.countDocuments({ admissionType: "IP", status: "active" }),
      Admission.countDocuments({ admissionType: "OP", status: "active" }),
      Lead.countDocuments({ status: "new", createdAt: { $gte: startOfToday, $lte: endOfToday } }),
    ]);

    // === ROW 2: Doctor Operations + Leaderboard ===
    const doctors = await User.find({ role: "doctor", isActive: true }).select("name profileImage").lean();
    const doctorOps = await Promise.all(
      doctors.map(async (doc) => {
        const currentAppt = await Appointment.findOne({
          doctor: doc._id,
          appointmentDate: { $gte: startOfToday, $lte: endOfToday },
          status: "confirmed",
        });
        const waitingAppt = await Appointment.findOne({
          doctor: doc._id,
          appointmentDate: { $gte: startOfToday, $lte: endOfToday },
          status: "scheduled",
        });
        let statusLabel = "Available";
        let statusColor = "blue";
        if (currentAppt) { statusLabel = "In Consultation"; statusColor = "green"; }
        else if (waitingAppt) { statusLabel = "Patient Waiting"; statusColor = "orange"; }
        return { ...doc, statusLabel, statusColor };
      })
    );

    const doctorLeaderboard = await Appointment.aggregate([
      { $match: { appointmentDate: { $gte: startOfMonth }, status: { $in: ["completed", "confirmed"] } } },
      { $group: { _id: "$doctor", consultations: { $sum: 1 } } },
      { $sort: { consultations: -1 } },
      { $limit: 10 },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "doctor" } },
      { $unwind: "$doctor" },
      { $project: { name: "$doctor.name", profileImage: "$doctor.profileImage", consultations: 1 } },
    ]);

    // Add treatment plan count to leaderboard
    for (const doc of doctorLeaderboard) {
      const planCount = await TreatmentPlan.countDocuments({ doctor: doc._id, createdAt: { $gte: startOfMonth } });
      doc.treatmentPlans = planCount;
    }

    // === ROW 3: Therapist Operations + Leaderboard ===
    const therapists = await User.find({ role: "therapist", isActive: true }).select("name profileImage").lean();
    const therapistOps = await Promise.all(
      therapists.map(async (t) => {
        const activeSession = await TherapySession.findOne({
          therapist: t._id,
          date: { $gte: startOfToday, $lte: endOfToday },
          status: "in-progress",
        });
        const pendingSession = await TherapySession.findOne({
          therapist: t._id,
          date: { $gte: startOfToday, $lte: endOfToday },
          status: "scheduled",
        });
        let statusLabel = "Available";
        let statusColor = "blue";
        if (activeSession) { statusLabel = "In Session"; statusColor = "green"; }
        else if (pendingSession) { statusLabel = "Patient Waiting"; statusColor = "orange"; }
        return { ...t, statusLabel, statusColor };
      })
    );

    const therapistLeaderboard = await TherapySession.aggregate([
      { $match: { date: { $gte: startOfMonth }, status: "completed" } },
      { $group: { _id: "$therapist", completed: { $sum: 1 } } },
      { $sort: { completed: -1 } },
      { $limit: 10 },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "therapist" } },
      { $unwind: "$therapist" },
      { $project: { name: "$therapist.name", completed: 1 } },
    ]);

    for (const t of therapistLeaderboard) {
      const pending = await TherapySession.countDocuments({ therapist: t._id, date: { $gte: startOfMonth }, status: "scheduled" });
      t.pending = pending;
    }

    // === ROW 4: Staff Attendance Today ===
    const allStaff = await User.find({ isActive: true }).select("name role profileImage").lean();
    const todayAttendance = await Attendance.find({ date: { $gte: startOfToday, $lte: endOfToday } }).lean();
    const staffAttendance = allStaff.map((staff) => {
      const attendance = todayAttendance.find((a) => a.user.toString() === (staff._id as string).toString());
      return {
        ...staff,
        status: attendance?.status || "Not Logged",
        loggedInAt: attendance?.loggedInAt || attendance?.checkIn || null,
        loggedOutAt: attendance?.loggedOutAt || attendance?.checkOut || null,
        isCurrentlyLoggedIn: attendance?.isCurrentlyLoggedIn || false,
      };
    });

    // === ROW 5: Activity Feed ===
    const activityFeed = await ActivityLog.find({})
      .sort({ timestamp: -1 })
      .limit(20)
      .lean();

    // === ROW 6: Charts ===
    const topProducts = await PharmacySale.aggregate([
      { $match: { createdAt: { $gte: startOfMonth } } },
      { $unwind: "$items" },
      { $group: { _id: "$items.product", totalQty: { $sum: "$items.quantity" } } },
      { $sort: { totalQty: -1 } },
      { $limit: 5 },
      { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
      { $unwind: "$product" },
      { $project: { name: "$product.name", value: "$totalQty" } },
    ]);

    const topTreatments = await TreatmentPlan.aggregate([
      { $match: { createdAt: { $gte: startOfMonth } } },
      { $unwind: "$items" },
      { $group: { _id: "$items.treatmentName", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { name: "$_id", value: "$count" } },
    ]);

    // Revenue data for existing chart
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const [revenueByMonth, expensesByMonth] = await Promise.all([
      Invoice.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        { $group: { _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } }, revenue: { $sum: "$amountPaid" } } },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
      Expense.aggregate([
        { $match: { date: { $gte: sixMonthsAgo } } },
        { $group: { _id: { month: { $month: "$date" }, year: { $year: "$date" } }, expenses: { $sum: "$amount" } } },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
    ]);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const chartData = revenueByMonth.map((item) => {
      const exp = expensesByMonth.find((e) => e._id.month === item._id.month && e._id.year === item._id.year);
      return { name: months[item._id.month - 1], revenue: item.revenue, expenses: exp ? exp.expenses : 0 };
    });

    const totalPatients = await Patient.countDocuments({});
    const todayInvoices = await Invoice.aggregate([
      { $match: { createdAt: { $gte: startOfToday, $lte: endOfToday } } },
      { $group: { _id: null, paid: { $sum: "$amountPaid" } } },
    ]);
    const monthInvoices = await Invoice.aggregate([
      { $match: { createdAt: { $gte: startOfMonth, $lte: endOfToday } } },
      { $group: { _id: null, paid: { $sum: "$amountPaid" } } },
    ]);

    return NextResponse.json({
      success: true,
      data: {
        // Row 1
        bookingsToday,
        activeIP,
        activeOP,
        pendingLeads,
        // Row 2
        doctorOps,
        doctorLeaderboard,
        // Row 3
        therapistOps,
        therapistLeaderboard,
        // Row 4
        staffAttendance,
        // Row 5
        activityFeed,
        // Row 6
        topProducts,
        topTreatments,
        // Legacy
        totalPatients,
        todayRevenue: todayInvoices[0]?.paid || 0,
        monthRevenue: monthInvoices[0]?.paid || 0,
        chartData,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
