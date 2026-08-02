"use client";

import { useState, useEffect } from "react";
import { Phone, Search, Clock } from "lucide-react";

interface Lead { _id: string; name: string; phone: string; status: string; notes: string[]; updatedAt: string; }

export default function CallLogPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leads").then(r => r.json()).then(j => { if (j.success) setLeads(j.data); }).finally(() => setLoading(false));
  }, []);

  const filtered = leads.filter(l => !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.phone.includes(search));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-display text-text">Call Log</h1>
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border text-sm" /></div>
      <div className="bg-white rounded-xl border border-border shadow-soft">
        {loading ? <div className="p-8 text-center text-text-muted">Loading...</div> : filtered.length === 0 ? <div className="p-8 text-center text-text-muted">No call records.</div> : (
          <div className="divide-y divide-border">
            {filtered.map(lead => (
              <div key={lead._id} className="p-4 hover:bg-surface/50 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-purple-500" /><span className="font-medium text-text">{lead.name}</span><span className="text-xs text-text-muted">{lead.phone}</span></div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-medium">{lead.status}</span>
                </div>
                {lead.notes.length > 0 && <p className="text-xs text-text-muted ml-7">Last note: {lead.notes[lead.notes.length - 1]}</p>}
                <div className="flex items-center gap-1 text-[10px] text-text-muted ml-7 mt-1"><Clock className="w-3 h-3" />{new Date(lead.updatedAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
