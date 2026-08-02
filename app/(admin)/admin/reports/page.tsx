"use client";

import Link from "next/link";
import {
  Activity, ClipboardList, TrendingUp, DollarSign,
  Heart, PieChart, Receipt, Wallet,
} from "lucide-react";

const reportPages = [
  { name: "Live Operations", href: "/admin/reports/live", icon: Activity, desc: "Real-time staff and patient operations", color: "bg-blue-50 text-blue-600" },
  { name: "Attendance Report", href: "/admin/reports/attendance", icon: ClipboardList, desc: "Staff attendance heatmap and summary", color: "bg-green-50 text-green-600" },
  { name: "Performance Report", href: "/admin/reports/performance", icon: TrendingUp, desc: "Per-staff performance metrics", color: "bg-purple-50 text-purple-600" },
  { name: "Profit & Loss", href: "/admin/reports/pnl", icon: DollarSign, desc: "Revenue vs expenses statement", color: "bg-amber-50 text-amber-600" },
  { name: "Clinical IP/OP", href: "/admin/reports/clinical", icon: Heart, desc: "Inpatient and outpatient analytics", color: "bg-red-50 text-red-600" },
  { name: "Financial Summary", href: "/admin/reports/financial-summary", icon: PieChart, desc: "Live financial snapshot and charts", color: "bg-teal-50 text-teal-600" },
  { name: "Income Report", href: "/admin/reports/income", icon: Receipt, desc: "Revenue breakdown and trends", color: "bg-indigo-50 text-indigo-600" },
  { name: "Expense Report", href: "/admin/reports/expenses", icon: Wallet, desc: "Expense analysis and comparison", color: "bg-orange-50 text-orange-600" },
];

export default function ReportsHub() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-display text-text">Reports</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {reportPages.map((report) => (
          <Link
            key={report.name}
            href={report.href}
            className="group bg-white rounded-xl border border-border p-5 shadow-soft hover:shadow-md transition-all hover:border-primary/30"
          >
            <div className={`w-11 h-11 rounded-lg flex items-center justify-center mb-4 ${report.color}`}>
              <report.icon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-text group-hover:text-primary transition-colors">{report.name}</h3>
            <p className="text-sm text-text-muted mt-1">{report.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
