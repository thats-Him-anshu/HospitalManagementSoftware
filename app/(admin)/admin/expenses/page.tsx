"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/shared/Card";
import { format } from "date-fns";

export default function ExpensesPage() {
  const [activeTab, setActiveTab] = useState("log"); // log, vendors, budget, pl, summary
  
  // States
  const [expenses, setExpenses] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Forms
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [expenseForm, setExpenseForm] = useState({ date: new Date().toISOString().split('T')[0], category: "", amount: "", vendor: "", paymentMethod: "cash", notes: "" });
  const [vendorForm, setVendorForm] = useState({ name: "", category: "", phone: "", contactPerson: "" });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [expRes, venRes] = await Promise.all([
        fetch("/api/expenses"),
        fetch("/api/vendors")
      ]);
      const expData = await expRes.json();
      const venData = await venRes.json();
      if (expData.success) setExpenses(expData.data);
      if (venData.success) setVendors(venData.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount || 0);
  };

  // Handlers
  const handleSaveExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...expenseForm, amount: Number(expenseForm.amount) }),
      });
      if (res.ok) {
        setShowExpenseModal(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vendorForm),
      });
      if (res.ok) {
        setShowVendorModal(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm("Delete this expense?")) return;
    await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    fetchData();
  };

  const handleDeleteVendor = async (id: string) => {
    if (!confirm("Delete this vendor?")) return;
    await fetch(`/api/vendors/${id}`, { method: "DELETE" });
    fetchData();
  };

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-semibold text-text">Expense Management</h2>
          <p className="text-sm text-text-muted mt-1">Track hospital expenses and vendors</p>
        </div>
        <div className="flex gap-2">
          {activeTab === "log" && (
            <Button onClick={() => setShowExpenseModal(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Expense
            </Button>
          )}
          {activeTab === "vendors" && (
            <Button onClick={() => setShowVendorModal(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Vendor
            </Button>
          )}
        </div>
      </div>

      <div className="flex space-x-1 rounded-xl bg-surface p-1">
        {[
          { id: "log", name: "Expense Log" },
          { id: "vendors", name: "Vendors" },
          { id: "budget", name: "Budget Tracker" },
          { id: "pl", name: "P&L Statement" },
          { id: "summary", name: "Financial Summary" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-colors
              ${activeTab === tab.id 
                ? 'bg-white text-primary shadow' 
                : 'text-text-muted hover:bg-white/[0.12] hover:text-text'}`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      <Card className="p-6 min-h-[500px]">
        {loading ? (
          <div className="text-center py-12 text-text-muted">Loading data...</div>
        ) : (
          <>
            {activeTab === "log" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-surface border-b border-border">
                    <tr>
                      <th className="px-4 py-3 font-medium text-text-muted">Date</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Category</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Vendor</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Amount</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Method</th>
                      <th className="px-4 py-3 font-medium text-text-muted text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {expenses.map((exp) => (
                      <tr key={exp._id}>
                        <td className="px-4 py-3">{format(new Date(exp.date), "dd MMM yyyy")}</td>
                        <td className="px-4 py-3">{exp.category}</td>
                        <td className="px-4 py-3">{exp.vendor?.name || "-"}</td>
                        <td className="px-4 py-3 font-medium">{formatCurrency(exp.amount)}</td>
                        <td className="px-4 py-3 capitalize">{exp.paymentMethod}</td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => handleDeleteExpense(exp._id)} className="text-danger hover:text-danger-dark">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "vendors" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {vendors.map((vendor) => (
                  <div key={vendor._id} className="border border-border rounded-lg p-4 relative">
                    <button onClick={() => handleDeleteVendor(vendor._id)} className="absolute top-4 right-4 text-text-muted hover:text-danger">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <h3 className="font-semibold text-text">{vendor.name}</h3>
                    <p className="text-sm text-text-muted mb-2">{vendor.category}</p>
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium">Contact:</span> {vendor.contactPerson || "-"}</p>
                      <p><span className="font-medium">Phone:</span> {vendor.phone || "-"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "budget" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-surface p-4 rounded-lg border border-border">
                    <h3 className="text-sm font-medium text-text-muted">Total Budget (Monthly)</h3>
                    <p className="text-2xl font-bold mt-1 text-text">{formatCurrency(500000)}</p>
                  </div>
                  <div className="bg-surface p-4 rounded-lg border border-border">
                    <h3 className="text-sm font-medium text-text-muted">Spent So Far</h3>
                    <p className="text-2xl font-bold mt-1 text-danger">{formatCurrency(totalExpenses)}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Budget Utilization</span>
                    <span>{((totalExpenses / 500000) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-surface rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${Math.min((totalExpenses / 500000) * 100, 100)}%` }}></div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "pl" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Profit & Loss Statement</h3>
                <p className="text-text-muted text-sm">Note: Full Revenue tracking will be available in the Admin Financial Reports page. This is a simplified P&L based on expenses.</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-danger/10 border border-danger/20 rounded-lg">
                    <div className="flex items-center gap-2 text-danger mb-2">
                      <TrendingDown className="h-5 w-5" />
                      <span className="font-semibold">Total Expenses</span>
                    </div>
                    <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
                  </div>
                  <div className="p-4 bg-success/10 border border-success/20 rounded-lg opacity-50">
                    <div className="flex items-center gap-2 text-success mb-2">
                      <TrendingUp className="h-5 w-5" />
                      <span className="font-semibold">Total Revenue (Pending)</span>
                    </div>
                    <div className="text-2xl font-bold">---</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "summary" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Financial Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border border-border rounded-lg">
                    <div className="text-text-muted text-sm mb-1">Top Expense Category</div>
                    <div className="text-xl font-bold">Medical Supplies</div>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <div className="text-text-muted text-sm mb-1">Average Daily Spend</div>
                    <div className="text-xl font-bold">{formatCurrency(totalExpenses / 30)}</div>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <div className="text-text-muted text-sm mb-1">Active Vendors</div>
                    <div className="text-xl font-bold">{vendors.length}</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Modals for Adding */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Add Expense</h3>
            <form onSubmit={handleSaveExpense} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Date</label>
                <input type="date" required value={expenseForm.date} onChange={e => setExpenseForm({...expenseForm, date: e.target.value})} className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">Category</label>
                <input type="text" required value={expenseForm.category} onChange={e => setExpenseForm({...expenseForm, category: e.target.value})} className="w-full border rounded p-2" placeholder="e.g. Electricity, Maintenance" />
              </div>
              <div>
                <label className="block text-sm mb-1">Amount</label>
                <input type="number" required value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})} className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">Vendor (Optional)</label>
                <select value={expenseForm.vendor} onChange={e => setExpenseForm({...expenseForm, vendor: e.target.value})} className="w-full border rounded p-2">
                  <option value="">Select Vendor</option>
                  {vendors.map(v => <option key={v._id} value={v._id}>{v.name}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setShowExpenseModal(false)}>Cancel</Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showVendorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Add Vendor</h3>
            <form onSubmit={handleSaveVendor} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input type="text" required value={vendorForm.name} onChange={e => setVendorForm({...vendorForm, name: e.target.value})} className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">Category</label>
                <input type="text" required value={vendorForm.category} onChange={e => setVendorForm({...vendorForm, category: e.target.value})} className="w-full border rounded p-2" placeholder="e.g. Pharmacy Supplier" />
              </div>
              <div>
                <label className="block text-sm mb-1">Contact Person</label>
                <input type="text" value={vendorForm.contactPerson} onChange={e => setVendorForm({...vendorForm, contactPerson: e.target.value})} className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">Phone</label>
                <input type="text" value={vendorForm.phone} onChange={e => setVendorForm({...vendorForm, phone: e.target.value})} className="w-full border rounded p-2" />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setShowVendorModal(false)}>Cancel</Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
