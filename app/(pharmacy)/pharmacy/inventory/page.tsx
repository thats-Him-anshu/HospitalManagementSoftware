"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Edit2, X, Save } from "lucide-react";

interface Product { _id: string; name: string; category: string; unit: string; stock: number; reorderLevel: number; sellingPrice: number; }

export default function PharmacyInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState(0);

  const fetchProducts = useCallback(async () => {
    const res = await fetch(`/api/products${search ? `?search=${search}` : ""}`);
    const json = await res.json();
    if (json.success) setProducts(json.data);
    setLoading(false);
  }, [search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateStock = async () => {
    if (!editId) return;
    await fetch(`/api/products/${editId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stock: editStock }) });
    setEditId(null); fetchProducts();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-display text-text">Inventory</h1>
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border text-sm" /></div>
      <div className="bg-white rounded-xl border border-border shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface border-b border-border"><tr><th className="text-left px-4 py-3 font-medium text-text-muted">Product</th><th className="text-left px-4 py-3 font-medium text-text-muted">Category</th><th className="text-left px-4 py-3 font-medium text-text-muted">Unit</th><th className="text-right px-4 py-3 font-medium text-text-muted">Stock</th><th className="text-right px-4 py-3 font-medium text-text-muted">Reorder</th><th className="text-right px-4 py-3 font-medium text-text-muted">Price ₹</th><th className="text-center px-4 py-3 font-medium text-text-muted">Action</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={7} className="text-center py-8 text-text-muted">Loading...</td></tr> : products.length === 0 ? <tr><td colSpan={7} className="text-center py-8 text-text-muted">No products.</td></tr> : products.map(p => (
              <tr key={p._id} className="border-b border-border hover:bg-surface/50">
                <td className="px-4 py-3 font-medium text-text">{p.name}</td>
                <td className="px-4 py-3 text-text-muted">{p.category}</td>
                <td className="px-4 py-3 text-text-muted">{p.unit}</td>
                <td className="px-4 py-3 text-right"><span className={p.stock <= p.reorderLevel ? "text-red-600 font-medium" : "text-text"}>{p.stock}</span></td>
                <td className="px-4 py-3 text-right text-text-muted">{p.reorderLevel}</td>
                <td className="px-4 py-3 text-right">₹{p.sellingPrice}</td>
                <td className="px-4 py-3 text-center"><button onClick={() => { setEditId(p._id); setEditStock(p.stock); }} className="p-1.5 hover:bg-surface rounded"><Edit2 className="w-3.5 h-3.5 text-text-muted" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-5">
            <div className="flex items-center justify-between mb-4"><h2 className="font-semibold text-text">Update Stock</h2><button onClick={() => setEditId(null)}><X className="w-5 h-5 text-text-muted" /></button></div>
            <input type="number" value={editStock} onChange={e => setEditStock(+e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border text-sm mb-4" />
            <div className="flex justify-end gap-3"><button onClick={() => setEditId(null)} className="px-4 py-2 text-sm text-text-muted">Cancel</button><button onClick={updateStock} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"><Save className="w-4 h-4" /> Save</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
