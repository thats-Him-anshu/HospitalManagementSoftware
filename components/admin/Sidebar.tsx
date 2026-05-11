"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Calendar, 
  BedDouble, 
  Stethoscope, 
  IndianRupee, 
  Settings, 
  FileText,
  LogOut,
  Receipt,
  Wallet,
  BarChart,
  CalendarCheck,
  ClipboardList,
  Activity
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Leads", href: "/admin/leads", icon: UserPlus },
  { name: "Patients", href: "/admin/patients", icon: Users },
  { name: "Appointments", href: "/admin/appointments", icon: Calendar },
  { name: "IP/OP Management", href: "/admin/ip-op", icon: BedDouble },
  { name: "Rooms & Beds", href: "/admin/rooms", icon: BedDouble },
  { name: "Doctors & Staff", href: "/admin/staff", icon: Stethoscope },
  { name: "Attendance", href: "/admin/attendance", icon: CalendarCheck },
  { name: "Billing & Invoices", href: "/admin/billing", icon: Receipt },
  { name: "Expenses", href: "/admin/expenses", icon: Wallet },
  { name: "Reports", href: "/admin/reports", icon: BarChart },
  { name: "Reception Report", href: "/admin/reception-report", icon: ClipboardList },
  { name: "IP/OP Report", href: "/admin/ip-op-report", icon: Activity },
  { name: "Treatment Pricing", href: "/admin/treatment-pricing", icon: IndianRupee },
  { name: "CMS Manager", href: "/admin/cms", icon: FileText },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-bg-dark text-white shadow-lg">
      <div className="flex h-20 items-center justify-center border-b border-white/10 px-6">
        <div className="relative w-full h-12">
          {/* Logo uses absolute path to public/assets/logo.png */}
          <Image
            src="/assets/logo.png"
            alt="NIDARSANAM HEALTH CARE"
            fill
            className="object-contain" 
            priority
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
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
