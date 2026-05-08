"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/Card";
import { Input } from "@/components/shared/Input";
import { Trash2, Plus } from "lucide-react";

export default function NewInvoicePage() {
  const router = useRouter();
  const [patients, setPatients] = useState<any[]>([]);
  const [treatmentPrices, setTreatmentPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    patient: "",
    paymentMethod: "cash",
    discount: 0,
    tax: 0,
    amountPaid: 0,
  });

  const [items, setItems] = useState([{ description: "", quantity: 1, unitPrice: 0, total: 0 }]);

  useEffect(() => {
    const fetchPrerequisites = async () => {
      try {
        const [pRes, tRes] = await Promise.all([
          fetch("/api/patients"),
          fetch("/api/treatment-prices")
        ]);
        const pData = await pRes.json();
        const tData = await tRes.json();
        
        if (pData.success) setPatients(pData.data);
        if (tData.success) setTreatmentPrices(tData.data.filter((t: any) => t.isActive));
      } catch (err) {
        console.error(err);
      }
    };
    fetchPrerequisites();
  }, []);

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    
    // Auto calculate total
    if (field === "quantity" || field === "unitPrice") {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }
    
    // Auto fill unit price if description is selected from treatment prices
    if (field === "description") {
      const treatment = treatmentPrices.find(t => t.treatmentName === value);
      if (treatment) {
        newItems[index].unitPrice = treatment.price;
        newItems[index].total = newItems[index].quantity * treatment.price;
      }
    }

    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const subtotal = items.reduce((acc, item) => acc + item.total, 0);
  const totalAmount = subtotal - formData.discount + formData.tax;
  const balance = totalAmount - formData.amountPaid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patient) {
      setError("Please select a patient");
      return;
    }
    if (items.length === 0 || !items[0].description) {
      setError("Please add at least one item");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        items,
        subtotal,
        totalAmount,
      };

      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        router.push("/admin/billing");
      } else {
        setError(data.error || "Failed to create invoice");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-semibold text-text">Create Invoice</h2>
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>

      {error && (
        <div className="p-4 bg-danger/10 text-danger rounded-md border border-danger/20">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-text mb-1">Select Patient *</label>
              <select
                required
                value={formData.patient}
                onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
                className="flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">-- Search & Select Patient --</option>
                {patients.map(p => (
                  <option key={p._id} value={p._id}>{p.firstName} {p.lastName} ({p.patientId})</option>
                ))}
              </select>
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-text mb-1">Payment Method *</label>
              <select
                required
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="card">Credit/Debit Card</option>
                <option value="bank-transfer">Bank Transfer</option>
                <option value="insurance">Insurance</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Line Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-text-muted mb-1">Description</label>
                  <input
                    type="text"
                    required
                    list="treatments"
                    placeholder="Treatment / Medicine"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, "description", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <datalist id="treatments">
                    {treatmentPrices.map(t => (
                      <option key={t._id} value={t.treatmentName} />
                    ))}
                  </datalist>
                </div>
                <div className="w-20">
                  <Input
                    label="Qty"
                    type="number"
                    min={1}
                    required
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                  />
                </div>
                <div className="w-32">
                  <Input
                    label="Unit Price"
                    type="number"
                    min={0}
                    required
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, "unitPrice", Number(e.target.value))}
                  />
                </div>
                <div className="w-32">
                  <Input
                    label="Total"
                    type="number"
                    disabled
                    value={item.total}
                  />
                </div>
                {items.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeItem(index)}
                    className="mt-6 p-2 text-text-muted hover:text-danger transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addItem} className="mt-2">
              <Plus className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="w-full max-w-sm ml-auto space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-text-muted">Subtotal:</span>
                <span className="font-medium text-text">₹ {subtotal}</span>
              </div>
              <div className="flex justify-between items-center text-sm gap-4">
                <span className="font-medium text-text-muted whitespace-nowrap">Discount (₹):</span>
                <input 
                  type="number" 
                  min={0}
                  className="h-8 w-24 text-right rounded border border-border px-2 focus:outline-none"
                  value={formData.discount}
                  onChange={(e) => setFormData({...formData, discount: Number(e.target.value)})}
                />
              </div>
              <div className="flex justify-between items-center text-sm gap-4">
                <span className="font-medium text-text-muted whitespace-nowrap">Tax (₹):</span>
                <input 
                  type="number" 
                  min={0}
                  className="h-8 w-24 text-right rounded border border-border px-2 focus:outline-none"
                  value={formData.tax}
                  onChange={(e) => setFormData({...formData, tax: Number(e.target.value)})}
                />
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-border">
                <span className="font-bold text-text">Total Amount:</span>
                <span className="font-bold text-lg text-primary">₹ {totalAmount}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm gap-4 pt-4">
                <span className="font-medium text-text-muted whitespace-nowrap">Amount Paid (₹):</span>
                <input 
                  type="number" 
                  min={0}
                  className="h-8 w-24 text-right rounded border border-border px-2 focus:outline-none bg-success/10 text-success font-medium"
                  value={formData.amountPaid}
                  onChange={(e) => setFormData({...formData, amountPaid: Number(e.target.value)})}
                />
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-text-muted">Balance Due:</span>
                <span className={`font-medium ${balance > 0 ? 'text-danger' : 'text-success'}`}>
                  ₹ {balance}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button type="submit" size="lg" isLoading={loading}>
            Save Invoice
          </Button>
        </div>
      </form>
    </div>
  );
}
