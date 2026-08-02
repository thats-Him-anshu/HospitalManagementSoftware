"use client";

import { useState, useEffect } from "react";
import { Calendar, Phone, AlertTriangle, Clock, CheckCircle } from "lucide-react";

interface Lead { _id: string; name: string; phone: string; status: string; followUpDate?: string; }

export default function FollowUpsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leads").then(r => r.json()).then(j => { if (j.success) setLeads(j.data.filter((l: Lead) => l.followUpDate)); }).finally(() => setLoading(false));
  }, []);

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayEnd = new Date(); todayEnd.setHours(23, 59, 59, 999);

  const overdue = leads.filter(l => new Date(l.followUpDate!) < today);
  const todayList = leads.filter(l => { const d = new Date(l.followUpDate!); return d >= today && d <= todayEnd; });
  const upcoming = leads.filter(l => new Date(l.followUpDate!) > todayEnd);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/leads/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    const res = await fetch("/api/leads"); const json = await res.json();
    if (json.success) setLeads(json.data.filter((l: Lead) => l.followUpDate));
  };

  const Section = ({ title, items, color, icon: Icon }: { title: string; items: Lead[]; color: string; icon: React.ElementType }) => (
    <div className="bg-white rounded-xl border border-border shadow-soft">
      <div className={`flex items-center gap-2 p-4 border-b border-border ${color}`}><Icon className="w-4 h-4" /><h2 className="font-semibold text-sm">{title} ({items.length})</h2></div>
      {items.length === 0 ? <div className="p-4 text-sm text-text-muted">None</div> : (
        <div className="divide-y divide-border">
          {items.map(l => (
            <div key={l._id} className="p-4 flex items-center justify-between">
              <div><div className="font-medium text-text text-sm">{l.name}</div><div className="flex items-center gap-1.5 text-xs text-text-muted"><Phone className="w-3 h-3" />{l.phone}</div><div className="text-xs text-text-muted mt-0.5">{new Date(l.followUpDate!).toLocaleDateString()}</div></div>
              <div className="flex gap-2">
                <button onClick={() => updateStatus(l._id, "follow-up")} className="text-xs px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100">Reschedule</button>
                <button onClick={() => updateStatus(l._id, "converted")} className="text-xs px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100">Convert</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (loading) return <div className="text-center py-20 text-text-muted">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-display text-text">Follow Ups</h1>
      <Section title="Overdue" items={overdue} color="text-red-700" icon={AlertTriangle} />
      <Section title="Today" items={todayList} color="text-orange-700" icon={Clock} />
      <Section title="Upcoming" items={upcoming} color="text-green-700" icon={CheckCircle} />
    </div>
  );
}
