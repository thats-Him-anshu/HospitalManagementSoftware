"use client";

import { useState, useEffect, useCallback } from "react";
import { Phone, UserPlus, Calendar, TrendingUp, RefreshCw } from "lucide-react";

export default function TelecallerDashboard() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [leadsRes] = await Promise.all([fetch("/api/leads")]);
      const leadsJson = await leadsRes.json();
      if (leadsJson.success) {
        const leads = leadsJson.data || [];
        const today = new Date(); today.setHours(0,0,0,0);
        const todayEnd = new Date(); todayEnd.setHours(23,59,59,999);
        setData({
          totalLeads: leads.length,
          newLeads: leads.filter((l: Record<string, unknown>) => l.status === "new").length,
          followUps: leads.filter((l: Record<string, unknown>) => l.status === "follow-up").length,
          callbacks: leads.filter((l: Record<string, unknown>) => l.status === "callback").length,
          converted: leads.filter((l: Record<string, unknown>) => l.status === "converted").length,
          todayFollowUps: leads.filter((l: Record<string, unknown>) => l.followUpDate && new Date(l.followUpDate as string) >= today && new Date(l.followUpDate as string) <= todayEnd).length,
        });
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <div className="flex items-center justify-center h-96"><RefreshCw className="w-8 h-8 animate-spin text-primary" /></div>;

  const stats = [
    { label: "Total Leads", value: (data?.totalLeads as number) || 0, icon: UserPlus, color: "text-purple-600 bg-purple-50" },
    { label: "New Leads", value: (data?.newLeads as number) || 0, icon: Phone, color: "text-blue-600 bg-blue-50" },
    { label: "Follow Ups", value: (data?.followUps as number) || 0, icon: Calendar, color: "text-orange-600 bg-orange-50" },
    { label: "Converted", value: (data?.converted as number) || 0, icon: TrendingUp, color: "text-green-600 bg-green-50" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-display text-text">Telecaller Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-border p-5 shadow-soft">
            <div className={`p-2.5 rounded-lg w-fit mb-3 ${s.color}`}><s.icon className="w-5 h-5" /></div>
            <div className="text-2xl font-bold text-text">{s.value}</div>
            <div className="text-sm text-text-muted mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      {(data?.todayFollowUps as number) > 0 && (
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
          <p className="text-sm text-orange-800 font-medium">📞 You have {data?.todayFollowUps as number} follow-up(s) scheduled for today!</p>
        </div>
      )}
      {(data?.callbacks as number) > 0 && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-sm text-yellow-800 font-medium">🔔 {data?.callbacks as number} callback(s) pending action.</p>
        </div>
      )}
    </div>
  );
}
