"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/Card";
import { Calendar, Users, BedDouble, CheckCircle, Clock } from "lucide-react";
import { format } from "date-fns";

export default function DoctorDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/doctor/dashboard");
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  const stats = [
    { title: "Today's Appointments", value: data?.todayAppointments || 0, icon: Calendar, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Active IP Patients", value: data?.activeIPPatients || 0, icon: BedDouble, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "Completed This Week", value: data?.weekCompleted || 0, icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-semibold text-text">Doctor Dashboard</h2>

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

      <Card>
        <CardHeader><CardTitle>Today&apos;s Appointments</CardTitle></CardHeader>
        <CardContent>
          {(data?.recentAppointments || []).length === 0 ? (
            <p className="text-text-muted text-sm py-4 text-center">No appointments today.</p>
          ) : (
            <div className="space-y-3">
              {data.recentAppointments.map((apt: any) => (
                <div key={apt._id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-surface/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-full"><Users className="h-4 w-4 text-blue-600" /></div>
                    <div>
                      <p className="font-medium text-text">{apt.patient?.firstName} {apt.patient?.lastName}</p>
                      <p className="text-xs text-text-muted">{apt.patient?.patientId} • {apt.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-text-muted"><Clock className="h-3.5 w-3.5" />{apt.timeSlot}</div>
                    <span className={`text-xs capitalize px-2 py-0.5 rounded-full mt-1 inline-block ${apt.status === "completed" ? "bg-green-100 text-green-700" : apt.status === "confirmed" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}>{apt.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
