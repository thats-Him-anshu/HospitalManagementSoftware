"use client";

import RoleSidebar from "@/components/shared/RoleSidebar";
import RoleTopNav from "@/components/shared/RoleTopNav";
import { LayoutDashboard, ClipboardList, Users, CalendarCheck } from "lucide-react";

const therapistNav = [
  { name: "Dashboard", href: "/therapist/dashboard", icon: LayoutDashboard },
  { name: "My Sessions", href: "/therapist/sessions", icon: ClipboardList },
  { name: "My Attendance", href: "/therapist/attendance", icon: CalendarCheck },
];

export default function TherapistLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      <RoleSidebar navItems={therapistNav} accentColor="bg-green-600" />
      <div className="flex flex-col flex-1 overflow-hidden">
        <RoleTopNav panelTitle="Therapist Panel" />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
