"use client";

import { useState, useEffect } from "react";
import { BarChart, Phone, TrendingUp, Calendar } from "lucide-react";

export default function TelecallerReports() {
  const [stats, setStats] = useState({ totalLeads: 0, convertedThisMonth: 0, rate: 0, pendingFollowUps: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leads").then(r => r.json()).then(j => {
      if (j.success) {
        const leads = j.data || [];
        const startOfMonth = new Date(); startOfMonth.setDate(1); startOfMonth.setHours(0,0,0,0);
        const convertedThisMonth = leads.filter((l: Record<string, unknown>) => l.status === "converted" && new Date(l.updatedAt as string) >= startOfMonth).length;
        const pendingFollowUps = leads.filter((l: Record<string, unknown>) => l.status === "follow-up" || l.status === "callback").length;
        setStats({ totalLeads: leads.length, convertedThisMonth, rate: leads.length > 0 ? Math.round((convertedThisMonth / leads.length) * 100) : 0, pendingFollowUps });
      }
    }).finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Total Leads", value: stats.totalLeads, icon: Phone, color: "text-purple-600 bg-purple-50" },
    { label: "Converted This Month", value: stats.convertedThisMonth, icon: TrendingUp, color: "text-green-600 bg-green-50" },
    { label: "Conversion Rate", value: `${stats.rate}%`, icon: BarChart, color: "text-blue-600 bg-blue-50" },
    { label: "Pending Follow Ups", value: stats.pendingFollowUps, icon: Calendar, color: "text-orange-600 bg-orange-50" },
  ];

  if (loading) return <div className="text-center py-20 text-text-muted">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-display text-text">My Reports</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(c => (
          <div key={c.label} className="bg-white rounded-xl border border-border p-5 shadow-soft">
            <div className={`p-2.5 rounded-lg w-fit mb-3 ${c.color}`}><c.icon className="w-5 h-5" /></div>
            <div className="text-2xl font-bold text-text">{c.value}</div>
            <div className="text-sm text-text-muted mt-1">{c.label}</div>
          </div>
        ))}
      </div>
      <p className="text-sm text-text-muted">Detailed analytics and charts coming in Phase 9.</p>
    </div>
  );
}
