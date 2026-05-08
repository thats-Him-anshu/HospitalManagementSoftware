"use client";

import RoleSidebar from "@/components/shared/RoleSidebar";
import RoleTopNav from "@/components/shared/RoleTopNav";
import { LayoutDashboard, Calendar, Users, FileText, ClipboardList, Pill } from "lucide-react";

const doctorNav = [
  { name: "Dashboard", href: "/doctor/dashboard", icon: LayoutDashboard },
  { name: "My Appointments", href: "/doctor/appointments", icon: Calendar },
  { name: "My Patients", href: "/doctor/patients", icon: Users },
  { name: "Prescriptions", href: "/doctor/prescriptions", icon: Pill },
  { name: "Progress Notes", href: "/doctor/progress-notes", icon: ClipboardList },
  { name: "Treatment Plans", href: "/doctor/treatment-plans", icon: FileText },
];

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      <RoleSidebar navItems={doctorNav} accentColor="bg-blue-600" />
      <div className="flex flex-col flex-1 overflow-hidden">
        <RoleTopNav panelTitle="Doctor Panel" />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
