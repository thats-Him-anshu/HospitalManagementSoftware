"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/shared/Card";
import { Calendar, UserPlus, Users, IndianRupee } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/shared/Button";

export default function ReceptionDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function f() {
      try {
        const res = await fetch("/api/reception/dashboard");
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    f();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div></div>;

  const stats = [
    { title: "Today's Appointments", value: data?.todayAppointments || 0, icon: Calendar, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "New Leads Today", value: data?.newLeadsToday || 0, icon: UserPlus, color: "text-orange-600", bg: "bg-orange-100" },
    { title: "New Patients Today", value: data?.todayPatients || 0, icon: Users, color: "text-teal-600", bg: "bg-teal-100" },
    { title: "Pending Payments", value: data?.pendingPayments || 0, icon: IndianRupee, color: "text-red-600", bg: "bg-red-100" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-semibold text-text">Receptionist Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-4 rounded-full ${stat.bg}`}><stat.icon className={`h-6 w-6 ${stat.color}`} /></div>
              <div>
                <p className="text-sm font-medium text-text-muted">{stat.title}</p>
                <h3 className="text-2xl font-bold text-text mt-1">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/reception/patients/new"><Button className="w-full justify-center h-14 text-base" variant="outline"><Users className="mr-2 h-5 w-5" /> Register Patient</Button></Link>
        <Link href="/reception/appointments"><Button className="w-full justify-center h-14 text-base" variant="outline"><Calendar className="mr-2 h-5 w-5" /> Book Appointment</Button></Link>
        <Link href="/reception/billing/new"><Button className="w-full justify-center h-14 text-base" variant="outline"><IndianRupee className="mr-2 h-5 w-5" /> Create Invoice</Button></Link>
      </div>
    </div>
  );
}
