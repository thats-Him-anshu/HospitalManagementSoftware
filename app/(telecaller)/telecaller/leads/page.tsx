"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Plus, Phone, Mail, Calendar, X, Save, ChevronRight } from "lucide-react";

const SOURCES = ["website", "walkin", "referral", "google", "facebook", "instagram", "other"];
const STATUSES = ["new", "follow-up", "callback", "booking", "converted", "rejected"];
const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-800", "follow-up": "bg-orange-100 text-orange-800",
  callback: "bg-yellow-100 text-yellow-800", booking: "bg-purple-100 text-purple-800",
  converted: "bg-green-100 text-green-800", rejected: "bg-red-100 text-red-800",
};

interface Lead { _id: string; name: string; phone: string; email?: string; source: string; interest?: string; status: string; notes: string[]; followUpDate?: string; callbackDate?: string; }

export default function TelecallerLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Lead | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", source: "other", interest: "", status: "new", followUpDate: "", callbackDate: "", notes: "" });

  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch("/api/leads");
      const json = await res.json();
      if (json.success) setLeads(json.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const filtered = leads.filter(l => {
    const matchSearch = !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.phone.includes(search);
    const matchStatus = !statusFilter || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openAdd = () => { setEditing(null); setForm({ name: "", phone: "", email: "", source: "other", interest: "", status: "new", followUpDate: "", callbackDate: "", notes: "" }); setShowModal(true); };
  const openEdit = (lead: Lead) => { setEditing(lead); setForm({ name: lead.name, phone: lead.phone, email: lead.email || "", source: lead.source, interest: lead.interest || "", status: lead.status, followUpDate: lead.followUpDate ? lead.followUpDate.split("T")[0] : "", callbackDate: lead.callbackDate ? lead.callbackDate.split("T")[0] : "", notes: "" }); setShowModal(true); };

  const handleSave = async () => {
    try {
      const body: Record<string, unknown> = { ...form };
      if (form.notes) body.notes = editing ? [...(editing.notes || []), form.notes] : [form.notes];
      else body.notes = editing?.notes || [];
      if (!form.followUpDate) delete body.followUpDate;
      if (!form.callbackDate) delete body.callbackDate;

      const url = editing ? `/api/leads/${editing._id}` : "/api/leads";
      const method = editing ? "PUT" : "POST";
      await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      setShowModal(false); fetchLeads();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-display text-text">Lead Management</h1>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90"><Plus className="w-4 h-4" /> Add Lead</button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or phone..." className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2.5 rounded-lg border border-border text-sm">
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Name</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Contact</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Source</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Status</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Follow Up</th>
              <th className="text-center px-4 py-3 font-medium text-text-muted">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={6} className="text-center py-8 text-text-muted">Loading...</td></tr>
            : filtered.length === 0 ? <tr><td colSpan={6} className="text-center py-8 text-text-muted">No leads found.</td></tr>
            : filtered.map(lead => (
              <tr key={lead._id} className="border-b border-border hover:bg-surface/50">
                <td className="px-4 py-3 font-medium text-text">{lead.name}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-text-muted"><Phone className="w-3 h-3" /> {lead.phone}</div>
                  {lead.email && <div className="flex items-center gap-1.5 text-text-muted text-xs mt-0.5"><Mail className="w-3 h-3" /> {lead.email}</div>}
                </td>
                <td className="px-4 py-3 text-text-muted capitalize">{lead.source}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[lead.status] || "bg-gray-100 text-gray-800"}`}>{lead.status}</span></td>
                <td className="px-4 py-3 text-text-muted text-xs">{lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString() : "—"}</td>
                <td className="px-4 py-3 text-center"><button onClick={() => openEdit(lead)} className="p-1.5 hover:bg-surface rounded"><ChevronRight className="w-4 h-4 text-text-muted" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-semibold text-text">{editing ? "Update Lead" : "Add New Lead"}</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-text-muted" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-text-muted block mb-1">Name *</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border text-sm" /></div>
                <div><label className="text-sm font-medium text-text-muted block mb-1">Phone *</label><input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border text-sm" /></div>
              </div>
              <div><label className="text-sm font-medium text-text-muted block mb-1">Email</label><input value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border text-sm" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-text-muted block mb-1">Source</label><select value={form.source} onChange={e => setForm({...form, source: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border text-sm">{SOURCES.map(s => <option key={s}>{s}</option>)}</select></div>
                <div><label className="text-sm font-medium text-text-muted block mb-1">Status</label><select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border text-sm">{STATUSES.map(s => <option key={s}>{s}</option>)}</select></div>
              </div>
              <div><label className="text-sm font-medium text-text-muted block mb-1">Interest</label><input value={form.interest} onChange={e => setForm({...form, interest: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border text-sm" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-text-muted block mb-1">Follow Up Date</label><input type="date" value={form.followUpDate} onChange={e => setForm({...form, followUpDate: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border text-sm" /></div>
                <div><label className="text-sm font-medium text-text-muted block mb-1">Callback Date</label><input type="date" value={form.callbackDate} onChange={e => setForm({...form, callbackDate: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border text-sm" /></div>
              </div>
              <div><label className="text-sm font-medium text-text-muted block mb-1">Add Note</label><textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={2} placeholder="Add a call note..." className="w-full px-3 py-2 rounded-lg border border-border text-sm" /></div>
              {editing && editing.notes.length > 0 && (
                <div className="bg-surface rounded-lg p-3"><p className="text-xs font-medium text-text-muted mb-1">Previous Notes:</p>{editing.notes.map((n, i) => <p key={i} className="text-xs text-text-muted">• {n}</p>)}</div>
              )}
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-border">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-text-muted">Cancel</button>
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"><Save className="w-4 h-4" /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
