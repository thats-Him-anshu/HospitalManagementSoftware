"use client";

import RoleSidebar from "@/components/shared/RoleSidebar";
import RoleTopNav from "@/components/shared/RoleTopNav";
import { LayoutDashboard, UserPlus, Phone, Calendar, ClipboardList, User } from "lucide-react";

const telecallerNav = [
  { name: "Dashboard", href: "/telecaller/dashboard", icon: LayoutDashboard },
  { name: "Lead Management", href: "/telecaller/leads", icon: UserPlus },
  { name: "Call Log", href: "/telecaller/calls", icon: Phone },
  { name: "Follow Ups", href: "/telecaller/follow-ups", icon: Calendar },
  { name: "Reports", href: "/telecaller/reports", icon: ClipboardList },
  { name: "My Profile", href: "/telecaller/profile", icon: User },
];

export default function TelecallerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      <RoleSidebar navItems={telecallerNav} accentColor="bg-purple-600" />
      <div className="flex flex-col flex-1 overflow-hidden">
        <RoleTopNav panelTitle="Telecaller Panel" />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
