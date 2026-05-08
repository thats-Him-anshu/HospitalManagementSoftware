"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pill, Salad, FlaskConical } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/Card";
import { format } from "date-fns";

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({ patient: "", dietaryAdvice: "", generalInstructions: "", followUpDate: "" });
  const [items, setItems] = useState([{ name: "", type: "medicine" as const, dosage: "", frequency: "", duration: "", instructions: "" }]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, patRes] = await Promise.all([
        fetch("/api/prescriptions"),
        fetch("/api/patients?scope=mine")
      ]);
      const pData = await pRes.json();
      const patData = await patRes.json();
      if (pData.success) setPrescriptions(pData.data);
      if (patData.success) setPatients(patData.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const addItem = () => setItems([...items, { name: "", type: "medicine", dosage: "", frequency: "", duration: "", instructions: "" }]);
  const removeItem = (i: number) => { const n = [...items]; n.splice(i, 1); setItems(n); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items }),
      });
      const data = await res.json();
      if (data.success) { setShowModal(false); fetchData(); }
    } catch (e) { console.error(e); }
  };

  const getTypeIcon = (type: string) => {
    if (type === "medicine") return <Pill className="h-3.5 w-3.5 text-blue-500" />;
    if (type === "supplement") return <FlaskConical className="h-3.5 w-3.5 text-purple-500" />;
    return <Salad className="h-3.5 w-3.5 text-green-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-semibold text-text">Prescriptions</h2>
        <Button onClick={() => setShowModal(true)}><Plus className="mr-2 h-4 w-4" /> New Prescription</Button>
      </div>

      {loading ? <p className="text-text-muted text-center py-12">Loading...</p> : prescriptions.length === 0 ? <p className="text-text-muted text-center py-12">No prescriptions yet.</p> : (
        <div className="space-y-4">
          {prescriptions.map((rx) => (
            <Card key={rx._id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">{rx.patient?.firstName} {rx.patient?.lastName}</CardTitle>
                  <p className="text-xs text-text-muted mt-0.5">{format(new Date(rx.createdAt), "dd MMM yyyy, hh:mm a")}</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {rx.items.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-sm p-2 bg-surface rounded-md">
                      {getTypeIcon(item.type)}
                      <span className="font-medium">{item.name}</span>
                      {item.dosage && <span className="text-text-muted">• {item.dosage}</span>}
                      {item.frequency && <span className="text-text-muted">• {item.frequency}</span>}
                      {item.duration && <span className="text-text-muted">• {item.duration}</span>}
                    </div>
                  ))}
                  {rx.dietaryAdvice && <p className="text-sm mt-2"><span className="font-medium">Diet:</span> {rx.dietaryAdvice}</p>}
                  {rx.generalInstructions && <p className="text-sm"><span className="font-medium">Notes:</span> {rx.generalInstructions}</p>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">New Prescription</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Patient *</label>
                <select required value={form.patient} onChange={e => setForm({...form, patient: e.target.value})} className="w-full border rounded p-2 text-sm">
                  <option value="">Select Patient</option>
                  {patients.map(p => <option key={p._id} value={p._id}>{p.firstName} {p.lastName} ({p.patientId})</option>)}
                </select>
              </div>

              <div className="border rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-sm">Items</h4>
                {items.map((item, i) => (
                  <div key={i} className="grid grid-cols-6 gap-2 items-end">
                    <input placeholder="Name" required value={item.name} onChange={e => { const n = [...items]; n[i].name = e.target.value; setItems(n); }} className="col-span-2 border rounded p-1.5 text-sm" />
                    <select value={item.type} onChange={e => { const n = [...items]; n[i].type = e.target.value as any; setItems(n); }} className="border rounded p-1.5 text-sm">
                      <option value="medicine">Medicine</option>
                      <option value="supplement">Supplement</option>
                      <option value="dietary">Dietary</option>
                    </select>
                    <input placeholder="Dosage" value={item.dosage} onChange={e => { const n = [...items]; n[i].dosage = e.target.value; setItems(n); }} className="border rounded p-1.5 text-sm" />
                    <input placeholder="Frequency" value={item.frequency} onChange={e => { const n = [...items]; n[i].frequency = e.target.value; setItems(n); }} className="border rounded p-1.5 text-sm" />
                    <div className="flex gap-1">
                      <input placeholder="Duration" value={item.duration} onChange={e => { const n = [...items]; n[i].duration = e.target.value; setItems(n); }} className="flex-1 border rounded p-1.5 text-sm" />
                      {items.length > 1 && <button type="button" onClick={() => removeItem(i)} className="text-danger"><Trash2 className="h-4 w-4" /></button>}
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addItem}><Plus className="mr-1 h-3 w-3" /> Add Item</Button>
              </div>

              <textarea placeholder="Dietary Advice" value={form.dietaryAdvice} onChange={e => setForm({...form, dietaryAdvice: e.target.value})} className="w-full border rounded p-2 text-sm" rows={2} />
              <textarea placeholder="General Instructions" value={form.generalInstructions} onChange={e => setForm({...form, generalInstructions: e.target.value})} className="w-full border rounded p-2 text-sm" rows={2} />

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit">Save Prescription</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
