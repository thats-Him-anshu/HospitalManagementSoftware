"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import {
  LayoutDashboard, UserPlus, IndianRupee, BarChart, Package,
  Users, FileText, Wallet, BookOpen, LogOut, User, ChevronDown,
  Activity, ClipboardList, TrendingUp, DollarSign, Heart,
  PieChart, Receipt, Stethoscope,
} from "lucide-react";
import { signOut } from "next-auth/react";

const reportSubItems = [
  { name: "Live Operations", href: "/admin/reports/live", icon: Activity },
  { name: "Attendance", href: "/admin/reports/attendance", icon: ClipboardList },
  { name: "Performance", href: "/admin/reports/performance", icon: TrendingUp },
  { name: "Profit & Loss", href: "/admin/reports/pnl", icon: DollarSign },
  { name: "Clinical IP/OP", href: "/admin/reports/clinical", icon: Heart },
  { name: "Financial Summary", href: "/admin/reports/financial-summary", icon: PieChart },
  { name: "Income Report", href: "/admin/reports/income", icon: Receipt },
  { name: "Expense Report", href: "/admin/reports/expenses", icon: Wallet },
];

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Lead Management", href: "/admin/leads", icon: UserPlus },
  { name: "Treatment Catalog", href: "/admin/treatment-pricing", icon: IndianRupee },
  { name: "Reports", href: "/admin/reports", icon: BarChart, subItems: reportSubItems },
  { name: "Product Inventory", href: "/admin/inventory", icon: Package },
  { name: "Staff Management", href: "/admin/staff", icon: Stethoscope },
  { name: "Blog Manager", href: "/admin/cms", icon: FileText, match: "/admin/cms" },
  { name: "Expense Management", href: "/admin/expenses", icon: Wallet },
  { name: "Diet & Yoga Templates", href: "/admin/templates", icon: BookOpen },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [reportsOpen, setReportsOpen] = useState(pathname.startsWith("/admin/reports"));

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-bg-dark text-white shadow-lg">
      <div className="flex h-20 items-center justify-center border-b border-white/10 px-6">
        <div className="relative w-full h-12">
          <Image
            src="/assets/logo.png"
            alt="NIDARSANAM HEALTH CARE"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const hasSubItems = item.subItems && item.subItems.length > 0;

          if (hasSubItems) {
            return (
              <div key={item.name}>
                <button
                  onClick={() => setReportsOpen(!reportsOpen)}
                  className={`flex w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? "bg-primary text-white" : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${reportsOpen ? "rotate-180" : ""}`} />
                </button>
                {reportsOpen && (
                  <div className="ml-4 mt-0.5 space-y-0.5 border-l border-white/10 pl-3">
                    {item.subItems!.map((sub) => {
                      const subActive = pathname === sub.href;
                      return (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                            subActive ? "bg-primary/80 text-white" : "text-white/60 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <sub.icon className="h-3.5 w-3.5" />
                          {sub.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? "bg-primary text-white" : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3 space-y-0.5">
        <Link
          href="/admin/profile"
          className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            pathname === "/admin/profile" ? "bg-primary text-white" : "text-white/80 hover:bg-white/10"
          }`}
        >
          <User className="h-5 w-5" />
          My Profile
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white/80 hover:bg-danger hover:text-white transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
