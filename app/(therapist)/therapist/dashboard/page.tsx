"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/shared/Card";
import { ClipboardList, Users, CheckCircle } from "lucide-react";

export default function TherapistDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function f() {
      try {
        const res = await fetch("/api/therapist/dashboard");
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    f();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>;

  const stats = [
    { title: "Today's Sessions", value: data?.todaySessions || 0, icon: ClipboardList, color: "text-green-600", bg: "bg-green-100" },
    { title: "Active Patients", value: data?.activePatients || 0, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Completed This Week", value: data?.weekCompleted || 0, icon: CheckCircle, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-semibold text-text">Therapist Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
    </div>
  );
}
