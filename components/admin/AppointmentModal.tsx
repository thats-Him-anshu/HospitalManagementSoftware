"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/shared/Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  patients: any[];
  doctors: any[];
}

export default function AppointmentModal({ isOpen, onClose, onSave, patients, doctors }: Props) {
  const [formData, setFormData] = useState({
    patient: "",
    doctor: "",
    appointmentDate: "",
    timeSlot: "",
    type: "OP",
    chiefComplaint: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setFormData({
        patient: "",
        doctor: "",
        appointmentDate: new Date().toISOString().split('T')[0],
        timeSlot: "10:00 AM",
        type: "OP",
        chiefComplaint: "",
      });
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patient || !formData.doctor || !formData.appointmentDate || !formData.timeSlot) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        onSave();
        onClose();
      } else {
        setError(data.error || "Failed to book appointment");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [
    "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl my-8">
        <h2 className="mb-4 text-xl font-display font-semibold text-text">Book Appointment</h2>
        
        {error && <div className="mb-4 text-sm text-danger bg-danger/10 p-3 rounded-md">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="block text-sm font-medium text-text mb-1">Select Doctor *</label>
            <select
              required
              value={formData.doctor}
              onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
              className="flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">-- Select Doctor --</option>
              {doctors.map(d => (
                <option key={d._id} value={d._id}>Dr. {d.name} ({d.speciality || 'General'})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-text mb-1">Date *</label>
              <input
                type="date"
                required
                value={formData.appointmentDate}
                onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                className="flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-text mb-1">Time Slot *</label>
              <select
                required
                value={formData.timeSlot}
                onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                className="flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">-- Select Time --</option>
                {timeSlots.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-text mb-1">Appointment Type *</label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input 
                  type="radio" 
                  name="type"
                  checked={formData.type === "OP"} 
                  onChange={() => setFormData({ ...formData, type: "OP" })}
                  className="text-primary focus:ring-primary h-4 w-4"
                />
                <span className="text-sm font-medium">OP Consultation</span>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="radio" 
                  name="type"
                  checked={formData.type === "Follow-up"} 
                  onChange={() => setFormData({ ...formData, type: "Follow-up" })}
                  className="text-primary focus:ring-primary h-4 w-4"
                />
                <span className="text-sm font-medium">Follow-up</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="block text-sm font-medium text-text mb-1">
              Chief Complaint / Reason
            </label>
            <textarea
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              rows={2}
              value={formData.chiefComplaint}
              onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={loading}>
              Book Appointment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
