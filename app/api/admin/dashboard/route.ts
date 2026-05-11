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
    const [appointmentsToday, leadsNew, activeIP, activeOP, totalPatients] = await Promise.all([
      Appointment.countDocuments({ appointmentDate: { $gte: startOfToday, $lte: endOfToday } }),
      Lead.countDocuments({ status: "new" }),
      Admission.countDocuments({ admissionType: "IP", status: "active" }),
      Admission.countDocuments({ admissionType: "OP", status: "active" }),
      Patient.countDocuments({}),
    ]);

    // Revenue
    const todayInvoices = await Invoice.aggregate([
      { $match: { createdAt: { $gte: startOfToday, $lte: endOfToday } } },
      { $group: { _id: null, paid: { $sum: "$amountPaid" }, total: { $sum: "$totalAmount" } } },
    ]);

    const monthInvoices = await Invoice.aggregate([
      { $match: { createdAt: { $gte: startOfMonth, $lte: endOfToday } } },
      { $group: { _id: null, paid: { $sum: "$amountPaid" }, total: { $sum: "$totalAmount" } } },
    ]);

    const todayRevenue = todayInvoices.length > 0 ? todayInvoices[0].paid : 0;
    const monthRevenue = monthInvoices.length > 0 ? monthInvoices[0].paid : 0;

    // Monthly Chart Data (Last 6 Months)
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
      return {
        name: `${months[item._id.month - 1]}`,
        revenue: item.revenue,
        expenses: exp ? exp.expenses : 0,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        appointmentsToday,
        leadsNew,
        activeIP,
        activeOP,
        totalPatients,
        todayRevenue,
        monthRevenue,
        chartData,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
