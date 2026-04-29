"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { Card } from "@/components/shared/Card";
import TreatmentFormModal from "@/components/admin/TreatmentFormModal";

export default function TreatmentPricingPage() {
  const [treatments, setTreatments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<any>(null);

  const fetchTreatments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/treatment-prices?search=${search}`);
      const data = await res.json();
      if (data.success) {
        setTreatments(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTreatments();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this treatment?")) return;
    try {
      const res = await fetch(`/api/treatment-prices/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchTreatments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (treatment: any) => {
    setEditingTreatment(treatment);
    setIsModalOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-display font-semibold text-text">
          Treatment Pricing
        </h2>
        <Button onClick={() => { setEditingTreatment(null); setIsModalOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Treatment
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Search className="h-5 w-5 text-text-muted" />
          <input
            type="text"
            placeholder="Search treatments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-none focus:outline-none text-sm"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface border-b border-border text-text-muted">
              <tr>
                <th className="px-6 py-4 font-medium">Treatment Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Duration</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-text-muted">
                    Loading treatments...
                  </td>
                </tr>
              ) : treatments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-text-muted">
                    No treatments found.
                  </td>
                </tr>
              ) : (
                treatments.map((t) => (
                  <tr key={t._id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-text">{t.treatmentName}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono font-medium">{formatCurrency(t.price)}</td>
                    <td className="px-6 py-4 text-text-muted">
                      {t.duration ? `${t.duration} mins` : "-"}
                    </td>
                    <td className="px-6 py-4">
                      {t.isActive ? (
                        <span className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-danger/10 px-2.5 py-0.5 text-xs font-medium text-danger">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(t)}
                          className="p-1.5 text-text-muted hover:text-primary transition-colors rounded-md hover:bg-surface"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(t._id)}
                          className="p-1.5 text-text-muted hover:text-danger transition-colors rounded-md hover:bg-danger/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <TreatmentFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={fetchTreatments}
        initialData={editingTreatment}
      />
    </div>
  );
}
