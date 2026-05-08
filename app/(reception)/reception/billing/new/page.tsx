"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/Card";
import { Input } from "@/components/shared/Input";
import { Trash2, Plus } from "lucide-react";

export default function ReceptionNewInvoicePage() {
  const router = useRouter();
  const [patients, setPatients] = useState<any[]>([]);
  const [treatmentPrices, setTreatmentPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ patient: "", paymentMethod: "cash", discount: 0, tax: 0, amountPaid: 0 });
  const [items, setItems] = useState([{ description: "", quantity: 1, unitPrice: 0, total: 0 }]);

  useEffect(() => {
    async function f() {
      const [pRes, tRes] = await Promise.all([fetch("/api/patients"), fetch("/api/treatment-prices")]);
      const pData = await pRes.json();
      const tData = await tRes.json();
      if (pData.success) setPatients(pData.data);
      if (tData.success) setTreatmentPrices(tData.data.filter((t: any) => t.isActive));
    }
    f();
  }, []);

  const handleItemChange = (index: number, field: string, value: any) => {
    const n = [...items];
    (n[index] as any)[field] = value;
    if (field === "quantity" || field === "unitPrice") n[index].total = n[index].quantity * n[index].unitPrice;
    if (field === "description") {
      const t = treatmentPrices.find(t => t.treatmentName === value);
      if (t) { n[index].unitPrice = t.price; n[index].total = n[index].quantity * t.price; }
    }
    setItems(n);
  };

  const subtotal = items.reduce((a, i) => a + i.total, 0);
  const totalAmount = subtotal - formData.discount + formData.tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/invoices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...formData, items, subtotal, totalAmount }) });
      const data = await res.json();
      if (data.success) router.push("/reception/billing");
      else setError(data.error || "Failed");
    } catch (err) { setError("Network error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <h2 className="text-2xl font-display font-semibold text-text">Create Invoice</h2>
      {error && <div className="p-4 bg-danger/10 text-danger rounded-md">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card><CardHeader><CardTitle>Details</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Patient *</label>
              <select required value={formData.patient} onChange={e => setFormData({...formData, patient: e.target.value})} className="flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm">
                <option value="">Select</option>{patients.map(p => <option key={p._id} value={p._id}>{p.firstName} {p.lastName} ({p.patientId})</option>)}
              </select></div>
            <div><label className="block text-sm font-medium mb-1">Payment Method</label>
              <select value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} className="flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm">
                <option value="cash">Cash</option><option value="UPI">UPI</option><option value="card">Card</option><option value="bank-transfer">Bank Transfer</option>
              </select></div>
          </CardContent></Card>
        <Card><CardHeader><CardTitle>Line Items</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {items.map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="flex-1"><input type="text" required list="tx" placeholder="Treatment" value={item.description} onChange={e => handleItemChange(i, "description", e.target.value)} className="flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm" /><datalist id="tx">{treatmentPrices.map(t => <option key={t._id} value={t.treatmentName} />)}</datalist></div>
                <div className="w-20"><Input label="Qty" type="number" min={1} value={item.quantity} onChange={e => handleItemChange(i, "quantity", Number(e.target.value))} /></div>
                <div className="w-28"><Input label="Price" type="number" value={item.unitPrice} onChange={e => handleItemChange(i, "unitPrice", Number(e.target.value))} /></div>
                <div className="w-28"><Input label="Total" type="number" disabled value={item.total} /></div>
                {items.length > 1 && <button type="button" onClick={() => { const n = [...items]; n.splice(i, 1); setItems(n); }} className="mt-6 text-danger"><Trash2 className="h-5 w-5" /></button>}
              </div>))}
            <Button type="button" variant="outline" size="sm" onClick={() => setItems([...items, { description: "", quantity: 1, unitPrice: 0, total: 0 }])}><Plus className="mr-2 h-4 w-4" /> Add Item</Button>
          </CardContent></Card>
        <Card><CardContent className="p-6">
          <div className="w-full max-w-sm ml-auto space-y-3">
            <div className="flex justify-between text-sm"><span className="text-text-muted">Subtotal:</span><span>₹ {subtotal}</span></div>
            <div className="flex justify-between text-sm items-center gap-4"><span className="text-text-muted">Discount:</span><input type="number" min={0} className="h-8 w-24 text-right rounded border px-2" value={formData.discount} onChange={e => setFormData({...formData, discount: Number(e.target.value)})} /></div>
            <div className="flex justify-between items-center pt-3 border-t"><span className="font-bold">Total:</span><span className="font-bold text-lg text-primary">₹ {totalAmount}</span></div>
            <div className="flex justify-between items-center gap-4"><span className="text-text-muted">Paid:</span><input type="number" min={0} className="h-8 w-24 text-right rounded border px-2" value={formData.amountPaid} onChange={e => setFormData({...formData, amountPaid: Number(e.target.value)})} /></div>
          </div>
        </CardContent></Card>
        <div className="flex justify-end"><Button type="submit" size="lg" isLoading={loading}>Save Invoice</Button></div>
      </form>
    </div>
  );
}
