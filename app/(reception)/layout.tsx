"use client";

import RoleSidebar from "@/components/shared/RoleSidebar";
import RoleTopNav from "@/components/shared/RoleTopNav";
import { LayoutDashboard, UserPlus, Users, Calendar, Receipt, LogIn, BedDouble, DoorOpen, FileText } from "lucide-react";

const receptionNav = [
  { name: "Dashboard", href: "/reception/dashboard", icon: LayoutDashboard },
  { name: "Leads", href: "/reception/leads", icon: UserPlus },
  { name: "Patients", href: "/reception/patients", icon: Users },
  { name: "Appointments", href: "/reception/appointments", icon: Calendar },
  { name: "Check-In / Out", href: "/reception/checkin", icon: LogIn },
  { name: "Billing", href: "/reception/billing", icon: Receipt },
  { name: "IP/OP Admissions", href: "/reception/ip-op", icon: BedDouble },
  { name: "Rooms & Beds", href: "/reception/rooms", icon: DoorOpen },
  { name: "Daily Report", href: "/reception/daily-report", icon: FileText },
];

export default function ReceptionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      <RoleSidebar navItems={receptionNav} accentColor="bg-teal-600" />
      <div className="flex flex-col flex-1 overflow-hidden">
        <RoleTopNav panelTitle="Receptionist Panel" />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
