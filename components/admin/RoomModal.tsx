"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { Trash2, Plus } from "lucide-react";

interface Bed {
  bedNumber: string;
  isOccupied: boolean;
}

interface RoomData {
  _id?: string;
  roomNumber: string;
  roomType: string;
  type: string;
  floor: string;
  capacity: number;
  totalBeds: number;
  pricePerDay: number;
  beds: Bed[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  initialData?: RoomData | null;
}

export default function RoomModal({ isOpen, onClose, onSave, initialData }: Props) {
  const [formData, setFormData] = useState<RoomData>({
    roomNumber: "",
    roomType: "general",
    type: "general",
    floor: "",
    capacity: 1,
    totalBeds: 1,
    pricePerDay: 0,
    beds: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        roomNumber: "",
        roomType: "general",
        type: "general",
        floor: "",
        capacity: 1,
        totalBeds: 1,
        pricePerDay: 0,
        beds: [],
      });
    }
  }, [initialData, isOpen]);

  // Sync capacity and totalBeds, and type and roomType for backwards compatibility
  const handleCapacityChange = (val: number) => {
    setFormData((prev) => ({ ...prev, capacity: val, totalBeds: val }));
  };

  const handleTypeChange = (val: string) => {
    setFormData((prev) => ({ ...prev, type: val, roomType: val }));
  };

  const handleAddBed = () => {
    setFormData((prev) => ({
      ...prev,
      beds: [...prev.beds, { bedNumber: `${prev.roomNumber}-${prev.beds.length + 1}`, isOccupied: false }],
    }));
  };

  const handleUpdateBed = (index: number, newBedNumber: string) => {
    const newBeds = [...formData.beds];
    newBeds[index].bedNumber = newBedNumber;
    setFormData((prev) => ({ ...prev, beds: newBeds }));
  };

  const handleRemoveBed = (index: number) => {
    const newBeds = [...formData.beds];
    newBeds.splice(index, 1);
    setFormData((prev) => ({ ...prev, beds: newBeds }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = initialData?._id ? `/api/rooms/${initialData._id}` : "/api/rooms";
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
        setError(data.error || "Failed to save room");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl my-8 max-h-[90vh] overflow-y-auto flex flex-col">
        <h2 className="mb-4 text-xl font-display font-semibold text-text">
          {initialData ? "Edit Room" : "Add New Room"}
        </h2>
        
        {error && <div className="mb-4 text-sm text-danger bg-danger/10 p-3 rounded-md">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Room Number *"
              required
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
            />
            <Input
              label="Floor *"
              required
              value={formData.floor}
              onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-text mb-1">Room Type *</label>
              <select
                required
                value={formData.type}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="general">General</option>
                <option value="semi-private">Semi-Private</option>
                <option value="private">Private</option>
                <option value="ICU">ICU</option>
                <option value="therapy">Therapy</option>
              </select>
            </div>
            <Input
              label="Price Per Day (₹) *"
              type="number"
              required
              min={0}
              value={formData.pricePerDay}
              onChange={(e) => setFormData({ ...formData, pricePerDay: Number(e.target.value) })}
            />
          </div>

          <div className="w-full">
            <Input
              label="Bed Capacity *"
              type="number"
              required
              min={1}
              value={formData.capacity}
              onChange={(e) => handleCapacityChange(Number(e.target.value))}
            />
          </div>

          <div className="border border-border rounded-md p-4 bg-surface/30">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-text">Beds Layout</label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddBed} className="py-1 h-8">
                <Plus className="h-3 w-3 mr-1" /> Add Bed
              </Button>
            </div>
            {formData.beds.length === 0 && (
              <p className="text-xs text-text-muted mb-2">
                If no beds are added, {formData.capacity} beds will be auto-generated.
              </p>
            )}
            <div className="space-y-2">
              {formData.beds.map((bed, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input 
                    placeholder="Bed Name / Number"
                    value={bed.bedNumber}
                    onChange={(e) => handleUpdateBed(idx, e.target.value)}
                  />
                  <div className="flex items-center bg-surface px-3 py-2 rounded border border-border">
                    <span className={`text-xs font-medium ${bed.isOccupied ? 'text-danger' : 'text-success'}`}>
                      {bed.isOccupied ? "Occupied" : "Available"}
                    </span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveBed(idx)}
                    className="p-2 text-text-muted hover:text-danger bg-surface rounded border border-border transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={loading}>
              Save Room
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
