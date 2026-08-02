"use client";

import { useState, useEffect, useCallback } from "react";
import { Package, Plus, Search, AlertTriangle, Edit2, Trash2, X, Save } from "lucide-react";

const CATEGORIES = ["Herbal Supplements", "Acupuncture Supplies", "Oils & Extracts", "Yoga Props", "Other"];
const UNITS = ["tablet", "ml", "piece", "bottle"];

interface Product {
  _id: string; name: string; category: string; description?: string; unit: string;
  purchasePrice: number; sellingPrice: number; stock: number; reorderLevel: number;
  manufacturer?: string; isActive: boolean;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [showLowStock, setShowLowStock] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: "", category: CATEGORIES[0], description: "", unit: UNITS[0], purchasePrice: 0, sellingPrice: 0, stock: 0, reorderLevel: 10, manufacturer: "" });

  const fetchProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (catFilter) params.set("category", catFilter);
      if (showLowStock) params.set("lowStock", "true");
      const res = await fetch(`/api/products?${params}`);
      const json = await res.json();
      if (json.success) setProducts(json.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [search, catFilter, showLowStock]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const openAdd = () => { setEditing(null); setForm({ name: "", category: CATEGORIES[0], description: "", unit: UNITS[0], purchasePrice: 0, sellingPrice: 0, stock: 0, reorderLevel: 10, manufacturer: "" }); setShowModal(true); };
  const openEdit = (p: Product) => { setEditing(p); setForm({ name: p.name, category: p.category, description: p.description || "", unit: p.unit, purchasePrice: p.purchasePrice, sellingPrice: p.sellingPrice, stock: p.stock, reorderLevel: p.reorderLevel, manufacturer: p.manufacturer || "" }); setShowModal(true); };

  const handleSave = async () => {
    try {
      const url = editing ? `/api/products/${editing._id}` : "/api/products";
      const method = editing ? "PUT" : "POST";
      await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      setShowModal(false); fetchProducts();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  const lowStockCount = products.filter(p => p.stock <= p.reorderLevel).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-display text-text">Product Inventory</h1>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {lowStockCount > 0 && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <span className="text-sm text-red-800 font-medium">{lowStockCount} product(s) below reorder level!</span>
          <button onClick={() => setShowLowStock(!showLowStock)} className="ml-auto text-xs text-red-600 underline">{showLowStock ? "Show All" : "Show Low Stock"}</button>
        </div>
      )}

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="px-3 py-2.5 rounded-lg border border-border text-sm">
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Product</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Category</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Unit</th>
              <th className="text-right px-4 py-3 font-medium text-text-muted">Purchase ₹</th>
              <th className="text-right px-4 py-3 font-medium text-text-muted">Selling ₹</th>
              <th className="text-right px-4 py-3 font-medium text-text-muted">Stock</th>
              <th className="text-right px-4 py-3 font-medium text-text-muted">Reorder</th>
              <th className="text-center px-4 py-3 font-medium text-text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="text-center py-8 text-text-muted">Loading...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-8 text-text-muted">No products found.</td></tr>
            ) : products.map((p) => (
              <tr key={p._id} className="border-b border-border hover:bg-surface/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-text">{p.name}</div>
                  {p.manufacturer && <div className="text-xs text-text-muted">{p.manufacturer}</div>}
                </td>
                <td className="px-4 py-3 text-text-muted">{p.category}</td>
                <td className="px-4 py-3 text-text-muted">{p.unit}</td>
                <td className="px-4 py-3 text-right">₹{p.purchasePrice}</td>
                <td className="px-4 py-3 text-right">₹{p.sellingPrice}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`font-medium ${p.stock <= p.reorderLevel ? "text-red-600" : "text-text"}`}>{p.stock}</span>
                  {p.stock <= p.reorderLevel && <span className="ml-1.5 text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-medium">Low</span>}
                </td>
                <td className="px-4 py-3 text-right text-text-muted">{p.reorderLevel}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-surface rounded transition-colors"><Edit2 className="w-3.5 h-3.5 text-text-muted" /></button>
                    <button onClick={() => handleDelete(p._id)} className="p-1.5 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-semibold text-text">{editing ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-text-muted" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div><label className="text-sm font-medium text-text-muted block mb-1">Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-text-muted block mb-1">Category</label><select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border text-sm">{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                <div><label className="text-sm font-medium text-text-muted block mb-1">Unit</label><select value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border text-sm">{UNITS.map(u => <option key={u} value={u}>{u}</option>)}</select></div>
              </div>
              <div><label className="text-sm font-medium text-text-muted block mb-1">Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-text-muted block mb-1">Purchase Price ₹</label><input type="number" value={form.purchasePrice} onChange={e => setForm({ ...form, purchasePrice: +e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border text-sm" /></div>
                <div><label className="text-sm font-medium text-text-muted block mb-1">Selling Price ₹</label><input type="number" value={form.sellingPrice} onChange={e => setForm({ ...form, sellingPrice: +e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-text-muted block mb-1">Stock</label><input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: +e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border text-sm" /></div>
                <div><label className="text-sm font-medium text-text-muted block mb-1">Reorder Level</label><input type="number" value={form.reorderLevel} onChange={e => setForm({ ...form, reorderLevel: +e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border text-sm" /></div>
              </div>
              <div><label className="text-sm font-medium text-text-muted block mb-1">Manufacturer</label><input value={form.manufacturer} onChange={e => setForm({ ...form, manufacturer: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border text-sm" /></div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-border">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-text-muted hover:text-text transition-colors">Cancel</button>
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"><Save className="w-4 h-4" /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
