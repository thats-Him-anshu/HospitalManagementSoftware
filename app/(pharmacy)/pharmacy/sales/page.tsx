"use client";

import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";

interface Sale { _id: string; patient?: { firstName: string; lastName: string }; items: Array<Record<string, unknown>>; totalAmount: number; paymentMethod: string; createdAt: string; }

export default function SalesHistory() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pharmacy-sales").then(r => r.json()).then(j => { if (j.success) setSales(j.data); }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-display text-text">Sales History</h1>
      <div className="bg-white rounded-xl border border-border shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface border-b border-border"><tr><th className="text-left px-4 py-3 font-medium text-text-muted">Date</th><th className="text-left px-4 py-3 font-medium text-text-muted">Patient</th><th className="text-right px-4 py-3 font-medium text-text-muted">Items</th><th className="text-right px-4 py-3 font-medium text-text-muted">Amount</th><th className="text-left px-4 py-3 font-medium text-text-muted">Payment</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={5} className="text-center py-8 text-text-muted">Loading...</td></tr> : sales.length === 0 ? <tr><td colSpan={5} className="text-center py-8 text-text-muted"><ShoppingCart className="w-8 h-8 mx-auto mb-2 text-text-muted" />No sales yet.</td></tr> : sales.map(s => (
              <tr key={s._id} className="border-b border-border hover:bg-surface/50">
                <td className="px-4 py-3 text-text-muted">{new Date(s.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 font-medium text-text">{s.patient ? `${s.patient.firstName} ${s.patient.lastName}` : "Walk-in"}</td>
                <td className="px-4 py-3 text-right">{s.items.length}</td>
                <td className="px-4 py-3 text-right font-medium">₹{s.totalAmount.toLocaleString()}</td>
                <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-surface font-medium capitalize">{s.paymentMethod}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
