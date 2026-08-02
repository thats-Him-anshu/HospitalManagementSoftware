"use client";

import RoleSidebar from "@/components/shared/RoleSidebar";
import RoleTopNav from "@/components/shared/RoleTopNav";
import { LayoutDashboard, Package, ShoppingCart, TrendingUp, User } from "lucide-react";

const pharmacyNav = [
  { name: "Dashboard", href: "/pharmacy/dashboard", icon: LayoutDashboard },
  { name: "Inventory", href: "/pharmacy/inventory", icon: Package },
  { name: "New Sale", href: "/pharmacy/sales/new", icon: ShoppingCart },
  { name: "Sales History", href: "/pharmacy/sales", icon: TrendingUp },
  { name: "My Profile", href: "/pharmacy/profile", icon: User },
];

export default function PharmacyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      <RoleSidebar navItems={pharmacyNav} accentColor="bg-orange-600" />
      <div className="flex flex-col flex-1 overflow-hidden">
        <RoleTopNav panelTitle="Pharmacy Panel" />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
