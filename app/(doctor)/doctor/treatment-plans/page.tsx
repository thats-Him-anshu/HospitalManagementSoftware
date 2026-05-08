"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/Card";
import { format } from "date-fns";

export default function TreatmentPlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [treatments, setTreatments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({ patient: "", title: "", startDate: new Date().toISOString().split("T")[0], notes: "" });
  const [items, setItems] = useState([{ treatmentName: "", sessions: 1, pricePerSession: 0 }]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [plRes, paRes, trRes] = await Promise.all([fetch("/api/treatment-plans"), fetch("/api/patients?scope=mine"), fetch("/api/treatment-prices")]);
      const plData = await plRes.json();
      const paData = await paRes.json();
      const trData = await trRes.json();
      if (plData.success) setPlans(plData.data);
      if (paData.success) setPatients(paData.data);
      if (trData.success) setTreatments(trData.data.filter((t: any) => t.isActive));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleTreatmentSelect = (index: number, name: string) => {
    const n = [...items];
    n[index].treatmentName = name;
    const match = treatments.find(t => t.treatmentName === name);
    if (match) n[index].pricePerSession = match.price;
    setItems(n);
  };

  const totalCost = items.reduce((acc, i) => acc + i.sessions * i.pricePerSession, 0);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/treatment-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items, totalEstimatedCost: totalCost }),
      });
      const data = await res.json();
      if (data.success) { setShowModal(false); fetchData(); }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-semibold text-text">Treatment Plans</h2>
        <Button onClick={() => setShowModal(true)}><Plus className="mr-2 h-4 w-4" /> New Plan</Button>
      </div>

      {loading ? <p className="text-text-muted text-center py-12">Loading...</p> : plans.length === 0 ? <p className="text-text-muted text-center py-12">No treatment plans yet.</p> : (
        <div className="space-y-4">
          {plans.map((plan) => (
            <Card key={plan._id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">{plan.title}</CardTitle>
                  <p className="text-xs text-text-muted">{plan.patient?.firstName} {plan.patient?.lastName} • Started {format(new Date(plan.startDate), "dd MMM yyyy")}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${plan.status === "active" ? "bg-green-100 text-green-700" : plan.status === "completed" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}>{plan.status}</span>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {plan.items.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center p-2 bg-surface rounded-md text-sm">
                      <span className="font-medium">{item.treatmentName}</span>
                      <span className="text-text-muted">{item.completedSessions}/{item.sessions} sessions • ₹{item.pricePerSession}/session</span>
                    </div>
                  ))}
                  <div className="flex justify-end pt-2 text-sm font-semibold text-primary">Total: ₹{plan.totalEstimatedCost}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">New Treatment Plan</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm mb-1">Patient *</label>
                  <select required value={form.patient} onChange={e => setForm({...form, patient: e.target.value})} className="w-full border rounded p-2 text-sm">
                    <option value="">Select</option>
                    {patients.map(p => <option key={p._id} value={p._id}>{p.firstName} {p.lastName}</option>)}
                  </select></div>
                <div><label className="block text-sm mb-1">Plan Title *</label><input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border rounded p-2 text-sm" placeholder="e.g. 2-Week Detox Plan" /></div>
              </div>
              <div><label className="block text-sm mb-1">Start Date</label><input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} className="w-full border rounded p-2 text-sm" /></div>

              <div className="border rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-sm">Treatments</h4>
                {items.map((item, i) => (
                  <div key={i} className="grid grid-cols-4 gap-2 items-end">
                    <div className="col-span-2">
                      <input list="treatment-list" placeholder="Treatment Name" required value={item.treatmentName} onChange={e => handleTreatmentSelect(i, e.target.value)} className="w-full border rounded p-1.5 text-sm" />
                      <datalist id="treatment-list">{treatments.map(t => <option key={t._id} value={t.treatmentName} />)}</datalist>
                    </div>
                    <input type="number" min={1} placeholder="Sessions" value={item.sessions} onChange={e => { const n = [...items]; n[i].sessions = Number(e.target.value); setItems(n); }} className="border rounded p-1.5 text-sm" />
                    <div className="flex gap-1 items-center">
                      <span className="text-sm text-text-muted">₹{item.pricePerSession}</span>
                      {items.length > 1 && <button type="button" onClick={() => { const n = [...items]; n.splice(i, 1); setItems(n); }} className="text-danger"><Trash2 className="h-4 w-4" /></button>}
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => setItems([...items, { treatmentName: "", sessions: 1, pricePerSession: 0 }])}><Plus className="mr-1 h-3 w-3" /> Add Treatment</Button>
              </div>
              <p className="text-right font-semibold text-primary">Estimated Total: ₹{totalCost}</p>
              <textarea placeholder="Notes" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="w-full border rounded p-2 text-sm" rows={2} />
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit">Save Plan</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
