"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  patients: any[];
  doctors: any[];
  rooms: any[];
}

export default function AdmissionModal({ isOpen, onClose, onSave, patients, doctors, rooms }: Props) {
  const [formData, setFormData] = useState({
    patient: "",
    admissionType: "IP",
    admittingDoctor: "",
    room: "",
    bed: "",
    diagnosisOnAdmission: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [availableBeds, setAvailableBeds] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        patient: "",
        admissionType: "IP",
        admittingDoctor: "",
        room: "",
        bed: "",
        diagnosisOnAdmission: "",
      });
      setError("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.room) {
      const selectedRoom = rooms.find(r => r._id === formData.room);
      if (selectedRoom) {
        const freeBeds = selectedRoom.beds.filter((b: any) => !b.isOccupied).map((b: any) => b.bedNumber);
        setAvailableBeds(freeBeds);
        setFormData(prev => ({ ...prev, bed: "" }));
      }
    } else {
      setAvailableBeds([]);
    }
  }, [formData.room, rooms]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patient || !formData.admittingDoctor) {
      setError("Please select a patient and a doctor.");
      return;
    }
    if (formData.admissionType === "IP" && (!formData.room || !formData.bed)) {
      setError("Please assign a room and bed for IP admission.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        onSave();
        onClose();
      } else {
        setError(data.error || "Failed to admit patient");
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
        <h2 className="mb-4 text-xl font-display font-semibold text-text">New Admission</h2>
        
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
            <label className="block text-sm font-medium text-text mb-1">Admitting Doctor *</label>
            <select
              required
              value={formData.admittingDoctor}
              onChange={(e) => setFormData({ ...formData, admittingDoctor: e.target.value })}
              className="flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">-- Select Doctor --</option>
              {doctors.map(d => (
                <option key={d._id} value={d._id}>Dr. {d.name} ({d.speciality || 'General'})</option>
              ))}
            </select>
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-text mb-1">Admission Type *</label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input 
                  type="radio" 
                  name="type"
                  checked={formData.admissionType === "IP"} 
                  onChange={() => setFormData({ ...formData, admissionType: "IP" })}
                  className="text-primary focus:ring-primary h-4 w-4"
                />
                <span className="text-sm font-medium">In-Patient (IP)</span>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="radio" 
                  name="type"
                  checked={formData.admissionType === "OP"} 
                  onChange={() => setFormData({ ...formData, admissionType: "OP", room: "", bed: "" })}
                  className="text-primary focus:ring-primary h-4 w-4"
                />
                <span className="text-sm font-medium">Out-Patient (OP)</span>
              </label>
            </div>
          </div>

          {formData.admissionType === "IP" && (
            <div className="grid grid-cols-2 gap-4 p-4 border border-border rounded-md bg-surface/30">
              <div className="w-full">
                <label className="block text-sm font-medium text-text mb-1">Assign Room *</label>
                <select
                  required={formData.admissionType === "IP"}
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Select Room</option>
                  {rooms.map(r => (
                    <option key={r._id} value={r._id}>{r.roomNumber} - {r.type.replace("-", " ")}</option>
                  ))}
                </select>
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium text-text mb-1">Assign Bed *</label>
                <select
                  required={formData.admissionType === "IP"}
                  value={formData.bed}
                  onChange={(e) => setFormData({ ...formData, bed: e.target.value })}
                  disabled={!formData.room || availableBeds.length === 0}
                  className="flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm disabled:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">{availableBeds.length === 0 && formData.room ? "No beds available" : "Select Bed"}</option>
                  {availableBeds.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="flex flex-col">
            <label className="block text-sm font-medium text-text mb-1">
              Diagnosis on Admission (Optional)
            </label>
            <textarea
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              rows={3}
              value={formData.diagnosisOnAdmission}
              onChange={(e) => setFormData({ ...formData, diagnosisOnAdmission: e.target.value })}
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={loading}>
              Admit Patient
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
