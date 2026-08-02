import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Appointment from "@/models/Appointment";
import Admission from "@/models/Admission";
import Invoice from "@/models/Invoice";
import Expense from "@/models/Expense";
import Patient from "@/models/Patient";
import TherapySession from "@/models/TherapySession";
import TreatmentPlan from "@/models/TreatmentPlan";
import PharmacySale from "@/models/PharmacySale";
import Attendance from "@/models/Attendance";

export async function GET(
  req: Request,
  { params }: { params: { type: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as Record<string, string>).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { type } = params;
    const { searchParams } = new URL(req.url);
    const startStr = searchParams.get("start");
    const endStr = searchParams.get("end");

    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Optional date range from query params
    const rangeStart = startStr ? new Date(startStr) : startOfMonth;
    const rangeEnd = endStr ? new Date(endStr + "T23:59:59.999Z") : endOfToday;

    let data: Record<string, unknown> = {};

    switch (type) {
      case "attendance": {
        // Staff attendance summary for the date range
        const attendanceRecords = await Attendance.find({
          date: { $gte: rangeStart, $lte: rangeEnd },
        })
          .populate("user", "name role")
          .sort({ date: -1 })
          .lean();

        const allStaff = await User.find({ isActive: true })
          .select("name role")
          .lean();

        // Group by user
        const userMap: Record<string, { name: string; role: string; present: number; absent: number; late: number }> = {};
        allStaff.forEach((s: any) => {
          userMap[s._id.toString()] = {
            name: s.name,
            role: s.role,
            present: 0,
            absent: 0,
            late: 0,
          };
        });

        attendanceRecords.forEach((a: any) => {
          const uid = a.user?._id?.toString();
          if (uid && userMap[uid]) {
            if (a.status === "present") userMap[uid].present++;
            else if (a.status === "absent") userMap[uid].absent++;
            else if (a.status === "late") userMap[uid].late++;
            else userMap[uid].present++; // default to present if logged in
          }
        });

        const summary = Object.values(userMap);
        const totalPresent = summary.reduce((a, s) => a + s.present, 0);
        const totalAbsent = summary.reduce((a, s) => a + s.absent, 0);

        data = {
          records: attendanceRecords,
          staffSummary: summary,
          totalPresent,
          totalAbsent,
          totalStaff: allStaff.length,
        };
        break;
      }

      case "performance": {
        // Per-staff performance metrics
        const doctorPerformance = await Appointment.aggregate([
          {
            $match: {
              appointmentDate: { $gte: rangeStart, $lte: rangeEnd },
              status: { $in: ["completed", "confirmed"] },
            },
          },
          { $group: { _id: "$doctor", consultations: { $sum: 1 } } },
          { $sort: { consultations: -1 } },
          {
            $lookup: {
              from: "users",
              localField: "_id",
              foreignField: "_id",
              as: "doctor",
            },
          },
          { $unwind: "$doctor" },
          {
            $project: {
              name: "$doctor.name",
              role: "$doctor.role",
              consultations: 1,
            },
          },
        ]);

        const therapistPerformance = await TherapySession.aggregate([
          {
            $match: {
              date: { $gte: rangeStart, $lte: rangeEnd },
              status: "completed",
            },
          },
          { $group: { _id: "$therapist", sessions: { $sum: 1 } } },
          { $sort: { sessions: -1 } },
          {
            $lookup: {
              from: "users",
              localField: "_id",
              foreignField: "_id",
              as: "therapist",
            },
          },
          { $unwind: "$therapist" },
          {
            $project: {
              name: "$therapist.name",
              role: "$therapist.role",
              sessions: 1,
            },
          },
        ]);

        // Treatment plans per doctor
        const treatmentPlans = await TreatmentPlan.aggregate([
          { $match: { createdAt: { $gte: rangeStart, $lte: rangeEnd } } },
          { $group: { _id: "$doctor", plans: { $sum: 1 } } },
          {
            $lookup: {
              from: "users",
              localField: "_id",
              foreignField: "_id",
              as: "doctor",
            },
          },
          { $unwind: "$doctor" },
          { $project: { name: "$doctor.name", plans: 1 } },
        ]);

        data = {
          doctorPerformance,
          therapistPerformance,
          treatmentPlans,
        };
        break;
      }

      case "pnl": {
        // Profit & Loss statement
        const [revenueAgg, expenseAgg, pharmacyAgg] = await Promise.all([
          Invoice.aggregate([
            { $match: { createdAt: { $gte: rangeStart, $lte: rangeEnd } } },
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: "$amountPaid" },
                totalBilled: { $sum: "$totalAmount" },
                totalOutstanding: { $sum: "$balance" },
                invoiceCount: { $sum: 1 },
              },
            },
          ]),
          Expense.aggregate([
            { $match: { date: { $gte: rangeStart, $lte: rangeEnd } } },
            {
              $group: {
                _id: null,
                totalExpenses: { $sum: "$amount" },
                expenseCount: { $sum: 1 },
              },
            },
          ]),
          PharmacySale.aggregate([
            { $match: { createdAt: { $gte: rangeStart, $lte: rangeEnd } } },
            {
              $group: {
                _id: null,
                totalPharmacy: { $sum: "$totalAmount" },
                saleCount: { $sum: 1 },
              },
            },
          ]),
        ]);

        // Monthly breakdown
        const monthlyRevenue = await Invoice.aggregate([
          { $match: { createdAt: { $gte: rangeStart, $lte: rangeEnd } } },
          {
            $group: {
              _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
              revenue: { $sum: "$amountPaid" },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        const monthlyExpenses = await Expense.aggregate([
          { $match: { date: { $gte: rangeStart, $lte: rangeEnd } } },
          {
            $group: {
              _id: { month: { $month: "$date" }, year: { $year: "$date" } },
              expenses: { $sum: "$amount" },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        const revenue = revenueAgg[0] || {
          totalRevenue: 0,
          totalBilled: 0,
          totalOutstanding: 0,
          invoiceCount: 0,
        };
        const expenses = expenseAgg[0] || { totalExpenses: 0, expenseCount: 0 };
        const pharmacy = pharmacyAgg[0] || { totalPharmacy: 0, saleCount: 0 };

        data = {
          revenue,
          expenses,
          pharmacy,
          netProfit:
            revenue.totalRevenue + pharmacy.totalPharmacy - expenses.totalExpenses,
          monthlyRevenue,
          monthlyExpenses,
        };
        break;
      }

      case "clinical": {
        // IP/OP analytics
        const [ipCount, opCount, totalAdmissions] = await Promise.all([
          Admission.countDocuments({
            admissionType: "IP",
            createdAt: { $gte: rangeStart, $lte: rangeEnd },
          }),
          Admission.countDocuments({
            admissionType: "OP",
            createdAt: { $gte: rangeStart, $lte: rangeEnd },
          }),
          Admission.countDocuments({
            createdAt: { $gte: rangeStart, $lte: rangeEnd },
          }),
        ]);

        const activeIP = await Admission.countDocuments({
          admissionType: "IP",
          status: "active",
        });
        const activeOP = await Admission.countDocuments({
          admissionType: "OP",
          status: "active",
        });

        const appointmentsByStatus = await Appointment.aggregate([
          {
            $match: {
              appointmentDate: { $gte: rangeStart, $lte: rangeEnd },
            },
          },
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]);

        const totalPatients = await Patient.countDocuments({
          createdAt: { $gte: rangeStart, $lte: rangeEnd },
        });

        // Top diagnoses from treatment plans
        const topDiagnoses = await TreatmentPlan.aggregate([
          { $match: { createdAt: { $gte: rangeStart, $lte: rangeEnd } } },
          { $group: { _id: "$diagnosis", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
          { $project: { diagnosis: "$_id", count: 1, _id: 0 } },
        ]);

        data = {
          ipCount,
          opCount,
          totalAdmissions,
          activeIP,
          activeOP,
          appointmentsByStatus,
          newPatients: totalPatients,
          topDiagnoses,
        };
        break;
      }

      case "financial": {
        // Financial snapshot
        const todayInvoices = await Invoice.aggregate([
          { $match: { createdAt: { $gte: startOfToday, $lte: endOfToday } } },
          {
            $group: {
              _id: null,
              todayRevenue: { $sum: "$amountPaid" },
              count: { $sum: 1 },
            },
          },
        ]);

        const monthInvoices = await Invoice.aggregate([
          { $match: { createdAt: { $gte: startOfMonth, $lte: endOfToday } } },
          {
            $group: {
              _id: null,
              monthRevenue: { $sum: "$amountPaid" },
              totalBilled: { $sum: "$totalAmount" },
              outstanding: { $sum: "$balance" },
              count: { $sum: 1 },
            },
          },
        ]);

        const monthExpenses = await Expense.aggregate([
          { $match: { date: { $gte: startOfMonth, $lte: endOfToday } } },
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" },
            },
          },
        ]);

        const pharmacySales = await PharmacySale.aggregate([
          { $match: { createdAt: { $gte: startOfMonth, $lte: endOfToday } } },
          {
            $group: {
              _id: null,
              total: { $sum: "$totalAmount" },
            },
          },
        ]);

        // Payment method breakdown
        const paymentMethods = await Invoice.aggregate([
          { $match: { createdAt: { $gte: startOfMonth, $lte: endOfToday } } },
          {
            $group: {
              _id: "$paymentMethod",
              total: { $sum: "$amountPaid" },
              count: { $sum: 1 },
            },
          },
          { $sort: { total: -1 } },
        ]);

        const today = todayInvoices[0] || { todayRevenue: 0, count: 0 };
        const month = monthInvoices[0] || {
          monthRevenue: 0,
          totalBilled: 0,
          outstanding: 0,
          count: 0,
        };
        const expTotal = monthExpenses[0]?.total || 0;
        const pharmTotal = pharmacySales[0]?.total || 0;

        data = {
          todayRevenue: today.todayRevenue,
          todayInvoiceCount: today.count,
          monthRevenue: month.monthRevenue,
          monthBilled: month.totalBilled,
          outstandingBalance: month.outstanding,
          monthExpenses: expTotal,
          pharmacyRevenue: pharmTotal,
          netProfit: month.monthRevenue + pharmTotal - expTotal,
          paymentMethods,
        };
        break;
      }

      case "income": {
        // Revenue breakdown
        const revenueByMonth = await Invoice.aggregate([
          { $match: { createdAt: { $gte: rangeStart, $lte: rangeEnd } } },
          {
            $group: {
              _id: {
                month: { $month: "$createdAt" },
                year: { $year: "$createdAt" },
              },
              revenue: { $sum: "$amountPaid" },
              invoices: { $sum: 1 },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        // Revenue by item/treatment
        const revenueByItem = await Invoice.aggregate([
          { $match: { createdAt: { $gte: rangeStart, $lte: rangeEnd } } },
          { $unwind: "$items" },
          {
            $group: {
              _id: "$items.description",
              totalRevenue: { $sum: "$items.total" },
              totalQty: { $sum: "$items.quantity" },
            },
          },
          { $sort: { totalRevenue: -1 } },
          { $limit: 20 },
          {
            $project: {
              description: "$_id",
              totalRevenue: 1,
              totalQty: 1,
              _id: 0,
            },
          },
        ]);

        // Revenue by issuer (doctor/staff)
        const revenueByStaff = await Invoice.aggregate([
          { $match: { createdAt: { $gte: rangeStart, $lte: rangeEnd } } },
          {
            $group: {
              _id: "$issuedBy",
              revenue: { $sum: "$amountPaid" },
              invoiceCount: { $sum: 1 },
            },
          },
          { $sort: { revenue: -1 } },
          {
            $lookup: {
              from: "users",
              localField: "_id",
              foreignField: "_id",
              as: "staff",
            },
          },
          { $unwind: "$staff" },
          {
            $project: {
              name: "$staff.name",
              role: "$staff.role",
              revenue: 1,
              invoiceCount: 1,
            },
          },
        ]);

        const totalIncome = revenueByMonth.reduce(
          (acc: number, m: any) => acc + m.revenue,
          0
        );

        data = {
          totalIncome,
          revenueByMonth,
          revenueByItem,
          revenueByStaff,
        };
        break;
      }

      case "expenses": {
        // Expense breakdown
        const expensesByCategory = await Expense.aggregate([
          { $match: { date: { $gte: rangeStart, $lte: rangeEnd } } },
          {
            $group: {
              _id: "$category",
              total: { $sum: "$amount" },
              count: { $sum: 1 },
            },
          },
          { $sort: { total: -1 } },
        ]);

        const expensesByMonth = await Expense.aggregate([
          { $match: { date: { $gte: rangeStart, $lte: rangeEnd } } },
          {
            $group: {
              _id: {
                month: { $month: "$date" },
                year: { $year: "$date" },
              },
              total: { $sum: "$amount" },
              count: { $sum: 1 },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        const expensesByPaymentMethod = await Expense.aggregate([
          { $match: { date: { $gte: rangeStart, $lte: rangeEnd } } },
          {
            $group: {
              _id: "$paymentMethod",
              total: { $sum: "$amount" },
              count: { $sum: 1 },
            },
          },
          { $sort: { total: -1 } },
        ]);

        const totalExpenses = expensesByCategory.reduce(
          (acc: number, c: any) => acc + c.total,
          0
        );

        data = {
          totalExpenses,
          expensesByCategory,
          expensesByMonth,
          expensesByPaymentMethod,
        };
        break;
      }

      default:
        return NextResponse.json(
          {
            success: false,
            error: `Unknown report type: ${type}. Valid types: attendance, performance, pnl, clinical, financial, income, expenses`,
          },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
