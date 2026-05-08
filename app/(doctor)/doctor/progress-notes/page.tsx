"use client";

import { useEffect, useState } from "react";
import { Plus, Heart, Thermometer, Activity } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/Card";
import { format } from "date-fns";

export default function ProgressNotesPage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    patient: "", date: new Date().toISOString().split("T")[0],
    subjective: "", objective: "", assessment: "", plan: "",
    vitals: { bloodPressure: "", pulse: "", temperature: "", weight: "", height: "", spO2: "" }
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [nRes, pRes] = await Promise.all([fetch("/api/progress-notes"), fetch("/api/patients?scope=mine")]);
      const nData = await nRes.json();
      const pData = await pRes.json();
      if (nData.success) setNotes(nData.data);
      if (pData.success) setPatients(pData.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      vitals: {
        bloodPressure: form.vitals.bloodPressure || undefined,
        pulse: form.vitals.pulse ? Number(form.vitals.pulse) : undefined,
        temperature: form.vitals.temperature ? Number(form.vitals.temperature) : undefined,
        weight: form.vitals.weight ? Number(form.vitals.weight) : undefined,
        height: form.vitals.height ? Number(form.vitals.height) : undefined,
        spO2: form.vitals.spO2 ? Number(form.vitals.spO2) : undefined,
      }
    };
    try {
      const res = await fetch("/api/progress-notes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) { setShowModal(false); fetchData(); }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-semibold text-text">Progress Notes (SOAP)</h2>
        <Button onClick={() => setShowModal(true)}><Plus className="mr-2 h-4 w-4" /> New Note</Button>
      </div>

      {loading ? <p className="text-text-muted text-center py-12">Loading...</p> : notes.length === 0 ? <p className="text-text-muted text-center py-12">No notes yet.</p> : (
        <div className="space-y-4">
          {notes.map((note) => (
            <Card key={note._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{note.patient?.firstName} {note.patient?.lastName}</CardTitle>
                    <p className="text-xs text-text-muted mt-0.5">{format(new Date(note.date), "dd MMM yyyy")}</p>
                  </div>
                  {note.vitals && (
                    <div className="flex gap-3 text-xs text-text-muted">
                      {note.vitals.bloodPressure && <span className="flex items-center gap-1"><Heart className="h-3 w-3 text-red-400" />BP: {note.vitals.bloodPressure}</span>}
                      {note.vitals.pulse && <span className="flex items-center gap-1"><Activity className="h-3 w-3 text-blue-400" />Pulse: {note.vitals.pulse}</span>}
                      {note.vitals.temperature && <span className="flex items-center gap-1"><Thermometer className="h-3 w-3 text-orange-400" />{note.vitals.temperature}°F</span>}
                      {note.vitals.spO2 && <span>SpO2: {note.vitals.spO2}%</span>}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-blue-50 rounded-md"><span className="font-semibold text-blue-700 block mb-1">S — Subjective</span><p className="text-text">{note.subjective || "-"}</p></div>
                  <div className="p-3 bg-green-50 rounded-md"><span className="font-semibold text-green-700 block mb-1">O — Objective</span><p className="text-text">{note.objective || "-"}</p></div>
                  <div className="p-3 bg-yellow-50 rounded-md"><span className="font-semibold text-yellow-700 block mb-1">A — Assessment</span><p className="text-text">{note.assessment || "-"}</p></div>
                  <div className="p-3 bg-purple-50 rounded-md"><span className="font-semibold text-purple-700 block mb-1">P — Plan</span><p className="text-text">{note.plan || "-"}</p></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">New SOAP Progress Note</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Patient *</label>
                  <select required value={form.patient} onChange={e => setForm({...form, patient: e.target.value})} className="w-full border rounded p-2 text-sm">
                    <option value="">Select Patient</option>
                    {patients.map(p => <option key={p._id} value={p._id}>{p.firstName} {p.lastName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Date</label>
                  <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full border rounded p-2 text-sm" />
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-sm mb-3">Vital Signs</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div><label className="text-xs text-text-muted">BP (mmHg)</label><input placeholder="120/80" value={form.vitals.bloodPressure} onChange={e => setForm({...form, vitals: {...form.vitals, bloodPressure: e.target.value}})} className="w-full border rounded p-1.5 text-sm mt-1" /></div>
                  <div><label className="text-xs text-text-muted">Pulse (bpm)</label><input type="number" value={form.vitals.pulse} onChange={e => setForm({...form, vitals: {...form.vitals, pulse: e.target.value}})} className="w-full border rounded p-1.5 text-sm mt-1" /></div>
                  <div><label className="text-xs text-text-muted">Temp (°F)</label><input type="number" step="0.1" value={form.vitals.temperature} onChange={e => setForm({...form, vitals: {...form.vitals, temperature: e.target.value}})} className="w-full border rounded p-1.5 text-sm mt-1" /></div>
                  <div><label className="text-xs text-text-muted">Weight (kg)</label><input type="number" step="0.1" value={form.vitals.weight} onChange={e => setForm({...form, vitals: {...form.vitals, weight: e.target.value}})} className="w-full border rounded p-1.5 text-sm mt-1" /></div>
                  <div><label className="text-xs text-text-muted">Height (cm)</label><input type="number" value={form.vitals.height} onChange={e => setForm({...form, vitals: {...form.vitals, height: e.target.value}})} className="w-full border rounded p-1.5 text-sm mt-1" /></div>
                  <div><label className="text-xs text-text-muted">SpO2 (%)</label><input type="number" value={form.vitals.spO2} onChange={e => setForm({...form, vitals: {...form.vitals, spO2: e.target.value}})} className="w-full border rounded p-1.5 text-sm mt-1" /></div>
                </div>
              </div>

              <div><label className="block text-sm font-medium mb-1 text-blue-700">S — Subjective</label><textarea rows={2} placeholder="Patient's symptoms, complaints..." value={form.subjective} onChange={e => setForm({...form, subjective: e.target.value})} className="w-full border rounded p-2 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1 text-green-700">O — Objective</label><textarea rows={2} placeholder="Physical exam findings, test results..." value={form.objective} onChange={e => setForm({...form, objective: e.target.value})} className="w-full border rounded p-2 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1 text-yellow-700">A — Assessment</label><textarea rows={2} placeholder="Diagnosis, clinical assessment..." value={form.assessment} onChange={e => setForm({...form, assessment: e.target.value})} className="w-full border rounded p-2 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1 text-purple-700">P — Plan</label><textarea rows={2} placeholder="Treatment plan, follow-up..." value={form.plan} onChange={e => setForm({...form, plan: e.target.value})} className="w-full border rounded p-2 text-sm" /></div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit">Save Note</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
