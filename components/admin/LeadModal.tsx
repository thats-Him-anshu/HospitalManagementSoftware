"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";

interface Lead {
  _id?: string;
  name: string;
  phone: string;
  email?: string;
  source: string;
  interest?: string;
  status: string;
  notes?: string[];
  newNote?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  initialData?: Lead | null;
}

export default function LeadModal({ isOpen, onClose, onSave, initialData }: Props) {
  const [formData, setFormData] = useState<Lead>({
    name: "",
    phone: "",
    email: "",
    source: "walkin",
    interest: "",
    status: "new",
    newNote: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData, newNote: "" });
    } else {
      setFormData({
        name: "",
        phone: "",
        email: "",
        source: "walkin",
        interest: "",
        status: "new",
        newNote: "",
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = initialData?._id ? `/api/leads/${initialData._id}` : "/api/leads";
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
        setError(data.error || "Failed to save lead");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl my-8">
        <h2 className="mb-4 text-xl font-display font-semibold text-text">
          {initialData ? "Edit Lead" : "Add New Lead"}
        </h2>
        
        {error && <div className="mb-4 text-sm text-danger bg-danger/10 p-3 rounded-md">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name *"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Phone *"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={formData.email || ""}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-text mb-1">Source *</label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="walkin">Walk-in</option>
                <option value="website">Website</option>
                <option value="referral">Referral</option>
                <option value="google">Google</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-text mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="follow-up">Follow-up</option>
                <option value="converted">Converted (Patient)</option>
                <option value="lost">Lost</option>
              </select>
            </div>
          </div>

          <Input
            label="Interested In (Treatment / Condition)"
            value={formData.interest || ""}
            onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
          />

          <div className="flex flex-col">
            <label className="block text-sm font-medium text-text mb-1">
              Add Note
            </label>
            <textarea
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              rows={2}
              value={formData.newNote || ""}
              onChange={(e) => setFormData({ ...formData, newNote: e.target.value })}
              placeholder="e.g. Called them today, requested callback tomorrow..."
            />
          </div>

          {initialData?.notes && initialData.notes.length > 0 && (
            <div className="mt-4 p-3 bg-surface rounded-md">
              <p className="text-xs font-semibold text-text-muted uppercase mb-2">Previous Notes</p>
              <ul className="text-sm space-y-1 text-text list-disc list-inside">
                {initialData.notes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={loading}>
              Save Lead
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
