"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { CheckCircle, MessageSquare } from "lucide-react";
import { format } from "date-fns";

export default function TherapistSessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [noteModalId, setNoteModalId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/therapy-sessions");
      const data = await res.json();
      if (data.success) setSessions(data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSessions(); }, []);

  const handleComplete = async (id: string) => {
    try {
      const res = await fetch(`/api/therapy-sessions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
      if (res.ok) fetchSessions();
    } catch (e) { console.error(e); }
  };

  const handleSaveNote = async () => {
    if (!noteModalId) return;
    try {
      const res = await fetch(`/api/therapy-sessions/${noteModalId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completionNotes: noteText, status: "completed" }),
      });
      if (res.ok) { setNoteModalId(null); setNoteText(""); fetchSessions(); }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-semibold text-text">My Sessions</h2>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium text-text-muted">Patient</th>
                <th className="px-6 py-4 font-medium text-text-muted">Date & Time</th>
                <th className="px-6 py-4 font-medium text-text-muted">Treatment</th>
                <th className="px-6 py-4 font-medium text-text-muted">Status</th>
                <th className="px-6 py-4 font-medium text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? <tr><td colSpan={5} className="text-center py-12 text-text-muted">Loading...</td></tr> :
              sessions.length === 0 ? <tr><td colSpan={5} className="text-center py-12 text-text-muted">No sessions assigned.</td></tr> :
              sessions.map(s => (
                <tr key={s._id} className="hover:bg-surface/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium">{s.patient?.firstName} {s.patient?.lastName}</div>
                    <div className="text-xs text-text-muted">{s.patient?.patientId}</div>
                  </td>
                  <td className="px-6 py-4 text-text-muted">{format(new Date(s.date), "dd MMM yyyy")} • {s.timeSlot}</td>
                  <td className="px-6 py-4">{s.treatmentType}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs capitalize font-medium ${s.status === "completed" ? "bg-green-100 text-green-700" : s.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>{s.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {s.status !== "completed" && s.status !== "cancelled" && (
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleComplete(s._id)} className="p-1.5 text-text-muted hover:text-green-600 transition-colors" title="Mark Completed"><CheckCircle className="h-4 w-4" /></button>
                        <button onClick={() => { setNoteModalId(s._id); setNoteText(s.completionNotes || ""); }} className="p-1.5 text-text-muted hover:text-blue-600 transition-colors" title="Add Notes & Complete"><MessageSquare className="h-4 w-4" /></button>
                      </div>
                    )}
                    {s.status === "completed" && s.completionNotes && (
                      <span className="text-xs text-text-muted italic" title={s.completionNotes}>Notes ✓</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {noteModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Complete Session & Add Notes</h3>
            <textarea rows={4} placeholder="Session notes, observations, patient response..." value={noteText} onChange={e => setNoteText(e.target.value)} className="w-full border rounded p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50" />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setNoteModalId(null)}>Cancel</Button>
              <Button onClick={handleSaveNote} className="bg-green-600 hover:bg-green-700">Complete Session</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
