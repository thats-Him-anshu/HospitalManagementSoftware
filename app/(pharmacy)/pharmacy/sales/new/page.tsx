"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Plus, Trash2, Search } from "lucide-react";

interface Product { _id: string; name: string; unit: string; sellingPrice: number; stock: number; }
interface CartItem { product: string; productName: string; quantity: number; unitPrice: number; total: number; }

export default function NewSalePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [patientSearch, setPatientSearch] = useState("");
  const [patients, setPatients] = useState<Array<{ _id: string; firstName: string; lastName: string; phone: string }>>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => { fetch("/api/products").then(r => r.json()).then(j => { if (j.success) setProducts(j.data); }); }, []);

  useEffect(() => {
    if (patientSearch.length >= 2) {
      fetch(`/api/patients?search=${patientSearch}`).then(r => r.json()).then(j => { if (j.success) setPatients(j.data); });
    } else { setPatients([]); }
  }, [patientSearch]);

  const addToCart = (productId: string) => {
    const p = products.find(x => x._id === productId);
    if (!p) return;
    const existing = cart.find(c => c.product === productId);
    if (existing) {
      setCart(cart.map(c => c.product === productId ? { ...c, quantity: c.quantity + 1, total: (c.quantity + 1) * c.unitPrice } : c));
    } else {
      setCart([...cart, { product: productId, productName: p.name, quantity: 1, unitPrice: p.sellingPrice, total: p.sellingPrice }]);
    }
  };

  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) { setCart(cart.filter(c => c.product !== productId)); return; }
    setCart(cart.map(c => c.product === productId ? { ...c, quantity: qty, total: qty * c.unitPrice } : c));
  };

  const grandTotal = cart.reduce((s, c) => s + c.total, 0);

  const handleSubmit = async () => {
    if (cart.length === 0) return;
    setSubmitting(true);
    try {
      const body = {
        patient: selectedPatient || undefined,
        items: cart.map(c => ({ product: c.product, quantity: c.quantity, unitPrice: c.unitPrice, total: c.total })),
        totalAmount: grandTotal,
        paymentMethod,
      };
      const res = await fetch("/api/pharmacy-sales", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const json = await res.json();
      if (json.success) { setSuccess(true); setCart([]); setSelectedPatient(""); }
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-display text-text">New Sale</h1>
      {success && <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800 font-medium">✅ Sale recorded successfully!</div>}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-border p-5 shadow-soft">
            <h2 className="font-semibold text-text mb-3">Add Products</h2>
            <select onChange={e => { if (e.target.value) addToCart(e.target.value); e.target.value = ""; }} className="w-full px-3 py-2.5 rounded-lg border border-border text-sm">
              <option value="">Select product...</option>
              {products.filter(p => p.stock > 0).map(p => <option key={p._id} value={p._id}>{p.name} (₹{p.sellingPrice} • Stock: {p.stock})</option>)}
            </select>
          </div>

          {cart.length > 0 && (
            <div className="bg-white rounded-xl border border-border shadow-soft overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-surface border-b border-border"><tr><th className="text-left px-4 py-3 font-medium text-text-muted">Product</th><th className="text-center px-4 py-3 font-medium text-text-muted">Qty</th><th className="text-right px-4 py-3 font-medium text-text-muted">Price</th><th className="text-right px-4 py-3 font-medium text-text-muted">Total</th><th className="px-4 py-3"></th></tr></thead>
                <tbody>
                  {cart.map(c => (
                    <tr key={c.product} className="border-b border-border">
                      <td className="px-4 py-3 font-medium text-text">{c.productName}</td>
                      <td className="px-4 py-3 text-center"><input type="number" value={c.quantity} onChange={e => updateQty(c.product, +e.target.value)} min={0} className="w-16 text-center px-2 py-1 rounded border border-border text-sm" /></td>
                      <td className="px-4 py-3 text-right text-text-muted">₹{c.unitPrice}</td>
                      <td className="px-4 py-3 text-right font-medium">₹{c.total}</td>
                      <td className="px-4 py-3 text-center"><button onClick={() => updateQty(c.product, 0)}><Trash2 className="w-3.5 h-3.5 text-red-500" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-border p-5 shadow-soft">
            <h2 className="font-semibold text-text mb-3">Patient (Optional)</h2>
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" /><input value={patientSearch} onChange={e => setPatientSearch(e.target.value)} placeholder="Search patient..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-border text-sm" /></div>
            {patients.length > 0 && (
              <div className="mt-2 border border-border rounded-lg max-h-32 overflow-y-auto">
                {patients.map(p => (
                  <button key={p._id} onClick={() => { setSelectedPatient(p._id); setPatientSearch(`${p.firstName} ${p.lastName}`); setPatients([]); }} className="w-full text-left px-3 py-2 text-sm hover:bg-surface border-b border-border last:border-0">
                    {p.firstName} {p.lastName} — {p.phone}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-border p-5 shadow-soft">
            <h2 className="font-semibold text-text mb-3">Payment</h2>
            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border text-sm mb-4">
              <option value="cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="card">Card</option>
            </select>
            <div className="flex items-center justify-between mb-4"><span className="text-text-muted">Grand Total</span><span className="text-xl font-bold text-text">₹{grandTotal.toLocaleString()}</span></div>
            <button onClick={handleSubmit} disabled={cart.length === 0 || submitting} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
              <ShoppingCart className="w-4 h-4" /> {submitting ? "Processing..." : "Complete Sale"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
