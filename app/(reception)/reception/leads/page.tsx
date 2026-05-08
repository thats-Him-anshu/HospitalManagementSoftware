"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import LeadModal from "@/components/admin/LeadModal";

export default function ReceptionLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<any>(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      if (data.success) setLeads(data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLeads(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    await fetch(`/api/leads/${id}`, { method: "DELETE" });
    fetchLeads();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-semibold text-text">Leads</h2>
        <Button onClick={() => { setEditingLead(null); setIsModalOpen(true); }}><Plus className="mr-2 h-4 w-4" /> Add Lead</Button>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium text-text-muted">Name</th>
                <th className="px-6 py-4 font-medium text-text-muted">Phone</th>
                <th className="px-6 py-4 font-medium text-text-muted">Source</th>
                <th className="px-6 py-4 font-medium text-text-muted">Status</th>
                <th className="px-6 py-4 font-medium text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? <tr><td colSpan={5} className="text-center py-12 text-text-muted">Loading...</td></tr> :
              leads.length === 0 ? <tr><td colSpan={5} className="text-center py-12 text-text-muted">No leads.</td></tr> :
              leads.map(l => (
                <tr key={l._id} className="hover:bg-surface/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{l.name}</td>
                  <td className="px-6 py-4 text-text-muted">{l.phone}</td>
                  <td className="px-6 py-4 capitalize">{l.source}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${l.status === "converted" ? "bg-green-100 text-green-700" : l.status === "lost" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>{l.status}</span></td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => { setEditingLead(l); setIsModalOpen(true); }} className="p-1.5 text-text-muted hover:text-primary"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(l._id)} className="p-1.5 text-text-muted hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <LeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={fetchLeads} initialData={editingLead} />
    </div>
  );
}
