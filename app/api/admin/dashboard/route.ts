import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import Lead from "@/models/Lead";
import Admission from "@/models/Admission";
import Invoice from "@/models/Invoice";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Today's date range
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // Start of month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Queries
    const appointmentsToday = await Appointment.countDocuments({
      appointmentDate: { $gte: startOfToday, $lte: endOfToday },
    });

    const leadsToday = await Lead.countDocuments({
      createdAt: { $gte: startOfToday, $lte: endOfToday },
      status: "new",
    });

    const activeIP = await Admission.countDocuments({
      admissionType: "IP",
      status: "active",
    });

    const activeOP = await Admission.countDocuments({
      admissionType: "OP",
      status: "active",
    });

    // Revenue
    const todayInvoices = await Invoice.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfToday, $lte: endOfToday },
          paymentStatus: { $in: ["paid", "partial"] },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amountPaid" },
        },
      },
    ]);

    const monthInvoices = await Invoice.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: endOfToday },
          paymentStatus: { $in: ["paid", "partial"] },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amountPaid" },
        },
      },
    ]);

    const todayRevenue = todayInvoices.length > 0 ? todayInvoices[0].total : 0;
    const monthRevenue = monthInvoices.length > 0 ? monthInvoices[0].total : 0;

    // Monthly Chart Data (Last 6 Months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const revenueByMonth = await Invoice.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          paymentStatus: { $in: ["paid", "partial"] },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          revenue: { $sum: "$amountPaid" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const chartData = revenueByMonth.map((item) => ({
      name: `${months[item._id.month - 1]}`,
      revenue: item.revenue,
      expenses: Math.round(item.revenue * 0.4), // Mock expenses for now until expense module
    }));

    return NextResponse.json({
      success: true,
      data: {
        appointmentsToday,
        leadsToday,
        activeIP,
        activeOP,
        todayRevenue,
        monthRevenue,
        chartData,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
