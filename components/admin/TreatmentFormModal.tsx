"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";

interface TreatmentPrice {
  _id?: string;
  treatmentName: string;
  category: string;
  description?: string;
  duration?: number;
  price: number;
  isActive: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  initialData?: TreatmentPrice | null;
}

export default function TreatmentFormModal({ isOpen, onClose, onSave, initialData }: Props) {
  const [formData, setFormData] = useState<TreatmentPrice>({
    treatmentName: "",
    category: "",
    description: "",
    duration: 0,
    price: 0,
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        treatmentName: "",
        category: "",
        description: "",
        duration: 0,
        price: 0,
        isActive: true,
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = initialData?._id
        ? `/api/treatment-prices/${initialData._id}`
        : "/api/treatment-prices";
      
      const method = initialData?._id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        onSave();
        onClose();
      } else {
        setError(data.error || "Failed to save treatment");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-display font-semibold text-text">
          {initialData ? "Edit Treatment" : "Add New Treatment"}
        </h2>
        
        {error && <div className="mb-4 text-sm text-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Treatment Name *"
            required
            value={formData.treatmentName}
            onChange={(e) => setFormData({ ...formData, treatmentName: e.target.value })}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Category *"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
            <Input
              label="Price (₹) *"
              type="number"
              required
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Duration (minutes)"
              type="number"
              min="0"
              value={formData.duration || ""}
              onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
            />
            <div className="flex flex-col justify-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-text">Active</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="block text-sm font-medium text-text mb-1">
              Description / Notes
            </label>
            <textarea
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              rows={3}
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={loading}>
              Save Treatment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
