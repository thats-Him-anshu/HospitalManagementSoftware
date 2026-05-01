"use client";

import { useEffect, useState } from "react";
import { Plus, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/shared/Button";
import LeadModal from "@/components/admin/LeadModal";
import LeadKanbanBoard from "@/components/admin/LeadKanbanBoard";

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<any>(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      if (data.success) {
        setLeads(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchLeads(); // Refresh to ensure sync
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleEdit = (lead: any) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-display font-semibold text-text">Lead Management</h2>
          <p className="text-sm text-text-muted mt-1">Track and convert inquiries into patients</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-surface rounded-md p-1 border border-border">
            <button
              onClick={() => setViewMode("kanban")}
              className={`p-1.5 rounded text-sm flex items-center transition-colors ${viewMode === "kanban" ? "bg-white shadow-sm font-medium text-text" : "text-text-muted hover:text-text"}`}
            >
              <LayoutGrid className="h-4 w-4 mr-1" /> Board
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded text-sm flex items-center transition-colors ${viewMode === "table" ? "bg-white shadow-sm font-medium text-text" : "text-text-muted hover:text-text"}`}
            >
              <List className="h-4 w-4 mr-1" /> Table
            </button>
          </div>
          <Button onClick={() => { setEditingLead(null); setIsModalOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> Add Lead
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {loading && leads.length === 0 ? (
          <div className="flex items-center justify-center h-full">Loading leads...</div>
        ) : (
          <>
            {viewMode === "kanban" ? (
              <LeadKanbanBoard 
                leads={leads} 
                onStatusChange={handleStatusChange} 
                onEdit={handleEdit} 
              />
            ) : (
              <div className="bg-white rounded-lg border border-border overflow-hidden h-full flex flex-col">
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-surface border-b border-border sticky top-0">
                      <tr>
                        <th className="px-6 py-4 font-medium text-text-muted">Name</th>
                        <th className="px-6 py-4 font-medium text-text-muted">Contact</th>
                        <th className="px-6 py-4 font-medium text-text-muted">Source</th>
                        <th className="px-6 py-4 font-medium text-text-muted">Interest</th>
                        <th className="px-6 py-4 font-medium text-text-muted">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {leads.map((lead) => (
                        <tr key={lead._id} onClick={() => handleEdit(lead)} className="hover:bg-surface/50 cursor-pointer transition-colors">
                          <td className="px-6 py-4 font-medium text-text">{lead.name}</td>
                          <td className="px-6 py-4 text-text-muted">
                            {lead.phone} <br/> <span className="text-xs">{lead.email}</span>
                          </td>
                          <td className="px-6 py-4 capitalize text-text-muted">{lead.source}</td>
                          <td className="px-6 py-4 text-text-muted truncate max-w-[200px]">{lead.interest || "-"}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize
                              ${lead.status === 'new' ? 'bg-blue-100 text-blue-800' : 
                                lead.status === 'contacted' ? 'bg-purple-100 text-purple-800' :
                                lead.status === 'converted' ? 'bg-green-100 text-green-800' :
                                lead.status === 'lost' ? 'bg-red-100 text-red-800' :
                                'bg-orange-100 text-orange-800'
                              }
                            `}>
                              {lead.status.replace('-', ' ')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={fetchLeads}
        initialData={editingLead}
      />
    </div>
  );
}
