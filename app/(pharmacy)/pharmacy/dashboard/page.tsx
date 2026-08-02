"use client";

import { useState, useEffect } from "react";
import { Package, AlertTriangle, ShoppingCart, TrendingUp, RefreshCw } from "lucide-react";

export default function PharmacyDashboard() {
  const [data, setData] = useState<Record<string, number>>({ total: 0, lowStock: 0, todaySales: 0, monthRevenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetch("/api/products"), fetch("/api/pharmacy-sales")]).then(async ([pRes, sRes]) => {
      const [pJson, sJson] = await Promise.all([pRes.json(), sRes.json()]);
      const products = pJson.success ? pJson.data : [];
      const sales = sJson.success ? sJson.data : [];
      const today = new Date(); today.setHours(0,0,0,0);
      const startOfMonth = new Date(); startOfMonth.setDate(1); startOfMonth.setHours(0,0,0,0);
      setData({
        total: products.length,
        lowStock: products.filter((p: Record<string, number>) => p.stock <= p.reorderLevel).length,
        todaySales: sales.filter((s: Record<string, string>) => new Date(s.createdAt) >= today).length,
        monthRevenue: sales.filter((s: Record<string, string>) => new Date(s.createdAt) >= startOfMonth).reduce((sum: number, s: Record<string, number>) => sum + (s.totalAmount || 0), 0),
      });
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-96"><RefreshCw className="w-8 h-8 animate-spin text-primary" /></div>;

  const cards = [
    { label: "Total Products", value: data.total, icon: Package, color: "text-blue-600 bg-blue-50" },
    { label: "Low Stock Items", value: data.lowStock, icon: AlertTriangle, color: "text-red-600 bg-red-50" },
    { label: "Today's Sales", value: data.todaySales, icon: ShoppingCart, color: "text-green-600 bg-green-50" },
    { label: "Month Revenue", value: `₹${data.monthRevenue.toLocaleString()}`, icon: TrendingUp, color: "text-orange-600 bg-orange-50" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-display text-text">Pharmacy Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(c => (
          <div key={c.label} className="bg-white rounded-xl border border-border p-5 shadow-soft">
            <div className={`p-2.5 rounded-lg w-fit mb-3 ${c.color}`}><c.icon className="w-5 h-5" /></div>
            <div className="text-2xl font-bold text-text">{c.value}</div>
            <div className="text-sm text-text-muted mt-1">{c.label}</div>
          </div>
        ))}
      </div>
      {data.lowStock > 0 && <div className="p-4 bg-red-50 border border-red-200 rounded-xl"><p className="text-sm text-red-800 font-medium">⚠️ {data.lowStock} product(s) below reorder level. Check inventory.</p></div>}
    </div>
  );
}
